import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Board, type Workspace } from "@prisma/client";
import geopattern from "geopattern";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";

import { api } from "@/utils/api";
import { Plus } from "lucide-react";
import CreateNewBoardModal from "./CreateNewBoardModal";
import { BoardBoxMotionVariants } from "./BoardBox";
import { motion } from "framer-motion";

export default function BoardList({ workspace }: { workspace: Workspace }) {
  const { data: boards, isLoading } = api.board.getAllBoards.useQuery({
    workspaceId: workspace.id,
  });
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardListSkeleton />;
  }
  return (
    <div ref={parent} className="flex flex-col items-center ">
      {boards?.map((board) => (
        <BoardRow key={board.id} board={board} />
      ))}
      {workspace?.members[0]?.role !== "MEMBER" && (
        <CreateNewBoardModal workspaceId={workspace.id}>
          <div
            className={`group relative flex w-full items-center gap-5 p-3 transition-all hover:-translate-y-[2px] hover:bg-neutral-200/50`}
          >
            <div className="relative w-32">
              <div
                className={`flex aspect-video items-center justify-center rounded-xl border-2 border-black/20 text-black/40`}
              >
                <Plus />
              </div>
            </div>

            <div className="w-full ">
              <div className="flex w-full flex-col  items-start justify-between ">
                <h2 className="font-medium">Create new board</h2>
                <p className="mt-1 text-xs text-neutral-400">
                  in {workspace.name}
                </p>
              </div>
            </div>
          </div>
        </CreateNewBoardModal>
      )}
    </div>
  );
}

export function RecentBoardList() {
  const { data: boards, isLoading } = api.board.getRecentBoards.useQuery();
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardListSkeleton />;
  }
  return (
    <div ref={parent} className="flex flex-col items-center ">
      {boards?.map((board) => (
        <BoardRow key={board.id} board={board} />
      ))}
    </div>
  );
}

function BoardRow({ board }: { board: Board }): JSX.Element {
  const background = geopattern.generate(board.id).toDataUri();

  let boardUrl = `/board/${board.id}`;
  const newParams = new URLSearchParams();
  newParams.append("boardName", board.name);
  newParams.append("background", board.background || "");
  boardUrl = boardUrl + "?" + newParams.toString();

  return (
    <Link prefetch={false} href={boardUrl} className="w-full">
      <motion.div
        key={board.id}
        variants={BoardBoxMotionVariants}
        className={`group relative flex w-full items-center gap-5 p-3 transition-all hover:-translate-y-[2px] hover:bg-neutral-200/50`}
      >
        <div className="relative w-32">
          {board?.background && board.background.startsWith("wallpaper:") && (
            <Image
              className="aspect-video w-full rounded-xl bg-gray-200 object-cover "
              alt="background"
              width={90}
              height={40}
              src={board.background.slice(10)}
            />
          )}
          {board?.background && board.background.startsWith("gradient:") && (
            <div
              className={`aspect-video rounded-xl`}
              style={{ backgroundImage: board.background.slice(9) }}
            />
          )}
          {!board?.background && (
            <Image
              height="50"
              width="80"
              src={background}
              alt=""
              className={`aspect-video rounded-xl`}

              // className="aspect-video h-28 w-full object-cover md:h-40 md:w-[18rem]"
            />
          )}
        </div>

        <div className="w-full ">
          <div className="flex w-full flex-col  items-start justify-between ">
            <h2 className="line-clamp-1 font-medium">{board.name}</h2>
            <TimeAgo
              className="mt-1 text-xs text-neutral-400"
              date={board.updatedAt}
              live={false}
            />
          </div>
        </div>
      </motion.div>
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
