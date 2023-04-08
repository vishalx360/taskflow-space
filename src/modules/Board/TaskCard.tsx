import { type Task } from "@prisma/client";
import dynamic from "next/dynamic";
import TaskModal from "../Global/TaskModal/TaskModal";
const Draggable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false }
);

export function TaskCard({ task, index }: { task: Task; index: number }) {
  return (
    <TaskModal task={task}>
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
              className={`border-1 w-full rounded-xl border-gray-400 bg-gray-50 py-3 px-4 shadow ${
                isDragging ? "border-dotted bg-[#f0f0f0]" : ""
              }`}
            >
              <p
                className={`md:text-md text-sm font-medium text-black line-clamp-2 ${
                  task?.pending ? "text-neutral-600" : "text-black"
                }`}
              >
                {task?.title}
              </p>
              {task?.description && (
                <p className="mt-3 text-sm text-neutral-500 line-clamp-2">
                  {task?.description}
                </p>
              )}
            </div>
          </div>
        )}
      </Draggable>
    </TaskModal>
  );
}

export function EmptyListCard() {
  return (
    <div className="px-3">
      <div className="min-w-[300px] max-w-[270px] px-4 text-center">
        <p className="italic">No task added</p>
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="border-1 min-h-[60px] w-full animate-pulse rounded-xl border-gray-400 bg-gray-400/50 py-3 px-4 shadow" />
  );
}
