import { type GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { authOptions } from "~/server/auth";


type Props = { status: "authenticated" | "unauthenticated" }

const HomePage: NextPage<Props> = ({ status }: Props) => {
  async function handelSignin() {
    await signIn("google");
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            VIRA
          </h1>
          <h1 className="text-xl text-white ">Project Management Made Easy</h1>
          <div className="">
            {status === "unauthenticated" && (
              <button
                onClick={() => {
                  void handelSignin();
                }}
                className="flex items-center justify-center gap-5 rounded-xl bg-neutral-50 px-6 py-4 text-lg text-black"
              >
                <FaGoogle />
                Sign In With Google
              </button>
            )}
            {status === "authenticated" && (
              <div className="text-center">
                <Link className="px-4 py-2 bg-white text-black rounded-xl" href="/dashboard">
                  Visit Dashboard
                </Link>
              </div>
            )}
            {/* {status === "loading" && (
              <div>
                <p className="my-5 p-2">Loading...</p>
                <div
                  className="flex items-center
                            justify-center gap-5"
                >
                  <div className="h-20 w-20 animate-pulse rounded-full bg-neutral-100" />
                  <div className="w-52 space-y-3">
                    <div className="h-4 w-full animate-pulse rounded-xl bg-neutral-100" />
                    <div className="h-4 w-full animate-pulse rounded-xl bg-neutral-100" />
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return {
    props: {
      status: session ? "authenticated" : "unauthenticated",
    },
  }
}