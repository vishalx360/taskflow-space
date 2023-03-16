import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (session) {
        return {
            redirect: {
                "destination": "/dashboard",
            }
        }
    } else {
        return {
            redirect: {
                "destination": "/signin",
            }
        }
    }

}


function index() {
    // TODO: add Landing page with features and stuff
    return (
        <div>VIRA</div>
    )
}

export default index