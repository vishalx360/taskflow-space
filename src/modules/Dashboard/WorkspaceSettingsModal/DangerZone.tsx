import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { type Workspace } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
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
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="rounded-xl border-neutral-400 px-2  text-neutral-600">
          Transfer Workspace Ownership
        </AccordionTrigger>
        <AccordionContent className="px-2">
          <TransferWorkspaceOwnershipSection
            workspace={workspace}
            setIsOpen={setIsOpen}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="rounded-xl border-neutral-400 px-2  text-neutral-600">
          Delete Workspace
        </AccordionTrigger>
        <AccordionContent className="px-2">
          <DeleteWorkspaceSection workspace={workspace} setIsOpen={setIsOpen} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default DangerZone;
