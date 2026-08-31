import { Inter, Instrument_Serif } from "next/font/google";
import "../styles/globals.css";
import "../styles/premium.css";
import type { Metadata } from "next";
import RootFrame from "../components/layout/RootFrame";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: {
    default: "RiskSentinel X | Payment Risk Intelligence",
    template: "%s | RiskSentinel X",
  },
  description: "Next-gen payment risk intelligence, fraud investigation, and decision automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased selection:bg-primary selection:text-white font-sans">
        <RootFrame>{children}</RootFrame>
      </body>
    </html>
  );
}
