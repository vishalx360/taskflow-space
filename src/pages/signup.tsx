import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function SignInPage() {
  // TODO: add credential login
  async function handelSignin() {
    await signIn("google");
  }
  return (
    <>
      <section className="bg-neutral-100 dark:bg-gray-900">
        <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <a
            href="#"
            className="mb-8 flex items-center text-5xl font-normal tracking-widest text-gray-900 dark:text-white"
          >
            {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
            VIRA
          </a>
          <div className="w-full rounded-lg bg-white shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Create new account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 tracking-wider text-gray-900 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    placeholder="John doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 tracking-wider text-gray-900 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="•••••••••••"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 tracking-widest text-gray-900 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-black"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-black hover:underline dark:text-black"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="text-md w-full rounded-lg bg-black px-5 py-2.5 text-center font-medium text-white hover:bg-black focus:outline-none focus:ring-4 focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    void handelSignin();
                  }}
                  className="text-md flex w-full items-center justify-center gap-5 rounded-lg border-2 bg-neutral-50 px-5 py-2.5 text-center font-medium text-black hover:bg-neutral-100 focus:outline-none focus:ring-4 focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
                >
                  <FaGoogle />
                  Sign Up With Google
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account ?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-black hover:underline dark:text-black"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
