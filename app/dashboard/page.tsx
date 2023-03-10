import { prisma } from "~/server/db";
import BoardList from "./components/BoardList";

async function DashboardPage() {
    const workspaces = await prisma.workspace.findMany();
    return (
        <div className="p-10">
            {/* TOOD: show workspaces tabs  */}
            {workspaces?.map((workspace) => {
                return (
                    <div key={workspace.id} className="border-2 border-gray-300">
                        <div className='p-2'>
                            {workspace.name}
                            <p>
                                Created on: {workspace.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                        <div className='p-2'>
                            Boards
                            <BoardList workspaceId={workspace.id} />
                        </div>
                    </div>
                )

            })}
        </div>
    )
}

export default DashboardPage

