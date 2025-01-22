import * as QuickActions from "expo-quick-actions";
import { RouterAction } from "expo-quick-actions/router";
import React from "react";
import { Platform } from "react-native";

export default function QuickActionsSetup() {
  React.useEffect(() => {
    QuickActions.setItems<RouterAction>([
      {
        title: "Nuevo Gasto",
        icon: Platform.select({
          ios: "symbol:plus.circle",
          android: "asset:add_circle",
        }),
        id: "add-expense",
        params: { href: "/(auth)/(modals)/add-expense" },
      },
      {
        title: "Ver Reportes",
        icon: Platform.select({
          ios: "symbol:chart.bar.fill",
          android: "asset:bar_chart",
        }),
        id: "view-reports",
        params: { href: "/(auth)/(tabs)/statistics" },
      },
    ]);
  }, []);

  return null;
}
