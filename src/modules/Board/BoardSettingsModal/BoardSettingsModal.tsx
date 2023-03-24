import { Dialog, Transition } from "@headlessui/react";
import { type Board } from "@prisma/client";
import { Fragment, useState } from "react";
import { FiX } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
import IconButton from "~/modules/Global/IconButton";
import DeleteBoardSection from "./DeleteBoardSection";
import RenameBoardSection from "./RenameBoardSection";

export default function BoardSettingsModal({ board }: { board: Board | null }) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <IconButton
        onClick={openModal}
        Icon={MdSettings}
        className="border-2 bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
      >
        Settings
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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

                  <RenameBoardSection board={board} setIsOpen={setIsOpen} />
                  <div className="my-5 w-full  border-[1px]" />
                  <DeleteBoardSection board={board} setIsOpen={setIsOpen} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
