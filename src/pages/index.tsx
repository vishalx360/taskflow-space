import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Home from "~/modules/Home";
import { authOptions } from "~/server/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  } else {
    return { props: {} };
  }
}

function index() {
  return <Home />;
}

export default index;
