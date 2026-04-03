import { Button } from "../ui/button";

export default function Yape() {
  return (
    <div className="flex flex-col py-3 gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-base text-foreground select-text dark:text-white">
          Número de Teléfono
        </p>
        <Button disabled variant="outline" size="lg" className="font-bold">
          <span className="text-black dark:text-black">914 019 629</span>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base text-foreground select-text dark:text-white">
          Monto de yapeo
        </p>
        <Button variant="outline" size="lg" disabled className="font-bold">
          <span className="text-black dark:text-black"> S/ 15.00</span>
        </Button>
      </div>
      <p className="text-sm text-foreground select-text dark:text-white">
        El último paso es mandarnos una captura al WhatsApp del yapeo a este
        número
        <span className="text-primary"> 914 019 929</span>
      </p>
      <Button size="lg" className="bg-purple-600 mt-5 text-white">
        <span className="text-white"> Abrir Yape</span>
      </Button>
    </div>
  );
}
