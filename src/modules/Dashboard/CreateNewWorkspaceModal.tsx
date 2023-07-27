import { Field, type FieldProps, Form, Formik } from "formik";
import { LayoutDashboard, Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { api } from "@/utils/api";
import { CreateNewWorkspaceSchema } from "@/utils/ValidationSchema";

import { Button } from "../ui/button";

export default function CreateNewWorkspaceModal({
  children,
}: {
  children?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const utils = api.useContext();

  function closeModal() {
    setIsOpen(false);
  }
  function openModal(e) {
    e.stopPropagation();
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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            <button className="w-full" onClick={openModal}>
              {children}
            </button>
          ) : (
            <div className="my-8 mb-5 flex items-center gap-5 rounded-xl border-b border-t bg-neutral-50 px-2 py-2 transition-colors  hover:bg-neutral-200 focus:bg-neutral-200">
              <button
                onClick={openModal}
                className="sticky top-20 z-10 w-full  transition-all "
              >
                <div className="flex w-full items-center justify-between gap-10 rounded-l-none rounded-t-xl border-gray-600 px-5 py-2 text-xl font-normal   md:rounded-l-md">
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 p-2 uppercase  text-white md:h-10 md:w-10 md:text-xl">
                      <Plus />
                    </div>
                    <span className=" line-clamp-1 text-start">
                      Create new workspace
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4 font-medium">
              <LayoutDashboard />
              Create new workspace
            </DialogTitle>
          </DialogHeader>
          <div className="">
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
                      <div className="my-2">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
