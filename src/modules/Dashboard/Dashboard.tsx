import {
  LucideAlignLeft,
  LucideHome,
  LucideLayout,
  LucideSearch,
  LucideSettings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";
import Workspaces from "./Workspaces";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import CommandCenter from "./CommandCenter";

const NavlinkVariants = cva(
  "flex items-center space-x-5 rounded-l-full  px-8 py-5 text-xl text-neutral-700 transition-colors hover:bg-neutral-500/10",
  {
    variants: {
      active: {
        true: "bg-neutral-100 text-neutral-700 hover:bg-neutral-100",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);
const Navlinks = [
  {
    name: "Dashboard",
    Icon: LucideHome,
    href: "/dashboard",
  },
  {
    name: "Tasks",
    Icon: LucideAlignLeft,
    href: "/tasks",
  },
  {
    name: "Workspaces",
    Icon: LucideLayout,
    href: "/workspaces",
  },
  {
    name: "Settings",
    Icon: LucideSettings2,
    href: "/settings",
  },
];

function Dashboard() {
  const pathname = usePathname();
  return (
    <div className="relative flex flex-row bg-neutral-100 ">
      {/* <DashboardNavbar /> */}
      {/* notion dashboard sidebar in tailwind css */}
      <div className="sticky left-0 top-0 hidden h-screen w-[20em] bg-neutral-200 md:block">
        <div className="flex h-20 flex-col items-center justify-center bg-neutral-500/5">
          <Link href="/" className="p-5">
            <LogoImage dark width={220} />
          </Link>
        </div>
        {/* links */}

        <div className="ml-2 mt-10 flex h-full flex-col gap-5 ">
          {Navlinks.map(({ href, name, Icon }) => (
            <Link
              href={href}
              key={href}
              className={cn(NavlinkVariants({ active: pathname === href }))}
            >
              <Icon className="text-inherit" />
              <span className="font-medium">{name}</span>
            </Link>
          ))}
        </div>
        {/* account section */}
        <div className="absolute bottom-0 w-full p-5">
          <UserMenu withDetails />
        </div>
      </div>

      <main className=" container mx-auto md:px-5">
        {/* search bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-neutral-100 px-4 py-4 md:px-2 ">
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
        <div className="m-5 mt-10 hidden text-black md:block  lg:flex-row">
          {/* header */}
          <h1 className="text-2xl font-bold md:text-4xl">Dashboard</h1>
          <h1 className="mt-5 text-sm text-neutral-500 md:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Asperiores, repellat.
          </h1>
        </div>
        <Workspaces />
      </main>
    </div>
  );
}

export default Dashboard;
