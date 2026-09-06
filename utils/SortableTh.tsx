/**
 * components/SortableTh.tsx
 * Reusable sortable table header cell.
 * Mirrors sortRows.ts on the UI side — just drop one <SortableTh> per column.
 */
import type { CSSProperties } from "react";

interface SortableThProps<K extends PropertyKey> {
  label: string;
  colKey: K;
  sortKey: K;
  sortDir: "asc" | "desc";
  onSort: (key: K) => void;
  style?: CSSProperties;
}

export function SortableTh<K extends PropertyKey>({
  label,
  colKey,
  sortKey,
  sortDir,
  onSort,
  style,
}: SortableThProps<K>) {
  const arrow = sortKey === colKey ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  return (
    <th
      onClick={() => onSort(colKey)}
      style={{ cursor: "pointer", userSelect: "none", ...style }}
    >
      {label}
      {arrow}
    </th>
  );
}