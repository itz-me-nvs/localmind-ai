import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Ollama UI",
  description: "A UI library for Ollama",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`} // Changed overflow to auto for better scrolling behavior
      >
        {children}
        <Toaster richColors position="top-right" /> {/* Optimized Toaster for better UX */}
      </body>
    </html>
  );
}
