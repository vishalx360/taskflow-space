import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
} from "@chakra-ui/react";
import * as Yup from "yup";

import { Field, Form, Formik } from "formik";

export function AddListForm() {
  return (
    <>
      <Formik
        validationSchema={AddNewListVS}
        initialValues={{
          newListName: "",
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Form>
          {/* newListName */}
          <Field name="newListName">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.newListName && form.touched.newListName}
                isRequired
              >
                <HStack w="full" px="2">
                  <Input
                    {...field}
                    id="newListName"
                    type="text"
                    colorScheme="orange"
                    w="full"
                    variant="filled"
                    placeholder="Add new list"
                  />
                  <Button
                    colorScheme="orange"
                    variant={"ghost"}
                    disabled={form.values.newListName === ""}
                    type="submit"
                  >
                    +
                  </Button>
                </HStack>
                <FormErrorMessage px="2">
                  {form.errors.newListName}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Form>
      </Formik>
    </>
  );
}

const AddNewListVS = Yup.object().shape({
  newListName: Yup.string().max(50, "Max Character Limit Reached").required(""),
});
