import { CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiMaximize2 } from "react-icons/fi";

export default function TaskModal({ children, taskData, ...rest }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();
  const finalRef = useRef();

  return (
    <>
      {children ? (
        <Box cursor="pointer" onClick={onOpen} {...rest}>
          {children}
        </Box>
      ) : (
        <Button leftIcon={<FiMaximize2 />} onClick={onOpen} {...rest}>
          Open
        </Button>
      )}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="2xl"
        isOpen={isOpen}
        isCentered
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent border="2px" rounded="xl">
          <ModalHeader>
            {(taskData && taskData.title) || "Task Title"}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody minH={"300px"} pb="5">
            <HStack mb="5">
              <Avatar
                key={"avatar.name"}
                name={"vkasdsw"}
                src={"avatar.name"}
                size={"sm"}
              />
              <Text>{taskData.assignedTo || "Assigned To"}</Text>
            </HStack>
            <Text>
              {(taskData && taskData.description) || "Task Description"}
            </Text>
            <Button variant={"primary"}>Mark As Done</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
