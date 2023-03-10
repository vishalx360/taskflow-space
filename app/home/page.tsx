"use client";

import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

const HomePage: NextPage = () => {
    const { data: session, status } = useSession();

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
                            <div className="">
                                <p className="my-5 p-2">Logged in as</p>

                                <div className="flex items-center gap-10">
                                    <Image
                                        height={200}
                                        width={200}
                                        src={session?.user?.image || "#"}
                                        alt="avatar"
                                        className="w-20 rounded-full"
                                    />
                                    <div>
                                        <h1 className="text-xl">{session.user.name}</h1>
                                        <h1 className="text-xl text-neutral-100 text-opacity-50">
                                            {session.user.email}
                                        </h1>
                                    </div>
                                    <button
                                        onClick={() => {
                                            void handelSignin();
                                        }}
                                        className="text-neutral mt-5 rounded-xl bg-red-800 p-2 px-4 text-lg font-bold"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )}
                        {status === "loading" && (
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
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default HomePage;
