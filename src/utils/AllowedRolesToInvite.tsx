import { WorkspaceMemberRoles } from "@prisma/client";

export const ALLOWED_ROLES_TO_INVITE = {
  [WorkspaceMemberRoles.OWNER]: [
    WorkspaceMemberRoles.ADMIN,
    WorkspaceMemberRoles.MEMBER,
  ],
  [WorkspaceMemberRoles.ADMIN]: [WorkspaceMemberRoles.MEMBER],
  [WorkspaceMemberRoles.MEMBER]: [],
};
