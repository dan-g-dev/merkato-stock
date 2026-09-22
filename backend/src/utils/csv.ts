// Turns an array of objects into a CSV string. Deliberately simple -
// good enough for exporting reports/lists, not a general CSV parser.
export function toCsv(rows: Record<string, unknown>[], columns: { key: string; header: string }[]): string {
  const escapeCell = (value: unknown): string => {
    const text = value === null || value === undefined ? "" : String(value);
    if (text.includes(",") || text.includes('"') || text.includes("\n")) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const headerRow = columns.map((col) => escapeCell(col.header)).join(",");
  const dataRows = rows.map((row) => columns.map((col) => escapeCell(row[col.key])).join(","));
  return [headerRow, ...dataRows].join("\n");
}
