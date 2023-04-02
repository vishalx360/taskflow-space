import { type Board } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "~/utils/api";
import { UpdateBoardSchema } from "~/utils/ValidationSchema";
import PrimaryButton from "../../Global/PrimaryButton";
import Toast from "../../Global/Toast";
import UpdateBoardBackgroundSection from "./UpdateBoardBackgroundSection";

function UpdateWorkspaceSection({
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
  const mutation = api.board.updateBoard.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async (data) => {
      await utils.board.getBoard
        .invalidate({ boardId: board?.id })
        .catch((err) => console.log(err));
      Toast({ content: "Board updated successfully!", status: "success" });
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
                  <p className="mt-2 ml-2 text-sm text-red-500">{meta.error}</p>
                )}
              </>
            )}
          </Field>

          <UpdateBoardBackgroundSection
            UpdatelocalBackground={UpdatelocalBackground}
            board={board}
          />
          <Field name="submit">
            {({ field, form, meta }: FieldProps) => (
              <div className="mt-5 flex items-center justify-start gap-5">
                <PrimaryButton
                  isLoading={mutation.isLoading}
                  loadingText="Saving Changes..."
                  disabled={
                    !form.dirty || Object.keys(form.errors).length !== 0
                  }
                  type="submit"
                  className="rounded-xl"
                >
                  Save Changes
                </PrimaryButton>
              </div>
            )}
          </Field>
        </Form>
      </Formik>
    </div>
  );
}

export default UpdateWorkspaceSection;
