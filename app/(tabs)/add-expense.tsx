import AddExpenseSuccesModal from "@/components/popups/add-expense-sucess";
import { useExpenseContext } from "@/context";
import { IExpense } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { Loader, Scroll } from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useHeaderHeight } from "@react-navigation/elements";
import { createClerkSupabaseClient } from "~/lib/supabase";
import { router } from "expo-router";
import { Separator } from "~/components/ui/separator";

interface IGasto {
  description: string;
  amount: number;
  category: {
    label: string;
    value: string;
  };
  periodicity: boolean;
  currency: string;
}

const items = [
  { name: "Alimentacion" },
  { name: "Bebidas" },
  { name: "Alquiler" },
  { name: "Transporte" },
  { name: "Servicios" },
  { name: "Otros" },
];

export default function AddExpense() {
  const supabase = createClerkSupabaseClient();
  const [openModal, setOpenModal] = React.useState(false);
  const [expensePrice, setExpensePrice] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IGasto>();

  async function onSubmit(data: IGasto) {
    setIsLoading(true);
    try {
      await supabase.from("expenses").insert({
        ...data,
        category: data.category.value,
      });
    } catch (error) {
      console.log(error);
    }
    setValue("category", {
      label: "",
      value: "",
    });
    setValue("amount", 0);
    setValue("currency", "Soles");
    setValue("periodicity", false);
    setIsLoading(false);
    // setOpenModal(true);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ paddingTop: headerHeight }}>
        <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />

        <View className="flex flex-col">
          <View className="flex flex-col gap-6">
            <View className="flex flex-col px-4">
              <Text className="text-4xl font-bold mt-8">Nuevo Gasto</Text>
              <Text className="text-muted-foreground">
                Ingresa los detalles del gasto que hiciste
              </Text>
            </View>
            <Separator className="text-muted-foreground " />
          </View>
          <ScrollView className="h-screen-safe-offset-2 px-4">
            <View className="flex flex-col gap-6 pt-6">
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-col gap-2">
                    <Label>Categoría</Label>
                    <Select onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>

                      <SelectContent className="w-[90%]">
                        <SelectGroup>
                          {items.map((item, i) => {
                            return (
                              <SelectItem
                                label={item.name}
                                key={item.name}
                                value={item.name.toLowerCase()}
                              >
                                {item.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </View>
                )}
              />

              <View className="flex flex-col gap-2">
                <Label>Monto</Label>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      inputMode="decimal"
                      onChangeText={onChange}
                      value={String(value)}
                      defaultValue=""
                      placeholder="65.00"
                    />
                  )}
                  rules={{
                    required: { value: true, message: "Ingrese el monto" },
                    pattern: {
                      value: /^\d+(\.\d*)?$/,
                      message: "Solo se permiten números válidos",
                    },
                  }}
                />
              </View>
              <View className="flex flex-col gap-2">
                <Label>Divisa</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      className="flex flex-row gap-3"
                    >
                      <RadioGroupItemWithLabel
                        value="Soles"
                        onLabelPress={() => {
                          setValue("currency", "Soles");
                        }}
                      />
                      <RadioGroupItemWithLabel
                        value="Dólares"
                        onLabelPress={() => {
                          setValue("currency", "Dólares");
                        }}
                      />
                      <RadioGroupItemWithLabel
                        value="Euros"
                        onLabelPress={() => {
                          setValue("currency", "Euros");
                        }}
                      />
                    </RadioGroup>
                  )}
                />
              </View>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Textarea
                    autoCapitalize="none"
                    onChangeText={onChange}
                    placeholder="Descripcion..."
                    value={value}
                  />
                )}
                defaultValue=""
              />
              <Controller
                control={control}
                name="periodicity"
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-col gap-4">
                    <View className="flex-row items-center gap-4">
                      <Label
                        nativeID="periodicity"
                        className="tracking-tight"
                        onPress={() => {
                          onChange(!value);
                        }}
                      >
                        Gasto Recurrente
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        nativeID="airplane-mode"
                      />
                    </View>
                    {value && (
                      <Text className="text-muted-foreground text-sm">
                        La recurrencia del gasto se hará efectivo cada mes en la
                        fecha en la que fue creado inicialmente, en este caso
                        cada{" "}
                        <Text className="font-bold ">
                          {new Date().toLocaleDateString("es-PE", {
                            day: "numeric",
                          })}
                        </Text>{" "}
                        de cada mes.
                      </Text>
                    )}
                  </View>
                )}
                defaultValue={false}
              />
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
        {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className="flex-row gap-2 items-center">
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}
