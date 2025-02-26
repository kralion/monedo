import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform, ScrollView, useWindowDimensions, View } from "react-native";
import SurfSvg from "@/assets/svgs/surf.svg";
import { Button } from "~/components/ui/button";
import * as AuthSession from "expo-auth-session";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Stack } from "expo-router";
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS !== "web") {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const isMobile = useWindowDimensions().width < 768;
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white  dark:bg-zinc-900 "
    >
      <View className="flex flex-col gap-12 h-screen-safe justify-center  web:pt-32 relative">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Image
            source={{
              uri: "https://img.icons8.com/?size=400&id=yUTNKgUuTlsA&format=png&color=000000",
            }}
            className="web:hidden"
            style={{
              width: 70,
              height: 70,
              position: "absolute",
              transform: [{ rotate: "-30deg" }],
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 5,
              left: -20,
            }}
          />
        </Animated.View>
        <Image
          source={{
            uri: "https://img.icons8.com/?size=400&id=2WTPiYe1pxGL&format=png&color=000000",
          }}
          className="web:hidden"
          style={{
            width: 100,
            height: 100,
            position: "absolute",
            transform: [{ rotate: "20deg" }],

            top: 0,
            right: 140,
          }}
        />
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <Image
            source={{
              uri: "https://img.icons8.com/?size=400&id=1sc9MKUuuZTD&format=png&color=000000",
            }}
            className="web:hidden"
            style={{
              width: 90,
              height: 90,
              position: "absolute",
              transform: [{ rotate: "-30deg" }],
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 5,

              right: 10,
            }}
          />
        </Animated.View>
        <SurfSvg
          style={{
            position: "absolute",
            bottom: isMobile ? -130 : -200,
            left: 0,
            height: isMobile ? "50%" : "100%",
            width: "100%",
            zIndex: -1,
          }}
          className="web:-bottom-[280]"
          preserveAspectRatio="xMidYMid slice"
        />
        <View className="flex flex-col items-center gap-1 px-4 ">
          <Image
            style={{
              width: 125,
              height: 125,
            }}
            source={require("../../assets/logo.png")}
          />
          <Text className="text-4xl font-bold text-center">
            Bienvenido a Monedo
          </Text>
          <Text className="text-center">
            Vincula una de tus cuentas para continuar
          </Text>
        </View>
        <View className="flex flex-col gap-4 justify-center align-middle w-full p-4 web:md:w-1/2 web:md:mx-auto">
          <SignInWithOAuthGoogle />
          <SignInWithOAuthFacebook />
          <SignInWithOAuthTiktok />
        </View>
      </View>
    </ScrollView>
  );
}

export const SignInWithOAuthGoogle = () => {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri(),
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

  const { startSSOFlow } = useSSO();

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startSSOFlow({
          strategy: "oauth_tiktok",
          redirectUrl: AuthSession.makeRedirectUri(),
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
      variant="secondary"
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

  const { startSSOFlow } = useSSO();

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startSSOFlow({
          strategy: "oauth_facebook",
          redirectUrl: AuthSession.makeRedirectUri(),
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
      variant="secondary"
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
