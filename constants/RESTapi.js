import { sub } from "date-fns";
import { defaultItems } from "utils/List.helpers";

// BOARDS
const Boards = [
  {
    id: "board1",
    title: "Board 1",
    lastEdited: sub(Date.now(), { hours: 1 }),
    owner: "user1",
  },
  {
    id: "board3",
    title: "Board 3",
    lastEdited: sub(Date.now(), { minutes: 5 }),
    owner: "user1",
  },
  {
    id: "board2",
    title: "Board 2",
    lastEdited: sub(Date.now(), { hours: 2 }),
    owner: "user2",
  },
];

Boards.sort((a, b) => b.lastEdited - a.lastEdited);

// TASKS
const Tasks = [];
const ConstantListData = (board) => {
  return [
    ...defaultItems("Todo", board),
    ...defaultItems("In Progress", board),
    ...defaultItems("Done", board),
  ];
};

Boards.forEach((board) => {
  Tasks.push(ConstantListData(board.id));
});

export const RESTDATA = { Boards, Tasks };
