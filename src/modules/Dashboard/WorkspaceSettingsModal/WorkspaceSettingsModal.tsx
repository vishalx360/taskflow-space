import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { type Workspace } from "@prisma/client";
import { LucideLayoutDashboard } from "lucide-react";
import { useState } from "react";
import { MdSettings } from "react-icons/md";
import IconButton from "../../Global/IconButton";
import DangerZone from "./DangerZone";
import RenameWorkspaceSection from "./RenameWorkspaceSection";
export default function WorkspaceSettingsModal({
  workspace,
  hideText = false,
}: {
  workspace: Workspace;
  hideText?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <IconButton onClick={openModal} Icon={MdSettings} className="">
            <p className={hideText ? "hidden lg:inline" : ""}>Settings</p>
          </IconButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4 font-medium">
              <LucideLayoutDashboard width={20} />
              Workspace Settings
            </DialogTitle>
          </DialogHeader>

          <RenameWorkspaceSection workspace={workspace} setIsOpen={setIsOpen} />
          <DangerZone workspace={workspace} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
