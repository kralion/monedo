import { Send } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Linking, ScrollView, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const handleSubmit = () => {
    const subject = encodeURIComponent("Monedo Feedback");
    const body = encodeURIComponent(`Feedback: ${feedback}`);
    const email = "brayanjoanpm@gmail.com";
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(mailto);
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-gray-100 p-4 dark:bg-zinc-900 web:md:w-1/2 mx-auto"
    >
      <View className="flex-1 mt-10">
        <Image
          source={require("assets/images/feedback.png")}
          className="h-48 w-48 mb-2 mx-auto"
        />
        <Text className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center  ">
          Escribe tus sugerencias !
        </Text>

        <Textarea
          className="w-full bg-white p-4 rounded-xl mb-4 text-gray-700"
          placeholder="Comparte tus ideas y sugerencias..."
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />

        <Button
          onPress={handleSubmit}
          className="flex flex-row gap-2 items-center"
        >
          <Text>Enviar Feedback</Text>
          <Send color="black" size={18} />
        </Button>
      </View>
    </ScrollView>
  );
}
