// components/shared/DownloadXlsxButton.tsx
"use client";
import { downloadXlsx } from "@/utils/downloadXlsx";

interface DownloadXlsxButtonProps<T extends object> {
  rows: T[];
  filename: string;
  sheetName?: string;
}

export function DownloadXlsxButton<T extends object>({
  rows,
  filename,
  sheetName,
}: DownloadXlsxButtonProps<T>) {
  return (
    <button
      className="xlsx-button"
      onClick={() => downloadXlsx(rows, filename, 'sheet_1')}
    >
      ⬇ XLSX
    </button>
  );
}