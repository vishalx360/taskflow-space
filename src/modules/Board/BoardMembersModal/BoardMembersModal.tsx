import { Dialog, Transition } from "@headlessui/react";
import { type WorkspaceMember } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { FiX } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import Divider from "~/modules/Global/Divider";
import IconButton from "~/modules/Global/IconButton";
import { api } from "~/utils/api";
import getGravatar from "~/utils/getGravatar";
import { TaskListSkeleton } from "../TaskList";

export default function BoardMembersModal({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const {
    data: members,
    isLoading,
    isRefetching,
  } = api.board.getWorkspaceMembers.useQuery({ workspaceId });
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <TaskListSkeleton NumberOfTasks={5} />;
  }

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        onClick={openModal}
        Icon={MdPeople}
        className=" bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
      >
        Members
      </IconButton>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex items-center justify-between gap-5 text-lg font-medium leading-6 text-gray-900 "
                  >
                    Workspace Members
                    <button
                      onClick={closeModal}
                      type="button"
                      className="rounded-lg p-2 text-xs text-inherit transition-all  hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
                      aria-controls="navbar-default"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Close Image Preview</span>
                      <FiX size="2em" />
                    </button>
                  </Dialog.Title>
                  <p className="text-md my-4">{members?.length} Members</p>
                  <div className="flex flex-col gap-5">
                    {members?.map((member) => {
                      return <MemberRow key={member.id} member={member} />;
                    })}
                  </div>
                  <Divider />
                  <div>todo: invite new member</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
type UserType = {
  image: string | null;
  name: string | null;
  email: string | null;
};

type WorkspaceMemberWithUser = WorkspaceMember & {
  user: UserType;
};

function MemberRow({ member }: { member: WorkspaceMemberWithUser }) {
  // get current user email
  const { data: session } = useSession();
  const { user } = member;
  return (
    <div key={user?.email} className="flex items-center gap-5 px-2">
      <Image
        height={20}
        width={20}
        className="h-14 w-14 rounded-full border-2 border-white dark:border-gray-800"
        src={
          user?.image ||
          (user.email && getGravatar(user.email)) ||
          getGravatar("default")
        }
        alt=""
      />
      <div className="flex w-full items-center justify-between ">
        <div>
          <h1>
            {user.name} {user.email === session?.user.email && "(You)"}
          </h1>
          <h2 className="text-neutral-600">{user.email}</h2>
        </div>
        <div className="w-fit rounded-xl bg-neutral-200/80 p-1 px-2 text-xs capitalize">
          {member.role.toLowerCase()}
        </div>
      </div>
    </div>
  );
}
