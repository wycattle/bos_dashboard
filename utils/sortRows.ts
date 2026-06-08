/**
 * utils/sortRows.ts
 * Generic row-sorting utility for data tables.
 *
 * @param rows     - Array of row objects to sort (not mutated).
 * @param sortKey  - The key of the field to sort by.
 * @param sortDir  - "asc" or "desc".
 * @returns A new sorted array.
 *
 * Sorting rules:
 *   - av/bv are the values of row a and row b for the given sortKey column.
 *   - Numeric fields are compared arithmetically to avoid lexicographic
 *     mis-ordering (e.g. "9" > "28" when treated as strings).
 *   - String fields use localeCompare for correct locale-aware ordering.
 *   - Nulls/undefineds are always sorted to the bottom regardless of direction.
 */
export function sortRows<T extends object>(
  rows: T[],
  sortKey: keyof T,
  sortDir: "asc" | "desc"
): T[] {
  return [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const dir = sortDir === "asc" ? 1 : -1;
    const an = typeof av === "number" ? av : (typeof av === "string" && av !== "" ? Number(av) : NaN);
    const bn = typeof bv === "number" ? bv : (typeof bv === "string" && bv !== "" ? Number(bv) : NaN);
    if (!isNaN(an) && !isNaN(bn)) return (an - bn) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}
