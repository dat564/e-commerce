"use client";

import { useNavigation } from "@/hooks/useNavigation";

export default function PageTransition({ children }) {
  useNavigation(); // This will handle stopping the loading when navigation completes

  return <>{children}</>;
}
