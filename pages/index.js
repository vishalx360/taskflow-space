import { Box, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useCallback, useState } from "react";

import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { LIST_BG_COLOR, TaskList } from "@global-components/TaskList";
import { TaskCard } from "global-components/TaskCard";
import {
  createSortablePayloadByIndex,
  defaultItems,
  getBetweenRankAsc,
  sortByLexoRankAsc,
} from "utils/List.helpers";
import { AddListForm } from "@global-components/AddListForm";

const ConstantListData = () => {
  return [
    ...defaultItems("Todo"),
    ...defaultItems("Doing"),
    ...defaultItems("Done"),
  ];
};
const Lists = ["Todo", "Doing", "Done"];

function getData(list, id) {
  return list.find((x) => x.id === id);
}

export default function Home() {
  // ---------
  const [activeId, setActiveId] = useState(null);

  // const [ListData, setListData] = useState(ConstantListData);

  const [items, setItems] = useState(ConstantListData());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } })
  );
  function findContainer(id) {
    return items.find((x) => x.id === id).list || null;
  }

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      setActiveId(active.id);
    },
    [setActiveId]
  );
  // function to handel drag end event
  const handleDragEnd = useCallback((event) => {
    console.log("dropped");
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((oldItems) => {
        // 1. find prev, current, next items
        const sortablePayload = createSortablePayloadByIndex(oldItems, event);
        // 2. calculate new rank
        const newRank = getBetweenRankAsc(sortablePayload);
        const newItems = [...oldItems];
        const currIndex = oldItems.findIndex(
          (x) => x.id === sortablePayload.entity.id
        );
        const newListID =
          newItems[oldItems.findIndex((x) => x.id === over.id)].list;

        // 3. replace current rank and list.
        newItems[currIndex] = {
          ...newItems[currIndex],
          rank: newRank.toString(),
          list: newListID,
        };
        // TODO: make DB update request.
        // 4. sort by rank
        return newItems.sort(sortByLexoRankAsc);
      });
    }

    setActiveId(null);
  }, []);

  // function to handel drag over event
  const handleDragOver = useCallback((event) => {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    // if (
    //   !activeContainer ||
    //   !overContainer ||
    //   activeContainer === overContainer
    // ) {
    //   return;
    // }

    console.log(activeContainer, overContainer);

    setItems((oldItems) => {
      // 1. find prev, current, next items
      const sortablePayload = createSortablePayloadByIndex(oldItems, event);
      // 2. calculate new rank
      const newRank = getBetweenRankAsc(sortablePayload);
      const newItems = [...oldItems];
      const currIndex = oldItems.findIndex(
        (x) => x.id === sortablePayload.entity.id
      );
      const newListID =
        newItems[oldItems.findIndex((x) => x.id === over.id)].list;

      // 3. replace current rank and list.
      newItems[currIndex] = {
        ...newItems[currIndex],
        rank: newRank.toString(),
        list: newListID,
      };
      // 4. sort by rank
      // TODO: improve sorting.
      return newItems.sort(sortByLexoRankAsc);
    });
  }, []);

  return (
    <Box bgImage="/background.jpg">
      <Head>
        <title>Vira | Project Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {/* render all lists */}
        <Stack position="relative" direction={"row"} p="5" spacing={5}>
          {Lists.map((list) => {
            return (
              <TaskList
                list={list}
                items={items.filter((x) => x.list === list)}
              />
            );
          })}
          <Box
            bg={LIST_BG_COLOR}
            zIndex={10}
            position="sticky"
            rounded="xl"
            top="0"
            h="fit-content"
          >
            <AddListForm />
          </Box>
        </Stack>
        <DragOverlay>
          {activeId ? (
            <TaskCard
              key={activeId}
              id={activeId}
              active
              {...getData(items, activeId)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}
