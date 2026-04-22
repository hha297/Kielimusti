import type { Metadata } from "next";
import { VT323 } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const vt323 = VT323({
  subsets: ["latin", "latin-ext"],
  variable: "--font-vt323",
  weight: "400",
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
      className={`${vt323.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-base leading-relaxed text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
