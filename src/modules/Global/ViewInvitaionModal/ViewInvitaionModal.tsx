import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import getGravatar from "@/utils/getGravatar";
import { Dialog, Transition } from "@headlessui/react";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useState, type Dispatch, type SetStateAction } from "react";
import { FiX } from "react-icons/fi";
import { type WorkspaceMemberInvitationWithSenderAndRecevier } from "../InvitationDrawer/InviteNotificationRow";

export default function ViewInvitationModal({
  currentInvitation,
  setCurrentInvitation,
}: {
  setCurrentInvitation: Dispatch<
    SetStateAction<WorkspaceMemberInvitationWithSenderAndRecevier | null>
  >;
  currentInvitation: null | WorkspaceMemberInvitationWithSenderAndRecevier;
}) {
  const { data: session } = useSession();

  function closeModal() {
    setCurrentInvitation(null);
  }
  const [isRejecting, setIsRejecting] = useState(false);
  const utils = api.useContext();
  const { toast } = useToast();

  const mutation = api.workspace.inviteResponse.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async (accepted) => {
      await utils.workspace.getAllWorkspace
        .invalidate()
        .catch((err) => console.log(err));
      toast({
        title: accepted ? "Joined new workspace!" : "Rejected invite",
        // description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      closeModal();
    },
  });

  async function AcceptInvitation() {
    if (currentInvitation) {
      try {
        await mutation.mutateAsync({
          workspaceInvitaionId: currentInvitation.id,
          accept: true,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function RejectInvitation() {
    if (currentInvitation) {
      try {
        setIsRejecting(true);
        await mutation.mutateAsync({
          workspaceInvitaionId: currentInvitation.id,
          accept: false,
        });
        setIsRejecting(false);
      } catch (err) {
        console.log(err);
        setIsRejecting(false);
      }
    }
  }

  return (
    <Transition appear show={Boolean(currentInvitation)} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={closeModal}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex items-center justify-between gap-5 text-lg font-medium leading-6 text-gray-900 "
                >
                  Workspace Invite
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
                <div className="my-5 flex items-center justify-center -space-x-4">
                  <Image
                    height={20}
                    width={20}
                    className="h-14 w-14 rounded-full border-2 border-white dark:border-gray-800"
                    src={
                      currentInvitation?.sender?.image ||
                      (currentInvitation?.sender?.email &&
                        getGravatar(currentInvitation?.sender?.email)) ||
                      getGravatar("default")
                    }
                    alt=""
                  />
                  <Image
                    height={20}
                    width={20}
                    className="h-14 w-14 rounded-full border-2 border-white dark:border-gray-800"
                    src={
                      currentInvitation?.recepient?.image ||
                      (currentInvitation?.recepient?.email &&
                        getGravatar(currentInvitation?.recepient?.email)) ||
                      getGravatar("default")
                    }
                    alt=""
                  />
                </div>
                <div className="my-8 text-neutral-600">
                  <h1>
                    <span className="font-semibold">
                      {currentInvitation?.sender?.email === session?.user.email
                        ? "You "
                        : currentInvitation?.sender?.name}
                    </span>
                    {"  "}
                    invited{" "}
                    {currentInvitation?.recepient?.email === session?.user.email
                      ? "you "
                      : currentInvitation?.recepient?.name}{" "}
                    to join{" "}
                    <span className="font-semibold">
                      {currentInvitation?.Workspace?.name}
                    </span>{" "}
                    workspace as a {currentInvitation?.role.toLowerCase()}
                  </h1>
                  <h2 className="mt-5">
                    If you accept, you will be added as a member of the
                    workspace and will get access to all the boards.
                  </h2>
                </div>
                <div className="mt-2 flex items-center gap-5">
                  <Button
                    onClick={AcceptInvitation}
                    isLoading={mutation.isLoading}
                    loadingText="Accepting..."
                    disabled={mutation.isLoading}
                    type="submit"
                    // className="w-full bg-green-200 text-green-700 hover:bg-green-300"
                    className="w-full"
                    LeftIcon={Check}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={RejectInvitation}
                    isLoading={isRejecting}
                    disabled={mutation.isLoading}
                    loadingText="Rejecting..."
                    type="submit"
                    LeftIcon={FiX}
                    variant="destructiveOutline"
                  >
                    Reject
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
