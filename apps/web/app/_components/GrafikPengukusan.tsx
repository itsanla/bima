"use client";

import { useSimulasi } from "./useSimulasi";
import {
  AMBANG_STERIL,
  BATAS_ATAS,
  JALUR_ARSIR,
  JALUR_SUHU,
  L,
  PLOT,
  T,
  jamKeWaktu,
  keadaanPada,
  px,
  py,
} from "../_lib/pengukusan";

export default function GrafikPengukusan() {
  const { jam, diam } = useSimulasi();
  const k = keadaanPada(jam);
  const maju = diam ? L : px(jam);
  const x = px(jam);
  const y = py(k.suhu);

  const keadaan = k.steril
    ? { teks: "Suhu steril tercapai", warna: "var(--color-hijau)" }
    : k.apiMenyala
      ? { teks: "Sedang memanaskan", warna: "var(--color-api)" }
      : { teks: "Api mati, suhu turun", warna: "var(--color-abu)" };

  return (
    <figure className="overflow-hidden rounded-3xl border border-garis bg-mint">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-garis/70 px-5 py-3.5 sm:px-7">
        <span className="flex items-baseline gap-3">
          <span className="t-readout text-[1.05rem] font-semibold text-hijau-tua">
            {jamKeWaktu(jam)}
          </span>
          <span className="text-[0.85rem] text-abu">dari 8 jam pengukusan</span>
        </span>
        <span
          className="flex items-center gap-2 text-[0.85rem] font-semibold"
          style={{ color: keadaan.warna }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ background: keadaan.warna }}
          />
          {keadaan.teks}
        </span>
      </figcaption>

      <div className="relative h-[230px] sm:h-[300px]">
        <svg
          viewBox={`0 0 ${L} ${T}`}
          className="block h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Grafik suhu selama satu kali pengukusan. Suhu naik dari sekitar 28 derajat, ditahan di antara 94 dan 99 derajat selama enam jam, lalu turun setelah api dimatikan."
        >
          <defs>
            <linearGradient id="arsirSuhu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-hijau)" stopOpacity="0.22" />
              <stop offset="60%" stopColor="var(--color-hijau)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--color-hijau)" stopOpacity="0" />
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
            fill="var(--color-hijau)"
            opacity="0.11"
          />
          <line
            x1="0"
            x2={L}
            y1={py(AMBANG_STERIL)}
            y2={py(AMBANG_STERIL)}
            stroke="var(--color-hijau)"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {[40, 60, 80].map((t) => (
            <line
              key={t}
              x1="0"
              x2={L}
              y1={py(t)}
              y2={py(t)}
              stroke="var(--color-hijau-tua)"
              strokeWidth="1"
              opacity="0.08"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <g clipPath="url(#majuKlip)">
            <path d={JALUR_ARSIR} fill="url(#arsirSuhu)" />
            <path
              d={JALUR_SUHU}
              fill="none"
              stroke="var(--color-hijau-tua)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <line
            x1={x}
            x2={x}
            y1={BATAS_ATAS}
            y2={BATAS_ATAS + PLOT}
            stroke="var(--color-hijau-tua)"
            strokeWidth="1"
            opacity="0.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Titik pembacaan dipasang sebagai elemen HTML supaya tetap bulat
            walau viewBox grafik ditarik melebar. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: `${(x / L) * 100}%`,
            top: `${(y / T) * 100}%`,
            background: k.steril ? "var(--color-hijau)" : "var(--color-api)",
            boxShadow: `0 0 0 5px ${k.steril ? "rgba(20,113,58,0.18)" : "rgba(200,70,11,0.18)"}`,
          }}
        />

        {/* Skala suhu, ditulis sebagai teks HTML supaya tidak ikut melar
            bersama viewBox grafik. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[100, 80, 60, 40].map((t) => (
            <span
              key={t}
              className="t-readout absolute left-4 -translate-y-1/2 rounded bg-mint/85 px-1 text-[0.62rem] font-medium text-abu sm:left-6"
              style={{ top: `${(py(t) / T) * 100}%` }}
            >
              {t}
              <span className="opacity-60">&deg;C</span>
            </span>
          ))}
          <span
            className="absolute right-4 -translate-y-full pb-1 text-[0.68rem] font-semibold tracking-wide text-hijau uppercase sm:right-6"
            style={{ top: `${(py(100) / T) * 100}%` }}
          >
            Zona steril
          </span>
        </div>
      </div>

      <div className="flex justify-between border-t border-garis/70 px-5 py-2.5 sm:px-7">
        {["00:00", "02:00", "04:00", "06:00", "08:00"].map((t) => (
          <span key={t} className="t-readout text-[0.66rem] text-abu">
            {t}
          </span>
        ))}
      </div>
    </figure>
  );
}
