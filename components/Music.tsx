"use client";

import { useEffect, useState } from "react";
import styles from "./Invitation.module.css";
import { config } from "@/lib/config";

let audio: HTMLAudioElement | null = null;
let fadeTimer = 0;
const listeners = new Set<(playing: boolean) => void>();

function notify(playing: boolean) {
  listeners.forEach((l) => l(playing));
}

/** Call from inside a tap handler so the browser allows sound. */
export function startMusic() {
  if (!config.song) return;
  if (!audio) {
    audio = new Audio(config.song);
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("error", () => notify(false));
  }
  audio.volume = 0;
  audio
    .play()
    .then(() => {
      notify(true);
      window.clearInterval(fadeTimer);
      fadeTimer = window.setInterval(() => {
        if (!audio) return;
        audio.volume = Math.min(config.songVolume, audio.volume + 0.02);
        if (audio.volume >= config.songVolume) window.clearInterval(fadeTimer);
      }, 80);
    })
    .catch(() => notify(false));
}

export function toggleMusic() {
  if (!audio) {
    startMusic();
    return;
  }
  if (audio.paused) {
    audio.play().then(() => notify(true)).catch(() => notify(false));
  } else {
    audio.pause();
    notify(false);
  }
}

export default function Music() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    listeners.add(setPlaying);
    return () => {
      listeners.delete(setPlaying);
    };
  }, []);

  if (!config.song) return null;

  return (
    <button
      type="button"
      className={`${styles.music} ${playing ? styles.musicOn : ""}`}
      onClick={toggleMusic}
      aria-label={playing ? "Pause music" : "Play music"}
      title={`${config.songTitle} \u2014 ${config.songArtist}`}
    >
      <span className={styles.bars} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={styles.musicLabel}>{playing ? config.songTitle : "Play music"}</span>
    </button>
  );
}
