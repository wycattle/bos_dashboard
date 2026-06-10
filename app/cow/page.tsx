"use client";

import React from "react";
import Link from "next/link";
import { useWyId } from "../../components/panels/Cow/WyIdContext";

const COW_SUBPAGES = [
  {
    href: "/cow/iumerge",
    label: "IU Merge",
    description: "Insemination / union merge records",
  },
  // Add more subpages here as they are built
];

export default function CowPage() {
  const { wyId } = useWyId();

  return (
    <main className="app-main">
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          fontSize: "0.9em",
        }}
      >
        ← Back to Homepage
      </Link>
      <h1 className="page-title">Individual Cow</h1>

      {wyId ? (
        <p className="page-meta">
          Active WY_id: <b>{wyId}</b> — select a view below.
        </p>
      ) : (
        <p className="page-meta">
          Enter a WY_id in the bar above, then choose a view.
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {COW_SUBPAGES.map(({ href, label, description }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#1e2a1e",
                border: "1.5px solid #4a7c59",
                borderRadius: "8px",
                padding: "1rem 1.5rem",
                minWidth: "180px",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#26382a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1e2a1e")
              }
            >
              <div
                style={{ color: "#a8c5a0", fontWeight: 700, fontSize: "1rem" }}
              >
                {label}
              </div>
              <div
                style={{
                  color: "#6a9a72",
                  fontSize: "0.8rem",
                  marginTop: "0.25rem",
                }}
              >
                {description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
