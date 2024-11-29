import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { useExpenseContext } from "@/context";
import { IExpense } from "@/interfaces";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { Loader } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

const items = [
  { name: "Alimentacion" },
  { name: "Bebidas" },
  { name: "Alquiler" },
  { name: "Transporte" },
  { name: "Servicios" },
  { name: "Otros" },
];
export default function EditExpense() {
  const { user: userData } = useUser();
  const params = useLocalSearchParams<{ id: string }>();
  const { updateExpense } = useExpenseContext();
  const [expense, setExpense] = React.useState({} as IExpense);
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
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function getExpenseById(id: string) {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setExpense(data);
    return data;
  }

  async function onSubmit(data: IExpense) {
    setIsLoading(true);
    try {
      await updateExpense({
        ...data,
        usuario_id: userData?.id,
        id: params.id,
      });
      setIsLoading(false);
      // toast.show("Gasto actualizado correctamente");
      setOpenModal(true);
      reset();
      setValue("categoria", "");
    } catch (error) {
      // toast.show("Error al actualizar el gasto");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) {
      getExpenseById(params.id);
    }
  }, [params.id]);
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.categoria
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  return (
    <ScrollView className="p-4 min-h-screen-safe">
      {expense.monto ? (
        <View className="flex flex-col gap-5">
          <View className="flex flex-col gap-1">
            <View className="flex flex-row gap-1">
              <Image
                width={45}
                height={45}
                source={{
                  uri: assetIndentificador,
                }}
              />

              <Text className="pt-1">Gasto en {expense.categoria}</Text>
            </View>
            <Text className="ml-1.5">
              Modifica los detalles del gasto seleccionado
            </Text>
          </View>
          <View>
            <Controller
              name="categoria"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col">
                  <Label className="text-foreground" nativeID="categoria">
                    Categoría
                  </Label>
                  <Select
                    defaultValue={{
                      label: expense.categoria,
                      value: expense.categoria,
                    }}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>

                    <SelectContent insets={contentInsets} className="w-[250px]">
                      <SelectGroup>
                        <SelectLabel>Categoria</SelectLabel>
                        {useMemo(
                          () =>
                            items.map((item, i) => {
                              return (
                                <SelectItem
                                  label="Categoria"
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

            <View>
              <Label nativeID="monto" className="text-foreground">
                Monto
              </Label>

              <Controller
                control={control}
                name="monto"
                render={({ ...field }) => (
                  <Input
                    inputMode="decimal"
                    value={String(expense.monto)}
                    placeholder="65.00"
                    {...field}
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
            {/* <YStack>
              <Label>Divisa</Label>

              <Controller
                  name="divisa"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup value={expense.divisa} name="currency">
                      <XStack gap="$6">
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="pen" id="pen">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="pen">Soles</Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="usd" id="usd">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="pen">Dólares</Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <RadioGroup.Item value="eur" id="eur">
                            <RadioGroup.Indicator />
                          </RadioGroup.Item>

                          <Label htmlFor="eur">Euros</Label>
                        </XStack>
                      </XStack>
                    </RadioGroup>
                  )}
                />
            </YStack> */}
            <View className="flex flex-col">
              <Label className="text-foreground">Descripción</Label>
              <Controller
                control={control}
                name="descripcion"
                render={({ field: { onChange, value, ref } }) => (
                  <Textarea
                    ref={ref}
                    autoCapitalize="none"
                    placeholder="Descripción..."
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="descripcion"
                  />
                )}
                defaultValue={expense.descripcion}
              />
            </View>
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
            <Button onPress={handleSubmit(onSubmit)} size="lg" className="mt-6">
              {isLoading ? (
                <Loader className="animate-spin text-white" size={20} />
              ) : (
                "Actualizar"
              )}
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center min-h-full">
          <Loader className="animate-spin text-white" size={20} />
          <Text className="text-foreground">Cargando...</Text>
        </View>
      )}
    </ScrollView>

    //   {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
    // <PushNotification /> */}
  );
}
