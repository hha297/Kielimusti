import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-kode-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kielimuisti",
    template: "%s · Kielimuisti",
  },
  description: "Personal language knowledge base and recall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kodeMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
