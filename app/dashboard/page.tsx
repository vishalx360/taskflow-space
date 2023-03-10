import { prisma } from "~/server/db";
import BoardList from "./components/BoardList";

async function DashboardPage() {
    const workspaces = await prisma.workspace.findMany();
    return (
        <div className="p-10 space-y-10">
            {/* TOOD: show workspaces tabs  */}
            {workspaces?.map((workspace) => {
                return (
                    <div key={workspace.id} className="">
                        <div className='p-2 border-b-2 border-gray-300 my-5 text-xl'>
                            {workspace.name}
                        </div>
                        <div className="">
                            <BoardList workspaceId={workspace.id} />
                        </div>
                    </div>
                )

            })}
        </div>
    )
}

export default DashboardPage

