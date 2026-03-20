import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { useCategoryStore } from "~/stores/category";

export const Route = createFileRoute("/_authenticated/profile/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { user } = useUser();
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    if (user?.id) getCategories(user.id);
  }, [user?.id]);

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Text className="text-2xl font-bold mb-4">Categorías</Text>
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
            <Text>{cat.label}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
