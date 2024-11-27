import { Image } from "expo-image";
import { Button, Text, YStack } from "tamagui";

export default function Yape() {
  return (
    <YStack py="$3" gap="$6">
      <YStack gap="$2">
        <Text>Número de Teléfono</Text>
        <Button
          disabled
          chromeless
          variant="outlined"
          size="$5"
          fontWeight="bold"
        >
          914 019 629
        </Button>
      </YStack>
      <YStack gap="$2">
        <Text>Monto de yapeo</Text>

        <Button
          disabled
          chromeless
          variant="outlined"
          size="$5"
          fontWeight="bold"
        >
          S/. 15.00
        </Button>
      </YStack>
      <Text fontSize="$3" color="$gray9">
        El último paso es mandarnos una captura al WhatsApp del yapeo a este
        número
        <Text fontWeight="bold"> 914 019 929</Text>
      </Text>
      <Button mt="$5" bg="$purple8Dark" size="$5" color="$white1">
        Abrir Yape
      </Button>
    </YStack>
  );
}
