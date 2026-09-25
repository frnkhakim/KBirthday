"use client";

import { useEffect, useState } from "react";
import styles from "./Invitation.module.css";
import { config } from "@/lib/config";

type State = "waiting" | "playing" | "stopped";

let audio: HTMLAudioElement | null = null;
let fadeTimer = 0;
let state: State = "waiting";
let userStopped = false;
const listeners = new Set<(s: State) => void>();

function setState(s: State) {
  state = s;
  listeners.forEach((l) => l(s));
}

function getAudio() {
  if (!audio) {
    audio = new Audio(config.song);
    audio.loop = true;
    audio.preload = "auto";
  }
  return audio;
}

function fadeIn() {
  const a = getAudio();
  window.clearInterval(fadeTimer);
  fadeTimer = window.setInterval(() => {
    a.volume = Math.min(config.songVolume, a.volume + 0.02);
    if (a.volume >= config.songVolume) window.clearInterval(fadeTimer);
  }, 80);
}

/** Try to start. Returns true if the browser let it play. */
export function startMusic(): Promise<boolean> {
  if (!config.song || userStopped) return Promise.resolve(false);
  const a = getAudio();
  if (!a.paused) return Promise.resolve(true);
  a.volume = 0;
  return a
    .play()
    .then(() => {
      setState("playing");
      fadeIn();
      return true;
    })
    .catch(() => false);
}

export function stopMusic() {
  userStopped = true;
  window.clearInterval(fadeTimer);
  audio?.pause();
  setState("stopped");
}

export function resumeMusic() {
  userStopped = false;
  startMusic();
}

export default function Music() {
  const [s, setS] = useState<State>(state);

  useEffect(() => {
    listeners.add(setS);

    // 1. Try straight away (works on desktop and on phones that remember the site).
    startMusic().then((ok) => {
      if (ok) return;
      // 2. Otherwise start on her very first touch anywhere, whatever it is.
      const kick = () => {
        startMusic().then((started) => {
          if (started) cleanup();
        });
      };
      const cleanup = () => {
        document.removeEventListener("pointerdown", kick, true);
        document.removeEventListener("touchstart", kick, true);
        document.removeEventListener("keydown", kick, true);
      };
      document.addEventListener("pointerdown", kick, true);
      document.addEventListener("touchstart", kick, true);
      document.addEventListener("keydown", kick, true);
    });

    return () => {
      listeners.delete(setS);
    };
  }, []);

  if (!config.song) return null;

  const playing = s === "playing";

  return (
    <button
      type="button"
      className={`${styles.music} ${playing ? styles.musicOn : ""}`}
      onClick={() => (playing ? stopMusic() : resumeMusic())}
      aria-label={playing ? "Stop music" : "Play music"}
      title={`${config.songTitle} \u2014 ${config.songArtist}`}
    >
      <span className={styles.bars} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={styles.musicLabel}>
        {playing ? `Stop \u00b7 ${config.songTitle}` : s === "stopped" ? "Play music" : config.songTitle}
      </span>
    </button>
  );
}
