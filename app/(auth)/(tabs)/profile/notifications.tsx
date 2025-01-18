import Notification from "~/components/notification";
import { INotification } from "@/interfaces";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import * as React from "react";
import { ScrollView } from "react-native";

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
      className="bg-white dark:bg-zinc-900"
    >
      <FlashList
        data={notifications}
        renderItem={({ item }) => <Notification notification={item} />}
        estimatedItemSize={20}
      />
    </ScrollView>
  );
}
