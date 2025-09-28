"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export function useNavigation() {
  const pathname = usePathname();
  const { stopLoading } = useLoading();

  useEffect(() => {
    // Stop loading when pathname changes (navigation completed)
    stopLoading();
  }, [pathname, stopLoading]);
}
