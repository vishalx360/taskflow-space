import {
  Box,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
} from "@chakra-ui/react";
import AvatarRow from "@global-components/AvatarRow";
import KanbanView from "@global-components/KanbanView";
import MilestoneView from "@global-components/MilestoneView";
import RoadmapView from "@global-components/RoadmapView";
import geopattern from "geopattern";
import { useRouter } from "next/router";
import { MdArrowLeft, MdArrowRight, MdBookmarkAdd } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
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
        <TabList px="5">
          <HStack w="full" justifyContent="space-between">
            <HStack justifyContent="space-between">
              <HStack mr="5">
                {/* TODO: add logo */}
                <FaArrowLeft />
                <Text fontSize="2xl" fontWeight="bold">
                  Vira
                </Text>
              </HStack>

              <Tag px="5" rounded="full">
                <Text fontSize="xl" fontWeight="bold">
                  {boardID}
                </Text>
              </Tag>
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
            </HStack>
            <HStack>
              <Text fontWeight="bold">Your Team</Text>
              <AvatarRow />
            </HStack>
          </HStack>
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
