import * as React from "react";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePaymentStore } from "~/stores/payment";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";

type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "El número de tarjeta es requerido")
    .refine((val) => {
      const number = val.replace(/\s/g, "");
      return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/.test(
        number
      );
    }, "Número de tarjeta inválido"),
  cvc: z
    .string()
    .min(1, "El CVC es requerido")
    .refine(
      (val) => /^[0-9]{3,4}$/.test(val),
      "El CVC debe tener 3 o 4 dígitos"
    ),
  expiracion: z
    .string()
    .min(1, "La fecha de expiración es requerida")
    .refine((val) => {
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(val)) return false;
      const [month, year] = val.split("/").map(Number);
      const now = new Date();
      const expiry = new Date(2000 + year, month - 1);
      return expiry > now;
    }, "Fecha de expiración inválida"),
});

type CardFormData = z.infer<typeof cardSchema>;

const detectCardType = (number: string): CardType => {
  const cleanNumber = number.replace(/\s/g, "");
  if (/^4/.test(cleanNumber)) return "visa";
  if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
  if (/^3[47]/.test(cleanNumber)) return "amex";
  if (/^6(?:011|5[0-9]{2})/.test(cleanNumber)) return "discover";
  return "unknown";
};

export default function Stripe() {
  const { user } = useUser();
  const { addPayment, isLoading } = usePaymentStore();
  const [cardType, setCardType] = React.useState<CardType>("unknown");
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      cvc: "",
      expiracion: "",
    },
  });

  const handleCardNumberChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    let number = value.replace(/\D/g, "");
    const detected = detectCardType(number);
    setCardType(detected);

    if (detected === "amex") {
      number = number.slice(0, 15);
      number = number.replace(/(\d{4})(\d{6})(\d{5})?/, "$1 $2 $3").trim();
    } else {
      number = number.slice(0, 16);
      number = number.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }

    onChange(number);
  };

  const handleExpirationChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    let expiry = value.replace(/\D/g, "");

    if (expiry.length >= 2) {
      const month = parseInt(expiry.slice(0, 2));
      if (month > 12) expiry = "12" + expiry.slice(2);
      expiry = expiry.slice(0, 2) + "/" + expiry.slice(2, 4);
    }

    onChange(expiry);
  };

  async function onSubmit(data: CardFormData) {
    if (!user?.id) {
      toast.error("Error: Usuario no encontrado");
      return;
    }

    try {
      await addPayment({
        amount: 20,
        card_last4: data.cardNumber.replace(/\s/g, "").slice(-4),
        card_type: cardType,
        status: "success",
        plan: "premium",
        user_id: user.id,
      });

      await user.update({
        unsafeMetadata: {
          plan: "premium",
        },
      });

      reset();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error al procesar el pago");
    }
  }

  return (
    <div className="flex flex-col py-3 gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Text>
            Número de Tarjeta{" "}
            {cardType !== "unknown" && `(${cardType.toUpperCase()})`}
          </Text>

          <Controller
            name="cardNumber"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className={`py-3 flex-1 ${
                  errors.cardNumber ? "border-red-500" : ""
                }`}
                placeholder="1234 1234 1234 1234"
                onChange={(e) =>
                  handleCardNumberChange(e.target.value, onChange)
                }
                onBlur={onBlur}
                value={value}
                type="text"
                maxLength={cardType === "amex" ? 17 : 19}
              />
            )}
          />
          {errors.cardNumber && (
            <Text className="text-red-500">{errors.cardNumber.message}</Text>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Text>CVC / CVV</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) =>
                  onChange(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                onBlur={onBlur}
                value={value}
                placeholder={cardType === "amex" ? "1234" : "123"}
                className={`py-3 flex-1 ${errors.cvc ? "border-red-500" : ""}`}
                type="text"
                maxLength={cardType === "amex" ? 4 : 3}
              />
            )}
            name="cvc"
          />
          {errors.cvc && (
            <Text className="text-red-500">{errors.cvc.message}</Text>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Text>Fecha Expiración</Text>
          <Controller
            name="expiracion"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onChange={(e) =>
                  handleExpirationChange(e.target.value, onChange)
                }
                onBlur={onBlur}
                value={value}
                placeholder="MM/YY"
                className={`py-3 flex-1 ${
                  errors.expiracion ? "border-red-500" : ""
                }`}
                type="text"
                maxLength={5}
              />
            )}
          />
          {errors.expiracion && (
            <Text className="text-red-500">{errors.expiracion.message}</Text>
          )}
        </div>

        <Button
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="mt-4"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Text className="text-white">Pagar</Text>
          )}
        </Button>
      </div>
    </div>
  );
}
