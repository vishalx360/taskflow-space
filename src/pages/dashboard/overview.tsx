import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import Overview from "@/modules/Dashboard/OverView";
import Head from "next/head";

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
