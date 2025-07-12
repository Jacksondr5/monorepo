ALTER TABLE "todo_task" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "todo_task" ALTER COLUMN "updated_at" SET NOT NULL;