"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import KartuAuth, { Peringatan } from "../_components/KartuAuth";
import { auth, GalatApi } from "../_lib/api";

export default function Halaman() {
  return (
    <Suspense
      fallback={<KartuAuth judul="Memeriksa tautan...">{null}</KartuAuth>}
    >
      <Verifikasi />
    </Suspense>
  );
}

type Keadaan =
  | { jenis: "memuat" }
  | { jenis: "berhasil"; email: string }
  | { jenis: "gagal"; pesan: string };

function Verifikasi() {
  const token = useSearchParams().get("token");
  const [keadaan, setKeadaan] = useState<Keadaan>({ jenis: "memuat" });
  // React memanggil efek dua kali di mode pengembangan. Token verifikasi hanya
  // sekali pakai, jadi pemanggilan kedua harus ditahan atau hasilnya jadi
  // "tautan sudah dipakai" padahal baru sekali diklik.
  const sudahJalan = useRef(false);

  useEffect(() => {
    if (sudahJalan.current) return;
    sudahJalan.current = true;

    if (!token) {
      setKeadaan({ jenis: "gagal", pesan: "Tautan tidak memuat token." });
      return;
    }
    auth
      .verifikasi(token)
      .then((hasil) => setKeadaan({ jenis: "berhasil", email: hasil.email }))
      .catch((err) =>
        setKeadaan({
          jenis: "gagal",
          pesan:
            err instanceof GalatApi
              ? err.message
              : "Verifikasi gagal. Coba buka tautannya lagi.",
        }),
      );
  }, [token]);

  if (keadaan.jenis === "memuat") {
    return (
      <KartuAuth
        judul="Memeriksa tautan"
        keterangan="Sebentar, akun Anda sedang diaktifkan."
      >
        {null}
      </KartuAuth>
    );
  }

  if (keadaan.jenis === "berhasil") {
    return (
      <KartuAuth
        judul="Akun Anda aktif"
        keterangan={
          <>
            Email{" "}
            <strong className="font-semibold text-hijau-tua">
              {keadaan.email}
            </strong>{" "}
            sudah terverifikasi. Sekarang Anda bisa masuk.
          </>
        }
      >
        <Link
          href="/masuk?verifikasi=berhasil"
          className="block w-full rounded-full bg-hijau px-6 py-3.5 text-center text-[0.98rem] font-bold text-white transition-colors hover:bg-hijau-tua"
        >
          Masuk sekarang
        </Link>
      </KartuAuth>
    );
  }

  return (
    <KartuAuth
      judul="Tautan tidak bisa dipakai"
      bawah={
        <Link
          href="/masuk"
          className="font-semibold text-hijau underline underline-offset-4 hover:text-hijau-tua"
        >
          Kembali ke halaman masuk
        </Link>
      }
    >
      <Peringatan>{keadaan.pesan}</Peringatan>
    </KartuAuth>
  );
}
