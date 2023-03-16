import Workspaces from "~/modules/Dashboard/Workspaces";
import DashboardNavbar from "~/modules/Global/DashboardNavbar";

function DashboardPage() {
    return (
        <>
            <DashboardNavbar />
            <div className="container mt-20 mx-auto space-y-10">
                <Workspaces />
            </div>
        </>
    )
}

export default DashboardPage

