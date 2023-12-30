import { LucideLock } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";

import { ConfirmDialog } from "../Global/ConfirmDialog";
import { Button } from "../ui/button";

function ConnectedAccountSection() {
  const { data: connectedAccounts, isLoading } =
    api.authentication.fetchConnectedAccounts.useQuery();

  return (
    <div>
      <h2 className="text-xl font-medium">Social Accounts</h2>
      <p className="my-5 text-neutral-700">
        Connect your social accounts using the same email as your account.
      </p>
      <div className="space-y-3">
        {isLoading ? (
          <>
            <div className="my-3 h-16 w-full animate-pulse rounded-xl bg-gray-300 "></div>
            <div className="my-3 h-16 w-full animate-pulse rounded-xl bg-gray-300 "></div>
          </>
        ) : (
          <div>
            <AccountRow
              provider="google"
              isConnected={Boolean(
                connectedAccounts?.find((x) => x.provider === "google")
              )}
            />
            <AccountRow
              provider="github"
              isConnected={Boolean(
                connectedAccounts?.find((x) => x.provider === "github")
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectedAccountSection;

interface AccountRowProps {
  provider: keyof typeof IconMap;
  isConnected: boolean;
}

const IconMap = {
  google: <FaGoogle className="h-10 w-10" />,
  github: <FaGithub className="h-10 w-10" />,
};

function AccountRow({ provider, isConnected }: AccountRowProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  // TODO: add confirmation modal
  const { mutate: disconnectAccount } =
    api.authentication.disconnectOauthProvider.useMutation({
      onError(error) {
        toast({
          variant: "destructive",
          title: error.message || "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
      onSuccess: (provider) => {
        toast({ title: `${provider} account disconnected` });
        utils.authentication.fetchConnectedAccounts
          .invalidate()
          .catch((err) => console.log(err));
      },
    });

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-5">
            {IconMap[provider] || <LucideLock className="h-10 w-10" />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize">{provider}</span>
            <span className="text-xs text-neutral-500">
              {isConnected ? "Connected" : "Not Connected"}
            </span>
          </div>
        </div>
        {isConnected ? (
          <ConfirmDialog
            description="Are you certain you want to disconnect this social account? Keep in mind that if it's your last login method, disconnecting it will lock you out of your account. In that case, you can use the forgot password feature to reset your password."
            title={`Disconnect : ${provider} login`}
            action={() => disconnectAccount({ provider })}
          >
            <Button
              size="sm"
              variant="destructiveOutline"
              className="px-4 text-xs"
            >
              Disconnect
            </Button>
          </ConfirmDialog>
        ) : (
          <Button
            onClick={async () => await signIn(provider)}
            size="sm"
            variant="default"
            className="px-4 text-xs"
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
