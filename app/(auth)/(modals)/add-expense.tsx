import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Label } from "~/components/ui/label";
import { RadioGroupItem } from "~/components/ui/radio-group";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronsUpDown } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { ICategory, IExpense } from "~/interfaces";
import { supabase } from "~/lib/supabase";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { useCategoryStore } from "~/stores/category";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function AddExpense() {
  const { addExpense, loading, expense, updateExpense } = useExpenseStore();
  const { id } = useLocalSearchParams();
  const { categories, getCategories } = useCategoryStore();
  const [openCollapsible, setOpenCollapsible] = React.useState(false);
  const { isOutOfBudget, checkBudget } = useBudgetStore();
  const [category, setCategory] = useState<ICategory>();
  const { user } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpense>();
  useEffect(() => {
    if (id && expense) {
      setValue("description", expense.description);
      setValue("amount", expense.amount);
      setValue("id_category", expense.id_category);
      setCategory(
        categories.find((c) => c.id === (expense.id_category as number))
      );
    }
  }, [id]);

  useEffect(() => {
    getCategories(user?.id as string);
  }, []);
  async function onSubmit(data: IExpense) {
    if (isOutOfBudget === true) {
      toast.error("No tienes suficiente fondos para registrar este gasto");
      return;
    }
    if (!category?.id) {
      toast.error("Debes seleccionar una categoría");
      return;
    }

    if (expense) {
      updateExpense({
        ...data,
        id_category: category.id,
        user_id: user?.id as string,
        id: Number(id),
      });
    } else {
      addExpense({
        ...data,
        currency: data.currency ? data.currency : "Soles",
        user_id: user?.id as string,
        id_category: category.id,
      });
    }

    reset();
    router.back();
    checkBudget(user?.id as string);
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex flex-col gap-4 bg-white dark:bg-zinc-900"
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
              className=" h-36 text-[54px]  text-center font-bold dark:text-white"
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
                size="lg"
                variant="outline"
                className="justify-between flex flex-row dark:bg-zinc-700 dark:border-zinc-900"
              >
                {category?.label ? (
                  <Text className="dark:text-white">{category.label}</Text>
                ) : (
                  <Text>Categoría</Text>
                )}
                <ChevronsUpDown color="gray" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className=" flex flex-col gap-2 mt-4">
              {categories.map((item) => (
                <Button
                  className=" flex flex-row  items-center justify-between shadow-sm dark:bg-zinc-700 dark:border-zinc-900"
                  size="lg"
                  onPress={() => {
                    setCategory(item);
                    setOpenCollapsible(false);
                  }}
                  variant="outline"
                  key={item.id}
                >
                  <Animated.View
                    className="flex flex-row gap-3 items-center"
                    entering={FadeInDown.duration(200)}
                  >
                    <View
                      className="h-5 w-5 rounded-full "
                      style={{ backgroundColor: item.color }}
                    />
                    <Text>{item.label}</Text>
                  </Animated.View>
                  {category?.id === item.id && (
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
          <Text className="dark:text-black">
            {id ? "Guardar Cambios" : "Registrar"}
          </Text>
        )}
      </Button>
      <Button
        className="mx-6 rounded-full mt-4"
        variant="secondary"
        onPress={() => router.back()}
        size="lg"
      >
        <Text className="dark:text-black">Cancelar</Text>
      </Button>
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
