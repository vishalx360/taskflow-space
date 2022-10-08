import { CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
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
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent rounded="xl">
          <ModalHeader>
            {(taskData && taskData.title) || "Task Title"}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody minH={"300px"} pb="5">
            {(taskData && taskData.description) || "Task Description"}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
