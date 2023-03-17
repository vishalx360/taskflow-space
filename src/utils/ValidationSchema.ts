import { z } from "zod";

export const CreateNewBoardValidationSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  workspaceId: z.string(),
});

export const CreateNewWorkspaceValidationSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
});
export const RenameWorkspaceValidationSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  workspaceId: z.string(),
});
export const DeleteWorkspaceValidationSchema = z.object({
  workspaceId: z.string(),
});
