import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bima - Live IoT Test Monitor",
  description: "Monitor koneksi WebSocket (WSS/WS) dan HTTP/HTTPS perangkat IoT secara real-time",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
