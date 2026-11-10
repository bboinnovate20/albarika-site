import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const figtree = localFont({
  src: [
    { path: "../fonts/figtree-500.ttf", weight: "500", style: "normal" },
    { path: "../fonts/figtree-600.ttf", weight: "600", style: "normal" },
    { path: "../fonts/figtree-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-figtree",
  display: "swap",
});

const unbounded = localFont({
  src: [
    { path: "../fonts/unbounded-700.ttf", weight: "700", style: "normal" },
    { path: "../fonts/unbounded-800.ttf", weight: "800", style: "normal" },
    { path: "../fonts/unbounded-900.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});

const greatVibes = localFont({
  src: "../fonts/great-vibes-400.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-great-vibes",
  display: "swap",
});

const jetbrains = localFont({
  src: [
    { path: "../fonts/jetbrains-500.ttf", weight: "500", style: "normal" },
    { path: "../fonts/jetbrains-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://albarika.vercel.app"),
  title: "Albarika Computer Institute — Your Gateway to Quality Computing Services",
  description:
    "Practical IT training and dependable computing services in Lagos Island: courses, design, typesetting, documents, exam registration and computer repair.",
  openGraph: {
    title: "Albarika Computer Institute",
    description:
      "Practical IT training and dependable computing services: design, typesetting, documents, exam registration and computer repair.",
    images: ["/image/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${unbounded.variable} ${jetbrains.variable} ${greatVibes.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
        <WhatsAppFloat />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
