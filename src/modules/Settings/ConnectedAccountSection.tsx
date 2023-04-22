import { api } from "@/utils/api";
import { LucideLock } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";

function ConnectedAccountSection() {
  const { data: connectedAccounts, isLoading } =
    api.authentication.fetchConnectedAccounts.useQuery();

  return (
    <div>
      <h2 className="text-xl font-medium">Social Accounts</h2>
      <p className="my-5 text-neutral-700">
        Link your social accounts to your account.
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
  oauth: <LucideLock className="h-10 w-10" />,
};

function AccountRow({ provider, isConnected }: AccountRowProps) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-5">{IconMap[provider] || IconMap["oauth"]}</div>
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize">{provider}</span>
            <span className="text-xs text-neutral-500">
              {isConnected ? "Connected" : "Not Connected"}
            </span>
          </div>
        </div>
        {isConnected ? (
          <Button
            size="sm"
            variant="destructiveOutline"
            className="px-4 text-xs"
          >
            Disconnect
          </Button>
        ) : (
          <Button size="sm" variant="default" className="px-4 text-xs">
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}