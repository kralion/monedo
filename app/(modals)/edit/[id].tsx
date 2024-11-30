import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { useExpenseContext } from "@/context";
import { IExpense, IExpenseGET, IExpensePOST } from "@/interfaces";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { Loader, X } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddExpenseSuccesModal from "~/components/popups/add-expense-sucess";
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
import { useHeaderHeight } from "@react-navigation/elements";
import { Separator } from "~/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";

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
  { name: "Hogar" },
  { name: "Transporte" },
  { name: "Salud" },
  { name: "Alimentacion" },
  { name: "Finanzas" },
  { name: "Educación" },
  { name: "Personal" },
  { name: "Casuales" },
];
export default function EditExpense() {
  const params = useLocalSearchParams<{ id: string }>();
  const supabase = createClerkSupabaseClient();
  const { updateExpense } = useExpenseContext();
  const { expense } = useExpenseContext();
  const [currentExpense, setCurrentExpense] = React.useState({} as IExpense);
  const [isLoading, setIsLoading] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpensePOST>({
    defaultValues: {
      description: expense.description,
      amount: expense.amount,
      category: {
        value: expense.category,
      },
      periodicity: expense.periodicity,
      currency: expense.currency,
    },
  });

  async function getExpenseById(id: string) {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setCurrentExpense(data);

    return data;
  }

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

  useEffect(() => {
    if (params.id) {
      getExpenseById(params.id);
    }
  }, [params.id]);
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) => icon.label.toLowerCase() === expense.category
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

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
            <View className="flex flex-row justify-between ">
              <View className="flex flex-col px-4">
                <Text className="text-4xl font-bold mt-8">Editar Gasto</Text>
                <Text className="text-muted-foreground">
                  Modifica los detalles del gasto que hiciste
                </Text>
              </View>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full m-3"
                onPress={() => router.back()}
              >
                <X color="black" />
              </Button>
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
                    <Select
                      // defaultValue={expense.category}
                      onValueChange={onChange}
                    >
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
                      defaultValue={String(expense.amount)}
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
                    defaultValue={expense.description}
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
              <View className="flex flex-col gap-3 mt-4">
                <Button onPress={handleSubmit(onSubmit)} size="lg">
                  {isLoading ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    <Text>Guardar Cambios</Text>
                  )}
                </Button>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  size="lg"
                  variant="destructive"
                >
                  {isLoading ? (
                    <ActivityIndicator size={20} color="white" />
                  ) : (
                    <Text>Eliminar</Text>
                  )}
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
        {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>

    //   {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
    // <PushNotification /> */}
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
