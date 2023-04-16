import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/modules/ui/context-menu";
import { type ReactNode } from "react";

import { useBoardSettingsModal } from "@/contexts/BoardSettingsModalProviderContext";
import { ContextMenuShortcut } from "@/modules/ui/context-menu";
import { type Board } from "@prisma/client";
import { useRouter } from "next/router";

export function BoardBoxContextMenu({
  children,
  board,
}: {
  board: Board;
  children: ReactNode;
}): JSX.Element {
  const router = useRouter();
  const { openModal } = useBoardSettingsModal();

  function openBoard(e) {
    e.stopPropagation();
    void router.push(`/board/${board.id}`);
  }

  function openBoardInNewTab(e) {
    e.stopPropagation();
    window.open(`/board/${board.id}`, "_blank");
  }
  function openGlobalBoardSettingsModal(e) {
    e.stopPropagation();
    openModal(board);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={openBoard} inset>
          Open
          <ContextMenuShortcut>⌘{"["}</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={openBoardInNewTab} inset>
          Open in new tab
          <ContextMenuShortcut>⌘{"]"}</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={openGlobalBoardSettingsModal} inset>
          Settings
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
