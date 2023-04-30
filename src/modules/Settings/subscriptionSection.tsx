import geopattern from "geopattern";
import { LucideCheckCircle } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { FaBan } from "react-icons/fa";
import { Badge } from "../ui/badge";

const bgMap = {
  individual: "awdaawwwaddwdawawdwda",
  startup: "free-plasdasan-subscription",
  enterprise: "asdterpris-plan-subscription",
};

// function PlanCard({
//   plan,
//   description,
//   isCurrent = false,
// }: {
//   plan: Plan;
//   description: string;
//   isCurrent?: boolean;
// }) {
//   return (
//     <div className="relative">
//       <div className="relative -z-10 h-20 w-full max-w-md overflow-hidden rounded-xl  md:h-52 md:max-w-md">
//         <Image
//           fill
//           src={geopattern.generate(bgMap[plan]).toDataUri()}
//           alt=""
//           className="h-full w-full object-cover"
//         />
//       </div>
//       <div className="absolute top-0 z-10 h-full w-full max-w-md space-y-5 rounded-xl bg-black/50 p-5">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold capitalize text-white">{plan}</h1>
//           {isCurrent ? (
//             <Badge variant="secondary">Current Plan</Badge>
//           ) : (
//             <Button variant="subtle" className="">
//               Upgrade
//             </Button>
//           )}
//         </div>
//         <p className="text-md whitespace-break-spaces text-neutral-100">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// }

const PlansData = [
  {
    plan: "individual",
    isCurrentPlan: true,
    price: 0,
    description: "For individuals who want to get things done",
    features: [
      "3 Workspaces",
      "5 Members per Workspace",
      "4 Boards per Workspace",
      "5 Lists per Board",
      "1000 Tasks per List",
    ],
  },
  {
    plan: "startup",
    price: 10,
    description: "For small teams who want to get things done",
    features: [
      "100 Workspaces",
      "200 Members per Workspace",
      "50 Boards per Workspace",
      "100 Lists per Board",
      "Unlimited Tasks per List",
    ],
  },
  {
    plan: "enterprise",
    price: 99,
    description: "For large teams who want to get things done",
    features: [
      "Everything of Startup Plan",
      "Email Support",
      "Custom Domain",
      "Custom Branding",
      "Custom Integrations",
    ],
  },
];

export function SubscriptionSection() {
  return (
    <div className="">
      <div className="container  px-6 py-8 pb-20">
        <div className="">
          {/* <div className="flex flex-col items-center xl:mx-8 xl:items-start">
            <h1 className="text-2xl font-medium capitalize text-gray-800 dark:text-white lg:text-3xl">
              Our Pricing Plans
            </h1>

            <div className="mt-4">
              <span className="inline-block h-1 w-40 rounded-full bg-gray-500"></span>
              <span className="mx-1 inline-block h-1 w-3 rounded-full bg-gray-500"></span>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-500"></span>
            </div>

            <p className="mt-4 font-medium text-gray-500 dark:text-gray-300">
              You can get All Access by selecting your plan!
            </p>

            <a
              href="#"
              className="-mx-1 mt-4 flex items-center text-sm capitalize text-gray-700 hover:text-gray-600 hover:underline dark:text-gray-400 dark:hover:text-gray-500"
            >
              <span className="mx-1">read more</span>
              <svg
                className="mx-1 h-4 w-4 rtl:-scale-x-100"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div> */}

          <div className="flex-1 xl:mx-8">
            <div className="mt-8 space-y-8 md:-mx-4 md:flex md:items-stretch md:justify-center md:space-y-0 xl:mt-0">
              {PlansData.map((plan) => (
                <div
                  key={plan.plan}
                  className="relative mx-auto max-w-sm rounded-lg border bg-white md:mx-4"
                >
                  <div className="min-w-sm  relative h-20 w-full max-w-md overflow-hidden rounded-t-xl  md:h-20 md:max-w-md">
                    <Image
                      fill
                      src={geopattern.generate(bgMap[plan.plan]).toDataUri()}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className=" p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h1 className="text-xl font-medium capitalize  text-gray-700 dark:text-white lg:text-2xl">
                        {plan.plan}
                      </h1>
                      {plan.isCurrentPlan && <Badge>Current Plan</Badge>}
                    </div>
                    <p className="mt-4 text-gray-500 dark:text-gray-300">
                      {plan.description}
                    </p>

                    <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300 sm:text-3xl">
                      ${plan.price || 0}.00{" "}
                      <span className="text-base font-medium">/Month</span>
                    </h2>

                    <p className="mt-1 text-gray-500 dark:text-gray-300">
                      Yearly payment
                    </p>

                    <button className="mt-6 w-full transform rounded-md bg-black px-4 py-2 capitalize tracking-wide text-white transition-colors duration-300 hover:bg-gray-500 focus:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                      Start Now
                    </button>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="p-6">
                    <h1 className="text-lg font-medium capitalize text-gray-700 dark:text-white lg:text-xl">
                      What’s included:
                    </h1>
                    <div className="mt-8 space-y-4">
                      {plan?.features?.map((feature) => {
                        return (
                          <div key={feature} className="flex items-center">
                            <LucideCheckCircle width={20} />
                            <span className="mx-4 text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        );
                      })}
                      {plan?.missingFeatures?.map((feature) => {
                        return (
                          <div key={feature} className="flex items-center">
                            <FaBan className="text-red-400" />
                            <span className="mx-4 text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StripeSubcription() {
  return (
    <div className="pb-10">
      <Script async src="https://js.stripe.com/v3/pricing-table.js"></Script>
      <stripe-pricing-table
        pricing-table-id="prctbl_1N0ij8SBAltn7fnNQ5L5FuTy"
        publishable-key="pk_test_51N0UECSBAltn7fnNvgoHpvhsZ75ickfwKHbfAREQBOUCWYAHyEk2Rs2zHjIqj3GF9qDlaPUPsZeYWlPSvVp0oliU00dpzzIQiP"
      ></stripe-pricing-table>
    </div>
  );
}
