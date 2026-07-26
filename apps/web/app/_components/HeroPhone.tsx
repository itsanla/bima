"use client";

import Iphone from "./Iphone";
import LayarApp from "./LayarApp";
import { useSimulasi } from "./useSimulasi";
import { keadaanPada } from "../_lib/pengukusan";

/* Dua kartu ini sengaja tidak ikut dimiringkan bersama HP. Kartunya berperan
   sebagai keterangan yang menempel di atas foto perangkat, jadi harus tetap
   tegak dan mudah dibaca. */

export default function HeroPhone() {
  const { jam } = useSimulasi();
  const k = keadaanPada(jam);

  return (
    <div className="relative mx-auto w-[300px] scale-[0.92] sm:scale-100 lg:scale-[1.06]">
      <div style={{ transform: "rotate(-5deg)" }}>
        <Iphone
          lebar={300}
          label={`Aplikasi Bima di layar HP, menampilkan suhu ${k.suhu.toFixed(1)} derajat Celsius dan lama pengukusan ${Math.floor(jam)} jam.`}
        >
          <LayarApp
            suhu={k.suhu}
            jam={k.jam}
            apiMenyala={k.apiMenyala}
            berjalan={k.berjalan}
            catatan={k.catatan}
          />
        </Iphone>
      </div>

      {/* Pembacaan suhu */}
      <div
        aria-hidden="true"
        className="kartu-layang absolute top-[122px] -left-10 rounded-2xl px-3.5 py-2.5 sm:-left-16"
      >
        <p className="text-[0.6rem] font-semibold tracking-wide text-abu uppercase">
          Suhu sekarang
        </p>
        <p className="t-readout mt-0.5 text-[1.35rem] leading-none font-bold text-hijau-tua">
          {k.suhu.toFixed(1)}
          <span className="ml-0.5 align-top text-[0.75rem] text-abu">&deg;C</span>
        </p>
      </div>

      {/* Keadaan tungku */}
      <div
        aria-hidden="true"
        className="kartu-layang absolute top-[398px] -right-8 flex items-center gap-2.5 rounded-full py-2.5 pr-4 pl-3 sm:-right-14"
      >
        <span
          className="block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{
            background: k.apiMenyala ? "var(--color-api)" : "#9AA79E",
            boxShadow: k.apiMenyala
              ? "0 0 0 4px rgba(200,70,11,0.16)"
              : "0 0 0 4px rgba(154,167,158,0.16)",
          }}
        />
        <span className="text-[0.85rem] leading-none font-semibold whitespace-nowrap text-arang">
          {k.apiMenyala ? "Api menyala" : "Api mati"}
        </span>
      </div>

      {/* Penanda steril, muncul hanya saat suhunya memang sudah tercapai */}
      <div
        aria-hidden="true"
        className="kartu-layang absolute top-[250px] -right-6 flex items-center gap-2 rounded-full py-2 pr-3.5 pl-3 transition-opacity duration-500 sm:-right-10"
        style={{ opacity: k.steril ? 1 : 0 }}
      >
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 text-hijau"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 8.4 3.2 3.2L13 4.8" />
        </svg>
        <span className="text-[0.8rem] leading-none font-semibold whitespace-nowrap text-hijau-tua">
          Suhu steril
        </span>
      </div>
    </div>
  );
}
