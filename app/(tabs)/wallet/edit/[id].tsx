import { useBudgetContext } from "@/context";
import { IBudget, IExpense } from "@/interfaces";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { Info } from "lucide-react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";

export default function EditExpense() {
  const params = useLocalSearchParams<{ id: string }>();
  const supabase = createClerkSupabaseClient();
  const { updateBudget } = useBudgetContext();
  const [currentBudget, setCurrentBudget] = React.useState({} as IBudget);
  const [isLoading, setIsLoading] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IBudget>({
    defaultValues: {
      description: currentBudget.description,
      amount: currentBudget.amount,
    },
  });

  async function getBudgetById(id: string) {
    const { data, error } = await supabase
      .from("budget")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setCurrentBudget(data);
    return data;
  }

  async function onSubmit(data: IBudget) {
    setIsLoading(true);
    try {
      updateBudget({
        ...data,
        id: params.id,
      });
    } catch (error) {
      console.log(error);
    }
    setValue("amount", 0);
    setIsLoading(false);
    // setOpenModal(true);
  }

  useEffect(() => {
    if (params.id) {
      getBudgetById(params.id);
    }
  }, [params.id]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className="h-screen-safe-offset-2 p-4"
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView style={{ paddingTop: headerHeight }}>
          {/* <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        /> */}

          <View className="flex flex-col">
            <View className="flex flex-col gap-6 ">
              <View className="flex flex-col gap-1">
                <Label className="text-md">Monto </Label>
                <View className="flex flex-col ">
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Ingrese el monto",
                      },
                      pattern: {
                        value: /^\d+(\.\d*)?$/,
                        message: "Solo números",
                      },
                    }}
                    name="amount"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        autoCapitalize="none"
                        className="w-full"
                        // value={String(value)}
                        onChangeText={onChange}
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
                      placeholder={expense}
                    />
                  )}
                />
                {errors.description && (
                  <View className="flex flex-row gap-1.5 ml-2 mt-2 items-center">
                    <Info color="red" size={15} />
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
                  <Text>Guardar Cambios</Text>
                )}
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>

    //   {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
    // <PushNotification /> */}
  );
}
