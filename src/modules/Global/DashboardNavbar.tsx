import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, memo, useState } from "react";
import { FiChevronDown, FiExternalLink, FiLogOut, FiMenu, FiX } from "react-icons/fi";


const Items = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Settings", link: "/settings", isExternal: false },
];

function DashboardNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    function toggel() {
        setIsOpen((prev) => !prev);
    }
    const pathname = usePathname();
    return (
        <nav className="fixed top-0 z-50 h-20 bg-black text-white w-full shadow sm:px-4 flex items-center justify-center">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <button
                    onClick={toggel}
                    type="button"
                    className="hover: focus:ring-accent ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 focus:outline-none focus:ring-2 md:hidden "
                    aria-controls="navbar-default"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    {!isOpen ? <FiMenu size="2em" /> : <FiX size="2em" />}
                </button>
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center">
                        {/* <Image
              width="50"
              height="50"
              src="/images/icons/icon.svg"
              className="mr-3 "
              alt="Vishalx360 Logo"
            /> */}
                        <span className="text-white self-center whitespace-nowrap text-3xl italic font-semibold">
                            VIRA
                        </span>
                    </Link>
                </div>
                <div className="absolute left-0 top-20 w-full md:hidden">
                    <Transition
                        show={isOpen}
                        enter="transition-opacity ease-in-out duration-300 transform"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in-out duration-300 transform"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="bg-black border-accent  border-b-2 shadow-2xl ">
                            <ul className="flex  w-full flex-col p-5 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:text-sm md:font-medium  ">
                                {Items.map((item) => {
                                    const externalProps = item.isExternal
                                        ? { target: "_blank", rel: "noopener noreferrer" }
                                        : {};
                                    return (
                                        <li onClick={toggel} key={item.title}>
                                            <a
                                                href={item.link}
                                                {...externalProps}
                                                className={`decoration-accent hover:bg-accent md:hover:text-accent block scroll-smooth rounded-xl py-2 pl-3 pr-4 text-lg text-gray-50 decoration-2 underline-offset-8 md:border-0 md:p-0 md:hover:bg-transparent ${item.link === pathname ?
                                                    "underline" : ""
                                                    }`}
                                            >
                                                {item.title}
                                                {item.isExternal && (
                                                    <FiExternalLink className="text-inherit" />
                                                )}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </Transition>
                </div>
                <div className='flex items-center gap-10'>

                    <div className="hidden w-full md:block md:w-auto">
                        <ul className="mt-4  flex flex-col rounded-lg border border-gray-100 p-4  md:mt-0 md:flex-row md:space-x-8 md:border-0 md:text-sm md:font-medium  ">
                            {Items.map((item) => {
                                const externalProps = item.isExternal
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {};
                                return (
                                    <li key={item.title}>
                                        <Link
                                            href={item.link}
                                            {...externalProps}
                                            className={`decoration-accent md:hover:text-accent block scroll-smooth rounded py-2 pl-3 pr-4 text-lg text-gray-50 decoration-2 underline-offset-8 hover:bg-gray-100 
                                md:border-0 md:p-0 md:hover:bg-transparent ${item.link === pathname ?
                                                    "underline" : ""
                                                }`}
                                        >
                                            {item.title}
                                            {item.isExternal && (
                                                <FiExternalLink className="ml-2 inline text-inherit" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <AccountMenuMemo />
                </div>


            </div>
        </nav>
    );
}

export default DashboardNavbar;



function AccountMenu() {
    const { data: session, } = useSession()

    async function handelLogout() {
        await signOut();
        return;
    }
    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="group inline-flex items-center gap-2 md:gap-5 w-full justify-center rounded-md">
                        <Image height={200} width={200} src={session?.user?.image || "/"} alt="avatar" className="ring-white/40 ring-2 group-hover:ring-4 transition-all w-10 rounded-full" />
                        <FiChevronDown className='text-xl' />
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
                    <Menu.Items className="absolute z-20 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-xl ring-1 text-black ring-black ring-opacity-5 focus:outline-none">

                        <div className="px-5 py-3">
                            <div className=' text-left mb-2' >
                                <h1 className="text-sm text-black text-opacity-50">Logged in as</h1>
                                <h1 className="text-sm mt-3 font-medium">{session?.user?.name}</h1>
                                <h1 className="text-xs font-medium text-black text-opacity-50">{session?.user.email}</h1>
                            </div>

                            <Menu.Item>
                                <button
                                    className={`hover:bg-red-500 hover:text-white group flex w-full items-center rounded-md px-3 py-3 text-sm`}
                                    onClick={() => {
                                        void handelLogout();
                                    }}
                                >
                                    <FiLogOut
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    Logout
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu >
        </div >
    )
}


const AccountMenuMemo = memo(AccountMenu);
