import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { api } from "@/utils/api";
import { CreateNewBoardSchema } from "@/utils/ValidationSchema";
import geopattern from "geopattern";
import random from "lodash.random";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { Field, Form, Formik, type FieldProps } from "formik";
import { Plus, RefreshCcw, Table2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { toFormikValidationSchema } from "zod-formik-adapter";
import UpdateBoardBackgroundSection from "../Board/BoardSettingsModal/UpdateBoardBackgroundSection";
import { Button } from "../ui/button";

import Backgrounds from "../../utils/BoardBackgrounds.json";
import { Input } from "../ui/input";
import { Textarea } from "../ui/text-area";

import Image from "next/image";
import { generateSlug, type RandomWordOptions } from "random-word-slugs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";
import { motion } from "framer-motion";
import { BoardBoxMotionVariants } from "./BoardBox";

const slugOption: RandomWordOptions<2> = {
  format: "title",
  categories: {
    noun: ["time", "business", "thing", "technology"],
    adjective: ["color", "time", "quantity", "size", "sounds", "taste"],
  },
  partsOfSpeech: ["adjective", "noun"],
};

const GetRandomBackgroundGradient = () => {
  const background =
    Backgrounds["gradients"][random(0, Backgrounds["gradients"].length - 1)];
  if (background) {
    return `gradient:${background}`;
  } else {
    return;
  }
};
const getWorkspaceName = (workspaceId, workspaces) => {
  const workspace = workspaces?.find(
    (workspace) => workspace.id === workspaceId
  );
  return workspace?.name;
};

export default function CreateNewBoardModal({
  children,
  workspaceId,
}: {
  children?: ReactNode;
  workspaceId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const initailFocusRef = useRef(null);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal(e) {
    e.stopPropagation();
    setIsOpen(true);
  }

  const utils = api.useContext();
  const { toast } = useToast();
  const { data: workspaces } = api.workspace.getAllWorkspace.useQuery();

  const mutation = api.board.createNewBoard.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async (newBoard) => {
      utils.board.getAllBoards.setData(
        { workspaceId: newBoard.workspaceId },
        (oldData) => [...oldData, newBoard]
      );
      toast({ title: "New board created successfully!" });
      setIsOpen(false);
    },
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            <button className="w-full" onClick={openModal}>
              {children}
            </button>
          ) : (
            <motion.button
              key={"createboard"}
              variants={BoardBoxMotionVariants}
              onClick={openModal}
              className="relative  flex h-full w-full items-center rounded-xl border border-neutral-300 p-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200/50 hover:ring-2  md:h-40 md:w-[15rem] md:text-lg lg:w-[18rem]"
            >
              <div className="flex w-full items-center justify-center gap-3">
                <FaPlusCircle />
                <h2>New board</h2>
              </div>
            </motion.button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4 font-medium">
              <Table2 />
              Create new board
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 text-left">
            <Formik
              initialValues={{
                name: generateSlug(2, slugOption),
                description: "",
                workspaceId: workspaceId || "",
                background: GetRandomBackgroundGradient(),
              }}
              validationSchema={toFormikValidationSchema(CreateNewBoardSchema)}
              onSubmit={(values) => {
                mutation.mutate(values);
              }}
            >
              <Form>
                <Field name="name">
                  {({ form, meta }: FieldProps) => (
                    <div className="mb-5 flex items-center justify-center">
                      <div
                        className={`group relative w-full overflow-hidden rounded-xl  transition-all  hover:shadow-xl md:w-fit`}
                      >
                        <div
                          className={`h-28 w-full overflow-hidden rounded-xl transition-all group-hover:scale-110 md:h-40 md:w-[15rem] lg:w-[18rem]`}
                        >
                          {form.values?.background &&
                            form.values?.background.startsWith(
                              "wallpaper:"
                            ) && (
                              <Image
                                className="h-30 w-full overflow-hidden rounded-xl object-cover md:h-40 md:w-[18rem]"
                                alt="background"
                                fill
                                src={form.values?.background.slice(10)}
                              />
                            )}
                          {form.values?.background &&
                            form.values?.background.startsWith("gradient:") && (
                              <div
                                className="h-full w-full"
                                style={{
                                  backgroundImage:
                                    form.values?.background.slice(9),
                                }}
                              />
                            )}
                          {!form.values?.background && (
                            <Image
                              height="50"
                              width="150"
                              src={geopattern
                                .generate(form.values?.name)
                                .toDataUri()}
                              alt=""
                              className="h-28 w-full object-cover md:h-40 md:w-[18rem]"
                            />
                          )}
                        </div>

                        <div className="absolute bottom-0 flex h-full w-full items-end overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-t from-black to-black/20 p-3 text-sm font-medium  text-white md:p-5 md:text-lg ">
                          <div className="flex w-full flex-col items-start justify-between ">
                            <h2 className="font-medium">{form.values?.name}</h2>
                            <p className="mt-1 text-xs text-neutral-400">
                              {getWorkspaceName(
                                form.values?.workspaceId,
                                workspaces
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Field>
                <div className="flex flex-col gap-2 overflow-visible">
                  <Accordion
                    onFocusCapture={() => {
                      initailFocusRef?.current?.focus();
                    }}
                    type="single"
                    defaultValue="item-1"
                    collapsible
                  >
                    <AccordionItem className="px-2" value="item-1">
                      <AccordionTrigger>Basic details</AccordionTrigger>
                      <AccordionContent className="px-1">
                        <Field name="workspaceId">
                          {({ form, field, meta }: FieldProps) => (
                            <div className="mt-2">
                              <label
                                htmlFor="workspaceId"
                                className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                              >
                                Workspace
                              </label>
                              <Select
                                defaultValue="Select Workspace"
                                value={field.value}
                                onValueChange={(value) => {
                                  form.setFieldValue("workspaceId", value);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Workspace" />
                                </SelectTrigger>
                                <SelectContent>
                                  {workspaces?.map((workspace) => {
                                    if (
                                      workspace?.members[0]?.role !== "MEMBER"
                                    ) {
                                      return (
                                        <SelectItem
                                          key={workspace.id}
                                          value={workspace.id}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-sm uppercase  text-white">
                                              {workspace.name[0]}
                                            </div>
                                            <div>{workspace.name}</div>
                                          </div>
                                        </SelectItem>
                                      );
                                    }
                                  })}
                                </SelectContent>
                              </Select>

                              {meta.error && form.dirty && (
                                <p className="ml-2 mt-2 text-sm text-red-500">
                                  {meta.error}
                                </p>
                              )}
                            </div>
                          )}
                        </Field>

                        <Field name="name">
                          {({ form, field, meta }: FieldProps) => (
                            <div className="mt-5">
                              <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                              >
                                Board Name
                              </label>
                              <div className="flex gap-2">
                                <Input
                                  ref={initailFocusRef}
                                  type="text"
                                  id="name"
                                  required
                                  placeholder="Board name"
                                  {...field}
                                  // className="text-md  block w-full rounded-xl   p-2.5 text-neutral-800 transition-all focus:outline-none focus:outline"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    form.setFieldValue(
                                      "name",
                                      generateSlug(2, slugOption)
                                    );
                                  }}
                                  variant={"subtle"}
                                >
                                  <RefreshCcw size={"1.2em"} />
                                </Button>
                              </div>

                              {meta.touched && meta.error && (
                                <p className="ml-2 mt-2 text-sm text-red-500">
                                  {meta.error}
                                </p>
                              )}
                            </div>
                          )}
                        </Field>
                        <Field name="description">
                          {({ field, meta }: FieldProps) => (
                            <div className="mt-5">
                              <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                              >
                                Board description
                              </label>
                              <Textarea
                                id="description"
                                placeholder="Board description"
                                {...field}
                              />
                              {meta.touched && meta.error && (
                                <p className="ml-2 mt-2 text-sm text-red-500">
                                  {meta.error}
                                </p>
                              )}
                            </div>
                          )}
                        </Field>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem className="px-2" value="item-3">
                      <AccordionTrigger>Backgorund</AccordionTrigger>
                      <AccordionContent className="px-1">
                        <UpdateBoardBackgroundSection
                          UpdatelocalBackground={() => null}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Field name="submit">
                    {({ form }: FieldProps) => (
                      <Button
                        isLoading={mutation.isLoading}
                        loadingText="Creating new board"
                        disabled={
                          mutation.isLoading ||
                          Object.keys(form.errors).length !== 0
                        }
                        type="submit"
                        className="w-full"
                        LeftIcon={Plus}
                      >
                        Create new board
                      </Button>
                    )}
                  </Field>
                </div>
              </Form>
            </Formik>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
