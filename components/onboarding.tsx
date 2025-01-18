import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Alert, Image, useColorScheme } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Button } from "./ui/button";
import { ChevronRightIcon } from "lucide-react-native";
import { Text } from "./ui/text";

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const colorScheme = useColorScheme();
  const handleDone = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
      onComplete();
    } catch (error) {
      console.error("Error setting AsyncStorage:", error);
      Alert.alert(
        "Error",
        "Failed to save onboarding status. Please try again."
      );
    }
  };

  return (
    <Onboarding
      pages={[
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#81DFBB",
          image: <Image source={require("../assets/images/onboarding.gif")} />,
          title: "Bienvenido a Monedo",
          subtitle:
            "La manera mas sencilla de trackear tus ingresos y egresos.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#81DFBB",
          image: <Image source={require("../assets/images/onboarding4.gif")} />,
          title: "Registra tus ingresos",
          subtitle: "Agrega a tu billetera los ingresos que vayas a recibir.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#81DFBB",
          image: <Image source={require("../assets/images/onboarding2.gif")} />,
          title: "Registro de gastos",
          subtitle:
            "Cada vez que realizar un gasto, regístralo en Monedo para mantenerte al tanto.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#81DFBB",
          image: <Image source={require("../assets/images/onboarding6.gif")} />,
          title: "Crea Categorías",
          subtitle:
            "Crea categorías personalizadas para los diferentes tipos de gastos que realices.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#81DFBB",
          image: (
            <Image
              style={{ width: 350, height: 350 }}
              source={require("../assets/images/onboarding7.gif")}
            />
          ),
          title: "Exporta tu reporte",
          subtitle:
            "Exporta en PDF tu reporte de ingresos y gastos para una vista mas clara.",
        },
        {
          backgroundColor: colorScheme === "dark" ? "#000" : "#81DFBB",
          image: (
            <Image
              style={{ width: 350, height: 300 }}
              source={require("../assets/images/onboarding5.gif")}
            />
          ),
          title: "Análisis y Estadísticas",
          subtitle:
            "Visualiza de manera didáctica tus gastos realizados en periodos de tiempo.",
        },
      ]}
      containerStyles={{
        backgroundColor: colorScheme === "dark" ? "#000" : "#41D29B",
        padding: 16,
      }}
      bottomBarColor={colorScheme === "dark" ? "#000" : "#41D29B"}
      DoneButtonComponent={(props) => (
        <Button hitSlop={16} {...props}>
          <Text>Empezar</Text>
        </Button>
      )}
      NextButtonComponent={(props) => (
        <Button hitSlop={16} className="rounded-full" size="icon" {...props}>
          <ChevronRightIcon color="black" />
        </Button>
      )}
      SkipButtonComponent={(props) => (
        <Button variant="ghost" {...props}>
          <Text>Omitir</Text>
        </Button>
      )}
      onDone={handleDone}
      onSkip={handleDone}
    />
  );
};

export default OnboardingScreen;
