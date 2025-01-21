import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  ChevronRight,
  HeartHandshake,
  MessageSquareShare,
  SmartphoneNfc,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Appearance,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
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
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    isDarkColorScheme ? "dark" : "light"
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
      <View className="flex flex-col mt-10 items-start bg-zinc-100 py-4  dark:bg-zinc-700  rounded-xl  gap-4">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/(tabs)/profile/feedback")}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <MessageSquareShare color={isDarkColorScheme ? "white" : "black"} />
            <Text className="dark:text-white">Feedback</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>
        <Separator />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/(tabs)/profile/t&c")}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <HeartHandshake color={isDarkColorScheme ? "white" : "black"} />

            <Text className="dark:text-white">Términos y Condiciones</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>

        <Separator />
        <TouchableOpacity
          onPress={() => Linking.openURL("https://cal.com/brayanpaucar/monedo")}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <SmartphoneNfc color={isDarkColorScheme ? "white" : "black"} />
            <Text className="dark:text-white">Soporte</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>
      </View>
      <Button
        variant="destructive"
        onPress={() => signOut()}
        style={{ marginVertical: 40 }}
      >
        <Text>Cerrar Sesión</Text>
      </Button>
    </ScrollView>
  );
}
