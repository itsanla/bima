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
    <div className="relative mx-auto w-[300px] scale-[0.9] sm:scale-100">
      <div style={{ transform: "rotate(-4deg)" }}>
        <Iphone
          lebar={300}
          label={`Aplikasi Steamlog di layar HP, menampilkan suhu ${k.suhu.toFixed(1)} derajat Celsius dan lama pengukusan ${Math.floor(jam)} jam.`}
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

      {/* Kedua kartu ini sengaja hanya menyebut keadaan, bukan angka. Angka
          suhu dan penghitung waktu sudah terbaca jelas di layar HP-nya, jadi
          mengulangnya di samping cuma jadi hiasan. Kartunya juga disembunyikan
          di layar kecil karena di sana tidak ada ruang untuk menonjol keluar. */}

      {/* Penanda steril, muncul hanya saat suhunya memang sudah tercapai */}
      <div
        aria-hidden="true"
        className="kartu-layang absolute top-[268px] -right-[86px] hidden items-center gap-2 rounded-full py-2 pr-3.5 pl-3 transition-opacity duration-500 sm:flex"
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

      {/* Keadaan tungku */}
      <div
        aria-hidden="true"
        className="kartu-layang absolute top-[452px] -right-[92px] hidden items-center gap-2.5 rounded-full py-2.5 pr-4 pl-3 sm:flex"
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
    </div>
  );
}
