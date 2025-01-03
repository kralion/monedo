import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import AddExpenseSuccesModal from "~/components/add-expense-sucess";
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
  const [openModal, setOpenModal] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpensePOST>({
    defaultValues: {
      currency: "Soles",
      amount: amount,
      periodicity: false,
      description: "",
      category: "Hogar",
    },
  });

  async function onSubmit(data: IExpensePOST) {
    addExpense({
      ...data,
      amount,
    });
    setOpenModal(true);
    reset();
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="h-screen-safe-offset-2 "
        contentInsetAdjustmentBehavior="automatic"
      >
        <AddExpenseSuccesModal
          expensePrice={amount.toFixed(2)}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />

        <View className="flex flex-col">
          <View className="flex flex-col gap-6 ">
            <View className="flex flex-col px-4 pt-7">
              <Text className="text-4xl font-bold ">Nuevo Gasto</Text>
              <Text className="text-muted-foreground">
                Ingresa los detalles del gasto que hiciste
              </Text>
            </View>
            <Separator className="text-muted-foreground " />
          </View>

          <View className="flex flex-col gap-6 p-4">
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

              <Input
                inputMode="decimal"
                onChangeText={(e) => {
                  setAmount(Number(e));
                }}
                value={String(amount)}
                placeholder="65.00"
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
                      fecha en la que fue creado inicialmente, en este caso cada{" "}
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
        </View>
        {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
      </ScrollView>
    </KeyboardAvoidingView>
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
