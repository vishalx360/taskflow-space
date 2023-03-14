import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { DndMonitorEvent } from "@dnd-kit/core/dist/components/DndMonitor";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { TaskCard } from "~/modules/Board/TaskCard";
import { TaskList } from "~/modules/Board/TaskList";
import { api } from "~/utils/api";
import geopattern from "geopattern";




function BoardPage() {
  const boardId = useSearchParams().get("boardId");
  // fetch board details from boardId.
  const { data: Board, isLoading } = api.board.getBoard.useQuery({ boardId: boardId || "" }, { enabled: Boolean(boardId), retry: false });

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

  const [activeId, setActiveId] = useState(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id);
    },
    [setActiveId]
  );

  // function to handel drag end event
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // const { active, over, draggingRect } = event;
    console.log(event);
  }, []);

  // function to handel drag over event
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // const { active, over, draggingRect } = event;
    console.log(event);
  }, []);


  if (isLoading) {
    return <BoardSkeleton />
  }

  return <div>
    <div className={`h-screen bg-[url(/board_bg.jpg)] bg-no-repeat bg-cover`}>
      <nav className="bg-black text-white w-full px-4 py-4 shadow sm:px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="https://vishalx360.codes/" className="flex items-center">
              <span className="text-white self-center whitespace-nowrap text-3xl italic font-semibold">
                VIRA
              </span>
            </a>
            <span className="text-white self-center whitespace-nowrap text-xl italic font-semibold">
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
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-5 p-10 ">
          {Board?.lists.map(list => {
            return <TaskList key={list.id} list={list} />
          })}
        </div>
        <DragOverlay>
          {activeId ? (
            <TaskCard
              key={activeId}
              id={activeId}
              active
              title="dragged"
            />
          ) : null}
        </DragOverlay>
      </DndContext>

    </div>


  </div>;
}

export default BoardPage;


function BoardSkeleton(): JSX.Element {
  return (
    <div>
      <div className='p-2 border-b-2 font-semibold border-gray-200 text-xl'>
        <div className="h-10 w-28 rounded-xl my-3 bg-gray-300 animate-pulse"></div>
      </div>
      <div className="mt-3 space-y-5">
        <div className="h-10 w-52 rounded-xl my-3 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  )
}

