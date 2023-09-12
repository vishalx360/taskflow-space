import AboutSection from "./AboutSection";
import BenifitsSection from "./BenifitsSection";
import FeaturesSection from "./FeaturesSection";
import FooterSection from "./FooterSection";
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
      {/* <AccessSection /> */}
      <AboutSection />
      <FooterSection />
    </>
  );
}

export default Home;
