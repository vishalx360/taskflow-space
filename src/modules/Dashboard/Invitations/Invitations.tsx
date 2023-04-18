import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { useState } from "react";
import { type WorkspaceMemberInvitationWithSenderAndRecevier } from "../../Global/InvitationDrawer/InvitationRow";
import { MyInvitationsList } from "../../Global/InvitationDrawer/InvitationsDrawer";
import ViewInvitationModal from "../../Global/ViewInvitaionModal/ViewInvitaionModal";
import DashboardMobileNavBar from "../DashboardMobileNavBar";

function Invitations() {
  const [currentInvitation, setCurrentInvitation] =
    useState<null | WorkspaceMemberInvitationWithSenderAndRecevier>(null);

  return (
    <main className="container mx-auto p-0 md:ml-[22em] md:px-5">
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
          <TabsTrigger value="recevied">Recevied</TabsTrigger>
          <TabsTrigger disabled value="sent">
            Sent
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recevied">
          <MyInvitationsList setCurrentInvitation={setCurrentInvitation} />
        </TabsContent>
        <TabsContent value="sent">
          <div>
            <h1 className="text-2xl font-bold">Sent Invitations</h1>
          </div>
          {/* <MyInvitationsList setCurrentInvitation={setCurrentInvitation} /> */}
        </TabsContent>
      </Tabs>

      {/* List of all invitations with open invitsaton */}
    </main>
  );
}

export default Invitations;
