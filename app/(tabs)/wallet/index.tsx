import { Budget } from "@/components/wallet/budget";
import { useBudgetContext } from "@/context";
import { useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { ChevronUp, Inbox, Info } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { createClerkSupabaseClient } from "~/lib/supabase";

type TBudget = {
  amount: number;
  description: string;
};

export default function Wallet() {
  const [showSavingGoalModal, setShowSavingGoalModal] = useState(false);
  const { budgets, getRecentBudgets } = useBudgetContext();
  const supabase = createClerkSupabaseClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TBudget>({
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  async function onSubmit(data: TBudget) {
    setIsLoading(true);
    await supabase.from("budgets").insert(data);
    setIsLoading(false);
    // toast.show("Meta registrada correctamente");
    reset();
    setValue;
  }

  useEffect(() => {
    if (user) {
      getRecentBudgets(user.id);
    }
  }, [user, getRecentBudgets]);

  const [budgetFormAvailable, setBudgetFormAvailable] = useState(true);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler.value > 5 ? withTiming(1) : withTiming(0),
    };
  });
  function scrollToTop() {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }
  const headerHeight = useHeaderHeight();

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        style={{
          paddingHorizontal: 16,
          minHeight: "100%",
        }}
      >
        <View className="flex flex-col gap-3 rounded-b-xl ">
          {/* TODO: Hide this Form if the user has already budgeted for the
          current month. */}
          {budgetFormAvailable && (
            <>
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
                          // value={String(value)}
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
                        placeholder="Descripció..."
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
                  {isLoading ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    <Text>Registrar</Text>
                  )}
                </Button>
              </View>

              {/* <SavingGoalModal
                openModal={showSavingGoalModal}
                setOpenModal={setShowSavingGoalModal}
              /> */}
            </>
          )}
          <React.Suspense
            fallback={
              <ActivityIndicator size="large" className="mx-auto mt-5 " />
            }
          >
            {budgets && budgets.length > 0 ? (
              <FlashList
                data={budgets}
                estimatedItemSize={100}
                renderItem={({ item }) => <Budget budget={item} />}
              />
            ) : (
              <View className="flex flex-col items-center justify-center gap-2 mt-10">
                <Inbox size={100} color="gray" strokeWidth={1} />
                <View>
                  <Text className="text-center text-xl text-muted-foreground">
                    No hay presupuestos
                  </Text>
                  <Text className="text-center text-sm text-muted-foreground">
                    Completa el formulario y registra uno.
                  </Text>
                </View>
              </View>
            )}
          </React.Suspense>
        </View>
      </ScrollView>
      <Animated.View
        style={[
          buttonStyle,
          {
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
          },
        ]}
      >
        <Button className="rounded-full" onPress={scrollToTop} size="icon">
          <ChevronUp />
        </Button>
      </Animated.View>
    </View>
  );
}
