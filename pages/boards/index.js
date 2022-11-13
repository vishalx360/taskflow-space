import { RESTDATA } from "@constants/RESTapi";
import Layout from "@global-components/Layout";
import Workspace from "@global-components/Workspace";

console.log(RESTDATA);

function Dashboard() {
  return (
    <Layout>
      <Workspace />
      <Workspace />
    </Layout>
  );
}

export default Dashboard;
