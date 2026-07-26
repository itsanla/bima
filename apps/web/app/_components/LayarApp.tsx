import { jamKeWaktu } from "../_lib/pengukusan";

/** Warna disalin dari tema aplikasi Flutter (lib/config/app_colors.dart),
 *  supaya mock ini benar benar mewakili yang akan dilihat pengguna. */
const app = {
  latar: "#FAF9F9",
  permukaan: "#FFFFFF",
  teksGelap: "#1A1C1C",
  teksAbu: "#707883",
  hijau: "#006E1C",
  hijauMuda: "#91F78E",
  hijauTeks: "#00731E",
  jinggaTeks: "#8B5000",
  jinggaMuda: "#FFDCBE",
  biruTeks: "#0061A4",
  biruMuda: "#D1E4FF",
  garis: "#E3E2E2",
  garisAbu: "#BFC7D4",
};

export default function LayarApp({
  suhu,
  jam,
  apiMenyala,
  berjalan,
  catatan,
}: {
  suhu: number;
  jam: number;
  apiMenyala: boolean;
  berjalan: boolean;
  catatan: number;
}) {
  return (
    <div
      className="flex h-full flex-col"
      style={{ background: app.latar, color: app.teksGelap }}
      aria-hidden="true"
    >
      {/* Bilah status iOS. Kosong di tengah karena tertutup Dynamic Island. */}
      <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-semibold">
        <span className="t-readout tracking-tight">09:41</span>
        <span className="flex items-center gap-[3px]">
          <SinyalIkon />
          <WifiIkon />
          <BateraiIkon />
        </span>
      </div>

      {/* Bilah judul aplikasi */}
      <div
        className="flex items-center justify-between px-3.5 pt-2.5 pb-2.5"
        style={{ background: app.permukaan }}
      >
        <span className="flex items-center gap-2">
          <span className="flex flex-col gap-[2.5px]">
            <i className="block h-[1.5px] w-[13px] rounded-full bg-[#404752]" />
            <i className="block h-[1.5px] w-[13px] rounded-full bg-[#404752]" />
            <i className="block h-[1.5px] w-[8px] rounded-full bg-[#404752]" />
          </span>
          <span className="text-[11.5px] font-semibold tracking-tight">
            Monitoring Alat Kukusan
          </span>
        </span>
        <span
          className="block h-[6px] w-[6px] rounded-full"
          style={{ background: app.jinggaTeks }}
        />
      </div>

      <div className="flex-1 space-y-2.5 px-3 py-3">
        {/* Kartu keadaan alat */}
        <div
          className="rounded-[10px] px-3 py-2.5"
          style={{
            background: app.permukaan,
            border: `2.5px solid ${berjalan ? app.hijau : app.garisAbu}`,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[7.5px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: app.teksAbu }}
              >
                Current status
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <span
                  className="block h-[7px] w-[7px] rounded-full"
                  style={{ background: berjalan ? app.hijau : app.garisAbu }}
                />
                <span className="text-[13px] font-bold">
                  {berjalan ? "Running" : "Stopped"}
                </span>
              </p>
            </div>
            <span
              className="rounded-full px-1.5 py-[3px] text-[8px] font-bold"
              style={{ background: app.hijauMuda, color: app.hijauTeks }}
            >
              Live
            </span>
          </div>
          <div
            className="t-readout mt-2 flex items-center justify-between border-t pt-1.5 text-[8.5px]"
            style={{ borderColor: app.garis, color: app.teksAbu }}
          >
            <span>STEAMLOG-01</span>
            <span>{jamKeWaktu(jam)} berjalan</span>
          </div>
        </div>

        {/* Suhu dan api */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            className="rounded-[10px] px-2.5 py-2.5"
            style={{ background: app.biruMuda }}
          >
            <p
              className="text-[7.5px] font-semibold tracking-[0.14em] uppercase"
              style={{ color: app.biruTeks }}
            >
              Suhu
            </p>
            <p
              className="t-readout mt-1 text-[21px] leading-none font-semibold"
              style={{ color: app.biruTeks }}
            >
              {suhu.toFixed(1)}
              <span className="ml-px align-top text-[10px]">&deg;C</span>
            </p>
          </div>
          <div
            className="rounded-[10px] px-2.5 py-2.5"
            style={{
              background: apiMenyala ? app.jinggaMuda : "#ECECEC",
              color: apiMenyala ? app.jinggaTeks : app.teksAbu,
            }}
          >
            <p className="text-[7.5px] font-semibold tracking-[0.14em] uppercase">
              Api
            </p>
            <p className="mt-1 text-[14px] leading-none font-bold">
              {apiMenyala ? "Menyala" : "Mati"}
            </p>
            <p className="mt-1 text-[8px] leading-tight opacity-80">
              {apiMenyala ? "Tungku aktif" : "Tungku dingin"}
            </p>
          </div>
        </div>

        {/* Lama pengukusan */}
        <div
          className="rounded-[10px] px-3 py-2.5"
          style={{ background: app.permukaan, border: `1px solid ${app.garis}` }}
        >
          <p
            className="text-[7.5px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: app.teksAbu }}
          >
            Lama pengukusan
          </p>
          <p className="t-readout mt-1 text-[22px] leading-none font-semibold tracking-tight">
            {jamKeWaktu(jam)}
          </p>
        </div>

        {/* Ringkasan hari ini */}
        <div
          className="rounded-[10px] px-3 py-2.5"
          style={{ background: app.permukaan, border: `1px solid ${app.garis}` }}
        >
          <p
            className="text-[7.5px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: app.teksAbu }}
          >
            Ringkasan hari ini
          </p>
          <div className="mt-1.5 flex items-end justify-between">
            {[
              ["Alat", "1"],
              ["Online", "1"],
              ["Catatan", String(catatan)],
            ].map(([label, nilai]) => (
              <div key={label}>
                <p className="t-readout text-[14px] leading-none font-bold">
                  {nilai}
                </p>
                <p className="mt-0.5 text-[8px]" style={{ color: app.teksAbu }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigasi bawah */}
      <div
        className="flex items-center justify-around border-t px-6 pt-2.5 pb-5"
        style={{ borderColor: app.garis, background: app.permukaan }}
      >
        <span
          className="h-[5px] w-7 rounded-full"
          style={{ background: app.hijau }}
        />
        <span
          className="h-[5px] w-4 rounded-full"
          style={{ background: app.garisAbu }}
        />
        <span
          className="h-[5px] w-4 rounded-full"
          style={{ background: app.garisAbu }}
        />
      </div>
    </div>
  );
}

/* -- Ikon bilah status ----------------------------------------------------- */

function SinyalIkon() {
  return (
    <svg width="13" height="9" viewBox="0 0 17 11" fill="currentColor">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 4.4}
          y={8 - i * 2.6}
          width="2.8"
          height={3 + i * 2.6}
          rx="0.9"
        />
      ))}
    </svg>
  );
}

function WifiIkon() {
  return (
    <svg width="12" height="9" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 11.2 5.6 8.5a3.6 3.6 0 0 1 4.8 0L8 11.2Z" />
      <path
        d="M3.1 6.1a7.2 7.2 0 0 1 9.8 0"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M.9 3.4a10.6 10.6 0 0 1 14.2 0"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BateraiIkon() {
  return (
    <svg width="19" height="9" viewBox="0 0 25 12" fill="none">
      <rect
        x="0.6"
        y="0.6"
        width="21"
        height="10.8"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.1"
      />
      <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
      <path
        d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}
