import SupportLogo from "@/../public/logo/taskflow-128.png";
import { Button } from "@/modules/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { LifeBuoy, LucideMail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Children, cloneElement, useState, type ReactNode } from "react";

export function SupportModal({ children }: { children?: ReactNode }) {
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
          <DialogHeader>
            <DialogTitle className="flex items-center font-medium">
              <LifeBuoy className="mr-2 h-6 w-6" />
              Support
            </DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <Link
              className="group"
              target="_blank"
              href="mailto:support@taskflow.space"
            >
              <div className="flex items-center gap-5 rounded-lg p-2 group-hover:bg-neutral-100">
                <Image
                  height={20}
                  width={20}
                  unoptimized
                  className="h-12 w-12 rounded-full border-2 border-neutral-500 dark:border-gray-800  lg:h-14 lg:w-14"
                  src={SupportLogo}
                  alt=""
                />
                <div className=" flex w-full items-center justify-between  ">
                  <div>
                    <span className="md:text-md text-md flex items-center gap-5 underline-offset-2 group-hover:underline lg:text-lg">
                      Taskflow Support
                    </span>
                    <h2 className="text-sm text-neutral-600 md:text-sm  ">
                      support@taskflow.space
                    </h2>
                  </div>
                  <Button variant="subtle" className="flex gap-4">
                    <LucideMail width={20} />
                    <span>Write Email</span>
                  </Button>
                </div>
              </div>
            </Link>

            <div className="md:text-md mt-5 space-y-3 text-neutral-700">
              <p>
                You can contact us by sending an email to
                support@taskflow.space. Our support team is available 24/7 to
                assist you with any questions or issues you may have. We will
                respond to your email as soon as possible, typically within 24
                hours.
              </p>
              <p>
                In order to help us better understand your issue or feedback,
                please provide as much detail as possible in your email. This
                can include any relevant screenshots, error messages, or steps
                you took before encountering the issue.
              </p>
            </div>
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
