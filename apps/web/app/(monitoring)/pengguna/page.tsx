"use client";

import { useCallback, useEffect, useState } from "react";
import { usePengguna } from "../../_components/AuthProvider";
import { GalatApi, pengguna as apiPengguna, type Peran, type Pengguna } from "../../_lib/api";
import { waktuPanjang } from "../../_lib/format";

export default function AturPengguna() {
  const { pengguna: saya } = usePengguna();
  const [daftar, setDaftar] = useState<Pengguna[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [kabar, setKabar] = useState<string | null>(null);
  const [formTerbuka, setFormTerbuka] = useState(false);

  const muat = useCallback(async () => {
    setGalat(null);
    try {
      setDaftar(await apiPengguna.daftar());
    } catch (err) {
      setGalat(
        err instanceof GalatApi ? err.message : "Gagal mengambil daftar pengguna",
      );
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    void muat();
  }, [muat]);

  async function ubahPeran(u: Pengguna, peran: Peran) {
    setGalat(null);
    setKabar(null);
    try {
      await apiPengguna.ubah(u.id, { role: peran });
      setKabar(`Peran ${u.email} diubah jadi ${peran === "ADMIN" ? "admin" : "monitor"}.`);
      await muat();
    } catch (err) {
      setGalat(err instanceof GalatApi ? err.message : "Gagal mengubah peran");
    }
  }

  async function hapus(u: Pengguna) {
    if (
      !window.confirm(
        `Hapus akun ${u.email}? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }
    setGalat(null);
    setKabar(null);
    try {
      await apiPengguna.hapus(u.id);
      setKabar(`Akun ${u.email} dihapus.`);
      await muat();
    } catch (err) {
      setGalat(err instanceof GalatApi ? err.message : "Gagal menghapus akun");
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-hijau-tua">
            Atur pengguna
          </h1>
          <p className="mt-1 max-w-[52ch] text-[0.95rem] text-abu">
            Admin bisa membuka semua halaman. Monitor hanya bisa melihat
            dashboard dan riwayat.
          </p>
        </div>
        <button
          onClick={() => setFormTerbuka((t) => !t)}
          className="rounded-full bg-hijau px-5 py-2.5 text-[0.9rem] font-bold text-white transition-colors hover:bg-hijau-tua"
        >
          {formTerbuka ? "Tutup formulir" : "Tambah pengguna"}
        </button>
      </div>

      {galat ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-api/25 bg-api/8 px-5 py-4 text-[0.9rem] text-api"
        >
          {galat}
        </p>
      ) : null}
      {kabar ? (
        <p
          role="status"
          className="mt-6 rounded-2xl border border-hijau/25 bg-hijau/8 px-5 py-4 text-[0.9rem] text-hijau"
        >
          {kabar}
        </p>
      ) : null}

      {formTerbuka ? (
        <FormTambah
          onSelesai={async (pesan) => {
            setKabar(pesan);
            setFormTerbuka(false);
            await muat();
          }}
          onGagal={setGalat}
        />
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl border border-garis bg-white">
        {memuat ? (
          <p className="px-6 py-14 text-center text-[0.94rem] text-abu">
            Memuat daftar pengguna...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-[0.9rem]">
              <thead className="bg-kabut text-[0.75rem] tracking-wide text-abu uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nama</th>
                  <th className="px-3 py-3 font-semibold">Email</th>
                  <th className="px-3 py-3 font-semibold">Peran</th>
                  <th className="px-3 py-3 font-semibold">Terdaftar</th>
                  <th className="px-6 py-3 font-semibold">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-garis">
                {daftar.map((u) => {
                  const diriSendiri = u.id === saya?.id;
                  return (
                    <tr key={u.id}>
                      <td className="px-6 py-3 font-semibold text-hijau-tua">
                        {u.name}
                        {diriSendiri ? (
                          <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[0.68rem] font-bold text-hijau">
                            Anda
                          </span>
                        ) : null}
                        {!u.emailVerified ? (
                          <span className="ml-2 rounded-full bg-api/10 px-2 py-0.5 text-[0.68rem] font-bold text-api">
                            Belum verifikasi
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-abu">{u.email}</td>
                      <td className="px-3 py-3">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            void ubahPeran(u, e.target.value as Peran)
                          }
                          disabled={diriSendiri}
                          aria-label={`Peran untuk ${u.email}`}
                          className="rounded-lg border border-garis bg-white px-2.5 py-1.5 text-[0.85rem] font-semibold text-hijau-tua outline-none focus:border-hijau disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          <option value="MONITOR">Monitor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 text-[0.85rem] text-abu">
                        {u.createdAt ? waktuPanjang(u.createdAt) : "-"}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => void hapus(u)}
                          disabled={diriSendiri}
                          className="rounded-full border border-garis px-3.5 py-1.5 text-[0.83rem] font-semibold text-api transition-colors hover:bg-api/8 disabled:cursor-not-allowed disabled:border-garis disabled:text-abu/50 disabled:hover:bg-transparent"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function FormTambah({
  onSelesai,
  onGagal,
}: {
  onSelesai: (pesan: string) => Promise<void>;
  onGagal: (pesan: string) => void;
}) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [peran, setPeran] = useState<Peran>("MONITOR");
  const [memuat, setMemuat] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setMemuat(true);
    try {
      await apiPengguna.buat({
        name: nama.trim(),
        email: email.trim().toLowerCase(),
        password: kataSandi,
        role: peran,
      });
      await onSelesai(
        `Akun ${email.trim().toLowerCase()} dibuat dan langsung bisa dipakai.`,
      );
      setNama("");
      setEmail("");
      setKataSandi("");
    } catch (err) {
      onGagal(
        err instanceof GalatApi ? err.message : "Gagal membuat akun baru",
      );
    } finally {
      setMemuat(false);
    }
  }

  return (
    <form
      onSubmit={kirim}
      className="mt-6 rounded-3xl border border-garis bg-white px-6 py-6"
    >
      <p className="font-bold text-hijau-tua">Tambah pengguna</p>
      <p className="mt-1 max-w-[56ch] text-[0.88rem] text-abu">
        Akun yang dibuat di sini langsung aktif tanpa perlu verifikasi email,
        karena Anda sendiri yang menjamin alamatnya benar.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kolom
          label="Nama"
          value={nama}
          onChange={setNama}
          required
          minLength={2}
        />
        <Kolom
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Kolom
          label="Kata sandi"
          type="password"
          value={kataSandi}
          onChange={setKataSandi}
          required
          minLength={8}
        />
        <label className="block">
          <span className="mb-1.5 block text-[0.85rem] font-semibold text-hijau-tua">
            Peran
          </span>
          <select
            value={peran}
            onChange={(e) => setPeran(e.target.value as Peran)}
            className="w-full rounded-xl border border-garis bg-white px-3.5 py-2.5 text-[0.94rem] outline-none focus:border-hijau"
          >
            <option value="MONITOR">Monitor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={memuat}
        className="mt-5 rounded-full bg-hijau px-6 py-2.5 text-[0.9rem] font-bold text-white transition-colors hover:bg-hijau-tua disabled:opacity-60"
      >
        {memuat ? "Menyimpan..." : "Buat akun"}
      </button>
    </form>
  );
}

function Kolom({
  label,
  value,
  onChange,
  type = "text",
  ...sisa
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.85rem] font-semibold text-hijau-tua">
        {label}
      </span>
      <input
        {...sisa}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-garis bg-white px-3.5 py-2.5 text-[0.94rem] outline-none focus:border-hijau"
      />
    </label>
  );
}
