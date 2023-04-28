import getGravatar from "@/utils/getGravatar";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import LogoImage from "../Global/LogoImage";
import { UserMenu } from "../Global/UserMenu";

async function handelLogout() {
  await signOut();
  return;
}

const NavLinks = [
  { title: "Benefit", href: "/home#benifits" },
  { title: "Features", href: "/home#features" },
  { title: "Pricing", href: "/home#pricing" },
  { title: "About us", href: "/home#aboutus" },
];

function HomeNavbar() {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  function toggel() {
    setIsOpen((prev) => !prev);
  }
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "anticipate" }}
      className=" sticky top-0 z-[100]  bg-neutral-100/90  backdrop-blur-md"
    >
      <div className="container mx-auto max-w-[100em] p-6  lg:flex lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <LogoImage className="w-52 lg:w-60" dark />
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

        {/* <!-- mobile Navbar --> */}
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
              {status === "authenticated" && (
                <div className=" mb-2 text-left">
                  <h1 className="mt-3 text-sm font-medium">
                    {session?.user?.name}
                  </h1>
                  <h1 className="text-xs font-medium text-black text-opacity-50">
                    {session?.user.email}
                  </h1>
                </div>
              )}

              {NavLinks.map((navlink) => (
                <Link
                  key={navlink.href}
                  className="transform text-gray-700 transition-colors duration-300  lg:mx-8"
                  href={navlink.href}
                >
                  {navlink.title}
                </Link>
              ))}

              {status === "authenticated" && (
                <button
                  onClick={() => {
                    void handelLogout();
                  }}
                  className="text-left text-gray-700 transition-colors duration-300  lg:mx-8"
                >
                  Logout
                </button>
              )}
            </div>

            {/* <a
                className="mt-4 block rounded-lg bg-green-600 px-5 py-2 text-center text-sm capitalize text-white hover:bg-green-500 lg:mt-0 lg:w-auto"
                href="#"
              >
                Get started
              </a> */}
          </Transition>
        </div>
        {/* desktop navbar */}
        <div className="hidden lg:block">
          <div className="mt-0 flex flex-row items-center  ">
            {NavLinks.map((navlink) => (
              <Link
                key={navlink.href}
                className="mx-8 border-black  text-gray-700  duration-300  hover:border-b-2"
                href={navlink.href}
              >
                {navlink.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="mt-0 flex flex-row items-center px-8 ">
            {status === "authenticated" ? (
              <UserMenu />
            ) : (
              <div className="px-2">
                <Link
                  className="mx-8 border-black  text-gray-700  duration-300  hover:border-b-2"
                  href={"/signin"}
                >
                  Signin
                </Link>
                <Link
                  className="mx-8 border-black  text-gray-700  duration-300  hover:border-b-2"
                  href={"/signup"}
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default HomeNavbar;
