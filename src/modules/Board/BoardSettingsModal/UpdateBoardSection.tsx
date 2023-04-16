import { useToast } from "@/hooks/use-toast";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Textarea } from "@/modules/ui/text-area";
import { UpdateBoardSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { type Board } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import UpdateBoardBackgroundSection from "./UpdateBoardBackgroundSection";

function UpdateBoardSection({
  board,
  setIsOpen,
  originalBgRef,
  UpdatelocalBackground,
}: {
  board: Board | null;
  originalBgRef: MutableRefObject<string | undefined>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  UpdatelocalBackground: (background: string) => void;
}) {
  const utils = api.useContext();
  const { toast } = useToast();
  const mutation = api.board.updateBoard.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async (data) => {
      await utils.board.getBoard
        .invalidate({ boardId: board?.id })
        .catch((err) => console.log(err));
      toast({ title: "Board updated successfully!" });
      originalBgRef.current = data.background;
      setIsOpen(false);
    },
  });

  return (
    <Formik
      initialValues={{
        name: board?.name || "",
        description: board?.description || "",
        boardId: board?.id || "",
        background: board?.background || "",
      }}
      validationSchema={toFormikValidationSchema(UpdateBoardSchema)}
      onSubmit={(values) => {
        mutation.mutate(values);
      }}
    >
      <Form>
        <AccordionItem value="board-details">
          <AccordionTrigger className="px-2">Board details</AccordionTrigger>
          <AccordionContent className="p-1">
            <Field name="name">
              {({ field, form, meta }: FieldProps) => (
                <>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                  >
                    Board name
                  </label>

                  <div className="flex flex-row items-center justify-center gap-2">
                    <Input
                      type="text"
                      id="name"
                      required
                      placeholder="Board name"
                      {...field}
                    />
                  </div>
                  {meta.touched && meta.error && (
                    <p className="ml-2 mt-2 text-sm text-red-500">
                      {meta.error}
                    </p>
                  )}
                </>
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
          <AccordionTrigger className="px-2">Board backgorund</AccordionTrigger>
          <AccordionContent className="p-1">
            <UpdateBoardBackgroundSection
              UpdatelocalBackground={UpdatelocalBackground}
            />
          </AccordionContent>
        </AccordionItem>

        <Field name="submit">
          {({ field, form, meta }: FieldProps) => (
            <div className="mt-5 ">
              <Button
                isLoading={mutation.isLoading}
                loadingText="Saving Changes..."
                disabled={!form.dirty || Object.keys(form.errors).length !== 0}
                type="submit"
                className="w-full rounded-xl "
              >
                Save Changes
              </Button>
            </div>
          )}
        </Field>
      </Form>
    </Formik>
  );
}

export default UpdateBoardSection;
