import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Board, type Workspace } from "@prisma/client";
import geopattern from "geopattern";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";
import CreateNewBoardModal from "./CreateNewBoardModal";

export default function BoardList({ workspace }: { workspace: Workspace }) {
  const { data: boards, isLoading } = api.board.getAllBoards.useQuery({
    workspaceId: workspace.id,
  });
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardListSkeleton />;
  }
  return (
    <div
      ref={parent}
      className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-5"
    >
      {boards?.map((board) => (
        <Board key={board.id} board={board} />
      ))}
      {workspace?.members[0]?.role !== "MEMBER" && (
        <CreateNewBoardModal workspace={workspace} />
      )}
    </div>
  );
}

function Board({ board }: { board: Board }): JSX.Element {
  const background = geopattern.generate(board.id).toDataUri();

  let boardUrl = `/board/${board.id}`;
  const newParams = new URLSearchParams();
  newParams.append("boardName", board.name);
  newParams.append("background", board.background || "");
  boardUrl = boardUrl + "?" + newParams.toString();

  return (
    <Link
      prefetch={false}
      href={boardUrl}
      className={`group relative w-full overflow-hidden rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl md:w-fit`}
    >
      <div className="h-28 w-full object-cover md:h-40 md:w-[18rem]">
        {board?.background && board.background.startsWith("wallpaper:") && (
          <Image
            className="h-28 w-full object-cover md:h-40 md:w-[18rem]"
            alt="background"
            fill
            src={board.background.slice(10)}
          />
        )}
        {board?.background && board.background.startsWith("gradient:") && (
          <div
            className="h-full w-full"
            style={{ backgroundImage: board.background.slice(9) }}
          />
        )}
        {!board?.background && (
          <Image
            height="50"
            width="150"
            src={background}
            alt=""
            className="h-28 w-full object-cover md:h-40 md:w-[18rem]"
          />
        )}
      </div>

      <div className="absolute bottom-0 flex h-full w-full items-end whitespace-nowrap bg-gradient-to-t from-black p-5 text-sm  font-medium text-white md:text-lg ">
        <div className="flex w-full items-center justify-between ">
          <h2>{board.name}</h2>
        </div>
      </div>
    </Link>
  );
}

export function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-5">
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
    </div>
  );
}

export function BoardSkeleton(): JSX.Element {
  return (
    <div
      className={`h-28 w-full animate-pulse rounded-xl bg-gray-300 object-cover md:h-40 md:w-[18rem]`}
    >
      <div className="h-40 w-full md:w-[18rem]" />
    </div>
  );
}
