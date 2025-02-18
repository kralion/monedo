import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
// import { setAppIcon, getAppIcon } from "expo-dynamic-app-icon";
import { Check, CheckCircle, CheckCircle2 } from "lucide-react-native";

const ICONS = [
  {
    label: "Azul",
    name: "blue",
    icon: require("@/assets/icons/blue.png"),
  },
  {
    label: "Azul Nocturno",
    name: "nightblue",
    icon: require("@/assets/icons/nightblue.png"),
  },
  {
    name: "default",
    label: "Default",
    icon: require("@/assets/icons/default.png"),
  },
];

/* TODO: Uncomment for production */

export default function IconScreen() {
  const headerHeight = useHeaderHeight();
  const iconDefault = "default";
  // const icon = getAppIcon();
  return (
    <View
      style={{ flex: 1, paddingTop: headerHeight }}
      className="web:md:w-1/2 mx-auto"
    >
      {ICONS.map((icon) => (
        <TouchableOpacity
          className={`flex flex-row justify-between py-2 pl-2 pr-6 mx-4 my-2 items-center border rounded-2xl border-zinc-200 dark:border-zinc-700 ${
            iconDefault === icon.name ? "border-teal-500 bg-green-50" : ""
          }`}
          key={icon.name}
          // onPress={() => setAppIcon(icon.icon)}
        >
          <View className="flex-row items-center gap-4">
            <Image source={icon.icon} style={{ width: 80, height: 80 }} />
            <Text className="text-xl font-bold">{icon.label}</Text>
          </View>
          {icon.name === iconDefault && (
            <CheckCircle color="green" size={30} strokeWidth={2} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
