import { IBudget } from "@/interfaces";
import { X } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import * as React from "react";
import { Button, H2, H3, ListItem, Sheet, Text, YStack } from "tamagui";
export function Budget({ budget }: { budget: IBudget }) {
  const { monto, fecha_final, descripcion, fecha_registro } = budget;
  const [openBudgetDetails, setOpenBudgetDetails] = React.useState(false);
  const date = new Date(fecha_final);
  const endDate = new Date(fecha_final);

  return (
    <ListItem
      onPress={() => {
        setOpenBudgetDetails(true);
      }}
      pressTheme
      pressStyle={{
        opacity: 0.8,
      }}
      borderRadius="$5"
      mb="$3"
      title={
        <Text fontSize="$5" fontWeight="700">
          {date
            .toLocaleDateString("es-ES", {
              month: "long",
            })
            .toUpperCase()}
        </Text>
      }
      icon={
        <Image
          source={{
            uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
          }}
          style={{
            width: 45,
            height: 45,
          }}
        />
      }
      subTitle={
        <Text>
          {endDate.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      }
      iconAfter={<Text fontWeight="bold"> S/. {monto.toFixed(2)}</Text>}
    >
      <Sheet
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
      </Sheet>
    </ListItem>
  );
}
