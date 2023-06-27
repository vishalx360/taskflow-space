import { api } from "@/utils/api";
// import { Popover, Transition } from "@headlessui/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "framer-motion";
import { Mails } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import Divider from "../Divider";
import ViewInvitationModal from "../ViewInvitaionModal/ViewInvitaionModal";
import InvitationRow, {
  InvitationRowSkeleton,
  type WorkspaceMemberInvitationWithSenderAndRecevier,
} from "./InvitationRow";

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
        <ReceviedInvitationsList setCurrentInvitation={setCurrentInvitation} />
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

export function ReceviedInvitationsList({
  setCurrentInvitation,
}: {
  setCurrentInvitation: Dispatch<
    SetStateAction<WorkspaceMemberInvitationWithSenderAndRecevier | null>
  >;
}) {
  const { data: myInvitations, isLoading } =
    api.workspace.getAllMyReceviedInvites.useQuery();
  const [parent] = useAutoAnimate();

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
    <AnimatePresence mode="wait">
      <motion.div
        ref={parent}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              duration: 0.2,
              staggerChildren: 0.05,
              // when: "",
            },
          },
        }}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="space-y-2 pb-10"
      >
        {myInvitations?.length !== 0 ? (
          <>
            {myInvitations?.map((invitation) => (
              <InvitationRow
                setCurrentInvitation={setCurrentInvitation}
                key={invitation.id}
                invitation={invitation}
              />
            ))}
          </>
        ) : (
          <div className="rounded-xl bg-gray-100 px-4 py-4 text-center text-neutral-500">
            No Invitations recevied
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function SentInvitationsList({
  setCurrentInvitation,
}: {
  setCurrentInvitation: Dispatch<
    SetStateAction<WorkspaceMemberInvitationWithSenderAndRecevier | null>
  >;
}) {
  const { data: myInvitations, isLoading } =
    api.workspace.getAllMySentInvites.useQuery();
  const [parent] = useAutoAnimate();

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
    <AnimatePresence mode="wait">
      <motion.div
        ref={parent}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              duration: 0.2,
              staggerChildren: 0.05,
              // when: "",
            },
          },
        }}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="space-y-2 pb-10"
      >
        {myInvitations?.length !== 0 ? (
          <>
            {myInvitations?.map((invitation) => (
              <InvitationRow
                setCurrentInvitation={setCurrentInvitation}
                key={invitation.id}
                invitation={invitation}
              />
            ))}
          </>
        ) : (
          <div className="rounded-xl bg-gray-100 px-4 py-4 text-center text-neutral-500">
            No Invitations sent
          </div>
        )}
      </motion.div>
    </AnimatePresence>
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
        return <InvitationRowSkeleton key={index} />;
      })}
    </div>
  );
}
