import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Header } from "@/components/ui/header";
import { NextAuthProvider } from "@/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyTokyoGem - Solo Travel Spots in Tokyo",
  description: "Discover hidden gems in Tokyo perfect for solo travelers. Local spots recommended by Solo Adventure Lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <NextAuthProvider>
          <LanguageProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </LanguageProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
