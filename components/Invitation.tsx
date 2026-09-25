"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Invitation.module.css";
import { config } from "@/lib/config";
import Petals, { burst, hearts } from "./Petals";
import Envelope from "./Envelope";
import Countdown from "./Countdown";

export default function Invitation() {
  const [opened, setOpened] = useState(false);
  const [rsvp, setRsvp] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!opened) return;
    window.scrollTo(0, 0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) burst(window.innerWidth / 2, window.innerHeight * 0.25, 90);
    // The video is muted so browsers allow it to autoplay once the page opens.
    videoRef.current?.play().catch(() => {});
  }, [opened]);

  const handleRsvp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    hearts(r.left + r.width / 2, r.top);
    burst(r.left + r.width / 2, r.top, 60);
    setRsvp(true);
  };

  return (
    <>
      <Petals />
      <main className={styles.main}>
        {!opened ? (
          <Envelope name={config.name} age={config.age} onOpened={() => setOpened(true)} />
        ) : (
          <article className={styles.invite}>
            <div className={styles.eyebrow}>You are cordially invited</div>
            <h1 className={styles.name}>{config.name}</h1>
            <p className={styles.lead}>{config.lead}</p>

            <div className={styles.videoWrap}>
              <video
                ref={videoRef}
                className={styles.video}
                src={config.video}
                poster={config.poster}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            </div>

            <div className={styles.figureRow}>
              <img className={styles.figure} src={config.figure} alt={`${config.name}, illustrated`} />
              <div className={styles.age}>
                {config.age}
                <small>Happy Birthday</small>
              </div>
            </div>

            <div className={styles.rule}>&#10022;</div>

            <dl className={styles.details}>
              <div>
                <dt>Date</dt>
                <dd>
                  {config.dateLine}
                  <em>{config.dateSub}</em>
                </dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>
                  {config.timeLine}
                  <em>{config.timeSub}</em>
                </dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>
                  {config.venueLine}
                  <em>{config.venueSub}</em>
                </dd>
              </div>
            </dl>

            <div>
              <div className={styles.eyebrow} style={{ marginBottom: 12 }}>
                Until we raise a glass
              </div>
              <Countdown target={config.dinner} name={config.name} />
            </div>

            <div className={styles.guests}>
              <h2>The guest list</h2>
              <div className={styles.silhouettes} aria-hidden="true">
                {Array.from({ length: config.guestCount }).map((_, i) => (
                  <i key={i}>?</i>
                ))}
              </div>
              <p>{config.guestsLine}</p>
            </div>

            <p className={styles.note}>{config.note}</p>

            <div>
              <button type="button" className={styles.rsvp} onClick={handleRsvp} disabled={rsvp}>
                {rsvp ? "See you there" : "I'll be there"}
              </button>
              <div className={styles.rsvpMsg}>{rsvp ? "Can’t wait to celebrate you. ♥" : ""}</div>
            </div>

            <div className={styles.sign}>
              <small>With all my love</small>
              {config.from}
            </div>
          </article>
        )}
      </main>
    </>
  );
}
