import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { FiLayout, FiLogOut } from "react-icons/fi";
import { MdSettings, MdSettingsRemote } from "react-icons/md";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const Links = ["Boards", "Workspaces"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <>
      <Box
        bg={useColorModeValue("blackAlpha.200", "blackAlpha.800")}
        color={useColorModeValue("blackAlpha.800", "blackAlpha.200")}
      >
        <Flex gap="10" alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Center
            bg="blackAlpha.900"
            color="white"
            borderColor={"black"}
            px="10"
            py="2"
            roundedBottomRight="xl"
          >
            <Text fontStyle="italic" fontSize="2xl" fontWeight="bold">
              Vira
            </Text>
          </Center>
          <HStack w="full" spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex px="5" alignItems={"center"}>
            {!loading ? (
              <Menu>
                <MenuButton as={Button} pr="0" rounded="full">
                  <HStack spacing={5}>
                    <Text fontSize="1em" isTruncated maxW="xs">
                      {session.user.name}
                    </Text>
                    <Avatar
                      h="9"
                      w="9"
                      name={session.user.name}
                      src={session.user.image}
                    />
                  </HStack>
                </MenuButton>
                <MenuList roundedBottom="lg">
                  <NextLink href="/settings" passHref>
                    <MenuItem
                      fontSize="md"
                      icon={<MdSettings size="1.5em" />}
                      _hover={{ bg: "green.50" }}
                    >
                      <Link
                        href="/app/dashboard"
                        fontSize="md"
                        fontWeight={600}
                        rounded="none"
                        variant="ghost"
                        colorScheme="green"
                        as="span"
                      >
                        Settings
                      </Link>
                    </MenuItem>
                  </NextLink>
                  <Divider />

                  <LogoutConfirmationModal>
                    <MenuItem
                      fontSize="md"
                      icon={<FiLogOut size="1.5em" />}
                      _hover={{ bg: "red.50" }}
                    >
                      <Text
                        color="red.500"
                        fontSize="md"
                        fontWeight={600}
                        rounded="none"
                        variant="ghost"
                        colorScheme="green"
                        as="span"
                      >
                        Logout
                      </Text>
                    </MenuItem>
                  </LogoutConfirmationModal>
                </MenuList>
              </Menu>
            ) : null}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
