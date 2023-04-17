import { useState } from "react";
import { type WorkspaceMemberInvitationWithSenderAndRecevier } from "../Global/InvitationDrawer/InvitationRow";
import { MyInvitationsList } from "../Global/InvitationDrawer/InvitationsDrawer";
import ViewInvitationModal from "../Global/ViewInvitaionModal/ViewInvitaionModal";

function Invitations() {
  const [currentInvitation, setCurrentInvitation] =
    useState<null | WorkspaceMemberInvitationWithSenderAndRecevier>(null);

  return (
    <main className="container mx-auto  md:ml-[22em] md:px-5">
      <div className="m-5 mt-10 hidden  text-black md:block  lg:flex-row">
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
      {/* tab to switch between sent and recevied */}

      {/* List of all invitations with open invitsaton */}
      <MyInvitationsList setCurrentInvitation={setCurrentInvitation} />
    </main>
  );
}

export default Invitations;
