import {
  Box,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import AvatarRow from "@global-components/AvatarRow";
import KanbanView from "@global-components/KanbanView";
import MilestoneView from "@global-components/MilestoneView";
import RoadmapView from "@global-components/RoadmapView";
import geopattern from "geopattern";
import { useRouter } from "next/router";

import {
  TbCalendarEvent,
  TbClipboardCheck,
  TbLayoutBoard,
} from "react-icons/tb";
const Board = () => {
  const router = useRouter();
  const { boardID } = router.query;

  // if not boardID show 404 error
  // fetch data based on boardID
  // if (boardID) return <LoadingScreen />;

  return (
    <Box
      h="calc(100vh - 60px)"
      // bgImage={boardID && geopattern.generate("").toDataUri()}
      // bg={"green.800"}
    >
      <Tabs h="full" colorScheme="orange">
        <Box px="5" py="3">
          <HStack justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold">
              {boardID}
            </Text>
            <HStack>
              <Text fontWeight="bold">Your Team</Text>
              <AvatarRow />
            </HStack>
          </HStack>
        </Box>
        <TabList px="5">
          <Tab>
            <HStack>
              <TbLayoutBoard />
              <Text fontWeight="bold" fontSize="lg">
                Kanban
              </Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <TbClipboardCheck />
              <Text fontWeight="bold" fontSize="lg">
                Milestones
              </Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <TbCalendarEvent />
              <Text fontWeight="bold" fontSize="lg">
                Roadmap
              </Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel h="full" p="0">
            <KanbanView />
          </TabPanel>
          <TabPanel>
            <MilestoneView />
          </TabPanel>
          <TabPanel>
            <RoadmapView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Board;

const BoardNotFound = () => {
  return <p>Board: {boardID}</p>;
};
