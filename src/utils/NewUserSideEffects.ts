import { LexoRank } from "lexorank";
import { prisma } from "../server/db";
import DefaultData from "./PersonalWorkspaceData.json";

export default async function NewUserSideEffects(userId: string, email: string) {
  // connect existing invitations
  await prisma.workspaceMemberInvitation.updateMany({
    where: { recepientEmail: email },
    data: { recepientId: userId },
  });

  // create workspace
  const Workspace = await prisma.workspace.create({
    data: {
      name: "Personal Workspace",
      members: {
        create: {
          role: "OWNER",
          user: {
            connect: {
              id: userId
            }
          }
        }
      },
      personal: true,
    },
  });

  // create boards
  const Boards = await Promise.all(
    DefaultData.map((boardData) => {
      const board = prisma.board.create({
        data: {
          name: boardData["board-name"],
          Workspace: {
            connect: {
              id: Workspace.id,
            },
          },
          background: boardData.background,
        },
      });
      return board;
    })
  );

  const boardIdMap = new Map();
  Boards.flatMap((board) => boardIdMap.set(board.name, board.id));

  DefaultData.map((boardData) => {
    void (async () => {
      await Promise.all(
        boardData.lists.map((listData) => {
          let currentLexoRank = LexoRank.middle();
          const CreateTasks = listData.tasks.map((task) => {
            currentLexoRank = currentLexoRank.genNext();
            return {
              title: task,
              rank: currentLexoRank.toString(),
            };
          });
          const list = prisma.list.create({
            data: {
              name: listData["list-name"],
              Board: {
                connect: {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  id: boardIdMap.get(boardData["board-name"]),
                },
              },
              tasks: {
                create: [...CreateTasks],
              },
            },
          });
          return list;
        })
      );
    })();
  });
}
