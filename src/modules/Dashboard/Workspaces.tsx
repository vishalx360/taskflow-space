import { Disclosure, Transition } from "@headlessui/react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCaretRight } from "react-icons/fa";
import BoardList, { BoardListSkeleton } from "~/modules/Dashboard/BoardList";
import { api } from "~/utils/api";
import CreateNewWorkspaceModal from "./CreateNewWorkspaceModal";
import WorkspaceSettingsModal from "./WorkspaceSettingsModal/WorkspaceSettingsModal";

function Workspaces() {
  const {
    data: workspaces,
    isLoading,
    isRefetching,
  } = api.dashboard.getAllWorkspace.useQuery();
  if (isLoading) {
    return <WorkspaceListSkeleton />;
  }
  return (
    <div className="">
      <h1 className="p-5 font-medium uppercase tracking-wider text-neutral-500">
        Your Workspaces
      </h1>
      <div className="relative space-y-5">
        {/* TOOD: show workspaces tabs  */}
        {workspaces?.map((workspace, index) => {
          return (
            <div key={workspace.id}>
              <Disclosure defaultOpen={workspace.personal || index < 5}>
                {({ open }) => (
                  <>
                    <div className="mb-5 flex items-center gap-5">
                      <Disclosure.Button className="sticky top-20 z-10 w-full border-b-2 bg-white transition-all ">
                        <div className="flex w-full items-center justify-between gap-10 rounded-t-xl rounded-l-none border-gray-600 py-2 px-5 text-xl font-semibold hover:bg-neutral-100  md:rounded-l-md">
                          <div className="flex items-center gap-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white">
                              {workspace.name[0]}
                            </div>
                            <span>{workspace.name}</span>
                            {isRefetching && (
                              <BiLoaderAlt className="h-5 w-5 animate-spin text-neutral-500" />
                            )}
                          </div>
                          <FaCaretRight
                            className={`${
                              open ? "rotate-90 transform" : ""
                            } h-5 w-5 text-inherit`}
                          />
                        </div>
                      </Disclosure.Button>
                      {!workspace.personal && (
                        <div className="flex items-center gap-3">
                          <WorkspaceSettingsModal workspace={workspace} />
                        </div>
                      )}
                    </div>

                    <Transition
                      enter="transition duration-150 ease-in"
                      enterFrom="transform  -translate-y-3 opacity-0"
                      enterTo="transform translate-y-0  opacity-100"
                      leave="transition duration-150 ease-out"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform -translate-y-3 opacity-0"
                    >
                      <Disclosure.Panel className="px-4">
                        <BoardList workspace={workspace} />
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          );
        })}
        <div className="px-6">
          {workspaces?.length === 0 && "No Workspace Found"}
        </div>
        <CreateNewWorkspaceModal />
      </div>
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
