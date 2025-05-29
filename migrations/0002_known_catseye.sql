CREATE TYPE "public"."user_role" AS ENUM('customer', 'dealer', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'customer' NOT NULL;