import IconButton from "@/modules/Global/IconButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { type Board } from "@prisma/client";
import {
  Children,
  Fragment,
  cloneElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FiX } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
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
  const [isOpen, setIsOpen] = useState(false);

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

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    console.log("closing modal");
    if (currentBgRef.current !== originalBgRef.current) {
      if (isGlobal) {
        UpdateGlobalBackground(originalBgRef.current);
      } else {
        UpdatelocalBackground(originalBgRef.current);
      }
    }
    setIsOpen(false);
    closeGlobalModal && closeGlobalModal();
  }

  return (
    <>
      {!isGlobal && (
        <>
          {children ? (
            <>
              {Children.map(children, (child: ReactNode) =>
                cloneElement(child, { onClick: openModal })
              )}
            </>
          ) : (
            <IconButton
              onClick={openModal}
              Icon={MdSettings}
              className=" bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
            >
              <p className="hidden lg:inline">Settings</p>
            </IconButton>
          )}
        </>
      )}

      <Transition
        appear
        show={isGlobal ? Boolean(board) : isOpen}
        as={Fragment}
      >
        <Dialog as="div" className="relative z-[80]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex items-center justify-between gap-5 text-lg font-medium leading-6 text-gray-900 "
                  >
                    Board Settings
                    <button
                      onClick={closeModal}
                      type="button"
                      className="rounded-lg p-2 text-xs text-inherit transition-all  hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
                      aria-controls="navbar-default"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Close Image Preview</span>
                      <FiX size="2em" />
                    </button>
                  </Dialog.Title>
                  <Accordion
                    type="single"
                    defaultValue="board-details"
                    collapsible
                  >
                    <UpdateBoardSection
                      originalBgRef={originalBgRef}
                      UpdatelocalBackground={
                        isGlobal
                          ? UpdateGlobalBackground
                          : UpdatelocalBackground
                      }
                      board={board}
                      setIsOpen={setIsOpen}
                    />
                    {/* <Divider /> */}
                    <AccordionItem value="delete-section">
                      <AccordionTrigger className="px-2">
                        Delete board
                      </AccordionTrigger>
                      <AccordionContent className="p-2">
                        {board && (
                          <DeleteBoardSection
                            board={board}
                            closeModal={closeModal}
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
