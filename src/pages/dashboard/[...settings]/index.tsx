import DashboardLayout from "@/modules/Dashboard/DashboardLayout";
import DashboardNavbar from "@/modules/Dashboard/DashboardNavbar";
import Settings from "@/modules/Settings/Settings";

function DashboardPage() {
  return (
    <DashboardLayout>
      <Settings />
    </DashboardLayout>
  );
}

export default DashboardPage;
