import {
  Home,
  LifeBuoy,
  LogOut,
  LucideInfo,
  Mail,
  Mails,
  MessageSquare,
  Plus,
  Settings,
  UserPlus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";
import getGravatar from "@/utils/getGravatar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import CreateNewBoardModal from "../Dashboard/CreateNewBoardModal";
import CreateNewWorkspaceModal from "../Dashboard/CreateNewWorkspaceModal";
import { AboutModal } from "./AboutModal";
import { SupportModal } from "./SupportModal";

export function UserMenu({ withDetails = false }: { withDetails?: boolean }) {
  const { data: session } = useSession();

  function handelLogout() {
    void signOut();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex w-full items-center justify-between gap-5 text-neutral-800`}
        >
          <div className="flex items-center gap-5 ">
            {session?.user?.email && (
              <Image
                height={50}
                width={50}
                // generate default gravtar image
                src={session?.user?.image || getGravatar(session?.user?.email)}
                alt="avatar"
                className="w-12 rounded-full ring-2 ring-white/50 transition-all group-hover:ring-4"
              />
            )}
            {withDetails && (
              <div className="text-start">
                <h2 className="text-md font-medium ">{session?.user?.name}</h2>
                <h2 className="line-clamp-1 text-sm text-gray-500">
                  {session?.user?.email}
                </h2>
              </div>
            )}
          </div>
          {withDetails && <FiChevronDown className="text-xl text-inherit " />}
        </button>
        {/* <Button variant="outline">Open</Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Account Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/overview">
            <DropdownMenuItem className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Overview
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/invitations">
            <DropdownMenuItem className="cursor-pointer">
              <Mails className="mr-2 h-4 w-4" />
              Invitations
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <CreateNewBoardModal>
              <div className="flex w-full items-center px-2 py-1 text-sm">
                <Plus className="mr-2 h-4 w-4" />
                <span>New Board</span>
              </div>
            </CreateNewBoardModal>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <CreateNewWorkspaceModal>
              <div className="flex w-full items-center px-2 py-1 text-sm">
                <Plus className="mr-2 h-4 w-4" />
                <span>New Workspace</span>
              </div>
            </CreateNewWorkspaceModal>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <AboutModal>
              <LucideInfo className="mr-2 h-4 w-4" />
              <span className="w-full">About</span>
            </AboutModal>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <SupportModal>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span className="w-full">Support</span>
            </SupportModal>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onClick={handelLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
