import { api } from "@/utils/api";
// import { Popover, Transition } from "@headlessui/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover";
import { Mails } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import Divider from "../Divider";
import ViewInvitationModal from "../ViewInvitaionModal/ViewInvitaionModal";
import InviteNotificationRow, {
  InviteNotificationRowSkeleton,
  type WorkspaceMemberInvitationWithSenderAndRecevier,
} from "./InviteNotificationRow";

function InvitationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentInvitation, setCurrentInvitation] =
    useState<null | WorkspaceMemberInvitationWithSenderAndRecevier>(null);

  const toggelPopover = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Popover>
      <ViewInvitationModal
        setCurrentInvitation={setCurrentInvitation}
        currentInvitation={currentInvitation}
      />
      <PopoverTrigger onClick={toggelPopover} className="">
        <Mails />
      </PopoverTrigger>
      {/* <Popover.Overlay className="fixed inset-0 bg-black opacity-20" /> */}
      <PopoverContent className="mt-2 w-screen bg-white/95 p-2 shadow-xl backdrop-blur-sm  sm:w-[500px]">
        <h1 className="text-md px-5 font-medium text-neutral-800">
          Invitations
        </h1>
        <Divider className="my-2" />
        <MyInvitationsList setCurrentInvitation={setCurrentInvitation} />
        {/* <a
            href="#"
            className="block bg-neutral-800 py-2 text-center font-bold text-white hover:underline dark:bg-gray-700"
          >
            See all invitations
          </a> */}
      </PopoverContent>
    </Popover>
  );
}

export default InvitationDrawer;

function MyInvitationsList({
  setCurrentInvitation,
}: {
  setCurrentInvitation: Dispatch<
    SetStateAction<WorkspaceMemberInvitationWithSenderAndRecevier | null>
  >;
}) {
  const { data: myInvitations, isLoading } =
    api.workspace.getAllMyInvites.useQuery();

  if (isLoading) {
    return (
      <div className="">
        <div className="p-4">
          <InvitationDrawerSkeleton numberOfItems={4} />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
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

export function InvitationDrawerSkeleton({
  numberOfItems = 2,
}: {
  numberOfItems?: number;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: numberOfItems }).map((_, index) => {
        return <InviteNotificationRowSkeleton key={index} />;
      })}
    </div>
  );
}
