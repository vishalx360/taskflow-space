import { Menu, Transition } from "@headlessui/react";
import { type Session } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, memo, useState } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import getGravatar from "~/utils/getGravatar";
import POSTER_URL from "../../../public/poster.png";
import LogoImage from "../Global/LogoImage";

async function handelLogout() {
  await signOut();
  return;
}

const NavLinks = [
  { title: "Home", href: "/home" },
  { title: "Signin", href: "/signin" },
  { title: "Signup", href: "/signup" },
];

function Home() {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  function toggel() {
    setIsOpen((prev) => !prev);
  }
  return (
    <>
      <section className="bg-white ">
        <nav className="container mx-auto p-6 lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <LogoImage className="w-52 lg:w-full" dark />
            </Link>

            {/* <!-- Mobile Navbar button --> */}
            <div className="flex lg:hidden">
              {status === "authenticated" ? (
                <button onClick={toggel} type="button" aria-label="toggle menu">
                  <div className="group inline-flex w-full items-center justify-center gap-2 rounded-md md:gap-5">
                    {session?.user?.email && (
                      <Image
                        height={200}
                        width={200}
                        // generate default gravtar image
                        src={
                          session?.user?.image ||
                          getGravatar(session?.user?.email)
                        }
                        alt="avatar"
                        className="w-10 rounded-full ring-2 ring-white/40 transition-all group-hover:ring-4"
                      />
                    )}
                    <FiChevronDown className="text-xl" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={toggel}
                  type="button"
                  aria-label="toggle menu"
                  className="text-gray-500 hover:text-gray-600 focus:text-gray-600 focus:outline-none "
                >
                  {!isOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* <!-- Mobile Navbar --> */}
          <div className="block lg:hidden">
            <Transition
              show={isOpen}
              enter="transition-all duration-150"
              enterFrom="-translate-y-10 opacity-0"
              enterTo="translate-y-0 w-full opacity-100"
              leave="transition-all duration-150"
              leaveFrom="translate-y-0 w-full opacity-100"
              leaveTo="-translate-y-10 opacity-0"
              className="absolute inset-x-0 top-20 z-20 block w-full rounded-b-xl bg-neutral-100 px-6 py-4 shadow-xl transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col space-y-5">
                <div className=" mb-2 text-left">
                  <h1 className="mt-3 text-sm font-medium">
                    {session?.user?.name}
                  </h1>
                  <h1 className="text-xs font-medium text-black text-opacity-50">
                    {session?.user.email}
                  </h1>
                </div>

                {NavLinks.map((navlink) => (
                  <Link
                    key={navlink.href}
                    className="transform text-gray-700 transition-colors duration-300  lg:mx-8"
                    href={navlink.href}
                  >
                    {navlink.title}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    void handelLogout();
                  }}
                  className="text-left text-gray-700 transition-colors duration-300  lg:mx-8"
                >
                  Logout
                </button>
              </div>

              {/* <a
                className="mt-4 block rounded-lg bg-green-600 px-5 py-2 text-center text-sm capitalize text-white hover:bg-green-500 lg:mt-0 lg:w-auto"
                href="#"
              >
                Get started
              </a> */}
            </Transition>
          </div>
          <div className="hidden lg:block">
            <div className="absolute inset-x-0 z-20 block w-full  bg-gray-900 px-6 py-4 shadow-md transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:mt-0 lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none ">
              <div className="mt-0 flex flex-row items-center px-8 ">
                {NavLinks.map((navlink) => (
                  <Link
                    key={navlink.href}
                    className="mx-8 border-black  text-gray-700  duration-300  hover:border-b-2"
                    href={navlink.href}
                  >
                    {navlink.title}
                  </Link>
                ))}
                {status === "authenticated" && (
                  <AccountMenuMemo session={session} />
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h1 className="w-full text-3xl font-semibold  text-gray-800 md:text-4xl lg:text-5xl">
              Streamline Your Workflow and Conquer Tasks
            </h1>
            <p className="mt-6 text-gray-500">
              Unleash Your Team&apos;s Potential with Taskflow <br /> The
              Collaborative App for Effortless Task Management.
            </p>
            <Link
              href="/signup"
              className="text-md mt-6 inline-block  rounded-lg bg-black px-8 py-3 text-center font-bold capitalize leading-5 text-white hover:bg-black/80 focus:outline-none lg:mx-0 lg:w-auto"
            >
              Get Started
            </Link>
          </div>

          <div className="mt-10 flex justify-center">
            <Image
              alt="Poster"
              width={1920}
              height={1080}
              placeholder="blur"
              className="h-100 w-full rounded-2xl border-2 object-cover shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl lg:w-4/5"
              src={POSTER_URL}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

function AccountMenu({ session }: { session: Session | null }) {
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="group inline-flex w-full items-center justify-center gap-2 rounded-md md:gap-5">
            {session?.user?.email && (
              <Image
                height={200}
                width={200}
                // generate default gravtar image
                src={session?.user?.image || getGravatar(session?.user?.email)}
                alt="avatar"
                className="w-10 rounded-full ring-2 ring-white/40 transition-all group-hover:ring-4"
              />
            )}
            <FiChevronDown className="text-xl" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-black shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-5 py-3">
              <div className=" mb-2 text-left">
                <h1 className="mt-3 text-sm font-medium">
                  {session?.user?.name}
                </h1>
                <h1 className="text-xs font-medium text-black text-opacity-50">
                  {session?.user.email}
                </h1>
              </div>

              <Menu.Item>
                <button
                  className={`group flex w-full items-center rounded-md px-3 py-3 text-sm hover:bg-red-500 hover:text-white`}
                  onClick={() => {
                    void handelLogout();
                  }}
                >
                  <FiLogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

const AccountMenuMemo = memo(AccountMenu);
