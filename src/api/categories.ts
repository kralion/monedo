import { db } from "@/db";
import { categories } from "@/schema";
import { eq } from "drizzle-orm";

export const getCategories = async (userId: string) => {
  return db.select().from(categories).where(eq(categories.user_id, userId));
};

export const getCategoryById = async (id: number) => {
  const [row] = await db.select().from(categories).where(eq(categories.id, id));
  if (!row) throw new Error("Category not found");
  return row;
};

export const addCategory = async ({
  label,
  color,
  user_id,
}: {
  label: string;
  color?: string | null;
  user_id: string;
}) => {
  const [row] = await db
    .insert(categories)
    .values({ label, color, user_id })
    .returning();
  if (!row) throw new Error("No data returned");
  return row;
};

export const updateCategory = async ({
  id,
  label,
  color,
}: {
  id: number;
  label: string;
  color?: string | null;
}) => {
  const [row] = await db
    .update(categories)
    .set({ label, color })
    .where(eq(categories.id, id))
    .returning();
  if (!row) throw new Error("No data returned");
  return row;
};

export const deleteCategory = async (id: number) => {
  await db.delete(categories).where(eq(categories.id, id));
  return { success: true };
};

export const seedDefaultCategories = async (userId: string) => {
  const defaults = [
    { label: "Hogar", color: "#41D29B", user_id: userId },
    { label: "Transporte", color: "#10B981", user_id: userId },
    { label: "Salud", color: "#3B82F6", user_id: userId },
    { label: "Alimentación", color: "#F59E0B", user_id: userId },
    { label: "Finanzas", color: "#EF4444", user_id: userId },
    { label: "Educación", color: "#8B5CF6", user_id: userId },
    { label: "Personal", color: "#EC4899", user_id: userId },
    { label: "Ropa", color: "#14B8A6", user_id: userId },
    { label: "Casuales", color: "#41D29B", user_id: userId },
  ];
  await db.insert(categories).values(defaults);
  return { success: true };
};
