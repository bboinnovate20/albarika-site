import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Albarika Computer Centre - Your Gateway to Quality Computing Services",
  description: "Comprehensive computing solutions and technology education. From professional training programs to document services, computer maintenance, and exam preparation - your complete computing partner.",
  icons: {
    icon: "/image/logo.jpeg",
    shortcut: "/image/logo.jpeg",
    apple: "/image/logo.jpeg",
  },
  openGraph: {
    title: "Albarika Computer Centre - Your Gateway to Quality Computing Services",
    description: "Comprehensive computing solutions and technology education. From professional training programs to document services, computer maintenance, and exam preparation - your complete computing partner.",
    images: ["/image/logo.jpeg"], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
