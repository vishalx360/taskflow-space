import { type LexoRank } from "lexorank";
import { useState } from "react";
import { columnsFromBackend } from "~/utils/TestData";

import dynamic from "next/dynamic";
import { DropResult } from "react-beautiful-dnd";

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

// add type to Task
interface Task {
  title: string;
  rank: LexoRank;
  id: string;
}
// add type to TaskList
interface TaskList {
  title: string;
  tasks: Task[];
}

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
  const [columns, setColumns] = useState(columnsFromBackend);
  // add types

  const onDragEnd = (result: DropResult, columns: any, setColumns: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // if different list
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      // if same list
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <main className="h-screen bg-black text-white">
      <div className="py-10 text-center  ">
        <h1 className="text-4xl font-medium">Kanban Board</h1>
        <h3 className="mt-2 text-xl text-neutral-300">
          using react-beautiful-dnd and lexorank
        </h3>
      </div>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <div className="container mx-auto flex  w-full items-start justify-evenly gap-5  p-5">
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    className="h-fit min-h-[70vh] w-[350px] space-y-5 rounded-2xl bg-white/10 p-4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h1 className="p-2 font-medium uppercase">
                      {column.title}
                    </h1>
                    {column.items.map((item, index) => (
                      <TaskCard key={item.id} item={item} index={index} />
                    ))}
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

function TaskList({ children, ...rest }) {
  return (
    <div
      className="h-fit min-h-[70vh] w-[350px] space-y-5 rounded-2xl bg-white/10 p-4"
      {...rest}
    >
      {children}
    </div>
  );
}

function TaskCard({ item, index }) {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
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
            <h1 className="font-medium">{item.Task}</h1>
            <p className="mt-2 text-xs">
              <span>
                {new Date(item.Due_Date).toLocaleDateString("en-us", {
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TestPage;
