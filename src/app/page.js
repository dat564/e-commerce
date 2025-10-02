import {
  HeroBanner,
  AboutSection,
  CategoriesSection,
  ProductsSection,
  FloatingElements,
} from "@/components/home";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-[600px] bg-white">
        {/* Hero Banner Section */}
        <HeroBanner />

        {/* About Section */}
        <AboutSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Floating Elements */}
        <FloatingElements />
      </div>
    </PageTransition>
  );
}
