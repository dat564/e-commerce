"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { useState, useEffect } from "react";

export default function LoadingLink({
  href,
  children,
  className = "",
  loadingText = "Đang chuyển trang...",
  ...props
}) {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset navigating state when pathname changes (navigation completed)
  useEffect(() => {
    if (isNavigating && pathname === href) {
      setIsNavigating(false);
      stopLoading();
    }
  }, [pathname, href, isNavigating, stopLoading]);

  const handleClick = (e) => {
    e.preventDefault();

    if (isNavigating) return; // Prevent multiple clicks

    // If already on the same page, don't show loading
    if (pathname === href) {
      return;
    }

    setIsNavigating(true);
    startLoading(loadingText);

    // Navigate with a small delay to ensure loading shows
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className || ""}
      {...props}
    >
      {children}
    </Link>
  );
}
