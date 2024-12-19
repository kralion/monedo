import { INotification } from "@/interfaces/notification";
import { View } from "react-native";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
const iconos = {
  INFO: "https://img.icons8.com/?size=100&id=VQOfeAx5KWTK&format=png&color=000000",
  WARNING: "https://img.icons8.com/?size=48&id=12116&format=png",
  ERROR: "https://img.icons8.com/?size=48&id=12226&format=png",
};

export default function SingleNotification({
  notification,
}: {
  notification: INotification;
}) {
  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday =
      date.getDate() === today.getDate() - 1 &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return "hoy";
    } else if (isYesterday) {
      return "ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  return (
    <View className="flex-row bg-white px-4 items-center gap-1">
      <Avatar alt="User">
        <AvatarImage source={{ uri: iconos[notification.tipo] }} />
      </Avatar>

      <View className="flex-1 border-t border-gray-100 p-2">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-gray-900">
            {notification.titulo.toUpperCase()}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDate(notification.fecha)}
          </Text>
        </View>

        <Text className="text-sm text-gray-600 leading-5">
          {notification.descripcion.slice(0, 100)}...
        </Text>
      </View>
    </View>
  );
}
