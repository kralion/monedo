import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button as NativeButton,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useBudgetContext } from "~/context";
import { IBudget } from "~/interfaces";

export default function Layout() {
  const incomeBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const { addBudget, loading, budget, updateBudget, setBudget } =
    useBudgetContext();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<IBudget>();
  useEffect(() => {
    if (budget.id) {
      setValue("amount", budget.amount);
      setValue("description", budget.description);
    }
  }, [budget.id]);
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
  const onUpdate = async (data: IBudget) => {
    updateBudget({
      ...data,
      id: budget.id,
    });
    setBudget({} as IBudget);
    incomeBottomSheetRef.current?.close();
  };
  const onSubmit = async (data: IBudget) => {
    addBudget(data);
    reset();
    incomeBottomSheetRef.current?.close();
  };

  useEffect(() => {
    incomeBottomSheetRef.current?.close();
  }, []);

  return (
    <View className="flex-1 ">
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Billetera",
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerLargeTitleShadowVisible: false,
            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Agregar"
                  color="#27BE8B"
                  onPress={() => {
                    reset();
                    incomeBottomSheetRef.current?.expand();
                  }}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => {
                    reset();
                    incomeBottomSheetRef.current?.expand();
                  }}
                >
                  <Text>Agregar</Text>
                </Button>
              );
            },
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: "Detalles",
            headerLargeTitle: true,
            headerBackTitle: "Atrás",
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerShadowVisible: false,
            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Editar"
                  color="#27BE8B"
                  onPress={() => incomeBottomSheetRef.current?.expand()}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => incomeBottomSheetRef.current?.expand()}
                >
                  <Text>Editar</Text>
                </Button>
              );
            },
          }}
        />
        <Stack.Screen
          name="edit/[id]"
          options={{
            title: "Editar Registro",
            headerBackVisible: true,
            headerLargeTitle: true,
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerShadowVisible: true,
            presentation: "modal",

            headerLeft: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Cancelar"
                  color="#27BE8B"
                  onPress={() => {
                    router.back();
                    setBudget({} as IBudget);
                  }}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => {
                    router.back();
                    setBudget({} as IBudget);
                  }}
                >
                  <Text>Cancelar</Text>
                </Button>
              );
            },
          }}
        />
      </Stack>
      <BottomSheet
        ref={incomeBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "gray" }}
        backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="p-4 flex flex-col gap-4 ">
          <Controller
            control={control}
            name="amount"
            rules={{
              required: true,
              min: 1,
            }}
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-col gap-2">
                <Text style={{ color: "gray" }}>Monto</Text>
                <BottomSheetTextInput
                  className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
                  keyboardType="numeric"
                  placeholder="200"
                  value={String(value)}
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
          <Controller
            control={control}
            name="description"
            rules={{
              required: "Requerido",
            }}
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-col gap-2">
                <Text style={{ color: "gray" }}>Descripcion</Text>
                <BottomSheetTextInput
                  className="border rounded-lg border-gray-200 p-4 w-full dark:border-zinc-700 text-black dark:text-white"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Breve descripcion"
                />
                {errors.description && (
                  <Text className="text-red-500 ml-4">
                    {errors.description.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            onPress={
              budget.id ? handleSubmit(onUpdate) : handleSubmit(onSubmit)
            }
            disabled={loading}
          >
            <Text>{budget.id ? "Actualizar" : "Registrar Ingreso"}</Text>
          </Button>

          <Button
            onPress={() => {
              incomeBottomSheetRef.current?.close();
            }}
            variant="secondary"
          >
            <Text>Cancelar</Text>
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
