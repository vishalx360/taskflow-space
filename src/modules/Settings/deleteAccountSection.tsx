import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { api } from "@/utils/api";
import { Field, Form, Formik, type FieldProps } from "formik";
import { LucideInfo, LucideUserMinus } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Timeago from "react-timeago";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function DeleteAccountSection() {
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();
  const { data: deleteConsequences, isLoading } =
    api.authentication.fetchDeleteConsequences.useQuery(undefined, {
      enabled: isOpen,
      staleTime: 5000, // 1 second
    });
  const mutation = api.authentication.deleteAccount.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      toast({ title: `Account Deleted Successfully` });
      await signOut();
    },
  });
  console.log({ deleteConsequences });
  return (
    <div>
      <h2 className="text-xl font-medium">Danger Zone</h2>
      <p className="my-5 text-neutral-700">
        Delete your account and all the data associated with it.
      </p>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete My Account</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center font-medium">
              <LucideUserMinus className="mr-4 h-6 w-6" />
              Delete My Account
            </DialogTitle>
          </DialogHeader>
          <div className=" text-neutral-700">
            <p className="">
              <LucideInfo className="mr-2 inline" width={20} />
              Following workspaces will be deleted if you delete your account.
            </p>

            <div className="mt-4  max-h-[300px] space-y-3 overflow-scroll">
              {deleteConsequences?.map((workspace) => {
                return (
                  <div className="px-4" key={workspace.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-sm uppercase  text-white">
                        {workspace.name[0]}
                      </div>
                      <div>{workspace.name}</div>
                    </div>
                    <ul className="ml-5 mt-4 space-y-2">
                      <li className="list-disc">
                        Created{" "}
                        <Timeago live={false} date={workspace.createdAt} />
                      </li>
                      <li className="list-disc">
                        <span className="list-disc">
                          Contain {workspace._count.boards} Boards
                        </span>
                        <span className="list-disc">
                          {" "}
                          and has {workspace._count.members} Members
                        </span>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <Formik
            initialValues={{
              confirmation: "",
            }}
            validationSchema={toFormikValidationSchema(
              z.object({
                confirmation: z.literal("DELETE ACCOUNT"),
              })
            )}
            onSubmit={() => {
              mutation.mutate();
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
                      <span className="px-2 font-semibold">DELETE ACCOUNT</span>
                      to confirm deletion.
                    </label>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Input
                        type="text"
                        id="confirmation"
                        required
                        placeholder="DELETE ACCOUNT"
                        {...field}
                        // className="text-md  block w-full rounded-xl   text-neutral-800 transition-all focus:outline-none focus:outline"
                      />
                      <Button
                        isLoading={mutation.isLoading}
                        disabled={
                          !form.dirty || Object.keys(form.errors).length !== 0
                        }
                        loadingText="Leave..."
                        variant="destructiveOutline"
                        className="w-fit whitespace-nowrap"
                      >
                        Yes, delete my account
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleteAccountSection;
