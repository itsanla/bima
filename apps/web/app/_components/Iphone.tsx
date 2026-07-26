import type { CSSProperties, ReactNode } from "react";

/* ==========================================================================
   Bingkai iPhone 16 Pro.

   Semua ukuran diturunkan dari perbandingan aslinya (393 x 852 pt, sudut 55 pt,
   Dynamic Island 125 x 36 pt pada 11 pt dari atas), lalu diskalakan dari satu
   nilai lebar. Jadi berapa pun lebarnya, bentuknya tetap proporsional.
   ========================================================================== */

const RASIO_TINGGI = 852 / 393;
const RASIO_SUDUT = 55 / 393;
const RASIO_PULAU_L = 125 / 393;
const RASIO_PULAU_T = 36 / 393;
const RASIO_PULAU_ATAS = 11 / 393;

/** Tombol samping: posisi dan panjang dalam satuan poin iPhone. */
const TOMBOL = [
  { sisi: "kiri", atas: 152, tinggi: 30 }, // tombol aksi
  { sisi: "kiri", atas: 202, tinggi: 62 }, // volume naik
  { sisi: "kiri", atas: 276, tinggi: 62 }, // volume turun
  { sisi: "kanan", atas: 228, tinggi: 94 }, // tombol daya
] as const;

export default function Iphone({
  lebar = 300,
  children,
  className = "",
  style,
  label,
}: {
  /** Lebar bingkai luar dalam piksel. */
  lebar?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  const s = lebar / 393; // skala poin ke piksel
  const tinggi = lebar * RASIO_TINGGI;
  const sudut = lebar * RASIO_SUDUT;
  const tebalRangka = Math.max(2.6, lebar * 0.0105);
  const tebalBezel = Math.max(1.6, lebar * 0.006);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: lebar, height: tinggi, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {/* Tombol samping, digambar di belakang badan supaya terlihat menempel */}
      {TOMBOL.map((t, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="rangka-titanium absolute"
          style={{
            top: t.atas * s,
            height: t.tinggi * s,
            width: Math.max(2, 3 * s),
            [t.sisi === "kiri" ? "left" : "right"]: -Math.max(1.5, 2.2 * s),
            borderRadius: 2,
          }}
        />
      ))}

      {/* Badan titanium */}
      <div
        className="rangka-titanium absolute inset-0"
        style={{
          borderRadius: sudut,
          padding: tebalRangka,
          boxShadow:
            "0 2px 4px rgba(10,53,32,0.10), 0 30px 60px -18px rgba(10,53,32,0.38), 0 60px 90px -40px rgba(10,53,32,0.28)",
        }}
      >
        {/* Bezel hitam */}
        <div
          className="h-full w-full bg-black"
          style={{ borderRadius: sudut - tebalRangka, padding: tebalBezel }}
        >
          {/* Layar */}
          <div
            className="relative h-full w-full overflow-hidden bg-white"
            style={{ borderRadius: sudut - tebalRangka - tebalBezel }}
          >
            {children}

            {/* Dynamic Island */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 bg-black"
              style={{
                top: lebar * RASIO_PULAU_ATAS,
                width: lebar * RASIO_PULAU_L,
                height: lebar * RASIO_PULAU_T,
                borderRadius: (lebar * RASIO_PULAU_T) / 2,
              }}
            />

            {/* Garis geser bawah */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/25"
              style={{
                bottom: 8 * s,
                width: lebar * 0.35,
                height: Math.max(3, 5 * s),
              }}
            />
          </div>
        </div>
      </div>

      {/* Pantulan cahaya tipis di sisi kiri atas, supaya kacanya terasa kaca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: sudut,
          background:
            "linear-gradient(128deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.10) 16%, rgba(255,255,255,0) 34%)",
        }}
      />
    </div>
  );
}
