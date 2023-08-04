import { boolean, index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./auth_schema";

export const workspaceMemberRoles = pgEnum("WorkspaceMemberRoles", [
  "MEMBER",
  "ADMIN",
  "OWNER",
]);

export const workspace = pgTable("Workspace", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  personal: boolean("personal").default(false).notNull(),
});

export const board = pgTable("Board", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspace.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  background: text("background")
    .default("gradient:linear-gradient(to right, #0f2027, #203a43, #2c5364)")
    .notNull(),
});

export const list = pgTable("List", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  boardId: text("boardId")
    .notNull()
    .references(() => board.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const task = pgTable("Task", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  listId: text("listId")
    .notNull()
    .references(() => list.id, { onDelete: "cascade", onUpdate: "cascade" }),
  rank: text("rank").notNull(),
});

export const taskMember = pgTable(
  "TaskMember",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    taskId: text("taskId")
      .notNull()
      .references(() => task.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      userIdTaskIdIdx: index("TaskMember_userId_taskId_idx").on(
        table.taskId,
        table.userId
      ),
    };
  }
);

export const workspaceMemberInvitation = pgTable(
  "WorkspaceMemberInvitation",
  {
    id: text("id").primaryKey().notNull(),
    recepientId: text("recepientId").references(() => users.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    recepientEmail: text("recepientEmail").notNull(),
    senderId: text("senderId")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    role: workspaceMemberRoles("role").default("MEMBER").notNull(),
    workspaceId: text("workspaceId")
      .notNull()
      .references(() => workspace.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      recepientEmailIdx: index(
        "WorkspaceMemberInvitation_recepientEmail_idx"
      ).on(table.recepientEmail),
    };
  }
);

export const workspaceMember = pgTable(
  "WorkspaceMember",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    role: workspaceMemberRoles("role").default("MEMBER").notNull(),
    workspaceId: text("workspaceId")
      .notNull()
      .references(() => workspace.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    memberSince: timestamp("memberSince", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdWorkspaceIdIdx: index("WorkspaceMember_userId_workspaceId_idx").on(
        table.userId,
        table.workspaceId
      ),
    };
  }
);
