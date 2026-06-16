import { format, formatDistanceToNow } from "date-fns";

export function formatCurrency(value: number | string, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatCount(value: number | string) {
  return new Intl.NumberFormat("en-IN").format(Number(value));
}

export function formatDate(value: Date | string) {
  return format(new Date(value), "dd MMM yyyy");
}

export function timeAgo(value: Date | string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
