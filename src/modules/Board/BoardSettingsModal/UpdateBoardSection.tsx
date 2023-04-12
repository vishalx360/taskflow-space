import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
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
  currentBackground,
  UpdatelocalBackground,
}: {
  board: Board | null;
  currentBackground: MutableRefObject<string | undefined>;
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
      currentBackground.current = data.background;
      setIsOpen(false);
    },
  });

  return (
    <div className="mt-2">
      <p className="text-md mb-3 font-semibold text-neutral-500 dark:text-white">
        Board Name
      </p>

      <Formik
        initialValues={{
          name: board?.name || "",
          boardId: board?.id || "",
          background: board?.background || "",
        }}
        validationSchema={toFormikValidationSchema(UpdateBoardSchema)}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
      >
        <Form>
          <Field name="name">
            {({ field, form, meta }: FieldProps) => (
              <>
                {/* <label
                  htmlFor="name"
                  className="mt-3 mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                >
                  Board Name
                </label> */}
                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Board name"
                    {...field}
                    className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline-none focus:outline"
                  />
                </div>
                {meta.touched && meta.error && (
                  <p className="ml-2 mt-2 text-sm text-red-500">{meta.error}</p>
                )}
              </>
            )}
          </Field>

          <UpdateBoardBackgroundSection
            UpdatelocalBackground={UpdatelocalBackground}
          />
          <Field name="submit">
            {({ field, form, meta }: FieldProps) => (
              <div className="mt-5 ">
                <Button
                  isLoading={mutation.isLoading}
                  loadingText="Saving Changes..."
                  disabled={
                    !form.dirty || Object.keys(form.errors).length !== 0
                  }
                  type="submit"
                  className="w-full rounded-xl md:w-fit"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </Field>
        </Form>
      </Formik>
    </div>
  );
}

export default UpdateBoardSection;
