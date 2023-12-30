import { Transition } from "@headlessui/react";
import { type Task } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { Field, type FieldProps, Form, Formik } from "formik";
import { LucideUserPlus } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { MdDelete } from "react-icons/md";
import Timeago from "react-timeago";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { Button } from "@/modules/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover";
import { Textarea } from "@/modules/ui/text-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/ui/tooltip";
import { api } from "@/utils/api";
import getGravatar from "@/utils/getGravatar";
import { UpdateTaskSchema } from "@/utils/ValidationSchema";

import TaskMemberSelector from "./TaskMemberSelector";

export default function TaskModal({
  children,
  defaultTaskData,
  workspaceId,
}: {
  children: React.ReactNode;
  defaultTaskData: Task;
  workspaceId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const utils = api.useUtils();
  const { toast } = useToast();

  const { data: task } = api.task.getTask.useQuery(
    {
      taskId: defaultTaskData.id,
    },
    {
      enabled: isOpen,
      placeholderData: defaultTaskData,
      cacheTime: 1000,
    }
  );

  const UpdateMutation = api.task.updateTask.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      await utils.task.getTasks
        .invalidate({ listId: task?.listId })
        .catch((err) => console.log(err));
      await utils.task.getTask
        .invalidate({ taskId: task?.id })
        .catch((err) => console.log(err));
      toast({ title: "Task updated successfully!" });
      setIsOpen(false);
    },
  });
  const initialValues = {
    taskId: task?.id,
    title: task?.title,
    description: task?.description || "",
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            <div className="w-full" onClick={openModal}>
              {children}
            </div>
          ) : (
            <button
              type="button"
              onClick={openModal}
              className="rounded-md bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              Open Task Modal
            </button>
          )}
        </DialogTrigger>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(UpdateTaskSchema)}
            onSubmit={(values) => {
              UpdateMutation.mutate(values);
            }}
          >
            <Form>
              <DialogHeader>
                <DialogTitle className="pr-3 font-medium">
                  <Field name="title">
                    {({ field, meta }: FieldProps) => (
                      <div className="w-full">
                        <Textarea
                          id="title"
                          required
                          maxLength={100}
                          placeholder="Task title"
                          {...field}
                          className="w-full resize-none   border-gray-300 p-3 text-2xl text-neutral-800 outline-none transition-all focus:outline-none focus:outline focus:ring-0 active:ring-0"
                        />
                        {meta.touched && meta.error && (
                          <p className="ml-2 mt-2 text-sm text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </div>
                    )}
                  </Field>
                </DialogTitle>
              </DialogHeader>
              <div className="my-4 flex items-center gap-5 px-3">
                <div className="flex gap-1">
                  <TooltipProvider>
                    <div className="flex items-center -space-x-3">
                      {task?.members?.slice(0, 3)?.map((member) => {
                        return (
                          <Tooltip key={member?.userId}>
                            <TooltipTrigger
                              type="button"
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-6 w-6 border-2 sm:h-8 sm:w-8">
                                <AvatarImage
                                  src={
                                    member?.user?.image ||
                                    getGravatar(member?.user?.email)
                                  }
                                />
                                <AvatarFallback>
                                  {member?.user?.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              {member?.user?.name}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                    <Popover>
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          className="flex items-center gap-2"
                        >
                          <PopoverTrigger asChild>
                            <Button
                              className="rounded-full p-2"
                              variant="subtle"
                              size="sm"
                            >
                              <LucideUserPlus className="p-0.5" />
                            </Button>
                          </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Add Member</TooltipContent>
                      </Tooltip>

                      <PopoverContent className="w-fit">
                        <TaskMemberSelector
                          workspaceId={workspaceId}
                          task={task}
                        />
                      </PopoverContent>
                    </Popover>
                  </TooltipProvider>
                </div>

                <p className="text-sm text-gray-600">
                  {" "}
                  Created{" "}
                  {isSameDay(task?.createdAt, new Date()) ? (
                    <Timeago live={false} date={task?.createdAt} />
                  ) : (
                    task?.createdAt && format(new Date(task?.createdAt), "PPPP")
                  )}
                </p>
              </div>
              <Field name="description">
                {({ field, meta }: FieldProps) => (
                  <>
                    <Textarea
                      id="description"
                      placeholder="Task description"
                      {...field}
                      // className="text-md block h-52 w-full rounded-xl border-gray-300 p-3 text-neutral-800"
                      className="h-52 w-full border-gray-300   p-3 text-neutral-800 md:text-lg "
                      rows={8}
                    />
                    {meta.touched && meta.error && (
                      <p className="ml-2 mt-2 text-sm text-red-500">
                        {meta.error}
                      </p>
                    )}
                  </>
                )}
              </Field>

              <div className="mt-4 flex items-center justify-between">
                <DeleteTask task={task} setIsOpen={setIsOpen} />
                <Field name="submit">
                  {({ form }: FieldProps) => (
                    <>
                      <Transition
                        show={form.dirty}
                        enter="transition-opacity duration-75"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Button
                          isLoading={UpdateMutation.isLoading}
                          loadingText="Saving Changes..."
                          className="rounded-xl"
                        >
                          Save Changes
                        </Button>
                      </Transition>
                    </>
                  )}
                </Field>
              </div>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteTask({
  task,
  setIsOpen,
}: {
  task: Task;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = api.useUtils();
  const { toast } = useToast();

  const deleteMutation = api.task.deleteTask.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      // TODO: optimistically update the UI
      await utils.task.getTasks
        .invalidate({ listId: task.listId })
        .catch((err) => console.log(err));
      setIsOpen(false);
    },
  });
  return (
    <Button
      type="button"
      isLoading={deleteMutation.isLoading}
      onClick={() => deleteMutation.mutate({ taskId: task.id })}
      LeftIcon={MdDelete}
      loadingText="Deleting Task"
      variant="destructiveOutline"
    >
      Delete Task
    </Button>
  );
}
