import { LucideAlertCircle } from "lucide-react";
import Link from "next/link";
import { MdPassword } from "react-icons/md";

import { Alert, AlertDescription, AlertTitle } from "@/modules/ui/alert";
import { Button } from "@/modules/ui/button";
import { type SigninOptions } from "@/pages/signin";

export function OauthSection({
  signinOptions,
}: {
  signinOptions: SigninOptions | null;
}) {
  return (
    <div className="space-y-4">
      <Alert>
        <LucideAlertCircle className="h-4 w-4" />
        <AlertTitle>No credentials found!</AlertTitle>
        <AlertDescription>
          It appears that your account does not have a password or passkey
          configured.
        </AlertDescription>
      </Alert>

      <Link
        href={`/resetPassword?email=${signinOptions?.user.email}`}
        className="block text-black hover:underline dark:text-black"
      >
        <Button
          type="button"
          className="text-md  w-full"
          size="lg"
          LeftIcon={MdPassword}
          variant={"subtle"}
        >
          Set a new password
        </Button>
      </Link>
    </div>
  );
}
