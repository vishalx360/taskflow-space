import getGravatar from "@/utils/getGravatar";
import { type WorkspaceMemberInvitation } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import TimeAgo from "react-timeago";
import { type UserType } from "./MemberRow";

type WorkspaceMemberInvitationWithSenderAndRecevier =
  WorkspaceMemberInvitation & {
    recepient?: UserType;
    sender: UserType;
  };
function PendingInviteRow({
  invitation,
}: {
  invitation: WorkspaceMemberInvitationWithSenderAndRecevier;
}) {
  // get current user email
  const { data: session } = useSession();
  const { recepient, sender } = invitation;
  return (
    <div key={invitation?.id} className="flex items-center gap-5 px-2">
      <div className="flex items-center -space-x-4">
        <Image
          height={20}
          width={20}
          className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
          src={
            sender?.image ||
            (sender?.email && getGravatar(sender?.email)) ||
            getGravatar("default")
          }
          alt=""
        />
        <Image
          height={20}
          width={20}
          className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
          src={
            recepient?.image ||
            (invitation.recepientEmail &&
              getGravatar(invitation.recepientEmail)) ||
            getGravatar("default")
          }
          alt=""
        />
      </div>
      <div className="flex w-full items-center justify-between text-sm ">
        <div>
          <h1>
            {sender?.email === session?.user.email ? "You " : sender?.name}
            {"  "}
            invited{" "}
            <span className="font-medium">{recepient?.name || "a user"}</span>
          </h1>
          <h2 className="text-xs text-neutral-600">
            <TimeAgo live={false} date={invitation.createdAt} />
          </h2>
          {/* <h2 className="text-neutral-600">{recepient?.email}</h2> */}
        </div>
        <div className="w-fit rounded-xl border-2 bg-neutral-200/80 p-1 px-3 text-xs capitalize">
          {invitation.role.toLowerCase()}
        </div>
      </div>
    </div>
  );
}

export default PendingInviteRow;

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
