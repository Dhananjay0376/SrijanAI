import type { Metadata } from "next";
import { AppProvider } from "../components/app-provider";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SnowOverlay } from "../components/snow-overlay";
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
      <body>
        <AppProvider>
          <SnowOverlay />
          <div className="site-shell">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
