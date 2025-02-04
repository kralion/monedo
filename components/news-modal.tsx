import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "./ui/button";
const CURRENT_VERSION = "1.0.1";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

type Feature = {
  icon: string;
  title: string;
  description: string;
};
const featuresByVersion = {
  "1.0.1": [
    {
      icon: "grid-view",
      title: "Personalize your view",
      description:
        "Switch between dots and squares to customize how your dots look",
    },
    {
      icon: "event",
      title: "Add a custom date view",
      description: "Track special moments with a dedicated countdown view",
    },
    {
      icon: "calendar-today",
      title: "Travel in time",
      description: "Explore your dots from any past or future date",
    },
  ],
  "1.0.0": ["Initial release", "Basic features"],
};
const WhatsNewModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [features, setFeatures] = useState([] as any);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const storedVersion = await AsyncStorage.getItem("appVersion");
        if (storedVersion !== CURRENT_VERSION) {
          setShowModal(true);
          setFeatures(featuresByVersion[CURRENT_VERSION] || []);
          await AsyncStorage.setItem("appVersion", CURRENT_VERSION);
        }
      } catch (error) {
        console.error("Error accessing AsyncStorage:", error);
      }
    };

    checkVersion();
  }, []);

  return (
    <Modal visible={showModal} animationType="slide">
      <View className="flex-1 bg-white p-6">
        <Image
          source={require("../assets/icons/default.png")}
          style={{
            width: 100,
            height: 100,
            marginHorizontal: "auto",
            marginVertical: 20,
          }}
        />

        <Text className="text-4xl font-bold text-primary mb-8">
          Novedades de Monedo
        </Text>

        <View className="flex flex-col gap-8">
          {features.map((feature: Feature, index: number) => (
            <View key={index} className="flex-row flex gap-4">
              <MaterialIcons
                name={
                  feature.icon as React.ComponentProps<
                    typeof MaterialIcons
                  >["name"]
                }
                size={24}
                color="black"
              />
              <View className="flex-1">
                <Text className="text-lg font-mono mb-1">{feature.title}</Text>
                <Text className="text-base font-mono text-gray-600">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Button className="mt-10" onPress={() => setShowModal(false)}>
          <Text className="text-white text-lg font-mono">Continuar</Text>
        </Button>
      </View>
    </Modal>
  );
};

export default WhatsNewModal;
