import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

import React from "react";
import { FiLogOut } from "react-icons/fi";

function LogoutConfirmationModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const router = useRouter();
  const finalRef = React.useRef();
  return (
    <Box>
      {children ? (
        <Box ref={finalRef} onClick={onOpen}>
          {children}
        </Box>
      ) : (
        <Button
          variant="outline"
          mt="3"
          ref={finalRef}
          onClick={onOpen}
          colorScheme="blackAlpha"
          color="black"
        >
          <HStack>
            <FiLogOut />
            <Text>Logout</Text>
          </HStack>
        </Button>
      )}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent rounded="xl">
          <ModalHeader>Logout Confirmation?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <Text fontWeight="semibold">
                Are you sure you want to log out of your account?
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} type="button" rounded="full" onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="red"
              type="submit"
              rounded="full"
              onClick={() => {
                signOut();
                router.push("/api/auth/signout");
              }}
            >
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default LogoutConfirmationModal;
