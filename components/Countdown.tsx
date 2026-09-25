"use client";

import { useEffect, useState } from "react";
import styles from "./Invitation.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ target, name }: { target: string; name: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const update = () => setLeft(Math.max(0, end - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left === null) {
    return <div className={styles.count} aria-hidden="true" />;
  }

  if (left <= 0) {
    return <div className={styles.countDone}>It&rsquo;s time. Happy birthday, {name}!</div>;
  }

  const s = Math.floor(left / 1000);
  const parts = [
    [Math.floor(s / 86400), "Days"],
    [pad(Math.floor((s % 86400) / 3600)), "Hours"],
    [pad(Math.floor((s % 3600) / 60)), "Mins"],
    [pad(s % 60), "Secs"],
  ] as const;

  return (
    <div className={styles.count} aria-live="polite">
      {parts.map(([v, label]) => (
        <div key={label}>
          <b>{v}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
