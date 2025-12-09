CREATE TABLE "teachers_students" (
	"sessions_students_id" uuid PRIMARY KEY NOT NULL,
	"teacher_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "start_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "end_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "instrument" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "cancelled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers_students" ADD CONSTRAINT "teachers_students_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers_students" ADD CONSTRAINT "teachers_students_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;