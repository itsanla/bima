export const site = {
  /* Nama sistemnya adalah Steamlog. "Bima" adalah nama skema pendanaannya,
     jadi hanya muncul sebagai salah satu lambang lembaga, bukan nama produk. */
  nama: "Steamlog",
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
  /** Panduan pengguna aplikasi, PDF di Google Drive. Sudah diuji bisa dibuka
   *  dan diunduh tanpa perlu masuk akun Google. */
  panduan: {
    url: "https://drive.google.com/file/d/1QItO_sWpe9OoGTZDWDVSwNx6JY5x0_Ka/view?usp=sharing",
    halaman: 24,
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
