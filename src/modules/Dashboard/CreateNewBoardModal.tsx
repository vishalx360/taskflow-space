import { useToast } from "@/hooks/use-toast";
import { CreateNewBoardSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { type Workspace } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { Plus } from "lucide-react";
import { Fragment, type ReactNode, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../ui/button";

export default function CreateNewBoardModal({
  children,
  workspace,
}: {
  children: ReactNode;
  workspace: Workspace;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const initailFocusRef = useRef(null);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const utils = api.useContext();
  const { toast } = useToast();

  const mutation = api.board.createNewBoard.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async (newBoard) => {
      utils.board.getAllBoards.setData(
        { workspaceId: workspace.id },
        (oldData) => [...oldData, newBoard]
      );
      toast({ title: "New board created successfully!" });
      setIsOpen(false);
    },
  });

  return (
    <>
      {children ? (
        <button className="w-full" onClick={openModal}>
          {children}
        </button>
      ) : (
        <button
          onClick={openModal}
          className="relative  flex h-full w-full items-center rounded-xl border-neutral-300 bg-neutral-100 p-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-300/50 hover:ring-2  md:h-40 md:w-[18rem] md:text-lg"
        >
          <div className="flex w-full items-center justify-center gap-3">
            <FaPlusCircle />
            <h2>New board</h2>
          </div>
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          initialFocus={initailFocusRef}
          as="div"
          className="relative z-10"
          onClose={closeModal}
        >
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
                    Create new board in {workspace.name}
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
                  <div className="mt-2">
                    <Formik
                      initialValues={{ name: "", workspaceId: workspace.id }}
                      validationSchema={toFormikValidationSchema(
                        CreateNewBoardSchema
                      )}
                      onSubmit={(values) => {
                        mutation.mutate(values);
                      }}
                    >
                      <Form>
                        <div className="flex flex-col gap-2">
                          <Field name="name">
                            {({ field, meta }: FieldProps) => (
                              <div className="my-5">
                                <label
                                  htmlFor="name"
                                  className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                                >
                                  Board Name
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  ref={initailFocusRef}
                                  required
                                  placeholder="Board name"
                                  {...field}
                                  className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline-none focus:outline"
                                />
                                {meta.touched && meta.error && (
                                  <p className="ml-2 mt-2 text-sm text-red-500">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>
                          <Field name="submit">
                            {({ form }: FieldProps) => (
                              <Button
                                isLoading={mutation.isLoading}
                                loadingText="Creating new board"
                                disabled={
                                  mutation.isLoading ||
                                  Object.keys(form.errors).length !== 0
                                }
                                type="submit"
                                className="w-full"
                                LeftIcon={Plus}
                              >
                                Create new board
                              </Button>
                            )}
                          </Field>
                        </div>
                      </Form>
                    </Formik>
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
