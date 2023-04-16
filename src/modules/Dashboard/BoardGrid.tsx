import { api } from "@/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Workspace } from "@prisma/client";
import { BoardBox, BoardBoxSkeleton } from "./BoardBox";
import CreateNewBoardModal from "./CreateNewBoardModal";

export default function BoardGrid({ workspace }: { workspace: Workspace }) {
  const { data: boards, isLoading } = api.board.getAllBoards.useQuery({
    workspaceId: workspace.id,
  });
  const [parent] = useAutoAnimate();

  if (isLoading) {
    return <BoardGridSkeleton />;
  }
  return (
    <div ref={parent} className="flex flex-wrap gap-5">
      {boards?.map((board) => (
        <BoardBox key={board.id} board={board} />
      ))}
      {workspace?.members[0]?.role !== "MEMBER" && (
        <CreateNewBoardModal workspace={workspace} />
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
