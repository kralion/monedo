import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  return (
    <ScrollView>
      <SafeAreaView className="flex flex-col justify-center align-middle p-4 items-center h-[100vh]">
        <View className="flex flex-col gap-16 w-full items-center">
          <View className="flex flex-col items-center gap-1">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/logo.png")}
            />
            <Text className="text-4xl font-bold"> Inicia Sesión</Text>
            <Text className="text-center">
              Para empezar a usar y disfrutar de Monedo
            </Text>
          </View>
          <View className="flex flex-col gap-4 justify-center align-middle w-full">
            <SignInWithOAuthGoogle />
            <SignInWithOAuthFacebook />
            <SignInWithOAuthTiktok />
          </View>

          <View className="flex flex-row gap-2 justify-center align-middle w-full">
            <Text className="text-textmuted text-center">
              ¿No tienes una cuenta?
            </Text>
            <Text
              onPress={() => router.push("/(public)/sign-up")}
              className="text-primary active:underline"
            >
              Regístrate
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export const SignInWithOAuthGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "monedo" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row gap-2 items-center"
      variant="outline"
      size="lg"
      onPress={onPress}
    >
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://img.icons8.com/?size=96&id=17949&format=png",
        }}
        alt="google"
      />
      <Text>Continuar con Google</Text>
    </Button>
  );
};
export const SignInWithOAuthTiktok = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "monedo" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row gap-2 items-center"
      variant="outline"
      size="lg"
      onPress={onPress}
    >
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/3046/3046121.png",
        }}
        alt="tiktok"
      />
      <Text>Continuar con TikTok</Text>
    </Button>
  );
};
export const SignInWithOAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "monedo" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row gap-2 items-center"
      variant="outline"
      size="lg"
      onPress={onPress}
    >
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
        }}
        alt="Facebook"
      />
      <Text>Continuar con Facebook</Text>
    </Button>
  );
};
