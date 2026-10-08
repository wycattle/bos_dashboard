"use client";
import type { CSSProperties } from "react";
import { formatYearMonth } from "./dateFormat";
import * as styles from "./tableStyles";

interface DateCellProps {
  value: unknown;
  format?: (v: unknown) => string;   // default: year/month
  style?: CSSProperties;             // default: tdDateYM
}

export function DateCell({
  value,
  format = formatYearMonth,
  style = styles.tdDateYM,
}: DateCellProps) {
  return <td style={style}>{format(value)}</td>;
}