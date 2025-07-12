ALTER TABLE "todo_dev_account" RENAME TO "todo_account";--> statement-breakpoint
ALTER TABLE "todo_dev_session" RENAME TO "todo_session";--> statement-breakpoint
ALTER TABLE "todo_dev_user" RENAME TO "todo_user";--> statement-breakpoint
ALTER TABLE "todo_dev_verification_token" RENAME TO "todo_verification_token";--> statement-breakpoint
ALTER TABLE "todo_dev_task" RENAME TO "todo_task";--> statement-breakpoint
ALTER TABLE "todo_account" DROP CONSTRAINT "todo_dev_account_user_id_todo_dev_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todo_session" DROP CONSTRAINT "todo_dev_session_user_id_todo_dev_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todo_task" DROP CONSTRAINT "todo_dev_task_created_by_todo_dev_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todo_account" DROP CONSTRAINT "todo_dev_account_provider_provider_account_id_pk";--> statement-breakpoint
ALTER TABLE "todo_verification_token" DROP CONSTRAINT "todo_dev_verification_token_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "todo_account" ADD CONSTRAINT "todo_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id");--> statement-breakpoint
ALTER TABLE "todo_verification_token" ADD CONSTRAINT "todo_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "todo_account" ADD CONSTRAINT "todo_account_user_id_todo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."todo_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_session" ADD CONSTRAINT "todo_session_user_id_todo_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."todo_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_task" ADD CONSTRAINT "todo_task_created_by_todo_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."todo_user"("id") ON DELETE no action ON UPDATE no action;