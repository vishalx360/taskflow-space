import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { api } from "@/utils/api";
import { type Board } from "@prisma/client";
import { Field, Form, Formik, type FieldProps } from "formik";
import { useRouter } from "next/router";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

function DeleteBoardSection({
  board,
  closeModal,
}: {
  board: Board;
  closeModal: () => void;
}) {
  const router = useRouter();
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
      // redirect to dashboard
      await router.push("/dashboard");
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
                    loadingText="Deleting Board.."
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
