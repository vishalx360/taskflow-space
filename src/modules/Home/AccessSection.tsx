import Image from "next/image";

import Mockup from "@/../public/mockup.png";


function AccessSection() {
  return (
    <section
      id="aboutus"
      className="min-h-[50vh] scroll-mt-16 scroll-smooth bg-gradient-to-b from-white to-black/10 "
    >
      <div className="container mx-auto max-w-[900px] px-6 py-16 ">
        <div className="p-2">
          <h1 className="my-5 text-center text-[2.5rem] font-bold">
            Experience Seamless Productivity Anywhere!
          </h1>

          <div className="space-y-3 text-neutral-700 md:text-xl">
            <p className="text-center">
              Experience seamless productivity on any device. Our responsive
              design allows easy access and consistent performance on phone,
              tablet, and desktop. Stay organized and efficient, wherever you
              go!
            </p>
          </div>
          <div className="flex w-full items-center justify-center p-5 py-10">
            <Image alt="mockup" src={Mockup} height={300} width={500} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccessSection;
