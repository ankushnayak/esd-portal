import Papa from "papaparse";

export function toCsv(rows: Record<string, string | number | null | undefined>[]) {
  return Papa.unparse(rows);
}
