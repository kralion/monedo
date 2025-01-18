import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { toast } from "sonner-native";
import AddExpenseModal from "~/components/add-expense-modal";
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
import { ICategory, IExpense } from "~/interfaces";
import { supabase } from "~/lib/supabase";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";

export default function AddExpense() {
  const { addExpense, loading } = useExpenseStore();
  const { isOutOfBudget, checkBudget } = useBudgetStore();
  const [openModal, setOpenModal] = React.useState(false);
  const [category, setCategory] = useState({ id: 0, label: "" });

  const { user } = useUser();
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpense>();

  async function getCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user?.id);
    setCategories(data as ICategory[]);
    return data;
  }

  useEffect(() => {
    getCategories();
  }, []);
  async function onSubmit(data: IExpense) {
    if (isOutOfBudget === true) {
      toast.error("No tienes suficiente fondos para registrar este gasto");
      return;
    }
    if (!category.id) {
      toast.error("Debes seleccionar una categoría");
      return;
    }
    console.log(category.id);

    addExpense({
      ...data,
      currency: data.currency ? data.currency : "Soles",
      user_id: user?.id as string,
      id_category: category.id,
      amount:
        data.currency === "Euros"
          ? data.amount * 3.85
          : data.currency === "Dólares"
          ? data.amount * 3.7
          : data.amount,
    });
    reset();
    setOpenModal(true);
    checkBudget(user?.id as string);
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="h-screen bg-white dark:bg-zinc-900"
        contentInsetAdjustmentBehavior="automatic"
      >
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
            <View className="flex flex-col gap-2">
              <Label>Categoría</Label>
              <Select
                onValueChange={(value) => {
                  const selectedCategory = categories.find(
                    (category) => category.id === Number(value?.value)
                  );
                  if (selectedCategory) {
                    setCategory(selectedCategory);
                  }
                }}
                value={{
                  value: category.id.toString(),
                  label: category.label,
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="w-[90%]">
                  <SelectGroup>
                    {categories.map((item) => (
                      <SelectItem
                        key={item.id}
                        label={item.label}
                        value={item.id.toString() || ""}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
            <Controller
              control={control}
              name="amount"
              rules={{
                required: true,
                min: 1,
              }}
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <Label>Monto</Label>
                  <Input
                    keyboardType="numeric"
                    placeholder="50.00"
                    value={value?.toString() || ""}
                    onChangeText={onChange}
                  />
                  {errors.amount && (
                    <Text className="text-red-500 ml-4">
                      {errors.amount.message}
                    </Text>
                  )}
                </View>
              )}
            />
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
                    <Text className="text-muted-foreground dark:text-secondary text-sm">
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
                  router.push("/(auth)/(tabs)");
                }}
                size="lg"
                variant="link"
              >
                <Text className="text-red-500">Cancelar</Text>
              </Button>
            </View>
          </View>
        </View>
        <AddExpenseModal openModal={openModal} setOpenModal={setOpenModal} />
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
