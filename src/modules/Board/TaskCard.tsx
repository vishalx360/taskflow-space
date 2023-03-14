import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string
  active?: boolean,
  title: string,
  description?: string,
}

export function TaskCard(props: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="px-3"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {/* <TaskModal
        taskData={{ title: props.title, description: props.description }}
      > */}
      <div
        className={`border-1 min-w-[270px] max-w-[300px] rounded-xl border-gray-400 bg-gray-50 shadow py-3 px-4 ${props.active ? "-rotate-1 border-dotted bg-[#f0f0f0]" : ""}`}
      >
        <p className="text-md">{props.title}</p>
        {props.description && <p className="turncate">{props.description}</p>}
      </div>
      {/* </TaskModal> */}
    </div>
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
