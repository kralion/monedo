import NoData2Svg from "@/assets/svgs/no-data.svg";
import { Budget } from "@/components/wallet/budget";
import { useBudgetContext } from "@/context";

import { FlashList } from "@shopify/flash-list";
import { useFocusEffect } from "expo-router";
import { Info } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { BudgetSkeleton } from "~/components/skeleton/budget";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { IBudget } from "~/interfaces";
import { createClerkSupabaseClient } from "~/lib/supabase";

export default function Wallet() {
  const { budgets, getBudgets, addBudget, getCurrentBudget } =
    useBudgetContext();
  const [budgetFormAvailable, setBudgetFormAvailable] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IBudget>({
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const supabase = createClerkSupabaseClient();
  async function onSubmit(data: IBudget) {
    addBudget({
      ...data,
      amount: Number(data.amount),
    });
    reset();
    setValue;
  }

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getBudgets();
      setLoading(false);

      const channel = supabase.channel("realtime-budgets").on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budgets",
        },
        () => {
          getBudgets();
        }
      );

      return () => {
        channel.unsubscribe();
      };
    }, [])
  );

  useEffect(() => {
    getBudgets();
  }, []);

  useEffect(() => {
    getCurrentBudget().then((budget) => {
      if (budget) {
        setBudgetFormAvailable(false);
      }
    });
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
    >
      <View className="flex flex-col gap-3 rounded-b-xl px-4">
        {budgetFormAvailable && (
          <View className="flex flex-col gap-6 ">
            <View className="flex flex-col gap-1">
              <Label className="text-md">Monto </Label>
              <View className="flex flex-col ">
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^(?:[1-9]\d*|\d+\.\d+|\d+\.\d*[1-9])$/,
                      message: "Monto inválido",
                    },
                  }}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      autoCapitalize="none"
                      className="w-full"
                      value={String(value)}
                      onChangeText={onChange}
                      placeholder="650.00"
                      keyboardType="decimal-pad"
                    />
                  )}
                />
              </View>
            </View>
            <View className="flex flex-col">
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Textarea
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Descripción..."
                  />
                )}
              />
              {errors.description && (
                <View className="flex flex-row gap-1.5 ml-2 mt-2 items-center">
                  <Info color="$red9Light" size={15} />
                  <Text className="text-sm text-destructive">
                    {errors.description.message}
                  </Text>
                </View>
              )}
            </View>
            <Button onPress={handleSubmit(onSubmit)} size="lg">
              {loading ? (
                <ActivityIndicator size={20} color="white" />
              ) : (
                <Text>Registrar</Text>
              )}
            </Button>
          </View>
        )}

        {loading && (
          <View className="flex flex-col gap-2">
            <BudgetSkeleton />
            <BudgetSkeleton />
          </View>
        )}

        <FlashList
          data={budgets}
          estimatedItemSize={100}
          renderItem={({ item }) => <Budget budget={item} />}
          ListEmptyComponent={
            <View className="flex flex-col items-center justify-center  ">
              <NoData2Svg width={150} height={150} />
              <View>
                <Text className="text-center text-xl text-muted-foreground">
                  No hay presupuestos registrados
                </Text>
                <Text className="text-center text-sm text-muted-foreground">
                  Rellena el formulario y registra uno para el mes actual.
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View className="flex flex-row justify-center items-center mt-10">
              <Text className="text-center text-sm text-muted-foreground">
                Podrás crear otro prespuesto al finalizar los 30 dias del
                anterior presupuesto.
              </Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}