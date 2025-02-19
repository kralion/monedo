import { LegendList } from "@legendapp/list";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { Text, View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function TermsConditions() {
  const headerHeight = useHeaderHeight();
  const sections = [
    {
      id: "intro",
      title: "Introducción",
      content:
        "Al utilizar nuestra aplicación de seguimiento de gastos Monedo, aceptas estos Términos y Condiciones. La Aplicación está diseñada para ayudarte a gestionar tus finanzas personales mediante el registro de ingresos y egresos.",
    },
    {
      id: "a1",
      title: "1. Datos Personales",
      content:
        "Recopilamos únicamente información esencial para el funcionamiento del servicio: nombre, email y credenciales de acceso. No almacenamos datos financieros sensibles ni información de tarjetas de crédito/débito.",
    },
    {
      id: "a2",
      title: "2. Privacidad y Seguridad",
      content:
        "Implementamos cifrado SSL para proteger tus datos. Aunque empleamos medidas de seguridad estándar de la industria, no podemos garantizar protección absoluta contra accesos no autorizados. Recomendamos usar contraseñas complejas y actualizarlas periódicamente.",
    },
    {
      id: "a3",
      title: "3. Propiedad Intelectual",
      content:
        "Todos los derechos de la Aplicación (interfaz, algoritmos, diseño) son propiedad exclusiva nuestra. Queda prohibida la reproducción, modificación o ingeniería inversa del software.",
    },
    {
      id: "a4",
      title: "4. Limitación de Responsabilidad",
      content:
        "No nos hacemos responsables por: a) Pérdidas financieras derivadas del uso de la Aplicación b) Errores en el registro manual de datos c) Interrupciones del servicio por causas técnicas d) Decisiones tomadas basadas en los informes generados.",
    },
    {
      id: "a5",
      title: "5. Retención de Datos",
      content:
        "Conservaremos tu información durante 12 meses tras la desactivación de la cuenta. Puedes solicitar eliminación permanente mediante opción en tu perfil. Los datos anonimizados podrán conservarse para análisis estadísticos.",
    },
    {
      id: "a6",
      title: "6. Modificaciones del Servicio",
      content:
        "Nos reservamos el derecho de actualizar, modificar o discontinuar características de la Aplicación. Notificaremos cambios sustanciales mediante email o notificación en la plataforma.",
    },
    {
      id: "a7",
      title: "7. Términos de Pago",
      content:
        "Actualmente la Aplicación cuenta con 2 planes de pago: gratis y premium. En caso de adquirir el plan premium, se notificará al usuario con 5 días de anticipación el pago del primer cargo y requerirá consentimiento expreso para cargos.",
    },

    {
      id: "a8",
      title: "8. Cookies y Analíticos",
      content:
        "Utilizamos cookies técnicas para funcionalidad básica y cookies de rendimiento para métricas de uso. Puedes desactivarlas en configuración, aunque esto podría afectar algunas funciones.",
    },
    {
      id: "a9",
      title: "9. Exención de Asesoramiento Financiero",
      content:
        "La Aplicación es una herramienta de registro, no provee asesoramiento financiero profesional. Los informes generados no constituyen recomendaciones de inversión o manejo patrimonial.",
    },
    {
      id: "a10",
      title: "10. Términos Generales",
      content:
        "Nos reservamos el derecho de suspender cuentas por actividades sospechosas. La vigencia es indefinida hasta terminación por alguna de las partes. Para dudas, contactar a brayanjoanpm@gmail.com.",
    },
  ];

  return (
    <View
      className="bg-white  dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
      style={{ paddingTop: headerHeight }}
    >
      <Accordion
        type="multiple"
        className="w-full max-w-sm native:max-w-md"
        collapsible
        defaultValue={["a1", "a2", "a3", "a4", "a5"]}
      >
        <LegendList
          estimatedItemSize={500}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <Text className="text-gray-800 dark:text-white   ">
              Bienvenido a la plataforma de la aplicación móvil de{" "}
              <Text className="font-bold">Monedo</Text>. El objetivo de esta
              aplicación es facilitar el seguimiento de los egresos e ingresos
              del usuario. El uso de esta aplicación se rige por los términos y
              condiciones que se describen a continuación, clasificados por
              secciones.
            </Text>
          }
          renderItem={({ item }) => (
            <AccordionItem value={item.id}>
              <AccordionTrigger>
                <Text className="font-semibold text-lg text-black dark:text-white">
                  {item.title}
                </Text>
              </AccordionTrigger>
              <AccordionContent>
                <Text className="text-muted-foreground dark:text-white">
                  {item.content}
                </Text>
              </AccordionContent>
            </AccordionItem>
          )}
          keyExtractor={(item) => item.id.toString()}
          data={sections}
        />
      </Accordion>
    </View>
  );
}
