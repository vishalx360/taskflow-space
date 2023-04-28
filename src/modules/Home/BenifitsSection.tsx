import Image from "next/image";
import Link from "next/link";
import POSTER_URL from "../../../public/poster.png";

const benifits = [
  {
    poster: "#",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et adipisci eos eligendi illum alias distinctio, ea rem nam sint repellendus voluptatem aliquam dolor rerum nostrum voluptatibus eum mollitia ratione deleniti.",
  },
  {
    poster: "#",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et adipisci eos eligendi illum alias distinctio, ea rem nam sint repellendus voluptatem aliquam dolor rerum nostrum voluptatibus eum mollitia ratione deleniti.",
  },
  {
    poster: "#",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et adipisci eos eligendi illum alias distinctio, ea rem nam sint repellendus voluptatem aliquam dolor rerum nostrum voluptatibus eum mollitia ratione deleniti.",
  },
];

function BenifitsSection() {
  return (
    <section className=" h-screen bg-white ">
      <div className="container mx-auto px-6 py-16 ">
        <div className="flex max-w-4xl items-center gap-20">
          <div>
            <h1 className="whitespace-nowrap text-sm font-semibold text-blue-500">
              WHY USE TASKFLOW.SPACE
            </h1>
            <h1 className=" text-xl font-bold  leading-7 text-gray-800 lg:text-3xl">
              Easy, Simple, Affordable{" "}
            </h1>
          </div>
          <p className="w-md text-gray-500">
            Our platform helps your business in managing expenses. These are
            some of the reasons why you should use our platform in managing
            business finances.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 grid-rows-5">
          {benifits.map((benifit) => {
            return (
              <div key={benifit.title} className="bg-blue-400 p-2">
                <div className="col-rows-4 bg-red-400">
                  <Image
                    alt="Poster"
                    width={300}
                    height={600}
                    placeholder="blur"
                    className="h-full"
                    src={POSTER_URL}
                  />
                </div>
                <div className="col-rows-1 bg-green-400 text-left">
                  <h1>Feature 1</h1>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Nisi, cupiditate.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BenifitsSection;
