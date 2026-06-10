/**
 * components/SortableTh.tsx
 * Reusable sortable table header cell.
 * Mirrors sortRows.ts on the UI side — just drop one <SortableTh> per column.
 */
interface SortableThProps<K extends PropertyKey> {
  label: string;
  colKey: K;
  sortKey: K;
  sortDir: "asc" | "desc";
  onSort: (key: K) => void;
}

export function SortableTh<K extends PropertyKey>({
  label,
  colKey,
  sortKey,
  sortDir,
  onSort,
}: SortableThProps<K>) {
  const arrow = sortKey === colKey ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  return (
    <th
      onClick={() => onSort(colKey)}
      style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}
    >
      {label}
      {arrow}
    </th>
  );
}
