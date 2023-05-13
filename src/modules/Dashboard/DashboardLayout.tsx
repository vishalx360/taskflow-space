import { useToast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusherClient";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { LucideHome, LucideMails, LucideSettings2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Channel } from "pusher-js";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { simpleVariants } from "../Global/Fade";
import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";
import { ToastProps } from "../ui/toast";
import DashboardNavbar from "./DashboardNavbar";

const NavlinkVariants = cva(
  "relative flex items-center gap-5 rounded-l-full  px-8 py-5 text-xl text-neutral-700 transition-colors group",
  {
    variants: {
      active: {
        true: "text-neutral-700 ",
        false: "hover:bg-neutral-500/10 ",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const InvitationCount = () => {
  const { data: myInvitations, isLoading } =
    api.workspace.getAllMyReceviedInvites.useQuery();
  if (isLoading) {
    <p className="rounded bg-neutral-100 p-2 text-black">#</p>;
  }
  return (
    <p className="z-20 rounded-full bg-neutral-200 px-2 py-1 text-sm text-black">
      {myInvitations?.length}
    </p>
  );
};
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
    Child: InvitationCount,
  },
  {
    name: "Settings",
    Icon: LucideSettings2,
    href: "/dashboard/settings",
  },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const utils = api.useContext();
  const { toast } = useToast();
  // await ctx.pusher.trigger(`workspace-${input.workspaceId}`, "workspace:update", {
  useEffect(() => {
    let userChannel: Channel | null = null;
    if (session?.user.id) {
      userChannel = pusherClient.subscribe(`user-${session?.user.id}`);
      userChannel.bind(`invitation:update`, async () => {
        await utils.workspace.getAllMyReceviedInvites.invalidate();
      });
      userChannel.bind(`invitation:response`, async () => {
        await utils.workspace.getAllMySentInvites.invalidate();
      });
      userChannel.bind(`notification`, async (data: ToastProps) => {
        toast(data);
      });
    }
    return () => {
      if (userChannel) {
        userChannel.unbind_all();
        pusherClient.unsubscribe(`user-${session?.user.id}`);
      }
    };
  }, [session?.user.id]);

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
        <div className="ml-2 mt-10 h-full">
          <div className="space-y-5">
            {Navlinks.map(({ href, name, Icon, Child }, index) => (
              <Link
                href={href}
                key={href}
                className={cn(NavlinkVariants({ active: pathname === href }))}
              >
                <Icon className="z-20 text-inherit" />
                <span className="z-20 font-medium">{name}</span>
                {Child && <Child />}

                {pathname === href && (
                  <motion.span
                    transition={{ duration: 0.2 }}
                    layoutId="incicator"
                    className="absolute left-0 top-0 z-10 h-full w-full rounded-l-full bg-neutral-100 "
                  />
                )}
              </Link>
            ))}
          </div>
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
