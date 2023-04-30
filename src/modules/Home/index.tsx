import { SubscriptionSection } from "../Settings/subscriptionSection";
import BenifitsSection from "./BenifitsSection";
import HeroSection from "./HeroSection";
import HomeNavbar from "./HomeNavbar";

function Home() {
  return (
    <>
      <HomeNavbar />
      <HeroSection />
      <BenifitsSection />
      <SubscriptionSection />
    </>
  );
}

export default Home;
