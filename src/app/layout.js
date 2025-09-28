import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "M.O.B - Shop mỹ phẩm cao cấp",
  description: "M.O.B - Cửa hàng mỹ phẩm và chăm sóc cơ thể cao cấp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LoadingProvider>
          <AuthProvider>
            <CartProvider>
              <ClientLayout>{children}</ClientLayout>
              <LoadingSpinner />
            </CartProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
