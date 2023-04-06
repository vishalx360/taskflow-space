import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Board, type Task } from "@prisma/client";
import dynamic from "next/dynamic";
import Error from "next/error";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type DropResult } from "react-beautiful-dnd";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiArrowLeft } from "react-icons/fi";
import { useDebouncedCallback } from "use-debounce";
import TaskList, {
  CreateList,
  TaskListSkeleton,
} from "~/modules/Board/TaskList";
import Toast from "~/modules/Global/Toast";
import { api } from "~/utils/api";
import LogoImage from "../Global/LogoImage";
import BoardBackground from "./BoardBackground";
import BoardNavbar from "./BoardNavbar";

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);

function Board() {
  const boardId = useSearchParams().get("boardId");
  // fetch board details from boardId.
  const utils = api.useContext();
  const { data: board, isLoading } = api.board.getBoard.useQuery(
    { boardId: boardId || "" },
    { enabled: Boolean(boardId), retry: false }
  );

  const syncListDebounced = useDebouncedCallback(
    // function
    async (listId: string) => {
      console.count("syncListDebounced");
      await utils.board.getTasks
        .invalidate({ listId })
        .catch((err) => console.log(err));
    },
    // delay in ms
    3000
  );

  const mutation = api.board.moveTask.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async (listsToUpdate) => {
      listsToUpdate[0] && (await syncListDebounced(listsToUpdate[0]));
      listsToUpdate[1] && (await syncListDebounced(listsToUpdate[1]));
    },
  });

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // if different list
    let removed: Task | undefined;

    let newPrevTaskId;
    let newNextTaskId;

    if (source.droppableId !== destination.droppableId) {
      utils.board.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        return prev;
      });

      utils.board.getTasks.setData(
        { listId: destination.droppableId },
        (prev) => {
          // todo lookout for edge cases
          newPrevTaskId =
            destination.index > 0 ? prev[destination.index - 1].id : null;
          removed && prev?.splice(destination.index, 0, removed);
          // check if index is not out of bounds
          console.log(destination.index + 1, prev?.length);

          if (destination.index + 1 <= prev.length - 1) {
            newNextTaskId = prev[destination.index + 1].id;
          }
          return prev;
        }
      );
    } else {
      // if same list
      utils.board.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        removed && prev?.splice(destination.index, 0, removed);
        // todo lookout for edge cases
        newPrevTaskId =
          destination.index > 0 ? prev[destination.index - 1].id : null;
        // check if index is not out of bounds
        if (destination.index + 1 <= prev.length - 1) {
          newNextTaskId = prev[destination.index + 1].id;
        }
        return prev;
      });
    }

    // make api call to update task
    await mutation.mutate({
      taskId: removed?.id || "",
      newListId: destination.droppableId,
      newPrevTaskId: newPrevTaskId || "",
      newNextTaskId: newNextTaskId || "",
    });
    return;
  };

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (!isLoading && !board) {
    return <Error statusCode={404} />;
  }

  return (
    <main className="relative h-screen">
      <BoardBackground board={board} />
      <BoardNavbar board={board} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Scrollbars>
          <div className="flex w-fit items-start gap-5 p-5  pt-20">
            {board?.lists.map((list) => {
              return <TaskList key={list.id} list={list} />;
            })}
            <CreateList boardId={boardId || ""} />
          </div>
        </Scrollbars>
      </DragDropContext>
    </main>
  );
}

export default Board;

function BoardSkeleton(): JSX.Element {
  return (
    <div className="h-screen border-2  bg-neutral-100">
      <nav className=" top-0 left-0 z-50 w-full  px-4 text-white shadow sm:px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              href="/dashboard"
              className="flex items-center gap-5 rounded-full border-2 border-neutral-400 p-2 transition duration-200 ease-in-out hover:bg-neutral-300/20 hover:text-white"
            >
              <FiArrowLeft className="text-xl text-black" />
            </Link>
            <span className="self-center whitespace-nowrap text-xl font-semibold italic text-neutral-600">
              <div className="my-3 h-10 w-28 animate-pulse rounded-xl bg-gray-300"></div>
            </span>
          </div>
          <Link href="/" className="flex items-center">
            <LogoImage dark />
          </Link>
          <div className="flex items-center gap-3">
            <div className="my-3 h-10 w-28 animate-pulse rounded-xl bg-gray-300"></div>
            <div className="my-3 h-10 w-28 animate-pulse rounded-xl bg-gray-300"></div>
          </div>
        </div>
      </nav>
      <Scrollbars>
        <div className="flex w-fit items-start gap-5 p-5 pt-5">
          <TaskListSkeleton NumberOfTasks={10} />
          <TaskListSkeleton NumberOfTasks={7} />
          <TaskListSkeleton NumberOfTasks={9} />
          <TaskListSkeleton NumberOfTasks={5} />
          <TaskListSkeleton NumberOfTasks={8} />
        </div>
      </Scrollbars>
    </div>
  );
}
