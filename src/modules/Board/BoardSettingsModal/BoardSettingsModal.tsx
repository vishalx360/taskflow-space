import { type Board } from "@prisma/client";
import { Layout } from "lucide-react";
import {
  Children,
  cloneElement,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { MdSettings } from "react-icons/md";

import { useBoardSettingsModal } from "@/contexts/BoardSettingsModalContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { Button } from "@/modules/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { api } from "@/utils/api";

import DeleteBoardSection from "./DeleteBoardSection";
import UpdateBoardSection from "./UpdateBoardSection";

export default function BoardSettingsModal({
  board,
  children,
  closeGlobalModal,
  isGlobal = false,
}: {
  board: Board | null;
  children?: ReactNode;
  isGlobal?: boolean;
  closeGlobalModal?: () => void;
}) {
  const { closeModal, isOpen, openModal } = useBoardSettingsModal();

  const originalBgRef = useRef(board?.background);
  const currentBgRef = useRef(board?.background);

  useEffect(() => {
    if (isGlobal) {
      originalBgRef.current = board?.background;
      currentBgRef.current = board?.background;
    }
  }, [board]);

  const utils = api.useContext();
  // update board background
  const UpdatelocalBackground = (background: string) => {
    utils.board.getBoard.setData({ boardId: board?.id || "" }, (prev) => {
      if (prev) {
        return { ...prev, background };
      }
      return prev;
    });
    currentBgRef.current = background;
  };
  const UpdateGlobalBackground = (background: string) => {
    utils.board.getAllBoards.setData(
      { workspaceId: board?.workspaceId },
      (prev) => {
        if (prev) {
          return prev.map((currentBoard) => {
            if (currentBoard.id === board?.id) {
              return { ...currentBoard, background };
            }
            return currentBoard;
          });
        }
        return prev;
      }
    );
    utils.board.getRecentBoards.setData(undefined, (prev) => {
      if (prev) {
        return prev.map((currentBoard) => {
          if (currentBoard.id === board?.id) {
            return { ...currentBoard, background };
          }
          return currentBoard;
        });
      }
      return prev;
    });
    currentBgRef.current = background;
  };
  function setIsOpen(value: boolean) {
    if (value) {
      openModal(board);
    } else {
      closeModalSideEffect();
    }
  }

  function closeModalSideEffect() {
    console.log("closing modal");
    if (currentBgRef.current !== originalBgRef.current) {
      if (isGlobal) {
        UpdateGlobalBackground(originalBgRef.current);
      } else {
        UpdatelocalBackground(originalBgRef.current);
      }
    }
    closeModal();
    closeGlobalModal && closeGlobalModal();
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {!isGlobal && (
            <>
              {children ? (
                <>
                  {Children.map(children, (child: ReactNode) =>
                    cloneElement(child, { onClick: openModal })
                  )}
                </>
              ) : (
                <Button
                  onClick={openModal}
                  LeftIcon={MdSettings}
                  variant="default"
                  className=" bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
                >
                  <p>Settings</p>
                </Button>
              )}
            </>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4 font-medium">
              <Layout /> Board Settings
            </DialogTitle>
          </DialogHeader>

          <Accordion type="single" defaultValue="board-details" collapsible>
            <UpdateBoardSection
              originalBgRef={originalBgRef}
              UpdatelocalBackground={
                isGlobal ? UpdateGlobalBackground : UpdatelocalBackground
              }
              board={board}
              setIsOpen={setIsOpen}
            />
            {/* <Divider /> */}
            <AccordionItem value="delete-section">
              <AccordionTrigger className="px-2">Delete board</AccordionTrigger>
              <AccordionContent className="p-2">
                {board && (
                  <DeleteBoardSection
                    board={board}
                    closeModal={closeModalSideEffect}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  );
}
