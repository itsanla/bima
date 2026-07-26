"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import KartuAuth, {
  Kolom,
  Peringatan,
  TombolKirim,
} from "../_components/KartuAuth";
import { auth, GalatApi } from "../_lib/api";

export default function Halaman() {
  return (
    <Suspense fallback={<KartuAuth judul="Masuk">{null}</KartuAuth>}>
      <FormMasuk />
    </Suspense>
  );
}

function FormMasuk() {
  const router = useRouter();
  const params = useSearchParams();
  const baruVerifikasi = params.get("verifikasi") === "berhasil";

  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setMemuat(true);
    try {
      await auth.masuk(email.trim().toLowerCase(), kataSandi);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setGalat(
        err instanceof GalatApi ? err.message : "Gagal masuk. Coba lagi.",
      );
      setMemuat(false);
    }
  }

  return (
    <KartuAuth
      judul="Masuk"
      keterangan="Halaman monitoring hanya untuk pengelola alat. Gunakan akun yang sudah terdaftar."
      bawah={
        <>
          Belum punya akun?{" "}
          <Link
            href="/daftar"
            className="font-semibold text-hijau underline underline-offset-4 hover:text-hijau-tua"
          >
            Daftar sebagai monitor
          </Link>
        </>
      }
    >
      <form onSubmit={kirim} className="space-y-4">
        {baruVerifikasi ? (
          <Peringatan jenis="berhasil">
            Email Anda sudah terverifikasi. Silakan masuk.
          </Peringatan>
        ) : null}
        {galat ? <Peringatan>{galat}</Peringatan> : null}

        <Kolom
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@contoh.com"
        />
        <Kolom
          label="Kata sandi"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={kataSandi}
          onChange={(e) => setKataSandi(e.target.value)}
          placeholder="Kata sandi Anda"
        />

        <div className="pt-1">
          <TombolKirim memuat={memuat}>Masuk</TombolKirim>
        </div>
      </form>
    </KartuAuth>
  );
}
