import type { InboxCustomer } from "@/types/conversation";

// Guests have no name: "Guest 3f2a" from their generated id.
export function customerName(
  customer: Pick<InboxCustomer, "name" | "externalId">,
) {
  if (customer.name) return customer.name;
  const tail = customer.externalId.replace(/^guest_/, "").slice(0, 4);
  return `Guest ${tail}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

const relative = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "narrow",
});

export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 45) return "just now";
  if (abs < 3600) return relative.format(Math.round(seconds / 60), "minute");
  if (abs < 86_400) return relative.format(Math.round(seconds / 3600), "hour");
  if (abs < 7 * 86_400)
    return relative.format(Math.round(seconds / 86_400), "day");
  return new Date(iso).toLocaleDateString();
}

export function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
