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

function BoardPreview({ board }) {
  return (
    <WrapItem key={board.id}>
      <LinkBox
        w="300px"
        h="150px"
        bgImage={geopattern.generate(board.id).toDataUri()}
        rounded="xl"
        shadow="xl"
        position="relative"
      >
        <LinkOverlay href={`/boards/${board.id}`}>
          <Stack
            position="absolute"
            justifyContent="space-between"
            h="full"
            color="white"
            p="5"
          >
            <Text fontSize="xl" fontWeight="bold">
              {board.title}
            </Text>

            <Text>
              Last edited <TimeAgo live={false} date={board.lastEdited} />
            </Text>
          </Stack>
        </LinkOverlay>
        <Box rounded="xl" zIndex={10} w="full" h="full" bg="blackAlpha.500" />
      </LinkBox>
    </WrapItem>
  );
}

export default BoardPreview;
