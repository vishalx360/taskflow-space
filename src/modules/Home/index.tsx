import Image from "next/image";
import Link from "next/link";
import POSTER_URL from "../../../public/poster.png";
import HomeNavbar from "./HomeNavbar";

function Home() {
  return (
    <>
      <section className="bg-white ">
        <HomeNavbar />
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
              className="text-md mt-6 inline-block  rounded-lg bg-black px-8 py-3 text-center font-bold  leading-5 text-white hover:bg-black/80 focus:outline-none lg:mx-0 lg:w-auto"
            >
              Get Started for free
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
