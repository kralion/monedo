CREATE TYPE "public"."notification_type" AS ENUM('info', 'warning', 'errpr');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('success', 'failed', 'pending');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'premium');--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"label" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"currency" text,
	"date" text,
	"description" text,
	"id_category" integer,
	"number" integer NOT NULL,
	"periodicity" boolean,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer,
	"card_last4" text,
	"card_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"plan" "plan" NOT NULL,
	"status" "payment_status",
	"user_id" text
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_id_category_categories_id_fk" FOREIGN KEY ("id_category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;