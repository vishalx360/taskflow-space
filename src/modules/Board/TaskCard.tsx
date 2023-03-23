import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "@prisma/client";
import TaskModal from "../Global/TaskModal";

type Props = {
  id: UniqueIdentifier;
  active?: boolean;
  task: Task;
};

export function TaskCard({ id, active, task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TaskModal task={task}>
      <div
        className="px-3"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div
          className={`border-1 min-w-[270px] max-w-[300px] rounded-xl border-gray-400 bg-gray-50 py-3 px-4 shadow ${
            active ? "-rotate-1 border-dotted bg-[#f0f0f0]" : ""
          }`}
        >
          <p className="text-md">{task?.title}</p>
          {task?.description && <p className="turncate">{task?.description}</p>}
        </div>
      </div>
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
