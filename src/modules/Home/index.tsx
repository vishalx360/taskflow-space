import StripeSubcription, {
  SubscriptionSection,
} from "../Settings/subscriptionSection";
import AboutSection from "./AboutSection";
import BenifitsSection from "./BenifitsSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import HomeNavbar from "./HomeNavbar";
import PricingSection from "./PricingSection";

function Home() {
  return (
    <>
      <HomeNavbar />
      <HeroSection />
      <BenifitsSection />
      <FeaturesSection />
      <PricingSection />
      <AboutSection />
    </>
  );
}

export default Home;
