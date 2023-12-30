import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Workspace } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { pusherClient } from "@/lib/pusherClient";
import { api } from "@/utils/api";

import { Button } from "../ui/button";
import { BoardBox, BoardBoxSkeleton } from "./BoardBox";
import CreateNewBoardModal from "./CreateNewBoardModal";

export default function BoardGrid({ workspace }: { workspace: Workspace }) {
  const {
    data: boards,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = api.board.getAllBoards.useQuery({
    workspaceId: workspace.id,
  });
  const [parent] = useAutoAnimate();
  const { data: session } = useSession();
  const utils = api.useUtils();

  // await ctx.pusher.trigger(`workspace-${input.workspaceId}`, "workspace:update", {
  useEffect(() => {
    const workspaceChannel = pusherClient.subscribe(
      `workspace-${workspace.id}`
    );
    workspaceChannel.bind(`workspace:update`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        await utils.board.getAllBoards.invalidate({
          workspaceId: data.workspaceId,
        });
      }
    });
    return () => {
      workspaceChannel.unbind_all();
      pusherClient.unsubscribe(`workspace-${workspace.id}`);
    };
  }, [session?.user.id]);

  if (isError) {
    return <BoardListGridError isRefetching={isRefetching} refetch={refetch} />;
  }

  if (isLoading) {
    return <BoardGridSkeleton />;
  }
  return (
    <div ref={parent} className="flex flex-wrap gap-5">
      {boards?.map((board) => (
        <BoardBox key={board.id} board={board} />
      ))}
      {workspace?.members[0]?.role !== "MEMBER" && (
        <CreateNewBoardModal workspaceId={workspace.id} />
      )}
    </div>
  );
}

export function RecentBoardGrid() {
  const { data: boards, isLoading } = api.board.getRecentBoards.useQuery(
    undefined,
    {
      staleTime: 1000 * 2,
    }
  );
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardGridSkeleton />;
  }
  return (
    <div
      ref={parent}
      className="grid grid-cols-2 gap-2 px-4 md:flex md:flex-wrap md:gap-5"
    >
      {boards?.map((board) => (
        <BoardBox key={board.id} board={board} />
      ))}
    </div>
  );
}
export function BoardListGridError({
  refetch,
  isRefetching,
}: {
  refetch: any;
  isRefetching: boolean;
}) {
  return (
    <div
      className={`text-md flex w-full items-center justify-center rounded-xl  border-2 border-red-300 object-cover p-5 text-red-500 `}
    >
      <div>Some error occured while fetching boards.</div>
      <Button
        isLoading={isRefetching}
        onClick={refetch}
        variant="ghost"
        size="sm"
      >
        retry
      </Button>
    </div>
  );
}
export function BoardGridSkeleton({
  NumberOfBoards = 4,
}: {
  NumberOfBoards?: number;
}) {
  const Boards = [];
  for (let i = 0; i < NumberOfBoards; i++) {
    Boards.push(<BoardBoxSkeleton key={`boardBox-skeleton:${i}`} />);
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-5">
      {Boards}
    </div>
  );
}
