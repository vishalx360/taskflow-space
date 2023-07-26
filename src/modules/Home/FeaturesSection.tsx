import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import BENIFIT_1_IMG from "../../../public/benifit_1.png";
import BENIFIT_2_IMG from "../../../public/benifit_2.png";
import BENIFIT_3_IMG from "../../../public/benifit_3.png";
import BENIFIT_4_IMG from "../../../public/benifit_4.png";

function FeaturesSection() {
  return (
    <section
      id="features"
      className="min-h-screen scroll-mt-16 bg-neutral-900 text-white "
    >
      <div className="container mx-auto px-6 py-16 ">
        <div className="mb-10 flex flex-col items-center justify-center ">
          <h1 className="my-5 text-[2.5rem] font-bold">Features</h1>
          <p>Take Control of Your Tasks and Team.</p>
        </div>
        <Features />
      </div>
    </section>
  );
}

// Kanban Board
// Visualize and organize tasks using a powerful Kanban board system for enhanced productivity.

// Collaborative Team Invites
// Invite team members to your boards, promoting seamless collaboration and efficient task management.

// Customizable Board Backgrounds
// Personalize your boards with custom backgrounds to reflect your unique style and boost inspiration.

export default FeaturesSection;
const FeatureListData = [
  {
    image: BENIFIT_2_IMG,
    title: "Kanban Board",
    description:
      "Visualize and organize tasks using a powerful Kanban board system for enhanced productivity.",
  },
  {
    image: BENIFIT_4_IMG,
    title: "Personal Workspaces",
    description:
      "Create your own personalized workspace to organize tasks, collaborate with teams, and boost your productivity like never before.",
  },
  {
    image: BENIFIT_3_IMG,
    title: "Collaborative Team Invites",
    description:
      "Invite team members to your boards, promoting seamless collaboration and efficient task management.",
  },
  {
    image: BENIFIT_1_IMG,
    title: "Customizable Board Backgrounds",
    description:
      "Personalize your boards with custom backgrounds to reflect your unique style and boost inspiration.",
  },
];

function Features() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setActive((prev) => {
        const newValue = (prev + 1) % FeatureListData.length;
        return newValue;
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [active]);

  return (
    <div className="px-[3em] py-12">
      <div className="flex flex-col-reverse justify-evenly gap-10 md:flex-row md:justify-between">
        <div className="flex-[7] space-y-5 ">
          {FeatureListData.map((feature, index) => {
            const isActive = active === index;
            return (
              <div
                className="relative cursor-pointer rounded-md px-5 py-2 transition-colors duration-75 hover:bg-black/5"
                // _before={{
                //   position: "absolute",
                //   left: "-5px",
                //   content: '""',
                //   bg: isActive ? "green.500" : "green.100",
                //   width: "5px",
                //   height: "90%",
                //   rounded: "full",
                // }}
                onClick={() => {
                  setActive(index);
                }}
                key={feature.title}
              >
                {isActive && (
                  <motion.div
                    className="absolute -left-2 top-0 h-full w-full rounded-md border-l-2 bg-white/10"
                    layoutId="indicator"
                  />
                )}
                <h1 className="mb-2 text-xl font-medium">{feature.title}</h1>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
        <div className="flex-[6]">
          <AnimatePresence mode="wait">
            <motion.div
              variants={{
                enter: {
                  y: 50,
                  opacity: 0,
                },
                center: {
                  y: 0,
                  opacity: 1,
                },
                exit: {
                  y: -50,
                  opacity: 0,
                },
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3,
              }}
              key={active}
            >
              <Image
                className="aspect-square h-full w-full rounded-md object-cover"
                width={500}
                height={500}
                alt="feature image"
                src={FeatureListData[active].image}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
