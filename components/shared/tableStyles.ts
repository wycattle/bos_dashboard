/** components/shared/tableStyles.ts */
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ *
 * Tokens — every value below routes through these.
 * Declared in app/globals.css:
 *   --background  --foreground  --surface  --surface-strong
 *   --surface-border  --table-header  --table-row  --table-row-alt
 *   --accent  --accent-foreground  --muted-foreground
 * Rule: no hard-coded colours in this file. Add a token instead.
 * ------------------------------------------------------------------ */
const TEXT = "var(--foreground)";
const SURFACE = "var(--surface)";
const BORDER = "var(--surface-border)";
const ROW = "var(--table-row)";
const ROW_ALT = "var(--table-row-alt)";
const ROW_HOVER = "var(--surface-strong)";
const HEADER_BG = "var(--table-header)";

/* Shared geometry — retune cell density in one place. */
const PAD_XS = "1px 2px";
const PAD_SM = "1px 4px";
const SIZE_XS = "0.6rem";
const SIZE_SM = "0.7rem";
const SIZE_MD = "0.75rem";
const SIZE_DATE = "0.72rem";

/* ------------------------------------------------------------------ *
 * Primitives — the three bases everything else is composed from.
 * Cells ship with a transparent background so row striping and the
 * column-band helpers below can paint underneath / over them.
 * ------------------------------------------------------------------ */
const cellBase: CSSProperties = {
  padding: PAD_XS,
  lineHeight: 1.1,
  verticalAlign: "middle",
  color: TEXT,
};

const headBase: CSSProperties = {
  ...cellBase,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const dataBase: CSSProperties = {
  ...cellBase,
  minWidth: "30px",
  borderBottom: `1px solid ${BORDER}`,   // horizontal grid line on every data row
};

/** Compose style objects left→right; falsy parts are ignored. */
export const merge = (
  ...parts: (CSSProperties | false | null | undefined)[]
): CSSProperties => Object.assign({}, ...parts.filter(Boolean));

/* ------------------------------------------------------------------ *
 * Headers
 * ------------------------------------------------------------------ */
export const th: CSSProperties = {     // normal header, wraps
  ...headBase,
  textAlign: "center",
  fontSize: SIZE_SM,
  whiteSpace: "normal",
  padding: PAD_SM,
};

export const thF: CSSProperties = {    // emphasised header
  ...th,
  fontSize: SIZE_MD,
};

export const thDate: CSSProperties = { // date / narrow numeric header
  ...headBase,
  textAlign: "center",
  fontSize: SIZE_XS,
  width : "100px",
};

export const thSeparator: CSSProperties = { // left edge of a column group
  ...th,
  borderLeft: `1px solid ${BORDER}`,
  paddingLeft: "1.25rem",
  width: "70px",
};

/* ------------------------------------------------------------------ *
 * Data cells
 * ------------------------------------------------------------------ */
export const td: CSSProperties = {     // ordinary, right-aligned
  ...dataBase,
  textAlign: "right",
  fontSize: SIZE_SM,
};

export const tdc: CSSProperties = {    // ordinary, centred
  ...dataBase,
  textAlign: "center",
  fontSize: SIZE_SM,
};

export const tdF: CSSProperties = {    // emphasised value
  ...dataBase,
  textAlign: "center",
  fontSize: SIZE_MD,
  fontWeight: 600,
};

export const tdDate: CSSProperties = { // date value
  ...dataBase,
  textAlign: "center",
  fontSize: SIZE_DATE,
  width: '100px',
};

export const tdDateWide: CSSProperties = { // wide date value
  ...tdDate,
  textAlign: "center",
  minWidth: "80px",
};

export const tdSeparator: CSSProperties = { // left edge of a column group
  ...td,
  borderLeft: `1px solid ${BORDER}`,
  paddingLeft: "1.25rem",
  textAlign: "center",
};

/* ------------------------------------------------------------------ *
 * Table shells
 * ------------------------------------------------------------------ */
export const thead: CSSProperties = {
  background: HEADER_BG,
};

export const tableBase: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: SURFACE,
  color: TEXT,
};

/** Default shell: scrollable, rounded, auto width. */
export const tableWrap: CSSProperties = {
  overflowX: "auto",
  overflowY: "auto",
  marginTop: "18px",
  border: `1px solid ${BORDER}`,
  borderRadius: "12px",
  background: SURFACE,
};

/** Full-height variant for panels that own their own scroll area. */
export const tableContainer: CSSProperties = merge(tableWrap, {
  height: "100%",
  width: "fit-content",
  maxWidth: "100%",
  borderRadius: "4px",
  padding: "0.25rem",
  marginTop: 0,
  whiteSpace: "normal",
});

/* ------------------------------------------------------------------ *
 * Banding helpers — inline styles can't express :nth-child / :hover,
 * so parity and hover are resolved in JS by column or row index.
 * ------------------------------------------------------------------ */
export const colBand = (colIndex: number, hovered = false): CSSProperties => ({
  background: hovered ? ROW_HOVER : colIndex % 2 === 0 ? ROW : ROW_ALT,
});

export const rowBand = (rowIndex: number, hovered = false): CSSProperties => ({
  background: hovered ? ROW_HOVER : rowIndex % 2 === 0 ? ROW : ROW_ALT,
});

/** Column-banded cell — pass a base cell style for alignment/font. */
export const colCell = (
  colIndex: number,
  hovered = false,
  base: CSSProperties = td
): CSSProperties => merge(base, colBand(colIndex, hovered));

/** Column-banded header — pass a base header style. */
export const colHead = (
  colIndex: number,
  base: CSSProperties = th
): CSSProperties => merge(base, colBand(colIndex));

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */
export const navButtonStyle: CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  fontWeight: 600,
  background: "var(--accent)",
  color: "var(--accent-foreground)",
  border: `1px solid ${BORDER}`,
  borderRadius: "6px",
  cursor: "pointer",
};