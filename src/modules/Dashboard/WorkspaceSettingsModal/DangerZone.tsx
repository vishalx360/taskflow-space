import { Disclosure, Transition } from "@headlessui/react";
import { type Workspace } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { FaCaretRight } from "react-icons/fa";
import Divider from "~/modules/Global/Divider";
import DeleteWorkspaceSection from "./DeleteWorkspaceSection";
import TransferWorkspaceOwnershipSection from "./TransferWorkspaceOwnershipSection";

function DangerZone({
  workspace,
  setIsOpen,
}: {
  workspace: Workspace;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <>
          <div className="my-5 flex items-center gap-5">
            <Disclosure.Button className="w-full ">
              <div className="flex w-full items-center justify-between gap-10 rounded-xl rounded-t-xl border border-red-200 px-5  text-red-500  hover:bg-red-50 ">
                <div className="flex items-center gap-5">
                  <p className="text-md py-3 ">Danger Zone</p>
                  {/* {isRefetching && (
                    <BiLoaderAlt className="h-5 w-5 animate-spin text-neutral-500" />
                  )} */}
                </div>
                <FaCaretRight
                  className={`${
                    open ? "rotate-90 transform" : ""
                  } h-5 w-5 text-inherit`}
                />
              </div>
            </Disclosure.Button>
          </div>

          <Transition
            enter="transition duration-150 ease-in"
            enterFrom="transform -translate-y-3 opacity-0"
            enterTo="transform translate-y-0  opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-3 opacity-0"
          >
            <Disclosure.Panel className="space-y-5 rounded-xl border border-red-200 p-4">
              <TransferWorkspaceOwnershipSection
                workspace={workspace}
                setIsOpen={setIsOpen}
              />
              <Divider />
              <DeleteWorkspaceSection
                workspace={workspace}
                setIsOpen={setIsOpen}
              />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

export default DangerZone;
