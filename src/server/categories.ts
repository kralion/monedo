import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db.server";
import { categories } from "@/schema";
import { eq } from "drizzle-orm";

export const getCategoriesFn = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    return db.select().from(categories).where(eq(categories.user_id, data.userId));
  },
);

export const getCategoryByIdFn = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const [row] = await db.select().from(categories).where(eq(categories.id, data.id));
    if (!row) throw new Error("Category not found");
    return row;
  },
);

export const addCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { label: string; color?: string | null; user_id: string }) => data)
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(categories)
      .values({ label: data.label, color: data.color, user_id: data.user_id })
      .returning();
    if (!row) throw new Error("No data returned");
    return row;
  },
);

export const updateCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; label: string; color?: string | null }) => data)
  .handler(async ({ data }) => {
    const [row] = await db
      .update(categories)
      .set({ label: data.label, color: data.color })
      .where(eq(categories.id, data.id))
      .returning();
    if (!row) throw new Error("No data returned");
    return row;
  },
);

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(categories).where(eq(categories.id, data.id));
    return { success: true };
  },
);

export const seedDefaultCategoriesFn = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const defaults = [
      { label: "Hogar", color: "#41D29B", user_id: data.userId },
      { label: "Transporte", color: "#10B981", user_id: data.userId },
      { label: "Salud", color: "#3B82F6", user_id: data.userId },
      { label: "Alimentación", color: "#F59E0B", user_id: data.userId },
      { label: "Finanzas", color: "#EF4444", user_id: data.userId },
      { label: "Educación", color: "#8B5CF6", user_id: data.userId },
      { label: "Personal", color: "#EC4899", user_id: data.userId },
      { label: "Ropa", color: "#14B8A6", user_id: data.userId },
      { label: "Casuales", color: "#41D29B", user_id: data.userId },
    ];
    await db.insert(categories).values(defaults);
    return { success: true };
  },
);
