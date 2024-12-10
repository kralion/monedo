import ExportAsset from "@/assets/svgs/export.svg";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Print from "expo-print";
import React from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useExpenseContext } from "~/context";
export default function Export() {
  const headerHeight = useHeaderHeight();
  const { weeklyExpenses, getWeeklyExpenses } = useExpenseContext();
  const totalAmount = weeklyExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  React.useEffect(() => {
    getWeeklyExpenses();
  }, []);
  const generateHTML = () => {
    return `
     <html>
      <head>
        <style>
          {/* Paste the provided CSS styles here */}
          @page {
            size: 80mm auto;
            margin: 0;
          }

          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            margin: 0;
            padding: 5mm;
            box-sizing: border-box;
          }

          /* Para impresión */
          @media print {
            body {
              width: 80mm;
            }

            .page-break {
              page-break-after: always;
            }
          }

          .logo {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
          }

          .logo img {
            max-width: 150px;
            height: auto;
            margin: 0 auto;
            display: block;
          }

          .header-info {
            font-size: 12px;
            text-align: center;
            margin-bottom: 20px;
          }

          .table-info {
            margin-bottom: 15px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }

          .items {
            width: 100%;
            margin-bottom: 15px;
          }

          .items td {
            padding: 3px 0;
          }

          .price-col {
            text-align: right;
          }

          .total-section {
            border-top: 1px solid #ccc;
            padding-top: 10px;
            margin-top: 10px;
          }

          .datetime {
            text-align: center;
            font-size: 12px;
            margin-top: 10px;
          }

          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="logo">
          <img src="../../../assets/logo.png" alt="Logo" />
        </div>
        <table class="items">
          <tr>
            <th align="left">Descripción</th>
            <th align="center">Fecha Registro</th>
            <th align="right">Monto</th>
          </tr>
          ${weeklyExpenses.map(
            (expense) => `
            <tr key=${expense.id}>
              <td>${expense.description}</td>
              <td align="center">${expense.date.toLocaleDateString()}</td>
              <td className="price-col">S/. ${expense.amount.toFixed(2)}</td>
            </tr>
          `
          )}
        </table>
        <div class="total-section">
          <table width="100%">
            <tr>
              <td>
                <strong>Total:</strong>
              </td>
              <td align="right">
                <strong>S/. ${totalAmount.toFixed(2)}</strong>
              </td>
            </tr>
          </table>
        </div>

        <div class="datetime">
          Fecha: ${new Date().toLocaleDateString()}<br />
          Hora: ${new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div class="footer">
          REPORTE SEMANAL<br />
        </div>
      </body>
    </html>
    `;
  };
  const printOrder = async () => {
    const html = generateHTML();
    await Print.printAsync({
      html,
    });
  };
  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <View className="flex flex-col gap-4 p-4 items-center">
        <ExportAsset width={300} height={300} />
        <View className="flex flex-col gap-2 mx-auto">
          <Text className="text-2xl font-bold text-center ">
            Formatos de exportación
          </Text>
          <Text className="text-md text-muted-foreground text-center">
            Selecciona el formato en el que quieres exportar tus historiales de
            gasto y demás.
          </Text>
        </View>

        <View className="flex flex-col mt-10 gap-3 w-full">
          <Button
            size="lg"
            variant="outline"
            className="flex flex-row gap-2 items-center"
            disabled
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=48&id=13674&format=png",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text> Documento</Text>
          </Button>
          <Button
            size="lg"
            className="flex flex-row gap-2 items-center"
            variant="outline"
            disabled
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=48&id=13654&format=png",
              }}
              style={{ width: 30, height: 30 }}
            />

            <Text> Hoja de Cálculo</Text>
          </Button>
          <Button
            size="lg"
            className="flex flex-row gap-2 items-center"
            variant="outline"
            onPress={() => printOrder()}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=48&id=13417&format=png",
              }}
              style={{ width: 30, height: 30 }}
            />

            <Text> Archivo PDF</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
