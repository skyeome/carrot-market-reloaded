import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | 담금마켓", default: "담금마켓" },
  description: "담금마켓 클론코딩",
};

export default function RootLayout({
  children,
  // @ts-ignore
  potato,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {potato}
        {children}
      </body>
    </html>
  );
}
