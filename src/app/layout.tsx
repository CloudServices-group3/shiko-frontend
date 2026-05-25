import type { Metadata } from "next";
import { archivo } from "./fonts"
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}