import Image from "next/image";

import BENIFIT_2_IMG from "../../../public/benifit_2.png";
import BENIFIT_3_IMG from "../../../public/benifit_3.png";
import BENIFIT_1_IMG from "../../../public/passkey.png";

const benifits = [
  {
    poster: "#",
    image: BENIFIT_1_IMG,
    name: "Passkey Support",
    title: "Authentication Made Easy",
    description:
      "Enjoy a secure and hassle-free login process with passkey support, ensuring your data stays protected at all times.",
  },
  {
    poster: "#",
    image: BENIFIT_2_IMG,
    name: "Email Alerts",
    title: "Stay Updated, Stay on Track",
    description:
      "Receive timely email alerts and notifications, keeping you informed about task updates and deadlines, so you never miss a beat.",
  },
  {
    poster: "#",
    image: BENIFIT_3_IMG,
    name: "Real-time Updates",
    title: "Stay in Sync, Always",
    description:
      "Experience real-time updates on tasks and projects, enabling seamless collaboration and ensuring everyone is on the same page.",
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
          <h1 className="whitespace-nowrap text-sm font-semibold text-blue-600">
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
                  <h1 className="text-xl font-medium text-blue-600">
                    {benifit.name}
                  </h1>
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
