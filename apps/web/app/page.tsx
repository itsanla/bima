import GrafikPengukusan from "./_components/GrafikPengukusan";
import HeroPhone from "./_components/HeroPhone";
import LogoInstansi from "./_components/LogoInstansi";
import Reveal from "./_components/Reveal";
import UnduhButton, { KartuQr } from "./_components/UnduhButton";
import { kreditFoto, site } from "./_data/site";

const WADAH = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export default function Page() {
  return (
    <>
      <Navigasi />
      <main id="isi">
        <Hero />
        <PitaFakta />
        <Grafik />
        <Masalah />
        <YangDipantau />
        <CaraPasang />
        <TentangProgram />
      </main>
      <Footer />
    </>
  );
}

/* -- Navigasi -------------------------------------------------------------- */

function Navigasi() {
  return (
    <header className="sticky top-0 z-50 border-b border-garis bg-white/85 backdrop-blur-md">
      <nav className={`${WADAH} flex h-16 items-center justify-between gap-4`}>
        <a href="#isi" className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <LogoInstansi tinggi={28} className="shrink-0" />
          <span aria-hidden="true" className="h-7 w-px shrink-0 bg-garis" />
          <span className="text-[1.05rem] font-extrabold tracking-[-0.03em] text-hijau-tua sm:text-[1.1rem]">
            Steamlog
          </span>
        </a>

        <div className="flex items-center gap-7">
          <a
            href="#cara-pasang"
            className="hidden text-[0.92rem] font-medium text-abu transition-colors hover:text-hijau-tua sm:block"
          >
            Cara pasang
          </a>
          <a
            href="#tentang"
            className="hidden text-[0.92rem] font-medium text-abu transition-colors hover:text-hijau-tua sm:block"
          >
            Tentang program
          </a>
          <a
            href={site.apk.url}
            className="rounded-full bg-hijau px-4.5 py-2 text-[0.88rem] font-bold text-white transition-colors hover:bg-hijau-tua"
          >
            Unduh
          </a>
        </div>
      </nav>
    </header>
  );
}

/* -- Hero ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-mint">
      {/* Bayangan daun, diambil dari foto rak baglog yang diburamkan habis. */}
      <div
        aria-hidden="true"
        className="tekstur-daun pointer-events-none absolute inset-0"
      />

      <div
        className={`${WADAH} relative grid items-center gap-x-8 gap-y-2 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_460px] lg:pt-24`}
      >
        <div className="pb-14 lg:pb-28">
          <p className="t-eyebrow flex items-center gap-2 text-hijau">
            <span className="block h-1.5 w-1.5 rounded-full bg-hijau" />
            {site.penyelenggara}
          </p>

          <h1 className="t-display mt-5 max-w-[13ch] text-hijau-tua">
            Pantau kukusan baglog{" "}
            <span className="text-hijau">tanpa begadang</span>
          </h1>

          <p className="t-lead mt-6 max-w-[44ch] text-abu">
            Steamlog menampilkan suhu, lama pengukusan, dan nyala api dari alat
            kukus langsung ke layar HP. Sterilisasi tetap terpantau walaupun
            Anda sedang di rumah.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <UnduhButton />
            <KartuQr />
          </div>

          <p className="t-readout mt-5 text-[0.78rem] text-abu">
            {site.apk.namaBerkas} / {site.apk.ukuran} / versi {site.apk.versi}
          </p>
        </div>

        {/* HP sengaja dibiarkan terpotong tepi bawah pita, supaya hero terasa
            menerus ke bagian berikutnya alih alih berhenti mendadak. Kolomnya
            dibuat lebih lebar dari HP-nya supaya kartu yang menonjol ke samping
            tidak ikut terpotong. */}
        <div className="relative -mb-36 flex justify-center lg:-mb-48">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

/* -- Pita fakta ------------------------------------------------------------ */

const fakta = [
  ["Untuk HP Android", "Dipasang dari berkas APK, bukan lewat Play Store"],
  ["Tanpa pendaftaran", "Buka aplikasi, layar monitoring langsung tampil"],
  ["Terhubung langsung", "Angka berubah sendiri begitu alat mengirim data"],
];

function PitaFakta() {
  return (
    <section className="border-y border-garis bg-white">
      <div
        className={`${WADAH} grid gap-x-10 gap-y-7 py-10 sm:grid-cols-3 lg:py-12`}
      >
        {fakta.map(([judul, isi], i) => (
          <Reveal key={judul} delay={i * 80}>
            <p className="font-bold text-hijau-tua">{judul}</p>
            <p className="mt-1.5 text-[0.93rem] text-abu">{isi}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -- Grafik ---------------------------------------------------------------- */

function Grafik() {
  return (
    <section className="bg-white">
      <div className={`${WADAH} py-20 sm:py-24`}>
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="t-section max-w-[16ch] text-hijau-tua">
              Bentuk satu kali pengukusan yang benar
            </h2>
            <p className="max-w-[40ch] text-abu">
              Suhu naik cepat di jam pertama, lalu ditahan di zona steril selama
              berjam-jam. Turun sedikit saja di tengah proses, baglog bisa gagal.
              Grafik di bawah memutar satu proses 8 jam dalam 45 detik.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <GrafikPengukusan />
        </Reveal>
      </div>
    </section>
  );
}

/* -- Masalah --------------------------------------------------------------- */

const kerugian = [
  {
    judul: "Rawannya justru tengah malam",
    isi: "Pengukusan berlangsung berjam-jam. Bagian paling menentukan sering jatuh di jam-jam saat semua orang sudah tidur.",
  },
  {
    judul: "Tidak ada catatan yang bisa dilihat ulang",
    isi: "Tanpa rekaman suhu, tidak ada cara memastikan kukusan tadi malam sudah steril atau sempat kehilangan panas.",
  },
  {
    judul: "Ruginya baru terasa belakangan",
    isi: "Baglog yang tidak steril baru ketahuan sekitar dua minggu kemudian, saat miselium tidak mau menjalar.",
  },
];

function Masalah() {
  return (
    <section className="bg-kabut">
      <div className={`${WADAH} py-20 sm:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <img
                src="/images/jamur-baglog.webp"
                alt="Jamur tiram putih tumbuh keluar dari mulut baglog di dalam kumbung."
                width={900}
                height={1200}
                className="aspect-[4/5] w-full rounded-3xl bg-hijau-tua object-cover"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h2 className="t-section max-w-[17ch] text-hijau-tua">
                Satu tungku yang padam bisa merusak seluruh baglog
              </h2>
              <p className="t-lead mt-6 max-w-[50ch] text-abu">
                Baglog harus dikukus pada panas tinggi dan ditahan lama supaya
                jamur lain mati dan hanya bibit jamur tiram yang tumbuh. Kalau
                api padam atau kayu habis di tengah proses, suhu turun tanpa ada
                yang tahu.
              </p>
            </Reveal>

            <dl className="mt-10 space-y-3">
              {kerugian.map((k, i) => (
                <Reveal key={k.judul} delay={i * 90}>
                  <div className="rounded-2xl border border-garis bg-white px-6 py-6 sm:px-7">
                    <dt className="t-card text-hijau-tua">{k.judul}</dt>
                    <dd className="mt-2 max-w-[52ch] text-[0.96rem] text-abu">
                      {k.isi}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -- Yang dipantau --------------------------------------------------------- */

function YangDipantau() {
  return (
    <section id="yang-dipantau" className="bg-white">
      <div className={`${WADAH} py-20 sm:py-24`}>
        <Reveal>
          <h2 className="t-section max-w-[19ch] text-hijau-tua">
            Semuanya muat dalam satu layar
          </h2>
          <p className="t-lead mt-5 max-w-[52ch] text-abu">
            Tidak ada menu bertingkat, tidak ada pendaftaran akun, dan tidak ada
            istilah yang perlu dihafal.
          </p>
        </Reveal>

        {/* Ukuran kartu sengaja tidak seragam: yang paling sering dilihat
            petani diberi ruang paling besar. */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal className="sm:col-span-2">
            <article className="h-full rounded-3xl border border-garis bg-mint px-7 py-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[0.75rem] font-bold text-hijau">
                <span className="block h-1.5 w-1.5 rounded-full bg-hijau" />
                Paling sering dilihat
              </span>
              <h3 className="t-card mt-4 text-hijau-tua">
                Suhu terbaru dari dalam kukusan
              </h3>
              <p className="mt-2.5 max-w-[46ch] text-[0.96rem] text-abu">
                Dibaca sensor di dalam drum dan ditampilkan dalam derajat
                Celsius. Kalau panas mulai turun, angkanya terlihat turun juga,
                jadi Anda tahu kapan kayu perlu ditambah.
              </p>
            </article>
          </Reveal>

          {[
            {
              judul: "Status alat",
              isi: "Sedang mengukus atau sudah berhenti, lengkap dengan nama alat dan waktu terakhir mengirim data.",
            },
            {
              judul: "Lama pengukusan",
              isi: "Penghitung waktu berjalan dalam format jam, menit, detik sejak proses dimulai.",
            },
            {
              judul: "Nyala api",
              isi: "Menandai keadaan tungku, supaya jelas kapan proses sudah boleh diakhiri.",
            },
            {
              judul: "Ringkasan hari ini",
              isi: "Berapa alat yang terhubung dan berapa catatan suhu yang tersimpan hari ini.",
            },
          ].map((p, i) => (
            <Reveal key={p.judul} delay={(i % 3) * 80}>
              <article className="h-full rounded-3xl border border-garis px-7 py-7">
                <h3 className="t-card text-hijau-tua">{p.judul}</h3>
                <p className="mt-2.5 text-[0.96rem] text-abu">{p.isi}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -- Cara pasang ----------------------------------------------------------- */

const langkah = [
  {
    judul: "Unduh berkas APK",
    isi: "Tekan tombol unduh di halaman ini lewat HP Android. Berkas bernama app-release.apk akan tersimpan di folder Unduhan.",
  },
  {
    judul: "Izinkan pemasangan dari peramban",
    isi: "Android akan menahan pemasangan dari luar Play Store. Pada peringatan yang muncul, pilih Setelan, lalu nyalakan Izinkan dari sumber ini untuk peramban yang Anda pakai, dan kembali untuk menekan Pasang.",
  },
  {
    judul: "Buka Steamlog",
    isi: "Setelah terpasang, buka aplikasinya. Layar monitoring langsung tampil, tanpa perlu mendaftar atau memasukkan alamat server.",
  },
];

function CaraPasang() {
  return (
    <section id="cara-pasang" className="bg-hijau-tua text-white">
      <div className={`${WADAH} py-20 sm:py-24`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <h2 className="t-section max-w-[13ch]">
              Tiga langkah, sekitar dua menit
            </h2>
            <p className="mt-6 max-w-[40ch] text-white/70">
              Steamlog dibagikan sebagai berkas APK dan belum melalui Play Store,
              jadi ada satu izin tambahan yang perlu dinyalakan sekali saja.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <UnduhButton varian="garis" />
              <KartuQr gelap />
            </div>
          </Reveal>

          <ol className="space-y-3">
            {langkah.map((l, i) => (
              <li key={l.judul}>
                <Reveal delay={i * 90}>
                  <div className="flex gap-5 rounded-2xl border border-white/12 bg-white/6 px-6 py-6 sm:px-7">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/12 text-[0.85rem] font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="t-card">{l.judul}</h3>
                      <p className="mt-2 max-w-[48ch] text-[0.96rem] text-white/70">
                        {l.isi}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* -- Tentang program ------------------------------------------------------- */

function TentangProgram() {
  return (
    <section id="tentang" className="bg-white">
      <div className={`${WADAH} py-20 sm:py-24`}>
        <Reveal>
          <p className="t-eyebrow text-hijau">Tentang program</p>
          <h2 className="t-section mt-5 max-w-[24ch] text-hijau-tua">
            {site.judulProgram}
          </h2>
          <p className="t-lead mt-7 max-w-[56ch] text-abu">
            Steamlog dikembangkan sebagai bagian dari program pemberdayaan kelompok
            usaha jamur tiram yang diselenggarakan {site.penyelenggara}. Alat
            pengukus baglog dipasangi sensor suhu, hasil bacaannya dikirim ke
            server, lalu ditampilkan di aplikasi Android supaya petani bisa
            mengawasi proses sterilisasi dari mana saja.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <img
              src="/images/kumbung-baglog.webp"
              alt="Rak baglog di dalam kumbung dengan jamur tiram yang mulai tumbuh."
              width={1600}
              height={1000}
              className="aspect-[8/5] w-full rounded-3xl object-cover"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal delay={110}>
            <img
              src="/images/hasil-jamur-tiram.webp"
              alt="Jamur tiram hasil panen yang siap dijual, ditata bersama baglognya."
              width={1400}
              height={1000}
              className="aspect-[8/5] w-full rounded-3xl object-cover"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-garis bg-kabut px-7 py-7 sm:flex-row sm:items-center sm:gap-9">
            <LogoInstansi tinggi={64} className="shrink-0" />
            <p className="max-w-[46ch] text-[0.95rem] text-abu">
              Steamlog adalah nama sistemnya. BIMA adalah skema pendanaan yang
              membiayai program ini, dan Politeknik Negeri Padang adalah
              penyelenggaranya.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 grid gap-8 border-t border-garis pt-10 sm:grid-cols-3">
            {[
              ["Penyelenggara", site.penyelenggara],
              ["Sasaran", "Kelompok usaha jamur tiram"],
              ["Bentuk", "Alat sensor suhu dan aplikasi Android"],
            ].map(([label, nilai]) => (
              <div key={label}>
                <p className="t-eyebrow text-abu">{label}</p>
                <p className="mt-2 font-semibold text-hijau-tua">{nilai}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -- Footer ---------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="bg-hijau-tua text-white">
      <div className={`${WADAH} py-16`}>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[1.5rem] font-extrabold tracking-[-0.03em]">
              Steamlog
            </p>
            <p className="mt-2 max-w-[32ch] text-[0.92rem] text-white/65">
              Monitoring suhu sterilisasi baglog untuk kelompok usaha jamur
              tiram.
            </p>
          </div>
          <div>
            <UnduhButton varian="garis" label="Unduh aplikasi" />
            <p className="t-readout mt-3 text-[0.78rem] text-white/60">
              {site.apk.namaBerkas} / {site.apk.ukuran} / versi{" "}
              {site.apk.versi}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/12 pt-8 text-[0.82rem] text-white/60 sm:flex-row sm:items-start sm:justify-between">
          <p>
            {site.penyelenggara} / {site.domain}
          </p>
          <p className="max-w-[46ch] sm:text-right">
            Foto jamur tiram oleh{" "}
            {kreditFoto.map((f, i) => (
              <span key={f.pemotret}>
                {i > 0 && " dan "}
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white"
                >
                  {f.pemotret}
                </a>
              </span>
            ))}{" "}
            lewat Wikimedia Commons, lisensi CC BY-SA 4.0.
          </p>
        </div>
      </div>
    </footer>
  );
}
