function FeaturesSection() {
  return (
    <section className="min-h-screen bg-neutral-900 text-white ">
      <div className="container mx-auto px-6 py-16 ">
        <div className="mb-10 flex flex-col items-center justify-center ">
          <h1 className="my-5 text-[2.5rem] font-bold">Features</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </div>
        <Features />
      </div>
    </section>
  );
}

export default FeaturesSection;

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import BENIFIT_1_IMG from "../../../public/benifit_1.png";
import BENIFIT_2_IMG from "../../../public/benifit_2.png";
import BENIFIT_3_IMG from "../../../public/benifit_3.png";
const FeatureListData = [
  {
    image: BENIFIT_1_IMG,
    title: "lorem ipsum",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti unde est quasi fuga ipsa minima.",
  },
  {
    image: BENIFIT_2_IMG,
    title: "Lorem ipsum dolor sita",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deleniti obcaecati laborum esse?",
  },
  {
    image: BENIFIT_3_IMG,
    title: "Lorem ipsum dolor sitb",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deleniti obcaecati laborum esse?",
  },
  {
    image: BENIFIT_2_IMG,
    title: "Lorem ipsum dolor sitc",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deleniti obcaecati laborum esse?",
  },
  {
    image: BENIFIT_2_IMG,
    title: "Lorem ipsum dolor sitd",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deleniti obcaecati laborum esse?",
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