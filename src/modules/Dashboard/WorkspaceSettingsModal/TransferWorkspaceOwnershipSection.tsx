import { type Workspace } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { type Dispatch, type SetStateAction } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import { TransferWorkspaceOwnershipSchema } from "@/utils/ValidationSchema";

function RenameWorkspaceSection({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const utils = api.useContext();
  const mutation = api.workspace.transferWorkspaceOwnership.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      await utils.workspace.getWorkspaceMembers
        .invalidate({ workspaceId: workspace.id })
        .catch((err) => console.log(err));
      toast({
        title: "Workspace transfered successfully!",
        // description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setIsOpen(false);
    },
  });

  return (
    <div className="mt-2 space-y-3">
      {/* <p className="text-md font-medium text-neutral-600 dark:text-white">
        Transfer Workspace Ownership
      </p> */}
      <p className="">After transfer you will become admin of the workspace.</p>
      <Formik
        initialValues={{ email: "", workspaceId: workspace.id }}
        validationSchema={toFormikValidationSchema(
          TransferWorkspaceOwnershipSchema
        )}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        <Form>
          <Field name="email">
            {({ field, form, meta }: FieldProps) => (
              <>
                <label
                  htmlFor="email"
                  className="mb-2 mt-3 block text-sm font-medium text-neutral-500 dark:text-white"
                >
                  New owner email
                </label>
                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="name@company.com"
                    {...field}
                    className="text-md  block w-full rounded-xl   p-2.5 text-neutral-800 transition-all focus:outline-none focus:outline"
                  />
                  <Button
                    isLoading={mutation.isLoading}
                    disabled={
                      !form.dirty || Object.keys(form.errors).length !== 0
                    }
                    loadingText="Transfer..."
                    variant="destructiveOutline"
                  >
                    Transfer
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
