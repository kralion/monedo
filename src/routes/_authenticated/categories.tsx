import { createFileRoute, Link } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/category";
import { ICategory } from "@/interfaces";
import { Plus, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRESET_COLORS = [
  "#41D29B",
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export const Route = createFileRoute("/_authenticated/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { user } = useNeonUser();
  const { categories, getCategories, addCategory, updateCategory, deleteCategory, loading } =
    useCategoryStore();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editOpen, setEditOpen] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const [editColor, setEditColor] = useState(PRESET_COLORS[0]);
  const [editCategory, setEditCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    if (user?.id) getCategories(user.id);
  }, [user?.id]);

  async function handleSubmit() {
    if (!label.trim()) return;

    await addCategory({
      label: label.trim(),
      color,
      user_id: user?.id as string,
    } as ICategory);

    setLabel("");
    setColor(PRESET_COLORS[0]);
    setOpen(false);
  }

  function handleEditOpen(cat: ICategory) {
    setEditCategory(cat);
    setEditLabel(cat.label);
    setEditColor(cat.color);
    setEditOpen(true);
  }

  async function handleEditSubmit() {
    if (!editCategory || !editLabel.trim()) return;

    await updateCategory({
      ...editCategory,
      label: editLabel.trim(),
      color: editColor,
    });

    setEditOpen(false);
    setEditCategory(null);
  }

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva categoría</DialogTitle>
              <DialogDescription>
                Crea una categoría para clasificar tus gastos.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Nombre de la categoría"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <div className="flex flex-row flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`w-8 h-8 rounded-full ${
                    color === preset
                      ? "ring-2 ring-ring ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: preset }}
                  onClick={() => setColor(preset)}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-row items-center gap-2 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="flex-1">{cat.label}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditOpen(cat)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoría</DialogTitle>
            <DialogDescription>
              Modifica el nombre o color de la categoría.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nombre de la categoría"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
          />
          <div className="flex flex-row flex-wrap gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`w-8 h-8 rounded-full ${
                  editColor === preset
                    ? "ring-2 ring-ring ring-offset-2"
                    : ""
                }`}
                style={{ backgroundColor: preset }}
                onClick={() => setEditColor(preset)}
              />
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (editCategory) deleteCategory(editCategory.id);
                setEditOpen(false);
                setEditCategory(null);
              }}
              disabled={loading}
            >
              Eliminar
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
