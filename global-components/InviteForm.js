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

export function InviteForm() {
  function handelSubmit(data) {
    console.log(data);
  }
  return (
    <Box p="3" w="full">
      <Formik
        validationSchema={InviteFormVS}
        initialValues={{
          email: "",
        }}
        onSubmit={handelSubmit}
      >
        <Form>
          {/* email */}
          <Field name="email">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.email && form.touched.email}
                isRequired
              >
                <FormLabel>Please enter email to send invite.</FormLabel>
                <HStack>
                  <Input
                    {...field}
                    id="email"
                    type="text"
                    w="full"
                    variant="outline"
                    placeholder="Email Address"
                  />

                  <Button
                    variant="primary"
                    disabled={form.values.email === "" || form.errors.email}
                    type="submit"
                  >
                    Send Invite
                  </Button>
                </HStack>
                <FormErrorMessage px="3">{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Form>
      </Formik>
    </Box>
  );
}

const InviteFormVS = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});
