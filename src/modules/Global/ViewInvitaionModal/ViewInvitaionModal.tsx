import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { api } from "@/utils/api";
import getGravatar from "@/utils/getGravatar";
import { Check, LucideMail } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FiX } from "react-icons/fi";
import { type WorkspaceMemberInvitationWithSenderAndRecevier } from "../InvitationDrawer/InvitationRow";

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
  const recepientEmail =
    currentInvitation?.recepient?.email || currentInvitation?.recepientEmail;
  function closeModal() {
    setCurrentInvitation(null);
  }
  const [isRejecting, setIsRejecting] = useState(false);
  const utils = api.useContext();
  const { toast } = useToast();

  const recepientMutation = api.workspace.inviteResponse.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async (accepted) => {
      if (accepted) {
        await utils.workspace.getAllWorkspace
          .invalidate()
          .catch((err) => console.log(err));
      }
      await utils.workspace.getAllMyReceviedInvites
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
  const senderMutation = api.workspace.cancelInvite.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      await utils.workspace.getAllMySentInvites
        .invalidate()
        .catch((err) => console.log(err));
      toast({
        title: "Canceled invitation",
        // description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      closeModal();
    },
  });

  async function AcceptInvitation() {
    if (currentInvitation) {
      try {
        await recepientMutation.mutateAsync({
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
        await recepientMutation.mutateAsync({
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
  async function CancelInvitation() {
    if (currentInvitation) {
      try {
        setIsRejecting(true);
        await senderMutation.mutateAsync({
          workspaceInvitaionId: currentInvitation.id,
        });
        setIsRejecting(false);
      } catch (err) {
        console.log(err);
        setIsRejecting(false);
      }
    }
  }

  return (
    <Dialog
      open={Boolean(currentInvitation)}
      // className="relative z-[80]"
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 font-medium">
            <LucideMail width={20} />
            Workspace Invitation
          </DialogTitle>
        </DialogHeader>

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
              (recepientEmail && getGravatar(recepientEmail)) ||
              getGravatar("default")
            }
            alt=""
          />
        </div>
        <div className="my-2 text-neutral-600">
          <div className="mb-2  flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-sm uppercase  text-white">
              {currentInvitation?.Workspace.name[0]}
            </div>
            <div className="w-52 overflow-clip text-ellipsis">
              {currentInvitation?.Workspace.name}
            </div>
          </div>
          <h1>
            <span className="font-medium">
              {currentInvitation?.sender?.email === session?.user.email
                ? "You "
                : currentInvitation?.sender?.name}
            </span>
            {"  "}
            invited{" "}
            <span className="font-medium underline underline-offset-2">
              {recepientEmail === session?.user.email
                ? "you "
                : currentInvitation?.recepient?.name || recepientEmail}
            </span>{" "}
            to join{" "}
            <span className="font-medium">
              {currentInvitation?.Workspace?.name}
            </span>{" "}
            workspace as a {currentInvitation?.role.toLowerCase()}
          </h1>
          <h2 className="mt-5">
            If accepted,{" "}
            {recepientEmail === session?.user.email
              ? "you "
              : currentInvitation?.recepient?.name || recepientEmail}{" "}
            will be added as a member of the workspace and will get access to
            all the boards.
          </h2>
        </div>
        {recepientEmail === session?.user.email && (
          <div className="mt-2 flex items-center gap-5">
            <Button
              onClick={AcceptInvitation}
              isLoading={recepientMutation.isLoading}
              loadingText="Accepting..."
              disabled={recepientMutation.isLoading}
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
              disabled={recepientMutation.isLoading}
              loadingText="Rejecting..."
              type="submit"
              LeftIcon={FiX}
              variant="destructiveOutline"
            >
              Reject
            </Button>
          </div>
        )}
        {currentInvitation?.sender?.email === session?.user.email && (
          <div className="mt-2 ">
            <Button
              onClick={CancelInvitation}
              isLoading={isRejecting}
              disabled={recepientMutation.isLoading}
              type="submit"
              LeftIcon={FiX}
              className="w-full"
              variant="destructiveOutline"
            >
              Cancel Invitation
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
