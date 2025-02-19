import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Button } from "~/components/ui/button";

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto ">
      <View className="flex-1 px-4 ">
        <View className="flex flex-col gap-8 mt-10 mx-auto">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=500&id=f6f4NTIAYAPC&format=png&color=000000",
            }}
            style={{
              width: 320,
              height: 220,
            }}
          />
          <Image
            source={{
              uri: "https://img.icons8.com/?size=400&id=lWWE908jTJ3m&format=png&color=000000",
            }}
            style={{
              width: 320,
              height: 220,
            }}
          />
        </View>

        {/* Text Content */}
        <View className="items-center mt-10">
          <Text className="text-3xl font-bold text-center mb-4">
            Trackea Tus Gastos del Dia a Dia desde tu Bolsillo
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Monedo es una aplicación que te permite registrar tus gastos y
            ganancias de manera eficiente.
          </Text>
        </View>

        {/* Buttons */}
        <View className="px-4 flex flex-col gap-4">
          <Button onPress={() => router.push("/(public)/sign-in")}>
            <Text className="text-white text-center font-semibold">
              Empezar
            </Text>
          </Button>

          <View className="flex-row justify-center">
            <Text className="text-gray-500">Eres nuevo en Monedo? </Text>
            <TouchableOpacity onPress={() => router.push("/(public)/sign-in")}>
              <Text className="text-brand font-semibold ">Crea tu cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
