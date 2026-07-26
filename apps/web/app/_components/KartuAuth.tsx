import Link from "next/link";
import type { ReactNode } from "react";
import LogoInstansi from "./LogoInstansi";

/** Bingkai bersama untuk halaman masuk, daftar, dan verifikasi. */
export default function KartuAuth({
  judul,
  keterangan,
  children,
  bawah,
}: {
  judul: string;
  keterangan?: ReactNode;
  children: ReactNode;
  bawah?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-mint px-5 py-14">
      <div
        aria-hidden="true"
        className="tekstur-daun pointer-events-none absolute inset-0"
      />

      <div className="relative w-full max-w-[27rem]">
        <Link
          href="/"
          className="mb-7 flex items-center justify-center gap-3"
          aria-label="Kembali ke halaman utama Steamlog"
        >
          <LogoInstansi tinggi={30} />
          <span aria-hidden="true" className="h-7 w-px bg-hijau-tua/15" />
          <span className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-hijau-tua">
            Steamlog
          </span>
        </Link>

        <div className="rounded-3xl border border-garis bg-white px-7 py-8 shadow-[0_1px_2px_rgba(10,53,32,0.04),0_18px_40px_-24px_rgba(10,53,32,0.28)] sm:px-9">
          <h1 className="text-[1.5rem] leading-tight font-extrabold tracking-[-0.03em] text-hijau-tua">
            {judul}
          </h1>
          {keterangan ? (
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-abu">
              {keterangan}
            </p>
          ) : null}
          <div className="mt-7">{children}</div>
        </div>

        {bawah ? (
          <p className="mt-6 text-center text-[0.92rem] text-abu">{bawah}</p>
        ) : null}
      </div>
    </main>
  );
}

/* -- Bagian formulir yang dipakai berulang --------------------------------- */

export function Kolom({
  label,
  ...sisa
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.88rem] font-semibold text-hijau-tua">
        {label}
      </span>
      <input
        {...sisa}
        className="w-full rounded-xl border border-garis bg-white px-4 py-3 text-[0.98rem] text-arang outline-none transition-colors placeholder:text-abu/60 focus:border-hijau"
      />
    </label>
  );
}

export function Peringatan({
  jenis = "galat",
  children,
}: {
  jenis?: "galat" | "berhasil";
  children: ReactNode;
}) {
  const gaya =
    jenis === "galat"
      ? "border-api/25 bg-api/8 text-api"
      : "border-hijau/25 bg-hijau/8 text-hijau";
  return (
    <p
      role={jenis === "galat" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-[0.9rem] leading-relaxed ${gaya}`}
    >
      {children}
    </p>
  );
}

export function TombolKirim({
  memuat,
  children,
}: {
  memuat: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={memuat}
      className="w-full rounded-full bg-hijau px-6 py-3.5 text-[0.98rem] font-bold text-white transition-colors hover:bg-hijau-tua disabled:cursor-not-allowed disabled:opacity-60"
    >
      {memuat ? "Mohon tunggu..." : children}
    </button>
  );
}
