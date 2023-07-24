import Head from "next/head";

import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import Overview from "@/modules/Dashboard/OverView";

function DashboardPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Taskflow | Overview</title>
      </Head>
      <Overview />
    </DashboardLayout>
  );
}

export default DashboardPage;
