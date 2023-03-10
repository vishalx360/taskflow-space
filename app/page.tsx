import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import HomePage from "./home/page";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session) {
        return redirect("/dashboard");
    } else {
        return <HomePage />;
    }
}