import { Image } from "expo-image";
import { router, Stack, useSegments } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { Tabs } from "~/constants/tabs";

function SidebarItem({
  icon,
  title,
  unfocusedIcon,
  isActive,
  href,
  compact = false,
}: {
  icon: string;
  unfocusedIcon: string;
  title: string;
  isActive: boolean;
  href: string;
  compact?: boolean;
}) {
  const colorScheme = useColorScheme();
  const hoverBg =
    colorScheme === "dark"
      ? "rgba(255, 59, 48, 0.1)"
      : "rgba(255, 59, 48, 0.1)";
  const size = compact ? 24 : 22;

  return (
    <Pressable
      onPress={() => {
        window?.scrollTo({ top: 0, behavior: "smooth" });
        router.push(href as any);
      }}
      className={`flex flex-row items-center rounded-lg gap-3 transition-all duration-200 ${
        compact ? "justify-center w-12 h-12 mx-auto" : "px-4 py-2.5"
      } ${
        isActive
          ? "bg-zinc-100 dark:bg-zinc-700"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
      }`}
      style={({ pressed, hovered }) => [
        (pressed || hovered) && { backgroundColor: hoverBg },
      ]}
    >
      <Image
        style={{
          width: size,
          height: size,
          opacity: isActive ? 1 : 0.7,
        }}
        source={{
          uri: isActive ? icon : unfocusedIcon,
        }}
        alt="icon"
      />
      {!compact && (
        <Text
          className={`text-base ${
            isActive
              ? "font-semibold text-black dark:text-white"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export default function WebLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const segments = useSegments();
  const [isActive, setIsActive] = React.useState(false);
  const iconColor = isActive
    ? "#41D29B"
    : colorScheme === "dark"
    ? "#ffffff"
    : "#8E8E8F";
  const isCompact = width < 1024;
  const isMobile = width < 768;
  const borderColor = colorScheme === "dark" ? "#2f3336" : "#eee";
  const sidebarWidth = isCompact ? "w-[82px]" : "w-[260px]";
  const contentWidth = isCompact
    ? "max-w-[calc(100%-82px)]"
    : "max-w-[calc(100%-260px)]";

  const tabIcon = (
    focusedIcon: string,
    unfocusedIcon: string,
    focused: boolean
  ) => {
    return (
      <Image
        style={{ width: 28, height: 28, tintColor: iconColor }}
        source={{
          uri: focused ? focusedIcon : unfocusedIcon,
        }}
        alt="icon"
      />
    );
  };

  return (
    <>
      {isMobile && (
        <View className="flex-1 web:md:flex-none">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
      )}

      <View className="flex-row left-0 right-0 bg-white dark:bg-zinc-800 justify-center relative">
        {!isMobile && (
          <View
            className={`${sidebarWidth} items-end sticky top-0 h-screen border-r`}
            style={{
              borderRightColor: borderColor,
            }}
          >
            <View
              className={`sticky ${
                isCompact ? "w-[82px] px-2" : "w-[260px] px-4"
              } h-full overflow-y-auto`}
            >
              <View className="mb-8 pt-6 flex flex-row items-center gap-2">
                <Image
                  className="w-16 h-16"
                  source={require("../../../assets/logo.png")}
                />
                {!isCompact && (
                  <Text className="text-2xl font-bold">Monedo</Text>
                )}
              </View>

              <View className="flex flex-col gap-2">
                {Tabs.map((tab) => (
                  <SidebarItem
                    key={tab.name}
                    icon={`https://api.iconify.design/${tab.icon[0]}`}
                    unfocusedIcon={`https://api.iconify.design/${tab.icon[1]}`}
                    title={tab.title}
                    href={
                      tab.name === "index"
                        ? `/(auth)/(tabs)`
                        : `/(auth)/(tabs)/${tab.name}`
                    }
                    compact={isCompact}
                    isActive={segments.includes(tab.name as never)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
        {!isMobile && (
          <View
            className={`flex-1 w-full ${contentWidth} bg-transparent web:md:pl-6 web:md:pr-4 overflow-y-auto h-screen`}
          >
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
        )}

        {isMobile && (
          <View
            className={`fixed bottom-0 left-0 right-0 h-16 flex-row border-t ${
              Platform.OS === "ios" ? "pb-5" : ""
            }`}
            style={{
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(10, 10,10, 0.7)"
                  : "rgba(255, 255, 255, 0.5)",
              backdropFilter: Platform.OS === "web" ? "blur(12px)" : undefined,
              borderTopColor: borderColor,
            }}
          >
            {Tabs.map((tab) => (
              <Pressable
                key={tab.name}
                onPress={() => {
                  router.push(`/(auth)/(tabs)/${tab.name}` as never);
                }}
                className="flex-1 items-center justify-center gap-1"
              >
                {tabIcon(
                  `https://api.iconify.design/${tab.icon[0]}`,
                  `https://api.iconify.design/${tab.icon[1]}`,
                  segments.includes(tab.name as never)
                )}
                <Text
                  className={`text-xs ${
                    segments.includes(tab.name as never)
                      ? "text-[#41D29B]"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {tab.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity
        className="absolute right-4 bottom-28 bg-primary p-4 h-16 w-16 rounded-full flex justify-center items-center shadow web:md:h-18 web:md:w-18 web:md:right-8 web:md:bottom-32"
        onPress={() => router.push("/(auth)/(modals)/add-expense")}
      >
        <Plus size={30} color="white" className="web:md:scale-110" />
      </TouchableOpacity>
    </>
  );
}
