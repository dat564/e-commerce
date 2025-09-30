"use client";

import { LoadingProvider } from "@/contexts/LoadingContext";
import { CartProvider } from "@/contexts/CartContext";
import { CustomRecoilRoot } from "@/store";
import { NotificationProvider } from "@/contexts/NotificationContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ClientProviders({ children }) {
  return (
    <LoadingProvider>
      <CustomRecoilRoot>
        <CartProvider>
          <NotificationProvider>
            {children}
            <LoadingSpinner />
          </NotificationProvider>
        </CartProvider>
      </CustomRecoilRoot>
    </LoadingProvider>
  );
}
