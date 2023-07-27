import { type Board } from "@prisma/client";
import { Field, type FieldProps, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";

function DeleteBoardSection({
  board,
  closeModal,
}: {
  board: Board;
  closeModal: () => void;
}) {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();
  const mutation = api.board.deleteBoard.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },

    onSuccess: async () => {
      toast({ title: "Board deleted successfully!" });
      // remove board from cache
      utils.board.getAllBoards.setData(
        { workspaceId: board?.workspaceId },
        (prev) => {
          if (prev) {
            return prev.filter((currentBoard) => {
              return currentBoard.id !== board?.id;
            });
          }
          return prev;
        }
      );
      // remove board from recent if it exists
      utils.board.getRecentBoards.setData(undefined, (prev) => {
        if (prev) {
          return prev.filter((currentBoard) => {
            return currentBoard.id !== board?.id;
          });
        }
        return prev;
      });
      // redirect to dashboard
      if (router.pathname !== "/dashboard") await router.push("/dashboard");
      closeModal();
    },
  });

  return (
    <div className="space-y-3">
      <p className="">
        By deleting this board it will delete all the lists as well as all the
        tasks it contains.
      </p>
      <Formik
        initialValues={{
          confirmation: "",
          boardId: board.id,
        }}
        validationSchema={toFormikValidationSchema(
          z.object({
            confirmation: z.literal(`${board.name}`),
            boardId: z.string(),
          })
        )}
        onSubmit={() => {
          mutation.mutate({ boardId: board.id });
        }}
      >
        <Form>
          <Field name="confirmation">
            {({ field, form, meta }: FieldProps) => (
              <>
                <label
                  htmlFor="confirmation"
                  className="text-md mb-2 block font-normal text-neutral-500 dark:text-white"
                >
                  Please type board name
                  <span className="px-2 font-bold">{board.name}</span>
                  to confirm deletion.
                </label>

                <div className="flex flex-row items-center justify-center gap-2">
                  <input
                    type="text"
                    id="confirmation"
                    required
                    placeholder="board name"
                    {...field}
                    className="text-md  block w-full rounded-xl   p-2.5 text-neutral-800 transition-all focus:outline-none focus:outline"
                  />
                  <Button
                    isLoading={mutation.isLoading}
                    disabled={
                      !form.dirty || Object.keys(form.errors).length !== 0
                    }
                    loadingText="Deleting.."
                    variant="destructiveOutline"
                  >
                    Delete
                  </Button>
                </div>
                {meta.touched && meta.error && (
                  <p className="ml-2 mt-2 text-sm text-red-500">{meta.error}</p>
                )}
              </>
            )}
          </Field>
        </Form>
      </Formik>
    </div>
  );
}

export default DeleteBoardSection;
