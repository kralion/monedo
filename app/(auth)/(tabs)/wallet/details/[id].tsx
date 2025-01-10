import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useBudgetContext } from "~/context";
import { createClerkSupabaseClient } from "~/lib/supabase";

export default function BudgetDetails() {
  const { deleteBudget, budget, getBudgetById, loading } = useBudgetContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const params = useLocalSearchParams<{ id: string }>();
  const supabase = createClerkSupabaseClient();
  const handleDeleteBudget = async (id: string) => {
    deleteBudget(id);
    router.push("/(auth)/(tabs)/wallet");
    setIsOpen(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (params.id) {
        getBudgetById(params.id);

        const channel = supabase.channel(`budgets:id=eq.${params.id}`).on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "budgets",
            filter: `id=eq.${params.id}`,
          },
          () => {
            getBudgetById(params.id);
          }
        );

        return () => {
          channel.unsubscribe();
        };
      }
    }, [params.id])
  );

  if (!budget) return null;

  const createdDate = new Date(budget.created_At);
  const futureDate = new Date(createdDate);
  futureDate.setDate(createdDate.getDate() + 30);

  const formattedDate = futureDate.toLocaleDateString("es-PE", {
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900"
    >
      {loading && (
        <View className="flex flex-col justify-center items-center min-h-full">
          <ActivityIndicator size="large" />
        </View>
      )}
      <View className="flex flex-col gap-4 p-4">
        <ScrollView>
          <View className="flex flex-col gap-8">
            <View className="flex flex-col gap-4">
              <Image
                width={100}
                height={100}
                className="bg-brand/20 rounded-full p-4"
                source={{
                  uri: "https://img.icons8.com/?size=300&id=yUTNKgUuTlsA&format=png&color=000000",
                }}
              />
              <View className="flex flex-col">
                <Text className="text-5xl tracking-tighter font-bold">
                  S/. {budget.amount}
                </Text>
              </View>
              <Separator className="text-muted-foreground" />
              <Text className="text-lg text-muted-foreground ">
                {budget.description}
              </Text>
            </View>

            <Separator className="text-muted-foreground" />
            <View className="flex flex-col gap-2">
              <View className="flex flex-col gap-4">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Fecha Registro</Text>
                  <Text>
                    {new Date(budget.created_At).toLocaleDateString("es-PE", {
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">
                    Fecha Expiración
                  </Text>
                  <Text>{formattedDate}</Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Hora</Text>
                  <Text>
                    {new Date(budget.created_At).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
