import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/Cursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GTA V RADIO",
  description: "Listen to GTA V radio stations on the web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children} <CustomCursor />
      </body>
    </html>
  );
}
