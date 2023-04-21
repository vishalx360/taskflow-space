import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/modules/ui/hover-card";
import { LucideInfo } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Divider from "../Global/Divider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useToast } from "@/hooks/use-toast";
import { UpdatePasswordSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { useRef } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

function SecuritySection() {
  const formRef = useRef(null);
  const { toast } = useToast();
  const mutation = api.authentication.updatePassword.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      formRef.current && formRef.current.reset();
      toast({ title: "Succesfully updated password" });
    },
  });

  return (
    <div className="w-full max-w-2xl space-y-10  px-5 pb-10">
      {/* set reset password manager */}
      <div>
        <h2 className="text-xl font-medium">Password</h2>
        <p className="my-5 text-neutral-700">
          Set a new password for your account.
        </p>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={toFormikValidationSchema(UpdatePasswordSchema)}
          onSubmit={(values, { resetForm }) => {
            mutation.mutate(values);
          }}
        >
          <Form ref={formRef}>
            <div className="space-y-5">
              <Field name="currentPassword">
                {({ field, form, meta }: FieldProps) => (
                  <>
                    <Input
                      type="text"
                      placeholder="Current Password"
                      {...field}
                    />
                    <div className="ml-2 mt-2 text-sm text-red-500">
                      <ErrorMessage name={field.name} />
                    </div>
                  </>
                )}
              </Field>
              <Field name="newPassword">
                {({ field, form, meta }: FieldProps) => (
                  <div>
                    <div className="flex items-center gap-5">
                      <Input
                        type="text"
                        placeholder="New Password"
                        {...field}
                      />
                      <HoverCard>
                        <HoverCardTrigger>
                          <LucideInfo width={20} />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          {/* password rules list */}
                          <p className="mb-2 text-sm text-neutral-600">
                            Password must contain:
                          </p>
                          <ul className="list-inside list-disc">
                            <li className="text-sm text-neutral-600">
                              Between 8 to 16 characters
                            </li>
                            <li className="text-sm text-neutral-600">
                              At least 1 number
                            </li>
                            <li className="text-sm text-neutral-600">
                              At least 1 uppercase letter
                            </li>
                            <li className="text-sm text-neutral-600">
                              At least 1 lowercase letter
                            </li>
                            <li className="text-sm text-neutral-600">
                              At least 1 special character
                            </li>
                          </ul>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="ml-2 mt-2 text-sm text-red-500">
                      <ErrorMessage name={field.name} />
                    </div>
                  </div>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field, form, meta }: FieldProps) => (
                  <>
                    <Input
                      type="text"
                      placeholder="Confirm New Password"
                      {...field}
                    />
                    <div className="ml-2 mt-2 text-sm text-red-500">
                      <ErrorMessage name={field.name} />
                    </div>
                  </>
                )}
              </Field>
            </div>

            <Button
              // isLoading={mutation.isLoading}
              // onClick={() => mutation.mutate({ workspaceId: workspace.id })}
              // LeftIcon={FaGoogle}
              loadingText="Deleting Workspace"
              className="mt-4"
              variant="subtle"
              type="submit"
            >
              Reset Password
            </Button>
          </Form>
        </Formik>
      </div>
      <Divider />
      {/* linked social account manager */}
      <div>
        <h2 className="text-xl font-medium">Social Accounts</h2>
        <p className="my-5 text-neutral-700">
          Link your social accounts to your account.
        </p>
        <div className="space-y-3">
          {/* google */}
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-5">
                  <FaGoogle className="h-10 w-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Google</span>
                  <span className="text-xs text-neutral-500">Connected</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="destructiveOutline"
                    className="px-4 text-xs"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-5">
                  <FaGithub className="h-10 w-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Github</span>
                  <span className="text-xs ">Not Connected</span>
                </div>
              </div>
              <div className="flex items-center">
                <Button size="sm" variant="outline" className="px-4 text-xs">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />

      {/* delete account manager */}
      <div>
        <h2 className="text-xl font-medium">Danger Zone</h2>
        <p className="my-5 text-neutral-700">
          Delete your account and all the data associated with it.
        </p>
        <Button variant="destructive" loadingText="Deleting Workspace">
          Delete My Account
        </Button>
      </div>
    </div>
  );
}

export default SecuritySection;
