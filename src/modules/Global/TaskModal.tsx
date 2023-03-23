import { Dialog, Transition } from "@headlessui/react";
import { type Task } from "@prisma/client";
import { Fragment, useState } from "react";
import { FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { api } from "~/utils/api";
import PrimaryButton from "./PrimaryButton";
import Toast from "./Toast";

export default function TaskModal({
  children,
  task,
}: {
  children: React.ReactNode;
  task: Task;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const utils = api.useContext();
  const deleteMutation = api.board.deleteTask.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      // TODO: optimistically update the UI
      await utils.board.getTasks
        .invalidate({ listId: task.listId })
        .catch((err) => console.log(err));
      Toast({ content: "Task deleted successfully!", status: "success" });
      setIsOpen(false);
    },
  });

  return (
    <>
      {children ? (
        <button className="text-start" type="button" onClick={openModal}>
          {children}
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open Task Modal
        </button>
      )}

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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex items-start justify-between gap-5 text-2xl font-medium leading-8 text-gray-900 "
                  >
                    {task?.title}
                    <button
                      onClick={closeModal}
                      type="button"
                      className="rounded-lg p-2 text-xs text-inherit transition-all  hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
                      aria-controls="navbar-default"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Close Task Modal</span>
                      <FiX size="2em" />
                    </button>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {task?.createdAt?.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{task?.description}</p>
                    <textarea
                      name="description"
                      id=""
                      className="h-40 w-full rounded-md border border-gray-300 p-2"
                      rows={10}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton
                      type="button"
                      isLoading={deleteMutation.isLoading}
                      onClick={() => deleteMutation.mutate({ taskId: task.id })}
                      LeftIcon={MdDelete}
                      loadingText="Deleting Task"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    >
                      Delete Task
                    </PrimaryButton>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Save Changes
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
