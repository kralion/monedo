import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useRef } from "react";
import { Button as NativeButton, Platform, View } from "react-native";
import AddCategory from "~/components/profile/add-category";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function CategoriesLayout() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [id, setId] = React.useState<number | null>(null);

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Categorías",
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerLargeTitleShadowVisible: false,
            headerLeft: () => (
              <Button
                variant="secondary"
                onPress={() => {
                  router.back();
                }}
                className="rounded-full"
                size="icon"
              >
                <ChevronLeft size={20} color="#41D29B" />
              </Button>
            ),

            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Agregar"
                  color="#27BE8B"
                  onPress={() => {
                    setId(null);
                    bottomSheetRef.current?.expand();
                  }}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => {
                    setId(null);
                    bottomSheetRef.current?.expand();
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
          options={({ route }) => {
            const { id }: { id: number } = route.params as { id: number };
            return {
              title: "Gastos",
              headerShadowVisible: false,
              headerLargeTitle: true,
              headerRight: () => {
                return (
                  <NativeButton
                    title="Editar"
                    color="#41D29B"
                    onPress={() => {
                      bottomSheetRef.current?.expand();
                      setId(id);
                    }}
                  />
                );
              },
            };
          }}
        />
      </Stack>
      <AddCategory id={id} bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
