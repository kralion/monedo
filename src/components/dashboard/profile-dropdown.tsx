import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Bookmark, SunMoon } from "lucide-react";
import darkThemeImg from "@/assets/images/dark.png";
import lightThemeImg from "@/assets/images/light.png";

type ProfileDropdownProps = {
  user:
    | {
        firstName?: string | null;
        lastName?: string | null;
        image?: string | null;
      }
    | null
    | undefined;
};

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(colorScheme);

  function handleSaveTheme() {
    setColorScheme(selectedTheme);
    setThemeOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 cursor-pointer">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.firstName ?? ""}
            />
            <AvatarFallback>
              {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <User />
              Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/categories">
              <Bookmark />
              Categorías
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedTheme(colorScheme);
              setThemeOpen(true);
            }}
          >
            <SunMoon />
            Tema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={themeOpen} onOpenChange={setThemeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tema</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={selectedTheme}
            onValueChange={(v) => setSelectedTheme(v as "light" | "dark")}
            className="grid grid-cols-2 gap-4"
          >
            {(
              [
                { value: "dark", label: "Tema Oscuro", img: darkThemeImg },
                { value: "light", label: "Tema Claro", img: lightThemeImg },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex flex-col items-center rounded-lg py-2 cursor-pointer"
              >
                <img src={opt.img} alt={opt.label} className="w-full " />
                <RadioGroupItem value={opt.value} />
                <span className="text-sm font-medium mt-4">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button onClick={handleSaveTheme}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
