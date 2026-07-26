"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* ==========================================================================
   Satu kali pengukusan, dipadatkan jadi 45 detik.

   Satu jam virtual menggerakkan semuanya sekaligus: angka di layar HP, garis
   suhu di grafik, dan cahaya bara di latar. Angkanya bukan data sungguhan,
   tapi bentuk kurvanya mengikuti pola pengukusan baglog yang nyata: naik
   cepat di awal, ditahan di zona steril berjam-jam, lalu turun setelah api
   dimatikan.
   ========================================================================== */

const TOTAL_JAM = 8;
const DURASI_LARI_MS = 45_000;
const DURASI_JEDA_MS = 3_000;
const SATU_SIKLUS_MS = DURASI_LARI_MS + DURASI_JEDA_MS;

const JAM_RAMP = 1.2; // pemanasan sampai jam ke 1.2
const JAM_API_MATI = 7.5; // api dimatikan di jam ke 7.5
const AMBANG_STERIL = 90; // derajat Celsius

const JAM_DIAM = 4.62; // posisi beku saat pengguna minta gerak dikurangi

function suhuPada(jam: number): number {
  const dasar =
    jam < JAM_RAMP
      ? 28 + 68 * (1 - Math.pow(1 - jam / JAM_RAMP, 2.4))
      : 96;
  const masuk = Math.min(1, Math.max(0, (jam - JAM_RAMP) / 0.5));
  const goyang =
    masuk * (1.7 * Math.sin(jam * 4.7) + 0.7 * Math.sin(jam * 12.3 + 1.1));
  const nilai = dasar + goyang;

  if (jam <= JAM_API_MATI) return nilai;
  const turun = Math.min(1, (jam - JAM_API_MATI) / (TOTAL_JAM - JAM_API_MATI));
  return nilai - (nilai - 68) * turun * turun;
}

function jamKeWaktu(jam: number): string {
  const total = Math.floor(jam * 3600);
  const j = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const d = total % 60;
  return [j, m, d].map((n) => String(n).padStart(2, "0")).join(":");
}

/* -- Geometri grafik ------------------------------------------------------- */

const L = 1000; // lebar viewBox
const T = 240; // tinggi viewBox
const ATAS = 18;
const BAWAH = 16;
const PLOT = T - ATAS - BAWAH;
const SUHU_MIN = 24;
const SUHU_MAKS = 104;

/* Kurva disisipkan sedikit dari tepi supaya titik pembacaan di awal dan akhir
   tidak terpotong oleh batas pita. */
const TEPI = 7;
const px = (jam: number) => TEPI + (jam / TOTAL_JAM) * (L - TEPI * 2);
const py = (suhu: number) =>
  ATAS + (1 - (suhu - SUHU_MIN) / (SUHU_MAKS - SUHU_MIN)) * PLOT;

const JALUR_SUHU = (() => {
  const titik: string[] = [];
  const n = 320;
  for (let i = 0; i <= n; i++) {
    const jam = (i / n) * TOTAL_JAM;
    titik.push(`${px(jam).toFixed(2)},${py(suhuPada(jam)).toFixed(2)}`);
  }
  return `M ${titik.join(" L ")}`;
})();

const JALUR_ARSIR = `${JALUR_SUHU} L ${px(TOTAL_JAM)},${ATAS + PLOT} L ${px(0)},${ATAS + PLOT} Z`;

/* ========================================================================== */

export default function HeroRun({ children }: { children: ReactNode }) {
  const [jam, setJam] = useState(0);
  const [diam, setDiam] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (kurangiGerak.matches) {
      setDiam(true);
      setJam(JAM_DIAM);
      return;
    }

    const mulai = performance.now();
    let gambarTerakhir = 0;
    const JEDA_GAMBAR = 42; // sekitar 24 gambar per detik, cukup halus dan ringan

    const langkah = (sekarang: number) => {
      rafRef.current = requestAnimationFrame(langkah);
      if (sekarang - gambarTerakhir < JEDA_GAMBAR) return;
      gambarTerakhir = sekarang;

      const lewat = (sekarang - mulai) % SATU_SIKLUS_MS;
      setJam(
        lewat <= DURASI_LARI_MS
          ? (lewat / DURASI_LARI_MS) * TOTAL_JAM
          : TOTAL_JAM,
      );
    };
    rafRef.current = requestAnimationFrame(langkah);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const suhu = suhuPada(jam);
  const apiMenyala = jam < JAM_API_MATI && jam > 0.02;
  const steril = suhu >= AMBANG_STERIL;
  const selesai = jam >= TOTAL_JAM;
  const catatan = Math.round((jam * 3600) / 30); // satu catatan tiap 30 detik
  const panas = Math.min(1, Math.max(0, (suhu - 28) / 70));

  return (
    <>
      <div className="relative">
        {/* Bara: latar ikut menghangat saat suhu naik. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-24 -top-40 bottom-0"
          style={{
            opacity: 0.14 + panas * 0.4,
            background:
              "radial-gradient(58% 46% at 72% 38%, rgba(255,122,47,0.55) 0%, rgba(255,122,47,0.13) 42%, transparent 72%)",
          }}
        />

        <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <div>{children}</div>

          <figure className="mx-auto w-full max-w-[19rem] lg:mx-0 lg:max-w-[20rem]">
            <TeleponMock
              suhu={suhu}
              jam={jam}
              apiMenyala={apiMenyala}
              selesai={selesai}
              catatan={catatan}
            />
            <figcaption className="sr-only">
              Contoh tampilan aplikasi Bima di layar HP: status alat, suhu dalam
              derajat Celsius, lama pengukusan, dan keadaan api.
            </figcaption>
          </figure>
        </div>
      </div>

      <GrafikLari
        jam={jam}
        suhu={suhu}
        steril={steril}
        apiMenyala={apiMenyala}
        diam={diam}
      />
    </>
  );
}

/* -- Layar HP -------------------------------------------------------------- */

/** Warna di dalam mock ini disalin dari tema aplikasi (lib/config/app_colors.dart). */
const app = {
  latar: "#FAF9F9",
  permukaan: "#FFFFFF",
  teksGelap: "#1A1C1C",
  teksAbu: "#707883",
  hijau: "#006E1C",
  hijauMuda: "#91F78E",
  hijauTeks: "#00731E",
  jinggaTeks: "#8B5000",
  jinggaMuda: "#FFDCBE",
  biruTeks: "#0061A4",
  biruMuda: "#D1E4FF",
  garis: "#E3E2E2",
  garisAbu: "#BFC7D4",
};

function TeleponMock({
  suhu,
  jam,
  apiMenyala,
  selesai,
  catatan,
}: {
  suhu: number;
  jam: number;
  apiMenyala: boolean;
  selesai: boolean;
  catatan: number;
}) {
  const berjalan = !selesai && jam > 0.02;

  return (
    <div
      role="img"
      aria-label={`Layar aplikasi Bima menampilkan suhu ${suhu.toFixed(1)} derajat Celsius dan lama pengukusan ${jamKeWaktu(jam)}.`}
      className="relative rounded-[2.4rem] border border-kukus-3 bg-kukus-2 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)]"
    >
      <div
        className="overflow-hidden rounded-[1.9rem]"
        style={{ background: app.latar, color: app.teksGelap }}
        aria-hidden="true"
      >
        {/* Bilah judul */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-3"
          style={{ background: app.permukaan }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-[15px] rounded-full" style={{ background: "#404752" }} />
              <span className="block h-[2px] w-[15px] rounded-full" style={{ background: "#404752" }} />
              <span className="block h-[2px] w-[10px] rounded-full" style={{ background: "#404752" }} />
            </span>
            <span className="text-[0.82rem] font-semibold tracking-tight">
              Monitoring Alat Kukusan
            </span>
          </div>
          <span className="relative block h-2 w-2 rounded-full" style={{ background: app.jinggaTeks }} />
        </div>

        <div className="space-y-3 px-3.5 py-3.5">
          {/* Kartu status */}
          <div
            className="rounded-xl px-3.5 py-3"
            style={{
              background: app.permukaan,
              border: `3px solid ${berjalan ? app.hijau : app.garisAbu}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="t-label"
                  style={{ color: app.teksAbu, fontSize: "0.55rem" }}
                >
                  Current status
                </p>
                <p className="mt-1.5 flex items-center gap-2">
                  <span
                    className="block h-2.5 w-2.5 rounded-full"
                    style={{ background: berjalan ? app.hijau : app.garisAbu }}
                  />
                  <span className="text-[0.95rem] font-semibold">
                    {berjalan ? "Running" : "Stopped"}
                  </span>
                </p>
              </div>
              <span
                className="rounded-full px-2 py-1 text-[0.6rem] font-semibold"
                style={{ background: app.hijauMuda, color: app.hijauTeks }}
              >
                Live
              </span>
            </div>

            <div
              className="mt-3 flex items-center justify-between border-t pt-2.5 text-[0.66rem]"
              style={{ borderColor: app.garis, color: app.teksAbu }}
            >
              <span className="t-readout">BIMA-01</span>
              <span className="t-readout">{jamKeWaktu(jam)} berjalan</span>
            </div>
          </div>

          {/* Suhu dan api */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl px-3 py-3"
              style={{ background: app.biruMuda }}
            >
              <p className="t-label" style={{ color: app.biruTeks, fontSize: "0.52rem" }}>
                Suhu
              </p>
              <p
                className="t-readout mt-1 text-[1.5rem] leading-none font-semibold"
                style={{ color: app.biruTeks }}
              >
                {suhu.toFixed(1)}
                <span className="ml-0.5 text-[0.8rem] align-top">&deg;C</span>
              </p>
            </div>
            <div
              className="rounded-xl px-3 py-3"
              style={{
                background: apiMenyala ? app.jinggaMuda : "#EDEDED",
                color: apiMenyala ? app.jinggaTeks : app.teksAbu,
              }}
            >
              <p className="t-label" style={{ fontSize: "0.52rem" }}>
                Api
              </p>
              <p className="mt-1 text-[1.05rem] leading-none font-semibold">
                {apiMenyala ? "Menyala" : "Mati"}
              </p>
              <p className="mt-1.5 text-[0.6rem] leading-tight opacity-80">
                {apiMenyala ? "Tungku aktif" : "Tungku dingin"}
              </p>
            </div>
          </div>

          {/* Lama pengukusan */}
          <div
            className="rounded-xl px-3.5 py-3"
            style={{ background: app.permukaan, border: `1px solid ${app.garis}` }}
          >
            <p className="t-label" style={{ color: app.teksAbu, fontSize: "0.52rem" }}>
              Lama pengukusan
            </p>
            <p className="t-readout mt-1 text-[1.55rem] leading-none font-semibold tracking-tight">
              {jamKeWaktu(jam)}
            </p>
          </div>

          {/* Ringkasan hari ini */}
          <div
            className="rounded-xl px-3.5 py-3"
            style={{ background: app.permukaan, border: `1px solid ${app.garis}` }}
          >
            <p className="t-label" style={{ color: app.teksAbu, fontSize: "0.52rem" }}>
              Ringkasan hari ini
            </p>
            <div className="mt-2 flex items-end justify-between">
              {[
                ["Alat", "1"],
                ["Online", "1"],
                ["Catatan", String(catatan)],
              ].map(([label, nilai]) => (
                <div key={label}>
                  <p className="t-readout text-[1.05rem] leading-none font-semibold">
                    {nilai}
                  </p>
                  <p className="mt-1 text-[0.62rem]" style={{ color: app.teksAbu }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigasi bawah */}
        <div
          className="flex items-center justify-around border-t px-6 py-3"
          style={{ borderColor: app.garis, background: app.permukaan }}
        >
          <span className="h-1.5 w-8 rounded-full" style={{ background: app.hijau }} />
          <span className="h-1.5 w-5 rounded-full" style={{ background: app.garisAbu }} />
          <span className="h-1.5 w-5 rounded-full" style={{ background: app.garisAbu }} />
        </div>
      </div>
    </div>
  );
}

/* -- Grafik satu kali pengukusan ------------------------------------------ */

function GrafikLari(props: {
  jam: number;
  suhu: number;
  steril: boolean;
  apiMenyala: boolean;
  diam: boolean;
}) {
  const { jam, suhu, steril, apiMenyala, diam } = props;
  const maju = diam ? L : px(jam);
  const x = px(jam);
  const y = py(suhu);

  const keadaan = steril
    ? { teks: "Suhu steril tercapai", warna: "var(--color-steril)" }
    : apiMenyala
      ? { teks: "Sedang memanaskan", warna: "var(--color-api)" }
      : { teks: "Api mati, suhu turun", warna: "var(--color-kabut)" };

  return (
    /* Pita ini sengaja dibuat selebar layar: ia satu satunya bagian halaman
       yang bergerak, dan bentuk kurvanya adalah inti dari seluruh program. */
    <div className="mx-[calc(50%_-_50vw)] mt-16 border-y border-kukus-3 bg-kukus-2/35 lg:mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-kukus-3/60 px-5 py-3 sm:px-8">
        <p className="t-label text-kabut">
          Satu kali pengukusan / 8 jam dalam 45 detik
        </p>
        <p className="t-label" style={{ color: keadaan.warna }}>
          {keadaan.teks}
        </p>
      </div>

      <div className="relative h-[210px] overflow-hidden sm:h-[280px]">
        <svg
          viewBox={`0 0 ${L} ${T}`}
          className="block h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Grafik suhu selama satu kali pengukusan. Suhu naik dari sekitar 28 derajat, ditahan di antara 94 dan 99 derajat selama enam jam, lalu turun setelah api dimatikan."
        >
          <defs>
            <linearGradient id="arsirSuhu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-api)" stopOpacity="0.18" />
              <stop offset="55%" stopColor="var(--color-api)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="var(--color-api)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="majuKlip">
              <rect x="0" y="0" width={maju} height={T} />
            </clipPath>
          </defs>

          {/* Zona steril */}
          <rect
            x="0"
            y={py(100)}
            width={L}
            height={py(AMBANG_STERIL) - py(100)}
            fill="var(--color-steril)"
            opacity="0.1"
          />
          <line
            x1="0"
            x2={L}
            y1={py(AMBANG_STERIL)}
            y2={py(AMBANG_STERIL)}
            stroke="var(--color-steril)"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          />

          {/* Garis bantu suhu */}
          {[40, 60, 80].map((t) => (
            <line
              key={t}
              x1="0"
              x2={L}
              y1={py(t)}
              y2={py(t)}
              stroke="var(--color-uap)"
              strokeWidth="1"
              opacity="0.07"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Kurva */}
          <g clipPath="url(#majuKlip)">
            <path d={JALUR_ARSIR} fill="url(#arsirSuhu)" />
            <path
              d={JALUR_SUHU}
              fill="none"
              stroke="var(--color-uap)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Garis tegak posisi sekarang */}
          <line
            x1={x}
            x2={x}
            y1={ATAS}
            y2={ATAS + PLOT}
            stroke="var(--color-uap)"
            strokeWidth="1"
            opacity="0.22"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Titik pembacaan dipasang sebagai elemen HTML supaya tetap bulat
            walau viewBox grafik ditarik melebar. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${(x / L) * 100}%`,
            top: `${(y / T) * 100}%`,
            background: steril ? "var(--color-steril)" : "var(--color-api)",
            boxShadow: `0 0 0 6px ${steril ? "rgba(111,227,162,0.2)" : "rgba(255,122,47,0.2)"}`,
          }}
        />

        {/* Skala suhu, ditulis sebagai teks HTML supaya tidak ikut melar
            bersama viewBox grafik. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[100, 80, 60, 40].map((t) => (
            <span
              key={t}
              className="t-readout absolute left-5 -translate-y-1/2 rounded bg-kukus/75 px-1 text-[0.62rem] text-kabut sm:left-8"
              style={{ top: `${(py(t) / T) * 100}%` }}
            >
              {t}
              <span className="text-kabut/60">&deg;C</span>
            </span>
          ))}
          {/* Ditaruh persis di atas pita steril supaya tidak pernah menimpa
              kurva, yang hampir selalu berjalan di dalam pita itu. */}
          <span
            className="t-label absolute right-5 -translate-y-full pb-1 text-steril/85 sm:right-8"
            style={{ top: `${(py(100) / T) * 100}%` }}
          >
            Zona steril
          </span>
        </div>
      </div>

      <div className="flex justify-between border-t border-kukus-3/60 px-5 py-2.5 sm:px-8">
        {["00:00", "02:00", "04:00", "06:00", "08:00"].map((t) => (
          <span key={t} className="t-readout text-[0.66rem] text-kabut">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
