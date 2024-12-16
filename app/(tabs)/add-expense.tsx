import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import React from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useExpenseContext } from "~/context";
import { IExpensePOST } from "~/interfaces";

const items = [
  { value: "Hogar" },
  { value: "Transporte" },
  { value: "Salud" },
  { value: "Alimentacion" },
  { value: "Finanzas" },
  { value: "Educación" },
  { value: "Personal" },
  { value: "Casuales" },
];

export default function AddExpense() {
  const { addExpense, loading } = useExpenseContext();
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpensePOST>({
    defaultValues: {
      currency: "Soles",
      amount: 0,
      periodicity: false,
      description: "",
      category: "Hogar",
    },
  });

  async function onSubmit(data: IExpensePOST) {
    addExpense({
      ...data,
      amount: Number(data.amount),
    });
    reset();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ paddingTop: headerHeight }}>
        {/* <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        /> */}

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
                rules={{ required: true }}
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
                                label={item.value}
                                key={i}
                                value={item.value.toLowerCase()}
                              >
                                {item.value}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <Text className="text-red-500 text-xs">
                        {errors.category.message}
                      </Text>
                    )}
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
                      placeholder="65.00"
                    />
                  )}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^(?:[1-9]\d*|\d+\.\d+|\d+\.\d*[1-9])$/,
                      message: "Monto inválido",
                    },
                  }}
                />
                {errors.amount && (
                  <Text className="text-red-500 text-xs">
                    {errors.amount.message}
                  </Text>
                )}
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
                    <View className="flex-row justify-between items-center ">
                      <Label
                        nativeID="periodicity"
                        className="tracking-tight"
                        onPress={() => {
                          onChange(!value);
                        }}
                      >
                        Gasto Recurrente
                      </Label>
                      <View className="flex flex-row items-center gap-2">
                        <Text className="text-muted-foreground">No</Text>

                        <Switch
                          checked={value}
                          onCheckedChange={onChange}
                          nativeID="periodicity"
                        />
                        <Text className="text-muted-foreground">Sí</Text>
                      </View>
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
              <View className="flex flex-col gap-4">
                <Button onPress={handleSubmit(onSubmit)} size="lg">
                  {loading ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    <Text>Registrar</Text>
                  )}
                </Button>
                <Button
                  onPress={() => {
                    reset();
                    router.push("/(tabs)");
                  }}
                  size="lg"
                  variant="outline"
                >
                  <Text className="text-red-500">Cancelar</Text>
                </Button>
              </View>
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
