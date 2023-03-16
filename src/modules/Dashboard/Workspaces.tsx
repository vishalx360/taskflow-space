import { Disclosure, Transition } from "@headlessui/react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCaretRight } from "react-icons/fa";
import BoardList, { BoardListSkeleton } from "~/modules/Dashboard/BoardList";
import { api } from "~/utils/api";
import CreateNewWorkspaceModal from "./CreateNewWorkspaceModal";
import WorkspaceSettingsModal from "./WorkspaceSettingsModal/WorkspaceSettingsModal";

function Workspaces() {
    const { data: workspaces, isLoading, isRefetching } = api.dashboard.getAllWorkspace.useQuery();
    if (isLoading) {
        return <WorkspaceListSkeleton />
    }
    return (
        <div className="">
            <h1 className="p-5 uppercase tracking-wider text-neutral-500 font-medium">Your Workspaces</h1>
            <div className="relative space-y-5">
                {/* TOOD: show workspaces tabs  */}
                {workspaces?.map((workspace) => {
                    return (
                        <div key={workspace.id} >
                            <Disclosure defaultOpen={workspace.personal}>
                                {({ open }) => (
                                    <>
                                        <div className="flex items-center gap-5 mb-5">
                                            <Disclosure.Button className="border-b-2 sticky top-20 z-10 bg-white w-full transition-all ">
                                                <div className='border-l-[10px] md:rounded-l-md border-gray-600 hover:bg-neutral-100 w-full flex items-center justify-between gap-10 py-2 px-5 rounded-t-xl rounded-l-none font-semibold  text-xl'>
                                                    <div className="flex items-center gap-5">
                                                        <span>
                                                            {workspace.name}
                                                        </span>
                                                        {isRefetching && <BiLoaderAlt className="animate-spin h-5 w-5 text-neutral-500" />}
                                                    </div>
                                                    <FaCaretRight
                                                        className={`${open ? "rotate-90 transform" : ""
                                                            } h-5 w-5 text-inherit`}
                                                    />
                                                </div>

                                            </Disclosure.Button>
                                            {!workspace.personal && <div className="flex gap-3 items-center">
                                                <WorkspaceSettingsModal workspace={workspace} />
                                            </div>}
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
                    )

                })}
                {workspaces?.length === 0 && "No Workspace Found"}
                <CreateNewWorkspaceModal />
            </div>
        </div>
    )
}

export default Workspaces


function WorkspaceListSkeleton() {
    return <div className="">
        <h1 className="p-5 uppercase tracking-wider text-neutral-500 font-medium">Your Workspaces</h1>
        <div className="px-4">
            <WorkspaceSkeleton />
            <WorkspaceSkeleton />
        </div>
    </div>

}

function WorkspaceSkeleton(): JSX.Element {
    return (
        <div  >
            <div className='p-2 border-b-2 font-semibold border-gray-200 text-xl'>
                <div className="h-10 w-28 rounded-xl my-3 bg-gray-300 animate-pulse"></div>
            </div>
            <div className="mt-3">
                <BoardListSkeleton />
            </div>
        </div>
    )
}

