import { Box, Text } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import TaskModal from "./TaskModal";

export function TaskCard(props) {
  //   props.id

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box px="3" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskModal
        taskData={{ title: props.title, description: props.description }}
      >
        <Box
          maxW="300px"
          minW="270px"
          bg={props.active ? "#f0f0f0" : "white"}
          border={props.active && "2px"}
          style={{ rotate: props.active && "-1deg" }}
          borderStyle={props.active && "dotted"}
          borderColor="gray.200"
          rounded="xl"
          shadow="xl"
          py="3"
          px="4"
        >
          <Text fontSize="lg" fontWeight="bold">
            {props.title}
          </Text>
          {props.description && (
            <Text noOfLines={(1, 2)}>{props.description}</Text>
          )}
        </Box>
      </TaskModal>
    </Box>
  );
}

export function EmptyListCard(props) {
  // const { attributes, listeners, setNodeRef, transform, transition } =
  //   useSortable({ id: props.id || nanoid() });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // };
  return (
    <Box px="3">
      <Box
        maxW="300px"
        minW="270px"
        textAlign="center"
        // bg="white"
        // border={props.active && "2px"}
        // style={{ rotate: props.active && "-1deg" }}
        // borderStyle={props.active && "dotted"}
        // borderColor="gray.200"
        // rounded="xl"
        // shadow="xl"
        px="4"
      >
        <Text fontStyle="italic">No task added</Text>
      </Box>
    </Box>
  );
}
