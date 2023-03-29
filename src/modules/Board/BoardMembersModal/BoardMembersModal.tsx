import Image from "next/image";
import getGravatar from "~/utils/getGravatar";

type MemberType = {
  image: string | null;
  name: string | null;
  email: string | null;
};

function BoardMembersModal({
  members,
}: {
  members: MemberType[] | undefined;
}): JSX.Element {
  return (
    <div className="flex flex-row-reverse items-center justify-center gap-4">
      Members
      <div className="flex -space-x-4">
        {members?.slice(0, 3)?.map((member) => {
          return (
            <Image
              key={member?.email}
              height={20}
              width={20}
              className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
              src={
                member?.image ||
                (member.email && getGravatar(member.email)) ||
                getGravatar("default")
              }
              alt=""
            />
          );
        })}
        <a
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
          href="#"
        >
          {members?.length}
        </a>
      </div>
    </div>
  );
}

export default BoardMembersModal;
