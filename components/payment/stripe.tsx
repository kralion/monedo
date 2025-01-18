import { useUser } from "@clerk/clerk-expo";
import { Loader } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "../ui/button";
import type { ConfettiMethods } from "react-native-fast-confetti";
import { Confetti } from "react-native-fast-confetti";
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
  const [showConfetti, setShowConfetti] = React.useState(false);
  const confettiRef = React.useRef<ConfettiMethods>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useUser();
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

  async function onSubmit(data: ICard) {
    setIsLoading(true);
    user?.update({
      unsafeMetadata: {
        plan: "premium",
      },
    });
    reset();
    setIsLoading(false);
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/(auth)/(tabs)");
    }, 3000);
  }

  return (
    <View className="flex flex-col py-3 gap-4">
      {showConfetti && (
        <Confetti
          ref={confettiRef}
          autoplay={true}
          radiusRange={[0, 15]}
          sizeVariation={0.5}
          flakeSize={{ width: 15, height: 10 }}
          count={500}
        />
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
        <Button variant="outline" disabled className="font-bold" size="lg">
          <Text className="text-black dark:text-black">S/. 15.00</Text>
        </Button>
      </View>

      <Button onPress={handleSubmit(onSubmit)} size="lg" className="mt-5">
        {isLoading ? (
          <Loader className="animate-spin text-white" size={20} />
        ) : (
          <Text>Realizar Compra</Text>
        )}
      </Button>
    </View>
  );
}
