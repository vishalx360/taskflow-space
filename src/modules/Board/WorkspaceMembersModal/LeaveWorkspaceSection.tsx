import { Disclosure, Transition } from "@headlessui/react";
import { type Workspace } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { type Dispatch, type SetStateAction } from "react";
import { FaCaretRight } from "react-icons/fa";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import PrimaryButton from "~/modules/Global/PrimaryButton";
import { api } from "~/utils/api";
import Toast from "../../Global/Toast";

function LeaveWorkspaceSection({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = api.useContext();
  const mutation = api.workspace.leaveWorkspace.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      await utils.workspace.getAllWorkspace
        .invalidate()
        .catch((err) => console.log(err));
      Toast({ content: "Left workspace successfully!", status: "success" });
      setIsOpen(false);
    },
  });

  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <>
          <div className="my-5 flex items-center gap-5">
            <Disclosure.Button className="w-full ">
              <div className="flex w-full items-center justify-between gap-10 rounded-xl rounded-t-xl border border-red-200 px-5  text-red-500  hover:bg-red-50 ">
                <div className="flex items-center gap-5">
                  <p className="text-md py-3 ">Danger Zone</p>
                  {/* {isRefetching && (
                  <BiLoaderAlt className="h-5 w-5 animate-spin text-neutral-500" />
                )} */}
                </div>
                <FaCaretRight
                  className={`${
                    open ? "rotate-90 transform" : ""
                  } h-5 w-5 text-inherit`}
                />
              </div>
            </Disclosure.Button>
          </div>

          <Transition
            enter="transition duration-150 ease-in"
            enterFrom="transform -translate-y-3 opacity-0"
            enterTo="transform translate-y-0  opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-3 opacity-0"
          >
            <Disclosure.Panel className="space-y-5 rounded-xl border border-red-200 p-4">
              <div className="space-y-3">
                <p className="text-md font-medium text-neutral-600 dark:text-white">
                  Leave Workspace
                </p>
                <p className="">
                  You will lose access to all boards in this workspace.
                </p>
                <Formik
                  initialValues={{
                    confirmation: "",
                    workspaceId: workspace.id,
                  }}
                  validationSchema={toFormikValidationSchema(
                    z.object({
                      confirmation: z.literal(`leave ${workspace.name}`),
                      workspaceId: z.string(),
                    })
                  )}
                  onSubmit={() => {
                    mutation.mutate({ workspaceId: workspace.id });
                  }}
                >
                  <Form>
                    <Field name="confirmation">
                      {({ field, form, meta }: FieldProps) => (
                        <>
                          <label
                            htmlFor="confirmation"
                            className="mt-3 mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                          >
                            Please type
                            <span className="px-2 font-semibold">
                              leave {workspace.name}
                            </span>
                            to confirm deletion.
                          </label>
                          <div className="flex flex-row items-center justify-center gap-2">
                            <input
                              type="text"
                              id="confirmation"
                              required
                              placeholder="leave [WORKSPACE NAME]"
                              {...field}
                              className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline-none focus:outline"
                            />
                            <PrimaryButton
                              isLoading={mutation.isLoading}
                              disabled={
                                !form.dirty ||
                                Object.keys(form.errors).length !== 0
                              }
                              overwriteClassname
                              loadingText="Leave..."
                              className="rounded-xl border-2 border-red-600 bg-transparent px-4 py-2 text-red-700 hover:bg-red-50 active:bg-red-100
                    
                    disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400
                    "
                            >
                              Leave
                            </PrimaryButton>
                          </div>
                          {meta.touched && meta.error && (
                            <p className="mt-2 ml-2 text-sm text-red-500">
                              {meta.error}
                            </p>
                          )}
                        </>
                      )}
                    </Field>
                  </Form>
                </Formik>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

export default LeaveWorkspaceSection;
