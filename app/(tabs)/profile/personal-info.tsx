import { useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

type FormData = {
  firstName: string;
  lastName: string;
};

export default function PersonalInfoScreen() {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!isLoaded) {
    return null;
  }
  if (!user) return null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsUpdating(true);
    try {
      await user.update(data);
      alert("Profile updated successfully!");
      reset();
    } catch (err) {
      console.error("Error updating user:", err);
    }
    setIsUpdating(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-4 pt-10">
          {/* Profile Avatar Section */}
          <View className="items-center mb-6">
            <Avatar alt="profile" className="w-36 h-36 rounded-full">
              <AvatarImage source={{ uri: user.imageUrl }} />
              <AvatarFallback />
            </Avatar>

            <Badge className="mt-4 px-4 py-2 border border-blue-200 bg-blue-100">
              <Text className="text-blue-500 text-md">
                {user.primaryEmailAddress?.emailAddress}
              </Text>
            </Badge>
          </View>

          {/* Profile Update Form */}
          <View className="flex flex-col gap-8 mt-6">
            {/* First Name Input */}
            <View className="flex flex-col gap-2 ">
              <Label>Nombres</Label>
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: "El nombre es requerido",
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: "Solo se permiten letras",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ingresa tu nombre"
                  />
                )}
              />
              {errors.firstName && (
                <Text className="text-red-500 mt-1">
                  {errors.firstName.message}
                </Text>
              )}
            </View>

            {/* Last Name Input */}
            <View className="flex flex-col gap-2">
              <Label>Apellidos</Label>
              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: "Los apellidos son requeridos",
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: "Solo se permiten letras",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ingresa tus apellidos"
                  />
                )}
              />
              {errors.lastName && (
                <Text className="text-red-500 mt-1">
                  {errors.lastName.message}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <Button onPress={handleSubmit(onSubmit)} disabled={isUpdating}>
              {isUpdating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Guardar Cambios</Text>
              )}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
