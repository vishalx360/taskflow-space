import Image from "next/image";
import Link from "next/link";

import CreatorLogo from "@/../public/vishalAvatar.png";

import Divider from "../Global/Divider";
import Mockup from "@/../public/mockup.png";

function AboutSection() {
  return (
    <section
      id="aboutus"
      className="min-h-[50vh] scroll-mt-16 scroll-smooth bg-gradient-to-b from-white to-black/10 "
    >
      <div className="container mx-auto max-w-[900px] px-6 py-16 ">
        <div className="p-2">
          <h1 className="my-5 text-center text-[2.5rem] font-bold">About us</h1>
          <div className="my-5 flex w-full items-center justify-center p-5 py-10">
            <Image alt="mockup" src={Mockup} height={300} width={500} />
          </div>
          <div className="space-y-3 text-neutral-700 md:text-xl">
            <p>
              Taskflow is a versatile task management application designed to
              help individuals and teams stay organized, efficient, and
              productive. Its intuitive drag-and-drop interface enables easy
              creation, prioritization, and delegation of tasks.
            </p>
          </div>
          <Divider />
          <div className="">
            <div className="text-md my-5 space-y-3 px-2 text-neutral-700">
              <p>
                Thank you for choosing taskflow. We are excited to help you stay
                organized, focused, and productive.
              </p>
            </div>
            <Link
              className="group"
              target="_blank"
              href="https://www.vishalx360.dev/"
            >
              <div className="flex items-center gap-5 rounded-lg p-2 group-hover:bg-neutral-100">
                <Image
                  height={20}
                  width={20}
                  unoptimized
                  className="h-12 w-12 rounded-full border-2 border-teal-500 dark:border-gray-800  lg:h-14 lg:w-14"
                  src={CreatorLogo}
                  alt=""
                />
                <div className=" flex w-full items-center justify-between  ">
                  <div>
                    <span className="md:text-md text-md flex items-center gap-5 underline-offset-2 group-hover:underline lg:text-lg">
                      Vishal Kumar
                    </span>
                    <h2 className="text-sm text-neutral-600 md:text-sm  ">
                      Software Development Engineer
                    </h2>
                  </div>
                  <div className="w-fit rounded-xl border-2 bg-neutral-200/80 p-1 px-3 text-xs capitalize">
                    Creator
                  </div>
                </div>
              </div>
            </Link>

            <div
              className=" 
            md:text-md
            lg:text-md 
            mt-5 flex items-center
            justify-start gap-5 px-2 text-sm 
            text-neutral-600"
            >
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/vishalx360"
                className="underline hover:text-teal-700"
              >
                LinkedIn
              </Link>
              <Link
                target="_blank"
                href="https://www.github.com/vishalx360"
                className="underline hover:text-teal-700"
              >
                Github
              </Link>
              <Link
                target="_blank"
                href="https://www.vishalx360.dev/"
                className="underline hover:text-teal-700"
              >
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
