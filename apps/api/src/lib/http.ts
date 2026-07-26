import { IncomingMessage, ServerResponse } from 'http';

/* ==========================================================================
   Pembantu HTTP: CORS, baca body, kirim JSON, baca cookie.

   Server ini memakai http bawaan Node tanpa framework, jadi hal hal kecil
   seperti ini ditulis sendiri sekali di sini supaya rute rutenya tetap pendek.
   ========================================================================== */

/** Asal yang boleh memanggil API dari peramban. Wajib disebut satu per satu
 *  (bukan bintang) karena permintaannya membawa cookie sesi. */
export function asalDiizinkan(): string[] {
  const dariEnv = (process.env.WEB_ORIGINS || '').trim();
  if (dariEnv) return dariEnv.split(',').map((s) => s.trim()).filter(Boolean);
  return ['https://steamlog.cloud', 'http://localhost:3000'];
}

/** Menempelkan header CORS. Mengembalikan true kalau permintaannya preflight
 *  dan sudah dijawab, sehingga pemanggil bisa langsung berhenti. */
export function pasangCors(req: IncomingMessage, res: ServerResponse): boolean {
  const asal = req.headers.origin;
  if (asal && asalDiizinkan().includes(asal)) {
    res.setHeader('Access-Control-Allow-Origin', asal);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

export function kirimJson(res: ServerResponse, kode: number, isi: unknown): void {
  res.writeHead(kode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(isi));
}

export function kirimOk(res: ServerResponse, data: unknown): void {
  kirimJson(res, 200, { status: 'ok', data });
}

export function kirimGagal(res: ServerResponse, kode: number, pesan: string): void {
  kirimJson(res, kode, { status: 'error', message: pesan });
}

/** Membaca body JSON dengan batas ukuran, supaya satu permintaan besar tidak
 *  bisa menghabiskan memori proses. */
export async function bacaJson(
  req: IncomingMessage,
  batasByte = 64 * 1024,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let isi = '';
    let ukuran = 0;
    req.on('data', (potongan: Buffer) => {
      ukuran += potongan.length;
      if (ukuran > batasByte) {
        reject(new Error('Isi permintaan terlalu besar'));
        req.destroy();
        return;
      }
      isi += potongan.toString();
    });
    req.on('end', () => {
      if (!isi.trim()) return resolve({});
      try {
        const hasil = JSON.parse(isi);
        resolve(hasil && typeof hasil === 'object' ? hasil : {});
      } catch {
        reject(new Error('Isi permintaan bukan JSON yang sah'));
      }
    });
    req.on('error', reject);
  });
}

/** Mengurai header Cookie jadi peta sederhana. */
export function bacaCookie(header: string | undefined): Record<string, string> {
  const hasil: Record<string, string> = {};
  if (!header) return hasil;
  for (const bagian of header.split(';')) {
    const pisah = bagian.indexOf('=');
    if (pisah < 0) continue;
    const nama = bagian.slice(0, pisah).trim();
    const nilai = bagian.slice(pisah + 1).trim();
    if (nama) hasil[nama] = decodeURIComponent(nilai);
  }
  return hasil;
}

export function teksBersih(nilai: unknown, maks = 200): string {
  return typeof nilai === 'string' ? nilai.trim().slice(0, maks) : '';
}
