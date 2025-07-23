CREATE TYPE "public"."goal_status" AS ENUM('active', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."transaction_types" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TYPE "public"."currencies" AS ENUM('BRL', 'USD', 'EUR');--> statement-breakpoint
CREATE TYPE "public"."plans" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"target_amount_in_cents" integer NOT NULL,
	"current_amount_in_cents" integer DEFAULT 0 NOT NULL,
	"target_date" date NOT NULL,
	"status" "goal_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category_id" text NOT NULL,
	"amount_in_cents" integer NOT NULL,
	"description" text NOT NULL,
	"type" "transaction_types" NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"currency" "currencies" DEFAULT 'BRL' NOT NULL,
	"plan" "plans" DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_name_index" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "goals_user_id_index" ON "goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goals_status_index" ON "goals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "goals_target_date_index" ON "goals" USING btree ("target_date");--> statement-breakpoint
CREATE INDEX "goals_user_id_status_index" ON "goals" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "transactions_user_id_index" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_category_id_index" ON "transactions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "transactions_type_index" ON "transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transactions_date_index" ON "transactions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "transactions_user_id_date_index" ON "transactions" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "users_plan_index" ON "users" USING btree ("plan");