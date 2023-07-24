import { type Workspace } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { type Dispatch, type SetStateAction } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";

function DeleteWorkspaceSection({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  const utils = api.useContext();
  const mutation = api.workspace.deleteWorkspace.useMutation({
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
      toast({ title: "Workspace deleted successfully!" });
      setIsOpen(false);
    },
  });

  return (
    <div className="space-y-3">
      {/* <p className="text-md font-medium text-neutral-600 dark:text-white">
        Delete Workspace
      </p> */}
      <p className="">
        Deleting a workspace deletes all of the board it contains.
      </p>
      <Formik
        initialValues={{ confirmation: "", workspaceId: workspace.id }}
        validationSchema={toFormikValidationSchema(
          z.object({
            confirmation: z.literal(`${workspace.name}`),
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
                  className="mb-2 mt-3 block text-sm font-medium text-neutral-500 dark:text-white"
                >
                  Please type the workspace name
                  <span className="px-2 font-medium">{workspace.name}</span>
                  to confirm deletion.
                </label>
                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    id="confirmation"
                    required
                    placeholder="workspace name"
                    {...field}
                    className="text-md  block w-full rounded-xl   p-2.5 text-neutral-800 transition-all focus:outline-none focus:outline"
                  />
                  <Button
                    isLoading={mutation.isLoading}
                    disabled={
                      !form.dirty || Object.keys(form.errors).length !== 0
                    }
                    loadingText="Delete..."
                    variant="destructiveOutline"
                  >
                    Delete
                  </Button>
                </div>
                {meta.touched && meta.error && (
                  <p className="ml-2 mt-2 text-sm text-red-500">{meta.error}</p>
                )}
              </>
            )}
          </Field>
        </Form>
      </Formik>
    </div>
  );
}

export default DeleteWorkspaceSection;
