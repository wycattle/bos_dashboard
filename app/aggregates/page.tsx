
"use client";
import React from "react";
import Link from "next/link";

export default function AggregatesPage() {
  const tabs = [
    { href: "/aggregates/allx", label: "Allx Table" },
    // Add more aggregate tables here as needed
  ];
  return (
    <div style={{ padding: "1.5rem" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>← Back to Homepage</Link>
      <h1 style={{ marginBottom: "1.5rem" }}>Aggregates</h1>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "0.75rem 2.5rem",
              border: "1px solid var(--surface-border)",
              borderRadius: "8px 8px 0 0",
              background: "var(--surface-contrast)",
              color: "var(--foreground)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.1em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div style={{ color: "var(--muted-foreground)", fontSize: "1em" }}>
        Select a table above to view aggregate records.
      </div>
    </div>
  );
}
