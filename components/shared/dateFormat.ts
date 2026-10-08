/** components/shared/dateFormat.ts */

/* The one place the app's display timezone is stated.
   Swapping zones is a one-line change here, nowhere else. */
export const APP_TZ = "Asia/Bangkok";

/* Module scope — Intl formatters are expensive to build and these are
   pure, so they are constructed once per process/bundle, not per render. */
const monthFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TZ,
  year: "numeric",
  month: "2-digit",
});

const dayFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TZ, hour: "2-digit", minute: "2-digit",
  hourCycle: "h23",          // hour12:false maps to h24 on some ICU builds → "24:30"
});

/** Read a formatter's output by part name — never by string position. */
const parts = (fmt: Intl.DateTimeFormat, d: Date) =>
  Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));

/** "2026-01" — year/month only. */
export const formatYearMonth = (val: unknown): string => {
  if (val == null) return "—";
  const d = new Date(String(val));
  if (isNaN(d.getTime())) return String(val);
  const { year, month } = parts(monthFmt, d);
  return `${year}-${month}`;
};

/** "2026-01-15" — full date. */
export const formatDate = (val: unknown): string => {
  if (val == null) return "—";
  const d = new Date(String(val));
  if (isNaN(d.getTime())) return String(val);
  const { year, month, day } = parts(dayFmt, d);
  return `${year}-${month}-${day}`;
};

/** Numbers live here too so panels stop re-declaring them. */
export const formatNumber = (val: unknown): string => {
  if (val == null) return "—";
  const n = Number(String(val).replace(/,/g, ""));
  if (isNaN(n)) return String(val);
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

/** "2026-01-15 14:30" — date + time. */
export const formatDateTime = (val: unknown): string => {
  if (val == null) return "—";
  const d = new Date(String(val));
  if (isNaN(d.getTime())) return String(val);
  const { year, month, day } = parts(dayFmt, d);
  const { hour, minute } = parts(timeFmt, d);
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

