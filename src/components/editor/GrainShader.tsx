"use client";

import { useEffect, useRef } from "react";

/** Sparse flat paper grit only — no radial/mesh gradient blobs (Brandon bar). */
export function GrainShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(232,235,230,0.035)";
      for (let i = 0; i < 64; i++) {
        const x = (Math.sin(t * 1.2 + i * 12.9898) * 0.5 + 0.5) * w;
        const y = (Math.cos(t * 0.9 + i * 78.233) * 0.5 + 0.5) * h;
        ctx.fillRect(x, y, devicePixelRatio, devicePixelRatio);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-70"
      aria-hidden
    />
  );
}
