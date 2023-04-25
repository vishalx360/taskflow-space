import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { AnimatePresence } from "framer-motion";
import { LucideGem, LucideLock, LucideUser } from "lucide-react";
import { usePathname } from "next/navigation";
import Fade from "../Global/Fade";
import ProfileSection from "./profileSection";
import SecuritySection from "./securitySection";
import SubscriptionSection from "./subscriptionSection";

const TabsPathMap = [
  "/dashboard/settings/profile",
  "/dashboard/settings/subscription",
  "/dashboard/settings/security",
];

function Settings() {
  const pathname = usePathname();
  const handelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.getAttribute("data-value");
    window.history.pushState({}, "", value);
  };
  return (
    <>
      <div className="m-5 mt-10 text-black md:block  lg:flex-row">
        {/* header */}
        <h1 className="text-2xl font-bold md:text-4xl">Settings</h1>
        <h1 className="mt-5 text-sm text-neutral-500 md:text-lg">
          Here you can manage your account.
        </h1>
      </div>
      <Tabs
        defaultValue={
          pathname
            ? TabsPathMap.indexOf(pathname || "other") !== -1
              ? pathname
              : TabsPathMap[0]
            : "loading"
        }
        className="w-full px-3"
      >
        <TabsList className="mb-10">
          <TabsTrigger
            className="md:px-5"
            onClick={handelClick}
            data-value="/dashboard/settings/profile"
            value="/dashboard/settings/profile"
          >
            <LucideUser width={20} className="mr-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            onClick={handelClick}
            data-value="/dashboard/settings/security"
            className="md:px-5"
            value="/dashboard/settings/security"
          >
            <LucideLock width={20} className="mr-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            onClick={handelClick}
            data-value="/dashboard/settings/subscription"
            className="md:px-5"
            value="/dashboard/settings/subscription"
          >
            <LucideGem width={20} className="mr-4" />
            Subscription
          </TabsTrigger>
          {/* <TabsTrigger className="md:px-5" value="activity">
            <LucideActivity width={20} className="mr-4" />
            Activity
          </TabsTrigger> */}
        </TabsList>
        <AnimatePresence mode="wait">
          <TabsContent value="/dashboard/settings/profile">
            <Fade>
              <ProfileSection />
            </Fade>
          </TabsContent>
          <TabsContent value="/dashboard/settings/security">
            <Fade>
              {" "}
              <SecuritySection />
            </Fade>
          </TabsContent>
          <TabsContent value="/dashboard/settings/subscription">
            <Fade>
              <SubscriptionSection />
            </Fade>
          </TabsContent>
          <TabsContent value="loading">
            <Fade>
              {/* loading skeleton */}
              <div className="px-5 md:px-0">
                <div className="flex animate-pulse space-x-4">
                  <div className="flex-1 space-y-10 py-1">
                    <div className="h-32 w-5/6 rounded bg-gray-400"></div>
                    <div className="space-y-5">
                      <div className="h-4 w-5/6  rounded bg-gray-400"></div>
                      <div className="h-4 w-3/4 rounded bg-gray-400"></div>
                    </div>
                    <div className="space-y-5">
                      <div className="h-20 w-3/4 rounded bg-gray-400"></div>
                      <div className="h-4 w-5/6 rounded bg-gray-400"></div>
                      <div className="h-4 w-3/4 rounded bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>
          </TabsContent>
        </AnimatePresence>
        {/* <TabsContent value="activity">
          <ActivitySection />
        </TabsContent> */}
      </Tabs>
    </>
  );
}

export default Settings;
