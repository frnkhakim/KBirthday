"use client";

import { useEffect, useRef } from "react";

type Particle = {
  kind: "petal" | "confetti" | "heart" | "star" | "dust" | "trail";
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  r: number;
  vr: number;
  c: string;
  w: number;
  life: number;
};

const PETAL_COLOURS = ["#E9A7AF", "#F2C1C4", "#D98A95", "#F7D6D2"];
const GOLD_COLOURS = ["#E7C98F", "#B8894A", "#F3DEAE", "#C4727E", "#FFF8F4"];
const HEART_COLOURS = ["#C4727E", "#D98A95", "#E7C98F"];

let particles: Particle[] = [];
let W = 0;
let H = 0;

function makeStar(): Particle {
  return {
    kind: "star",
    x: Math.random() * W,
    y: Math.random() * H,
    s: 4 + Math.random() * 7,
    vy: 0,
    vx: 0,
    r: Math.random() * 6.3,
    vr: 0,
    c: Math.random() < 0.5 ? "#F3DEAE" : "#E7C98F",
    w: Math.random() * 6.3,
    life: 1,
  };
}

function makeDust(): Particle {
  return {
    kind: "dust",
    x: Math.random() * W,
    y: H + 10,
    s: 1 + Math.random() * 2.2,
    vy: -(0.25 + Math.random() * 0.5),
    vx: -0.15 + Math.random() * 0.3,
    r: 0,
    vr: 0,
    c: "#E7C98F",
    w: Math.random() * 6.3,
    life: 1,
  };
}

function makePetal(y?: number): Particle {
  return {
    kind: "petal",
    x: Math.random() * W,
    y: y ?? Math.random() * H,
    s: 6 + Math.random() * 8,
    vy: 0.3 + Math.random() * 0.6,
    vx: -0.2 + Math.random() * 0.4,
    r: Math.random() * 6.3,
    vr: -0.02 + Math.random() * 0.04,
    c: PETAL_COLOURS[(Math.random() * 4) | 0],
    w: Math.random() * 6.3,
    life: 1,
  };
}

/** Little gold sparks left behind wherever she touches or moves. */
export function trail(x: number, y: number, n = 3) {
  for (let i = 0; i < n; i++) {
    particles.push({
      kind: "trail",
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -0.3 - Math.random() * 1.2,
      s: 3 + Math.random() * 5,
      r: Math.random() * 6.3,
      vr: 0,
      c: Math.random() < 0.6 ? "#F3DEAE" : "#E9A7AF",
      w: Math.random() * 6.3,
      life: 1,
    });
  }
}

/** Burst of gold confetti from a point on screen. */
export function burst(x: number, y: number, n = 120) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.3;
    const v = 4 + Math.random() * 7;
    particles.push({
      kind: "confetti",
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 4,
      s: 4 + Math.random() * 5,
      r: Math.random() * 6.3,
      vr: -0.2 + Math.random() * 0.4,
      c: GOLD_COLOURS[(Math.random() * 5) | 0],
      w: 0,
      life: 1,
    });
  }
}

/** Hearts drifting upward from a point on screen. */
export function hearts(x: number, y: number, n = 40) {
  for (let i = 0; i < n; i++) {
    particles.push({
      kind: "heart",
      x: x + (Math.random() - 0.5) * 60,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: -2 - Math.random() * 3,
      s: 8 + Math.random() * 10,
      r: 0,
      vr: 0,
      c: HEART_COLOURS[i % 3],
      w: 0,
      life: 1,
    });
  }
}

export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const size = () => {
      const d = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * d;
      canvas.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    particles = [];
    if (!reduce) {
      for (let i = 0; i < 18; i++) particles.push(makePetal());
      for (let i = 0; i < 26; i++) particles.push(makeStar());
      for (let i = 0; i < 30; i++) {
        const d = makeDust();
        d.y = Math.random() * H;
        particles.push(d);
      }
    }

    const drawStar = (s: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const rr = i % 2 ? s * 0.3 : s;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawHeart = (s: number) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.35);
      ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
      ctx.fill();
    };

    // On a mouse the wand tip carries a twinkling star; on touch there is no
    // pointer, so the trail under her finger does the sparkling instead.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const tip = { x: -100, y: -100, on: false, w: 0 };
    let last = 0;
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      tip.x = e.clientX;
      tip.y = e.clientY;
      tip.on = fine && e.pointerType === "mouse";
      const now = performance.now();
      if (now - last < (fine ? 40 : 24)) return;
      last = now;
      trail(e.clientX, e.clientY, fine ? 1 : 2);
    };
    const onLeave = () => {
      tip.on = false;
    };
    document.addEventListener("pointerleave", onLeave);
    const onDown = (e: PointerEvent) => {
      if (!reduce) trail(e.clientX, e.clientY, 14);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      particles = particles.filter((p) => {
        if (p.kind === "petal") {
          p.w += 0.02;
          p.x += p.vx + Math.sin(p.w) * 0.4;
          p.y += p.vy;
          p.r += p.vr;
          if (p.y > H + 20) Object.assign(p, makePetal(-20));
        } else if (p.kind === "star") {
          p.w += 0.035 + p.s * 0.002;
        } else if (p.kind === "trail") {
          p.w += 0.3;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.04;
          if (p.life <= 0) return false;
        } else if (p.kind === "dust") {
          p.w += 0.03;
          p.x += p.vx + Math.sin(p.w) * 0.2;
          p.y += p.vy;
          if (p.y < -10) Object.assign(p, makeDust());
        } else {
          p.vy += p.kind === "heart" ? -0.02 : 0.18;
          p.vx *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          p.r += p.vr;
          p.life -= 0.008;
          if (p.life <= 0) return false;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        const twinkle = Math.max(0, Math.sin(p.w));
        ctx.globalAlpha =
          p.kind === "petal" ? 0.75 : p.kind === "star" ? twinkle * 0.9 : p.kind === "dust" ? 0.35 + twinkle * 0.4 : Math.max(p.life, 0);
        ctx.fillStyle = p.c;
        if (p.kind === "star" || p.kind === "trail") {
          drawStar(p.kind === "trail" ? p.s * p.life : p.s * (0.6 + twinkle * 0.6));
        } else if (p.kind === "dust") {
          ctx.beginPath();
          ctx.arc(0, 0, p.s, 0, 6.3);
          ctx.fill();
        } else if (p.kind === "petal") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.3);
          ctx.fill();
        } else if (p.kind === "confetti") {
          ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        } else {
          drawHeart(p.s);
        }
        ctx.restore();
        return true;
      });
      if (tip.on) {
        tip.w += 0.12;
        const tw = 0.7 + Math.sin(tip.w) * 0.3;
        ctx.save();
        ctx.translate(tip.x, tip.y);
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = "rgba(243,222,174,.9)";
        ctx.shadowBlur = 18 * tw;
        ctx.fillStyle = "#F3DEAE";
        ctx.rotate(tip.w * 0.5);
        drawStar(7 * tw);
        ctx.rotate(0.8);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#E9A7AF";
        drawStar(4.5 * tw);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}
