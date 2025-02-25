import { ICategory } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, TouchableOpacity, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { useCategoryStore } from "~/stores/category";
import { Separator } from "../ui/separator";
const colors = [
  "#FF6F61", // Vibrant Coral
  "#6B5B95", // Elegant Purple
  "#88B04B", // Fresh Green
  "#F7CAC9", // Soft Pink
  "#92A8D1", // Calm Blue
  "#955251", // Rich Brown
  "#B565A7", // Vibrant Violet
  "#009B77", // Professional Teal
  "#DD4124", // Bold Red
  "#45B8AC", // Modern Aqua
  "#EFC050", // Bright Yellow
  "#5B5EA6", // Deep Blue
];

export default function AddCategory({
  bottomSheetRef,
  id,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
  id?: number | null;
}) {
  const { user } = useUser();
  const [color, setColor] = React.useState(0);
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    category,
    getCategoryById,
  } = useCategoryStore();

  const snapPoints = useMemo(() => ["60%"], []);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ICategory>();

  React.useEffect(() => {
    getCategoryById(id as number);
    setValue("label", category?.label);
    setColor(category?.color ? colors.indexOf(category?.color) : 0);
  }, [id]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const onUpdate = async (data: ICategory) => {
    updateCategory({
      ...data,
      id: category?.id as number,
      created_at: category?.created_at as Date,
    });
    bottomSheetRef.current?.close();

    reset();
  };
  const onSubmit = async (data: ICategory) => {
    addCategory({
      ...data,
      user_id: user?.id as string,
      color: colors[color],
    });
    bottomSheetRef.current?.close();
    reset();
  };

  const renderContent = useCallback(
    () => (
      <View className="flex flex-col gap-2 mb-4">
        <Text className="text-muted-foreground">Color</Text>
        <Separator />
        <View className="flex-row flex-wrap justify-center mb-3">
          {colors.map((item, index) => {
            const isActive = color === index;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setColor(index)}
                className="m-2"
              >
                <View
                  className={`w-10 h-10 rounded-full   ${
                    isActive ? "border-2 border-brand    " : "border-none"
                  }`}
                  style={{ backgroundColor: item }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Separator />
      </View>
    ),
    [color]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: "gray" }}
      backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
      backdropComponent={renderBackdrop}
      onClose={() => {
        reset();
      }}
    >
      <BottomSheetView className="p-4 flex flex-col  gap-4">
        <Controller
          control={control}
          name="label"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <View className="flex flex-col gap-2">
              <Text style={{ color: "gray" }}>Nombre</Text>
              <BottomSheetTextInput
                className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
                placeholder="Ej. Salud"
                value={value}
                onChangeText={onChange}
              />
              {errors.label && (
                <Text className="text-red-500 ml-4">
                  {errors.label.message}
                </Text>
              )}
            </View>
          )}
        />
        {renderContent()}
        <Button
          size="lg"
          onPress={id ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
        >
          <Text>{id ? "Guardar" : "Registrar"}</Text>
        </Button>
        {id && (
          <Button
            variant="destructive"
            size="lg"
            onPress={() => {
              Alert.alert(
                "¿Estás seguro?",
                "Esta acción eliminará la categoría y no se puede deshacer",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
                  {
                    text: "Eliminar",
                    onPress: () => {
                      deleteCategory(category?.id as number);
                      bottomSheetRef.current?.close();
                    },
                    style: "destructive",
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Text>Eliminar</Text>
          </Button>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}
