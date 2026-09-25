"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Invitation.module.css";
import { burst, hearts } from "./Petals";
import type { Riddle } from "@/lib/config";

type Props = {
  name: string;
  riddles: Riddle[];
  onSolved: () => void;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export default function Riddles({ name, riddles, onSolved }: Props) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = riddles[step];
  const done = step >= riddles.length;

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!done) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (r) {
      burst(r.left + r.width / 2, r.top + r.height / 2, 200);
      hearts(r.left + r.width / 2, r.top + r.height / 2, 50);
    }
    const t = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(onSolved, 600);
    }, 1800);
    return () => window.clearTimeout(t);
  }, [done, onSolved]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    const ok = current.answers.some((a) => norm(a) === norm(value));
    if (ok) {
      const r = cardRef.current?.getBoundingClientRect();
      if (r) burst(r.left + r.width / 2, r.top + 80, 70);
      setValue("");
      setShowHint(false);
      setStep((s) => s + 1);
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <section className={`${styles.riddleStage} ${leaving ? styles.leaving : ""}`}>
      <div className={styles.eyebrow}>Not so fast, {name}</div>
      <h2 className={styles.riddleTitle}>Three locks stand between you and your surprise</h2>

      <div className={styles.locks} aria-label={`${Math.min(step, riddles.length)} of ${riddles.length} unlocked`}>
        {riddles.map((_, i) => (
          <span key={i} className={`${styles.lock} ${i < step ? styles.lockOpen : ""}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30">
              <path
                className={styles.shackle}
                d="M8 10V7a4 4 0 0 1 8 0v3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor" />
              <circle cx="12" cy="15.5" r="1.6" fill="#5B2633" />
            </svg>
          </span>
        ))}
      </div>

      <div ref={cardRef} className={`${styles.riddleCard} ${shake ? styles.shake : ""}`}>
        {done ? (
          <div className={styles.riddleDone}>
            <div className={styles.script}>Unlocked</div>
            <p>Clever girl. Now, about that cake...</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className={styles.riddleNumber}>
              Riddle {step + 1} of {riddles.length}
            </div>
            <p className={styles.riddleQ}>{current.question}</p>
            <input
              ref={inputRef}
              id={`riddle-${step}`}
              className={styles.riddleInput}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Your answer"
              autoComplete="off"
              autoCapitalize="off"
              inputMode="text"
            />
            <div className={styles.riddleActions}>
              <button type="submit" className={styles.rsvp} disabled={!value.trim()}>
                Unlock
              </button>
              {current.hint && !showHint ? (
                <button type="button" className={styles.hintBtn} onClick={() => setShowHint(true)}>
                  Need a hint?
                </button>
              ) : null}
            </div>
            {showHint && current.hint ? <p className={styles.riddleHint}>{current.hint}</p> : null}
          </form>
        )}
      </div>
    </section>
  );
}
