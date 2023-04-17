import { LucideHome, LucideMails, LucideSettings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

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
    name: "Overview",
    Icon: LucideHome,
    href: "/dashboard",
  },
  {
    name: "Invitations",
    Icon: LucideMails,
    href: "/dashboard/invitations",
  },
  {
    name: "Settings",
    Icon: LucideSettings2,
    href: "/dashboard/settings",
  },
];

function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="relative flex flex-row bg-neutral-100 ">
      {/* <DashboardSidebar /> */}
      <div className="fixed left-0 top-0 hidden h-screen w-[20em] bg-neutral-200 md:block">
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
        <div className="absolute bottom-6 w-full p-5">
          <UserMenu withDetails />
        </div>
      </div>
      {/* Main Section */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default DashboardLayout;
