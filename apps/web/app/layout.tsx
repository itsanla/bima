import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";
import { site } from "./_data/site";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: "Bima - pantau kukusan baglog dari layar HP",
  description:
    "Aplikasi Android untuk memantau suhu, lama pengukusan, dan nyala api pada alat sterilisasi baglog jamur tiram. Program pemberdayaan Politeknik Negeri Padang.",
  applicationName: "Bima",
  keywords: [
    "jamur tiram",
    "baglog",
    "sterilisasi baglog",
    "monitoring suhu",
    "aplikasi android petani jamur",
    "Politeknik Negeri Padang",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: `https://${site.domain}`,
    siteName: "Bima",
    title: "Bima - pantau kukusan baglog dari layar HP",
    description:
      "Suhu, lama pengukusan, dan nyala api dari alat kukus baglog, tampil langsung di HP.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bima - pantau kukusan baglog dari layar HP",
    description:
      "Suhu, lama pengukusan, dan nyala api dari alat kukus baglog, tampil langsung di HP.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f17",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>
        {/* Tanpa JavaScript, isi yang menunggu animasi masuk layar tetap harus
            terbaca. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
