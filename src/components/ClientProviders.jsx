"use client";

import { LoadingProvider } from "@/contexts/LoadingContext";
import { CartProvider } from "@/contexts/CartContext";
import { CustomRecoilRoot } from "@/store";
import { NotificationProvider } from "@/contexts/NotificationContext";
import GlobalLoadingSpinner from "@/components/GlobalLoadingSpinner";

export default function ClientProviders({ children }) {
  return (
    <LoadingProvider>
      <CustomRecoilRoot>
        <CartProvider>
          <NotificationProvider>
            {children}
            <GlobalLoadingSpinner />
          </NotificationProvider>
        </CartProvider>
      </CustomRecoilRoot>
    </LoadingProvider>
  );
}
