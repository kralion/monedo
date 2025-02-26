import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";
import { useBudgetStore } from "~/stores/budget";

export default function BudgetDetails() {
  const { budget, getBudgetById, loading } = useBudgetStore();
  const params = useLocalSearchParams<{ id: string }>();
  useFocusEffect(
    React.useCallback(() => {
      if (params.id) {
        getBudgetById(Number(params.id));

        const channel = supabase.channel(`budgets:id=eq.${params.id}`).on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "budgets",
            filter: `id=eq.${params.id}`,
          },
          () => {
            getBudgetById(Number(params.id));
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
      className="bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
    >
      {loading && (
        <View className="flex flex-col justify-center items-center min-h-full">
          <ActivityIndicator size="large" />
        </View>
      )}
      <View className="flex flex-col gap-4 p-4">
        <ScrollView>
          <View className="flex flex-col gap-8">
            <Animated.View
              className="flex flex-col gap-4 items-center"
              entering={FadeInDown.duration(300).delay(200)}
            >
              <Image
                width={100}
                height={100}
                className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-4"
                source={{
                  uri: "https://img.icons8.com/?size=300&id=yUTNKgUuTlsA&format=png&color=000000",
                }}
              />
              <View className="flex flex-col">
                <Text className="text-5xl tracking-tighter font-bold">
                  S/ {budget.amount}
                </Text>
              </View>
              <View className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 w-full">
                <Text className="text-lg text-muted-foreground ">
                  {budget.description}
                </Text>
              </View>
            </Animated.View>

            <View className="flex flex-col gap-2  bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
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
