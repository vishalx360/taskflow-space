import Divider from "@/modules/Global/Divider";
import LogoImage from "@/modules/Global/LogoImage";
import UserDetails from "@/modules/Signin/UserDetails";
import { CredentialSection } from "@/modules/Signin/sections/CredentialSection";
import { FetchSigninOptionsSection } from "@/modules/Signin/sections/FetchSigninOptionsSection";
import { OauthSection } from "@/modules/Signin/sections/OauthSection";
import { PasskeySection } from "@/modules/Signin/sections/PasskeySection";
import { Button } from "@/modules/ui/button";
import { authOptions } from "@/server/auth";
import { AnimatePresence, motion } from "framer-motion";
import { LucideArrowLeft } from "lucide-react";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export type SigninOptions = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  options: {
    credentials: boolean;
    passkey: boolean;
  };
};

const SectionMap = {
  fetchsigninoptions: FetchSigninOptionsSection,
  credentials: CredentialSection,
  passkey: PasskeySection,
  oauth: OauthSection,
};
export type SectionMapKeys = keyof typeof SectionMap;

export default function SignInPage() {
  const [signinOptions, setSigninOptions] = useState<SigninOptions | null>(
    null
  );
  const [currentSection, setCurrentSection] =
    useState<SectionMapKeys>("fetchsigninoptions");

  useEffect(() => {
    if (signinOptions) {
      switch (true) {
        case signinOptions?.options.passkey:
          setCurrentSection("passkey");
          break;
        case signinOptions?.options.credentials:
          setCurrentSection("credentials");
          break;
        default:
          setCurrentSection("oauth");
          break;
      }
    } else {
      setCurrentSection("fetchsigninoptions");
    }
  }, [signinOptions]);

  const CurrentSection = SectionMap[currentSection];

  async function handelOauthSignin(provider: string) {
    await signIn(provider);
  }
  return (
    <>
      <Head>
        <title>Taskflow | Sign-in</title>
      </Head>
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "anticipate" }}
            className="flex items-center  gap-5"
          >
            <Link
              href="/"
              className="flex items-center gap-5 rounded-full border-neutral-400 p-2 transition duration-200 ease-in-out hover:bg-neutral-500/20 "
            >
              <LucideArrowLeft className="text-2xl" />
            </Link>
            <div className="my-10 block dark:hidden lg:my-20">
              <LogoImage dark width={300} />
            </div>
            <div className="my-10 hidden dark:block lg:my-20">
              <LogoImage width={300} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "anticipate" }}
            className="w-full rounded-xl bg-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800 sm:max-w-md md:mt-0 xl:p-0"
          >
            <div className="space-y-6 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-white md:text-2xl">
                Sign in to your account
              </h1>
              {signinOptions?.user && (
                <UserDetails
                  user={signinOptions?.user}
                  setCurrentSection={setCurrentSection}
                  setSigninOptions={setSigninOptions}
                />
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  variants={{
                    enter: {
                      x: 10,
                      opacity: 0,
                    },
                    center: {
                      x: 0,
                      opacity: 1,
                    },
                    exit: {
                      x: -10,
                      opacity: 0,
                    },
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.3,
                  }}
                  key={currentSection}
                >
                  <CurrentSection
                    signinOptions={signinOptions}
                    setSigninOptions={setSigninOptions}
                    setCurrentSection={setCurrentSection}
                  />
                </motion.div>
              </AnimatePresence>

              <Divider />

              <div className="flex flex-col items-center gap-2 md:flex-row">
                <Button
                  onClick={() => {
                    void handelOauthSignin("google");
                  }}
                  variant="outline"
                  className="text-md flex w-full items-center justify-center gap-4"
                  size="lg"
                  LeftIcon={FcGoogle}
                >
                  Google
                </Button>
                <Button
                  onClick={() => {
                    void handelOauthSignin("github");
                  }}
                  variant="outline"
                  className="text-md flex w-full items-center justify-center gap-4"
                  size="lg"
                  LeftIcon={FaGithub}
                >
                  Github
                </Button>
              </div>
              <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-black hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// if signin redirect to dashboard
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
