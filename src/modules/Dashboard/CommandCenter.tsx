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

import { LucideSearch } from "lucide-react";

function CommandCenter() {
  const [open, setOpen] = useState(false);

  //   useEffect(() => {
  //     const down = (e: KeyboardEvent) => {
  //       if (e.key === "b" && e.me) {
  //         console.log("b");
  //         setOpen((open) => !open);
  //       }
  //     };

  //     document.addEventListener("keydown", down);
  //     return () => document.removeEventListener("keydown", down);
  //   }, []);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="w-full rounded-full border  border-neutral-300/50 bg-neutral-300/40 p-3 px-4 text-neutral-500 hover:bg-neutral-200/80 md:max-w-[70%]"
      >
        <div className="flex items-center gap-8">
          <LucideSearch />
          <h1>Search for anything</h1>
          {/* <p className="text-sm text-slate-500 dark:text-slate-400">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-100 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-600 opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <span className="text-xs">⌘</span>B
            </kbd>
          </p> */}
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          className="border-none hover:border-none focus:border-none focus:ring-0 active:border-none active:ring-0"
          placeholder="Type a command or search..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Search Workspace</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Board</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandCenter;

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { useState } from "react";
