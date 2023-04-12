import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import { type Board } from "@prisma/client";
import { useRouter } from "next/router";
import { MdDelete } from "react-icons/md";

function DeleteBoardSection({
  board,
  closeModal,
}: {
  board: Board | null;
  closeModal: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const mutation = api.board.deleteBoard.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },

    onSuccess: async () => {
      toast({ title: "Board deleted successfully!" });
      // redirect to dashboard
      await router.push("/dashboard");
      closeModal();
    },
  });

  return (
    <div className="space-y-3">
      <p className="text-md font-medium text-neutral-600 dark:text-white">
        Delete Board
      </p>
      <p className="">
        By deleting this board it will delete all the lists as well as all the
        tasks it contains.
      </p>
      <Button
        isLoading={mutation.isLoading}
        onClick={() => mutation.mutate({ boardId: board?.id || "" })}
        LeftIcon={MdDelete}
        disabled={mutation.isLoading}
        loadingText="Deleting Board"
        variant="destructiveOutline"
      >
        Delete this Board
      </Button>
    </div>
  );
}

export default DeleteBoardSection;
