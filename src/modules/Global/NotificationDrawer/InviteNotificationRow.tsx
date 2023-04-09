import { type WorkspaceMemberInvitation } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";
import { type UserType } from "~/modules/Board/WorkspaceMembersModal/MemberRow";
import getGravatar from "~/utils/getGravatar";

export type WorkspaceMemberInvitationWithSenderAndRecevier =
  WorkspaceMemberInvitation & {
    recepient: UserType;
    sender: UserType;
    Workspace: { name: string };
  };

function InviteNotificationRow({
  invitation,
  setCurrentInvitation,
}: {
  invitation: WorkspaceMemberInvitationWithSenderAndRecevier;
  setCurrentInvitation: Dispatch<
    SetStateAction<WorkspaceMemberInvitationWithSenderAndRecevier | null>
  >;
}) {
  const { data: session } = useSession();
  const { recepient, sender } = invitation;
  return (
    <div
      key={invitation?.id}
      className="flex items-start gap-3 border-b px-4 py-2 hover:bg-neutral-100"
    >
      <Image
        height={20}
        width={20}
        className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
        src={
          sender?.image ||
          (sender?.email && getGravatar(sender?.email)) ||
          getGravatar("default")
        }
        alt=""
      />

      <div className="flex w-full items-start justify-between  text-sm text-black ">
        <div className="space-y-2">
          <h1>
            <span className="font-semibold">
              {sender?.email === session?.user.email ? "You " : sender?.name}
            </span>
            {"  "}
            invited{" "}
            {invitation.recepientEmail === session?.user.email
              ? "you "
              : recepient?.name}{" "}
            to join{" "}
            <span className="font-semibold">{invitation?.Workspace?.name}</span>{" "}
            workspace as a {invitation.role.toLowerCase()}
          </h1>
          <h2 className="text-xs text-neutral-600">
            {invitation.createdAt.toLocaleString()}
          </h2>
          <button onClick={() => setCurrentInvitation(invitation)}>
            Open Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteNotificationRow;

export function PendingInviteRowSkeleton() {
  return (
    <div className="flex items-center justify-start  gap-5 px-2">
      <div className="flex items-center -space-x-4">
        <div className="h-8 w-8   animate-pulse rounded-full bg-neutral-400 " />
        <div className="h-8 w-8   animate-pulse rounded-full bg-neutral-400 " />
      </div>
      <div className="flex flex-1 items-center justify-between  ">
        <div className="space-y-2">
          <div className="h-3 w-52  animate-pulse rounded-xl bg-neutral-400" />
          <div className="h-3 w-36  animate-pulse rounded-xl bg-neutral-400" />
        </div>
        <div className="w-fit  animate-pulse  rounded-xl bg-neutral-400 p-1 px-8 py-3 text-xs capitalize"></div>
      </div>
    </div>
  );
}
