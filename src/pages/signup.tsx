import { Field, Form, Formik, type FieldProps } from "formik";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaGoogle } from "react-icons/fa";
import { toFormikValidationSchema } from "zod-formik-adapter";
import LogoImage from "~/modules/Global/LogoImage";
import PasswordInput from "~/modules/Global/PasswordInput";
import PrimaryButton from "~/modules/Global/PrimaryButton";
import Toast from "~/modules/Global/Toast";
import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";
import { SignUpSchema } from "~/utils/ValidationSchema";

export default function SignInPage() {
  const router = useRouter();
  const utils = api.useContext();

  const mutation = api.authentication.signup.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      await utils.board.getAllBoards
        .invalidate()
        .catch((err) => console.log(err));
      Toast({ content: "Account created successfully!", status: "success" });
      await router.push("/signin").catch((err) => console.log(err));
    },
  });

  async function handelGoogleSignUp() {
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
                Create new account
              </h1>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                }}
                validationSchema={toFormikValidationSchema(SignUpSchema)}
                onSubmit={(values) => {
                  mutation.mutate(values);
                }}
              >
                <Form className="space-y-4 md:space-y-6" action="#">
                  <Field name="name">
                    {({ field, meta }: FieldProps) => (
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-neutral-900 dark:text-white"
                        >
                          Your name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5  text-neutral-900 focus:border-black focus:ring-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                          placeholder="Full name"
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
                          <p className="mt-2 ml-2 text-sm text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                  <PasswordInput />
                  <PrimaryButton
                    overwriteClassname
                    type="submit"
                    className="text-md w-full rounded-lg bg-black px-5 py-2.5 text-center font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
                    isLoading={mutation.isLoading}
                    loadingText="Signing up..."
                  >
                    Sign up
                  </PrimaryButton>
                  <button
                    onClick={() => {
                      void handelGoogleSignUp();
                    }}
                    className="text-md flex w-full items-center justify-center gap-5 rounded-lg border-2 bg-neutral-50 px-5 py-2.5 text-center font-medium text-black hover:bg-neutral-100 focus:outline-none focus:ring-4 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-black dark:focus:ring-black"
                  >
                    <FaGoogle />
                    Sign Up With Google
                  </button>
                  <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
                    Already have an account ?{" "}
                    <Link
                      href="/signin"
                      className="font-medium text-black hover:underline dark:text-blue-500"
                    >
                      Sign In
                    </Link>
                  </p>
                </Form>
              </Formik>
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
