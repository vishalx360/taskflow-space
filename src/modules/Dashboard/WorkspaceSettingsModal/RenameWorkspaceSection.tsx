import { type Workspace } from "@prisma/client";
import { Field, type FieldProps, Form, Formik } from "formik";
import { type Dispatch, type SetStateAction } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import { RenameWorkspaceSchema } from "@/utils/ValidationSchema";

function RenameWorkspaceSection({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = api.useUtils();
  const { toast } = useToast();

  const mutation = api.workspace.renameWorkspace.useMutation({
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
      toast({ title: "Workspace renamed successfully!" });
      setIsOpen(false);
    },
  });

  return (
    <div className="mt-2">
      <p className="text-md font-medium text-neutral-600 dark:text-white">
        Rename Workspace
      </p>

      <Formik
        initialValues={{ name: workspace.name, workspaceId: workspace.id }}
        validationSchema={toFormikValidationSchema(RenameWorkspaceSchema)}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        <Form>
          <Field name="name">
            {({ field, form, meta }: FieldProps) => (
              <>
                <label
                  htmlFor="name"
                  className="mb-2 mt-3 block text-sm font-medium text-neutral-500 dark:text-white"
                >
                  Workspace Name
                </label>
                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Board name"
                    {...field}
                    className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline-none focus:outline"
                  />
                  <Button
                    isLoading={mutation.isLoading}
                    loadingText="Renaming"
                    disabled={
                      field.value === workspace.name ||
                      Object.keys(form.errors).length !== 0
                    }
                    type="submit"
                  >
                    Rename
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

export default RenameWorkspaceSection;
