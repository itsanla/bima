import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naxos — App Landing Page",
  description: "Best landing for your App showcase. Follow other investors, discover companies to believe in.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Naxos Template CSS — served from public/ folder, not imported via CSS @import */}
        <link rel="stylesheet" href="/naxos_assets/e44bc1ceb6ea6728.css" />
        <link rel="stylesheet" href="/naxos_assets/73e628e842813242.css" />
        <link rel="stylesheet" href="/naxos_assets/red.css" />
        <link rel="stylesheet" href="/naxos_assets/www-player.css" />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
