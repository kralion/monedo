import ExportAsset from "@/assets/svgs/export.svg";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useExpenseContext } from "~/context";
import { IExpense } from "~/interfaces";
import { getDateRange } from "~/lib/rangeDate";

export default function Export() {
  const headerHeight = useHeaderHeight();
  const { periodicity } = useLocalSearchParams();
  const { getExpensesByPeriodicity } = useExpenseContext();

  function formatDate(date: Date) {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  const printOrder = async () => {
    const data = await getExpensesByPeriodicity(
      getDateRange(String(periodicity))
    );
    const html = generateHTML(data as IExpense[], periodicity as string);
    await Print.printAsync({
      html,
    });
  };

  const generateHTML = (expenses: IExpense[], periodicity: string) => {
    return `
    <html>
<head>
    <style>
        @page {
            margin: 5;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
        }

        @media print {
           margin: 5;
        }

        .logo {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 100px;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        .header-info {
            font-size: 14px;
            text-align: center;
        }

        .datetime {
            text-align: center;
            font-size: 12px;
            opacity: 0.5;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 20px;
        }

        .cycle {
            text-align: center;
            opacity: 0.5;
            margin-bottom: 16px;
        }

        .table-info {
            margin-bottom: 15px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .items th, .items td {
            padding: 3px;
            text-align: left;
        }

        .items td {
            font-family: 'Courier New', monospace;
        }

        .price-col {
            text-align: right;
            padding-right: 70px;
        }

        .total-section {
            border-top: 1px solid #ccc;
            padding-top: 10px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="https://i.ibb.co/dt53QVB/logo.png" alt="Logo" />
    </div>

    <div class="header-info">
        <h2>Reporte de Gastos</h2>
    </div>

    <div class="cycle">
        <p>Frecuencia del Reporte: ${
          periodicity === "daily"
            ? "Diario"
            : periodicity === "weekly"
            ? "Semanal"
            : "Mensual"
        }</p>
    </div>
    <div class="total-section" />

    <table class="items">
        <thead>
            <tr>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Fecha Registro</th>
                <th class="price-col">Monto</th>
            </tr>
        </thead>
        <tbody>
            ${expenses
              .map(
                (expense) => `
                <tr key=${expense.id}>
                    <td>${expense.category.label}</td>
                    <td>${expense.description}</td>
                    <td align="center">${formatDate(
                      new Date(expense.date)
                    )}</td>
                    <td class="price-col">S/. ${expense.amount.toFixed(2)}</td>
                </tr>
                `
              )
              .join("")}
        </tbody>
    </table>

    <div class="total-section">
        <table width="100%">
            <tr>
                <td><strong>Total:</strong></td>
                <td class="price-col"><strong>S/. ${expenses
                  .reduce((acc, expense) => acc + expense.amount, 0)
                  .toFixed(2)}</strong></td>
            </tr>
        </table>
    </div>
    <div class="total-section" />


    <div class="datetime">
        Fecha de Emisión: ${new Date().toLocaleDateString()}<br />
        Hora de Emisión: ${new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })}
    </div>

    <div class="footer">
        Generado por Monedo | Contacto: joan300501@gmail.com | Teléfono: +51 914019629]
    </div>
</body>
</html>

    `;
  };

  return (
    <ScrollView
      style={{ paddingTop: headerHeight }}
      className="bg-white dark:bg-zinc-900"
    >
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

        <Button
          size="lg"
          variant="secondary"
          className="flex flex-row gap-2 items-center mt-5 w-full"
          onPress={printOrder}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/?size=48&id=13417&format=png",
            }}
            style={{ width: 30, height: 30 }}
          />
          <Text className="text-black dark:text-black"> Descargar PDF</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
