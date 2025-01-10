import { useAuth } from "@clerk/clerk-expo";
import React, { useState } from "react";
import {
  Appearance,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
function RadioGroupItemWithLabel({
  value,
  onLabelPress,
  label,
}: {
  value: string;
  onLabelPress: () => void;
  label: string;
}) {
  return (
    <View className="flex-col gap-2 items-center">
      <RadioGroupItem
        aria-labelledby={`label-for-${value}`}
        value={value}
        onPress={onLabelPress}
      />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {label}
      </Label>
    </View>
  );
}
export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    "dark" === colorScheme ? "dark" : "light"
  );

  const toggleDarkMode = () => {
    setIsDarkMode("dark");
    Appearance.setColorScheme("dark");
  };

  const toggleLightMode = () => {
    setIsDarkMode("light");
    Appearance.setColorScheme("light");
  };

  return (
    <ScrollView
      className=" p-4 bg-white dark:bg-zinc-900"
      contentInsetAdjustmentBehavior="automatic"
    >
      <RadioGroup
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        className="gap-3"
      >
        <View className="flex-row justify-between mb-8">
          <View className="items-center">
            <Image
              source={require("../../../../assets/images/light.png")}
              className="w-48 h-72 rounded-lg mb-2"
            />

            <RadioGroupItemWithLabel
              value="light"
              label="Modo Claro"
              onLabelPress={() => toggleLightMode()}
            />
          </View>
          <View className="items-center">
            <Image
              source={require("../../../../assets/images/dark.png")}
              className="w-48 h-72 rounded-lg mb-2"
            />
            <RadioGroupItemWithLabel
              value="dark"
              label="Modo Oscuro"
              onLabelPress={toggleDarkMode}
            />
          </View>
        </View>
      </RadioGroup>

      <Text style={{ color: "gray" }}>
        Selecciona tu modo de visualización y cambia el tema de la aplicación. O
        si deseas accede a la configuración desde la barra de menú en la esquina
        superior derecha.
      </Text>
      <Button
        variant="destructive"
        onPress={() => signOut()}
        style={{ marginTop: 40 }}
      >
        <Text>Cerrar Sesión</Text>
      </Button>
    </ScrollView>
  );
}
