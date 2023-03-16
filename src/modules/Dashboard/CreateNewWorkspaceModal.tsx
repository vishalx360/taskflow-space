import { Dialog, Transition } from "@headlessui/react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { Fragment, useState } from "react";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { api } from "~/utils/api";
import { CreateNewWorkspaceValidationSchema } from "~/utils/ValidationSchema";
import PrimaryButton from "../Global/PrimaryButton";
import Toast from "../Global/Toast";

export default function CreateNewWorkspaceModal() {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useContext();

  function closeModal() { setIsOpen(false) }
  function openModal() { setIsOpen(true) }

  const mutation = api.dashboard.createNewWorkspace.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" })
    },
    onSuccess: async () => {
      await utils.dashboard.getAllWorkspace.invalidate().catch(err => console.log(err));
      Toast({ content: "New workspace created successfully!", status: "success" })
      setIsOpen(false);
    },
  });

  return (
    <div className="px-5">
      <button onClick={openModal} className="w-full">
        <div className='hover:bg-neutral-100 w-full flex items-center justify-center gap-10 py-5 px-5 rounded-xl border-2 border-gray-200 font-semibold my-5 text-xl'>
          <FaPlusCircle className="text-inherit" />
          <span>
            Create new workspace
          </span>
        </div>
      </button>


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
            <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-25" />
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
                    className="flex items-center gap-5 justify-between text-lg font-medium leading-6 text-gray-900 "
                  >
                    Create new workspace
                    <button
                      onClick={closeModal}
                      type="button"
                      className="transition-all rounded-lg p-2 text-xs text-inherit  hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
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
                      validationSchema={toFormikValidationSchema(CreateNewWorkspaceValidationSchema)}
                      onSubmit={
                        (values) => {
                          console.log(values);
                          mutation.mutate(values);
                        }
                      }
                    >
                      <Form>
                        <div className="flex flex-col gap-2">
                          <Field name="name">
                            {({ field, meta }: FieldProps) => (
                              <div className="my-5">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-neutral-500 dark:text-white">Workspace Name</label>
                                <input
                                  type="text"
                                  id="name"
                                  required
                                  placeholder="Workspace name"
                                  {...field}
                                  className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline focus:outline-none"
                                />
                                {meta.touched && meta.error && (
                                  <p className="mt-2 ml-2 text-sm text-red-500">
                                    {meta.error}
                                  </p>
                                )}
                              </div>
                            )}
                          </Field>
                          <Field name="submit">
                            {({ form }: FieldProps) => (
                              <PrimaryButton
                                isLoading={mutation.isLoading}
                                loadingText="Creating new board"
                                disabled={Object.keys(form.errors).length !== 0}
                                type="submit"
                                className="w-full"
                                LeftIcon={FaPlus}
                              >
                                Create new workspace
                              </PrimaryButton>
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
