import { type Board } from "@prisma/client";
import Image from "next/image";

function BoardBackground({ board }: { board: Board }) {
  return (
    <div className="fixed top-0 left-0 h-full w-screen bg-neutral-900">
      {board?.background && board.background.startsWith("wallpaper:") && (
        <Image
          className="w-screen object-cover"
          alt="background"
          fill
          src={board.background.slice(10)}
        />
      )}
      {board?.background && board.background.startsWith("gradient:") && (
        <div
          className="h-screen w-screen"
          style={{ backgroundImage: board.background.slice(9) }}
        />
      )}
    </div>
  );
}

export default BoardBackground;
