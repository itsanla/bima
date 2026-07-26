import { IncomingMessage, ServerResponse } from 'http';
import logger from 'jet-logger';
import prisma from '../db/prisma';
import {
  PERAN,
  buatSesi,
  buatTokenVerifikasi,
  cocokKataSandi,
  emailSah,
  hapusCookieSesi,
  hapusSesi,
  hashKataSandi,
  masalahKataSandi,
  pakaiTokenVerifikasi,
  pasangCookieSesi,
  penggunaDariPermintaan,
  tokenDariPermintaan,
} from '../lib/auth';
import { kirimGagal, kirimOk, bacaJson, teksBersih } from '../lib/http';
import { kirimEmailVerifikasi, smtpAktif } from '../lib/mail';

/* -- Pembatas percobaan ---------------------------------------------------- */

/** Penahan sederhana di memori supaya kata sandi tidak bisa ditebak beruntun.
 *  Cukup untuk satu proses; kalau nanti API dijalankan lebih dari satu
 *  salinan, penahannya perlu pindah ke basis data atau Redis. */
const percobaan = new Map<string, { jumlah: number; sampai: number }>();
const BATAS = 8;
const JENDELA_MS = 10 * 60 * 1000;

function terlaluSering(kunci: string): boolean {
  const catatan = percobaan.get(kunci);
  if (!catatan) return false;
  if (Date.now() > catatan.sampai) {
    percobaan.delete(kunci);
    return false;
  }
  return catatan.jumlah >= BATAS;
}

function catatPercobaan(kunci: string): void {
  const catatan = percobaan.get(kunci);
  if (!catatan || Date.now() > catatan.sampai) {
    percobaan.set(kunci, { jumlah: 1, sampai: Date.now() + JENDELA_MS });
    return;
  }
  catatan.jumlah += 1;
}

function lupakanPercobaan(kunci: string): void {
  percobaan.delete(kunci);
}

function alamatPemanggil(req: IncomingMessage): string {
  const teruskan = req.headers['x-forwarded-for'];
  if (typeof teruskan === 'string' && teruskan) return teruskan.split(',')[0].trim();
  return req.socket.remoteAddress || 'tidak-diketahui';
}

/* -- Rute ------------------------------------------------------------------ */

/** Mengembalikan true kalau permintaannya sudah ditangani di sini. */
export async function tanganiAuth(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  if (!pathname.startsWith('/api/auth/')) return false;

  try {
    if (req.method === 'POST' && pathname === '/api/auth/register') {
      await daftar(req, res);
      return true;
    }
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      await masuk(req, res);
      return true;
    }
    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      await keluar(req, res);
      return true;
    }
    if (req.method === 'GET' && pathname === '/api/auth/me') {
      const pengguna = await penggunaDariPermintaan(req);
      if (!pengguna) {
        kirimGagal(res, 401, 'Belum masuk');
        return true;
      }
      kirimOk(res, pengguna);
      return true;
    }
    if (req.method === 'POST' && pathname === '/api/auth/verify') {
      await verifikasi(req, res);
      return true;
    }
    if (req.method === 'POST' && pathname === '/api/auth/resend') {
      await kirimUlang(req, res);
      return true;
    }
  } catch (err) {
    const e = err as Error;
    logger.err(`[Auth] ${pathname}: ${e.message}`);
    kirimGagal(res, 400, e.message);
    return true;
  }

  kirimGagal(res, 404, 'Rute tidak ditemukan');
  return true;
}

async function daftar(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const isi = await bacaJson(req);
  const nama = teksBersih(isi.name, 80);
  const email = teksBersih(isi.email, 200).toLowerCase();
  const kataSandi = typeof isi.password === 'string' ? isi.password : '';

  if (nama.length < 2) return kirimGagal(res, 400, 'Nama minimal 2 karakter');
  if (!emailSah(email)) return kirimGagal(res, 400, 'Alamat email tidak sah');
  const masalah = masalahKataSandi(kataSandi);
  if (masalah) return kirimGagal(res, 400, masalah);

  const sudahAda = await prisma.user.findUnique({ where: { email } });
  if (sudahAda) {
    // Tidak dibedakan dari pendaftaran berhasil supaya halaman daftar tidak
    // bisa dipakai untuk menebak email siapa saja yang sudah terdaftar.
    logger.info(`[Auth] Pendaftaran ulang untuk email yang sudah ada: ${email}`);
    return kirimOk(res, { terkirim: true, smtpAktif: smtpAktif() });
  }

  const pengguna = await prisma.user.create({
    data: {
      name: nama,
      email,
      passwordHash: await hashKataSandi(kataSandi),
      role: PERAN.MONITOR,
      emailVerified: false,
    },
  });

  const token = await buatTokenVerifikasi(pengguna.id);
  await kirimEmailVerifikasi(email, nama, token);

  kirimOk(res, { terkirim: true, smtpAktif: smtpAktif() });
}

async function masuk(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const isi = await bacaJson(req);
  const email = teksBersih(isi.email, 200).toLowerCase();
  const kataSandi = typeof isi.password === 'string' ? isi.password : '';

  const kunci = `${alamatPemanggil(req)}|${email}`;
  if (terlaluSering(kunci)) {
    return kirimGagal(
      res,
      429,
      'Terlalu banyak percobaan masuk. Coba lagi sekitar 10 menit lagi.',
    );
  }

  const pengguna = await prisma.user.findUnique({ where: { email } });
  const cocok = pengguna
    ? await cocokKataSandi(kataSandi, pengguna.passwordHash)
    : false;

  if (!pengguna || !cocok) {
    catatPercobaan(kunci);
    // Pesannya sengaja sama untuk email salah dan kata sandi salah.
    return kirimGagal(res, 401, 'Email atau kata sandi salah');
  }

  if (!pengguna.emailVerified) {
    return kirimGagal(
      res,
      403,
      'Email belum diverifikasi. Buka tautan yang dikirim ke email Anda.',
    );
  }

  lupakanPercobaan(kunci);
  const token = await buatSesi(pengguna.id);
  pasangCookieSesi(res, token);
  kirimOk(res, {
    id: pengguna.id,
    email: pengguna.email,
    name: pengguna.name,
    role: pengguna.role,
    emailVerified: pengguna.emailVerified,
  });
}

async function keluar(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const token = tokenDariPermintaan(req);
  if (token) await hapusSesi(token);
  hapusCookieSesi(res);
  kirimOk(res, { keluar: true });
}

async function verifikasi(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const isi = await bacaJson(req);
  const token = teksBersih(isi.token, 300);
  if (!token) return kirimGagal(res, 400, 'Token verifikasi tidak ada');

  const hasil = await pakaiTokenVerifikasi(token);
  if (hasil.ok) return kirimOk(res, { terverifikasi: true, email: hasil.email });

  const pesan: Record<string, string> = {
    tidak_ditemukan: 'Tautan verifikasi tidak dikenali',
    kedaluwarsa: 'Tautan verifikasi sudah lewat 24 jam. Minta tautan baru.',
    sudah_dipakai: 'Tautan ini sudah dipakai. Akun Anda sudah aktif.',
  };
  const kode = hasil.sebab === 'sudah_dipakai' ? 409 : 400;
  kirimGagal(res, kode, pesan[hasil.sebab]);
}

async function kirimUlang(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const isi = await bacaJson(req);
  const email = teksBersih(isi.email, 200).toLowerCase();
  if (!emailSah(email)) return kirimGagal(res, 400, 'Alamat email tidak sah');

  const kunci = `kirim-ulang|${alamatPemanggil(req)}`;
  if (terlaluSering(kunci)) {
    return kirimGagal(res, 429, 'Terlalu sering. Coba lagi nanti.');
  }
  catatPercobaan(kunci);

  const pengguna = await prisma.user.findUnique({ where: { email } });
  if (pengguna && !pengguna.emailVerified) {
    const token = await buatTokenVerifikasi(pengguna.id);
    await kirimEmailVerifikasi(pengguna.email, pengguna.name, token);
  }
  // Jawabannya selalu sama, apa pun keadaan akunnya.
  kirimOk(res, { terkirim: true, smtpAktif: smtpAktif() });
}
