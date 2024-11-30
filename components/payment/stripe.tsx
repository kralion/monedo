import { usePremiumStatusContext } from "@/context";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { Loader } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { router } from "expo-router";

interface ICard {
  cardNumber: string;
  cvc: string;
  expiracion: string;
  monto: string;
  divisa: string;
  mensaje: string;
}

export default function Stripe() {
  const { setIsPremium } = usePremiumStatusContext();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user: userData } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICard>({
    defaultValues: {
      divisa: "pen",
    },
  });

  async function updateUserRole(userId: string | undefined) {
    const { error } = await supabase
      .from("usuarios")
      .update({ rol: "free" })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
    }
  }
  async function onSubmit(data: ICard) {
    setIsLoading(true);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setMonth(createdAt.getMonth() + 1);
    const { error } = await supabase.from("payments").insert({
      usuario_id: userData?.id,
      created_At: createdAt.toISOString(),
      expires_At: expiresAt.toISOString(),
      card_data: JSON.stringify(data),
    });

    await updateUserRole("972cf283-22e9-4224-bb76-3d5805884f1b");
    if (error) {
      console.error("Error inserting payment:", error);
    }
    setIsPremium(true);
    reset();
    setIsLoading(false);
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/(tabs)");
    }, 3000);
  }

  return (
    <View className="flex flex-col py-3 gap-4">
      {showConfetti && (
        <ConfettiCannon autoStart count={200} origin={{ x: 50, y: 50 }} />
      )}
      <View className="flex flex-col gap-3 ">
        <View className="flex flex-col gap-1">
          <Text>Número de Tarjeta</Text>

          <Controller
            name="cardNumber"
            rules={{
              required: {
                value: true,
                message: "Ingrese el número de tarjeta",
              },
              pattern: {
                value: /^\d+(\.\d*)?$/,
                message: "Solo caracteres válidos",
              },
            }}
            control={control}
            render={({ field }) => (
              <Input
                autoCapitalize="none"
                className="py-3 flex-1"
                placeholder="1234 1234 1234 1234"
                {...field}
                keyboardType="number-pad"
              />
            )}
          />
        </View>

        <View className="flex flex-col gap-1">
          <Text>CVC / CVV</Text>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={(value) => {
                  if (value.length === 2 && !value.includes("/")) {
                    onChange(value + "/");
                  } else {
                    onChange(value);
                  }
                }}
                value={value}
                placeholder="123"
                autoCapitalize="none"
                className="py-3 flex-1"
                keyboardType="number-pad"
              />
            )}
            name="cvc"
            rules={{
              required: {
                value: true,
                message: "Ingrese el CVC/CVV de la tarjeta",
              },
              pattern: {
                value: /^\d+(\.\d*)?$/,
                message: "Solo caracteres válidos",
              },
            }}
          />
        </View>
        <View className="flex flex-col gap-1">
          <Text>Fecha Expiración</Text>
          <Controller
            name="expiracion"
            rules={{
              required: {
                value: true,
                message: "Ingrese la fecha de expiración",
              },
              pattern: {
                value: /^\d+(\.\d*)?$/,
                message: "Solo caracteres válidos",
              },
            }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={(value) => {
                  if (value.length === 2 && !value.includes("/")) {
                    onChange(value + "/");
                  } else {
                    onChange(value);
                  }
                }}
                value={value}
                placeholder="MM/YY"
                autoCapitalize="none"
                className="py-3 flex-1"
                keyboardType="number-pad"
              />
            )}
          />
        </View>
        <Button variant="outline" className="font-bold" size="lg">
          <Text>S/. 15.00</Text>
        </Button>
      </View>

      <Button onPress={() => setShowConfetti(true)} size="lg" className="mt-5">
        {isLoading ? (
          <Loader className="animate-spin text-white" size={20} />
        ) : (
          <Text>Realizar Compra</Text>
        )}
      </Button>
    </View>
  );
}
