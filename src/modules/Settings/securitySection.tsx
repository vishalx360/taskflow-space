import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import Divider from "../Global/Divider";
import { Input } from "../ui/input";

function SecuritySection() {
  return (
    <div className="w-full max-w-2xl space-y-10  px-5 pb-10">
      {/* set reset password manager */}
      <div>
        <h2 className="text-xl font-medium">Password</h2>
        <p className="my-5 text-neutral-700">
          Set a new password for your account.
        </p>
        <div className="space-y-5">
          <Input type="text" className="" placeholder="Current Password" />
          <Input type="text" className="" placeholder="New Password" />
          <Input type="text" className="" placeholder="Re-Type New Password" />
        </div>
        <Button
          // isLoading={mutation.isLoading}
          // onClick={() => mutation.mutate({ workspaceId: workspace.id })}
          // LeftIcon={FaGoogle}
          loadingText="Deleting Workspace"
          className="mt-4"
          variant="subtle"
        >
          Reset Password
        </Button>
      </div>
      <Divider />
      {/* linked social account manager */}
      <div>
        <h2 className="text-xl font-medium">Social Accounts</h2>
        <p className="my-5 text-neutral-700">
          Link your social accounts to your account.
        </p>
        <div className="space-y-3">
          {/* google */}
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-5">
                  <FaGoogle className="h-10 w-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Google</span>
                  <span className="text-xs text-neutral-500">Connected</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="destructiveOutline"
                    className="px-4 text-xs"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-5">
                  <FaGithub className="h-10 w-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Github</span>
                  <span className="text-xs ">Not Connected</span>
                </div>
              </div>
              <div className="flex items-center">
                <Button size="sm" variant="outline" className="px-4 text-xs">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />

      {/* delete account manager */}
      <div>
        <h2 className="text-xl font-medium">Danger Zone</h2>
        <p className="my-5 text-neutral-700">
          Delete your account and all the data associated with it.
        </p>
        <Button variant="destructive" loadingText="Deleting Workspace">
          Delete My Account
        </Button>
      </div>
    </div>
  );
}

export default SecuritySection;
