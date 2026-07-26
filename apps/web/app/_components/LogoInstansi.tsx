/* ==========================================================================
   Lambang tiga lembaga di balik Steamlog.

   Urutannya sudah ditetapkan dan tidak boleh ditukar: kementerian, BIMA,
   lalu Politeknik Negeri Padang. Ketiganya lambang resmi dengan detail rapat,
   jadi jangan dipakai jauh di bawah 28 px karena akan jadi bercak warna.
   ========================================================================== */

const LAMBANG = [
  { berkas: "logo-kementrian", alt: "Logo Tut Wuri Handayani" },
  { berkas: "logo-bima", alt: "Logo BIMA" },
  { berkas: "logo-pnp", alt: "Logo Politeknik Negeri Padang" },
] as const;

export default function LogoInstansi({
  tinggi = 32,
  className = "",
}: {
  /** Tinggi tiap lambang dalam piksel. */
  tinggi?: number;
  className?: string;
}) {
  return (
    <span className={`flex items-center ${className}`} style={{ gap: tinggi * 0.28 }}>
      {LAMBANG.map((l) => (
        <img
          key={l.berkas}
          src={`/images/${l.berkas}.webp`}
          alt={l.alt}
          height={tinggi}
          width={tinggi}
          style={{ height: tinggi, width: "auto" }}
          className="block w-auto shrink-0 object-contain"
          decoding="async"
        />
      ))}
    </span>
  );
}
