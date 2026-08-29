import { Inter } from "next/font/google";
import "../styles/globals.css";
import type { Metadata } from "next";
import RootFrame from "../components/layout/RootFrame";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "RiskSentinel X | Payment Risk Intelligence",
    template: "%s | RiskSentinel X",
  },
  description: "AI-native payment risk intelligence, fraud investigation, and decision automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased selection:bg-primary selection:text-white font-sans">
        <RootFrame>{children}</RootFrame>
      </body>
    </html>
  );
}
