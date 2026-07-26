"use client";

import { useMemo, useState } from "react";
import type { TitikGrafik } from "../_lib/api";
import { jamMenitDetik } from "../_lib/format";

/* ==========================================================================
   Grafik suhu satu sesi, digambar dari data yang sudah disiapkan backend
   (endpoint /api/logs/chart). Tanpa pustaka grafik: bentuknya cuma satu garis
   dengan pita zona steril, jadi menambah pustaka hanya menambah berat halaman.
   ========================================================================== */

const L = 1000;
const T = 260;
const ATAS = 18;
const BAWAH = 30;
const PLOT = T - ATAS - BAWAH;
const AMBANG_STERIL = 90;

export default function GrafikSesi({ titik }: { titik: TitikGrafik[] }) {
  const [sorot, setSorot] = useState<number | null>(null);

  const { jalur, arsir, min, maks, py, px, sumbuY } = useMemo(() => {
    const suhu = titik.map((t) => t.avg_suhu);
    const min = Math.min(...suhu);
    const maks = Math.max(...suhu);

    // Skala diberi ruang napas dan selalu memuat ambang steril, supaya posisi
    // kurva terhadap garis 90 derajat terbaca walau sesinya tidak pernah
    // sampai ke sana.
    const bawah = Math.min(min - 4, AMBANG_STERIL - 12);
    const atas = Math.max(maks + 4, AMBANG_STERIL + 12);
    const rentang = Math.max(1, atas - bawah);

    const px = (i: number) =>
      titik.length === 1 ? L / 2 : (i / (titik.length - 1)) * L;
    const py = (v: number) => ATAS + (1 - (v - bawah) / rentang) * PLOT;

    const koordinat = titik.map(
      (t, i) => `${px(i).toFixed(2)},${py(t.avg_suhu).toFixed(2)}`,
    );
    const jalur = `M ${koordinat.join(" L ")}`;
    const arsir = `${jalur} L ${px(titik.length - 1)},${ATAS + PLOT} L ${px(0)},${ATAS + PLOT} Z`;

    const langkah = rentang > 60 ? 20 : 10;
    const sumbuY: number[] = [];
    for (
      let v = Math.ceil(bawah / langkah) * langkah;
      v <= atas;
      v += langkah
    ) {
      sumbuY.push(v);
    }

    return { jalur, arsir, min, maks, py, px, sumbuY };
  }, [titik]);

  const aktif = sorot !== null ? titik[sorot] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 px-3 pb-3 text-[0.8rem] sm:px-0">
        <span className="t-readout text-abu">
          Terendah{" "}
          <strong className="font-semibold text-hijau-tua">
            {min.toFixed(1)} &deg;C
          </strong>
        </span>
        <span className="t-readout text-abu">
          Tertinggi{" "}
          <strong className="font-semibold text-hijau-tua">
            {maks.toFixed(1)} &deg;C
          </strong>
        </span>
        <span className="t-readout text-abu">{titik.length} titik</span>
      </div>

      <div className="relative h-[260px] sm:h-[320px]">
        <svg
          viewBox={`0 0 ${L} ${T}`}
          preserveAspectRatio="none"
          className="block h-full w-full"
          role="img"
          aria-label={`Grafik suhu sesi dengan ${titik.length} titik, terendah ${min.toFixed(1)} dan tertinggi ${maks.toFixed(1)} derajat Celsius.`}
        >
          {/* Zona steril */}
          <rect
            x="0"
            y={py(100)}
            width={L}
            height={Math.max(0, py(AMBANG_STERIL) - py(100))}
            fill="var(--color-hijau)"
            opacity="0.1"
          />
          <line
            x1="0"
            x2={L}
            y1={py(AMBANG_STERIL)}
            y2={py(AMBANG_STERIL)}
            stroke="var(--color-hijau)"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          />

          {sumbuY.map((v) => (
            <line
              key={v}
              x1="0"
              x2={L}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--color-hijau-tua)"
              strokeWidth="1"
              opacity="0.07"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={arsir} fill="var(--color-hijau)" fillOpacity="0.1" />
          <path
            d={jalur}
            fill="none"
            stroke="var(--color-hijau-tua)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {sorot !== null ? (
            <line
              x1={px(sorot)}
              x2={px(sorot)}
              y1={ATAS}
              y2={ATAS + PLOT}
              stroke="var(--color-hijau-tua)"
              strokeWidth="1"
              opacity="0.3"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>

        {/* Skala suhu ditulis sebagai teks HTML supaya tidak ikut melar
            bersama viewBox yang ditarik melebar. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {sumbuY.map((v) => (
            <span
              key={v}
              className="t-readout absolute left-2 -translate-y-1/2 rounded bg-white/80 px-1 text-[0.62rem] text-abu"
              style={{ top: `${(py(v) / T) * 100}%` }}
            >
              {v}
            </span>
          ))}
          <span
            className="absolute right-2 -translate-y-full pb-1 text-[0.66rem] font-semibold tracking-wide text-hijau uppercase"
            style={{ top: `${(py(100) / T) * 100}%` }}
          >
            Zona steril
          </span>
        </div>

        {/* Titik pembacaan dipasang sebagai elemen HTML supaya tetap bulat. */}
        {sorot !== null ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-hijau"
            style={{
              left: `${(px(sorot) / L) * 100}%`,
              top: `${(py(titik[sorot].avg_suhu) / T) * 100}%`,
              boxShadow: "0 0 0 5px rgba(20,113,58,0.18)",
            }}
          />
        ) : null}

        {/* Lapisan penangkap tetikus: satu kolom tak terlihat per titik. */}
        <div
          className="absolute inset-0 flex"
          onMouseLeave={() => setSorot(null)}
        >
          {titik.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="h-full flex-1 cursor-crosshair"
              onMouseEnter={() => setSorot(i)}
              onFocus={() => setSorot(i)}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 px-3 text-[0.72rem] text-abu sm:px-0">
        <span className="t-readout">{jamMenitDetik(titik[0].bucket)}</span>
        {aktif ? (
          <span className="t-readout rounded-full bg-mint px-3 py-1 font-semibold text-hijau-tua">
            {jamMenitDetik(aktif.bucket)} / {aktif.avg_suhu.toFixed(1)} &deg;C
          </span>
        ) : (
          <span>Arahkan tetikus ke grafik untuk melihat angkanya</span>
        )}
        <span className="t-readout">
          {jamMenitDetik(titik[titik.length - 1].bucket)}
        </span>
      </div>
    </div>
  );
}
