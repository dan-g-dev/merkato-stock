export function formatEtb(amount: number): string {
  return `${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ETB`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
