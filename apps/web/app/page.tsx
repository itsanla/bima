import HeroRun from "./_components/HeroRun";
import Reveal from "./_components/Reveal";
import UnduhButton, { UnduhKeterangan } from "./_components/UnduhButton";
import { kreditFoto, site } from "./_data/site";

const WADAH = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export default function Page() {
  return (
    <>
      <Navigasi />
      <main id="isi">
        <Hero />
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
    <header className="sticky top-0 z-50 border-b border-kukus-3/70 bg-kukus/85 backdrop-blur-md">
      <nav className={`${WADAH} flex h-16 items-center justify-between gap-4`}>
        <a href="#isi" className="flex items-baseline gap-2.5">
          <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.04em]">
            Bima
          </span>
          <span className="t-label hidden text-kabut sm:inline">
            Steamlog
          </span>
        </a>

        <div className="flex items-center gap-6">
          <a
            href="#cara-pasang"
            className="hidden text-[0.9rem] text-kabut transition-colors hover:text-uap sm:block"
          >
            Cara pasang
          </a>
          <a
            href="#tentang"
            className="hidden text-[0.9rem] text-kabut transition-colors hover:text-uap sm:block"
          >
            Tentang program
          </a>
          <a
            href={site.apk.url}
            className="rounded-full bg-steril px-4 py-2 text-[0.85rem] font-semibold text-kukus transition-colors hover:bg-white"
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
    <section className="relative overflow-hidden">
      <div className={`${WADAH} pt-14 pb-12 sm:pt-20 lg:pt-24 lg:pb-16`}>
        <HeroRun>
          <p className="t-label text-steril">
            Program pemberdayaan masyarakat
          </p>
          <h1 className="t-display mt-6 max-w-[15ch]">
            Kukusan baglog tidak perlu ditunggui semalaman.
          </h1>
          <p className="t-lead mt-7 max-w-[46ch] text-kabut">
            Bima menampilkan suhu, lama pengukusan, dan nyala api dari alat
            kukus baglog langsung ke layar HP. Sterilisasi tetap terpantau
            walaupun Anda sedang di rumah.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <UnduhButton />
            <a
              href={site.apk.halamanRilis}
              className="text-[0.92rem] text-kabut underline decoration-kukus-3 underline-offset-4 transition-colors hover:text-uap hover:decoration-steril"
              target="_blank"
              rel="noreferrer"
            >
              Lihat halaman rilis
            </a>
          </div>
          <UnduhKeterangan className="mt-4 text-kabut" />
        </HeroRun>
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
    <section className="bg-kertas text-arang">
      <div className={`${WADAH} py-20 sm:py-28`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          {/* Foto dibuat menempel supaya kolom kiri tidak menyisakan ruang
              kosong panjang saat daftar di kanan lebih tinggi. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <img
                src="/images/jamur-baglog.webp"
                alt="Jamur tiram putih tumbuh keluar dari mulut baglog di dalam kumbung."
                width={900}
                height={1200}
                className="aspect-[3/4] w-full rounded-3xl bg-kukus object-cover"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>

          <div className="lg:pt-6">
            <Reveal>
              <p className="t-label text-arang/50">Kenapa dipantau</p>
              <h2 className="t-section mt-5 max-w-[18ch]">
                Satu tungku yang padam bisa merusak seluruh baglog.
              </h2>
              <p className="t-lead mt-7 max-w-[52ch] text-arang/70">
                Baglog harus dikukus pada panas tinggi dan ditahan lama supaya
                jamur lain mati dan hanya bibit jamur tiram yang tumbuh. Kalau
                api padam atau kayu habis di tengah proses, suhu turun tanpa ada
                yang tahu.
              </p>
            </Reveal>

            <dl className="mt-12 space-y-px overflow-hidden rounded-2xl border border-arang/12">
              {kerugian.map((k, i) => (
                <Reveal key={k.judul} delay={i * 90}>
                  <div className="bg-arang/4 px-6 py-6 sm:px-8">
                    <dt className="t-card">{k.judul}</dt>
                    <dd className="mt-2.5 max-w-[54ch] text-[0.98rem] text-arang/70">
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

const pembacaan = [
  {
    label: "Status alat",
    judul: "Sedang mengukus atau sudah berhenti",
    isi: "Kartu paling atas memberi tahu keadaan alat sekarang, lengkap dengan nama alat dan waktu terakhir mengirim data.",
    warna: "steril",
  },
  {
    label: "Suhu",
    judul: "Angka panas terbaru dari dalam kukusan",
    isi: "Dibaca sensor di dalam drum dan ditampilkan dalam derajat Celsius, sehingga terlihat kalau panas mulai turun.",
    warna: "steril",
  },
  {
    label: "Lama pengukusan",
    judul: "Penghitung waktu sejak proses dimulai",
    isi: "Berjalan terus dalam format jam, menit, detik. Anda tahu sudah berapa lama baglog dikukus tanpa perlu mencatat manual.",
    warna: "kabut",
  },
  {
    label: "Api",
    judul: "Menyala atau mati",
    isi: "Menandai keadaan tungku, supaya jelas kapan kayu perlu ditambah dan kapan proses sudah boleh diakhiri.",
    warna: "api",
  },
  {
    label: "Ringkasan hari ini",
    judul: "Jumlah alat dan catatan yang masuk",
    isi: "Berapa alat yang terhubung, berapa yang sedang online, dan berapa banyak catatan suhu yang tersimpan hari ini.",
    warna: "kabut",
  },
  {
    label: "Sambungan langsung",
    judul: "Angka berubah sendiri di layar",
    isi: "Aplikasi menjaga sambungan ke alat, jadi angkanya ikut berubah begitu data baru masuk. Layar tidak perlu ditarik untuk menyegarkan.",
    warna: "steril",
  },
];

const warnaAksen: Record<string, string> = {
  steril: "text-steril",
  api: "text-api",
  kabut: "text-kabut",
};

function YangDipantau() {
  return (
    <section id="yang-dipantau" className="border-t border-kukus-3">
      <div className={`${WADAH} py-20 sm:py-28`}>
        <Reveal>
          <p className="t-label text-kabut">Isi layar aplikasi</p>
          <h2 className="t-section mt-5 max-w-[20ch]">
            Enam hal yang ditunjukkan Bima, dan tidak lebih dari itu.
          </h2>
          <p className="t-lead mt-7 max-w-[54ch] text-kabut">
            Semuanya muat dalam satu layar. Tidak ada menu bertingkat, tidak ada
            pendaftaran akun, dan tidak ada istilah yang perlu dihafal.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-kukus-3 bg-kukus-3 sm:grid-cols-2 lg:grid-cols-3">
          {pembacaan.map((p, i) => (
            <Reveal key={p.label} delay={(i % 3) * 90} className="bg-kukus">
              <article className="px-7 py-8">
                <p className={`t-label ${warnaAksen[p.warna]}`}>{p.label}</p>
                <h3 className="t-card mt-4 max-w-[22ch]">{p.judul}</h3>
                <p className="mt-3 text-[0.95rem] text-kabut">{p.isi}</p>
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
    judul: "Buka Bima",
    isi: "Setelah terpasang, buka aplikasinya. Layar monitoring langsung tampil, tanpa perlu mendaftar atau memasukkan alamat server.",
  },
];

function CaraPasang() {
  return (
    <section id="cara-pasang" className="bg-kertas text-arang">
      <div className={`${WADAH} py-20 sm:py-28`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="t-label text-arang/50">Pemasangan</p>
            <h2 className="t-section mt-5 max-w-[14ch]">
              Tiga langkah, sekitar dua menit.
            </h2>
            <p className="mt-7 max-w-[42ch] text-arang/70">
              Bima dibagikan sebagai berkas APK dan belum melalui Play Store,
              jadi ada satu izin tambahan yang perlu dinyalakan sekali saja.
            </p>
            <div className="mt-9">
              <UnduhButton varian="gelap" />
              <UnduhKeterangan className="mt-4 text-arang/55" />
            </div>
          </Reveal>

          <ol className="space-y-px overflow-hidden rounded-2xl border border-arang/12">
            {langkah.map((l, i) => (
              <li key={l.judul} className="bg-arang/4">
                <Reveal delay={i * 100}>
                  <div className="flex gap-6 px-6 py-7 sm:px-8">
                    <span className="t-readout mt-1 shrink-0 text-[0.82rem] font-semibold text-arang/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="t-card">{l.judul}</h3>
                      <p className="mt-2.5 max-w-[50ch] text-[0.98rem] text-arang/70">
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
    <section id="tentang" className="border-t border-kukus-3">
      <div className={`${WADAH} py-20 sm:py-28`}>
        <Reveal>
          <p className="t-label text-kabut">Tentang program</p>
          <h2 className="t-section mt-6 max-w-[26ch] text-balance">
            {site.judulProgram}
          </h2>
          <p className="t-lead mt-8 max-w-[56ch] text-kabut">
            Bima dikembangkan sebagai bagian dari program pemberdayaan kelompok
            usaha jamur tiram yang diselenggarakan {site.penyelenggara}. Alat
            pengukus baglog dipasangi sensor suhu, hasil bacaannya dikirim ke
            server, lalu ditampilkan di aplikasi Android supaya petani bisa
            mengawasi proses sterilisasi dari mana saja.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
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
          <div className="mt-14 grid gap-8 border-t border-kukus-3 pt-10 sm:grid-cols-3">
            {[
              ["Penyelenggara", site.penyelenggara],
              ["Sasaran", "Kelompok usaha jamur tiram"],
              ["Bentuk", "Alat sensor suhu dan aplikasi Android"],
            ].map(([label, nilai]) => (
              <div key={label}>
                <p className="t-label text-kabut">{label}</p>
                <p className="mt-3 text-[1.02rem]">{nilai}</p>
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
    <footer className="border-t border-kukus-3 bg-kukus-2/40">
      <div className={`${WADAH} py-16`}>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-[1.6rem] font-extrabold tracking-[-0.04em]">
              Bima
            </p>
            <p className="mt-2 max-w-[34ch] text-[0.92rem] text-kabut">
              Monitoring suhu sterilisasi baglog untuk kelompok usaha jamur
              tiram.
            </p>
          </div>
          <div>
            <UnduhButton label="Unduh aplikasi" />
            <UnduhKeterangan className="mt-3 text-kabut" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-kukus-3 pt-8 text-[0.82rem] text-kabut sm:flex-row sm:items-start sm:justify-between">
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
                  className="underline decoration-kukus-3 underline-offset-2 transition-colors hover:text-uap"
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
