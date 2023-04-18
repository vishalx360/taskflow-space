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
import { LayoutDashboard, PlusCircle } from "lucide-react";

import { Layout, LucideSearch } from "lucide-react";

function CommandCenter() {
  const [open, setOpen] = useState(false);

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
          <div className="flex items-center gap-5">
            <LucideSearch />
            <h1 className="line-clamp-1 w-10 md:w-fit">Search for anything</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
          <CommandGroup heading="Search">
            <CommandItem>
              <Layout className="mr-2 h-4 w-4" />
              <span>Search Board</span>
            </CommandItem>
            <CommandItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Search Workspace</span>
            </CommandItem>
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Search Team Member</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
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
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Workspace Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandCenter;

import { Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
