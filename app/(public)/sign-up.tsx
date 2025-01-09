import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TermsPolicyModal } from "~/components/auth/terms&policy";
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

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <ScrollView>
      <SafeAreaView className="flex flex-col justify-center align-middle p-4 items-center h-[100vh]">
        <View className="flex flex-col gap-12 h-screen-safe justify-center">
          <View className="flex flex-col items-center gap-1">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/logo.png")}
            />
            <Text className="text-4xl font-bold"> Crea una cuenta</Text>
            <View className="flex gap-1.5 flex-row">
              <Text>Ya tienes una cuenta?</Text>

              <Text
                className="text-primary active:underline dark:text-primary"
                onPress={() => router.back()}
              >
                Inicia Sesión
              </Text>
            </View>
          </View>

          <View className="flex flex-col gap-4">
            <SignInWithOAuthGoogle />
            <SignInWithOAuthFacebook />
            <SignInWithOAuthTiktok />
          </View>
          <View className="flex flex-col  w-full">
            <Text className=" text-sm ">
              Al continuar aceptas las politicas de privacidad y demas clausulas
              , en estos se describen como usamos tus datos y como protegemos tu
              privacidad.
            </Text>
            <TermsPolicyModal />
          </View>
          <View className="flex flex-row justify-center align-middle absolute text-center w-full -bottom-24 ">
            <Text className="text-sm ">
              Copyright @ {new Date().getFullYear()} Monedo | Desarrollado por
            </Text>
            <Text className="text-sm text-primary active:underline">
              <Link href="https://x.com/brayanpaucar_"> Brayan</Link>
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
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(auth)/(tabs)", { scheme: "roomy" }),
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
      <Text className="text-black dark:text-black">Continuar con Google</Text>
    </Button>
  );
};
export const SignInWithOAuthTiktok = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(auth)/(tabs)", { scheme: "roomy" }),
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
      <Text className="text-black dark:text-black">Continuar con TikTok</Text>
    </Button>
  );
};
export const SignInWithOAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(auth)/(tabs)", { scheme: "roomy" }),
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
      <Text className="text-black dark:text-black">Continuar con Facebook</Text>
    </Button>
  );
};
