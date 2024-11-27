import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Image, View } from "react-native";
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
    <SafeAreaView
      style={{
        paddingHorizontal: 16,
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="flex flex-col gap-5 w-full">
        <View className="flex flex-col align-middle gap-1">
          <Image
            style={{
              width: 125,
              height: 125,
            }}
            source={require("../../assets/logo.png")}
          />
          <Text className="text-2xl font-bold"> Inicia Sesión</Text>
          <Text className="text-center">
            Para empezar a usar y disfrutar de Monex
          </Text>
        </View>
        <View className="space-y-4">
          <SignInWithOAuthGoogle />
          <SignInWithOAuthFacebook />
          <SignInWithOAuthTiktok />
        </View>

        <View className="flex gap-2 justify-center align-middle">
          <Text className="text-textmuted text-center">
            ¿No tienes una cuenta?
          </Text>
          <Text
            onPress={() => router.push("/(auth)/sign-up")}
            className="text-primary active:underline"
          >
            Regístrate
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const SignInWithOAuthGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "roomy" }),
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
    <Button variant="outline" size="lg" onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://img.icons8.com/?size=96&id=17949&format=png",
        }}
        alt="google"
      />
      Continuar con Google
    </Button>
  );
};
export const SignInWithOAuthTiktok = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "roomy" }),
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
    <Button variant="outline" size="lg" onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/3046/3046121.png",
        }}
        alt="tiktok"
      />
      Continuar con TikTok
    </Button>
  );
};
export const SignInWithOAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)", { scheme: "roomy" }),
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
    <Button variant="outline" size="lg" onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
        }}
        alt="Facebook"
      />
      Continuar con Facebook
    </Button>
  );
};
