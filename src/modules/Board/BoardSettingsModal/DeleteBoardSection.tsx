import { type Board } from "@prisma/client";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction } from "react";
import { MdDelete } from "react-icons/md";
import PrimaryButton from "~/modules/Global/PrimaryButton";
import { api } from "~/utils/api";
import Toast from "../../Global/Toast";

function DeleteBoardSection({
  board,
  setIsOpen,
}: {
  board: Board | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const mutation = api.board.deleteBoard.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      Toast({ content: "Board deleted successfully!", status: "success" });
      // redirect to dashboard
      await router.push("/dashboard");
      setIsOpen(false);
    },
  });

  return (
    <div className="space-y-3">
      <p className="text-md font-semibold text-neutral-500 dark:text-white">
        Delete Board
      </p>
      <p className="">
        By deleting this board it will delete all the lists as well as all the
        tasks it contains.
      </p>
      <PrimaryButton
        isLoading={mutation.isLoading}
        onClick={() => mutation.mutate({ boardId: board?.id || "" })}
        LeftIcon={MdDelete}
        disabled={mutation.isLoading}
        overwriteClassname
        loadingText="Deleting Board"
        className="rounded-xl border-2 border-red-600 bg-transparent px-4 py-2 text-red-700 hover:bg-red-50 active:bg-red-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400"
      >
        Delete this Board
      </PrimaryButton>
    </div>
  );
}

export default DeleteBoardSection;
