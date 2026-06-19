import HeroSection from "./_components/HeroSection";
import HotelsSection from "./_components/HotelsSection";
import PropertyTypesSection from "./_components/PropertyTypesSection";
import TrendingSection from "./_components/TrendingSection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HotelsSection />
      <PropertyTypesSection />
      <TrendingSection />
      <Footer />
    </main>
  );
}
