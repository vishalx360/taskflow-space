import StripeSubcription, {
  SubscriptionSection,
} from "../Settings/subscriptionSection";

function PricingSection() {
  return (
    <section
      id="pricing"
      className="min-h-screen scroll-mt-16 border-b-2 bg-white pt-6 "
    >
      <div className="container mx-auto px-6 py-6 ">
        <div className="mb-10 flex flex-col items-center justify-center ">
          <h1 className="my-5 text-[2.5rem] font-bold">Pricing</h1>
          <p className="text-center">
            No matter the size of your team or the scale of your operations,
            we&apos;ve got you covered.
          </p>
        </div>
        {/* <SubscriptionSection /> */}
        <StripeSubcription />
      </div>
    </section>
  );
}

export default PricingSection;
