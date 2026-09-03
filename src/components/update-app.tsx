import { useEffect, useState } from "react";
import { useSWUpdate } from "@/hooks/use-sw-update";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ReleaseNotes {
  latest: string;
  notes: Record<string, { date: string; items: string[] }>;
}

const FALLBACK_ITEMS = [
  "Solución de errores",
  "Optimización del performance",
  "Mejoras de la experiencia de usuario",
];

let cachedNotes: ReleaseNotes | null = null;

async function fetchReleaseNotes(): Promise<ReleaseNotes | null> {
  if (cachedNotes) return cachedNotes;
  try {
    const url = new URL("/release-notes.json", window.location.origin);
    const response = await fetch(url);
    if (!response.ok) return null;
    cachedNotes = (await response.json()) as ReleaseNotes;
    return cachedNotes;
  } catch {
    return null;
  }
}

export default function UpdateAppDialog() {
  const { needRefresh, updateServiceWorker, close } = useSWUpdate();
  const [items, setItems] = useState<string[]>(FALLBACK_ITEMS);

  useEffect(() => {
    if (!needRefresh) return;
    let active = true;
    fetchReleaseNotes().then((notes) => {
      if (!active) return;
      setItems(notes?.notes[notes.latest]?.items ?? FALLBACK_ITEMS);
    });
    return () => {
      active = false;
    };
  }, [needRefresh]);

  return (
    <AlertDialog open={needRefresh}>
      <AlertDialogContent className="w-xs" onEscapeKeyDown={close}>
        <div className="flex flex-col gap-4">
          <img
            src="https://img.icons8.com/?size=96&id=1s0bopAGAW10&format=gif&color=f7f7f7"
            alt="Update illustration"
            className="mx-auto h-40 w-auto"
          />
          <h3 className="mx-auto text-center font-semibold">
            Actualización disponible
          </h3>
          <ul className="text-muted-foreground max-w-md list-inside list-disc space-y-0.5 text-left text-xs">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Button onClick={() => updateServiceWorker(true)}>
            Actualizar ahora
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
