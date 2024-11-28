import AddExpenseSuccesModal from "@/components/popups/add-expense-sucess";
import { useExpenseContext } from "@/context";
import { IExpense } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { Loader } from "lucide-react-native";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";

const items = [
  { name: "Alimentacion" },
  { name: "Bebidas" },
  { name: "Alquiler" },
  { name: "Transporte" },
  { name: "Servicios" },
  { name: "Otros" },
];
export default function AddExpense() {
  const { user: userData } = useUser();
  const { addExpense } = useExpenseContext();
  const [openModal, setOpenModal] = React.useState(false);
  const [expensePrice, setExpensePrice] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpense>();

  async function onSubmit(data: IExpense) {
    setIsLoading(true);
    addExpense({
      ...data,
      usuario_id: userData?.id,
    });
    setExpensePrice(data.monto.toString());
    reset();

    setValue("categoria", "");
    setIsLoading(false);
    setOpenModal(true);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
        <SafeAreaView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View className="flex flex-col gap-6">
            <View className="flex flex-col">
              <Text className="text-3xl">Nuevo Gasto</Text>
              <Text>Ingresa los detalles del gasto que hiciste</Text>
            </View>
            <View className="flex flex-col gap-2">
              <Controller
                name="categoria"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-col">
                    <Label>Categoría</Label>
                    <Select onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {useMemo(
                            () =>
                              items.map((item, i) => {
                                return (
                                  <SelectItem
                                    label={item.name}
                                    key={item.name}
                                    value={item.name.toLowerCase()}
                                  >
                                    {item.name}
                                  </SelectItem>
                                );
                              }),
                            [items]
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </View>
                )}
              />

              <View className="flex flex-col">
                <Label>Monto</Label>

                <Controller
                  control={control}
                  name="monto"
                  render={({ ...field }) => (
                    <Input inputMode="decimal" placeholder="65.00" {...field} />
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
              {/* <YStack>
                <Label color="$gray10">Divisa</Label>

                <Controller
                  name="divisa"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup value={value} name="currency">
                      <XStack gap="$6">
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="pen" id="pen">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="pen" color="$gray10">
                            Soles
                          </Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="usd" id="usd">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="pen" color="$gray10">
                            Dólares
                          </Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="eur" id="eur">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="eur" color="$gray10">
                            Euros
                          </Label>
                        </XStack>
                      </XStack>
                    </RadioGroup>
                  )}
                />
              </YStack> */}
              <Controller
                control={control}
                name="descripcion"
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
              {/* <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <YStack space={3}>
                    <XStack
                      gap="$4"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text> Es un gasto recurrente ?</Text>
                      <XStack width={200} alignItems="center" gap="$4">
                        <Label
                          paddingRight="$0"
                          minWidth={90}
                          justifyContent="flex-end"
                          htmlFor="recurrent"
                        >
                          Accept
                        </Label>
                        <Separator minHeight={20} vertical />
                        <Switch id="recurrent">
                          <Switch.Thumb animation="quicker" />
                        </Switch>
                      </XStack>
                    </XStack>
                    {value && (
                      <Text className="text-textmuted text-xs">
                        La recurrencia del gasto se hará efectivo cada mes en la
                        fecha en la que fue creado inicialmente, en este caso
                        cada{" "}
                        <Text className="font-bold text-black">
                          {new Date().toLocaleDateString("es-PE", {
                            day: "numeric",
                          })}
                        </Text>{" "}
                        de cada mes
                      </Text>
                    )}
                  </YStack>
                )}
                name="periodicidad"
                defaultValue={false}
              /> */}
              <Button
                onPress={handleSubmit(onSubmit)}
                size="lg"
                className="mt-5"
              >
                {isLoading ? (
                  <Loader className="animate-spin text-white" size={20} />
                ) : (
                  "Registrar"
                )}
              </Button>
            </View>
          </View>
          {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
