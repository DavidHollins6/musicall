CREATE TABLE "instrument_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"trigger_type_id" integer NOT NULL,
	"value" integer NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trigger_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"instrument_type_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"file_name" varchar(256) NOT NULL,
	"default_mapping_value" integer NOT NULL,
	"order" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mappings" ADD CONSTRAINT "mappings_trigger_type_id_trigger_types_id_fk" FOREIGN KEY ("trigger_type_id") REFERENCES "public"."trigger_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mappings" ADD CONSTRAINT "mappings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trigger_types" ADD CONSTRAINT "trigger_types_instrument_type_id_instrument_types_id_fk" FOREIGN KEY ("instrument_type_id") REFERENCES "public"."instrument_types"("id") ON DELETE no action ON UPDATE no action;