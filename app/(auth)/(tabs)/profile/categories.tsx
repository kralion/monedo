import { createClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { ChevronRight } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ICategory } from "~/interfaces/category";

export default function Categories() {
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  async function getCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user?.id);
    setCategories(data as ICategory[]);
    return data;
  }
  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="bg-white dark:bg-zinc-900"
    >
      <FlashList
        data={categories}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 mb-2 rounded-lg border border-border dark:border-zinc-800 bg-card dark:bg-zinc-700">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: item.color }}
              />
              <View>
                <Text className="text-lg font-medium">{item.label}</Text>
                <Text className="text-sm text-muted-foreground">
                  {item.value}
                </Text>
              </View>
            </View>
            <Button variant="ghost" size="icon">
              <ChevronRight size={20} color="gray" />
            </Button>
          </View>
        )}
        estimatedItemSize={80}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </ScrollView>
  );
}
