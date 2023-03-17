import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Must contain at least 4 characters")
    .max(16, "Must contain less than 16 characters"),
});

export const SignUpSchema = SigninSchema
  .extend({
    name: z.string()
      .min(4, "Must contain at least 4 characters")
      .max(50, "Must contain less than 50 characters"),
  })

export const CreateNewBoardSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
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
export const DeleteWorkspaceSchema = z.object({
  workspaceId: z.string(),
});
