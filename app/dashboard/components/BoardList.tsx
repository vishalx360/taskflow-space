import { prisma } from "~/server/db";

export default async function BoardList({ workspaceId }: { workspaceId: string }) {
    const boards = await prisma.board.findMany({ where: { workspaceId } });
    return (
        <div className="flex items-center p-10 gap-10 ">
            {boards.map(board => {
                return <div key={board.id} className="py-5 px-10 bg-gray-300 rounded-xl">
                    <div className='p-2'>
                        {board.name}
                        <p>
                            Created on: {board.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>
            })}
        </div>
    )
}
