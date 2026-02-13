import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import PageFadeIn from "@/components/PageFadeIn";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yashraj Nikam — Chessfolio",
  description: "Systems. Strategy. Execution.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Yashraj Nikam — Chessfolio",
    description: "Systems. Strategy. Execution.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll />
        <CustomCursor />
        <PageFadeIn>{children}</PageFadeIn>
      </body>
    </html>
  );
}
