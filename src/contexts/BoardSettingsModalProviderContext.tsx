import BoardSettingsModal from "@/modules/Board/BoardSettingsModal/BoardSettingsModal";
import { type Board } from "@prisma/client";
import { createContext, useContext, useState, type ReactNode } from "react";

type ModalContextType = {
  isOpen: boolean;
  openModal: (board: Board) => void;
  closeModal: () => void;
};

export const BoardSettingsModalModalContext = createContext<ModalContextType>({
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
    <BoardSettingsModalModalContext.Provider
      value={{ isOpen: Boolean(board), openModal: openModal, closeModal }}
    >
      <BoardSettingsModal
        closeGlobalModal={closeModal}
        board={board}
        isGlobal
      />
      {children}
    </BoardSettingsModalModalContext.Provider>
  );
};

export const useBoardSettingsModal = () => {
  return useContext(BoardSettingsModalModalContext);
};
