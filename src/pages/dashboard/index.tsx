import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import Overview from "@/modules/Dashboard/OverView";

function DashboardPage() {
  return (
    <DashboardLayout>
      <Overview />
    </DashboardLayout>
  );
}

export default DashboardPage;

// make server call to redirect to /signin if not authenticated nextauth
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
