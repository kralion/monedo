import { ICategory, IExpense } from "@/interfaces";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { toast } from "sonner-native";
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
import { useBudgetStore } from "~/stores/budget";
import { useCategoryStore } from "~/stores/category";
import { useExpenseStore } from "~/stores/expense";
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
  const { expense, deleteExpense, updateExpense } = useExpenseStore();
  const { categories, loading } = useCategoryStore();
  const [category, setCategory] = React.useState<ICategory>();
  const { isOutOfBudget } = useBudgetStore();
  const [isLoading, setIsLoading] = React.useState(false);
  if (!expense) return <ActivityIndicator />;
  const [amount, setAmount] = React.useState(expense.amount);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IExpense>();
  useEffect(() => {
    if (id) {
      setValue("description", expense.description);
      setValue("amount", expense.amount);
      setValue("id_category", expense.id_category);
      setValue("periodicity", expense.periodicity);
      setValue("currency", "Soles");
      setCategory(categories.find((c) => c.id === expense.id_category));
    }
  }, [id]);
  const formattedDate = new Date(expense.date).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDeleteExpense = () => {
    Alert.alert(
      "¿Estás seguro?",
      "Esta acción eliminará el gasto seleccionado y no se puede deshacer",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar Gasto",
          onPress: () => deleteExpense(Number(id)),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // TODO: Multiple renders
  async function onSubmit(data: IExpense) {
    setIsLoading(true);
    if (isOutOfBudget === true) {
      toast.error("No tienes suficiente fondos para registrar este gasto");
      return;
    }
    if (data.categories?.value === "") {
      toast.error("Debes seleccionar una categoría");
      return;
    }
    if (amount === 0) {
      toast.error("Debes ingresar un monto válido");
      return;
    }
    try {
      updateExpense({
        ...data,
        id: Number(id),
        amount:
          data.currency === "Euros"
            ? amount * 3.85
            : data.currency === "Dólares"
            ? amount * 3.7
            : amount,
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className="h-screen-safe-offset-2 px-4 bg-white dark:bg-zinc-900"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex flex-col">
          <View className="flex flex-col gap-6 pt-6">
            <Controller
              name="id_category"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <Label>Categoría</Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(
                        (category) => category.id === Number(value)
                      );
                      if (selectedCategory) {
                        setCategory(selectedCategory);
                      }
                    }}
                    value={{
                      value: String(category?.label),
                      label: category?.label as string,
                    }}
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
                      fecha en la que fue creado inicialmente, en este caso cada{" "}
                      <Text className="font-bold ">{formattedDate}</Text> de
                      cada mes.
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
              <Button onPress={handleDeleteExpense} size="lg" variant="link">
                <Text className="text-red-500">Eliminar Gasto</Text>
              </Button>
            </View>
          </View>
        </View>
        {/* TODO: Probar esto solo el los dispositivos, en los emuladores no funciona
      <PushNotification /> */}
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
