import { router, Stack } from "expo-router";
import { Alert, Button } from "react-native";
import { useExpenseContext } from "~/context";

export default function Layout() {
  const { deleteExpense } = useExpenseContext();
  const onDelete = (id: string) => {
    Alert.alert("Eliminar gasto", "¿Estás seguro?", [
      {
        text: "Sí",
        onPress: () => {
          deleteExpense(id);
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Presupuestos",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
          },

          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          headerLargeTitle: true,
          title: "Presupuesto",
          headerBackTitle: "Atrás",
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerShadowVisible: false,

          headerRight: () => (
            <Button
              title="Editar"
              color="#27BE8B"
              onPress={() => router.push("/(tabs)/wallet/edit/[id]")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Editar",
            headerBackTitle: "Detalles",
            headerBlurEffect: "regular",
            headerBackVisible: true,
            headerTransparent: true,
            headerShadowVisible: false,
            presentation: "modal",
            headerRight: () => (
              <Button
                title="Eliminar"
                color="#FF453A"
                onPress={() => onDelete(id)}
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
