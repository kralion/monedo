import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "errpr",
]);

export const incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  created_at: timestamp("created_At").notNull().defaultNow(),
  description: text("description").notNull(),
  user_id: text("user_id").notNull(),
  id_debt: integer("id_debt").references(() => debts.id),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  color: text("color"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  label: text("label"),
  user_id: text("user_id").notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  currency: text("currency"),
  date: text("date"),
  description: text("description"),
  id_category: integer("id_category").references(() => categories.id),
  number: integer("number").notNull(),
  periodicity: boolean("periodicity"),
  user_id: text("user_id").notNull(),
});

export const debtStatusEnum = pgEnum("debt_status", ["active", "paid", "overdue", "partial"]);

export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  original_amount: integer("original_amount"),
  creditor: text("creditor"),
  notes: text("notes"),
  status: debtStatusEnum("status").notNull().default("active"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
});

export type InsertIncome = typeof incomes.$inferInsert;
export type SelectIncome = typeof incomes.$inferSelect;

export type InsertCategory = typeof categories.$inferInsert;
export type SelectCategory = typeof categories.$inferSelect;

export type InsertExpense = typeof expenses.$inferInsert;
export type SelectExpense = typeof expenses.$inferSelect;

export type InsertDebt = typeof debts.$inferInsert;
export type SelectDebt = typeof debts.$inferSelect;


