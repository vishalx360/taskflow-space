import Home from "~/modules/Home";

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (session) {
//     return {
//       redirect: {
//         destination: "/dashboard",
//       },
//     };
//   } else {
//     return { props: {} };
//   }
// }

function index() {
  return <Home />;
}

export default index;
