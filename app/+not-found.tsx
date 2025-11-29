import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function NotFoundScreen() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View>
        <Text>This screen doesn't exist.</Text>

        <Link href="/(auth)/(tabs)">
          <Button variant="link">
            <Text>Go to home screen!</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
