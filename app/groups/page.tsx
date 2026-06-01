/**
 * app/groups/page.tsx
 * Groups Data page for BOS Dashboard
 */
"use client";
import React from "react";
import Link from "next/link";

export default function GroupsPage() {
  return (
    <div style={{ padding: "1.5rem" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>← Back to Homepage</Link>
      <h1 style={{ marginBottom: "1rem" }}>Groups Data</h1>
      <p>Groups data page coming soon.</p>
    </div>
  );
}
