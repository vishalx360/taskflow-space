import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { MdMoreVert } from "react-icons/md";

function ListActionMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<MdMoreVert />}
        variant="outline"
      />
      <MenuList>
        <MenuItem icon={<AddIcon />} command="⌘T">
          New Tab
        </MenuItem>
        <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
          New Window
        </MenuItem>
        <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
          Open Closed Tab
        </MenuItem>
        <MenuItem icon={<EditIcon />} command="⌘O">
          Open File...
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
export default ListActionMenu;
