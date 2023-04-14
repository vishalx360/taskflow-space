import BoardList, { BoardListSkeleton } from "@/modules/Dashboard/BoardList";
import { api } from "@/utils/api";
import { BiLoaderAlt } from "react-icons/bi";
import WorkspaceMembersModal from "../Board/WorkspaceMembersModal/WorkspaceMembersModal";
import BoardGrid, { RecentBoardGrid } from "./BoardGrid";
import CreateNewWorkspaceModal from "./CreateNewWorkspaceModal";
import WorkspaceSettingsModal from "./WorkspaceSettingsModal/WorkspaceSettingsModal";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
function Workspaces() {
  const {
    data: workspaces,
    isLoading,
    isRefetching,
  } = api.workspace.getAllWorkspace.useQuery();
  if (isLoading) {
    return <WorkspaceListSkeleton />;
  }
  return (
    <div className="space-y-2 pb-10">
      <h1 className="p-5 font-medium uppercase tracking-wider text-neutral-500">
        Recent Boards
      </h1>
      <RecentBoardGrid />
      <h1 className="px-5 pb-2 pt-5 font-medium uppercase tracking-wider text-neutral-500">
        Your Workspaces
      </h1>
      <div className=" space-y-5">
        <Accordion defaultValue={["0", "1"]} type="multiple">
          {workspaces?.map((workspace, index) => {
            return (
              <AccordionItem
                className=""
                key={workspace.id}
                value={String(index)}
              >
                <div className="sticky top-16 z-10  bg-neutral-100">
                  <AccordionTrigger className="flex-8  w-full rounded-xl border-neutral-400 px-2  text-neutral-600">
                    <div className="flex w-full items-center justify-between gap-10 rounded-l-none rounded-t-xl border-gray-600 px-5 pt-2 text-xl font-normal   md:rounded-l-md">
                      <div className="flex items-center gap-3 md:gap-5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 p-4 text-sm uppercase  text-white md:h-10 md:w-10 md:text-xl">
                          {workspace.name[0]}
                        </div>
                        <span className=" text-start line-clamp-1">
                          {workspace.name}
                        </span>
                        {isRefetching && (
                          <BiLoaderAlt className="h-5 w-5 animate-spin text-neutral-500" />
                        )}
                      </div>
                    </div>
                    {!workspace.personal && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className=" flex-2 flex items-center gap-3 px-2"
                      >
                        <WorkspaceMembersModal hideText workspace={workspace} />
                        {workspace.members[0]?.role === "OWNER" && (
                          <WorkspaceSettingsModal
                            hideText
                            workspace={workspace}
                          />
                        )}
                      </div>
                    )}
                  </AccordionTrigger>
                </div>

                <AccordionContent className="p-2 md:px-4">
                  <div className="hidden md:block">
                    <BoardGrid workspace={workspace} />
                  </div>
                  <div className="block md:hidden">
                    <BoardList workspace={workspace} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="px-6">
          {workspaces?.length === 0 && "No Workspace Found"}
        </div>
      </div>
      <CreateNewWorkspaceModal />
    </div>
  );
}

export default Workspaces;

function WorkspaceListSkeleton() {
  return (
    <div className="">
      <h1 className="p-5 font-medium uppercase tracking-wider text-neutral-500">
        Your Workspaces
      </h1>
      <div className="px-4">
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
      </div>
    </div>
  );
}

function WorkspaceSkeleton(): JSX.Element {
  return (
    <div>
      <div className="border-b-2 border-gray-200 p-2 text-xl font-semibold">
        <div className="my-3 h-10 w-28 animate-pulse rounded-xl bg-gray-300"></div>
      </div>
      <div className="mt-3">
        <BoardListSkeleton />
      </div>
    </div>
  );
}
