import { useToast } from "@/hooks/use-toast";
import LogoImage from "@/modules/Global/LogoImage";
import PasswordInput from "@/modules/Global/PasswordInput";
import { Button } from "@/modules/ui/button";
import { authOptions } from "@/server/auth";
import { SigninSchema } from "@/utils/ValidationSchema";
import { Field, Form, Formik, type FieldProps } from "formik";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { toFormikValidationSchema } from "zod-formik-adapter";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handelCredentialSignin = useCallback(
    async (credentails: { email: string; password: string }) => {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: credentails.email,
        password: credentails.password,
        redirect: false,
      });
      setIsLoading(false);
      if (result?.ok) {
        toast({ description: "Login successful!" });
        await router.push("/dashboard").catch((err) => console.log(err));
      } else {
        toast({
          variant: "destructive",
          title: result?.error || "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    },
    [router]
  );

  async function handelGoogleSignin() {
    await signIn("google");
  }
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
              <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
                Sign in to your account
              </h1>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={toFormikValidationSchema(SigninSchema)}
                onSubmit={handelCredentialSignin}
              >
                <Form className="space-y-4 md:space-y-6">
                  <Field name="email">
                    {({ field, meta }: FieldProps) => (
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-neutral-900 dark:text-white"
                        >
                          Your email
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
                  <PasswordInput />
                  {/* TODO : Reset Password */}
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="focus:ring-3 h-4 w-4 rounded border border-neutral-300 bg-neutral-50 checked:bg-black focus:ring-black dark:border-neutral-600 dark:bg-neutral-700 dark:ring-offset-neutral-800 dark:focus:ring-black"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="remember"
                          className="text-neutral-500 dark:text-neutral-300"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:underline dark:text-black"
                    >
                      Forgot password?
                    </a>
                  </div> */}
                  <Button
                    type="submit"
                    className="text-md w-full"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign in
                  </Button>
                </Form>
              </Formik>
              <Button
                onClick={() => {
                  void handelGoogleSignin();
                }}
                variant="outline"
                className="text-md flex w-full items-center justify-center gap-4"
                size="lg"
                LeftIcon={FaGoogle}
              >
                Sign In With Google
              </Button>
              <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
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
