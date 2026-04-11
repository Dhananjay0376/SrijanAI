import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SrijanAI",
  description: "AI-powered monthly content planning for creators and brands.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

