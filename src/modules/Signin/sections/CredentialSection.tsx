import { useToast } from "@/hooks/use-toast";
import PasswordInput from "@/modules/Global/PasswordInput";
import { Button } from "@/modules/ui/button";
import { type SectionMapKeys, type SigninOptions } from "@/pages/signin";
import { SigninSchema } from "@/utils/ValidationSchema";
import { Form, Formik } from "formik";
import { LucideAlertCircle, LucideArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { FcKey } from "react-icons/fc";
import { MdPassword } from "react-icons/md";
import { toFormikValidationSchema } from "zod-formik-adapter";

export function CredentialSection({
  signinOptions,
  setCurrentSection,
}: {
  signinOptions: SigninOptions | null;
  setCurrentSection: React.Dispatch<React.SetStateAction<SectionMapKeys>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
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
        toast({
          title: "Login successful!",
          description: "Taking you to your dashboard",
        });
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
  return (
    <div>
      {signinOptions?.user.email && signinOptions?.options?.credentials ? (
        <Formik
          initialValues={{
            email: signinOptions?.user.email,
            password: "",
          }}
          validationSchema={toFormikValidationSchema(SigninSchema)}
          onSubmit={handelCredentialSignin}
        >
          <Form className="space-y-4 md:space-y-6">
            <PasswordInput />
            <div className="flex items-center justify-between">
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
              <Link
                href="/resetPassword"
                className="text-sm font-medium text-black hover:underline dark:text-black"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="text-md w-full"
              size="lg"
              LeftIcon={LucideArrowRight}
              isLoading={isLoading}
              loadingText="Checking credentials..."
            >
              Sign in
            </Button>
          </Form>
        </Formik>
      ) : (
        <div className="">
          <p>
            No Password configured for this account. Please sign in with other
            options.
          </p>
          <p>
            You can set a password for your account by visiting{" "}
            <Link
              href="/resetPassword"
              className="text-sm font-medium text-black hover:underline dark:text-black"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      )}
      <Button
        type="button"
        className="text-md mt-4 w-full"
        size="lg"
        LeftIcon={FcKey}
        variant={"outline"}
        onClick={() => {
          setCurrentSection("passkey");
        }}
      >
        Sign in with Passkey
      </Button>
    </div>
  );
}
