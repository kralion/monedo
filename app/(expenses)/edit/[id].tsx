import AddExpenseSuccesModal from "@/components/popups/add-expense-sucess";
import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { useExpenseContext } from "@/context";
import { IExpense } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { H3, H4 } from "tamagui";
import {
  Adapt,
  Button,
  H2,
  Input,
  Label,
  RadioGroup,
  ScrollView,
  Select,
  Sheet,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";

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
  const toast = useToastController();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpense>();

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
      toast.show("Gasto actualizado correctamente");
      setOpenModal(true);
      reset();
      setValue("categoria", "");
    } catch (error) {
      toast.show("Error al actualizar el gasto");
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView p="$4">
        {expense.monto ? (
          <YStack gap="$5">
            <YStack gap="$1">
              <XStack gap="$2" alignItems="center">
                <Image
                  width={45}
                  height={45}
                  source={{
                    uri: assetIndentificador,
                  }}
                />

                <H3 pt="$1">Gasto en {expense.categoria}</H3>
              </XStack>
              <Text ml="$1.5">
                Modifica los detalles del gasto seleccionado
              </Text>
            </YStack>
            <YStack>
              <Controller
                name="categoria"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <YStack>
                    <Label color="$gray10">Categoría</Label>
                    <Select
                      value={expense.categoria}
                      onValueChange={onChange}
                      disablePreventBodyScroll
                    >
                      <Select.Trigger iconAfter={ChevronDown}>
                        <Select.Value placeholder="Selecciona" />
                      </Select.Trigger>

                      <Adapt when="sm" platform="touch">
                        <Sheet modal dismissOnSnapToBottom>
                          <Sheet.Frame>
                            <Sheet.ScrollView>
                              <Adapt.Contents />
                            </Sheet.ScrollView>
                          </Sheet.Frame>
                          <Sheet.Overlay />
                        </Sheet>
                      </Adapt>

                      <Select.Content zIndex={200000}>
                        <Select.ScrollUpButton
                          alignItems="center"
                          justifyContent="center"
                          position="relative"
                          width="100%"
                          height="$3"
                        >
                          <YStack zIndex={10}>
                            <ChevronUp size={20} />
                          </YStack>
                        </Select.ScrollUpButton>

                        <Select.Viewport>
                          <Select.Group>
                            {useMemo(
                              () =>
                                items.map((item, i) => {
                                  return (
                                    <Select.Item
                                      index={i}
                                      key={item.name}
                                      value={item.name.toLowerCase()}
                                    >
                                      <Select.ItemText>
                                        {item.name}
                                      </Select.ItemText>
                                      <Select.ItemIndicator marginLeft="auto">
                                        <Check size={16} />
                                      </Select.ItemIndicator>
                                    </Select.Item>
                                  );
                                }),
                              [items]
                            )}
                          </Select.Group>
                        </Select.Viewport>

                        <Select.ScrollDownButton
                          alignItems="center"
                          justifyContent="center"
                          position="relative"
                          width="100%"
                          height="$3"
                        >
                          <YStack zIndex={10}>
                            <ChevronDown size={20} />
                          </YStack>
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select>
                  </YStack>
                )}
              />

              <YStack>
                <Label color="$gray10">Monto</Label>

                <Controller
                  control={control}
                  name="monto"
                  render={({ ...field }) => (
                    <Input
                      size="lg"
                      inputMode="decimal"
                      value={String(expense.monto)}
                      placeholder="65.00"
                      {...field}
                      borderRadius={7}
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
              </YStack>
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
              <YStack>
                <Label color="$gray10">Descripción</Label>
                <Controller
                  control={control}
                  name="descripcion"
                  render={({ field: { onChange, value } }) => (
                    <TextArea
                      size="$4"
                      autoCapitalize="none"
                      borderRadius="$5"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                  defaultValue={expense.descripcion}
                />
              </YStack>
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
                size="$5"
                bg="$green9Light"
                color="$white1"
                mt="$6"
              >
                {isLoading ? (
                  <Spinner size="small" color="$white1" />
                ) : (
                  "Actualizar"
                )}
              </Button>
            </YStack>
          </YStack>
        ) : (
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            minHeight="100%"
          >
            <Spinner size="small" />
            <Text color="$gray10">Cargando...</Text>
          </YStack>
        )}

        {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
