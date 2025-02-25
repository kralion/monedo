import Notification from "~/components/notification";
import { INotification } from "@/interfaces";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  const getNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user?.id);
    if (error) {
      console.log(error);
      return;
    }
    setNotifications(data);
  };

  React.useEffect(() => {
    getNotifications();
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
    >
      <View className="flex-1">
        <FlashList
          data={notifications}
          renderItem={({ item }) => <Notification notification={item} />}
          estimatedItemSize={320}
        />
      </View>
    </ScrollView>
  );
}
