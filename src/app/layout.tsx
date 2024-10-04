import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"], 
  variable: "--font-roboto", 
});

export const metadata: Metadata = {
  title: "YumTogether",
  description: "A calorie tracker for you and your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} grid grid-rows-[1fr_auto] min-h-screen overflow-x-hidden`}
      >
        <main className="flex flex-col w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
