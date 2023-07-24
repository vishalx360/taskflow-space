import { type Board } from "@prisma/client";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import BoardSettingsModal from "@/modules/Board/BoardSettingsModal/BoardSettingsModal";
import LogoImage from "@/modules/Global/LogoImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/ui/tooltip";

import WorkspaceMembersModal from "./WorkspaceMembersModal/WorkspaceMembersModal";

function BoardNavbar({ board }: { board: Board }) {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-black/40 px-4 py-3 text-white  sm:px-4">
      <div className="container relative mx-auto  flex flex-wrap items-center justify-between md:max-w-[90vw]">
        <div className="flex items-center gap-5  md:gap-10 lg:gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-5 rounded-full border-2 border-neutral-400 p-2 transition duration-200 ease-in-out hover:bg-neutral-300/20 hover:text-white"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <span className=" lg:text-md line-clamp-1 max-w-[90%] text-sm font-medium  text-white md:max-w-[20vw] md:text-xl lg:max-w-[20vw]">
              {board?.name}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  <span className="md:text-md flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100/10 p-3 text-sm font-bold uppercase text-neutral-100 md:h-6 md:w-6 lg:text-lg  xl:hidden  xl:h-8 xl:w-8">
                    {board?.Workspace.name[0]}
                  </span>
                  <span className="md:text-md hidden rounded-md bg-neutral-100/10 p-1 px-3 text-sm font-medium uppercase text-neutral-100 lg:text-xs xl:flex  ">
                    {board?.Workspace.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {board?.Workspace.name} Workspace
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Link
          href="/"
          className="absolute left-[50%] hidden -translate-x-[50%] lg:inline"
        >
          <LogoImage />
        </Link>
        <div className="flex items-center gap-2">
          {!board?.Workspace?.personal && (
            <WorkspaceMembersModal hideText workspace={board?.Workspace} />
          )}
          <BoardSettingsModal board={board} />
        </div>
      </div>
    </nav>
  );
}

export default BoardNavbar;
