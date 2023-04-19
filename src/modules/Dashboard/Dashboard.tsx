import { LucideHome, LucideMails, LucideSettings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Settings from "../Settings/Settings";
import Invitations from "./Invitations/Invitations";
import OverviewPage from "./OverViewPage";

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
    component: OverviewPage,
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
const Sections = {
  "/dashboard": OverviewPage,
  "/dashboard/invitations": Invitations,
  "/dashboard/settings": Settings,
};
const SectionIndex = {
  "/dashboard": 0,
  "/dashboard/invitations": 1,
  "/dashboard/settings": 2,
};

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    };
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      y: direction < 0 ? 100 : -100,
      opacity: 0,
    };
  },
};

function Dashboard() {
  const pathname = usePathname();
  const [[currentPath, direction], setcurrentPath] = useState([pathname, 0]);

  const Section = Sections[currentPath] ? Sections[currentPath] : OverviewPage;

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
            <button
              // href={href}
              onClick={() => {
                setcurrentPath([
                  href,
                  SectionIndex[currentPath] < index ? 1 : -1,
                ]);
                // update the url without reloading the page not using nextjs router
                // because it will reload the page
                window.history.pushState({}, "", href);
              }}
              key={href}
              className={cn(NavlinkVariants({ active: currentPath === href }))}
            >
              <Icon className="text-inherit" />
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </div>
        {/* account section */}
        <div className="sticky bottom-6 w-full  p-5">
          <UserMenu withDetails />
        </div>
      </div>
      {/* Main Section */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.main
          className="h-screen w-full overflow-y-auto"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          transition={{
            x: { type: "inertia", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          key={currentPath}
          // initial={{ opacity: 0, y: !fadeToTop.current ? -100 : 100 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: fadeToTop.current ? 100 : -100 }}
        >
          {<Section />}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
