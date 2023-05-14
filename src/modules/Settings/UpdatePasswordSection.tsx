import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/modules/ui/hover-card";
import { UpdatePasswordSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { LucideInfo, LucideKey } from "lucide-react";
import { useRef, useState } from "react";
import { MdPassword } from "react-icons/md";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function UpdatePasswordSection() {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal(e) {
    e.stopPropagation();
    setIsOpen(true);
  }

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
    <div>
      <h2 className="text-xl font-medium">Password</h2>
      <p className="my-5 text-neutral-700">
        Set a new password for your account. If password is forgotten or not
        set, a new password can be set by using the email.
      </p>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button LeftIcon={MdPassword} variant="outline">
            Change your password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center font-medium">
              <LucideKey className="mr-2 h-6 w-6" />
              Change your password
            </DialogTitle>
          </DialogHeader>
          <div className="my-5 space-y-2  text-neutral-700">
            <p className="text-sm">
              <LucideInfo className="mr-2 inline" width={20} />
              Please note that if you have forgotten your password or have not
              set one, you can create a new password by resetting it from the
              login page. This process will require email verification.
            </p>
          </div>

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
                    <div>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                      >
                        Current Password
                      </label>
                      <Input
                        type="text"
                        placeholder="Current Password"
                        {...field}
                      />
                      <div className="ml-2 mt-2 text-sm text-red-500">
                        <ErrorMessage name={field.name} />
                      </div>
                    </div>
                  )}
                </Field>
                <Field name="newPassword">
                  {({ field, form, meta }: FieldProps) => (
                    <div>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                      >
                        New Password
                      </label>
                      <div className="flex items-center gap-5">
                        <Input
                          type="password"
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
                    <div>
                      <label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                      >
                        Confirm New Password
                      </label>
                      <Input
                        type="text"
                        placeholder="Confirm New Password"
                        {...field}
                      />
                      <div className="ml-2 mt-2 text-sm text-red-500">
                        <ErrorMessage name={field.name} />
                      </div>
                    </div>
                  )}
                </Field>
              </div>
              <Field name="submit">
                {({ field, form, meta }: FieldProps) => (
                  <Button
                    disabled={!form.dirty || !form.isValid}
                    isLoading={mutation.isLoading}
                    className="mt-4"
                    type="submit"
                  >
                    Update Password
                  </Button>
                )}
              </Field>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdatePasswordSection;
