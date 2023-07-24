import { type ResetPasswordToken } from "@prisma/client";
import { ErrorMessage, Field, type FieldProps,Form, Formik } from "formik";
import { LucideArrowLeft, LucideInfo } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import LogoImage from "@/modules/Global/LogoImage";
import { Button } from "@/modules/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/modules/ui/hover-card";
import { Input } from "@/modules/ui/input";
import { api } from "@/utils/api";
import { newPasswordSchema } from "@/utils/ValidationSchema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const query = router.query;

  const {
    data: token,
    error: tokenError,
    isLoading: tokenIsLoading,
  } = api.authentication.checkResetPasswordLink.useQuery(
    { token: query.token as string },
    { enabled: Boolean(query.token) && router.isReady }
  );

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
            {tokenIsLoading ? (
              <LoadingToken />
            ) : tokenError ? (
              <InvalidToken tokenError={tokenError} />
            ) : token ? (
              <SetNewPassword token={token} />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

function SetNewPassword({ token }: { token: ResetPasswordToken }) {
  const router = useRouter();
  const { toast } = useToast();

  const mutation = api.authentication.newPassword.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: async () => {
      toast({
        title: "Password Reset Successfull!",
        description: "You can now sign in with your new password.",
      });
      await router.push("/signin");
    },
  });
  return (
    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
      <Link
        href="/signin"
        className="flex items-center gap-3 text-sm font-medium text-black hover:underline  "
      >
        <LucideArrowLeft width={20} /> <span>Sign in</span>
      </Link>
      <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
        Set New Password
      </h1>
      <p className="text-neutral-700">Enter new password for your account.</p>
      <Formik
        initialValues={{
          token: token.id,
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={toFormikValidationSchema(newPasswordSchema)}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        <Form className="space-y-4 md:space-y-6">
          <Field name="newPassword">
            {({ field, form, meta }: FieldProps) => (
              <div>
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
                        For better security password must contain:
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
  );
}

function LoadingToken() {
  return (
    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
      <Link
        href="/signin"
        className="flex items-center gap-3 text-sm font-medium text-black hover:underline  "
      >
        <LucideArrowLeft width={20} /> <span>Sign in</span>
      </Link>
      <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
        Checking Link...
      </h1>
      <p className="text-neutral-700">
        Please wait while we check your reset password link.
      </p>
      <div className="h-5 w-52  animate-pulse rounded-xl bg-neutral-400 " />

      <div className="h-10 w-full  animate-pulse rounded-xl bg-neutral-400 " />
      <div className="h-10 w-full  animate-pulse rounded-xl bg-neutral-400 " />
      <div className="h-10 w-full  animate-pulse rounded-xl bg-neutral-400 " />
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
  );
}

function InvalidToken({ tokenError }: { tokenError: any }) {
  return (
    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-2xl font-medium text-neutral-900 dark:text-neutral-100">
          Uh oh! Something went wrong.
        </h2>
        <p className="mt-2 text-center text-neutral-700 dark:text-neutral-300">
          There was a problem with your request.
        </p>
      </div>
      {tokenError.message && (
        <div className="flex flex-col items-center rounded-xl bg-red-100 p-3">
          <p className=" text-center text-neutral-700 dark:text-neutral-300">
            {tokenError.message}
          </p>
        </div>
      )}
      <p className="mt-2 text-center text-neutral-700 dark:text-neutral-300">
        You can request a new reset link{" "}
        <Link className="underline" href="/resetPassword">
          here
        </Link>
        .
      </p>
    </div>
  );
}
