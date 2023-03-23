import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Error from "next/error";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { TaskCard } from "~/modules/Board/TaskCard";
import TaskList from "~/modules/Board/TaskList";
import { api } from "~/utils/api";

function BoardPage() {
  const boardId = useSearchParams().get("boardId");
  // fetch board details from boardId.
  const {
    data: Board,
    isLoading,
    error,
  } = api.board.getBoard.useQuery(
    { boardId: boardId || "" },
    { enabled: Boolean(boardId), retry: false }
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } })
  );

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id);
      console.log("start:", event);
    },
    [setActiveId]
  );

  // function to handel drag end event
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // const { active, over, draggingRect } = event;
    console.log("end:", event);
  }, []);
  // function to handel drag end event
  const handleDragCancel = useCallback((event: DragCancelEvent) => {
    // const { active, over, draggingRect } = event;
    console.log("cancel:", event);
  }, []);

  // function to handel drag over event
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // const { active, over, draggingRect } = event;
    console.log("over:", event);
  }, []);
  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (!isLoading && !Board) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <div className={`h-screen bg-[url(/board_bg.jpg)] bg-cover bg-no-repeat`}>
        <nav className="w-full bg-black px-4 py-4 text-white shadow sm:px-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="flex items-center">
                <span className="self-center whitespace-nowrap text-3xl font-semibold italic text-white">
                  VIRA
                </span>
              </Link>
              <span className="self-center whitespace-nowrap text-xl font-semibold italic text-white">
                {Board?.name} Board
              </span>
            </div>
          </div>
        </nav>

        {/*---  */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex gap-5 p-10 ">
            {Board?.lists.map((list) => {
              return <TaskList key={list.id} list={list} />;
            })}
          </div>
          <DragOverlay>
            {activeId ? (
              <TaskCard key={activeId} id={activeId} active title="dragged" />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default BoardPage;

function BoardSkeleton(): JSX.Element {
  return (
    <div>
      <div className="border-b-2 border-gray-200 p-2 text-xl font-semibold">
        <div className="my-3 h-10 w-28 animate-pulse rounded-xl bg-gray-300"></div>
      </div>
      <div className="mt-3 space-y-5">
        <div className="my-3 h-10 w-52 animate-pulse rounded-xl bg-gray-300"></div>
      </div>
    </div>
  );
}
