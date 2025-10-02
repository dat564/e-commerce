"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component tự động scroll lên đầu trang khi chuyển route
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Smooth scroll animation
    });
  }, [pathname]);

  return null; // Component không render gì
}
