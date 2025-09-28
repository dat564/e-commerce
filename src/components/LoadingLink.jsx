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
  const { startLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Reset navigating state when pathname changes (navigation completed)
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleClick = (e) => {
    e.preventDefault();

    if (isNavigating) return; // Prevent multiple clicks

    setIsNavigating(true);
    startLoading(loadingText);

    // Navigate immediately but keep loading visible
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
}
