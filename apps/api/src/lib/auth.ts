import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { promisify } from 'util';
import prisma from '../db/prisma';
import { bacaCookie } from './http';

/* ==========================================================================
   Autentikasi.

   Token sesi dibuat acak dan disimpan sebagai hash, bukan token yang
   ditandatangani sendiri. Alasannya sederhana: tidak ada logika verifikasi
   tanda tangan yang bisa salah tulis, dan sesi bisa dicabut kapan saja cukup
   dengan menghapus barisnya.
   ========================================================================== */

const scryptAsync = promisify(scrypt);

export const PERAN = { ADMIN: 'ADMIN', MONITOR: 'MONITOR' } as const;
export type Peran = (typeof PERAN)[keyof typeof PERAN];

export const NAMA_COOKIE = 'steamlog_session';
const UMUR_SESI_HARI = 30;
const UMUR_VERIFIKASI_JAM = 24;

/* -- Kata sandi ------------------------------------------------------------ */

export async function hashKataSandi(kataSandi: string): Promise<string> {
  const garam = randomBytes(16);
  const kunci = (await scryptAsync(kataSandi, garam, 64)) as Buffer;
  return `scrypt$${garam.toString('hex')}$${kunci.toString('hex')}`;
}

export async function cocokKataSandi(
  kataSandi: string,
  tersimpan: string,
): Promise<boolean> {
  const [algoritma, garamHex, kunciHex] = tersimpan.split('$');
  if (algoritma !== 'scrypt' || !garamHex || !kunciHex) return false;
  const kunci = Buffer.from(kunciHex, 'hex');
  const dicoba = (await scryptAsync(
    kataSandi,
    Buffer.from(garamHex, 'hex'),
    kunci.length,
  )) as Buffer;
  return kunci.length === dicoba.length && timingSafeEqual(kunci, dicoba);
}

/* -- Token ----------------------------------------------------------------- */

export function tokenBaru(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/* -- Sesi ------------------------------------------------------------------ */

export async function buatSesi(userId: string): Promise<string> {
  const token = tokenBaru();
  const kedaluwarsa = new Date(Date.now() + UMUR_SESI_HARI * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt: kedaluwarsa },
  });
  return token;
}

export async function hapusSesi(token: string): Promise<void> {
  await prisma.session
    .deleteMany({ where: { tokenHash: hashToken(token) } })
    .catch(() => undefined);
}

export type PenggunaSesi = {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
};

/** Mengambil pengguna dari token sesi. Sesi yang sudah lewat waktu ikut
 *  dibersihkan supaya tabelnya tidak menumpuk. */
export async function penggunaDariToken(
  token: string | undefined,
): Promise<PenggunaSesi | null> {
  if (!token) return null;
  const sesi = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!sesi) return null;
  if (sesi.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: sesi.id } }).catch(() => undefined);
    return null;
  }
  const u = sesi.user;
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    emailVerified: u.emailVerified,
  };
}

export function tokenDariPermintaan(req: IncomingMessage): string | undefined {
  return bacaCookie(req.headers.cookie)[NAMA_COOKIE];
}

export async function penggunaDariPermintaan(
  req: IncomingMessage,
): Promise<PenggunaSesi | null> {
  return penggunaDariToken(tokenDariPermintaan(req));
}

/* -- Cookie ---------------------------------------------------------------- */

/** Web dan API berada di subdomain berbeda (steamlog.cloud dan
 *  api.steamlog.cloud), jadi cookienya perlu Domain induk, SameSite=None, dan
 *  Secure supaya ikut terkirim pada permintaan lintas asal. */
function atributCookie(): string {
  const domain = process.env.COOKIE_DOMAIN || '.steamlog.cloud';
  const bagian = [
    'Path=/',
    'HttpOnly',
    'SameSite=None',
    'Secure',
    `Domain=${domain}`,
  ];
  return bagian.join('; ');
}

export function pasangCookieSesi(res: ServerResponse, token: string): void {
  const umur = UMUR_SESI_HARI * 24 * 60 * 60;
  res.setHeader(
    'Set-Cookie',
    `${NAMA_COOKIE}=${token}; ${atributCookie()}; Max-Age=${umur}`,
  );
}

export function hapusCookieSesi(res: ServerResponse): void {
  res.setHeader('Set-Cookie', `${NAMA_COOKIE}=; ${atributCookie()}; Max-Age=0`);
}

/* -- Verifikasi email ------------------------------------------------------ */

export async function buatTokenVerifikasi(userId: string): Promise<string> {
  const token = tokenBaru();
  await prisma.emailVerification.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + UMUR_VERIFIKASI_JAM * 60 * 60 * 1000),
    },
  });
  return token;
}

export type HasilVerifikasi =
  | { ok: true; email: string }
  | { ok: false; sebab: 'tidak_ditemukan' | 'kedaluwarsa' | 'sudah_dipakai' };

export async function pakaiTokenVerifikasi(
  token: string,
): Promise<HasilVerifikasi> {
  const catatan = await prisma.emailVerification.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!catatan) return { ok: false, sebab: 'tidak_ditemukan' };
  if (catatan.usedAt) return { ok: false, sebab: 'sudah_dipakai' };
  if (catatan.expiresAt.getTime() < Date.now()) {
    return { ok: false, sebab: 'kedaluwarsa' };
  }

  await prisma.$transaction([
    prisma.emailVerification.update({
      where: { id: catatan.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: catatan.userId },
      data: { emailVerified: true },
    }),
  ]);
  return { ok: true, email: catatan.user.email };
}

/* -- Validasi masukan ------------------------------------------------------ */

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailSah(email: string): boolean {
  return POLA_EMAIL.test(email) && email.length <= 200;
}

/** Aturan kata sandi sengaja dibuat rendah tapi bukan nol: penggunanya petani
 *  dan pengelola program, bukan orang yang terbiasa dengan pengelola sandi. */
export function masalahKataSandi(kataSandi: string): string | null {
  if (kataSandi.length < 8) return 'Kata sandi minimal 8 karakter';
  if (kataSandi.length > 200) return 'Kata sandi terlalu panjang';
  return null;
}
