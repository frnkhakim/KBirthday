import { config } from "./config";

/** True once it is her birthday (or later) in the viewer's local time. */
export function isBirthdayYet(now = new Date()) {
  const [y, m, d] = config.birthday.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  return now.getTime() >= start.getTime();
}
