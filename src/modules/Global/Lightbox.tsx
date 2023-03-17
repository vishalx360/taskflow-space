import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

export default function Lightbox({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="cursor-zoom-in" onClick={openModal}>
        {children}
      </div>

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
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md" />
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
                <Dialog.Panel className="relative shadow-2xl transition-all">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="absolute right-2 top-2 z-10  items-center rounded-lg p-2 text-sm text-white  hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
                    aria-controls="navbar-default"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Close Image Preview</span>
                    <FiX size="2em" />
                  </button>
                  {React.Children.map<ReactNode, ReactNode>(
                    children,
                    (child) => {
                      if (React.isValidElement(child)) {
                        return React.cloneElement(
                          child,
                          {
                            height: "900",
                            width: "900",
                            className:
                              "border-2 border-white border-opacity-20 rounded-xl",
                          },
                          null
                        );
                      }
                    }
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
