import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import * as Yup from "yup";

import { Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Field, Form, Formik } from "formik";
import { TaskCard } from "global-components/TaskCard";

const LIST_BG_COLOR = "#ebecf0";

export function TaskList({ list, items = [] }) {
  const { setNodeRef } = useDroppable({
    list,
  });
  console.log("rerendering", list);

  return (
    <Stack key={"main:" + list} spacing="0">
      <Box
        pt="3"
        bg={LIST_BG_COLOR}
        zIndex={10}
        position="sticky"
        roundedTop="xl"
        top="0"
      >
        <Text px="5" pb="2" fontWeight="bold">
          {list}
        </Text>
      </Box>
      <Box position="relative" key={list} bg={LIST_BG_COLOR} pb="3" px="3">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Stack
            className="taskList"
            overflowY="scroll"
            maxH="75vh"
            ref={setNodeRef}
          >
            {items.map((item) => (
              <TaskCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
              />
            ))}
          </Stack>
        </SortableContext>
      </Box>
      <Box
        pb="3"
        bg={LIST_BG_COLOR}
        zIndex={10}
        position="sticky"
        roundedBottom="xl"
        bottom="0"
      >
        <AddToListForm list={list} />
      </Box>
    </Stack>
  );
}

function AddToListForm({ list }) {
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
                    colorScheme="orange"
                    w="full"
                    variant="filled"
                    placeholder="Add new task"
                  />
                  <Button
                    colorScheme="orange"
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
