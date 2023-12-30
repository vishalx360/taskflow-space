import { startAuthentication } from "@simplewebauthn/browser";
import { LucideAlertCircle, LucideArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { FcInfo, FcKey, FcLock, FcUnlock } from "react-icons/fc";
import { MdPassword } from "react-icons/md";

import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/modules/ui/alert";
import { Button } from "@/modules/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover";
import { type SectionMapKeys, type SigninOptions } from "@/pages/signin";
import { api } from "@/utils/api";

export function PasskeySection({
  signinOptions,
  setCurrentSection,
}: {
  signinOptions: SigninOptions | null;
  setCurrentSection: React.Dispatch<React.SetStateAction<SectionMapKeys>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const utils = api.useUtils();

  const locked = useRef(true);

  async function handelPasskeySignin(email: string) {
    try {
      setIsLoading(true);
      const options = await utils.authentication.passkeyGenAuthOpts.fetch({
        email,
      });
      const GetCredentialResponse = await startAuthentication(options);
      const result = await signIn("passkey", {
        email: email,
        passkey: JSON.stringify(GetCredentialResponse),
        redirect: false,
      });
      setIsLoading(false);
      if (result?.ok) {
        locked.current = false;
        toast({
          title: "Login successful!",
          description: "Taking you to your dashboard",
        });
        await router.push("/dashboard").catch((err) => console.log(err));
      } else {
        toast({
          title: result?.error || "Uh oh! Something went wrong.",
          variant: "destructive",
          description: "There was a problem with your request.",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
      // passkey
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Some error occured authenticating.",
        description: error?.message,
        variant: "destructive",
      });
    }
  }
  return (
    <div>
      <div className=" flex flex-col items-center gap-2">
        {locked.current ? (
          <FcLock className="text-[4em]" />
        ) : (
          <FcUnlock className="text-[4em]" />
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-xl">Sign in using passkey</h1>
          <Popover>
            <PopoverTrigger>
              <FcInfo className="text-2xl" />
            </PopoverTrigger>
            <PopoverContent>
              {/* password rules list */}
              <h2>What are passkeys?</h2>
              <p className="my-2 text-sm text-neutral-600">
                Passkeys are a secure replacement for passwords that provide
                faster and easier sign-ins, based on FIDO standards. They are
                always strong and phishing-resistant, making them more secure
                than traditional passwords.
              </p>
              <Link
                className="text-xs text-blue-500 hover:underline"
                href="https://blog.google/technology/safety-security/the-beginning-of-the-end-of-the-password/"
              >
                Learn more <LucideArrowRight className="inline" width={16} />
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {signinOptions?.options.passkey ? (
        <>
          <p className="my-5 text-sm text-neutral-600">
            Kindly insert your passkey. Alternatively, if you have set your
            phone as the passkey, ensure it is within proximity and has its
            Bluetooth feature turned on.
          </p>
          <div className="flex items-center gap-5">
            <Button
              type="button"
              className="text-md w-full"
              size="lg"
              LeftIcon={FcKey}
              isLoading={isLoading}
              loadingText="Looking for passkey..."
              onClick={() => {
                handelPasskeySignin(signinOptions?.user?.email);
              }}
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <Alert className="my-4">
          <LucideAlertCircle className="h-4 w-4" />
          <AlertTitle>No passkey found!</AlertTitle>
          <AlertDescription>
            It appears that your account does not have any passkey configured.
            You can add a passkey in your account security settings.
          </AlertDescription>
        </Alert>
      )}
      {/* {signinOptions?.options.credentials && ( */}
      <Button
        type="button"
        className="text-md mt-4 w-full"
        LeftIcon={MdPassword}
        variant={signinOptions?.options.passkey ? "link" : "default"}
        onClick={() => {
          setCurrentSection("credentials");
        }}
      >
        Sign in with password
      </Button>
      {/* )} */}
    </div>
  );
}

export function PasskeySectionSwitch({
  setCurrentSection,
}: {
  setCurrentSection: React.Dispatch<React.SetStateAction<SectionMapKeys>>;
}) {
  return (
    <Button
      type="button"
      className="text-md w-full"
      variant="outline"
      size="lg"
      LeftIcon={FcKey}
      onClick={() => {
        setCurrentSection("passkey");
      }}
    >
      Sign in with passkey
    </Button>
  );
}
