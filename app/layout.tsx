import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";

// Load Geist Sans and Geist Mono fonts from Google Fonts
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: false, // Disable preloading to improve performance
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false, // Disable preloading to reduce initial load time
});

// Define metadata for the application (title and description)
export const metadata: Metadata = {
  title: "LocalMind AI",
  description: "Local AI for better developer experience(dx)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}
        antialiased overflow-hidden bg-background-secondary text-text-light dark:text-text-dark transition-colors duration-500`} // Changed overflow to auto for better scrolling behavior
      >
        <StoreProvider>{children}</StoreProvider>
        <Toaster position="top-right" /> {/* Optimized Toaster for better UX */}
      </body>
    </html>
  );
}
