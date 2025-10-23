import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useScrollToSection = () => {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = useCallback(
    (sectionId) => {
      // Nếu đang ở trang home, scroll trực tiếp
      if (pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        // Nếu không ở trang home, chuyển về home và scroll
        router.push(`/#${sectionId}`);
      }
    },
    [router, pathname]
  );

  const scrollToFooter = useCallback(() => {
    // Nếu đang ở trang home, scroll xuống cuối trang
    if (pathname === "/") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      // Nếu không ở trang home, chuyển về home và scroll xuống cuối
      router.push("/#footer");
    }
  }, [router, pathname]);

  return { scrollToSection, scrollToFooter };
};
