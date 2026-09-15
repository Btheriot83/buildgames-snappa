"use client";

import { useEffect, useRef } from "react";

/** Lightweight canvas noise shader for ambient motion behind the workspace. */
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

      // soft moving lime/amber blobs
      const g1 = ctx.createRadialGradient(
        w * (0.25 + Math.sin(t * 0.4) * 0.05),
        h * (0.3 + Math.cos(t * 0.3) * 0.05),
        0,
        w * 0.3,
        h * 0.3,
        w * 0.45
      );
      g1.addColorStop(0, "rgba(159,232,112,0.07)");
      g1.addColorStop(1, "rgba(159,232,112,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(
        w * (0.75 + Math.cos(t * 0.35) * 0.04),
        h * (0.7 + Math.sin(t * 0.25) * 0.04),
        0,
        w * 0.7,
        h * 0.7,
        w * 0.4
      );
      g2.addColorStop(0, "rgba(232,165,75,0.05)");
      g2.addColorStop(1, "rgba(232,165,75,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // sparse noise speckles
      ctx.fillStyle = "rgba(232,235,230,0.03)";
      for (let i = 0; i < 80; i++) {
        const x = (Math.sin(t * 2 + i * 12.9898) * 0.5 + 0.5) * w;
        const y = (Math.cos(t * 1.7 + i * 78.233) * 0.5 + 0.5) * h;
        ctx.fillRect(x, y, 1.5 * devicePixelRatio, 1.5 * devicePixelRatio);
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
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80"
      aria-hidden
    />
  );
}
