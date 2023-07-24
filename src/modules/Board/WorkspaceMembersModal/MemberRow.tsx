import { type WorkspaceMember } from "@prisma/client";
import Image from "next/image";
import { useSession } from "next-auth/react";

import getGravatar from "@/utils/getGravatar";

export type UserType = {
  image: string | null;
  name: string | null;
  email: string | null;
};

export type WorkspaceMemberWithUser = WorkspaceMember & {
  user: UserType;
};

export default function MemberRow({
  member,
}: {
  member: WorkspaceMemberWithUser;
}) {
  // get current user email
  const { data: session } = useSession();
  const { user } = member;
  return (
    <div key={user?.email} className="flex items-center gap-5 px-2">
      <Image
        height={20}
        width={20}
        className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 lg:h-12 lg:w-12"
        src={
          user?.image ||
          (user.email && getGravatar(user.email)) ||
          getGravatar("default")
        }
        alt=""
      />
      <div className=" flex w-full items-center justify-between  ">
        <div>
          <h1 className="md:text-md text-sm lg:text-lg">
            {user.name} {user.email === session?.user.email && "(You)"}
          </h1>
          <h2 className="text-sm text-neutral-600 md:text-sm  ">
            {user.email}
          </h2>
        </div>
        <div className="w-fit rounded-xl border-2 bg-neutral-200/80 p-1 px-3 text-xs capitalize">
          {member.role.toLowerCase()}
        </div>
      </div>
    </div>
  );
}

export function MemberRowSkeleton() {
  return (
    <div className="flex items-center justify-start  gap-5 px-2">
      <div className="h-14 w-14  animate-pulse rounded-full bg-neutral-400 " />
      <div className="flex flex-1 items-center justify-between  ">
        <div className="space-y-2">
          <div className="h-5 w-52  animate-pulse rounded-xl bg-neutral-400" />
          <div className="h-5 w-36  animate-pulse rounded-xl bg-neutral-400" />
        </div>
        <div className="w-fit  animate-pulse  rounded-xl bg-neutral-400 p-1 px-8 py-3 text-xs capitalize"></div>
      </div>
    </div>
  );
}
