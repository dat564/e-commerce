"use client";

import { useEffect } from "react";
import {
  HeroBanner,
  AboutSection,
  CategoriesSection,
  ProductsSection,
  FloatingElements,
} from "@/components/home";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  // Handle scroll to section from URL hash
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.substring(1); // Remove the # symbol
        const element = document.getElementById(elementId);

        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        } else if (elementId === "footer") {
          // Scroll to bottom of page
          setTimeout(() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    };

    // Handle initial load
    handleHashScroll();

    // Handle hash changes (when navigating with browser back/forward)
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-[600px] bg-white">
        {/* Hero Banner Section */}
        <HeroBanner />

        {/* About Section */}
        <div id="about">
          <AboutSection />
        </div>

        {/* Products Section */}
        <ProductsSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Floating Elements */}
        <FloatingElements />
      </div>
    </PageTransition>
  );
}
