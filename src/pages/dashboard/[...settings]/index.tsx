import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import Settings from "@/modules/Settings/Settings";
import Head from "next/head";

function DashboardPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Taskflow | Settings</title>
      </Head>
      <Settings />
    </DashboardLayout>
  );
}

export default DashboardPage;
