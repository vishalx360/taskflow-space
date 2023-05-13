import Divider from "../Global/Divider";
import ConnectedAccountSection from "./ConnectedAccountSection";
import PasskeySection from "./PasskeySection";
import UpdatePasswordSection from "./UpdatePasswordSection";
import DeleteAccountSection from "./deleteAccountSection";

function SecuritySection() {
  return (
    <div className="w-full max-w-2xl space-y-10  px-5 pb-10">
      <UpdatePasswordSection />
      <Divider />
      <PasskeySection />
      <Divider />
      <ConnectedAccountSection />
      <Divider />
      <DeleteAccountSection />
    </div>
  );
}

export default SecuritySection;
