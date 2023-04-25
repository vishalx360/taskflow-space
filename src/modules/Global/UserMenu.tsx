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

  async function handelLogout() {
    await signOut();
    return;
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/overview">
            <DropdownMenuItem>
              <Home className="mr-2 h-4 w-4" />
              Overview
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/invitations">
            <DropdownMenuItem>
              <Mails className="mr-2 h-4 w-4" />
              Invitations
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <CreateNewBoardModal>
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>New Board</span>
                <DropdownMenuShortcut>⌘+B</DropdownMenuShortcut>
              </div>
            </CreateNewBoardModal>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreateNewWorkspaceModal>
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>New Workspace</span>
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </div>
            </CreateNewWorkspaceModal>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AboutModal>
            <LucideInfo className="mr-2 h-4 w-4" />
            <span>About</span>
          </AboutModal>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SupportModal>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </SupportModal>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handelLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
