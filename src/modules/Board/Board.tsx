import { useToast } from "@/hooks/use-toast";
import TaskList, {
  CreateList,
  TaskListSkeleton,
} from "@/modules/Board/TaskList";
import { api } from "@/utils/api";
import { type Board, type Task } from "@prisma/client";
import dynamic from "next/dynamic";
import Error from "next/error";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type DropResult } from "react-beautiful-dnd";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiArrowLeft } from "react-icons/fi";
import { useDebouncedCallback } from "use-debounce";
import { BoardContextMenu } from "../Global/BoardContextMenu";
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
  const { toast } = useToast();
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
      await utils.task.getTasks
        .invalidate({ listId })
        .catch((err) => console.log(err));
    },
    // delay in ms
    3000
  );

  const mutation = api.task.moveTask.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
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
      utils.task.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        return prev;
      });

      utils.task.getTasks.setData(
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
      utils.task.getTasks.setData({ listId: source.droppableId }, (prev) => {
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
      <BoardBackground background={board?.background} />
      <BoardNavbar board={board} />
      <BoardContextMenu board={board}>
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
      </BoardContextMenu>
    </main>
  );
}

export default Board;

function BoardSkeleton(): JSX.Element {
  const params = useSearchParams();
  const background = params.get("background");
  const boardName = params.get("boardName");
  return (
    <div className="relative h-screen ">
      <BoardBackground background={background} />
      <nav className="fixed left-0 top-0 z-50 w-full  px-4 text-white shadow sm:px-4">
        <div className="container mx-auto flex  items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              href="/dashboard"
              className={`flex items-center gap-5 rounded-full border-2  p-2 transition duration-200 ease-in-out hover:bg-neutral-300/20  ${
                background
                  ? "border-white/50 text-white"
                  : "border-neutral-400 text-neutral-600"
              }`}
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <span className="self-center whitespace-nowrap text-xl font-semibold  text-white">
              {boardName ? (
                <span className="self-center whitespace-nowrap text-xl font-semibold">
                  {boardName}
                </span>
              ) : (
                <div className="my-3 h-10 w-28 animate-pulse rounded-xl bg-gray-300" />
              )}
            </span>
          </div>
          <Link href="/" className="hidden  items-center md:flex">
            <LogoImage dark={!Boolean(background)} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="my-3 h-10 w-10 animate-pulse rounded-xl bg-gray-300 md:w-20"></div>
            <div className="my-3 h-10 w-10 animate-pulse rounded-xl bg-gray-300 md:w-20"></div>
          </div>
        </div>
      </nav>

      <Scrollbars className="z-40">
        <div className="flex w-fit items-start gap-5 p-5  pt-20">
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
