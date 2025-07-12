BEGIN;
ALTER TABLE "todo_account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "todo_session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "todo_user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "todo_verification_token" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "todo_account" CASCADE;--> statement-breakpoint
DROP TABLE "todo_session" CASCADE;--> statement-breakpoint
ALTER TABLE "todo_task" DROP CONSTRAINT "todo_task_created_by_todo_user_id_fk";
DROP TABLE "todo_user" CASCADE;--> statement-breakpoint
DROP TABLE "todo_verification_token" CASCADE;--> statement-breakpoint
COMMIT;