import { Popover, Transition } from "@headlessui/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FiChevronDown } from "react-icons/fi";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { PendingInvitationsListSkeleton } from "~/modules/Board/WorkspaceMembersModal/InviteSection";
import { api } from "~/utils/api";
import ViewInvitationModal from "../ViewInvitaionModal/ViewInvitaionModal";
import InviteNotificationRow, {
  type WorkspaceMemberInvitationWithSenderAndRecevier,
} from "./InviteNotificationRow";

function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentInvitation, setCurrentInvitation] =
    useState<null | WorkspaceMemberInvitationWithSenderAndRecevier>(null);

  const toggelPopover = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Popover className="relative ">
      <ViewInvitationModal
        setCurrentInvitation={setCurrentInvitation}
        currentInvitation={currentInvitation}
      />
      <Popover.Button
        onClick={toggelPopover}
        className="relative z-10 flex items-center gap-1 rounded-md border border-transparent  py-2 text-neutral-100  lg:px-2"
      >
        <MdOutlineMarkEmailUnread className="text-2xl" />
        <FiChevronDown className="hidden text-xl lg:inline" />
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 bg-black opacity-20" />
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="fixed -right-20 z-20 mt-2 w-screen origin-top-right overflow-hidden rounded-md bg-white shadow-xl sm:absolute sm:right-0 sm:w-[400px]">
          <div className="py-2">
            <MyInvitationsList setCurrentInvitation={setCurrentInvitation} />
          </div>
          {/* <a
            href="#"
            className="block bg-neutral-800 py-2 text-center font-bold text-white hover:underline dark:bg-gray-700"
          >
            See all invitations
          </a> */}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default NotificationDrawer;

function MyInvitationsList({
  setCurrentInvitation,
}: {
  setCurrentInvitation: Dispatch<
    SetStateAction<WorkspaceMemberInvitationWithSenderAndRecevier | null>
  >;
}) {
  const { data: myInvitations, isLoading } =
    api.board.getAllMyInvites.useQuery();

  if (isLoading) {
    return <PendingInvitationsListSkeleton numberOfItems={4} />;
  }
  return (
    <div className="space-y-2 ">
      {myInvitations?.length !== 0 ? (
        <>
          {myInvitations?.map((invitation) => (
            <InviteNotificationRow
              setCurrentInvitation={setCurrentInvitation}
              key={invitation.id}
              invitation={invitation}
            />
          ))}
        </>
      ) : (
        <div className="rounded-xl bg-gray-100 px-4 py-4 text-center text-neutral-500">
          No Invites found
        </div>
      )}
    </div>
  );
}
