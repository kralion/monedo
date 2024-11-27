import { ChevronDown, X } from "@tamagui/lucide-icons";
import { FlatList } from "react-native";
import { useTheme } from "tamagui";
import { Button, Dialog, H3, ScrollView, Text, XStack, YStack } from "tamagui";

import { Accordion, Paragraph, Square } from "tamagui";

type TNotification = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function TermsPolicyModal({ openModal, setOpenModal }: TNotification) {
  const { theme } = useTheme();
  const isDarkMode = theme?.name === "dark";
  const sections = [
    {
      id: "a1",
      title: "Datos Personales",
      content:
        "En el marco de nuestra política de privacidad, llevamos a cabo una gestión meticulosa de tus datos personales. Nos comprometemos a resguardar su confidencialidad y seguridad en todo momento. Implementamos tecnologías y medidas de seguridad avanzadas para garantizar la integridad y protección de la información que nos confías.",
    },
    {
      id: "a2",
      title: "Privacidad y Seguridad",
      content:
        "La privacidad de nuestros usuarios es una prioridad fundamental. Para asegurar un entorno seguro, hemos implementado protocolos de seguridad robustos. Nuestro compromiso es mantener un alto estándar de protección y confidencialidad en cada interacción que tengas con nuestra plataforma. Valoramos la confianza que depositas en nosotros y trabajamos incansablemente para preservarla.",
    },
    {
      id: "a3",
      title: "Uso de Cookies",
      content:
        "Queremos informarte sobre nuestro uso de cookies. Estas pequeñas piezas de información nos permiten mejorar tu experiencia en nuestra plataforma. Puedes gestionar tus preferencias de cookies en cualquier momento desde la configuración de tu cuenta. A través de este mecanismo, personalizamos tu experiencia para proporcionarte un servicio más adaptado a tus necesidades y preferencias individuales.",
    },
    {
      id: "a4",
      title: "Consentimiento Informado",
      content:
        "Consentimiento Informado: Al utilizar nuestros servicios, otorgas tu consentimiento informado para el procesamiento de datos de acuerdo con nuestras políticas de privacidad. Este consentimiento es esencial para proporcionarte nuestros servicios de manera eficaz y personalizada. Queremos asegurarnos de que estés plenamente informado sobre cómo utilizamos y protegemos tus datos personales.",
    },
    {
      id: "a5",
      title: "Transparencia",
      content:
        "Nos comprometemos a operar con transparencia y responsabilidad en todas nuestras prácticas relacionadas con la privacidad y la seguridad de los datos. Buscamos crear un entorno en el que nuestros usuarios confíen plenamente en la forma en que manejamos su información. Estamos aquí para responder a tus preguntas y brindarte la información que necesitas para sentirte seguro y protegido al utilizar nuestros servicios.",
    },
  ];
  return (
    <ScrollView>
      <Dialog modal open={openModal} disableRemoveScroll>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="slow"
            background={isDarkMode ? "$gray8" : "$gray4"}
            opacity={0.7}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            p={0}
            bordered
            elevate
            borderRadius={16}
            bg={isDarkMode ? "$gray8" : "$gray4"}
            width="90%"
            height="90%"
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quicker",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{
              x: 0,
              y: -20,
              opacity: 0,
              scale: 0.9,
            }}
            exitStyle={{
              x: 0,
              y: 10,
              opacity: 0,
              scale: 0.95,
            }}
            gap="$4"
          >
            <YStack gap="$4" p="$4">
              <H3>Términos y Condiciones</H3>
              <YStack gap="$4">
                <Text>
                  Bienvenido a la plataforma de la aplicación móvil de{" "}
                  <Text fontWeight="bold">Monex</Text>. El objetivo de esta
                  aplicación es facilitar el acceso a los servicios de Expense
                  Tracker y a la información relacionada con los mismos, así
                  como la realización de operaciones relacionadas con la
                  aplicación. El uso de esta aplicación se rige por los términos
                  y condiciones que se describen a continuación, clasificados
                  por secciones.
                </Text>
              </YStack>
            </YStack>

            <Accordion type="multiple">
              <FlatList
                renderItem={({ item }) => (
                  <Accordion.Item value={item.id}>
                    <Accordion.Trigger
                      bg={isDarkMode ? "$gray8" : "$gray4"}
                      borderWidth={0}
                    >
                      {({ open }: { open: boolean }) => (
                        <XStack justifyContent="space-between">
                          <Paragraph>{item.title}</Paragraph>
                          <Square
                            animation="quick"
                            rotate={open ? "180deg" : "0deg"}
                          >
                            <ChevronDown size="$1" />
                          </Square>
                        </XStack>
                      )}
                    </Accordion.Trigger>
                    <Accordion.HeightAnimator animation="medium">
                      <Accordion.Content
                        bg={isDarkMode ? "$gray8" : "$gray4"}
                        animation="medium"
                        exitStyle={{ opacity: 0 }}
                      >
                        <Paragraph>{item.content}</Paragraph>
                      </Accordion.Content>
                    </Accordion.HeightAnimator>
                  </Accordion.Item>
                )}
                keyExtractor={(item) => item.id.toString()}
                data={sections}
              />
            </Accordion>
            <Button
              position="absolute"
              top="$5"
              right="$3"
              size="$2"
              circular
              icon={X}
              onPress={() => setOpenModal(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </ScrollView>
  );
}
