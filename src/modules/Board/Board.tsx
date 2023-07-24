import { type Board, type Task } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { LexoRank } from "lexorank";
import dynamic from "next/dynamic";
import Error from "next/error";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { type DropResult } from "react-beautiful-dnd";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiArrowLeft } from "react-icons/fi";
import { useDebouncedCallback } from "use-debounce";

import { useToast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusherClient";
import TaskList, {
  CreateList,
  TaskListSkeleton,
} from "@/modules/Board/TaskList";
import { api } from "@/utils/api";

import LogoImage from "../Global/LogoImage";
import BoardBackground from "./BoardBackground";
import BoardNavbar from "./BoardNavbar";

function getNewRank({
  prevRank,
  nextRank,
}: {
  prevRank: string;
  nextRank: string;
}) {
  // if putting in middle
  if (prevRank && nextRank) {
    if (prevRank == nextRank) {
      return LexoRank.parse(nextRank).genNext().toString();
    }
    return LexoRank.parse(prevRank)
      .between(LexoRank.parse(nextRank))
      .toString();
  }
  // if putting on bottom and prev exist
  if (prevRank && !nextRank) {
    return LexoRank.parse(prevRank).genNext().toString();
  }
  // if putting on top and next exist
  if (!prevRank && nextRank) {
    return LexoRank.parse(nextRank).genPrev().toString();
  }
}

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);

function Board() {
  const { toast } = useToast();
  const { data: session } = useSession();
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

  useEffect(() => {
    const boardChannel = pusherClient.subscribe(`board-${boardId}`);

    // pusherClient.bind(`list:created`, async (data: ) => {
    boardChannel.bind(`task:created`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        utils.task.getTasks.setData({ listId: data.listId }, (oldData) => {
          if (oldData) {
            return [...oldData, data.task];
          }
        });
      }
    });
    boardChannel.bind(`task:updated`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        utils.task.getTasks.setData({ listId: data.listId }, (oldData) => {
          const index = oldData.findIndex((task) => task.id === data.task.id);
          const newData = [...oldData];
          newData[index] = data.task;
          return newData;
        });
        utils.task.getTask.setData({ taskId: data.task.id }, (oldData) => {
          return data.task;
        });
      }
    });
    boardChannel.bind(`task:moved`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        await Promise.all(
          data.lists.map((listId) => {
            return utils.task.getTasks.invalidate({ listId });
          })
        );
      }
    });
    boardChannel.bind(`task:deleted`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        utils.task.getTasks.setData({ listId: data.listId }, (oldData) => {
          const index = oldData.findIndex((task) => task.id === data.task.id);
          const newData = [...oldData];
          newData.splice(index, 1);
          return newData;
        });
      }
    });
    boardChannel.bind(`task-member:updated`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        await utils.task.getTask.invalidate({ taskId: data.task.id });
      }
    });
    boardChannel.bind(`board:update`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        await utils.board.getBoard.invalidate({ boardId: data.boardId });
      }
    });
    boardChannel.bind(`list:update`, async (data) => {
      if (session?.user.id && data.initiatorId !== session?.user.id) {
        await utils.task.getTasks.invalidate({ listId: data.listId });
      }
    });

    return () => {
      boardChannel.unbind_all();
      pusherClient.unsubscribe(`board-${boardId}`);
    };
  }, [boardId, session?.user.id]);

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

    let removed: Task | undefined;
    let prevRank: string;
    let nextRank: string;
    let newRank: string;

    // OPTIMISTIC UPDATE ------------ START
    // if different list
    if (source.droppableId !== destination.droppableId) {
      // remove task from old list
      utils.task.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        return prev;
      });
      // add task in new list
      utils.task.getTasks.setData(
        { listId: destination.droppableId },
        (prev) => {
          prevRank =
            destination.index > 0 ? prev[destination.index - 1].rank : "";
          removed && prev?.splice(destination.index, 0, removed);

          if (destination.index + 1 <= prev.length - 1) {
            nextRank = prev && prev[destination.index + 1].rank;
          }
          newRank = getNewRank({ prevRank, nextRank });
          prev[destination.index].rank = newRank;

          return prev;
        }
      );
    } else {
      utils.task.getTasks.setData({ listId: source.droppableId }, (prev) => {
        removed = prev?.splice(source.index, 1)[0];
        removed && prev?.splice(destination.index, 0, removed);
        prevRank =
          destination.index > 0 ? prev && prev[destination.index - 1].rank : "";
        // check if index is not out of bounds
        if (destination.index + 1 <= prev.length - 1) {
          nextRank = prev[destination.index + 1].rank;
        }
        newRank = getNewRank({ prevRank, nextRank });
        prev[destination.index].rank = newRank;
        return prev;
      });
    }

    // make api call to update task
    mutation.mutate({
      taskId: removed?.id || "",
      newListId: destination.droppableId,
      newRank: newRank || LexoRank.middle().toString(),
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
      <Head>
        <title>Taskflow | {board?.name}</title>
      </Head>
      <BoardBackground background={board?.background} />
      <BoardNavbar board={board} />
      {/* <BoardContextMenu board={board}> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Scrollbars>
          <AnimatePresence mode="wait">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    when: "beforeChildren",
                  },
                },
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex w-fit items-start gap-5 p-5  pt-20"
            >
              {board?.lists.map((list) => {
                return (
                  <TaskList
                    workspaceId={board.workspaceId}
                    key={list.id}
                    list={list}
                  />
                );
              })}
              <CreateList boardId={boardId || ""} />
            </motion.div>
          </AnimatePresence>
        </Scrollbars>
      </DragDropContext>
      {/* </BoardContextMenu> */}
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
        <div className="container relative mx-auto  flex flex-wrap items-center justify-between md:max-w-[90vw]">
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

          <Link
            href="/"
            // className="hidden  items-center md:flex"
            className="absolute left-[50%] hidden -translate-x-[50%] md:inline"
          >
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
