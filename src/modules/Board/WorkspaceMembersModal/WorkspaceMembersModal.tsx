import Divider from "@/modules/Global/Divider";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { api } from "@/utils/api";
import getGravatar from "@/utils/getGravatar";
import { type Workspace } from "@prisma/client";
import { LucideNetwork, LucideUserMinus, LucideUsers } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import InviteSection from "./InviteSection";
import LeaveWorkspaceSection from "./LeaveWorkspaceSection";
import MembersList, { MemberListSkeleton } from "./MembersList";
import { MdOutlinePeopleAlt, MdPeople, MdPeopleAlt } from "react-icons/md";

export default function WorkspaceMembersModal({
  workspace,
  hideText = false,
}: {
  workspace: Workspace;
  hideText?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const { data: members, isLoading } =
    api.workspace.getWorkspaceMembers.useQuery(
      {
        workspaceId: workspace?.id,
      }
      // { enabled: isOpen }
    );
  function openModal(e) {
    console.log(e);
    setIsOpen(true);
  }
  function closeModal(e) {
    setIsOpen(false);
  }
  const CurrentUserRole = members?.find(
    (member) => member.user.email === session?.user.email
  )?.role;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={openModal} className="flex items-center gap-2">
          <div className="flex items-center -space-x-3">
            {members?.slice(0, 3)?.map((member) => {
              return (
                <Avatar
                  className="h-6 w-6 border-2 sm:h-8 sm:w-8"
                  key={member.id}
                >
                  <AvatarImage
                    src={member.user.image || getGravatar(member?.user?.email)}
                  />
                  <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          <h1 className="hidden lg:inline">Members</h1>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4 font-medium">
            <LucideUsers width={20} />
            Workspace Members
          </DialogTitle>
        </DialogHeader>
        {(CurrentUserRole === "ADMIN" || CurrentUserRole === "OWNER") && (
          <div className="border-t">
            <InviteSection
              CurrentUserRole={CurrentUserRole}
              workspaceId={workspace.id}
            />
          </div>
        )}
        {isLoading ? <MemberListSkeleton /> : <MembersList members={members} />}

        {CurrentUserRole !== "OWNER" && (
          <>
            <LeaveWorkspaceSection
              setIsOpen={setIsOpen}
              workspace={workspace}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
