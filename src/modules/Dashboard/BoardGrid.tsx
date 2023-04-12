import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Board as BoardBox, type Workspace } from "@prisma/client";
import geopattern from "geopattern";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";

import { api } from "@/utils/api";
import { BoardBoxContextMenu } from "../Global/BoardBoxContextMenu";
import CreateNewBoardModal from "./CreateNewBoardModal";

export default function BoardGrid({ workspace }: { workspace: Workspace }) {
  const { data: boards, isLoading } = api.board.getAllBoards.useQuery({
    workspaceId: workspace.id,
  });
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardGridSkeleton />;
  }
  return (
    <div
      ref={parent}
      className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-5"
    >
      {boards?.map((board) => (
        <BoardBox key={board.id} board={board} />
      ))}
      {workspace?.members[0]?.role !== "MEMBER" && (
        <CreateNewBoardModal workspace={workspace} />
      )}
    </div>
  );
}

export function RecentBoardGrid() {
  const { data: boards, isLoading } = api.board.getRecentBoards.useQuery();
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardGridSkeleton />;
  }
  return (
    <div
      ref={parent}
      className="grid grid-cols-2 gap-2 px-4 md:flex md:flex-wrap md:gap-5"
    >
      {boards?.map((board) => (
        <BoardBox key={board.id} board={board} />
      ))}
    </div>
  );
}

function BoardBox({ board }: { board: BoardBox }): JSX.Element {
  const background = geopattern.generate(board.id).toDataUri();

  let boardUrl = `/board/${board.id}`;
  const newParams = new URLSearchParams();
  newParams.append("boardName", board.name);
  newParams.append("background", board.background || "");
  boardUrl = boardUrl + "?" + newParams.toString();

  return (
    <BoardBoxContextMenu key={board.id} board={board}>
      <Link
        prefetch={false}
        href={boardUrl}
        className={`group relative w-full   transition-all hover:-translate-y-1 hover:shadow-xl md:w-fit`}
      >
        <div className="h-28 w-full overflow-hidden rounded-xl object-cover md:h-40 md:w-[18rem]">
          {board?.background && board.background.startsWith("wallpaper:") && (
            <Image
              className="h-28 w-full overflow-hidden rounded-xl object-cover md:h-40 md:w-[18rem]"
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

        <div className="absolute bottom-0 flex h-full w-full items-end overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-t from-black to-black/20 p-3 text-sm font-medium  text-white md:p-5 md:text-lg ">
          <div className="flex w-full flex-col  items-start justify-between ">
            <h2 className="font-medium">{board.name}</h2>
            <TimeAgo
              className="mt-1 text-xs text-neutral-400"
              date={board.updatedAt}
              live={false}
            />
          </div>
        </div>
      </Link>
    </BoardBoxContextMenu>
  );
}

export function BoardGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-5">
      <BoardBoxSkeleton />
      <BoardBoxSkeleton />
      <BoardBoxSkeleton />
      <BoardBoxSkeleton />
      <BoardBoxSkeleton />
    </div>
  );
}

export function BoardBoxSkeleton(): JSX.Element {
  return (
    <div
      className={`h-28 w-full animate-pulse rounded-xl bg-gray-300 object-cover md:h-40 md:w-[18rem]`}
    >
      <div className="h-40 w-full md:w-[18rem]" />
    </div>
  );
}