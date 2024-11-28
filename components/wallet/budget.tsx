import { IBudget } from "@/interfaces";
import * as React from "react";
import { Image } from "react-native";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";
export function Budget({ budget }: { budget: IBudget }) {
  const { monto, fecha_final, descripcion, fecha_registro } = budget;
  const [openBudgetDetails, setOpenBudgetDetails] = React.useState(false);
  const date = new Date(fecha_final);
  const endDate = new Date(fecha_final);

  return (
    <Card className="active:opacity-80 rounded-xl mb-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex flex-row items-center gap-1">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
            }}
            style={{
              width: 45,
              height: 45,
            }}
          />
          <Text className="text-lg font-bold">
            {date
              .toLocaleDateString("es-ES", {
                month: "long",
              })
              .toUpperCase()}
          </Text>
        </CardTitle>
        <CardDescription className="flex flex-row items-center gap-1">
          <Text className="font-bold"> S/. {monto.toFixed(2)}</Text>
          <Text className="text-sm text-foreground/70">
            {endDate.toLocaleDateString("es-ES", {
              month: "2-digit",
              year: "numeric",
              day: "numeric",
            })}
          </Text>
        </CardDescription>
      </CardHeader>
      {/* <Sheet
        zIndex={100_000}
        snapPointsMode="fit"
        animation="medium"
        modal
        open={openBudgetDetails}
        onOpenChange={setOpenBudgetDetails}
      >
        <Sheet.Handle />
        <Sheet.Overlay
          animation="100ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame p="$5">
          <H3>Detalles</H3>
          <Text color="$gray10">
            Mostrando información relevante sobre el presupuesto seleccionado.
          </Text>

          <YStack gap="$4" mt="$5">
            <H2>S/. {monto.toFixed(2)}</H2>
            <YStack gap="$1">
              <Text>Fecha Registro</Text>
              <Text fontWeight="bold">
                {date.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </YStack>
            <YStack gap="$1">
              <Text className="font-bold">Fecha Expiración</Text>
              <Text fontWeight="bold">
                {endDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </YStack>
            <YStack gap="$1">
              <Text>Descripcion</Text>
              <Text>{descripcion}</Text>
            </YStack>
          </YStack>
          <Button
            my="$5"
            size="$5"
            bg="$green9Light"
            color="$white1"
            onPress={() => {
              alert("La funcionalidad aun no esta disponible");
            }}
          >
            Editar
          </Button>
        </Sheet.Frame>
      </Sheet> */}
    </Card>
  );
}
