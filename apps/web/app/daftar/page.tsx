"use client";

import Link from "next/link";
import { useState } from "react";
import KartuAuth, {
  Kolom,
  Peringatan,
  TombolKirim,
} from "../_components/KartuAuth";
import { auth, GalatApi } from "../_lib/api";

export default function Halaman() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);
  const [selesai, setSelesai] = useState<{ smtpAktif: boolean } | null>(null);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setMemuat(true);
    try {
      const hasil = await auth.daftar(
        nama.trim(),
        email.trim().toLowerCase(),
        kataSandi,
      );
      setSelesai({ smtpAktif: hasil.smtpAktif });
    } catch (err) {
      setGalat(
        err instanceof GalatApi ? err.message : "Pendaftaran gagal. Coba lagi.",
      );
    } finally {
      setMemuat(false);
    }
  }

  if (selesai) {
    return (
      <KartuAuth
        judul="Periksa email Anda"
        keterangan={
          <>
            Kami mengirim tautan aktivasi ke{" "}
            <strong className="font-semibold text-hijau-tua">{email}</strong>.
            Buka tautan itu untuk mengaktifkan akun. Tautannya berlaku 24 jam.
          </>
        }
        bawah={
          <Link
            href="/masuk"
            className="font-semibold text-hijau underline underline-offset-4 hover:text-hijau-tua"
          >
            Kembali ke halaman masuk
          </Link>
        }
      >
        {!selesai.smtpAktif ? (
          <Peringatan>
            Pengiriman email belum diaktifkan di server, jadi email aktivasi
            belum benar benar terkirim. Hubungi pengelola untuk mengaktifkan
            akun Anda secara manual.
          </Peringatan>
        ) : (
          <Peringatan jenis="berhasil">
            Email sudah dikirim. Kalau tidak ada di kotak masuk, periksa folder
            spam.
          </Peringatan>
        )}
      </KartuAuth>
    );
  }

  return (
    <KartuAuth
      judul="Daftar sebagai monitor"
      keterangan="Akun monitor bisa melihat dashboard dan riwayat pengukusan. Untuk mengelola pengguna, diperlukan akun admin."
      bawah={
        <>
          Sudah punya akun?{" "}
          <Link
            href="/masuk"
            className="font-semibold text-hijau underline underline-offset-4 hover:text-hijau-tua"
          >
            Masuk di sini
          </Link>
        </>
      }
    >
      <form onSubmit={kirim} className="space-y-4">
        {galat ? <Peringatan>{galat}</Peringatan> : null}

        <Kolom
          label="Nama"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Anda"
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={kataSandi}
          onChange={(e) => setKataSandi(e.target.value)}
          placeholder="Minimal 8 karakter"
        />

        <div className="pt-1">
          <TombolKirim memuat={memuat}>Daftar</TombolKirim>
        </div>
      </form>
    </KartuAuth>
  );
}
