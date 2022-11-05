import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Icon,
  Img,
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
import { FiShare, FiShare2 } from "react-icons/fi";
import InviteModal from "@global-components/InviteModal";
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
      <Tabs size="sm" variant="line" h="full" colorScheme="blackAlpha">
        <TabList>
          <Center
            bg="blackAlpha.900"
            color="white"
            borderRight="2px"
            borderBottom="2px"
            px="10"
            roundedBottomRight="xl"
          >
            <Text fontSize="2xl" fontWeight="bold">
              Vira
            </Text>
          </Center>

          <HStack px="5" py="2" w="full" justifyContent="space-between">
            <Box px="5">
              <Text fontSize="xl" fontWeight="bold">
                {boardID}
              </Text>
            </Box>
            {/* tabs */}
            <HStack>
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
            <HStack ml="auto">
              <Text fontWeight="bold">Your Team</Text>
              <AvatarRow />
              <InviteModal />
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
