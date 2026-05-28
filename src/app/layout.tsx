import type { Metadata } from "next";
import { archivo } from "./fonts"
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Shiko LMS",
  description: "Learning Management System for Shiko",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <Script src="https://accounts.google.com/gsi/client" async />
        {children}
        </body>
    </html>
  );
}