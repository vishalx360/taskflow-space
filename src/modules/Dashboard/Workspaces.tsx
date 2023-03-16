import { Disclosure, Transition } from "@headlessui/react";
import { FaCaretRight } from "react-icons/fa";
import BoardList, { BoardListSkeleton } from "~/modules/Dashboard/BoardList";
import { api } from "~/utils/api";

function Workspaces() {
    const { data: workspaces, isLoading } = api.dashboard.getAllWorkspace.useQuery();
    if (isLoading) {
        return <WorkspaceListSkeleton />
    }
    return (
        <div>
            <h1 className="uppercase tracking-wider text-neutral-500 font-medium">Your Workspaces</h1>
            <div className="space-y-10">
                {/* TOOD: show workspaces tabs  */}
                {workspaces?.map((workspace) => {
                    return (
                        <div key={workspace.id} className="">
                            <Disclosure defaultOpen>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="w-full transition-all">
                                            <div className='w-full flex items-center justify-between gap-10 p-2 border-b-2 border-gray-200 font-semibold my-5 text-xl'>
                                                <h1>
                                                    {workspace.name}
                                                </h1>
                                                {/* <IconButton Icon={MdSettings} >
                                                Settings
                                            </IconButton> */}

                                                <FaCaretRight
                                                    className={`${open ? "rotate-90 transform" : ""
                                                        } h-5 w-5 text-inherit`}
                                                />
                                            </div>

                                        </Disclosure.Button>
                                        <Transition
                                            enter="transition duration-150 ease-in"

                                            enterFrom="transform  -translate-y-3 opacity-0"
                                            enterTo="transform translate-y-0  opacity-100"

                                            leave="transition duration-150 ease-out"

                                            leaveFrom="transform translate-y-0 opacity-100"
                                            leaveTo="transform -translate-y-3 opacity-0"
                                        >
                                            <Disclosure.Panel>
                                                <BoardList workspaceId={workspace.id} />
                                            </Disclosure.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Disclosure>
                        </div>
                    )

                })}
                {workspaces?.length === 0 && "No Workspace Found"}
            </div>
        </div>
    )
}

export default Workspaces


function WorkspaceListSkeleton() {
    return <div className="space-y-10">
        <h1 className="uppercase tracking-wider">Your Workspaces</h1>
        <WorkspaceSkeleton />
        <WorkspaceSkeleton />
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

