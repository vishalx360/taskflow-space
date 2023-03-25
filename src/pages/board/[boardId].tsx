import dynamic from "next/dynamic";
import { type DropResult } from "react-beautiful-dnd";

import { type Board, type Task } from "@prisma/client";
import Error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getGravatarUrl } from "react-awesome-gravatar";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiArrowLeft } from "react-icons/fi";
import BoardSettingsModal from "~/modules/Board/BoardSettingsModal/BoardSettingsModal";
import TaskList, { CreateList } from "~/modules/Board/TaskList";
import { GravtarOption } from "~/modules/Global/DashboardNavbar";
import Toast from "~/modules/Global/Toast";
import { api } from "~/utils/api";

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);

function BoardPage() {
  const boardId = useSearchParams().get("boardId");
  // fetch board details from boardId.
  const utils = api.useContext();
  const { data: board, isLoading } = api.board.getBoard.useQuery(
    { boardId: boardId || "" },
    { enabled: Boolean(boardId), retry: false }
  );

  const mutation = api.board.moveTask.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: (listsToUpdate) => {
      listsToUpdate[0] &&
        utils.board.getTasks.invalidate({ listId: listsToUpdate[0] });
      listsToUpdate[1] &&
        utils.board.getTasks.invalidate({ listId: listsToUpdate[1] });

      Toast({ content: "Task Moved!", status: "success" });
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
          Toast({ content: "prev.len:" + prev?.length, status: "success" });
          // todo lookout for edge cases
          newPrevTaskId =
            destination.index > 0 ? prev[destination.index - 1].id : null;
          removed && prev?.splice(destination.index, 0, removed);
          // check if index is not out of bounds
          Toast({ content: "prev.len:" + prev?.length, status: "success" });
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
        // Toast({
        //   content: ` ${
        //     newPrevTaskId ? prev[destination.index - 1]?.rank : "null"
        //   } -> ${destination.index} -> ${
        //     newNextTaskId ? prev[destination.index + 1].rank : "null"
        //   }`,
        //   status: "warning",
        // });

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
      <div className="fixed top-0 left-0 h-full w-screen">
        <Image className="" alt="background" fill src="/board_bg.jpg" />
      </div>
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

export default BoardPage;

function BoardNavbar({ board }: { board: Board }) {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-black/20 px-4 py-3 text-white shadow sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-5 rounded-full border-2 border-neutral-400 p-2 transition duration-200 ease-in-out hover:bg-neutral-300/20 hover:text-white"
          >
            <FiArrowLeft className="text-xl" />
          </Link>
          <span className="self-center whitespace-nowrap text-xl font-semibold italic text-white">
            {board?.name}
          </span>
        </div>
        <Link href="/dashboard" className="flex items-center">
          <span className="self-center whitespace-nowrap text-3xl font-semibold italic text-white">
            VIRA
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <MembersAvatars members={board?.members} />
          <BoardSettingsModal board={board} />
        </div>
      </div>
    </nav>
  );
}

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
          return (
            <Image
              key={member?.email}
              height={20}
              width={20}
              className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
              src={
                member?.image ||
                (member.email && getGravatarUrl(member.email, GravtarOption)) ||
                getGravatarUrl("default", GravtarOption)
              }
              alt=""
            />
          );
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
