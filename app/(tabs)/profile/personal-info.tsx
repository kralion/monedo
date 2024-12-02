import { useAuth, useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";

interface FormData {
  name: string;
  lastName: string;
  imageUrl: string;
}

export default function PersonalInfo() {
  const { user: userData } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
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
    <SafeAreaView>
      <View className="flex flex-col gap-5 px-4 pt-10">
        <View className="flex flex-col items-center">
          <View className="relative  flex flex-col gap-3">
            <Avatar
              alt="profile"
              className="rounded-full bg-teal-500 align-middle w-36 h-36"
            >
              <AvatarImage
                accessibilityLabel="avatar"
                source={{
                  uri: userData?.imageUrl,
                }}
              />
              <AvatarFallback className="bg-slate-500" />
            </Avatar>
            <Button
              onPress={pickImageAsync}
              className="absolute rounded-full  top-5 -right-5  w-12 h-12  border-white border-2"
              size="icon"
            >
              <Camera color="white" />
            </Button>
            <Badge
              className={`flex flex-row gap-1 py-2  justify-center bg-${
                has?.({ permission: "premium:plan" })
                  ? "green-500"
                  : "orange-500"
              }
                    text-white `}
            >
              <Text className="text-md">
                Cuenta{" "}
                {has?.({ permission: "premium:plan" }) ? "Premium" : "Free"}
              </Text>
            </Badge>
          </View>
        </View>
        <View className="flex flex-col mt-3 gap-6">
          <View className="flex flex-col  gap-2">
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
          <View className="flex flex-col gap-2">
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
          onPress={() =>
            Alert.alert(
              "Eliminar Cuenta",
              "Todos los datos relacionados a esta cuenta serán eliminados"
            )
          }
          size="lg"
          variant="destructive"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text>Eliminar Cuenta</Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
