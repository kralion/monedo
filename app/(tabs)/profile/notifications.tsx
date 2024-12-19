import SingleNotification from "@/components/popups/notification";
import { INotification } from "@/interfaces/notification";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import * as React from "react";
import { ScrollView } from "react-native";

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const { user: userData } = useUser();
  const supabase = createClerkSupabaseClient();

  const getNotifications = async () => {
    const { data, error } = await supabase
      .from("notificaciones")
      .select("*")
      .eq("usuario_id", userData?.id);
    if (error) {
      console.log(error);
      return;
    }
    setNotifications(data);
  };

  React.useEffect(() => {
    getNotifications();
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
    >
      {/* <FlashList
        data={notifications}
        renderItem={({ item }) => <SingleNotification notification={item} />}
        estimatedItemSize={20}
      /> */}
      <SingleNotification
        notification={{
          titulo: "BIENVENIDA",
          descripcion:
            "Esta es una notificacion de bienvenida para todos los usuarios de Monedo",
          id: "hola",
          tipo: "INFO",
          fecha: new Date().toISOString(),
        }}
      />
      <SingleNotification
        notification={{
          titulo: "ALERTA",
          descripcion:
            "Esta es una notificacion de bienvenida para todos los usuarios de Monedo",
          id: "hola",
          tipo: "WARNING",
          fecha: new Date().toISOString(),
        }}
      />
      <SingleNotification
        notification={{
          titulo: "ERROR",
          descripcion:
            "Esta es una notificacion de bienvenida para todos los usuarios de Monedo",
          id: "hola",
          tipo: "ERROR",
          fecha: new Date().toISOString(),
        }}
      />
    </ScrollView>
  );
}
