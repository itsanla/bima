import type { Metadata } from "next";
import "./globals.css";
import "./naxos.css";

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
