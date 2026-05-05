import type { Timestamp } from "firebase/firestore";

export function formatDate(value: Timestamp | Date | string | null | undefined) {
  if (!value) {
    return "Just now";
  }

  const date =
    value instanceof Date
      ? value
      : typeof (value as Timestamp).toDate === "function"
        ? (value as Timestamp).toDate()
        : new Date(String(value));
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(date);
}
