import { site } from "../_data/site";

const gaya = {
  terang: "bg-uap text-arang hover:bg-white", // dipakai di atas latar gelap
  gelap: "bg-kukus text-uap hover:bg-kukus-2", // dipakai di atas latar terang
} as const;

export default function UnduhButton({
  varian = "terang",
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
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-[0.98rem] font-semibold tracking-tight transition-colors duration-200 ${gaya[varian]} ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
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

export function UnduhKeterangan({ className = "" }: { className?: string }) {
  return (
    <p className={`t-readout text-[0.78rem] ${className}`}>
      {site.apk.namaBerkas} / {site.apk.ukuran} / versi {site.apk.versi}
    </p>
  );
}
