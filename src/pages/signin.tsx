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
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <a href="#" className="tracking-widest flex items-center mb-8 text-5xl font-normal text-gray-900 dark:text-white">
            {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
            VIRA
          </a>
          <div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 tracking-wider border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="•••••••••••" className="tracking-widest bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-black dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-black dark:ring-offset-gray-800" required />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-black hover:underline dark:text-black">Forgot password?</a>
                </div>
                <button type="submit" className="w-full text-white bg-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">Sign in</button>
                <button
                  onClick={() => {
                    void handelSignin();
                  }}
                  className="w-full flex items-center justify-center gap-5 text-black bg-neutral-50 border-2 hover:bg-neutral-100 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black">
                  <FaGoogle />
                  Sign In With Google
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <Link href="/signup" className="font-medium text-black hover:underline dark:text-black">Sign up</Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
