import { type LexoRank } from "lexorank";
import { columnsFromBackend } from "~/utils/TestData";

import dynamic from "next/dynamic";
import { type DropResult } from "react-beautiful-dnd";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { getGravatarUrl } from "react-awesome-gravatar";
import {
  FiAlignLeft,
  FiArrowLeft,
  FiArrowLeftCircle,
  FiUser,
} from "react-icons/fi";
import BoardSettingsModal from "~/modules/Board/BoardSettingsModal/BoardSettingsModal";
// import { TaskCard } from "~/modules/Board/TaskCard";
// import TaskList, { CreateList } from "~/modules/Board/TaskList";
import { GravtarOption } from "~/modules/Global/DashboardNavbar";
import { api } from "~/utils/api";
import { BoardSkeleton } from "~/modules/Dashboard/BoardList";
import { EmptyListCard } from "~/modules/Board/TaskCard";
import {
  AddToListForm,
  ListActionMenu,
  UpdateListName,
} from "~/modules/Board/TaskList";
import { List, Task } from "@prisma/client";

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);
const Droppable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Droppable;
    }),
  { ssr: false }
);
const Draggable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false }
);

// add type to List
// const Lists = ["TODO", "DOING", "DONE"];

// add types to InitialData Map()
// const columnsFromBackend = {
//   TODO: {
//     title: "To-do",
//     items: [],
//   },
//   DOING: {
//     title: "Doing",
//     items: [],
//   },
//   DONE: {
//     title: "Done",
//     items: [],
//   },
// };

// Lists.map((list) => {
//   let rank = LexoRank.min();
//   for (let i = 0; i < 5; i++) {
//     columnsFromBackend[list].items.push({
//       title: `${list}-${i}`,
//       rank,
//       id: `ID:${list}-${i}`,
//     });
//     rank = rank.genNext();
//   }
// });

function TestPage() {
  const boardId = useSearchParams().get("boardId");
  // fetch board details from boardId.
  const utils = api.useContext();
  const { data: Board, isLoading } = api.board.getBoard.useQuery(
    { boardId: boardId || "" },
    { enabled: Boolean(boardId), retry: false }
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // if different list
    let removed: Task | undefined;

    if (source.droppableId !== destination.droppableId) {
      utils.board.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        return prev;
      });

      utils.board.getTasks.setData(
        { listId: destination.droppableId },
        (prev) => {
          removed && prev?.splice(destination.index, 0, removed);
          return prev;
        }
      );
    } else {
      // if same list
      utils.board.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        removed && prev?.splice(destination.index, 0, removed);
        return prev;
      });
    }
  };

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (!isLoading && !Board) {
    return <Error statusCode={404} />;
  }

  return (
    <main className="h-screen bg-black text-white">
      <div className="py-10 text-center  ">
        <h1 className="text-4xl font-medium">Kanban Board</h1>
        <h3 className="mt-2 text-xl text-neutral-300">
          using react-beautiful-dnd and lexorank
        </h3>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container mx-auto flex  w-full items-start justify-evenly gap-5  p-5">
          {Board?.lists.map((list, index) => {
            return (
              <Droppable key={list.id} droppableId={list.id}>
                {(provided, { isDraggingOver }) => (
                  <div
                    className={`h-fit max-h-[79vh] min-h-[70vh] w-[350px] space-y-5 overflow-y-scroll rounded-2xl transition-colors ${
                      isDraggingOver ? "bg-neutral-400/20" : "bg-white/10"
                    } p-4`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <TaskList list={list} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </main>
  );
}

function TaskList({ list }: { list: List }) {
  const { data: Tasks, isLoading } = api.board.getTasks.useQuery(
    { listId: list.id || "" },
    { enabled: Boolean(list.id), retry: false }
  );

  console.log("rerendering", list.name);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div key={`main:${list.name}`}>
      <div className="sticky top-0 z-10 flex justify-between rounded-t-xl px-3 pt-3 pb-2">
        <UpdateListName list={list} />
        <ListActionMenu list={list} />
      </div>
      <div
        className="relative pb-3"
        key={list.name}
        //  bg={LIST_BG_COLOR}
      >
        <div className="listScrollbar max-h-[75vh] space-y-4  pb-2">
          {Tasks?.length !== 0 ? (
            Tasks?.map((task: Task, index: number) => (
              <TaskCard key={task.id} index={index} task={task} />
            ))
          ) : (
            <EmptyListCard />
          )}
        </div>
      </div>
      <AddToListForm list={list} />
    </div>
  );
}

function TaskCard({ task, index }: { task: Task; index: number }) {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, { isDragging }) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={`border-green w-full rounded-2xl bg-neutral-200 p-4 text-black shadow-md ${
              isDragging ? "-rotate-2" : ""
            }}`}
          >
            <h1 className="font-medium">{task.title}</h1>
            {/* <p className="mt-2 text-xs">
              <span>
                {new Date(task.).toLocaleDateString("en-us", {
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </p> */}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TestPage;
