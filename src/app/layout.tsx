import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { NextAuthProvider } from "@/providers/session-provider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
  description: "Discover hidden gems in Tokyo perfect for solo travelers. Local spots recommended by Hitoriasobi Lab.",
  icons: {
    icon: "/mytokyogem_logo.png",
    apple: "/mytokyogem_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{colorScheme: 'light'}}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <NextAuthProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </NextAuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
