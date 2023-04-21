import { useToast } from "@/hooks/use-toast";
import LogoImage from "@/modules/Global/LogoImage";
import { Button } from "@/modules/ui/button";
import { authOptions } from "@/server/auth";
import { resetPasswordSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { Field, Form, Formik, type FieldProps } from "formik";
import { LucideArrowLeft } from "lucide-react";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const mutation = api.authentication.sendResetPasswordLink.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      toast({
        title: "Reset Link Generated Successfully!",
        description: "Please check your email for the reset link.",
      });
      await router.push("/signin");
    },
  });

  return (
    <>
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="my-10 block dark:hidden lg:my-20">
            <LogoImage dark width={300} />
          </div>
          <div className="my-10 hidden dark:block lg:my-20">
            <LogoImage width={300} />
          </div>
          <div className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <Link
                href="/signin"
                className="flex items-center gap-3 text-sm font-medium text-black hover:underline  "
              >
                <LucideArrowLeft width={20} /> <span>Sign in</span>
              </Link>
              <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
                Reset Password
              </h1>
              <p className="text-neutral-700">
                Enter your email address and we will send you a link to reset
              </p>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={toFormikValidationSchema(resetPasswordSchema)}
                onSubmit={(values) => {
                  mutation.mutate(values);
                }}
              >
                <Form className="space-y-4 md:space-y-6">
                  <Field name="email">
                    {({ field, meta }: FieldProps) => (
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-neutral-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5  text-neutral-900 focus:border-black focus:ring-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                          placeholder="name@company.com"
                          required
                          {...field}
                        />
                        {meta.touched && meta.error && (
                          <p className="ml-2 mt-2 text-sm text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    className="text-md w-full"
                    size="lg"
                    isLoading={mutation.isLoading}
                    loadingText="Submit..."
                  >
                    Submit
                  </Button>
                </Form>
              </Formik>
              <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-black hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// if signin redirect to dashboard
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  } else {
    return { props: {} };
  }
}
