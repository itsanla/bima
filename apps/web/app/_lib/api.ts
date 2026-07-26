/* ==========================================================================
   Pembungkus pemanggilan API.

   Semua permintaan memakai credentials: "include" karena sesi disimpan di
   cookie HttpOnly pada domain induk, bukan di localStorage. Konsekuensinya
   token tidak bisa dibaca JavaScript, jadi skrip pihak ketiga yang menyusup
   ke halaman tetap tidak bisa mencuri sesi.
   ========================================================================== */

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.steamlog.cloud"
).replace(/\/+$/, "");

export const WS_URL = API_URL.replace(/^http/, "ws");

export type Peran = "ADMIN" | "MONITOR";

export type Pengguna = {
  id: string;
  email: string;
  name: string;
  role: Peran;
  emailVerified: boolean;
  createdAt?: string;
};

export type Sesi = { sessionId: string; createdAt: string };

export type BarisLog = {
  id: string;
  sessionId: string | null;
  suhu: number;
  timer: string;
  api: string;
  status: string;
  air_habis: boolean;
  createdAt: string;
};

export type TitikGrafik = { bucket: string; avg_suhu: number };

export type Halaman = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** Galat yang membawa kode status, supaya pemanggil bisa membedakan
 *  "belum masuk" dari "salah masukan". */
export class GalatApi extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "GalatApi";
  }
}

type Opsi = {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
};

async function panggil<T>(jalur: string, opsi: Opsi = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${jalur}`, {
      method: opsi.method || "GET",
      credentials: "include",
      signal: opsi.signal,
      headers: opsi.body ? { "Content-Type": "application/json" } : undefined,
      body: opsi.body ? JSON.stringify(opsi.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new GalatApi("Tidak bisa menghubungi server. Periksa sambungan Anda.", 0);
  }

  let isi: { status?: string; data?: unknown; message?: string } = {};
  try {
    isi = await res.json();
  } catch {
    /* jawaban tanpa JSON, biarkan kosong */
  }

  if (!res.ok) {
    throw new GalatApi(isi.message || `Permintaan gagal (${res.status})`, res.status);
  }
  return isi.data as T;
}

/* -- Autentikasi ----------------------------------------------------------- */

export const auth = {
  saya: () => panggil<Pengguna>("/api/auth/me"),

  masuk: (email: string, password: string) =>
    panggil<Pengguna>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  keluar: () => panggil<{ keluar: boolean }>("/api/auth/logout", { method: "POST" }),

  daftar: (name: string, email: string, password: string) =>
    panggil<{ terkirim: boolean; smtpAktif: boolean }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),

  verifikasi: (token: string) =>
    panggil<{ terverifikasi: boolean; email: string }>("/api/auth/verify", {
      method: "POST",
      body: { token },
    }),

  kirimUlang: (email: string) =>
    panggil<{ terkirim: boolean; smtpAktif: boolean }>("/api/auth/resend", {
      method: "POST",
      body: { email },
    }),
};

/* -- Data alat ------------------------------------------------------------- */

/** Daftar sesi. Backend mengembalikan pagination di luar data, jadi di sini
 *  dipanggil mentah supaya keduanya bisa ikut terbawa. */
export async function ambilSesi(params: {
  page?: number;
  search?: string;
  sortBy?: "createdAt" | "sessionId";
  sortOrder?: "asc" | "desc";
  signal?: AbortSignal;
}): Promise<{ data: Sesi[]; pagination: Halaman }> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.search) q.set("search", params.search);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortOrder) q.set("sortOrder", params.sortOrder);

  const res = await fetch(`${API_URL}/api/logs?${q}`, {
    credentials: "include",
    signal: params.signal,
    cache: "no-store",
  });
  const isi = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new GalatApi(isi.message || "Gagal mengambil daftar sesi", res.status);
  }
  return { data: isi.data ?? [], pagination: isi.pagination };
}

export async function ambilDetailSesi(
  sessionId: string,
  params: { page?: number; signal?: AbortSignal } = {},
): Promise<{
  data: { sessionId: string; history: BarisLog[]; createdAt: string };
  pagination: Halaman;
}> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));

  const res = await fetch(
    `${API_URL}/api/logs/${encodeURIComponent(sessionId)}?${q}`,
    { credentials: "include", signal: params.signal, cache: "no-store" },
  );
  const isi = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new GalatApi(isi.message || "Gagal mengambil detail sesi", res.status);
  }
  return { data: isi.data, pagination: isi.pagination };
}

export function ambilGrafik(
  sessionId: string,
  interval: "10m" | "1h" | "all",
  signal?: AbortSignal,
) {
  const q = new URLSearchParams({ sessionId, interval });
  return panggil<TitikGrafik[]>(`/api/logs/chart?${q}`, { signal });
}

/* -- Pengelolaan pengguna (admin) ------------------------------------------ */

export const pengguna = {
  daftar: () => panggil<Pengguna[]>("/api/users"),

  buat: (isi: { name: string; email: string; password: string; role: Peran }) =>
    panggil<Pengguna>("/api/users", { method: "POST", body: isi }),

  ubah: (
    id: string,
    isi: Partial<{ name: string; role: Peran; password: string }>,
  ) => panggil<Pengguna>(`/api/users/${id}`, { method: "PATCH", body: isi }),

  hapus: (id: string) =>
    panggil<{ dihapus: boolean }>(`/api/users/${id}`, { method: "DELETE" }),
};
