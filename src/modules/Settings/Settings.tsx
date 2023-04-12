import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import getGravatar from "@/utils/getGravatar";
import DashboardNavbar from "../Global/DashboardNavbar";
import PrimaryButton from "../Global/PrimaryButton";
import { Button } from "../ui/button";

function Settings() {
  const { data: session } = useSession();

  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto mt-20 min-h-[90vh] space-y-10 border-l-2 border-r-2">
        <div className="flex w-full flex-col items-center justify-center gap-10 ">
          {/* account intro */}
          <div className="mt-10 flex flex-row items-center justify-center gap-5">
            {session?.user?.email && (
              <Image
                height={200}
                width={200}
                // generate default gravtar image
                src={session?.user?.image || getGravatar(session?.user?.email)}
                alt="avatar"
                className="w-[70px] rounded-full ring-0 ring-black transition-all hover:ring-4 md:w-[90px]"
              />
            )}
            <div>
              <h1 className="text-2xl font-medium">{session?.user.name}</h1>
              <h3 className="text-md text-neutral-800 ">
                {session?.user.email}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-2xl space-y-10 border-t-2 p-5">
            {/* set reset password manager */}
            <div>
              <h2 className="text-xl font-medium">Reset Password</h2>
              <p className="text-neutral-700">Linked Social Logins</p>
              {/* <input type="text" className="" placeholder="Current Password" />
              <input type="text" className="" placeholder="New Password" />
              <input
                type="text"
                className=""
                placeholder="Re-Type New Password"
              /> */}
              <Button
                // isLoading={mutation.isLoading}
                // onClick={() => mutation.mutate({ workspaceId: workspace.id })}
                LeftIcon={FaGoogle}
                loadingText="Deleting Workspace"
                className="mt-4"
              >
                Reset Password
              </Button>
            </div>
            {/* linked social account manager */}
            <div>
              <h2 className="text-xl font-medium">Social Accounts</h2>
              <p className="text-neutral-700">Linked Social Logins</p>
              <Button
                // isLoading={mutation.isLoading}
                // onClick={() => mutation.mutate({ workspaceId: workspace.id })}
                LeftIcon={FaGoogle}
                loadingText="Deleting Workspace"
                className="mt-4"
              >
                Connect Google Account
              </Button>
            </div>
            {/* sessions manager */}
            {/* <div>
              <h2 className="text-xl font-medium">Sessions</h2>
              <p className="text-neutral-700">
                If you need to, you can log out of one or all of your other
                devices.
              </p>
              <Button
                // isLoading={mutation.isLoading}
                // onClick={() => mutation.mutate({ workspaceId: workspace.id })}
                LeftIcon={MdDevices}
                overwriteClassname
                loadingText="Deleting Workspace"
                className="mt-4 rounded-xl border-2  px-4 py-2 text-black hover:bg-neutral-50 active:bg-neutral-100"
              >
                Manage Sessions
              </Button>
            </div> */}
            {/* delete account manager */}
            <div>
              <h2 className="text-xl font-medium">Danger Zone</h2>
              <p className="text-neutral-700">By deleting your account</p>
              <Button
                // isLoading={mutation.isLoading}
                // onClick={() => mutation.mutate({ workspaceId: workspace.id })}
                LeftIcon={MdDevices}
                loadingText="Deleting Workspace"
                className="mt-4"
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
