import { Field, Form, Formik, type FieldProps } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { toFormikValidationSchema } from "zod-formik-adapter";
import PasswordInput from "~/modules/Global/PasswordInput";
import PrimaryButton from "~/modules/Global/PrimaryButton";
import Toast from "~/modules/Global/Toast";
import { SigninSchema } from "~/utils/ValidationSchema";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        Toast({ content: "Login successful!", status: "success" });
        await router.push("/dashboard").catch((err) => console.log(err));
      } else {
        Toast({
          content: result?.error || "Something went wrong.",
          status: "error",
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
      <section className="bg-neutral-100 dark:bg-gray-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <a
            href="#"
            className="mb-8 flex items-center text-5xl font-normal tracking-widest text-gray-900 dark:text-white"
          >
            {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
            VIRA
          </a>
          <div className="w-full rounded-lg bg-white shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
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
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 tracking-wider text-gray-900 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                          placeholder="name@company.com"
                          required
                          {...field}
                        />
                        {meta.touched && meta.error && (
                          <p className="mt-2 ml-2 text-sm text-red-500">
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
                          className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 checked:bg-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-black"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-300"
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
                  <PrimaryButton
                    overwriteClassname
                    type="submit"
                    className="text-md w-full rounded-lg bg-black px-5 py-2.5 text-center font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign in
                  </PrimaryButton>
                </Form>
              </Formik>
              <button
                onClick={() => {
                  void handelGoogleSignin();
                }}
                className="text-md flex w-full items-center justify-center gap-5 rounded-lg border-2 bg-neutral-50 px-5 py-2.5 text-center font-medium text-black hover:bg-neutral-100 focus:outline-none focus:ring-4 focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
              >
                <FaGoogle />
                Sign In With Google
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-black hover:underline dark:text-black"
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
