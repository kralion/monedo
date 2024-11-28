import { useAuth, useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface FormData {
  name: string;
  lastName: string;
  imageUrl: string;
}

export default function PersonalInfo() {
  const { user: userData } = useUser();
  const { has } = useAuth();
  const headerHeight = useHeaderHeight();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.firstName,
      lastName: userData?.lastName,
      imageUrl: userData?.imageUrl,
    },
  });

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setValue("imageUrl", result.assets[0].uri);
    }
  };

  React.useEffect(() => {
    (async () => {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        alert("Aceptar los permisos para acceder a la galería");
      }
    })();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={{ paddingTop: headerHeight }}>
        <View className="flex flex-col gap-5 p-5">
          <View className="flex flex-col items-center">
            <View className="relative w-[100px] h-[100px]">
              <Avatar
                alt="profile"
                className="rounded-full bg-teal-500 align-middle w-36 h-36"
              >
                <AvatarImage
                  accessibilityLabel="avatar"
                  src={userData?.imageUrl}
                />
                <AvatarFallback className="bg-slate-500" />
              </Avatar>
              <Button
                onPress={pickImageAsync}
                className="abosolute rounded-full bg-white/50 top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 p-2 border-white border-2"
                size="icon"
              >
                <Camera size="$1.5" />
              </Button>
              <Button
                disabled
                size="lg"
                className={`
                  ${
                    has?.({ permission: "premium:plan" })
                      ? "bg-green-900"
                      : "bg-orange-10"
                  }
                    text-white mt-3 `}
              >
                {`Cuenta
                ${has?.({ permission: "premium:plan" }) ? "Premium" : "Free"}`}
              </Button>
            </View>
          </View>
          <Text className="text-4xl font-bold mt-5">Información Básica</Text>
          <View className="flex flex-col mt-3 gap-2">
            <View className="flex flex-col items-center">
              <Label className="text-sm" nativeID="firstName">
                Nombres
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ ...field }) => (
                  <Input value={userData?.firstName ?? ""} {...field} />
                )}
                rules={{
                  required: { value: true, message: "Ingrese el nombre" },
                  pattern: {
                    value: /^\d+(\.\d*)?$/,
                    message: "Solo se permiten números válidos",
                  },
                }}
              />
            </View>
            <View className="flex flex-col">
              <Label className="text-sm" nativeID="lastName">
                Apellidos
              </Label>
              <Controller
                control={control}
                name="lastName"
                render={({ ...field }) => (
                  <Input value={userData?.lastName ?? ""} {...field} />
                )}
                rules={{
                  required: { value: true, message: "Ingrese los apellidos" },
                  pattern: {
                    value: /^\d+(\.\d*)?$/,
                    message: "Solo se permiten números válidos",
                  },
                }}
              />
            </View>
          </View>
          <Button
            size="lg"
            className="mt-10"
            // onPress={handleSubmit(onSubmit)}
          >
            Actualizar Datos
          </Button>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
