import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { LucideHome, LucideMails, LucideSettings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";
import Settings from "../Settings/Settings";
import DashboardNavbar from "./DashboardNavbar";
import Invitations from "./Invitations/Invitations";
import Overview from "./OverView";
import { simpleVariants } from "../Global/Fade";
import { Scrollbars } from "react-custom-scrollbars-2";

const NavlinkVariants = cva(
  "relative flex items-center space-x-5 rounded-l-full  px-8 py-5 text-xl text-neutral-700 transition-colors hover:bg-neutral-500/10",
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
    component: Overview,
  },
  {
    name: "Invitations",
    Icon: LucideMails,
    href: "/dashboard/invitations",
    component: Invitations,
  },
  {
    name: "Settings",
    Icon: LucideSettings2,
    href: "/dashboard/settings",
    component: Settings,
  },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex items-center  overflow-hidden ">
      {/* <DashboardSidebar /> */}
      <div className=" left-0 top-0 hidden h-screen w-[25em] bg-neutral-200 md:block">
        <div className="flex h-20 flex-col items-center justify-center bg-neutral-500/5">
          <Link href="/" className="p-5">
            <LogoImage dark width={220} />
          </Link>
        </div>
        {/* links */}

        <div className="ml-2 mt-10 flex h-full flex-col gap-5 ">
          {Navlinks.map(({ href, name, Icon }, index) => (
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
        <div className="sticky bottom-6 w-full  p-5">
          <UserMenu withDetails />
        </div>
      </div>
      {/* Main Section */}
      <AnimatePresence mode="wait">
        <div className="h-screen w-full overflow-y-auto">
          <Scrollbars>
            <div className="container mx-auto p-0  md:px-5">
              {pathname !== "/dashboard/overview" &&
                pathname !== "/dashboard" && <DashboardNavbar />}
              <motion.main
                variants={simpleVariants}
                initial="enter"
                animate="center"
                exit="exit"
                // custom={direction}
                transition={{
                  x: { type: "inertia", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                key={pathname}
              >
                {children}
              </motion.main>
            </div>
          </Scrollbars>
        </div>
      </AnimatePresence>
    </div>
  );
}

export default DashboardLayout;
