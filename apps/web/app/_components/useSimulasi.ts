"use client";

import { useEffect, useRef, useState } from "react";
import {
  DURASI_LARI_MS,
  JAM_DIAM,
  SATU_SIKLUS_MS,
  TOTAL_JAM,
} from "../_lib/pengukusan";

/**
 * Memutar satu kali pengukusan 8 jam dalam 45 detik, lalu diam sebentar
 * sebelum mengulang. Kalau pengguna minta gerak dikurangi lewat setelan
 * sistem, jamnya dibekukan di satu titik yang mewakili proses sedang berjalan.
 */
export function useSimulasi() {
  const [jam, setJam] = useState(0);
  const [diam, setDiam] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDiam(true);
      setJam(JAM_DIAM);
      return;
    }

    const mulai = performance.now();
    let gambarTerakhir = 0;
    const JEDA_GAMBAR = 42; // sekitar 24 gambar per detik, halus tapi ringan

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

  return { jam, diam };
}
