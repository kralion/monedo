import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "warning",
  "errpr",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "success",
  "failed",
  "pending",
]);

export const planEnum = pgEnum("plan", ["free", "premium"]);

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  created_at: timestamp("created_At").notNull().defaultNow(),
  description: text("description").notNull(),
  user_id: text("user_id").notNull(),
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

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: integer("amount"),
  card_last4: text("card_last4"),
  card_type: text("card_type"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  plan: planEnum("plan").notNull(),
  status: paymentStatusEnum("status"),
  user_id: text("user_id"),
});

export type InsertBudget = typeof budgets.$inferInsert;
export type SelectBudget = typeof budgets.$inferSelect;

export type InsertCategory = typeof categories.$inferInsert;
export type SelectCategory = typeof categories.$inferSelect;

export type InsertExpense = typeof expenses.$inferInsert;
export type SelectExpense = typeof expenses.$inferSelect;

export type InsertPayment = typeof payments.$inferInsert;
export type SelectPayment = typeof payments.$inferSelect;
