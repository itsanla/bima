"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ambilSesi, GalatApi, type Halaman, type Sesi } from "../../_lib/api";
import { waktuPanjang } from "../../_lib/format";

export default function Riwayat() {
  const [sesi, setSesi] = useState<Sesi[]>([]);
  const [halaman, setHalaman] = useState<Halaman | null>(null);
  const [nomor, setNomor] = useState(1);
  const [cari, setCari] = useState("");
  const [cariTertunda, setCariTertunda] = useState("");
  const [urut, setUrut] = useState<"desc" | "asc">("desc");
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  // Pencarian ditunda supaya tiap ketikan tidak jadi satu permintaan sendiri.
  useEffect(() => {
    const jeda = setTimeout(() => {
      setCari(cariTertunda.trim());
      setNomor(1);
    }, 400);
    return () => clearTimeout(jeda);
  }, [cariTertunda]);

  useEffect(() => {
    const kendali = new AbortController();
    setMemuat(true);
    setGalat(null);

    ambilSesi({
      page: nomor,
      search: cari || undefined,
      sortBy: "createdAt",
      sortOrder: urut,
      signal: kendali.signal,
    })
      .then((hasil) => {
        setSesi(hasil.data);
        setHalaman(hasil.pagination);
      })
      .catch((err) => {
        if (kendali.signal.aborted) return;
        setGalat(
          err instanceof GalatApi ? err.message : "Gagal mengambil daftar sesi",
        );
      })
      .finally(() => {
        if (!kendali.signal.aborted) setMemuat(false);
      });

    return () => kendali.abort();
  }, [nomor, cari, urut]);

  return (
    <>
      <h1 className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-hijau-tua">
        Riwayat pengukusan
      </h1>
      <p className="mt-1 text-[0.95rem] text-abu">
        Tiap baris adalah satu sesi pengukusan. Tekan salah satu untuk melihat
        grafik suhunya.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <input
          value={cariTertunda}
          onChange={(e) => setCariTertunda(e.target.value)}
          placeholder="Cari nomor sesi"
          aria-label="Cari nomor sesi"
          className="w-full max-w-xs rounded-full border border-garis bg-white px-5 py-2.5 text-[0.92rem] outline-none placeholder:text-abu/60 focus:border-hijau"
        />
        <button
          onClick={() => setUrut((u) => (u === "desc" ? "asc" : "desc"))}
          className="rounded-full border border-garis bg-white px-4 py-2.5 text-[0.88rem] font-semibold text-hijau-tua transition-colors hover:bg-mint"
        >
          {urut === "desc" ? "Terbaru dulu" : "Terlama dulu"}
        </button>
        {halaman ? (
          <span className="text-[0.88rem] text-abu">
            {halaman.total} sesi tercatat
          </span>
        ) : null}
      </div>

      {galat ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-api/25 bg-api/8 px-5 py-4 text-[0.9rem] text-api"
        >
          {galat}
        </p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-3xl border border-garis bg-white">
        {memuat && sesi.length === 0 ? (
          <p className="px-6 py-14 text-center text-[0.94rem] text-abu">
            Memuat daftar sesi...
          </p>
        ) : sesi.length === 0 ? (
          <p className="px-6 py-14 text-center text-[0.94rem] text-abu">
            {cari
              ? `Tidak ada sesi yang cocok dengan "${cari}".`
              : "Belum ada sesi tercatat."}
          </p>
        ) : (
          <ul className="divide-y divide-garis">
            {sesi.map((s) => (
              <li key={s.sessionId}>
                <Link
                  href={`/riwayat/${encodeURIComponent(s.sessionId)}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-mint/60"
                >
                  <span>
                    <span className="t-readout block font-semibold text-hijau-tua">
                      {s.sessionId}
                    </span>
                    <span className="mt-0.5 block text-[0.85rem] text-abu">
                      Mulai {waktuPanjang(s.createdAt)}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 shrink-0 text-abu"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m7.5 4 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {halaman && halaman.totalPages > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            onClick={() => setNomor((n) => Math.max(1, n - 1))}
            disabled={nomor <= 1}
            className="rounded-full border border-garis bg-white px-5 py-2.5 text-[0.88rem] font-semibold text-hijau-tua transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-45"
          >
            Sebelumnya
          </button>
          <span className="text-[0.88rem] text-abu">
            Halaman {halaman.page} dari {halaman.totalPages}
          </span>
          <button
            onClick={() => setNomor((n) => n + 1)}
            disabled={nomor >= halaman.totalPages}
            className="rounded-full border border-garis bg-white px-5 py-2.5 text-[0.88rem] font-semibold text-hijau-tua transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-45"
          >
            Berikutnya
          </button>
        </div>
      ) : null}
    </>
  );
}
