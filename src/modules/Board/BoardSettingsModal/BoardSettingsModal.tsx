import { Dialog, Transition } from "@headlessui/react";
import { type Board } from "@prisma/client";
import { Fragment, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
import Divider from "~/modules/Global/Divider";
import IconButton from "~/modules/Global/IconButton";
import { api } from "~/utils/api";
import DeleteBoardSection from "./DeleteBoardSection";
import UpdateWorkspaceSection from "./UpdateWorkspaceSection";

export default function BoardSettingsModal({ board }: { board: Board | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentBackground = useRef(board?.background);
  const utils = api.useContext();
  // update board background
  const UpdatelocalBackground = (background: string) => {
    utils.board.getBoard.setData({ boardId: board.id || "" }, (prev) => {
      if (prev) {
        return { ...prev, background };
      }
      return prev;
    });
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    if (currentBackground.current !== board?.background) {
      UpdatelocalBackground(currentBackground.current);
    }
    setIsOpen(false);
  }

  return (
    <>
      <IconButton
        onClick={openModal}
        Icon={MdSettings}
        className=" bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
      >
        <p className="hidden lg:inline">Settings</p>
      </IconButton>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

                  <UpdateWorkspaceSection
                    currentBackground={currentBackground}
                    UpdatelocalBackground={UpdatelocalBackground}
                    board={board}
                    setIsOpen={setIsOpen}
                  />
                  <Divider />
                  <DeleteBoardSection board={board} closeModal={closeModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
