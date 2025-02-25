import { useAuth, useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  const { signOut } = useAuth();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await user?.delete();
      await signOut();
      alert("Se ha cerrado la sesión");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setIsDeleting(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "¿Estás seguro?",
      "Esta acción eliminará todos los datos de tu cuenta y no se puede deshacer",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar cuenta",
          onPress: deleteAccount,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

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
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex-1 px-4 pt-10">
          {/* Profile Avatar Section */}
          <View className="items-center mb-6">
            <Avatar alt="profile" className="w-36 h-36 rounded-full">
              <AvatarImage source={{ uri: user.imageUrl }} />
              <AvatarFallback />
            </Avatar>
          </View>

          {/* Profile Update Form */}
          <View className="flex flex-col gap-4 mt-6">
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
            <View className="flex flex-col gap-2">
              <Label>Email</Label>
              <Button
                variant="outline"
                disabled
                size="lg"
                className="font-bold"
              >
                <Text> {user.primaryEmailAddress?.emailAddress}</Text>
              </Button>
            </View>
            <View className="flex flex-col gap-4 mt-10">
              {/* Submit Button */}
              <Button size="lg" onPress={handleSubmit(onSubmit)} disabled={isUpdating}>
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Guardar Cambios</Text>
                )}
              </Button>
              <Button
                size="lg"
                onPress={handleDeleteAccount}
                variant="ghost"
                disabled={isUpdating}
              >
                {isDeleting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-red-500">Eliminar Cuenta</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
