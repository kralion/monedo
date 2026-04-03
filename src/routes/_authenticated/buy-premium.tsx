import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/buy-premium")({
  component: BuyPremiumPage,
});

const carouselData = [
  {
    title: "Presupuestos personalizados",
    subtitle: "Crea presupuestos basados en su periodicidad.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=hbqNM94LZdjp&format=png&color=000000",
  },
  {
    title: "Análisis de gastos por categoría",
    subtitle: "Gráficos extra para mantener un seguimiento detallado.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=D0A1Afld5jac&format=png&color=000000",
  },
  {
    title: "Soporte al cliente",
    subtitle: "Prioridad en el soporte al cliente y asistencia.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=C8twQXUl1qoA&format=png&color=000000",
  },
  {
    title: "Perfiles múltiples",
    subtitle: "Perfiles de usuario múltiples para manejar diferentes fuentes.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=28kzIB2E5Rat&format=png&color=000000",
  },
];

function BuyPremiumPage() {
  const [value, setValue] = useState("yape");
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 min-h-screen pb-28">
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        <div className="flex flex-col items-center gap-4">
          <img
            src={carouselData[currentIndex].svgIcon}
            alt=""
            className="w-[150px] h-[150px]"
          />
          <div className="flex flex-col gap-0 px-4 text-center">
            <h2 className="text-xl font-semibold">
              {carouselData[currentIndex].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {carouselData[currentIndex].subtitle}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-2">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-brand" : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold">Método de Pago</h2>

        <Tabs value={value} onValueChange={setValue} className="w-full">
          <TabsList className="flex-row w-full rounded-xl">
            <TabsTrigger value="yape" className="flex-1 rounded-lg">
              Yape
            </TabsTrigger>
            <TabsTrigger value="card" className="flex-1 rounded-lg">
              Tarjeta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="yape">
            <Yape />
          </TabsContent>
          <TabsContent value="card">
            <Stripe />
          </TabsContent>
        </Tabs>

        <Link to="/">
          <Button variant="ghost" size="sm" className="mt-4">
            <span className="text-brand">Quizás más tarde</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
