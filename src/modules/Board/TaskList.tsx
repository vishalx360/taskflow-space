import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Transition } from "@headlessui/react";
import { type List } from "@prisma/client";
import { Field, type FieldProps, Form, Formik } from "formik";
import { memo } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "~/utils/api";
import { CreateTaskSchema } from "~/utils/ValidationSchema";
import PrimaryButton from "../Global/PrimaryButton";
import Toast from "../Global/Toast";
import { EmptyListCard, TaskCard } from "./TaskCard";
// import { AddToListForm } from "./AddToListForm";
// import ListActionMenu from "./ListActionMenu";

export const LIST_BG_COLOR = "#ebecf0";

function TaskList({ list }: { list: List }) {
  const { data: Tasks, isLoading } = api.board.getTasks.useQuery(
    { listId: list.id || "" },
    { enabled: Boolean(list.id), retry: false }
  );

  console.log("rerendering", list.name);
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
                <TaskCard key={task.id} id={task.id} task={task} />
              ))
            ) : (
              <EmptyListCard />
            )}
          </div>
        </SortableContext>
      </div>
      <AddToListForm list={list} />
    </div>
  );
}

function AddToListForm({ list }: { list: List }) {
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
      Toast({ content: "TEMP:Added Task Successfully", status: "success" });
    },
  });
  return (
    <div className="sticky bottom-0 z-10 rounded-b-xl p-2">
      <Formik
        initialValues={{ title: "", listId: list.id }}
        validationSchema={toFormikValidationSchema(CreateTaskSchema)}
        onSubmit={(values, { resetForm }) => {
          mutation.mutate(values);
          resetForm();
        }}
      >
        <Form>
          <div className="flex w-full max-w-[320px] items-center gap-2">
            <Field name="title">
              {({ field, form, meta }: FieldProps) => (
                <input
                  className="w-full flex-[10] rounded-xl border-gray-200 bg-white py-3 px-5"
                  type="text"
                  placeholder="Add to list"
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

export default memo(TaskList);
