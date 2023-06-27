import { type UserType } from "@/modules/Board/WorkspaceMembersModal/MemberRow";
import { Button } from "@/modules/ui/button";
import getGravatar from "@/utils/getGravatar";
import { type WorkspaceMemberInvitation } from "@prisma/client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";
import { MdViewDay } from "react-icons/md";
import Timeago from "react-timeago";
// short type name
export type WorkspaceMemberInvitationWithSenderAndRecevier =
  WorkspaceMemberInvitation & {
    recepient: UserType;
    sender: UserType;
    Workspace: { name: string };
  };

function InvitationRow({
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

  const recepientEmail =
    invitation?.recepient?.email || invitation?.recepientEmail;

  return (
    <motion.div
      variants={{
        hidden: {
          y: 10,
          opacity: 0,
        },
        show: {
          y: 0,
          opacity: 1,
        },
      }}
      key={invitation?.id}
      className="flex items-start justify-between gap-3 rounded-xl border-b  px-4 py-2 hover:bg-neutral-100"
    >
      <Image
        height={20}
        width={20}
        className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 md:h-14 md:w-14"
        src={
          recepientEmail === session?.user.email
            ? sender?.image ||
              (sender?.email && getGravatar(sender?.email)) ||
              getGravatar("default")
            : recepient?.image ||
              (recepientEmail && getGravatar(recepientEmail)) ||
              getGravatar("default")
        }
        alt=""
      />

      <div className="flex w-full items-start justify-between  text-sm text-black ">
        <div className="space-y-2">
          <h2 className="font-medium">
            {sender?.email === session?.user.email
              ? recepient?.name || recepientEmail
              : sender?.name}
          </h2>
          <Timeago
            live={false}
            date={invitation.createdAt}
            className="text-xs text-neutral-600"
          />
          <h1 className="line-clamp-1 text-neutral-600">
            {sender?.email === session?.user.email ? "You invited" : "Invited"}{" "}
            {recepientEmail === session?.user.email ? "you " : recepient?.name}{" "}
            to join{" "}
            <span className="font-medium">
              {invitation?.Workspace?.name} workspace
            </span>{" "}
            as a {invitation.role.toLowerCase()}
          </h1>
          <Button
            variant="subtle"
            size="sm"
            className="whitespace-nowrap md:hidden"
            LeftIcon={MdViewDay}
            onClick={() => setCurrentInvitation(invitation)}
          >
            Open Invitation
          </Button>
        </div>
      </div>
      <Button
        variant="subtle"
        size="sm"
        className="hidden whitespace-nowrap md:inline-flex"
        LeftIcon={MdViewDay}
        onClick={() => setCurrentInvitation(invitation)}
      >
        Open Invitation
      </Button>
    </motion.div>
  );
}

export default InvitationRow;

export function InvitationRowSkeleton() {
  return (
    <div className="flex items-start justify-start  gap-5 ">
      <div className="h-10 w-10   animate-pulse rounded-full bg-neutral-400 " />
      <div className="flex flex-1 items-start justify-between  ">
        <div className="space-y-2">
          <div className="h-3 w-36  animate-pulse rounded-xl bg-neutral-400" />
          <div className="h-3 w-60  animate-pulse rounded-xl bg-neutral-400" />
          <div className="h-3 w-52  animate-pulse rounded-xl bg-neutral-400" />
          <div className="h-6 w-28  animate-pulse rounded-xl bg-neutral-400" />
        </div>

        <div className="h-3 w-16  animate-pulse rounded-xl bg-neutral-400" />
      </div>
      {/* <div className="w-fit  animate-pulse  rounded-xl bg-neutral-400 p-1 px-8 py-3 text-xs capitalize"></div> */}
    </div>
  );
}
