"use client";

import { useEffect, useState } from "react";
import styles from "./Invitation.module.css";
import { startMusic, isMusicPlaying } from "./Music";
import { burst } from "./Petals";

type Props = { name: string; onBegin: () => void };

export default function Welcome({ name, onBegin }: Props) {
  const [leaving, setLeaving] = useState(false);

  // If the browser let the song autoplay (desktop, or a phone that remembers the
  // site), skip this screen entirely: there is nothing to wait for.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (isMusicPlaying()) onBegin();
    }, 600);
    return () => window.clearTimeout(id);
  }, [onBegin]);

  const begin = (e: React.PointerEvent<HTMLButtonElement>) => {
    startMusic();
    burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 80);
    setLeaving(true);
    window.setTimeout(onBegin, 500);
  };

  return (
    <button
      type="button"
      className={`${styles.welcome} ${leaving ? styles.leaving : ""}`}
      onPointerDown={begin}
      aria-label="Tap to begin"
    >
      <span className={styles.welcomeMark} aria-hidden="true">
        &#10022;
      </span>
      <span className={styles.forLabel}>Something special for</span>
      <span className={styles.toName}>{name}</span>
      <span className={styles.welcomeHint}>Turn your sound on, then tap anywhere</span>
    </button>
  );
}
