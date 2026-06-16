import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MouseGlow from "@/components/ui/MouseGlow";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krishnaruparelia.dev"),
  title: {
    default: "Krishna Ruparelia — Senior Full-Stack Engineer",
    template: "%s · Krishna Ruparelia",
  },
  description:
    "Krishna Ruparelia is a senior full-stack engineer in Mumbai building production AI systems and the products around them. Currently at Blackbox.AI.",
  keywords: [
    "Krishna Ruparelia",
    "Full-Stack Engineer",
    "AI Engineer",
    "Next.js",
    "React",
    "Python",
    "LLM",
    "Mumbai",
    "Blackbox.AI",
  ],
  authors: [{ name: "Krishna Ruparelia" }],
  creator: "Krishna Ruparelia",
  openGraph: {
    title: "Krishna Ruparelia — Senior Full-Stack Engineer",
    description:
      "Building production AI systems and the products around them. Senior full-stack engineer, Mumbai.",
    type: "website",
    locale: "en_IN",
    images: ["/krishna.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna Ruparelia — Senior Full-Stack Engineer",
    description:
      "Building production AI systems and the products around them.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="noise antialiased">
        <MouseGlow />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111111",
              color: "#fafafa",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "var(--font-geist-sans)",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#c5fd6c", secondary: "#0a0a0a" },
            },
          }}
        />
      </body>
    </html>
  );
}
