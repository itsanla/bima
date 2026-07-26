"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ambilDetailSesi,
  ambilGrafik,
  GalatApi,
  type BarisLog,
  type Halaman,
  type TitikGrafik,
} from "../../../_lib/api";
import { jamMenitDetik, waktuPanjang } from "../../../_lib/format";
import GrafikSesi from "../../../_components/GrafikSesi";

const PILIHAN_INTERVAL = [
  { nilai: "all", label: "Semua bacaan" },
  { nilai: "10m", label: "Rata-rata 10 menit" },
  { nilai: "1h", label: "Rata-rata 1 jam" },
] as const;

type Interval = (typeof PILIHAN_INTERVAL)[number]["nilai"];

export default function DetailSesi() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = decodeURIComponent(params.sessionId);

  const [interval, setInterval] = useState<Interval>("all");
  const [titik, setTitik] = useState<TitikGrafik[] | null>(null);
  const [galatGrafik, setGalatGrafik] = useState<string | null>(null);

  const [riwayat, setRiwayat] = useState<BarisLog[]>([]);
  const [mulai, setMulai] = useState<string | null>(null);
  const [halaman, setHalaman] = useState<Halaman | null>(null);
  const [nomor, setNomor] = useState(1);
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    const kendali = new AbortController();
    setTitik(null);
    setGalatGrafik(null);
    ambilGrafik(sessionId, interval, kendali.signal)
      .then((d) => setTitik(d.map((t) => ({ ...t, avg_suhu: Number(t.avg_suhu) }))))
      .catch((err) => {
        if (kendali.signal.aborted) return;
        setGalatGrafik(
          err instanceof GalatApi ? err.message : "Gagal mengambil grafik",
        );
      });
    return () => kendali.abort();
  }, [sessionId, interval]);

  useEffect(() => {
    const kendali = new AbortController();
    setGalat(null);
    ambilDetailSesi(sessionId, { page: nomor, signal: kendali.signal })
      .then((hasil) => {
        setRiwayat(hasil.data.history);
        setMulai(hasil.data.createdAt);
        setHalaman(hasil.pagination);
      })
      .catch((err) => {
        if (kendali.signal.aborted) return;
        setGalat(
          err instanceof GalatApi ? err.message : "Gagal mengambil riwayat sesi",
        );
      });
    return () => kendali.abort();
  }, [sessionId, nomor]);

  return (
    <>
      <Link
        href="/riwayat"
        className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-abu transition-colors hover:text-hijau-tua"
      >
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12.5 4-6 6 6 6" />
        </svg>
        Semua sesi
      </Link>

      <h1 className="t-readout mt-4 text-[1.7rem] font-extrabold tracking-[-0.02em] text-hijau-tua">
        {sessionId}
      </h1>
      <p className="mt-1 text-[0.95rem] text-abu">
        {mulai ? `Mulai ${waktuPanjang(mulai)}` : "Memuat keterangan sesi..."}
        {halaman ? ` / ${halaman.total} bacaan tersimpan` : ""}
      </p>

      {galat ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-api/25 bg-api/8 px-5 py-4 text-[0.9rem] text-api"
        >
          {galat}
        </p>
      ) : null}

      {/* Grafik ---------------------------------------------------------- */}
      <section className="mt-7 overflow-hidden rounded-3xl border border-garis bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-garis px-6 py-4">
          <h2 className="font-bold text-hijau-tua">Grafik suhu</h2>
          <div className="flex flex-wrap gap-2">
            {PILIHAN_INTERVAL.map((p) => (
              <button
                key={p.nilai}
                onClick={() => setInterval(p.nilai)}
                aria-pressed={interval === p.nilai}
                className={`rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                  interval === p.nilai
                    ? "bg-hijau text-white"
                    : "border border-garis text-abu hover:bg-mint"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 py-5 sm:px-6">
          {galatGrafik ? (
            <p className="py-12 text-center text-[0.92rem] text-api">
              {galatGrafik}
            </p>
          ) : titik === null ? (
            <p className="py-12 text-center text-[0.92rem] text-abu">
              Memuat grafik...
            </p>
          ) : titik.length === 0 ? (
            <p className="py-12 text-center text-[0.92rem] text-abu">
              Belum ada titik pada rentang ini. Rata-rata 10 menit dan 1 jam
              dihitung berkala di server, jadi sesi yang baru saja berjalan
              mungkin baru terlihat di pilihan Semua bacaan.
            </p>
          ) : (
            <GrafikSesi titik={titik} />
          )}
        </div>
      </section>

      {/* Riwayat mentah --------------------------------------------------- */}
      <section className="mt-4 overflow-hidden rounded-3xl border border-garis bg-white">
        <h2 className="border-b border-garis px-6 py-4 font-bold text-hijau-tua">
          Bacaan tersimpan
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-[0.88rem]">
            <thead className="bg-kabut text-[0.75rem] tracking-wide text-abu uppercase">
              <tr>
                <th className="px-6 py-2.5 font-semibold">Jam</th>
                <th className="px-3 py-2.5 font-semibold">Suhu</th>
                <th className="px-3 py-2.5 font-semibold">Timer</th>
                <th className="px-3 py-2.5 font-semibold">Api</th>
                <th className="px-3 py-2.5 font-semibold">Air</th>
                <th className="px-6 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {riwayat.map((b) => (
                <tr key={b.id}>
                  <td className="t-readout px-6 py-2.5 text-abu">
                    {jamMenitDetik(b.createdAt)}
                  </td>
                  <td className="t-readout px-3 py-2.5 font-semibold text-hijau-tua">
                    {b.suhu.toFixed(1)}
                  </td>
                  <td className="t-readout px-3 py-2.5 text-abu">{b.timer}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={
                        b.api.toUpperCase() === "ON"
                          ? "font-semibold text-api"
                          : "text-abu"
                      }
                    >
                      {b.api.toUpperCase() === "ON" ? "Menyala" : "Mati"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={b.air_habis ? "text-api" : "text-abu"}>
                      {b.air_habis ? "Habis" : "Cukup"}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-abu">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {halaman && halaman.totalPages > 1 ? (
          <div className="flex items-center justify-between gap-4 border-t border-garis px-6 py-4">
            <button
              onClick={() => setNomor((n) => Math.max(1, n - 1))}
              disabled={nomor <= 1}
              className="rounded-full border border-garis px-4 py-2 text-[0.85rem] font-semibold text-hijau-tua transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-45"
            >
              Sebelumnya
            </button>
            <span className="text-[0.85rem] text-abu">
              Halaman {halaman.page} dari {halaman.totalPages}
            </span>
            <button
              onClick={() => setNomor((n) => n + 1)}
              disabled={nomor >= halaman.totalPages}
              className="rounded-full border border-garis px-4 py-2 text-[0.85rem] font-semibold text-hijau-tua transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-45"
            >
              Berikutnya
            </button>
          </div>
        ) : null}
      </section>
    </>
  );
}
