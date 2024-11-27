import { usePremiumStatusContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import { CreditCard } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import ConfettiCannon from "react-native-confetti-cannon";
import {
  Button,
  Input,
  SizableText,
  Spinner,
  Text,
  XStack,
  YStack,
  styled,
  useTheme,
} from "tamagui";

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
  const router = useRouter();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user: userData } = useUser();
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";
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
  const StyledXStack = styled(XStack, {
    backgroundColor: isDarkMode ? "$gray8" : "$gray4",
    borderRadius: "$4",
    alignItems: "center",
    px: "$2",
    mt: "$2",
    pr: "$4",
  });
  const inputIconColor = isDarkMode ? "$gray5" : "$gray9";
  const placeholderTextColor = isDarkMode ? "$gray5" : "$gray9";
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
      router.push("/(monex)");
    }, 3000);
  }

  return (
    <YStack py="$3" gap="$4">
      {showConfetti && (
        <ConfettiCannon autoStart count={200} origin={{ x: 50, y: 50 }} />
      )}
      <YStack gap="$3">
        <YStack gap="$1">
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
              <StyledXStack>
                <Input
                  size="$5"
                  autoCapitalize="none"
                  borderRadius={0}
                  placeholder="1234 1234 1234 1234"
                  py={3}
                  placeholderTextColor={placeholderTextColor}
                  flex={1}
                  {...field}
                  backgroundColor="transparent"
                  keyboardType="number-pad"
                />
                <XStack opacity={0.5}>
                  <SizableText color={inputIconColor}>
                    <CreditCard />
                  </SizableText>
                </XStack>
              </StyledXStack>
            )}
          />
        </YStack>

        <YStack gap="$1">
          <Text>CVC / CVV</Text>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <StyledXStack>
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
                  size="$5"
                  autoCapitalize="none"
                  borderRadius={0}
                  py={3}
                  placeholderTextColor={placeholderTextColor}
                  flex={1}
                  backgroundColor="transparent"
                  keyboardType="number-pad"
                />
              </StyledXStack>
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
        </YStack>
        <YStack gap="$1">
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
              <StyledXStack>
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
                  size="$5"
                  autoCapitalize="none"
                  borderRadius={0}
                  py={3}
                  placeholderTextColor={placeholderTextColor}
                  flex={1}
                  backgroundColor="transparent"
                  keyboardType="number-pad"
                />
              </StyledXStack>
            )}
          />
        </YStack>
        <Button
          disabled
          chromeless
          variant="outlined"
          size="$5"
          fontWeight="bold"
        >
          S/. 15.00
        </Button>
      </YStack>

      <Button
        onPress={() => setShowConfetti(true)}
        size="$5"
        bg="$green9Light"
        color="$white1"
        mt="$5"
        mb="$12"
      >
        {isLoading ? (
          <Spinner size="small" color="$white1" />
        ) : (
          "Realizar Compra"
        )}
      </Button>
    </YStack>
  );
}
