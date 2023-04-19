import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import DashboardNavbar from "@/modules/Dashboard/DashboardNavbar";
import Invitations from "@/modules/Dashboard/Invitations/Invitations";

function DashboardPage() {
  return (
    <DashboardLayout>
      <Invitations />
    </DashboardLayout>
  );
}

export default DashboardPage;
