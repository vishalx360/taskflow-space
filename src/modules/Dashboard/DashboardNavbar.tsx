import Link from "next/link";

import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";
import CommandCenter from "./CommandCenter";

function DashboardNavbar() {
  return (
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
  );
}

export default DashboardNavbar;
