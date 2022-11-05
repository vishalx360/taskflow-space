import {
  AddIcon,
  DeleteIcon,
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
        <MenuItem color="red" icon={<DeleteIcon />}>
          Delete List
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
export default ListActionMenu;
