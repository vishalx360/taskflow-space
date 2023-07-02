import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import BOARD_1_URL from "../../../public/board1.jpeg";
import BOARD_3_URL from "../../../public/board2.jpeg";
import BOARD_2_URL from "../../../public/board3.png";

function HeroSection() {
  return (
    <section className="h-screen overflow-x-hidden bg-gradient-to-t from-black/10 to-white md:h-[110vh] md:overflow-x-visible ">
      <div className=" mx-auto py-16 text-center">
        <div className="container  mx-auto max-w-2xl px-5">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "anticipate" }}
          >
            <h1 className="w-full text-3xl font-extrabold leading-10  text-gray-800 md:text-4xl lg:text-5xl">
              Streamline Your Workflow and Conquer Tasks
            </h1>
            <motion.p
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="mt-8 text-gray-500"
            >
              Unleash Your Team&apos;s Potential with Taskflow <br /> The
              Collaborative App for Effortless Task Management.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "anticipate" }}
            className="my-10 flex flex-col  items-center  justify-center gap-2 px-5 md:flex-row md:gap-5"
          >
            <Link
              href="/signup"
              className="text-md  inline-block  w-full rounded-lg bg-black px-8 py-3 text-center font-bold  leading-5 text-white transition-colors hover:bg-black/80 focus:outline-none lg:mx-0 lg:w-auto"
            >
              Sign up now
            </Link>
            <Link
              href="/#pricing"
              className="text-md  inline-block   w-full rounded-lg bg-gray-300/30 px-8 py-3 text-center font-bold  leading-5 text-neutral-700 transition-colors hover:bg-gray-400/30 focus:outline-none lg:mx-0 lg:w-auto"
            >
              See pricing
            </Link>
          </motion.div>
        </div>

        <div className="relative mt-20 flex w-full items-end justify-center overflow-hidden md:mt-[10vh] ">
          <motion.div
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, x: "-50%", y: -10, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: "anticipate",
            }}
            className="
            absolute z-[19] 
            w-60 shadow-xl md:w-[900px]"
          >
            <Image
              alt="Poster"
              width={1920}
              height={1080}
              placeholder="blur"
              className="h-full w-full rounded-lg "
              src={BOARD_1_URL}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 200 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: "anticipate",
            }}
            className="z-20 w-72 shadow-2xl md:w-[1000px]"
          >
            <Image
              alt="Poster"
              width={1920}
              height={1080}
              placeholder="blur"
              className="h-full w-full rounded-lg "
              src={BOARD_2_URL}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, x: "50%", y: -10, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: "anticipate",
            }}
            className="absolute z-[19] w-60 shadow-xl md:w-[900px]"
          >
            <Image
              alt="Poster"
              width={1920}
              height={1080}
              placeholder="blur"
              className="h-full w-full rounded-lg "
              src={BOARD_3_URL}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
