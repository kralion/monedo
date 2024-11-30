import { useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import { Info, X } from "lucide-react-native";
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
import { Separator } from "~/components/ui/separator";
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
      <SafeAreaView style={{ paddingTop: headerHeight }}>
        {/* <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        /> */}

        <View className="flex flex-col">
          <View className="flex flex-col gap-6 ">
            <View className="flex flex-row justify-between ">
              <View className="flex flex-col px-4">
                <Text className="text-4xl font-bold mt-8">
                  Editar Presupuesto
                </Text>
                <Text className="text-muted-foreground">
                  Modifica los detalles del presupuesto registrado
                </Text>
              </View>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full m-3"
                onPress={() => router.back()}
              >
                <X color="black" />
              </Button>
            </View>
            <Separator className="text-muted-foreground " />
          </View>
          <ScrollView className="h-screen-safe-offset-2 p-4">
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
                      placeholder="Descripcion sobre el presupuesto del mes"
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
                  <Text>Registrar</Text>
                )}
              </Button>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>

    //   {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
    // <PushNotification /> */}
  );
}
