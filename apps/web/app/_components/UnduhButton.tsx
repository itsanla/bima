import { site } from "../_data/site";

const gaya = {
  isi: "bg-hijau text-white hover:bg-hijau-tua", // tombol utama di atas latar terang
  putih: "bg-white text-hijau-tua hover:bg-mint", // tombol utama di atas pita hijau tua
  garis: "border border-white/25 bg-white/10 text-white hover:bg-white/20", // tombol kedua di atas pita hijau tua
} as const;

export default function UnduhButton({
  varian = "isi",
  label = "Unduh aplikasi Android",
  className = "",
}: {
  varian?: keyof typeof gaya;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={site.apk.url}
      className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.97rem] font-bold tracking-tight transition-colors duration-200 ${gaya[varian]} ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 2.6v10.2M5.6 8.6 10 13l4.4-4.4M3 16.4h14" />
      </svg>
      {label}
    </a>
  );
}

/** Kartu QR. Disembunyikan di layar kecil karena pengunjungnya memang sudah
 *  memegang HP, jadi memindai layarnya sendiri tidak masuk akal.
 *  Kode QR selalu gelap di atas ubin putih, apa pun warna latar sekitarnya,
 *  karena itu syarat supaya pemindai bisa membacanya. */
export function KartuQr({ gelap = false }: { gelap?: boolean }) {
  return (
    <div
      className={`hidden items-center gap-3.5 rounded-2xl border p-3 sm:flex ${
        gelap
          ? "border-white/20 bg-white/10 text-white/75"
          : "border-garis bg-white text-abu"
      }`}
    >
      <img
        src="/images/qr-steamlog.svg"
        alt="Kode QR menuju steamlog.cloud"
        width={64}
        height={64}
        className="h-16 w-16 rounded-md bg-white p-0.5"
      />
      <p className="max-w-[9rem] text-[0.78rem] leading-snug">
        Pindai untuk membuka halaman ini di HP
      </p>
    </div>
  );
}
