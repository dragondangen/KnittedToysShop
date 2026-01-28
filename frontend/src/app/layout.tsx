import type { Metadata } from "next";
import { Literata, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthHydrate from "@/components/AuthHydrate";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Магазин вязаных игрушек",
  description: "Каталог вязаных игрушек. Заказы через Telegram.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${literata.variable} ${lora.variable} min-h-screen bg-[#faf9f7] font-sans text-[#2c1810] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <AuthHydrate />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
