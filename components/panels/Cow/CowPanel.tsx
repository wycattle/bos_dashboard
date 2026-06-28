"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputBox from "./InputBox";

interface SubItem {
  label: string;
  route: string;
}

interface Section {
  label: string;
  subItems: SubItem[];
}

const sections: Section[] = [
  {
    label: "Insem Related",
    subItems: [
      { label: "I_U_merge", route: "/cow/iu_merge" },
      // add more insem sub‑items here
    ],
  },
  {
    label: "Milk Related",
    subItems: [
      // { label: "Milk Summary", route: "/cow/milk_summary" },
    ],
  },
  {
    label: "Something Else",
    subItems: [
      // { label: "Another Panel", route: "/cow/another" },
    ],
  },
];

export default function CowPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentWyId, setCurrentWyId] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Pre-fill wy_id from URL when navigating back
  useEffect(() => {
    const wyIdFromUrl = searchParams.get("wy_id");
    if (wyIdFromUrl) {
      setCurrentWyId(wyIdFromUrl);
    }
  }, [searchParams]);

  const handleWyIdSubmit = (wyId: string) => {
    setCurrentWyId(wyId);
  };

  const handleSubItemClick = (route: string) => {
    if (!currentWyId.trim()) {
      alert("Please enter a WY ID first.");
      return;
    }
    router.push(`${route}?wy_id=${encodeURIComponent(currentWyId)}`);
  };

  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        padding: "2.5rem 0.5rem 0.5rem 0.5rem",
        position: "relative",
      }}
    >
      {/* Top bar with Home button only */}
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          left: "0.5rem",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.3rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #475569",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⌂ Home
        </button>
      </div>

      {/* Main content */}
      <div style={{ overflow: "auto", height: "100%" }}>
        {/* Input box always visible, pre-filled from URL */}
        <InputBox onSubmit={handleWyIdSubmit} initialValue={currentWyId} />
        {currentWyId && (
          <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)" }}>
            Current WY ID: {currentWyId}
          </p>
        )}

        {/* Section buttons */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {sections.map((section) => (
            <button
              key={section.label}
              onClick={() =>
                setActiveSection(
                  activeSection === section.label ? null : section.label
                )
              }
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: 600,
                background:
                  activeSection === section.label ? "#3b82f6" : "#1e293b",
                color: "#f8fafc",
                border: "1px solid #475569",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Sub‑item buttons for active section */}
        {activeSection && (
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {sections
              .find((s) => s.label === activeSection)
              ?.subItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => handleSubItemClick(item.route)}
                  style={{
                    padding: "0.4rem 0.9rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    background: "#334155",
                    color: "#f8fafc",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            {sections.find((s) => s.label === activeSection)?.subItems
              .length === 0 && (
              <p style={{ color: "var(--muted-foreground)" }}>
                No panels available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}