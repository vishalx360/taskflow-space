import BoardList, { BoardListSkeleton } from "~/modules/Dashboard/BoardList";
import { api } from "~/utils/api";

function Workspaces() {
    const { data: workspaces, isLoading } = api.dashboard.getAllWorkspace.useQuery();
    if (isLoading) {
        return <WorkspaceListSkeleton />
    }
    return (
        <div className="space-y-10">
            <h1 className="uppercase tracking-wider">Your Workspaces</h1>
            {/* TOOD: show workspaces tabs  */}
            {workspaces?.map((workspace) => {
                return (
                    <div key={workspace.id} className="">
                        <div className='p-2 border-b-2 border-gray-200 font-semibold my-5 text-xl'>
                            {workspace.name}
                        </div>
                        <div className="">
                            <BoardList workspaceId={workspace.id} />
                        </div>
                    </div>
                )

            })}
            {workspaces?.length === 0 && "No Workspace Found"}
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

