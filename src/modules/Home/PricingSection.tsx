import { SubscriptionSection } from "../Settings/subscriptionSection";

function PricingSection() {
  return (
    <section
      id="pricing"
      className="min-h-screen bg-gradient-to-b from-white to-black/10 "
    >
      <div className="container mx-auto px-6 py-16 ">
        <div className="mb-10 flex flex-col items-center justify-center ">
          <h1 className="my-5 text-[2.5rem] font-bold">Pricing</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </div>
        <SubscriptionSection />
      </div>
    </section>
  );
}

export default PricingSection;
