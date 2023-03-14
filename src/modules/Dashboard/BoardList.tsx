import Image from "next/image";
import geopattern from "geopattern";
import { api } from "~/utils/api";
import { Board } from "@prisma/client";
import Link from "next/link";

export default function BoardList({ workspaceId }: { workspaceId: string }) {
    const { data: boards, isLoading } = api.dashboard.getAllBoards.useQuery({ workspaceId });

    if (isLoading) {
        return <BoardListSkeleton />
    }
    return (
        <div className="flex flex-wrap gap-5">
            {boards?.map(board => <Board key={board.id} board={board} />)}
            {boards?.length === 0 && "No Boards Found"}
        </div>
    )
}

function Board({ board }: { board: Board }): JSX.Element {
    const background = geopattern.generate(board.id).toDataUri()
    return <div className={`relative overflow-hidden rounded-xl hover:-translate-y-1 transition-all w-full md:w-fit`}>
        <Image
            height="50"
            width="150"
            src={background}
            alt=""
            className="object-cover h-40 w-full md:w-[18rem]" />
        <div className='text-white font-bold absolute bottom-0 p-5 w-full h-full bg-gradient-to-t from-black group flex items-end'>
            <div className="flex w-full justify-between items-center">
                <h2>
                    {board.name}
                </h2>
                <Link prefetch={false} href={`/board/${board.id}`} className="opacity-0 group-hover:opacity-100 transition-all bg-white text-black rounded-full py-2 px-4 shadow-sm">Open</Link>
            </div>
        </div>
    </div>;
}


export function BoardListSkeleton() {
    return <div className="flex flex-wrap gap-5">
        <BoardSkeleton />
        <BoardSkeleton />
        <BoardSkeleton />
        <BoardSkeleton />
        <BoardSkeleton />
    </div>

}

export function BoardSkeleton(): JSX.Element {
    return (
        <div className={`animate-pulse bg-gray-300 rounded-xl w-full md:w-fit`} >
            <div className="h-40 w-full md:w-[18rem]" />
        </div>
    )
}

