CREATE TYPE "public"."debt_status" AS ENUM('active', 'paid', 'overdue', 'partial');--> statement-breakpoint
CREATE TABLE "debts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"amount" integer NOT NULL,
	"original_amount" integer,
	"creditor" text,
	"notes" text,
	"due_date" text,
	"status" "debt_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
