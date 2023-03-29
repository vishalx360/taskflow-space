import { type Board } from "@prisma/client";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import BoardSettingsModal from "~/modules/Board/BoardSettingsModal/BoardSettingsModal";
import LogoImage from "~/modules/Global/LogoImage";
import BoardMembersModal from "./BoardMembersModal/BoardMembersModal";

function BoardNavbar({ board }: { board: Board }) {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-black/20 px-4 py-3 text-white shadow sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-5 rounded-full border-2 border-neutral-400 p-2 transition duration-200 ease-in-out hover:bg-neutral-300/20 hover:text-white"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <span className="self-center whitespace-nowrap text-xl font-semibold italic text-white">
            {board?.name}
          </span>
        </div>
        <Link href="/" className="flex items-center">
          <LogoImage />
        </Link>
        <div className="flex items-center gap-3">
          <BoardMembersModal members={board?.members} />
          <BoardSettingsModal board={board} />
        </div>
      </div>
    </nav>
  );
}

export default BoardNavbar;
