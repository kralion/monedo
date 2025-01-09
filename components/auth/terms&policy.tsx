import { FlatList, ScrollView } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export function TermsPolicyModal() {
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
    <Dialog className="rounded-xl">
      <DialogTrigger asChild>
        <Text className="text-primary active:underline active:opacity-80 dark:text-primary">
          Términos y Condiciones
        </Text>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] h-[85%] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Términos y Condiciones</DialogTitle>
          <DialogDescription>
            Bienvenido a la plataforma de la aplicación móvil de{" "}
            <Text className="font-bold">Roomy</Text>. El objetivo de esta
            aplicación es facilitar el acceso a los servicios de Expense Tracker
            y a la información relacionada con los mismos, así como la
            realización de operaciones relacionadas con la aplicación. El uso de
            esta aplicación se rige por los términos y condiciones que se
            describen a continuación, clasificados por secciones.
          </DialogDescription>
        </DialogHeader>

        <Accordion
          type="multiple"
          collapsible
          defaultValue={["item-1"]}
          className="w-full max-w-sm native:max-w-md"
        >
          <FlatList
            renderItem={({ item }) => (
              <AccordionItem value={item.id}>
                <AccordionTrigger>
                  <Text className="font-semibold text-lg">{item.title}</Text>
                </AccordionTrigger>
                <AccordionContent>
                  <Text>{item.content}</Text>
                </AccordionContent>
              </AccordionItem>
            )}
            keyExtractor={(item) => item.id.toString()}
            data={sections}
          />
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
