import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import * as Yup from "yup";

import { Field, Form, Formik } from "formik";

export function AddListForm({ setLists }) {
  function handelSubmit(data, x) {
    // make network call to create new list.
    // optimistic update
    setLists((prev) => {
      // if same name already exists
      if (prev.indexOf(data.newListName) !== -1) {
        x.setFieldError("newListName", "A list already exist with this name.");
        return prev;
      }
      x.resetForm();
      return [...prev, data.newListName];
    });
  }
  return (
    <Box p="3" w="full">
      <Formik
        validationSchema={AddNewListVS}
        initialValues={{
          newListName: "",
        }}
        onSubmit={handelSubmit}
      >
        <Form>
          {/* newListName */}
          <Field name="newListName">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.newListName && form.touched.newListName}
                isRequired
              >
                {/* <FormLabel>Add new list</FormLabel> */}
                <HStack>
                  <Input
                    {...field}
                    id="newListName"
                    type="text"
                    colorScheme="orange"
                    w="full"
                    variant="outline"
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
                <FormErrorMessage px="3">
                  {form.errors.newListName}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Form>
      </Formik>
    </Box>
  );
}

const AddNewListVS = Yup.object().shape({
  newListName: Yup.string().max(50, "Max Character Limit Reached").required(""),
});
