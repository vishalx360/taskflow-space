import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import { type Workspace } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { type Dispatch, type SetStateAction } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

function LeaveWorkspaceSection({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = api.useContext();
  const { toast } = useToast();

  const mutation = api.workspace.leaveWorkspace.useMutation({
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
      toast({ title: "Left workspace successfully!" });
      setIsOpen(false);
    },
  });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="rounded-xl border-neutral-400 px-2  text-neutral-600">
          Leave Workspace
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <div className="space-y-3">
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
                        Please type workspace name
                        <span className="px-2 font-semibold">
                          {workspace.name}
                        </span>
                        to confirm deletion.
                      </label>
                      <div className="flex flex-row items-center justify-center gap-2">
                        <input
                          type="text"
                          id="confirmation"
                          required
                          placeholder="workspace name"
                          {...field}
                          className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline-none focus:outline"
                        />
                        <Button
                          isLoading={mutation.isLoading}
                          disabled={
                            !form.dirty || Object.keys(form.errors).length !== 0
                          }
                          loadingText="Leave..."
                          variant="destructiveOutline"
                        >
                          Leave
                        </Button>
                      </div>
                      {meta.touched && meta.error && (
                        <p className="ml-2 mt-2 text-sm text-red-500">
                          {meta.error}
                        </p>
                      )}
                    </>
                  )}
                </Field>
              </Form>
            </Formik>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default LeaveWorkspaceSection;
