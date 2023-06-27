import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import Invitations from "@/modules/Dashboard/Invitations/Invitations";
import Head from "next/head";

function DashboardPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Taskflow | Invitations</title>
      </Head>
      <Invitations />
    </DashboardLayout>
  );
}

export default DashboardPage;
