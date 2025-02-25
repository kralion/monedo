import { useUser } from "@clerk/clerk-expo";
import { Send } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
const pageId = process.env.EXPO_PUBLIC_NOTION_DATABASE_ID!;
const apiKey = process.env.EXPO_PUBLIC_NOTION_TOKEN!;
export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const { user } = useUser();
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);
  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    try {
      setIsSendingFeedback(true);
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: pageId },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: ` ${user?.firstName || "Anonymous"}`,
                  },
                },
              ],
            },
            Message: {
              rich_text: [
                {
                  text: {
                    content: feedback,
                  },
                },
              ],
            },
          },
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Notion API Error:", responseData);
      }

      toast.success("¡Feedback enviado con éxito!");
    } catch (error) {
      toast.error("No se pudo enviar el feedback");
    } finally {
      setIsSendingFeedback(false);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-gray-100 p-4 dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
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
          onPress={handleSendFeedback}
          disabled={!feedback.trim() || isSendingFeedback}
          className="flex flex-row gap-2 items-center"
          size="lg"
        >
          {isSendingFeedback ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text>Enviar Feedback</Text>
              <Send color="black" size={18} />
            </>
          )}
        </Button>
      </View>
    </ScrollView>
  );
}
