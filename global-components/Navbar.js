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
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
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
            borderRight="2px"
            borderBottom="2px"
            px="10"
            py="2"
            roundedBottomRight="xl"
          >
            <Text fontSize="2xl" fontWeight="bold">
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
                <MenuButton as={Button} p="0" rounded="full">
                  <Box>
                    <Avatar
                      h="9"
                      w="9"
                      name={session.user.name}
                      src={session.user.image}
                    />
                  </Box>
                </MenuButton>
                <MenuList roundedBottom="lg">
                  <Box px="6">
                    <Text>Signed in as </Text>

                    <Heading fontSize="1em" isTruncated maxW="xs">
                      {session.user.name}
                    </Heading>
                  </Box>
                  <MenuDivider />

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
