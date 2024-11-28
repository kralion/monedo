import { INotification } from "@/interfaces/notification";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Image, View } from "react-native";
import { Text } from "../ui/text";
const iconos = {
  INFO: "https://img.icons8.com/?size=48&id=63308&format=png",
  WARNING: "https://img.icons8.com/?size=48&id=12116&format=png",
  ERROR: "https://img.icons8.com/?size=48&id=12226&format=png",
};

export default function SingleNotification({
  notification,
}: {
  notification: INotification;
}) {
  const { descripcion, fecha } = notification;
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
    <Card className="rounded-xl mx-2 mb-4 mt-3 w-full">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex flex-row items-center gap-1">
          <View className="flex flex-col gap-1">
            <Text>{notification.titulo}</Text>
            <Text>{descripcion}</Text>
          </View>
          <Image
            style={{
              width: 40,
              height: 40,
            }}
            source={{
              uri:
                notification.tipo === "INFO"
                  ? iconos.INFO
                  : notification.tipo === "WARNING"
                  ? iconos.WARNING
                  : iconos.ERROR,
            }}
          />
        </CardTitle>
        <CardDescription>
          <Text className="text-xs">{formatDate(fecha)}</Text>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
