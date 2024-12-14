import { Tabs } from "expo-router";
import { BarChart, Home, PlusCircle, User, Wallet } from "lucide-react-native";
import { Pressable, useColorScheme, View } from "react-native";
import { Text } from "~/components/ui/text";
const TabBar = ({ state, navigation }: any) => {
  const icons = [
    { name: "Inicio", icon: Home, routeName: "index" },
    { name: "Statistics", icon: BarChart, routeName: "statistics" },
    { name: "Agregar", icon: PlusCircle, routeName: "add-expense" },
    { name: "Wallet", icon: Wallet, routeName: "wallet" },
    { name: "Perfil", icon: User, routeName: "profile" },
  ];

  return (
    <View className="flex-row items-center justify-between p-4 m-4 absolute bottom-4 border-2 border-zinc-100  bg-zinc-100 shadow shadow-gray-300 w-[95%]  left-0 right-0  rounded-full backdrop-blur-xl">
      {icons.map((item, index) => {
        const isFocused = state.index === index;
        const Icon = item.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: item.routeName,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(item.routeName);
          }
        };

        return (
          <View key={item.routeName} className="flex-row items-center ">
            <Pressable
              onPress={onPress}
              className={`p-2 flex flex-row gap-2 items-center ${
                isFocused
                  ? "bg-white rounded-full px-4 flex-row items-center"
                  : ""
              }`}
            >
              {isFocused && item.routeName === "profile" && (
                <Text className="text-brand animate-fade-in">{item.name}</Text>
              )}
              <Icon size={24} color={isFocused ? "#41D29B" : "#999"} />
              {isFocused && item.routeName !== "profile" && (
                <Text className="text-brand animate-fade-in">{item.name}</Text>
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="add-expense" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
