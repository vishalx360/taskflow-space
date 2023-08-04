import { WorkspaceMemberRoles } from "@prisma/client";

export const ALLOWED_ROLES_TO_INVITE = {
  OWNER: ["ADMIN", "MEMBER"],
  ADMIN: "MEMBER",
  MEMBER: [],
};
