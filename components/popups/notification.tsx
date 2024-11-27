import { INotification } from "@/interfaces/notification";
import { Image } from "expo-image";
import { ListItem, Text } from "tamagui";

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
    <ListItem
      borderRadius={14}
      alignSelf="center"
      mx={2}
      mb={4}
      mt="$3"
      width="97%"
      title={notification.titulo}
      icon={
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
      }
      subTitle={descripcion}
      iconAfter={<Text fontSize="$2">{formatDate(fecha)}</Text>}
    />
  );
}
