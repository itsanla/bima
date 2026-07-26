"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, type Pengguna } from "../_lib/api";

type Keadaan = {
  pengguna: Pengguna | null;
  memuat: boolean;
  segarkan: () => Promise<void>;
  keluar: () => Promise<void>;
};

const Konteks = createContext<Keadaan | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [pengguna, setPengguna] = useState<Pengguna | null>(null);
  const [memuat, setMemuat] = useState(true);
  const router = useRouter();

  const segarkan = useCallback(async () => {
    try {
      setPengguna(await auth.saya());
    } catch {
      setPengguna(null);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    void segarkan();
  }, [segarkan]);

  const keluar = useCallback(async () => {
    await auth.keluar().catch(() => undefined);
    setPengguna(null);
    router.push("/masuk");
  }, [router]);

  return (
    <Konteks.Provider value={{ pengguna, memuat, segarkan, keluar }}>
      {children}
    </Konteks.Provider>
  );
}

export function usePengguna(): Keadaan {
  const nilai = useContext(Konteks);
  if (!nilai) {
    throw new Error("usePengguna harus dipakai di dalam AuthProvider");
  }
  return nilai;
}
