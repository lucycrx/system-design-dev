"use client";

import { useRef, useEffect } from "react";

export function CanvasWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = 0;
    let H = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let t = 0;
    let animFrame: number;
    let isVisible = true;

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
      targetX = W / 2;
      targetY = H / 2;
      currentX = W / 2;
      currentY = H / 2;
    }

    function onMouseMove(e: MouseEvent) {
      if (!isVisible) return;
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= W && y >= 0 && y <= H) {
        targetX = x;
        targetY = y;
      } else {
        targetX = W / 2;
        targetY = H / 2;
      }
    }

    function drawLines() {
      if (!isVisible) return;

      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, W, H);

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const numLines = 38;
      const spacing = H / (numLines + 1);

      for (let i = 0; i < numLines; i++) {
        const baseY = spacing * (i + 1);
        const normalizedI = i / (numLines - 1);

        const r = Math.round(74 + normalizedI * (40 - 74));
        const g = Math.round(127 + normalizedI * (90 - 127));
        const b = Math.round(212 + normalizedI * (180 - 212));
        const alpha = 0.2 + normalizedI * 0.35;

        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx!.lineWidth = 0.9;

        const steps = 220;
        let started = false;

        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * W;

          const wave1 =
            Math.sin((x / W) * Math.PI * 2.5 + t * 0.4 + i * 0.18) * 18;
          const wave2 =
            Math.sin((x / W) * Math.PI * 4.5 - t * 0.25 + i * 0.09) * 8;
          const wave3 =
            Math.sin((x / W) * Math.PI * 1.2 + t * 0.15 + i * 0.3) * 14;

          let y = baseY + wave1 + wave2 + wave3;

          const dx = x - currentX;
          const dy = y - currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const magnetRadius = 160;
          const magnetStrength = 55;

          if (dist < magnetRadius) {
            const force = 1 - dist / magnetRadius;
            const eased = force * force * force;
            y +=
              (currentY - y) * eased * (magnetStrength / (dist + 10)) * 0.8;
            y -= dy * eased * 0.35;
          }

          if (!started) {
            ctx!.moveTo(x, y);
            started = true;
          } else {
            ctx!.lineTo(x, y);
          }
        }

        ctx!.stroke();
      }

      if (!prefersReducedMotion) {
        t += 0.008;
      }
      animFrame = requestAnimationFrame(drawLines);
    }

    // Pause animation when canvas is off-screen
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animFrame = requestAnimationFrame(drawLines);
        }
      },
      { threshold: 0 }
    );

    resize();
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);
    visObserver.observe(canvas);
    drawLines();

    return () => {
      cancelAnimationFrame(animFrame);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      visObserver.disconnect();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Decorative animated wave background"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      {/* Edge blur overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: [
            "radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.7) 0%, transparent 40%)",
            "radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.7) 0%, transparent 40%)",
            "radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.8) 0%, transparent 35%)",
            "radial-gradient(ellipse at 100% 100%, rgba(255,255,255,0.8) 0%, transparent 35%)",
            "linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,0.95) 100%)",
          ].join(", "),
        }}
      />
    </>
  );
}
