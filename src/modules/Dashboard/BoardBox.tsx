import { type Board as BoardBox } from "@prisma/client";
import { motion } from "framer-motion";
import geopattern from "geopattern";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { BoardBoxContextMenu } from "../Global/BoardBoxContextMenu";

export const BoardBoxMotionVariants = {
  hidden: {
    y: 10,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
  },
};

export function BoardBox({
  board,
}: {
  board: BoardBox;
  fill?: boolean;
}): JSX.Element {
  const defaultBackground = geopattern.generate(board.id).toDataUri();

  let boardUrl = `/board/${board.id}`;
  const newParams = new URLSearchParams();
  newParams.append("boardName", board.name);
  newParams.append("background", board.background || "");
  boardUrl = boardUrl + "?" + newParams.toString();

  return (
    <Link className="group rounded-xl" href={boardUrl}>
      <motion.div
        key={board.id}
        variants={BoardBoxMotionVariants}
        className={`relative w-full rounded-xl md:w-fit`}
      >
        <div className="overflow-hidden rounded-xl">
          <BoardBoxContextMenu key={board.id} board={board}>
            <div
              className={`h-28 w-full overflow-hidden rounded-xl transition-transform  duration-500 group-hover:scale-110 group-focus:scale-110 md:h-40 md:w-[15rem] lg:w-[18rem]`}
            >
              {board?.background &&
                board.background.startsWith("wallpaper:") && (
                  <Image
                    className="h-28 w-full overflow-hidden rounded-xl object-cover  md:h-40 md:w-[15rem] lg:w-[18rem]"
                    alt="background"
                    fill
                    src={board.background.slice(10)}
                  />
                )}
              {board?.background &&
                board.background.startsWith("gradient:") && (
                  <div
                    className="h-full w-full "
                    style={{ backgroundImage: board.background.slice(9) }}
                  />
                )}
              {!board?.background && (
                <Image
                  height="50"
                  width="150"
                  src={defaultBackground}
                  alt=""
                  className="
                  h-28 w-full object-cover  md:h-40 md:w-[15rem] lg:w-[18rem]"
                />
              )}
            </div>

            <div className="absolute bottom-0 flex h-full w-full items-end overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-t from-black to-black/20 p-3 text-sm font-medium  text-white md:p-5 md:text-lg ">
              <div className="flex w-full flex-col items-start justify-between ">
                <h2 className="font-medium">{board.name}</h2>
                <TimeAgo
                  className="mt-1 text-xs text-neutral-400"
                  date={board.updatedAt}
                  live={false}
                />
              </div>
            </div>
          </BoardBoxContextMenu>
        </div>
      </motion.div>
    </Link>
  );
}

export function BoardBoxSkeleton(): JSX.Element {
  return (
    <div
      className={`h-28 w-full animate-pulse rounded-xl bg-gray-300 object-cover md:h-40 md:w-[15rem] lg:w-[18rem]`}
    >
      <div className="h-40 w-full md:w-[15rem] lg:w-[18rem]" />
    </div>
  );
}
