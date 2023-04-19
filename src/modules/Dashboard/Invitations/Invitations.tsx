import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { LucideArrowDown, LucideArrowUp } from "lucide-react";
import { useState } from "react";
import { type WorkspaceMemberInvitationWithSenderAndRecevier } from "../../Global/InvitationDrawer/InvitationRow";
import {
  ReceviedInvitationsList,
  SentInvitationsList,
} from "../../Global/InvitationDrawer/InvitationsDrawer";
import ViewInvitationModal from "../../Global/ViewInvitaionModal/ViewInvitaionModal";

function Invitations() {
  const [currentInvitation, setCurrentInvitation] =
    useState<null | WorkspaceMemberInvitationWithSenderAndRecevier>(null);

  return (
    <main className="container mx-auto p-0 md:px-5">
      <div className="m-5 mt-10 text-black md:block  lg:flex-row">
        {/* header */}
        <h1 className="text-2xl font-bold md:text-4xl">Invitations</h1>
        <h1 className="mt-5 text-sm text-neutral-500 md:text-lg">
          Here you can manage your invitations.
        </h1>
      </div>
      <ViewInvitationModal
        setCurrentInvitation={setCurrentInvitation}
        currentInvitation={currentInvitation}
      />
      <Tabs defaultValue="recevied" className="w-full px-3">
        <TabsList>
          <TabsTrigger value="recevied">
            <LucideArrowDown width={20} className="mr-2" />
            Recevied
          </TabsTrigger>
          <TabsTrigger value="sent">
            <LucideArrowUp width={20} className="mr-2" />
            Sent
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recevied">
          <ReceviedInvitationsList
            setCurrentInvitation={setCurrentInvitation}
          />
        </TabsContent>
        <TabsContent value="sent">
          <SentInvitationsList setCurrentInvitation={setCurrentInvitation} />
        </TabsContent>
      </Tabs>

      {/* List of all invitations with open invitsaton */}
    </main>
  );
}

export default Invitations;
