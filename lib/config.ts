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

  // Her actual birthday (the page says "Happy Birthday" only from this day onwards;
  // before that it keeps the wish for the day itself).
  birthday: "2026-09-29",

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
      question: "On which day of the week is your birthday dinner?",
      answers: ["tuesday", "tues", "tue"],
      hint: "The day after Monday.",
    },
  ] as Riddle[],

  // Candles on the cake she blows out after the riddles (keep it 3 to 7 so they fit on a phone).
  candles: 5,

  // Music (public/perfect.mp3). It starts on its own as soon as the phone allows
  // sound (on most phones that is her first tap anywhere), and she can stop it
  // with the pill in the top corner.
  song: "/perfect.mp3",
  songTitle: "Perfect",
  songArtist: "Ed Sheeran & Beyonc\u00e9",
  songVolume: 0.55, // 0 to 1

  // Files in /public
  video: "/invitation.mp4",        // the slideshow
  photoVideo: "/photo-video.mp4",   // the earlier version with her photo, kept in case you want it
  loop: "/loop.mp4",
  figure: "/karen-anime.png",
  poster: "/poster.jpg",
};
