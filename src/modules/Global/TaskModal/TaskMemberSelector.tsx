import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import getGravatar from "@/utils/getGravatar";
import { Task, type WorkspaceMember } from "@prisma/client";
import { LucideCheck, LucideUserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export type UserType = {
  id: string | null;
  image: string | null;
  name: string | null;
  email: string | null;
};

export type WorkspaceMemberWithUser = WorkspaceMember & {
  user: UserType;
};

function TaskMemberSelector({
  task,
  workspaceId,
}: {
  task: Task;
  workspaceId: string;
}) {
  const { data: members, isLoading } =
    api.workspace.getWorkspaceMembers.useQuery({ workspaceId });
  return (
    <div>
      <p className="text-md my-4">{task?.members?.length} Members</p>
      <div className="flex max-h-[30vh] flex-col gap-5 overflow-y-scroll">
        {members?.map((member) => {
          return (
            <TaskMemberRow
              isTaskMember={
                task?.members &&
                task?.members?.find(
                  (taskMember) => taskMember.userId === member?.userId
                )
              }
              taskId={task?.id}
              key={member.id}
              member={member}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TaskMemberSelector;

export function TaskMemberRow({
  isTaskMember = false,
  member,
  taskId,
}: {
  isTaskMember: boolean;
  member: WorkspaceMemberWithUser;
  taskId: string;
}) {
  // get current user email
  const { data: session } = useSession();
  const { user } = member;

  const utils = api.useContext();
  const { toast } = useToast();

  const mutation = api.task.updateTaskMember.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: async () => {
      await utils.task.getTask
        .invalidate({ taskId })
        .catch((err) => console.log(err));
    },
  });

  const AddMember = () => {
    mutation.mutate({
      userId: member?.userId,
      taskId: taskId,
      isMember: true,
    });
  };

  const RemoveMember = () => {
    mutation.mutate({
      userId: member?.userId,
      taskId: taskId,
      isMember: false,
    });
  };
  return (
    <div key={user?.email} className="flex items-center gap-5 rounded-md p-2">
      <Image
        height={20}
        width={20}
        className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 "
        src={
          user?.image ||
          (user.email && getGravatar(user.email)) ||
          getGravatar("default")
        }
        alt=""
      />
      <div className="flex w-full items-center justify-between gap-8  ">
        <div>
          <h1 className="text-sm ">
            {user.name} {user.email === session?.user.email && "(You)"}
          </h1>
        </div>
        {/* ismutating */}
        <Button
          isLoading={mutation.isLoading}
          variant="subtle"
          onClick={isTaskMember ? RemoveMember : AddMember}
          className=" rounded-full  p-2"
        >
          {!mutation.isLoading && (
            <>
              {isTaskMember ? (
                <LucideCheck className="p-0.5" />
              ) : (
                <LucideUserPlus />
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function TaskMemberRowSkeleton() {
  return (
    <div className="flex items-center justify-start  gap-5 px-2">
      <div className="h-14 w-14  animate-pulse rounded-full bg-neutral-400 " />
      <div className="flex flex-1 items-center justify-between  ">
        <div className="space-y-2">
          <div className="h-5 w-52  animate-pulse rounded-xl bg-neutral-400" />
          <div className="h-5 w-36  animate-pulse rounded-xl bg-neutral-400" />
        </div>
        <div className="w-fit  animate-pulse  rounded-xl bg-neutral-400 p-1 px-8 py-3 text-xs capitalize"></div>
      </div>
    </div>
  );
}
