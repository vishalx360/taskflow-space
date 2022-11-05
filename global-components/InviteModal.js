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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiMaximize2, FiShare2 } from "react-icons/fi";
import { InviteForm } from "./InviteForm";

export default function InviteModal({ children, taskData, ...rest }) {
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
        <Button
          onClick={onOpen}
          leftIcon={<FiShare2 />}
          rounded="full"
          size="sm"
          {...rest}
        >
          Invite
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
          <ModalHeader>Invite others on this board</ModalHeader>

          <ModalCloseButton />
          <ModalBody minH={"300px"} pb="5">
            <InviteForm />
            <Stack p="3">
              <VStack>
                {[1, 2, 3, 4].map((x, i) => {
                  return (
                    <HStack w="full" justifyContent="space-between">
                      <HStack key={x}>
                        <Avatar
                          key={"avatar.name"}
                          name={"as" + (x * 22) / 5 + i}
                          // src={"avatar.name"}
                          size={"sm"}
                        />
                        <Text>user1@vira.com</Text>
                      </HStack>
                      <Tag>Admin</Tag>
                    </HStack>
                  );
                })}
              </VStack>
            </Stack>
          </ModalBody>
          {/* <ModalFooter p="2" bg="gray.200">
            Terms and Conditions
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}
