import { useToast } from "@/hooks/use-toast";
import { CreateNewBoardSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import geopattern from "geopattern";
import random from "lodash.random";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { type Workspace } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { Plus, RefreshCcw, Table2 } from "lucide-react";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { toFormikValidationSchema } from "zod-formik-adapter";
import UpdateBoardBackgroundSection from "../Board/BoardSettingsModal/UpdateBoardBackgroundSection";
import { Button } from "../ui/button";

import Backgrounds from "../../utils/BoardBackgrounds.json";
import { Input } from "../ui/input";
import { Textarea } from "../ui/text-area";

import Image from "next/image";
import { RandomWordOptions, generateSlug } from "random-word-slugs";

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

export default function CreateNewBoardModal({
  children,
  workspace,
}: {
  children?: ReactNode;
  workspace: Workspace;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const initailFocusRef = useRef(null);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const defaultBackground = geopattern.generate(workspace.id).toDataUri();

  const utils = api.useContext();
  const { toast } = useToast();

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
        { workspaceId: workspace.id },
        (oldData) => [...oldData, newBoard]
      );
      toast({ title: "New board created successfully!" });
      setIsOpen(false);
    },
  });

  return (
    <>
      {children ? (
        <button className="w-full" onClick={openModal}>
          {children}
        </button>
      ) : (
        <button
          onClick={openModal}
          className="relative  flex h-full w-full items-center rounded-xl border border-neutral-300 p-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200/50 hover:ring-2  md:h-40 md:w-[18rem] md:text-lg"
        >
          <div className="flex w-full items-center justify-center gap-3">
            <FaPlusCircle />
            <h2>New board</h2>
          </div>
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          initialFocus={initailFocusRef}
          as="div"
          className="relative z-[80]"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex items-center justify-between gap-5 text-lg font-medium leading-6 text-gray-900 "
                  >
                    <div className="flex items-center gap-2">
                      <Table2 />
                      Create new board
                    </div>
                    <button
                      onClick={closeModal}
                      type="button"
                      className="rounded-lg p-2 text-xs text-inherit transition-all  hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
                      aria-controls="navbar-default"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Close Image Preview</span>
                      <FiX size="2em" />
                    </button>
                  </Dialog.Title>
                  <div className="mt-2">
                    <Formik
                      initialValues={{
                        name: generateSlug(2, slugOption),
                        description: "",
                        workspaceId: workspace.id,
                        background: GetRandomBackgroundGradient(),
                      }}
                      validationSchema={toFormikValidationSchema(
                        CreateNewBoardSchema
                      )}
                      onSubmit={(values) => {
                        mutation.mutate(values);
                      }}
                    >
                      <Form>
                        <div>
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
                                          src={form.values?.background.slice(
                                            10
                                          )}
                                        />
                                      )}
                                    {form.values?.background &&
                                      form.values?.background.startsWith(
                                        "gradient:"
                                      ) && (
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
                                        src={defaultBackground}
                                        alt=""
                                        className="h-28 w-full object-cover md:h-40 md:w-[18rem]"
                                      />
                                    )}
                                  </div>

                                  <div className="absolute bottom-0 flex h-full w-full items-end overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-t from-black to-black/20 p-3 text-sm font-medium  text-white md:p-5 md:text-lg ">
                                    <div className="flex w-full flex-col items-start justify-between ">
                                      <h2 className="font-medium">
                                        {form.values?.name}
                                      </h2>
                                      <p className="mt-1 text-xs text-neutral-400">
                                        {workspace.name}{" "}
                                        {!workspace.personal && " workspace"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Field>
                          {/* <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 p-4 text-sm uppercase  text-white md:h-10 md:w-10 md:text-xl">
                              {workspace.name[0]}
                            </div>
                            <span className=" text-start line-clamp-1">
                              {workspace.name}
                            </span>
                          </div> */}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Accordion
                            type="single"
                            defaultValue="item-1"
                            collapsible
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="px-2">
                                Basic details
                              </AccordionTrigger>
                              <AccordionContent className="p-1">
                                <Field name="name">
                                  {({ form, field, meta }: FieldProps) => (
                                    <div className="mt-2">
                                      <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                                      >
                                        Board Name
                                      </label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="text"
                                          id="name"
                                          ref={initailFocusRef}
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
                                              generateSlug(3, slugOption)
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

                            <AccordionItem value="item-3">
                              <AccordionTrigger className="px-2">
                                Backgorund
                              </AccordionTrigger>
                              <AccordionContent className="p-1">
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
