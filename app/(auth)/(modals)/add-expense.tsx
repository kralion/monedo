import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { toast } from "sonner-native";
import AddExpenseModal from "~/components/add-expense-modal";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Label } from "~/components/ui/label";
import { RadioGroupItem } from "~/components/ui/radio-group";

import { useHeaderHeight } from "@react-navigation/elements";
import { Check, ChevronsUpDown } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { ICategory, IExpense } from "~/interfaces";
import { supabase } from "~/lib/supabase";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { router } from "expo-router";

export default function AddExpense() {
  const { addExpense, loading } = useExpenseStore();
  const [openCollapsible, setOpenCollapsible] = React.useState(false);
  const { isOutOfBudget, checkBudget } = useBudgetStore();
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
    });
    reset();
    router.back();
    checkBudget(user?.id as string);
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex flex-col gap-4"
    >
      <View className="flex flex-col gap-6 p-4">
        <Controller
          control={control}
          name="amount"
          rules={{
            required: true,
            min: 1,
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              keyboardType="numeric"
              autoFocus
              className=" h-36 text-[54px]  text-center font-bold"
              cursorColor="gray"
              placeholder="S/ 50.00"
              value={value?.toString() || ""}
              onChangeText={onChange}
            />
          )}
        />
        <View className="flex flex-col gap-2">
          <Collapsible onOpenChange={setOpenCollapsible} open={openCollapsible}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="justify-between flex flex-row "
              >
                {category.label ? (
                  <Text>{category.label}</Text>
                ) : (
                  <Text>Categoría</Text>
                )}
                <ChevronsUpDown color="gray" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className=" flex flex-col gap-2 mt-4">
              {categories.map((item) => (
                <Button
                  className=" flex flex-row  items-center justify-between shadow-sm"
                  onPress={() => {
                    setCategory(item);
                    setOpenCollapsible(false);
                  }}
                  variant="outline"
                  key={item.id}
                >
                  <View className="flex flex-row gap-3 items-center">
                    <View
                      className={`h-5 w-5 rounded-full bg-[${item.color}]`}
                    />
                    <Text>{item.label}</Text>
                  </View>
                  {category.id === item.id && (
                    <Check size={20} className="text-black dark:text-white" />
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </View>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Textarea
              autoCapitalize="none"
              onChangeText={onChange}
              placeholder="Nota de gasto..."
              value={value}
            />
          )}
          defaultValue=""
        />
      </View>
      <Button
        className="mx-6 rounded-full"
        onPress={handleSubmit(onSubmit)}
        size="lg"
      >
        {loading ? (
          <ActivityIndicator size={20} color="white" />
        ) : (
          <Text>Registrar</Text>
        )}
      </Button>
      {/* <AddExpenseModal openModal={openModal} setOpenModal={setOpenModal} /> */}
    </ScrollView>
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
