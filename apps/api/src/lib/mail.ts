import logger from 'jet-logger';
import nodemailer, { Transporter } from 'nodemailer';

/* ==========================================================================
   Pengiriman email verifikasi lewat SMTP Gmail.

   Kalau kredensial SMTP belum diisi, pendaftaran tetap berjalan dan tautan
   verifikasinya ditulis ke log server. Dengan begitu alurnya bisa diuji utuh
   sebelum kredensialnya tersedia, tanpa membuat pendaftar mengira sistemnya
   rusak.
   ========================================================================== */

let pengirim: Transporter | null = null;
let sudahDicoba = false;

export function smtpAktif(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function ambilPengirim(): Transporter | null {
  if (!smtpAktif()) return null;
  if (!sudahDicoba) {
    sudahDicoba = true;
    pengirim = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: (process.env.SMTP_SECURE || 'true') !== 'false',
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });
  }
  return pengirim;
}

function alamatWeb(): string {
  return (process.env.WEB_URL || 'https://steamlog.cloud').replace(/\/+$/, '');
}

export function tautanVerifikasi(token: string): string {
  return `${alamatWeb()}/verifikasi?token=${encodeURIComponent(token)}`;
}

export async function kirimEmailVerifikasi(
  tujuan: string,
  nama: string,
  token: string,
): Promise<void> {
  const tautan = tautanVerifikasi(token);
  const transport = ambilPengirim();

  if (!transport) {
    logger.warn(
      `[Mail] SMTP belum diatur. Tautan verifikasi untuk ${tujuan}: ${tautan}`,
    );
    return;
  }

  const dari = process.env.SMTP_FROM || `Steamlog <${process.env.SMTP_USER}>`;
  try {
    await transport.sendMail({
      from: dari,
      to: tujuan,
      subject: 'Verifikasi akun Steamlog',
      text: [
        `Halo ${nama},`,
        '',
        'Akun Steamlog Anda sudah dibuat. Buka tautan berikut untuk',
        'mengaktifkannya:',
        '',
        tautan,
        '',
        'Tautan ini berlaku 24 jam. Kalau Anda tidak merasa mendaftar,',
        'abaikan saja email ini.',
        '',
        'Steamlog, Politeknik Negeri Padang',
      ].join('\n'),
      html: emailHtml(nama, tautan),
    });
    logger.info(`[Mail] Email verifikasi terkirim ke ${tujuan}`);
  } catch (err) {
    const e = err as Error;
    logger.err(`[Mail] Gagal mengirim ke ${tujuan}: ${e.message}`);
    logger.warn(`[Mail] Tautan verifikasi ${tujuan}: ${tautan}`);
    throw new Error('Email verifikasi gagal dikirim');
  }
}

function emailHtml(nama: string, tautan: string): string {
  const aman = (t: string) =>
    t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="id"><body style="margin:0;background:#f4f7f1;font-family:Helvetica,Arial,sans-serif;color:#14231b">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px">
    <p style="font-size:20px;font-weight:800;color:#0a3520;margin:0 0 24px">Steamlog</p>
    <p style="margin:0 0 12px">Halo ${aman(nama)},</p>
    <p style="margin:0 0 24px;line-height:1.6">
      Akun Steamlog Anda sudah dibuat. Tekan tombol di bawah untuk mengaktifkannya.
    </p>
    <p style="margin:0 0 24px">
      <a href="${aman(tautan)}" style="display:inline-block;background:#14713a;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700">
        Aktifkan akun
      </a>
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#5f7268;line-height:1.6">
      Kalau tombolnya tidak bekerja, salin alamat ini ke peramban:<br>
      <span style="word-break:break-all">${aman(tautan)}</span>
    </p>
    <p style="margin:24px 0 0;font-size:13px;color:#5f7268;line-height:1.6">
      Tautan berlaku 24 jam. Kalau Anda tidak merasa mendaftar, abaikan email ini.
    </p>
  </div>
</body></html>`;
}
