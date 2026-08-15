const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 942 → "942", 1180 → "1.2K". Keeps star/fork counts from wrapping. */
export function formatCount(value: number): string {
  return compactNumber.format(value);
}

const relativeTime = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
const absoluteDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Both forms of a timestamp: the relative one reads well ("3 days ago"), the
 * absolute one goes in a `title`/`dateTime` so it stays unambiguous. Computed
 * at render time, so it is only ever as stale as the page's revalidate window.
 */
export function formatDate(
  iso: string,
): { relative: string; absolute: string } | null {
  const date = new Date(iso);
  const time = date.getTime();
  if (Number.isNaN(time)) return null;

  const diff = time - Date.now();
  const abs = Math.abs(diff);
  const days = Math.round(diff / DAY);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;
  if (abs < HOUR) {
    value = Math.round(diff / MINUTE);
    unit = "minute";
  } else if (abs < DAY) {
    value = Math.round(diff / HOUR);
    unit = "hour";
  } else if (Math.abs(days) < 30) {
    value = days;
    unit = "day";
  } else if (Math.abs(days) < 365) {
    value = Math.round(days / 30);
    unit = "month";
  } else {
    value = Math.round(days / 365);
    unit = "year";
  }

  return {
    relative: relativeTime.format(value, unit),
    absolute: absoluteDate.format(date),
  };
}
