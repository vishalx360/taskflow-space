import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const Toast = ({
  content = "toast",
  status = "success",
}: {
  content: string;
  status: "success" | "warning" | "error";
}) =>
  toast.custom((t) => (
    <Transition
      show={t.visible}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`flex items-center gap-4 rounded-full bg-neutral-900 px-4 py-4 text-white shadow-md sm:px-6 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        {status === "success" && <FiCheckCircle className="text-green-500" />}
        {status === "error" && <FiAlertCircle className="text-red-500" />}
        {status === "warning" && (
          <FiAlertTriangle className="text-yellow-500" />
        )}
        {content}
      </div>
    </Transition>
  ));
export default Toast;
