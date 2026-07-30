// components/shared/PanelHeader.tsx
"use client";
import React from "react";

interface PanelHeaderProps {
  title: string;
  children?: React.ReactNode; // slot for DownloadXlsxButton or other actions
}

export function PanelHeader({ title, children }: PanelHeaderProps) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.5rem",
    }}>
      <h2 style={{ margin: 0, fontSize: "1rem", lineHeight: 1.2 }}>{title}</h2>
      {children}
    </div>
  );
}