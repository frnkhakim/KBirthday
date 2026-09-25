"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Celebration.module.css";
import { burst, hearts } from "./Petals";
import { isBirthdayYet } from "@/lib/date";

type Props = {
  name: string;
  age: number;
  candles: number;
  onDone: () => void;
};

type Balloon = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  c: string;
  hi: string;
  popping: number; // 0 = intact, >0 = frames since pop
};

const BALLOON_COLOURS: [string, string][] = [
  ["#E9A7AF", "#F7D6D2"],
  ["#C4727E", "#E9A7AF"],
  ["#E7C98F", "#F8EBC8"],
  ["#F2C1C4", "#FBE5E3"],
  ["#D98A95", "#F2C1C4"],
  ["#B8894A", "#E7C98F"],
];

export default function Celebration({ name, age, candles, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lit, setLit] = useState<boolean[]>(() => Array(candles).fill(true));
  const [popped, setPopped] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const allOut = lit.every((l) => !l);
  const [today, setToday] = useState(false);
  useEffect(() => setToday(isBirthdayYet()), []);

  // ---------- balloons on a canvas ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
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

    let balloons: Balloon[] = [];
    const spawn = (y?: number): Balloon => {
      const [c, hi] = BALLOON_COLOURS[(Math.random() * BALLOON_COLOURS.length) | 0];
      return {
        x: 40 + Math.random() * (W - 80),
        y: y ?? H + 60 + Math.random() * 200,
        r: 26 + Math.random() * 18,
        vy: 0.5 + Math.random() * 0.7,
        sway: 10 + Math.random() * 20,
        phase: Math.random() * 6.3,
        c,
        hi,
        popping: 0,
      };
    };
    for (let i = 0; i < 9; i++) balloons.push(spawn(Math.random() * H));

    const drawBalloon = (b: Balloon) => {
      const x = b.x + Math.sin(b.phase) * b.sway;
      const y = b.y;
      const r = b.r;
      ctx.save();
      // string
      ctx.strokeStyle = "rgba(91,38,51,.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + r * 1.25);
      ctx.quadraticCurveTo(x + 6, y + r * 1.9, x - 4, y + r * 2.6);
      ctx.stroke();
      // body
      const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.2);
      g.addColorStop(0, b.hi);
      g.addColorStop(1, b.c);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 1.2, 0, 0, 6.3);
      ctx.fill();
      // knot
      ctx.beginPath();
      ctx.moveTo(x - 4, y + r * 1.18);
      ctx.lineTo(x + 4, y + r * 1.18);
      ctx.lineTo(x, y + r * 1.32);
      ctx.closePath();
      ctx.fill();
      // shine
      ctx.fillStyle = "rgba(255,255,255,.45)";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.35, y - r * 0.45, r * 0.18, r * 0.32, -0.5, 0, 6.3);
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      balloons = balloons.filter((b) => {
        if (b.popping) {
          b.popping++;
          return b.popping < 2;
        }
        b.phase += 0.015;
        b.y -= b.vy;
        if (b.y < -b.r * 3) Object.assign(b, spawn());
        drawBalloon(b);
        return true;
      });
      while (balloons.length < 9) balloons.push(spawn());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hit = (px: number, py: number) => {
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        if (b.popping) continue;
        const x = b.x + Math.sin(b.phase) * b.sway;
        const dx = (px - x) / b.r;
        const dy = (py - b.y) / (b.r * 1.2);
        if (dx * dx + dy * dy <= 1.15) {
          b.popping = 1;
          burst(x, b.y, 45);
          setPopped((n) => n + 1);
          return true;
        }
      }
      return false;
    };
    const onDown = (e: PointerEvent) => {
      if (hit(e.clientX, e.clientY)) e.preventDefault();
    };
    canvas.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, []);

  // ---------- candles ----------
  const blow = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!lit[i]) return;
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 18);
    setLit((arr) => arr.map((v, j) => (j === i ? false : v)));
  };

  useEffect(() => {
    if (!allOut) return;
    const t = window.setTimeout(() => {
      burst(window.innerWidth / 2, window.innerHeight * 0.4, 220);
      hearts(window.innerWidth / 2, window.innerHeight * 0.5, 60);
    }, 250);
    return () => window.clearTimeout(t);
  }, [allOut]);

  const finish = () => {
    setLeaving(true);
    window.setTimeout(onDone, 600);
  };

  const left = lit.filter(Boolean).length;

  return (
    <section className={`${styles.stage} ${leaving ? styles.leaving : ""}`}>
      <canvas ref={canvasRef} className={styles.balloons} aria-label="Balloons. Tap one to pop it." />

      <div className={styles.top}>
        <div className={styles.eyebrow}>{allOut ? (today ? "It's your day" : "Wish made") : "Make a wish"}</div>
        <h2 className={styles.title}>
          {allOut ? (
            <>
              {today ? "Happy Birthday," : "Here's to you,"}
              <br />
              <span className={styles.big}>{name}</span>
            </>
          ) : (
            <>Blow out the candles, {name}</>
          )}
        </h2>
        <p className={styles.sub}>
          {allOut
            ? today
              ? "Your wish is safe with me."
              : "I'm keeping that wish safe until dinner."
            : left === candles
              ? "Tap each flame. Pop a balloon or two while you're at it."
              : `${left} to go`}
        </p>
      </div>

      <div className={styles.cakeWrap}>
        <div className={styles.candles}>
          {lit.map((on, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.candle} ${on ? styles.lit : styles.out}`}
              onClick={(e) => blow(i, e)}
              aria-label={on ? `Candle ${i + 1}, tap to blow out` : `Candle ${i + 1}, out`}
              disabled={!on}
              style={{ animationDelay: `${i * 0.13}s` }}
            >
              <span className={styles.flame} />
              <span className={styles.smoke} />
              <span className={styles.wick} />
              <span className={styles.wax} />
            </button>
          ))}
        </div>
        <div className={styles.cake}>
          <div className={styles.tierTop}>
            <span className={styles.number}>{age}</span>
          </div>
          <div className={styles.tierMid} />
          <div className={styles.tierBase} />
          <div className={styles.plate} />
        </div>
      </div>

      <div className={styles.bottom}>
        {allOut ? (
          <button type="button" className={styles.go} onClick={finish}>
            Open your invitation
          </button>
        ) : (
          <div className={styles.score}>
            {popped > 0 ? `${popped} balloon${popped === 1 ? "" : "s"} popped` : " "}
          </div>
        )}
      </div>
    </section>
  );
}
