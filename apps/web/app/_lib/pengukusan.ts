/* ==========================================================================
   Model satu kali pengukusan baglog.

   Angkanya bukan data sungguhan, tapi bentuk kurvanya mengikuti pola nyata:
   naik cepat di jam pertama, ditahan di zona steril berjam-jam, lalu turun
   setelah api dimatikan. Dipakai bersama oleh mock layar HP di hero dan
   grafik di bagian bawah halaman.
   ========================================================================== */

export const TOTAL_JAM = 8;
export const JAM_RAMP = 1.2; // pemanasan sampai jam ke 1.2
export const JAM_API_MATI = 7.5; // api dimatikan di jam ke 7.5
export const AMBANG_STERIL = 90; // derajat Celsius

export const DURASI_LARI_MS = 45_000;
export const DURASI_JEDA_MS = 3_000;
export const SATU_SIKLUS_MS = DURASI_LARI_MS + DURASI_JEDA_MS;

/** Posisi beku ketika pengguna minta gerak dikurangi. */
export const JAM_DIAM = 4.62;

export function suhuPada(jam: number): number {
  const dasar =
    jam < JAM_RAMP ? 28 + 68 * (1 - Math.pow(1 - jam / JAM_RAMP, 2.4)) : 96;
  const masuk = Math.min(1, Math.max(0, (jam - JAM_RAMP) / 0.5));
  const goyang =
    masuk * (1.7 * Math.sin(jam * 4.7) + 0.7 * Math.sin(jam * 12.3 + 1.1));
  const nilai = dasar + goyang;

  if (jam <= JAM_API_MATI) return nilai;
  const turun = Math.min(1, (jam - JAM_API_MATI) / (TOTAL_JAM - JAM_API_MATI));
  return nilai - (nilai - 68) * turun * turun;
}

export function jamKeWaktu(jam: number): string {
  const total = Math.floor(jam * 3600);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

/** Ringkasan keadaan alat pada satu titik waktu. */
export function keadaanPada(jam: number) {
  const suhu = suhuPada(jam);
  const selesai = jam >= TOTAL_JAM;
  return {
    jam,
    suhu,
    selesai,
    berjalan: !selesai && jam > 0.02,
    apiMenyala: jam < JAM_API_MATI && jam > 0.02,
    steril: suhu >= AMBANG_STERIL,
    // Backend menyimpan satu catatan tiap 30 detik (IOT_LOG_FLUSH_INTERVAL_MS).
    catatan: Math.round((jam * 3600) / 30),
  };
}

/* -- Geometri grafik ------------------------------------------------------- */

export const L = 1000; // lebar viewBox
export const T = 240; // tinggi viewBox
const ATAS = 18;
const BAWAH = 16;
export const PLOT = T - ATAS - BAWAH;
const SUHU_MIN = 24;
const SUHU_MAKS = 104;
const TEPI = 7; // sisipan supaya titik di ujung tidak terpotong

export const BATAS_ATAS = ATAS;
export const px = (jam: number) => TEPI + (jam / TOTAL_JAM) * (L - TEPI * 2);
export const py = (suhu: number) =>
  ATAS + (1 - (suhu - SUHU_MIN) / (SUHU_MAKS - SUHU_MIN)) * PLOT;

export const JALUR_SUHU = (() => {
  const titik: string[] = [];
  const n = 320;
  for (let i = 0; i <= n; i++) {
    const jam = (i / n) * TOTAL_JAM;
    titik.push(`${px(jam).toFixed(2)},${py(suhuPada(jam)).toFixed(2)}`);
  }
  return `M ${titik.join(" L ")}`;
})();

export const JALUR_ARSIR = `${JALUR_SUHU} L ${px(TOTAL_JAM)},${ATAS + PLOT} L ${px(0)},${ATAS + PLOT} Z`;
