import {
  Box,
  Divider,
  Grid,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { RESTDATA } from "@constants/RESTapi";
import { sub } from "date-fns";
import geopattern from "geopattern";
import { nanoid } from "nanoid";
import TimeAgo from "react-timeago";
import BoardPreview from "./BoardPreview";

console.log(RESTDATA);

function Workspace({ name, _id }) {
  // TODO: fetch all boards and render BoardPreview
  return (
    <Box p="10">
      <Divider mb="5" h="1px" />
      <Text mb="5" fontSize="xl" fontWeight="bold">
        {name}
      </Text>
      <Wrap>
        {RESTDATA.Boards.map((board) => {
          return <BoardPreview board={board} />;
        })}
      </Wrap>
    </Box>
  );
}

export default Workspace;
