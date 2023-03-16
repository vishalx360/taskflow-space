import { prisma } from "~/server/db";
import DefaultData from "./PersonalWorkspaceData.json";

export default async function SeedPersonalWorkspace(userId: string) {
    // create workspace
    const Workspace = await prisma.workspace.create({
        data: {
            name: "Personal Workspace",
            userId,
            personal: true
        },
    });

    // create boards
    const Boards = await Promise.all(DefaultData.map(boardData => {
        const board = prisma.board.create({
            data: {
                name: boardData["board-name"],
                Workspace: {
                    connect: {
                        id: Workspace.id
                    }
                },
            }
        });
        return board;
    }));

    const boardIdMap = new Map();
    Boards.flatMap(board => boardIdMap.set(board.name, board.id));

    DefaultData.map(boardData => {
        void (async () => {
            await Promise.all(boardData.lists.map(listData => {
                const CreateTasks = listData.tasks.map(task => {
                    return {
                        title: task,
                    }
                })
                const list = prisma.list.create({
                    data: {
                        name: listData["list-name"],
                        Board: {
                            connect: {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                id: boardIdMap.get(boardData["board-name"])
                            }
                        },
                        tasks: {
                            create: [...CreateTasks]
                        }
                    }
                });
                return list;
            }));
        })()
    })
}