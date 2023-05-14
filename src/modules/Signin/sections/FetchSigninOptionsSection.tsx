import { useToast } from "@/hooks/use-toast";
import { Button } from "@/modules/ui/button";
import { type SigninOptions } from "@/pages/signin";
import { emailSchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { Field, Form, Formik, type FieldProps } from "formik";
import { LucideArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { motion } from "framer-motion";
export function FetchSigninOptionsSection({
  setSigninOptions,
}: {
  setSigninOptions: React.Dispatch<React.SetStateAction<SigninOptions | null>>;
}) {
  const { toast } = useToast();
  const utils = api.useContext();
  const [isLoading, setIsLoading] = useState(false);

  const fetchSigninOptions = useCallback(async (email: string) => {
    setIsLoading(true);
    await utils.authentication.fetchSigninOptions
      .fetch({ email: email })
      .then((data) => {
        setIsLoading(false);
        setSigninOptions(data);
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: error.message || "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
          // action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      });
  }, []);

  return (
    <motion.div>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={toFormikValidationSchema(emailSchema)}
        onSubmit={(values) => fetchSigninOptions(values.email)}
      >
        <Form className="space-y-4 md:space-y-6">
          <Field name="email">
            {({ field, meta }: FieldProps) => (
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5  text-neutral-900 focus:border-black focus:ring-black dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="name@company.com"
                  required
                  {...field}
                />
                {meta.touched && meta.error && (
                  <p className="ml-2 mt-2 text-sm text-red-500">{meta.error}</p>
                )}
              </div>
            )}
          </Field>
          <Button
            type="submit"
            className="text-md w-full"
            size="lg"
            LeftIcon={LucideArrowRight}
            isLoading={isLoading}
            loadingText="Please wait"
          >
            Next
          </Button>
        </Form>
      </Formik>
    </motion.div>
  );
}
