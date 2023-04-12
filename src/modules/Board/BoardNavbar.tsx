import BoardSettingsModal from "@/modules/Board/BoardSettingsModal/BoardSettingsModal";
import LogoImage from "@/modules/Global/LogoImage";
import { type Board } from "@prisma/client";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import WorkspaceMembersModal from "./WorkspaceMembersModal/WorkspaceMembersModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/ui/tooltip";
import {
  ArrowRight,
  ChevronRight,
  ChevronsLeftRight,
  ChevronsRight,
} from "lucide-react";

function BoardNavbar({ board }: { board: Board }) {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-black/40 px-4 py-3 text-white  sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-5  md:gap-10 lg:gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-5 rounded-full border-2 border-neutral-400 p-2 transition duration-200 ease-in-out hover:bg-neutral-300/20 hover:text-white"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-200 p-3 text-sm font-bold uppercase text-neutral-900  md:h-8 md:w-8 md:text-xl">
                    {board?.Workspace.name[0]}
                  </span>
                  <ChevronsRight />
                </TooltipTrigger>
                <TooltipContent>
                  {board?.Workspace.name} Workspace
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="self-center whitespace-nowrap text-xl font-medium text-white line-clamp-1">
              {board?.name}
            </span>
          </div>
        </div>
        <Link href="/" className="hidden items-center md:flex">
          <LogoImage />
        </Link>
        <div className="flex items-center gap-2">
          {!board?.Workspace?.personal && (
            <WorkspaceMembersModal hideText workspace={board.Workspace} />
          )}
          <BoardSettingsModal board={board} />
        </div>
      </div>
    </nav>
  );
}

export default BoardNavbar;
