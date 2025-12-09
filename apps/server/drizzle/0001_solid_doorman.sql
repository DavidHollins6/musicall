CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"teacher_id" uuid NOT NULL,
	"type" varchar,
	"instrument" varchar,
	"name" varchar,
	"cancelled" boolean
);
--> statement-breakpoint
CREATE TABLE "sessions_students" (
	"sessions_students_id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_students" ADD CONSTRAINT "sessions_students_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_students" ADD CONSTRAINT "sessions_students_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;