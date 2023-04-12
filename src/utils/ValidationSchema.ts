import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(16, "Must contain less than 16 characters"),
});

export const SignUpSchema = SigninSchema.extend({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
});

export const CreateNewBoardSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  description: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters")
    .optional(),
  background: z.string().optional(),
  workspaceId: z.string(),
});

export const CreateNewWorkspaceSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
});
export const RenameWorkspaceSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  workspaceId: z.string(),
});
export const TransferWorkspaceOwnershipSchema = z.object({
  email: z.string().email("Please enter valid email"),
  workspaceId: z.string(),
});
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Must contain at least 1 character")
    .max(100, "Must contain less than 100 characters"),
  listId: z.string(),
});

export const UpdateTaskSchema = z.object({
  taskId: z.string(),
  title: z
    .string()
    .min(1, "Must contain at least 1 character")
    .max(100, "Must contain less than 100 characters"),
  description: z
    .string()
    .max(500, "Must contain less than 500 characters")
    .optional(),
});
export const MoveTaskSchema = z.object({
  newListId: z.string(),
  taskId: z.string(),
  newPrevTaskId: z.string().optional(),
  newNextTaskId: z.string().optional(),
});

export const UpdateListSchema = z.object({
  listId: z.string(),
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
});

export const CreateListSchema = z.object({
  boardId: z.string(),
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
});

export const UpdateBoardSchema = z.object({
  boardId: z.string(),
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  background: z.string(),
});


export const CreateWorkspaceInvitation = z.object({
  email: z.string().email("Please enter valid email"),
  role: z.enum(["ADMIN", "MEMBER"]),
  workspaceId: z.string(),
});


export const WorksapceInviteResponse = z.object({
  accept: z.boolean(),
  workspaceInvitaionId: z.string(),
});