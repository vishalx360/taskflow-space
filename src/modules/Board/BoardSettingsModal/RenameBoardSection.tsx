import { type Board } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { type Dispatch, type SetStateAction } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "~/utils/api";
import { UpdateBoardSchema } from "~/utils/ValidationSchema";
import PrimaryButton from "../../Global/PrimaryButton";
import Toast from "../../Global/Toast";

function RenameWorkspaceSection({
  board,
  setIsOpen,
}: {
  board: Board | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const utils = api.useContext();
  const mutation = api.board.updateBoard.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      await utils.board.getBoard
        .invalidate({ boardId: board?.id })
        .catch((err) => console.log(err));
      Toast({ content: "Board renamed successfully!", status: "success" });
      setIsOpen(false);
    },
  });

  return (
    <div className="mt-2">
      <p className="text-md font-semibold text-neutral-500 dark:text-white">
        Rename Board
      </p>

      <Formik
        initialValues={{
          name: board?.name || "",
          boardId: board?.id || "",
        }}
        validationSchema={toFormikValidationSchema(UpdateBoardSchema)}
        onSubmit={(values) => {
          console.log(values);
          mutation.mutate(values);
        }}
      >
        <Form>
          <Field name="name">
            {({ field, form, meta }: FieldProps) => (
              <>
                <label
                  htmlFor="name"
                  className="mt-3 mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                >
                  Board Name
                </label>
                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Board name"
                    {...field}
                    className="text-md  block w-full rounded-xl   p-3 text-neutral-800 transition-all focus:outline-none focus:outline"
                  />
                  <PrimaryButton
                    isLoading={mutation.isLoading}
                    loadingText="Renaming"
                    disabled={
                      field.value === board?.name ||
                      Object.keys(form.errors).length !== 0
                    }
                    type="submit"
                    className="rounded-xl"
                  >
                    Rename
                  </PrimaryButton>
                </div>
                {meta.touched && meta.error && (
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

export default RenameWorkspaceSection;
