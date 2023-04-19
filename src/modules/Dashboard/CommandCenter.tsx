import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/modules/ui/command";
import { api } from "@/utils/api";
import { LayoutDashboard } from "lucide-react";

import { Layout, LucideSearch } from "lucide-react";

function CommandCenter() {
  const [open, setOpen] = useState(false);
  const utils = api.useContext();
  const workspaces = utils.workspace.getAllWorkspace.getData();

  const boards = useMemo(() => {
    let all = [];
    workspaces?.map((workspace) => {
      const currentBoardList = utils.board.getAllBoards.getData({
        workspaceId: workspace.id,
      });
      if (currentBoardList) all = [...all, ...currentBoardList];
    });
    return all;
  }, [workspaces]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="w-full rounded-full border  border-neutral-300/50 bg-neutral-300/40 p-2.5 px-4 text-neutral-500 hover:bg-neutral-200/80 md:max-w-[80%]"
      >
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-1 sm:gap-5">
            <LucideSearch />
            <h1 className="line-clamp-1 sm:w-20 md:w-fit">
              Type a command or search...
            </h1>
          </div>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 md:inline">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-100 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-600 opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <span className="text-xs">⌘</span>M
            </kbd>
          </p>
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          className="border-none hover:border-none focus:border-none focus:ring-0 active:border-none active:ring-0"
          placeholder="Type a command or search..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Create">
            <CommandItem>
              <Layout className="mr-2 h-4 w-4" />
              <span>Create New Board</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Create New Workspace</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Search Boards">
            {boards?.map((board) => {
              let boardUrl = `/board/${board?.id}`;
              const newParams = new URLSearchParams();
              newParams.append("boardName", board?.name);
              newParams.append("background", board?.background || "");
              boardUrl = boardUrl + "?" + newParams.toString();

              return (
                <a key={board?.id} href={boardUrl}>
                  <CommandItem>
                    <Layout className="mr-2 h-4 w-4" />
                    <span className="line-clamp-1"> {board?.name} </span>
                  </CommandItem>
                </a>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandCenter;

import { useEffect, useMemo, useState } from "react";
