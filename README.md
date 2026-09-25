# Karen's 31st

A surprise birthday invitation built with Next.js. She taps a wax seal, the envelope opens, and she solves three riddles to open the gold locks, and the invitation slides out with the video and a live countdown to dinner.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Change the details

Everything editable is in `lib/config.ts`: her name, the date and time, the restaurant, the wording, the sign-off, and the three riddles (change them to things only she would know). The video and pictures live in `public/`.

## Music

The song is `public/perfect.mp3` (the file name is set in `lib/config.ts` under `song`). It starts by itself as soon as the phone allows sound, which on most phones means her first tap anywhere on the page, then fades in and loops. The pill in the top corner stops it. If the file is missing the app simply stays silent.

## Build for a website

```bash
npm run build
```

This writes a static site to the `out` folder. Upload the **contents** of `out` to any web host (cPanel, Netlify, Vercel, GitHub Pages, Azure Static Web Apps). No server needed.

## Files

- `app/` — layout, global styles and the page
- `components/Invitation.tsx` — the invitation card
- `components/Envelope.tsx` — the tap-to-open envelope
- `components/Countdown.tsx` — countdown to dinner
- `components/Petals.tsx` — falling petals, confetti and hearts
- `public/invitation.mp4` — the slideshow video shown in the invitation
- `public/photo-video.mp4` — the earlier video with her photo in a gold frame
- `public/slides/` — the six slides as images
- `public/loop.mp4` — short looping animation for WhatsApp
- `public/karen-anime.png` — illustrated cut-out
- `public/karen-cutout.png` — photo cut-out with no background
