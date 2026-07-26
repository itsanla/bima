import logger from 'jet-logger';
import prisma from '../db/prisma';
import { PERAN, emailSah, hashKataSandi, masalahKataSandi } from './auth';

/* ==========================================================================
   Penyemaian akun admin pertama dari environment.

   Dijalankan tiap kali server hidup, tapi hanya membuat akun kalau memang
   belum ada admin sama sekali. Kata sandi yang sudah dipakai tidak pernah
   ditimpa dari env, supaya admin yang mengganti kata sandinya lewat aplikasi
   tidak dikembalikan diam diam ke nilai lama saat container di-restart.
   ========================================================================== */

export async function semaiAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const kataSandi = process.env.ADMIN_PASSWORD || '';
  const nama = (process.env.ADMIN_NAME || 'Administrator').trim();

  if (!email || !kataSandi) {
    const jumlahAdmin = await prisma.user
      .count({ where: { role: PERAN.ADMIN } })
      .catch(() => -1);
    if (jumlahAdmin === 0) {
      logger.warn(
        '[Seed] Belum ada admin dan ADMIN_EMAIL/ADMIN_PASSWORD belum diisi. ' +
          'Tidak ada yang bisa masuk ke halaman monitoring.',
      );
    }
    return;
  }

  if (!emailSah(email)) {
    logger.err(`[Seed] ADMIN_EMAIL tidak sah: ${email}`);
    return;
  }
  const masalah = masalahKataSandi(kataSandi);
  if (masalah) {
    logger.err(`[Seed] ADMIN_PASSWORD ditolak: ${masalah}`);
    return;
  }

  try {
    const adaEmailnya = await prisma.user.findUnique({ where: { email } });
    if (adaEmailnya) {
      if (adaEmailnya.role !== PERAN.ADMIN) {
        await prisma.user.update({
          where: { email },
          data: { role: PERAN.ADMIN, emailVerified: true },
        });
        logger.info(`[Seed] ${email} dinaikkan jadi admin`);
      }
      return;
    }

    const jumlahAdmin = await prisma.user.count({ where: { role: PERAN.ADMIN } });
    if (jumlahAdmin > 0) {
      logger.info(
        '[Seed] Sudah ada admin lain, ADMIN_EMAIL di env tidak dibuatkan akun baru',
      );
      return;
    }

    await prisma.user.create({
      data: {
        email,
        name: nama,
        passwordHash: await hashKataSandi(kataSandi),
        role: PERAN.ADMIN,
        emailVerified: true,
      },
    });
    logger.info(`[Seed] Akun admin pertama dibuat: ${email}`);
  } catch (err) {
    const e = err as Error;
    logger.err(`[Seed] Gagal menyemai admin: ${e.message}`);
  }
}
