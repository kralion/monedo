import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

export default function BuyPremiumModal() {
  const { user } = useUser();
  const { has } = useAuth();
  const [value, setValue] = React.useState("card");

  return (
    <SafeAreaView className="p-4">
      <View className="flex flex-col gap-6 pt-16">
        <View className="flex flex-row justify-between items-center">
          <Button variant="ghost" onPress={() => router.back()} size="icon">
            <X size="$1" />
          </Button>
        </View>
        <View className="flex flex-row gap-4 items-center">
          <Avatar alt="profile" className="bg-teal-600 w-32 h-32">
            <AvatarImage
              accessibilityLabel="avatar"
              source={{ uri: user?.imageUrl }}
            />
            <AvatarFallback className="bg-slate-500" />
          </Avatar>
          <View className="flex flex-col gap-2">
            <Text className="font-bold text-2xl">
              {user?.firstName} {user?.lastName}
            </Text>
            <Badge
              className={`
                  ${
                    has?.({ permission: "free:plan" })
                      ? "bg-primary"
                      : "bg-orange-500"
                  }
                  text-white py-2
                  `}
            >
              <Text className="text-md">
                {has?.({ permission: "free:plan" })
                  ? "Cuenta Premium"
                  : "Cuenta Free"}
              </Text>
            </Badge>
          </View>
        </View>
        <Separator className="text-gray-500" />
        <ScrollView>
          <Text className="text-2xl font-bold ">Método de Pago</Text>
          <View className="flex-1 justify-center  py-6">
            <Tabs
              value={value}
              onValueChange={setValue}
              className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
            >
              <TabsList className="flex-row w-full rounded-lg">
                <TabsTrigger value="card" className="flex-1 rounded-lg">
                  <Text>Tarjeta</Text>
                </TabsTrigger>
                <TabsTrigger value="yape" className="flex-1 rounded-lg">
                  <Text>Yape</Text>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card">
                <Stripe />
              </TabsContent>
              <TabsContent value="yape">
                <Yape />
              </TabsContent>
            </Tabs>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
