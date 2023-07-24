import Link from "next/link";
import { useSession } from "next-auth/react";

import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";
import CommandCenter from "./CommandCenter";
import Workspaces from "./Workspaces";

function Overview() {
  const { data: session } = useSession();
  return (
    <>
      <div className="m-5 mt-10 hidden  text-black md:block  lg:flex-row">
        {/* header */}
        <h1 className="text-2xl font-bold md:text-4xl">
          Hello, <span className="text-primary-500">{session?.user.name}</span>
          <span className="ml-2">👋</span>
        </h1>
        <h1 className="mt-5 text-sm text-neutral-500 md:text-lg">
          Welcome to your dashboard, here you can manage your tasks, workspaces
          and more.
        </h1>
      </div>
      {/* search bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-neutral-50 px-4 py-4 md:border-b-0 md:px-2 ">
        <div className="md:hidden">
          <Link href="/" className="">
            <LogoImage short dark />
          </Link>
        </div>
        <CommandCenter />
        <div className="md:hidden">
          <UserMenu />
        </div>
      </div>
      <Workspaces />
    </>
  );
}

export default Overview;
