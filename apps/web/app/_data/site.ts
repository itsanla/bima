export const site = {
  nama: "Bima",
  domain: "steamlog.cloud",
  judulProgram:
    "Pemberdayaan Kelompok Usaha Jamur Tiram melalui Implementasi Smart Monitoring Suhu Sterilisasi Baglog Berbasis Android",
  penyelenggara: "Politeknik Negeri Padang",
  apk: {
    url: "https://github.com/itsanla/bima/releases/download/v1.0.0/app-release.apk",
    halamanRilis: "https://github.com/itsanla/bima/releases/tag/v1.0.0",
    versi: "1.0.0",
    ukuran: "48 MB",
    namaBerkas: "app-release.apk",
  },
} as const;

/** Kredit foto, satu baris per pemotret. Semua berlisensi CC BY-SA 4.0 lewat
 *  Wikimedia Commons. */
export const kreditFoto = [
  {
    pemotret: "CatatanLagitBiru",
    url: "https://commons.wikimedia.org/wiki/User:CatatanLagitBiru",
  },
  {
    pemotret: "Astari28",
    url: "https://commons.wikimedia.org/wiki/File:Jamur_Tiram.jpg",
  },
] as const;
