"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Membuka isi sekali saja saat masuk layar. Tidak berbuat apa apa kalau
 *  pengguna sudah minta gerak dikurangi lewat setelan sistem. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTampil(true);
      return;
    }

    const pengamat = new IntersectionObserver(
      (entri) => {
        if (entri[0]?.isIntersecting) {
          setTampil(true);
          pengamat.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown={tampil}
      className={`reveal ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
