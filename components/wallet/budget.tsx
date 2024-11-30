import { IBudget } from "@/interfaces";
import * as React from "react";
import { Image, View } from "react-native";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
export function Budget({ budget }: { budget: IBudget }) {
  const [openBudgetDetails, setOpenBudgetDetails] = React.useState(false);
  const date = new Date(budget.created_At); // Parse the original date
  const date2 = new Date(budget.created_At); // Parse the original date
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "2-digit",
    year: "numeric",
    day: "numeric",
  });

  return (
    <Card className=" active:opacity-80 rounded-xl mb-5">
      <CardHeader className="flex flex-row justify-between items-center p-3">
        <CardTitle
          onPress={() => {
            router.push(`/wallet/details/${budget.id}`);
          }}
        >
          <View className="flex flex-row items-center gap-2">
            <Image
              width={45}
              height={45}
              source={{
                uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
              }}
            />

            <Text className="text-2xl tracking-tight font-semibold">
              S/. {budget.amount}
            </Text>
          </View>
        </CardTitle>
        <CardDescription>
          <View className="flex flex-row gap-2 items-center">
            <Text className="text-muted-foreground">{formattedDate} </Text>
            <Button variant="ghost" size="icon">
              <ChevronRight size={20} color="gray" />
            </Button>
          </View>
        </CardDescription>
      </CardHeader>
    </Card>
    // {/* <Sheet
    //   zIndex={100_000}
    //   snapPointsMode="fit"
    //   animation="medium"
    //   modal
    //   open={openBudgetDetails}
    //   onOpenChange={setOpenBudgetDetails}
    // >
    //   <Sheet.Handle />
    //   <Sheet.Overlay
    //     animation="100ms"
    //     enterStyle={{ opacity: 0 }}
    //     exitStyle={{ opacity: 0 }}
    //   />
    //   <Sheet.Frame p="$5">
    //     <H3>Detalles</H3>
    //     <Text color="$gray10">
    //       Mostrando información relevante sobre el presupuesto seleccionado.
    //     </Text>

    //     <YStack gap="$4" mt="$5">
    //       <H2>S/. {monto.toFixed(2)}</H2>
    //       <YStack gap="$1">
    //         <Text>Fecha Registro</Text>
    //         <Text fontWeight="bold">
    //           {date.toLocaleDateString("es-ES", {
    //             day: "numeric",
    //             month: "long",
    //             year: "numeric",
    //           })}
    //         </Text>
    //       </YStack>
    //       <YStack gap="$1">
    //         <Text className="font-bold">Fecha Expiración</Text>
    //         <Text fontWeight="bold">
    //           {endDate.toLocaleDateString("es-ES", {
    //             day: "numeric",
    //             month: "long",
    //             year: "numeric",
    //           })}
    //         </Text>
    //       </YStack>
    //       <YStack gap="$1">
    //         <Text>Descripcion</Text>
    //         <Text>{descripcion}</Text>
    //       </YStack>
    //     </YStack>
    //     <Button
    //       my="$5"
    //       size="$5"
    //       bg="$green9Light"
    //       color="$white1"
    //       onPress={() => {
    //         alert("La funcionalidad aun no esta disponible");
    //       }}
    //     >
    //       Editar
    //     </Button>
    //   </Sheet.Frame>
    // </Sheet> */}
  );
}
