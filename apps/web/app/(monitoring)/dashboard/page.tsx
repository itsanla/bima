"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WS_URL } from "../../_lib/api";

/* ==========================================================================
   Dashboard langsung.

   Sumbernya WebSocket yang sama dengan yang dipakai alat: server menyiarkan
   dashboard_update untuk data yang masuk lewat WebSocket, dan
   http_dashboard_update untuk yang masuk lewat POST. Keduanya dianggap sama
   di sini, yang membedakan hanya penanda jalur masuknya.
   ========================================================================== */

type Bacaan = {
  suhu: number;
  timer: string;
  api: string;
  status: string;
  air_habis: boolean;
  sessionId: string | null;
  jalur: "WebSocket" | "HTTP";
  waktu: number;
};

const BATAS_RIWAYAT = 60;
/** Alat mengirim tiap 30 detik. Lewat 90 detik tanpa kabar, tampilan
 *  dianggap basi supaya tidak ada yang membaca angka lama sebagai keadaan
 *  sekarang. */
const AMBANG_BASI_MS = 90_000;

export default function Dashboard() {
  const [tersambung, setTersambung] = useState(false);
  const [bacaan, setBacaan] = useState<Bacaan[]>([]);
  const [sekarang, setSekarang] = useState(() => Date.now());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let hidup = true;
    let ulangi: ReturnType<typeof setTimeout> | null = null;

    function sambung() {
      if (!hidup) return;
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => hidup && setTersambung(true);

      ws.onmessage = (ev) => {
        try {
          const pesan = JSON.parse(ev.data);
          if (
            pesan.type !== "dashboard_update" &&
            pesan.type !== "http_dashboard_update"
          ) {
            return;
          }
          const d = pesan.data ?? {};
          const masuk: Bacaan = {
            suhu: Number(d.suhu) || 0,
            timer: typeof d.timer === "string" ? d.timer : "00:00:00",
            api: typeof d.api === "string" ? d.api : "OFF",
            status: typeof d.status === "string" ? d.status : "UNKNOWN",
            air_habis: Boolean(d.air_habis),
            sessionId: d.sessionId ?? d.session ?? d.id ?? null,
            jalur: pesan.type === "http_dashboard_update" ? "HTTP" : "WebSocket",
            waktu: Date.now(),
          };
          setBacaan((lama) => [masuk, ...lama].slice(0, BATAS_RIWAYAT));
        } catch {
          /* pesan yang tidak dikenali diabaikan */
        }
      };

      const putus = () => {
        if (!hidup) return;
        setTersambung(false);
        // Coba sambung lagi supaya layar yang ditinggal terbuka semalaman
        // pulih sendiri setelah jaringan sempat putus.
        ulangi = setTimeout(sambung, 4000);
      };
      ws.onclose = putus;
      ws.onerror = () => ws.close();
    }

    sambung();
    const detak = setInterval(() => setSekarang(Date.now()), 1000);

    return () => {
      hidup = false;
      if (ulangi) clearTimeout(ulangi);
      clearInterval(detak);
      wsRef.current?.close();
    };
  }, []);

  const terbaru = bacaan[0] ?? null;
  const basi = terbaru ? sekarang - terbaru.waktu > AMBANG_BASI_MS : false;
  const adaData = terbaru !== null;
  // Sebelum ada kiriman, angkanya ditampilkan nol dan tungku dianggap mati,
  // bukan disembunyikan. Kartunya tetap di tempat yang sama sehingga saat data
  // pertama masuk yang berubah hanya angkanya, bukan susunan halamannya.
  const tampil = terbaru ?? {
    suhu: 0,
    timer: "00:00:00",
    api: "OFF",
    status: "-",
    air_habis: false,
    sessionId: null,
    jalur: "-" as const,
    waktu: 0,
  };
  const deretSuhu = useMemo(
    () => bacaan.slice(0, 40).map((b) => b.suhu).reverse(),
    [bacaan],
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-hijau-tua">
            Dashboard
          </h1>
          <p className="mt-1 text-[0.95rem] text-abu">
            Data langsung dari alat kukus, diperbarui begitu alat mengirim.
          </p>
        </div>
        <StatusSambungan tersambung={tersambung} basi={basi} />
      </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KartuAngka
          label="Suhu"
          nilai={tampil.suhu.toFixed(1)}
          satuan="°C"
          utama
          redup={adaData && basi}
            />
            <KartuAngka
          label="Lama pengukusan"
          nilai={tampil.timer}
          redup={adaData && basi}
            />
            <KartuKeadaan
          label="Api"
          nilai={tampil.api.toUpperCase() === "ON" ? "Menyala" : "Mati"}
          nyala={tampil.api.toUpperCase() === "ON"}
          redup={adaData && basi}
            />
            <KartuKeadaan
          label="Air"
          nilai={tampil.air_habis ? "Habis" : "Cukup"}
          nyala={!tampil.air_habis}
          waspada={tampil.air_habis}
          redup={adaData && basi}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl border border-garis bg-white px-6 py-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-bold text-hijau-tua">
              Suhu beberapa bacaan terakhir
            </h2>
            <span className="t-readout text-[0.75rem] text-abu">
              {deretSuhu.length} titik
            </span>
          </div>
          <GrafikRingkas nilai={deretSuhu} />
            </div>

            <div className="rounded-3xl border border-garis bg-white px-6 py-6">
          <h2 className="font-bold text-hijau-tua">Keterangan</h2>
          <dl className="mt-4 space-y-3 text-[0.9rem]">
            <Baris label="Status alat" nilai={tampil.status} />
            <Baris label="Sesi" nilai={tampil.sessionId ?? "-"} />
            <Baris label="Jalur masuk" nilai={tampil.jalur} />
            <Baris
              label="Bacaan terakhir"
              nilai={adaData ? jedaWaktu(sekarang - tampil.waktu) : "belum ada"}
            />
          </dl>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-garis bg-white">
            <h2 className="border-b border-garis px-6 py-4 font-bold text-hijau-tua">
          Aliran data masuk
            </h2>
            <div className="max-h-[22rem] overflow-y-auto">
          <table className="w-full text-left text-[0.88rem]">
            <thead className="sticky top-0 bg-kabut text-[0.75rem] tracking-wide text-abu uppercase">
              <tr>
                <th className="px-6 py-2.5 font-semibold">Waktu</th>
                <th className="px-3 py-2.5 font-semibold">Suhu</th>
                <th className="px-3 py-2.5 font-semibold">Timer</th>
                <th className="px-3 py-2.5 font-semibold">Api</th>
                <th className="px-6 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {bacaan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-abu">
                    {tersambung
                      ? "Sambungan terbuka. Baris akan muncul sendiri begitu alat mengirim."
                      : "Sedang menyambung ke server."}
                  </td>
                </tr>
              ) : null}
              {bacaan.map((b, i) => (
                <tr key={`${b.waktu}-${i}`}>
                  <td className="t-readout px-6 py-2.5 text-abu">
                    {new Date(b.waktu).toLocaleTimeString("id-ID")}
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
                  <td className="px-6 py-2.5 text-abu">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
    </>
  );
}

/* -- Bagian tampilan ------------------------------------------------------- */

function StatusSambungan({
  tersambung,
  basi,
}: {
  tersambung: boolean;
  basi: boolean;
}) {
  const { teks, warna } = !tersambung
    ? { teks: "Terputus", warna: "var(--color-api)" }
    : basi
      ? { teks: "Tersambung, belum ada kabar", warna: "var(--color-abu)" }
      : { teks: "Tersambung", warna: "var(--color-hijau)" };

  return (
    <span className="flex items-center gap-2.5 rounded-full border border-garis bg-white px-4 py-2 text-[0.85rem] font-semibold">
      <span
        className="block h-2.5 w-2.5 rounded-full"
        style={{ background: warna, boxShadow: `0 0 0 4px ${warna}22` }}
      />
      <span style={{ color: warna }}>{teks}</span>
    </span>
  );
}

function KartuAngka({
  label,
  nilai,
  satuan,
  utama,
  redup,
}: {
  label: string;
  nilai: string;
  satuan?: string;
  utama?: boolean;
  redup?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border px-6 py-6 transition-opacity ${
        utama ? "border-hijau/25 bg-mint" : "border-garis bg-white"
      } ${redup ? "opacity-50" : ""}`}
    >
      <p className="text-[0.75rem] font-semibold tracking-wide text-abu uppercase">
        {label}
      </p>
      <p className="t-readout mt-2 text-[2rem] leading-none font-bold text-hijau-tua">
        {nilai}
        {satuan ? (
          <span className="ml-1 align-top text-[0.9rem] text-abu">{satuan}</span>
        ) : null}
      </p>
    </div>
  );
}

function KartuKeadaan({
  label,
  nilai,
  nyala,
  waspada,
  redup,
}: {
  label: string;
  nilai: string;
  nyala: boolean;
  waspada?: boolean;
  redup?: boolean;
}) {
  const warna = waspada
    ? "var(--color-api)"
    : nyala
      ? "var(--color-hijau)"
      : "var(--color-abu)";
  return (
    <div
      className={`rounded-3xl border border-garis bg-white px-6 py-6 transition-opacity ${redup ? "opacity-50" : ""}`}
    >
      <p className="text-[0.75rem] font-semibold tracking-wide text-abu uppercase">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2.5">
        <span
          className="block h-3 w-3 shrink-0 rounded-full"
          style={{ background: warna, boxShadow: `0 0 0 5px ${warna}22` }}
        />
        <span
          className="text-[1.35rem] leading-none font-bold"
          style={{ color: warna }}
        >
          {nilai}
        </span>
      </p>
    </div>
  );
}

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-garis pb-2.5 last:border-0 last:pb-0">
      <dt className="shrink-0 text-abu">{label}</dt>
      <dd className="t-readout truncate text-right font-semibold text-hijau-tua">
        {nilai}
      </dd>
    </div>
  );
}

/** Grafik garis ringkas tanpa pustaka luar. Skalanya mengikuti isi data,
 *  bukan 0 sampai 100, supaya goyangan kecil di sekitar suhu steril tetap
 *  terlihat. */
function GrafikRingkas({ nilai }: { nilai: number[] }) {
  if (nilai.length < 2) {
    return (
      <p className="py-10 text-center text-[0.9rem] text-abu">
        {nilai.length === 0
          ? "Belum ada bacaan yang masuk."
          : "Baru satu bacaan. Garis muncul setelah bacaan kedua."}
      </p>
    );
  }

  const L = 600;
  const T = 160;
  const min = Math.min(...nilai);
  const maks = Math.max(...nilai);
  const rentang = Math.max(1, maks - min);
  const x = (i: number) => (i / (nilai.length - 1)) * L;
  const y = (v: number) => 12 + (1 - (v - min) / rentang) * (T - 24);
  const garis = nilai.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);

  return (
    <div className="relative mt-4">
      <svg
        viewBox={`0 0 ${L} ${T}`}
        preserveAspectRatio="none"
        className="block h-[160px] w-full"
        role="img"
        aria-label={`Grafik ${nilai.length} bacaan suhu terakhir, terendah ${min.toFixed(1)} dan tertinggi ${maks.toFixed(1)} derajat.`}
      >
        <polyline
          points={`${garis.join(" ")} ${L},${T} 0,${T}`}
          fill="var(--color-hijau)"
          fillOpacity="0.1"
          stroke="none"
        />
        <polyline
          points={garis.join(" ")}
          fill="none"
          stroke="var(--color-hijau-tua)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[0.72rem] text-abu">
        <span className="t-readout">terendah {min.toFixed(1)} &deg;C</span>
        <span className="t-readout">tertinggi {maks.toFixed(1)} &deg;C</span>
      </div>
    </div>
  );
}

function jedaWaktu(ms: number): string {
  const detik = Math.max(0, Math.floor(ms / 1000));
  if (detik < 60) return `${detik} detik lalu`;
  const menit = Math.floor(detik / 60);
  if (menit < 60) return `${menit} menit lalu`;
  return `${Math.floor(menit / 60)} jam lalu`;
}
