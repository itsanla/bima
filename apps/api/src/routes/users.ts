import { IncomingMessage, ServerResponse } from 'http';
import logger from 'jet-logger';
import prisma from '../db/prisma';
import {
  PERAN,
  PenggunaSesi,
  emailSah,
  hashKataSandi,
  masalahKataSandi,
  penggunaDariPermintaan,
} from '../lib/auth';
import { bacaJson, kirimGagal, kirimOk, teksBersih } from '../lib/http';

/* ==========================================================================
   Pengelolaan pengguna. Hanya untuk admin.
   ========================================================================== */

const KOLOM_AMAN = {
  id: true,
  email: true,
  name: true,
  role: true,
  emailVerified: true,
  createdAt: true,
} as const;

export async function tanganiUsers(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  if (pathname !== '/api/users' && !pathname.startsWith('/api/users/')) {
    return false;
  }

  const pengguna = await penggunaDariPermintaan(req);
  if (!pengguna) {
    kirimGagal(res, 401, 'Belum masuk');
    return true;
  }
  if (pengguna.role !== PERAN.ADMIN) {
    kirimGagal(res, 403, 'Hanya admin yang boleh membuka halaman ini');
    return true;
  }

  try {
    if (req.method === 'GET' && pathname === '/api/users') {
      const daftar = await prisma.user.findMany({
        select: KOLOM_AMAN,
        orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
      });
      kirimOk(res, daftar);
      return true;
    }

    if (req.method === 'POST' && pathname === '/api/users') {
      await buatPengguna(req, res);
      return true;
    }

    const cocok = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (cocok) {
      const id = decodeURIComponent(cocok[1]);
      if (req.method === 'PATCH') {
        await ubahPengguna(req, res, id, pengguna);
        return true;
      }
      if (req.method === 'DELETE') {
        await hapusPengguna(res, id, pengguna);
        return true;
      }
    }
  } catch (err) {
    const e = err as Error;
    logger.err(`[Users] ${pathname}: ${e.message}`);
    kirimGagal(res, 400, e.message);
    return true;
  }

  kirimGagal(res, 404, 'Rute tidak ditemukan');
  return true;
}

async function buatPengguna(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const isi = await bacaJson(req);
  const nama = teksBersih(isi.name, 80);
  const email = teksBersih(isi.email, 200).toLowerCase();
  const kataSandi = typeof isi.password === 'string' ? isi.password : '';
  const peran = isi.role === PERAN.ADMIN ? PERAN.ADMIN : PERAN.MONITOR;

  if (nama.length < 2) return kirimGagal(res, 400, 'Nama minimal 2 karakter');
  if (!emailSah(email)) return kirimGagal(res, 400, 'Alamat email tidak sah');
  const masalah = masalahKataSandi(kataSandi);
  if (masalah) return kirimGagal(res, 400, masalah);

  const sudahAda = await prisma.user.findUnique({ where: { email } });
  if (sudahAda) return kirimGagal(res, 409, 'Email itu sudah terdaftar');

  // Akun yang dibuat admin langsung dianggap terverifikasi: adminnya sendiri
  // yang menjamin alamat itu benar, jadi tidak perlu lewat email.
  const baru = await prisma.user.create({
    data: {
      name: nama,
      email,
      passwordHash: await hashKataSandi(kataSandi),
      role: peran,
      emailVerified: true,
    },
    select: KOLOM_AMAN,
  });
  kirimOk(res, baru);
}

async function ubahPengguna(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
  admin: PenggunaSesi,
): Promise<void> {
  const isi = await bacaJson(req);
  const sasaran = await prisma.user.findUnique({ where: { id } });
  if (!sasaran) return kirimGagal(res, 404, 'Pengguna tidak ditemukan');

  const data: Record<string, unknown> = {};

  if (typeof isi.name === 'string') {
    const nama = teksBersih(isi.name, 80);
    if (nama.length < 2) return kirimGagal(res, 400, 'Nama minimal 2 karakter');
    data.name = nama;
  }

  if (typeof isi.role === 'string') {
    const peran = isi.role === PERAN.ADMIN ? PERAN.ADMIN : PERAN.MONITOR;
    if (
      sasaran.id === admin.id &&
      sasaran.role === PERAN.ADMIN &&
      peran !== PERAN.ADMIN
    ) {
      return kirimGagal(res, 400, 'Anda tidak bisa menurunkan peran diri sendiri');
    }
    if (sasaran.role === PERAN.ADMIN && peran !== PERAN.ADMIN) {
      const jumlahAdmin = await prisma.user.count({
        where: { role: PERAN.ADMIN },
      });
      if (jumlahAdmin <= 1) {
        return kirimGagal(res, 400, 'Harus ada minimal satu admin');
      }
    }
    data.role = peran;
  }

  if (typeof isi.password === 'string' && isi.password) {
    const masalah = masalahKataSandi(isi.password);
    if (masalah) return kirimGagal(res, 400, masalah);
    data.passwordHash = await hashKataSandi(isi.password);
    // Ganti kata sandi mengakhiri semua sesi yang sedang berjalan.
    await prisma.session.deleteMany({ where: { userId: id } });
  }

  if (typeof isi.emailVerified === 'boolean') {
    data.emailVerified = isi.emailVerified;
  }

  if (Object.keys(data).length === 0) {
    return kirimGagal(res, 400, 'Tidak ada yang diubah');
  }

  const hasil = await prisma.user.update({
    where: { id },
    data,
    select: KOLOM_AMAN,
  });
  kirimOk(res, hasil);
}

async function hapusPengguna(
  res: ServerResponse,
  id: string,
  admin: PenggunaSesi,
): Promise<void> {
  if (id === admin.id) {
    return kirimGagal(res, 400, 'Anda tidak bisa menghapus akun sendiri');
  }
  const sasaran = await prisma.user.findUnique({ where: { id } });
  if (!sasaran) return kirimGagal(res, 404, 'Pengguna tidak ditemukan');

  if (sasaran.role === PERAN.ADMIN) {
    const jumlahAdmin = await prisma.user.count({ where: { role: PERAN.ADMIN } });
    if (jumlahAdmin <= 1) {
      return kirimGagal(res, 400, 'Harus ada minimal satu admin');
    }
  }

  await prisma.user.delete({ where: { id } });
  kirimOk(res, { dihapus: true });
}
