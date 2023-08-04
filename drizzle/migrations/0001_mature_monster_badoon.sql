DO $$ BEGIN
 CREATE TYPE "WorkspaceMemberRoles" AS ENUM('MEMBER', 'ADMIN', 'OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Board" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"workspaceId" text NOT NULL,
	"background" text DEFAULT 'gradient:linear-gradient(to right, #0f2027, #203a43, #2c5364)' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "List" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"boardId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Task" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"listId" text NOT NULL,
	"rank" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TaskMember" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"taskId" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"personal" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WorkspaceMember" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"role" "WorkspaceMemberRoles" DEFAULT 'MEMBER' NOT NULL,
	"workspaceId" text NOT NULL,
	"memberSince" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WorkspaceMemberInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"recepientId" text,
	"recepientEmail" text NOT NULL,
	"senderId" text NOT NULL,
	"role" "WorkspaceMemberRoles" DEFAULT 'MEMBER' NOT NULL,
	"workspaceId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "accounts";--> statement-breakpoint
DROP TABLE "sessions";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
DROP TABLE "verification_tokens";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TaskMember_userId_taskId_idx" ON "TaskMember" ("taskId","userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "WorkspaceMember_userId_workspaceId_idx" ON "WorkspaceMember" ("userId","workspaceId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "WorkspaceMemberInvitation_recepientEmail_idx" ON "WorkspaceMemberInvitation" ("recepientEmail");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Board" ADD CONSTRAINT "Board_workspaceId_Workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "List" ADD CONSTRAINT "List_boardId_Board_id_fk" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Task" ADD CONSTRAINT "Task_listId_List_id_fk" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TaskMember" ADD CONSTRAINT "TaskMember_taskId_Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TaskMember" ADD CONSTRAINT "TaskMember_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_Workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkspaceMemberInvitation" ADD CONSTRAINT "WorkspaceMemberInvitation_recepientId_users_id_fk" FOREIGN KEY ("recepientId") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkspaceMemberInvitation" ADD CONSTRAINT "WorkspaceMemberInvitation_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WorkspaceMemberInvitation" ADD CONSTRAINT "WorkspaceMemberInvitation_workspaceId_Workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
