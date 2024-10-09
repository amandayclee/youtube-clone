import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./navbar/navbar";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Youtube",
  description: "Youtube Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className="bg-zinc-900 ">
        <Navbar />
        {/*  */}

        <div className="ml-20">{children}</div>
      </body>
    </html>
  );
}
