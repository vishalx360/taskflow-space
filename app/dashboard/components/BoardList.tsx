import Image from "next/image";
import { prisma } from "~/server/db";
import geopattern from "geopattern";

export default async function BoardList({ workspaceId }: { workspaceId: string }) {
    const boards = await prisma.board.findMany({ where: { workspaceId } });
    const background = geopattern.generate(workspaceId).toDataUri()
    return (
        <div className="flex items-center gap-10 ">
            {boards.map(board => {
                return <div key={board.id} className={` bg-red-300 relative overflow-hidden rounded-xl`}>
                    <Image
                        height="50"
                        width="150"
                        src={background}
                        alt=""
                        className="object-cover h-32 w-52"
                    />
                    <div className='text-white font-bold absolute bottom-0 p-5'>
                        {board.name}
                    </div>
                </div>
            })}
        </div>
    )
}
