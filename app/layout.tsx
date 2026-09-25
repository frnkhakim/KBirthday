import type { Metadata, Viewport } from "next";
import "@fontsource/pinyon-script/400.css";
import "@fontsource/bodoni-moda/400-italic.css";
import "@fontsource/bodoni-moda/600.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import { config } from "@/lib/config";

const title = `${config.name}'s ${config.age}st`;
const description = "You are cordially invited. Tap to open.";

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title,
  description,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title, statusBarStyle: "default" },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#F4DCD6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
