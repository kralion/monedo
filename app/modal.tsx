import { View } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Modal() {
  return (
    <View className="p-4">
      <Text>Modal</Text>
      <Button
        variant="default"
        size="lg"
        onPress={() => console.log("Pressed")}
      >
        <Text>Update</Text>
      </Button>
    </View>
  );
}
