import Divider from "@/modules/Global/Divider";
import IconButton from "@/modules/Global/IconButton";
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { type Workspace } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { FiX } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import InviteSection from "./InviteSection";
import LeaveWorkspaceSection from "./LeaveWorkspaceSection";
import MembersList, { MemberListSkeleton } from "./MembersList";

export default function WorkspaceMembersModal({
  workspace,
  hideText = false,
}: {
  workspace: Workspace;
  hideText?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const { data: members, isLoading } =
    api.workspace.getWorkspaceMembers.useQuery(
      {
        workspaceId: workspace?.id,
      },
      { enabled: isOpen }
    );
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const CurrentUserRole = members?.find(
    (member) => member.user.email === session?.user.email
  )?.role;

  return (
    <>
      <IconButton
        onClick={openModal}
        Icon={MdPeople}
        className=" bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
      >
        <p className={hideText ? "hidden lg:inline" : ""}>Members</p>
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
                <Dialog.Panel className="w-full max-w-lg transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                  {/* main panel content--- */}
                  {isLoading ? (
                    <MemberListSkeleton />
                  ) : (
                    <MembersList members={members} />
                  )}
                  {(CurrentUserRole === "ADMIN" ||
                    CurrentUserRole === "OWNER") && (
                    <>
                      <Divider />
                      <InviteSection
                        CurrentUserRole={CurrentUserRole}
                        workspaceId={workspace.id}
                      />
                    </>
                  )}
                  {CurrentUserRole !== "OWNER" && (
                    <>
                      <Divider />
                      <LeaveWorkspaceSection
                        setIsOpen={setIsOpen}
                        workspace={workspace}
                      />
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
