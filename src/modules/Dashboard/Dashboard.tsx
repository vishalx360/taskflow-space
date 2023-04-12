import DashboardNavbar from "@/modules/Global/DashboardNavbar";
import Workspaces from "./Workspaces";

function Dashboard() {
  return (
    <>
      <DashboardNavbar />
      <div className="container mx-auto mt-20 space-y-10">
        <Workspaces />
      </div>
    </>
  );
}

export default Dashboard;
