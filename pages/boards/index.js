import { RESTDATA } from "@constants/RESTapi";
import Layout from "@global-components/Layout";
import Workspace from "@global-components/Workspace";

console.log(RESTDATA);

function Dashboard() {
  // TODO: fetch all workpspaces and show Workpsace.
  return (
    <Layout>
      <Workspace name="Personal" />
      <Workspace name="Company" />
    </Layout>
  );
}

export default Dashboard;
