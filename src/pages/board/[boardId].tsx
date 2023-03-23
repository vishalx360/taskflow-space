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
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  FiAlignLeft,
  FiArrowLeft,
  FiArrowLeftCircle,
  FiUser,
} from "react-icons/fi";
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
    <div className="relative h-screen ">
      <Image alt="background" fill src="/board_bg.jpg" />
      <div className="relative">
        <nav className="w-full bg-black px-4 py-3 text-white shadow sm:px-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="flex items-center">
                <span className="self-center whitespace-nowrap text-3xl font-semibold italic text-white">
                  VIRA
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-5 rounded-full border-2 border-neutral-400 p-2 px-4"
              >
                <FiArrowLeft className="text-xl" />
                Dashboard
              </Link>
            </div>
            <span className="self-center whitespace-nowrap text-xl font-semibold italic text-white">
              {Board?.name}
            </span>
            <MembersAvatars members={Board?.members} />
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
          <div className="flex gap-5 px-10 py-5 ">
            {Board?.lists.map((list) => {
              return <TaskList key={list.id} list={list} />;
            })}
          </div>
          <DragOverlay>
            {activeId ? (
              <TaskCard
                key={activeId}
                id={activeId}
                active
                task={{
                  id: "dragged",
                  title: "dragged",
                  createdAt: new Date(),
                  rank: "dragged",
                  description: "",
                  listId: "dragged",
                }}
              />
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
type MemberType = {
  image: string | null;
  name: string | null;
  email: string | null;
};

function MembersAvatars({
  members,
}: {
  members: MemberType[] | undefined;
}): JSX.Element {
  return (
    <div className="flex flex-row-reverse items-center justify-center gap-4">
      Members
      <div className="flex -space-x-4">
        {members?.slice(0, 3)?.map((member) => {
          if (member?.image) {
            return (
              <Image
                key={member?.email}
                height={20}
                width={20}
                className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
                src={member?.image}
                alt=""
              />
            );
          } else {
            return (
              <FiUser
                key={member?.email}
                className="h-10 w-10 rounded-full border-2 border-white p-2 dark:border-gray-800"
              />
            );
          }
        })}
        <a
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
          href="#"
        >
          {members?.length}
        </a>
      </div>
    </div>
  );
}

{
  /* if (member?.image) {
          return (
            <Image
              key={member?.email}
              height={200}
              width={200}
              src={member?.image}
              alt="avatar"
              className="w-10 rounded-full ring-2 ring-white/40 transition-all group-hover:ring-4"
            />
          );
        } else {
          return (
            <FiUser
              key={member?.email}
              className="h-10 w-10 -translate-x-8  rounded-full p-2 ring-2 ring-white/40 transition-all group-hover:ring-4"
            />
          );
        }
      })} */
}
