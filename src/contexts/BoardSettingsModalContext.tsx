import { type Board } from "@prisma/client";
import { createContext, type ReactNode,useContext, useState } from "react";

import BoardSettingsModal from "@/modules/Board/BoardSettingsModal/BoardSettingsModal";

type ModalContextType = {
  isOpen: boolean;
  openModal: (board: Board) => void;
  closeModal: () => void;
};

export const BoardSettingsModalContext = createContext<ModalContextType>({
  isOpen: false,
  openModal: () => console.warn("No modal provider"),
  closeModal: () => console.warn("No modal provider"),
});

export const BoardSettingsModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [board, setBoard] = useState<Board | null>(null);

  const openModal = (providedBoard: Board) => {
    setBoard(providedBoard);
  };

  const closeModal = () => {
    setBoard(null);
  };

  return (
    <BoardSettingsModalContext.Provider
      value={{ isOpen: Boolean(board), openModal: openModal, closeModal }}
    >
      <BoardSettingsModal
        closeGlobalModal={closeModal}
        board={board}
        isGlobal
      />
      {children}
    </BoardSettingsModalContext.Provider>
  );
};

export const useBoardSettingsModal = () => {
  return useContext(BoardSettingsModalContext);
};
