import CreatorLogo from "@/../public/vishalAvatar.png";
import { Button } from "@/modules/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/modules/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { Children, cloneElement, useState, type ReactNode } from "react";
import Divider from "./Divider";
import LogoImage from "./LogoImage";

export function AboutModal({ children }: { children?: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal(e) {
    e.stopPropagation();
    setIsOpen(true);
  }

  return (
    <div className="flex" onClick={(e) => e.stopPropagation()}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            <>
              {Children.map(children, (child: ReactNode) =>
                cloneElement(child, { onClick: openModal })
              )}
            </>
          ) : (
            <Button variant="outline">About</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          {/* <DialogHeader>
            <DialogTitle className="flex items-center font-medium">
              <LucideInfo className="mr-2 h-6 w-6" />
              About Us
            </DialogTitle>
          </DialogHeader> */}
          <div className="p-2">
            <div className="mb-5">
              <LogoImage dark width={250} />
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
            <div className="text-md my-5 space-y-3 px-2 text-neutral-700">
              <p>
                Thank you for choosing taskflow. We are excited to help you stay
                organized, focused, and productive.
              </p>
            </div>
            <Link
              className="group"
              target="_blank"
              href="https://www.vishalx360.codes/"
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
                href="https://www.vishalx360.codes/"
                className="underline hover:text-teal-700"
              >
                Portfolio
              </Link>
              <p className="ml-auto hidden md:inline ">
                All rights reserverd &copy; Vishal Kumar 2023
              </p>
            </div>
          </div>
          <div className=" text-center text-sm text-gray-600 md:hidden ">
            All rights reserverd &copy; Vishal Kumar 2023
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
<p className="text-xl">
  Thank you for choosing taskflow. We are excited to help you stay organized,
  focused, and productive.
</p>;
