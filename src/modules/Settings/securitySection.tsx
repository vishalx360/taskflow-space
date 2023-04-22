import Divider from "../Global/Divider";
import { Button } from "../ui/button";
import ConnectedAccountSection from "./ConnectedAccountSection";
import UpdatePasswordSection from "./UpdatePasswordSection";

function SecuritySection() {
  return (
    <div className="w-full max-w-2xl space-y-10  px-5 pb-10">
      <UpdatePasswordSection />
      <Divider />
      <ConnectedAccountSection />
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
