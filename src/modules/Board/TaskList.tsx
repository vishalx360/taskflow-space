import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type List } from "@prisma/client";
import { api } from "~/utils/api";
import { EmptyListCard, TaskCard } from "./TaskCard";
// import { AddToListForm } from "./AddToListForm";
// import ListActionMenu from "./ListActionMenu";

export const LIST_BG_COLOR = "#ebecf0";

export function TaskList({ list }: { list: List }) {
  const { data: Tasks, isLoading } = api.board.getTasks.useQuery(
    { listId: list.id || "" },
    { enabled: Boolean(list.id), retry: false }
  );

  console.log("rerendering", Tasks);
  const { setNodeRef } = useDroppable({ id: list.id });

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div
      className="h-full rounded-xl border-2 bg-white/90"
      key={`main:${list.name}`}
    >
      <div
        className="sticky top-0 z-10 flex justify-between rounded-t-xl pt-3 pb-2"
        // bg={LIST_BG_COLOR}
      >
        <p className="px-5 pb-1 font-bold">{list.name}</p>
        <p>:</p>
        {/* <ListActionMenu list={list} /> */}
      </div>
      <div
        className="relative pb-3"
        key={list.name}
        //  bg={LIST_BG_COLOR}
      >
        <SortableContext
          items={Tasks || []}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="listScrollbar max-h-[75vh] space-y-4 overflow-y-scroll pb-2"
            ref={setNodeRef}
          >
            {Tasks?.length !== 0 ? (
              Tasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task?.description || ""}
                />
              ))
            ) : (
              <EmptyListCard />
            )}
          </div>
        </SortableContext>
      </div>
      <div
        className="sticky bottom-0 z-10 rounded-b-xl p-2"
        // bg={LIST_BG_COLOR}
      >
        <input
          className="w-full rounded-xl border-gray-200 bg-white  px-5 "
          type="text"
          placeholder="add to list"
        />
        {/* <AddToListForm list={list} /> */}
      </div>
    </div>
  );
}
