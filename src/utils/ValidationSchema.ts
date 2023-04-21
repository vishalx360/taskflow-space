import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Must contain at least 8 characters")
  .max(16, "Must contain less than 16 characters")
  .regex(
    /^\S*$/,
    { message: "Password must not contain whitespace" }
  )
// .regex(
//   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/,
//   { message: "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character" }
// );
export const SigninSchema = z.object({
  email: z.string().email(),
  password: passwordSchema
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const newPasswordSchema = z.object({
  token: z.string(),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
})

export const SignUpSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  password: z
    .string()
    .regex(
      /^\S*$/,
      { message: "Password must not contain whitespace" }
    )
});

export const UpdatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"], // path of error
});


export const CreateNewBoardSchema = z.object({
  name: z
    .string()
    .min(4, "Must contain at least 4 characters")
    .max(50, "Must contain less than 50 characters"),
  description: z
    .string()
    .max(120, "Must contain less than 120 characters")
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