import { useToast } from "@/hooks/use-toast";
import { CreateNewWorkspaceSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { Plus } from "lucide-react";
import { Fragment, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../ui/button";

export default function CreateNewWorkspaceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const utils = api.useContext();

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const mutation = api.workspace.createNewWorkspace.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      await utils.workspace.getAllWorkspace
        .invalidate()
        .catch((err) => console.log(err));
      toast({
        title: "New workspace created successfully!",
        // description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setIsOpen(false);
    },
  });

  return (
    <div className="">
      {/* <button onClick={openModal} className="w-full">
        <div className="my-5 flex w-full items-center justify-center gap-5 rounded-xl border-2 border-gray-200 px-5 py-5 font-medium hover:bg-neutral-100 md:gap-10 md:text-xl">
          <FaPlusCircle className="text-inherit" />
          <span>New workspace</span>
        </div>
      </button> */}

      <div className="my-8 mb-5 flex items-center gap-5 border-b-2 border-t-2 py-5">
        <button
          onClick={openModal}
          className="sticky top-20 z-10 w-full  transition-all "
        >
          <div className="flex w-full items-center justify-between gap-10 rounded-l-none rounded-t-xl border-gray-600 px-5 py-2 text-xl font-normal   md:rounded-l-md">
            <div className="flex items-center gap-3 md:gap-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 p-2 uppercase  text-white md:h-10 md:w-10 md:text-xl">
                <Plus />
              </div>
              <span className=" text-start line-clamp-1">
                Create new workspace
              </span>
            </div>
          </div>
        </button>
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
                    Create new workspace
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
                      initialValues={{ name: "" }}
                      validationSchema={toFormikValidationSchema(
                        CreateNewWorkspaceSchema
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
                                  Workspace Name
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  required
                                  placeholder="Workspace name"
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
                                disabled={Object.keys(form.errors).length !== 0}
                                type="submit"
                                className="w-full"
                                LeftIcon={Plus}
                              >
                                Create new workspace
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
    </div>
  );
}
