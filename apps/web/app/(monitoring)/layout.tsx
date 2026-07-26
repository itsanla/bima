"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AuthProvider, usePengguna } from "../_components/AuthProvider";
import LogoInstansi from "../_components/LogoInstansi";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Penjaga>{children}</Penjaga>
    </AuthProvider>
  );
}

/** Pemeriksaan sesi dilakukan di peramban, bukan di server, karena sesinya
 *  tersimpan di cookie milik domain API. Selama pemeriksaan berjalan, isi
 *  halaman tidak dirender sama sekali supaya data tidak sempat berkedip
 *  muncul bagi yang ternyata belum masuk. */
function Penjaga({ children }: { children: ReactNode }) {
  const { pengguna, memuat } = usePengguna();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!memuat && !pengguna) router.replace("/masuk");
  }, [memuat, pengguna, router]);

  useEffect(() => {
    if (!memuat && pengguna?.role !== "ADMIN" && pathname === "/pengguna") {
      router.replace("/dashboard");
    }
  }, [memuat, pengguna, pathname, router]);

  if (memuat || !pengguna) {
    return (
      <div className="grid min-h-screen place-items-center bg-kabut">
        <p className="text-[0.95rem] text-abu">Memeriksa sesi...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-kabut">
      <BilahAtas />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}

function BilahAtas() {
  const { pengguna, keluar } = usePengguna();
  const pathname = usePathname();
  const adalahAdmin = pengguna?.role === "ADMIN";

  const menu = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/riwayat", label: "Riwayat" },
    ...(adalahAdmin ? [{ href: "/pengguna", label: "Atur pengguna" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-garis bg-white/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LogoInstansi tinggi={26} className="shrink-0" />
            <span aria-hidden="true" className="h-6 w-px shrink-0 bg-garis" />
            <span className="text-[1.02rem] font-extrabold tracking-[-0.03em] text-hijau-tua">
              Steamlog
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-right sm:block">
              <span className="block text-[0.85rem] leading-tight font-semibold text-hijau-tua">
                {pengguna?.name}
              </span>
              <span className="block text-[0.75rem] leading-tight text-abu">
                {adalahAdmin ? "Admin" : "Monitor"}
              </span>
            </span>
            <button
              onClick={() => void keluar()}
              className="rounded-full border border-garis px-4 py-2 text-[0.85rem] font-semibold text-hijau-tua transition-colors hover:bg-mint"
            >
              Keluar
            </button>
          </div>
        </div>

        <nav className="-mb-px flex gap-6 overflow-x-auto">
          {menu.map((m) => {
            const aktif = pathname === m.href || pathname.startsWith(`${m.href}/`);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={aktif ? "page" : undefined}
                className={`border-b-2 pb-3 text-[0.92rem] font-semibold whitespace-nowrap transition-colors ${
                  aktif
                    ? "border-hijau text-hijau-tua"
                    : "border-transparent text-abu hover:text-hijau-tua"
                }`}
              >
                {m.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
