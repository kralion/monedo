import { useExpenseContext } from "@/context";
import { IExpensePOST } from "@/interfaces";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { createClerkSupabaseClient } from "~/lib/supabase";

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
  const { id } = useLocalSearchParams();
  const supabase = createClerkSupabaseClient();
  const { expense, getExpenseById } = useExpenseContext();
  const [isLoading, setIsLoading] = React.useState(false);
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
  const formattedDate = new Date(expense.date).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // TODO: Multiple renders
  console.log(expense);
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
      <ScrollView
        className="h-screen-safe-offset-2 px-4"
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView>
          {/* <AddExpenseSuccesModal
          expensePrice={expensePrice}
          openModal={openModal}
          setOpenModal={setOpenModal}
        /> */}

          <View className="flex flex-col">
            <View className="flex flex-col gap-6 pt-6">
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <View className="flex flex-col gap-2">
                    <Label>Categoría</Label>
                    <Select
                      defaultValue={{
                        value: expense.category,
                        label: expense.category,
                      }}
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
                        cada <Text className="font-bold ">{formattedDate}</Text>{" "}
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
              </View>
            </View>
          </View>
          {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
        </SafeAreaView>
      </ScrollView>
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
