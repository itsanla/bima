import { site } from "../_data/site";

const gaya = {
  garisTerang: "border border-garis bg-white text-hijau-tua hover:bg-mint",
  garisGelap:
    "border border-white/25 bg-white/10 text-white hover:bg-white/20",
} as const;

/**
 * Tautan ke panduan pengguna aplikasi. Berkasnya PDF di Google Drive, jadi
 * dibuka di tab baru: pengunjung yang sedang di tengah memasang aplikasi
 * tidak kehilangan halaman ini.
 */
export default function PanduanButton({
  varian = "garisTerang",
  label = "Panduan penggunaan",
  className = "",
}: {
  varian?: keyof typeof gaya;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={site.panduan.url}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.97rem] font-bold tracking-tight transition-colors duration-200 ${gaya[varian]} ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-[1.05rem] w-[1.05rem] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 3.4h6.6L16 8.6v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z" />
        <path d="M10.4 3.6v5h5.2M6.4 11.6h6M6.4 14.4h4" />
      </svg>
      {label}
      <span className="text-[0.8rem] font-medium opacity-60">
        PDF, {site.panduan.halaman} hal
      </span>
    </a>
  );
}
