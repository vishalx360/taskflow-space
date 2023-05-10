import Image from "next/image";
import Link from "next/link";

import BENIFIT_1_IMG from "../../../public/benifit_1.png";
import BENIFIT_2_IMG from "../../../public/benifit_2.png";
import BENIFIT_3_IMG from "../../../public/benifit_3.png";

const benifits = [
  {
    poster: "#",
    image: BENIFIT_1_IMG,
    title: "Custom backgrounds",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et adipisci eos eligendi illum alias distinctio, ea rem nam sint repellendus voluptatem aliquam dolor rerum nostrum voluptatibus eum mollitia ratione deleniti.",
  },
  {
    poster: "#",
    image: BENIFIT_2_IMG,
    title: "Custom Boards",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et adipisci eos eligendi illum alias distinctio, ea rem nam sint repellendus voluptatem aliquam dolor rerum nostrum voluptatibus eum mollitia ratione deleniti.",
  },
  {
    poster: "#",
    image: BENIFIT_3_IMG,
    title: "Bring all your team",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et adipisci eos eligendi illum alias distinctio, ea rem nam sint repellendus voluptatem aliquam dolor rerum nostrum voluptatibus eum mollitia ratione deleniti.",
  },
];

function BenifitsSection() {
  return (
    <section
      id="benifits"
      className="min-h-screen scroll-mt-16 bg-gradient-to-b from-black/10 to-white "
    >
      <div className="container mx-auto px-6 py-16 ">
        <div className="space-y-4">
          <h1 className="whitespace-nowrap text-sm font-semibold text-blue-500">
            WHY USE TASKFLOW.SPACE
          </h1>
          <div className="mb-10 flex max-w-4xl flex-col  gap-10 md:flex-row md:items-center md:gap-20">
            <h1 className=" text-xl font-bold  leading-7 text-gray-800 lg:text-3xl">
              Easy, Simple, Affordable{" "}
            </h1>
            <p className="w-md text-gray-500">
              Our platform helps your business in managing expenses. These are
              some of the reasons why you should use our platform in managing
              business finances.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-rows-3 gap-10 md:grid-cols-3 md:grid-rows-1">
          {benifits.map((benifit) => {
            return (
              <div key={benifit.title} className="space-y-10">
                <div className="group row-span-3 aspect-video overflow-hidden rounded-md bg-neutral-200 md:aspect-square lg:row-span-5 ">
                  <Image
                    alt="Poster"
                    width={800}
                    height={800}
                    placeholder="blur"
                    className="h-full w-full rounded-xl border object-cover shadow-2xl transition-all duration-700  md:translate-x-14  md:translate-y-14 md:group-hover:translate-x-12 md:group-hover:translate-y-12"
                    src={benifit.image}
                  />
                </div>
                <div className="row-span-2 space-y-2 p-1 text-left lg:row-span-1">
                  <h1 className="text-2xl font-medium">{benifit.title}</h1>
                  <p>{benifit.description}</p>
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
