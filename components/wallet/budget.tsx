import { IBudget } from "@/interfaces";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
export function Budget({ budget }: { budget: IBudget }) {
  const date = new Date(budget.created_At);

  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });

  const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expireDate = expire.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push(`/wallet/details/${budget.id}`);
        }}
        className="card active:opacity-80"
      >
        <View className="card-header flex flex-row justify-between items-center px-2 py-4">
          <View className="card-title flex flex-row items-center gap-2">
            <Image
              width={45}
              height={45}
              source={{
                uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
              }}
            />
            <View className="card-title-details flex flex-col gap-1">
              <Text className="text-xl">S/. {budget.amount}</Text>
              <Text className="text-xs text-muted-foreground">
                Registro : {formattedDate}
              </Text>
            </View>
          </View>
          <View className="card-description flex flex-row items-center justify-between">
            <View className="card-description-amount flex flex-row gap-2 items-center">
              <Text className="font-bold">Exp. {expireDate}</Text>
              <Button variant="ghost" size="icon">
                <ChevronRight size={20} color="gray" />
              </Button>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Separator />
    </>

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
