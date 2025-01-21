import { ICategory } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
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
  category,
}: {
  category?: ICategory;
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  const { user } = useUser();
  const [color, setColor] = React.useState(0);
  const { addCategory, updateCategory, loading } = useCategoryStore();

  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ICategory>();

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

  useEffect(() => {
    if (category) {
      setValue("label", category?.label);
      setColor(category?.color ? colors.indexOf(category?.color) : 0);
    }
    console.log("category", category);
  }, []);

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

  useEffect(() => {
    bottomSheetRef.current?.close();
  }, []);
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
          onPress={category ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text>{category ? "Guardar" : "Registrar"}</Text>
        </Button>
      </BottomSheetView>
    </BottomSheet>
  );
}
