import { type Workspace } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { MdDelete } from "react-icons/md";
import PrimaryButton from "~/modules/Global/PrimaryButton";
import { api } from "~/utils/api";
import Toast from "../../Global/Toast";

function DeleteWorkspaceSection({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = api.useContext();
  const mutation = api.dashboard.deleteWorkspace.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      await utils.dashboard.getAllWorkspace
        .invalidate()
        .catch((err) => console.log(err));
      Toast({ content: "Workspace deleted successfully!", status: "success" });
      setIsOpen(false);
    },
  });

  return (
    <div className="space-y-3">
      <p className="text-md font-semibold text-neutral-500 dark:text-white">
        Delete Workspace
      </p>
      <p className="">
        By deleting this workspace it will delete all the boards it contains.
      </p>
      <PrimaryButton
        isLoading={mutation.isLoading}
        onClick={() => mutation.mutate({ workspaceId: workspace.id })}
        LeftIcon={MdDelete}
        overwriteClassname
        loadingText="Deleting Workspace"
        className="rounded-xl border-2 border-red-600 bg-transparent px-4 py-2 text-red-700 hover:bg-red-50 active:bg-red-100"
      >
        Delete this Workspace
      </PrimaryButton>
    </div>
  );
}

export default DeleteWorkspaceSection;
