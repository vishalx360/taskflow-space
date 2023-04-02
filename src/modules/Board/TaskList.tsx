import { Menu, Transition } from "@headlessui/react";
import { type Board, type List, type Task } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import dynamic from "next/dynamic";
import { Fragment, memo, useRef } from "react";
import { BiDotsVerticalRounded, BiLoaderAlt } from "react-icons/bi";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "~/utils/api";
import {
  CreateListSchema,
  CreateTaskSchema,
  UpdateListSchema,
} from "~/utils/ValidationSchema";
import PrimaryButton from "../Global/PrimaryButton";
import Toast from "../Global/Toast";
import { EmptyListCard, TaskCard, TaskCardSkeleton } from "./TaskCard";

export const LIST_BG_COLOR = "#ebecf0";

const Droppable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Droppable;
    }),
  { ssr: false }
);

function TaskList({ list }: { list: List }) {
  const {
    data: Tasks,
    isLoading,
    isRefetching,
  } = api.board.getTasks.useQuery(
    { listId: list.id || "" },
    { enabled: Boolean(list.id), retry: false }
  );

  console.log("rerendering", list.name);

  if (isLoading) {
    return <TaskListSkeleton NumberOfTasks={10} />;
  }

  return (
    <Droppable droppableId={list.id}>
      {(provided) => (
        <div
          className="prevent-select relative h-fit max-h-[79vh] w-[300px] overflow-hidden  rounded-2xl bg-[#ebecf0] ring-black md:w-[320px]"
          key={`main:${list.name}`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl bg-[#ebecf0] px-3 pt-3 pb-2 text-black">
            <div className="relative flex items-center  ">
              <UpdateListName list={list} />
              <Transition
                show={isRefetching || isLoading}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-4">
                  <BiLoaderAlt className="h-5 w-5 animate-spin text-neutral-400" />
                </div>
              </Transition>
            </div>

            <ListActionMenu list={list} />
          </div>
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-0 max-h-[75vh] space-y-2 overflow-x-hidden overflow-y-scroll px-2"
          >
            {Tasks?.length !== 0 ? (
              Tasks?.map((task: Task, index: number) => (
                <TaskCard key={task.id} index={index} task={task} />
              ))
            ) : (
              <EmptyListCard />
            )}
            <div className="h-[130px]" />
          </div>
          <AddToListForm list={list} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
export default memo(TaskList);

export function AddToListForm({ list }: { list: List }) {
  // createTask mutation
  const utils = api.useContext();
  const mutation = api.board.createTask.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      await utils.board.getTasks
        .invalidate({ listId: list.id })
        .catch((err) => console.log(err));
    },
  });
  return (
    <div className="absolute bottom-0 z-10 w-full rounded-b-xl bg-[#ebecf0]  p-4 transition-all">
      <Formik
        initialValues={{ title: "", listId: list.id }}
        validationSchema={toFormikValidationSchema(CreateTaskSchema)}
        onSubmit={(values, { resetForm }) => {
          mutation.mutate(values);
          resetForm();
        }}
      >
        <Form>
          <div className="flex w-full items-center gap-2">
            <Field name="title">
              {({ field, form, meta }: FieldProps) => (
                <input
                  className="w-full flex-[10] rounded-xl border-2 border-gray-300/60 bg-transparent py-3 px-5 font-medium transition-all hover:border-b-2 hover:bg-white/50 focus:bg-white active:bg-white"
                  type="text"
                  placeholder="+ Add to list"
                  id="title"
                  required
                  {...field}
                />
              )}
            </Field>
            <Field name="submit">
              {({ form }: FieldProps) => (
                <Transition
                  show={form.dirty}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <PrimaryButton
                    isLoading={mutation.isLoading}
                    loadingText=" "
                    disabled={
                      Object.keys(form.errors).length !== 0 ||
                      mutation.isLoading
                    }
                    type="submit"
                    className="flex-[2] rounded-xl"
                    // LeftIcon={FaPlus}
                  >
                    Add
                  </PrimaryButton>
                </Transition>
              )}
            </Field>
          </div>
          <Field name="title">
            {({ form, meta }: FieldProps) => (
              <>
                {form.dirty && meta.touched && meta.error && (
                  <p className="mt-2 ml-2 text-sm text-red-500">{meta.error}</p>
                )}
              </>
            )}
          </Field>
        </Form>
      </Formik>
    </div>
  );
}

export function ListActionMenu({ list }: { list: List }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center rounded-md bg-neutral-100 bg-opacity-30  p-2 text-sm font-medium text-white transition-opacity hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-opacity-75">
          <BiDotsVerticalRounded
            className="h-5 w-5 text-black"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ close }) => (
                <DeleteListButton closeMenu={close} list={list} />
              )}
            </Menu.Item>
            <Menu.Item>
              {({ close }) => <ClearListButton closeMenu={close} list={list} />}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function UpdateListName({ list }: { list: List }) {
  const InputRef = useRef(null);
  const mutation = api.board.updateList.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: () => {
      Toast({ content: "List renamed successfully!", status: "success" });
      InputRef?.current?.blur();
    },
  });

  return (
    <Formik
      initialValues={{ name: list.name, listId: list.id }}
      validationSchema={toFormikValidationSchema(UpdateListSchema)}
      onSubmit={(values, {}) => {
        mutation.mutate(values);
      }}
    >
      <Form>
        <Field name="name">
          {({ field, form, meta }: FieldProps) => (
            <input
              ref={InputRef}
              className="border-neutral-400 bg-transparent px-2 pb-1 font-bold outline-none hover:border-b-2 focus:border-b-2 active:border-none"
              {...field}
            />
          )}
        </Field>
      </Form>
    </Formik>
  );
}

export function CreateList({ boardId }: { boardId: string }) {
  const utils = api.useContext();

  const mutation = api.board.createList.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: (newList) => {
      utils.board.getBoard.setData({ boardId }, (prev) => {
        return { ...prev, lists: [...prev.lists, newList] };
      });
      // Toast({ content: "List Created successfully!", status: "success" });
    },
  });

  return (
    <div className="pr-10">
      <div className="h-fit min-w-[310px] rounded-xl border-2 bg-white/90">
        <div className="sticky bottom-0 z-10 rounded-b-xl p-1">
          <Formik
            initialValues={{ name: "", boardId: boardId }}
            validationSchema={toFormikValidationSchema(CreateListSchema)}
            onSubmit={(values, { resetForm }) => {
              mutation.mutate(values);
              resetForm();
            }}
          >
            <Form>
              <div className="flex w-full max-w-[310px] items-center gap-2">
                <Field name="name">
                  {({ field, form, meta }: FieldProps) => (
                    <input
                      className="w-full flex-[10] rounded-xl border-2 border-gray-300/60 bg-transparent py-3 px-5 font-medium transition-all hover:border-b-2 hover:bg-white/50 focus:bg-white active:bg-white"
                      type="text"
                      placeholder="+ Create a new list"
                      id="name"
                      required
                      {...field}
                    />
                  )}
                </Field>
                <Field name="submit">
                  {({ form }: FieldProps) => (
                    <Transition
                      show={form.dirty}
                      enter="transition-opacity duration-75"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity duration-150"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <PrimaryButton
                        isLoading={mutation.isLoading}
                        loadingText=" "
                        disabled={
                          Object.keys(form.errors).length !== 0 ||
                          mutation.isLoading
                        }
                        type="submit"
                        className="flex-[2] rounded-xl"
                        // LeftIcon={FaPlus}
                      >
                        Create
                      </PrimaryButton>
                    </Transition>
                  )}
                </Field>
              </div>
              <Field name="name">
                {({ form, meta }: FieldProps) => (
                  <Transition
                    show={form.dirty && meta.touched && Boolean(meta.error)}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <p className="mt-2 ml-2 text-sm text-red-500">
                      {meta.error}
                    </p>
                  </Transition>
                )}
              </Field>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export function TaskListSkeleton({ NumberOfTasks }: { NumberOfTasks: number }) {
  const Tasks = [];
  for (let i = 0; i < NumberOfTasks; i++) {
    Tasks.push(<TaskCardSkeleton />);
  }
  return (
    <div className="relative h-fit max-h-[79vh] w-[350px] animate-pulse   rounded-2xl  bg-gray-300 ring-black md:w-[320px]">
      <div className="mt-0  space-y-2 p-4">
        <div className=" mb-5 w-28 rounded-xl bg-gray-400/50 p-4" />
        {Tasks}
      </div>
    </div>
  );
}

function DeleteListButton({
  closeMenu,
  list,
}: {
  closeMenu: () => void;
  list: List;
}) {
  const utils = api.useContext();

  const mutation = api.board.deleteList.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
      closeMenu();
    },
    onSuccess: () => {
      utils.board.getBoard.setData({ boardId: list.boardId }, (prev: Board) => {
        return {
          ...prev,
          lists: prev.lists.filter((oldList) => oldList.id !== list.id),
        };
      });
      closeMenu();
    },
  });
  return (
    <button
      disabled={mutation.isLoading}
      onClick={() => {
        mutation.mutate({ listId: list.id });
      }}
      className="flex w-full items-center rounded-md bg-white px-2 py-2 text-sm text-black hover:bg-red-100"
    >
      Delete list
    </button>
  );
}

function ClearListButton({
  closeMenu,
  list,
}: {
  closeMenu: () => void;
  list: List;
}) {
  const utils = api.useContext();

  const mutation = api.board.clearList.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
      closeMenu();
    },
    onSuccess: () => {
      utils.board.getTasks.setData({ listId: list.id }, []);
      closeMenu();
    },
  });
  return (
    <button
      disabled={mutation.isLoading}
      onClick={() => {
        mutation.mutate({ listId: list.id });
      }}
      className="flex w-full items-center rounded-md bg-white px-2 py-2 text-sm text-black hover:bg-red-100"
    >
      Clear list
    </button>
  );
}
