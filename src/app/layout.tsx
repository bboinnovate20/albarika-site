import "@/lib/db";
import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";


const inter = PT_Sans({
  weight: ["400" , "700"],
   subsets: ["latin"], 
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://albarika.vercel.app"),
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
