"use client";

import { useRef, useState } from "react";
import styles from "./Invitation.module.css";
import { burst } from "./Petals";

type Props = {
  name: string;
  age: number;
  onOpened: () => void;
};

export default function Envelope({ name, age, onOpened }: Props) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = ref.current?.getBoundingClientRect();
    window.setTimeout(() => {
      if (r && !reduce) burst(r.left + r.width / 2, r.top + r.height * 0.3, 160);
    }, reduce ? 0 : 700);
    window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(onOpened, reduce ? 0 : 550);
    }, reduce ? 50 : 1900);
  };

  return (
    <section className={`${styles.stage} ${leaving ? styles.leaving : ""}`}>
      <div className={styles.forLabel}>A little something for</div>
      <div className={styles.toName}>{name}</div>
      <button
        ref={ref}
        type="button"
        className={`${styles.envelope} ${open ? styles.open : ""}`}
        onClick={handleOpen}
        aria-label="Open your invitation"
      >
        <span className={styles.envBack} />
        <span className={styles.envCard}>
          <span>{age}</span>
        </span>
        <span className={styles.envFront} />
        <span className={styles.envFlap} />
        <span className={styles.seal}>{name.charAt(0)}</span>
      </button>
      <div className={styles.hint}>Tap the seal to open</div>
    </section>
  );
}
