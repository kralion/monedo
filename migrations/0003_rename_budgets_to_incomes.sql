CREATE TABLE "incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"user_id" text NOT NULL
);--> statement-breakpoint
INSERT INTO "incomes" ("amount", "created_At", "description", "user_id")
SELECT "amount", "created_At", "description", "user_id" FROM "budgets";--> statement-breakpoint
DROP TABLE "budgets" CASCADE;
