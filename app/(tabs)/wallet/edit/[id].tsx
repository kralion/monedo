import { useBudgetContext } from "@/context";
import { IBudget } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { Info } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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
  const { user } = useUser();
  const { updateBudget, budget, deleteBudget } = useBudgetContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IBudget>({
    defaultValues: {
      amount: budget.amount,
      description: budget.description,
    },
  });

  const onDelete = (id: string) => {
    Alert.alert("Eliminar gasto", "¿Estás seguro?", [
      {
        text: "Sí",
        onPress: () => {
          deleteBudget(id);
          router.push("/(tabs)/wallet");
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  async function onSubmit(data: IBudget) {
    setIsLoading(true);
    try {
      updateBudget({
        ...data,
        id: params.id,
        user_id: user?.id ? user.id : "",
        amount: Number(data.amount),
      });
    } catch (error) {
      console.log(error);
      reset();
    }
    setIsLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className="h-screen-safe-offset-2 p-4"
        contentInsetAdjustmentBehavior="automatic"
      >
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
                      value={String(value)}
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
            <Button
              variant="destructive"
              onPress={() => {
                onDelete(params.id);
              }}
              size="lg"
            >
              {isLoading ? (
                <ActivityIndicator size={20} color="white" />
              ) : (
                <Text>Eliminar Gasto</Text>
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>

    //   {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
    // <PushNotification /> */}
  );
}
