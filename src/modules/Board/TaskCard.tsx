import { type Task } from "@prisma/client";
import dynamic from "next/dynamic";

import { TaskContextMenu } from "../Global/TaskContextMenu";
import TaskModal from "../Global/TaskModal/TaskModal";

const Draggable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false }
);

export function TaskCard({
  task,
  index,
  workspaceId,
}: {
  task: Task;
  index: number;
  workspaceId: string;
}) {
  return (
    <TaskModal workspaceId={workspaceId} defaultTaskData={task}>
      <TaskContextMenu task={task}>
        <Draggable
          isDragDisabled={task?.pending}
          key={task.id}
          draggableId={task.id}
          index={index}
        >
          {(provided, { isDragging }) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div
                className={`border-1 w-full rounded-xl border-gray-400 bg-gray-50 px-4 py-3 shadow ${
                  isDragging ? "border-dotted bg-[#f0f0f0]" : ""
                }`}
              >
                <p
                  className={`md:text-md line-clamp-2 text-sm font-medium text-black ${
                    task?.pending ? "text-neutral-600" : "text-black"
                  }`}
                >
                  {task?.title}
                </p>
                {task?.description && (
                  <p className="mt-3 line-clamp-1 text-sm text-neutral-500">
                    {task?.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </Draggable>
      </TaskContextMenu>
    </TaskModal>
  );
}

export function EmptyListCard() {
  return (
    <div className="p-3">
      <div className=" w-full px-4 text-center">
        <p className="italic text-neutral-500">No task added</p>
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="border-1 min-h-[60px] w-full animate-pulse rounded-xl border-gray-400 bg-gray-400/50 px-4 py-3 shadow" />
  );
}
