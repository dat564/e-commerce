import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders>
          <ClientLayout>{children}</ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
