/**
 * Everything you might want to change lives here.
 * Edit the values, run `npm run build`, and upload the `out` folder again.
 */
export type Riddle = {
  question: string;
  answers: string[]; // any of these count as correct (spelling and capitals don't matter)
  hint?: string;
};

export const config = {
  // The web address you will upload the site to (used for the WhatsApp preview card).
  // Example: "https://karen.frankhakim.com" or "https://mysite.com/karen"
  siteUrl: "https://example.com",

  name: "Karen",
  age: 31,
  from: "Frank",

  // Dinner date and time (South African time, UTC+2).
  dinner: "2026-09-29T19:00:00+02:00",
  dateLine: "Tuesday",
  dateSub: "29 September",
  timeLine: "7:00 pm",
  timeSub: "please be on time",

  // Restaurant. Keep it a secret or fill it in.
  venueLine: "A secret",
  venueSub: "revealed soon",

  lead: "to a birthday dinner in honour of a woman who makes every day brighter",
  note: "Wear something that makes you feel beautiful. Everything else is taken care of.",
  promise: "A table is waiting, the night is yours, and I have a few surprises up my sleeve.",

  // The three locks she has to open before the invitation appears.
  // Swap these for things only she would know: where you met, your song, a nickname...
  riddles: [
    {
      question: "How many candles are on the cake this year?",
      answers: ["31", "thirty one", "thirtyone"],
      hint: "It's the number you've been trying not to think about.",
    },
    {
      question: "In which month does the most beautiful woman I know celebrate her birthday?",
      answers: ["september", "sept", "sep"],
      hint: "Spring has just started.",
    },
    {
      question: "Who loves you more than anyone in the world?",
      answers: ["frank", "my husband", "husband", "you"],
      hint: "He's the one who made this.",
    },
  ] as Riddle[],

  // Music. Put the MP3 in the /public folder with this exact name.
  // It starts (softly, fading in) the moment she taps the wax seal.
  song: "/perfect.mp3",
  songTitle: "Perfect",
  songArtist: "Ed Sheeran",
  songVolume: 0.55, // 0 to 1

  // Files in /public
  video: "/invitation.mp4",        // the slideshow
  photoVideo: "/photo-video.mp4",   // the earlier version with her photo, kept in case you want it
  loop: "/loop.mp4",
  figure: "/karen-anime.png",
  poster: "/poster.jpg",
};
