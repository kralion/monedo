import { useNavigate } from "@tanstack/react-router";
import buyPremiumIllustration from "@/assets/svgs/buy-premium.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type BuyPremiumModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BuyPremiumModal({ open, onOpenChange }: BuyPremiumModalProps) {
  const navigate = useNavigate();

  function handleAdquirirPremium() {
    navigate({ to: "/buy-premium" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <div className="flex flex-col items-center gap-4 bg-primary px-6 pb-4 pt-6 text-primary-foreground">
          <img
            src={buyPremiumIllustration}
            alt=""
            className="h-[200px] w-[180px] object-contain"
          />
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl text-primary-foreground">
              Desbloquea Premium
            </DialogTitle>
            <DialogDescription className="text-center text-base text-primary-foreground/90">
              Actualiza a <span className="font-semibold">Premium</span> para
              obtener funciones exclusivas y una experiencia mejorada.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-sm italic text-primary-foreground/90">
            ¡Maximiza tu potencial con <span className="font-semibold">Monedo</span>! 🚀
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-background p-6">
          <Button type="button" size="lg" className="w-full" onClick={handleAdquirirPremium}>
            Adquirir Premium
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Quizá más tarde
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
