// components/shared/FrozenTable.tsx
"use client";
import React from "react";

const css = `
.frozen-table { border-collapse: separate; border-spacing: 0; }
.frozen-table thead th {
  position: sticky; top: 0; z-index: 2;
  background: var(--background, #fff);
}
.frozen-table thead th:first-child,
.frozen-table tbody td:first-child {
  position: sticky; left: 0;
  background: var(--background, #fff);
}
.frozen-table tbody td:first-child { z-index: 1; }
.frozen-table thead th:first-child { z-index: 3; }
`;

interface FrozenTableProps {
  children: React.ReactNode; // <thead> + <tbody>
  maxHeight?: string;
}

export function FrozenTable({ children, maxHeight = "80vh" }: FrozenTableProps) {
  return (
    <div style={{ overflow: "auto", maxHeight }}>
      <style>{css}</style>
      <table className="data-table frozen-table">{children}</table>
    </div>
  );
}