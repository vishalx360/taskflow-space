import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
} from "@chakra-ui/react";
import * as Yup from "yup";

import { Field, Form, Formik } from "formik";

export function AddToListForm({ list }) {
  return (
    <>
      <Formik
        validationSchema={AddNewTaskVS}
        initialValues={{
          newTaskTitle: "",
          list: list,
        }}
        onSubmit={(values) => {
          console.log({
            id: "DB ID",
            rank: "calculate lastRank in this list and find next",
            title: values.newTaskTitle,
            list: values.list,
          });
        }}
      >
        <Form>
          {/* newTaskTitle */}
          <Field name="newTaskTitle">
            {({ field, form }) => (
              <FormControl
                isInvalid={
                  form.errors.newTaskTitle && form.touched.newTaskTitle
                }
                isRequired
              >
                <HStack w="full" px="2">
                  <Input
                    {...field}
                    id="newTaskTitle"
                    type="text"
                    w="full"
                    variant="outline"
                    placeholder="Add new task"
                  />
                  <Button
                    variant={"ghost"}
                    disabled={form.values.newTaskTitle === ""}
                    type="submit"
                  >
                    +
                  </Button>
                </HStack>
                <FormErrorMessage px="2">
                  {form.errors.newTaskTitle}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Form>
      </Formik>
    </>
  );
}

const AddNewTaskVS = Yup.object().shape({
  newTaskTitle: Yup.string()
    .max(200, "Max Character Limit Reached")
    .required(""),
  list: Yup.string().required(""),
});
