/**
 * WY_Layout provides a persistent input bar for WY_id at the top of all /cow pages.
 *
 * - The input box allows users to enter a WY_id, which is shared across all cow subpages via React context.
 * - Any page under /cow/ can access the current WY_id using the useWyId() hook.
 * - The layout displays the input bar at the top and renders the current subpage content below.
 * - This enables consistent, stateful filtering or querying by WY_id throughout the cow section.
 */
"use client";

import React, { useState } from "react";
import { WyIdProvider, useWyId } from "../../components/panels/Cow/WyIdContext";
import { usePathname, useRouter } from "next/navigation";

const WyIdInputBar = () => {
  const { wyId, setWyId } = useWyId();
  const [inputValue, setInputValue] = useState(wyId);
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setWyId(inputValue.trim());
    }
  };

  return (
    <div
      style={{
        background: "#1e2a1e",
        borderBottom: "2px solid #4a7c59",
        padding: "0.75rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <span style={{ color: "#a8c5a0", fontWeight: 600, fontSize: "1rem" }}>
        WY Layout
      </span>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
      >
        <label
          htmlFor="wy-layout-id"
          style={{ color: "#c8e6c9", fontSize: "0.9rem" }}
        >
          WY_id:
        </label>
        <input
          id="wy-layout-id"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter WY_id..."
          style={{
            padding: "0.3rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #4a7c59",
            background: "#0d1a0d",
            color: "#e8f5e9",
            fontSize: "0.9rem",
            width: "180px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.3rem 0.9rem",
            borderRadius: "4px",
            border: "none",
            background: "#4a7c59",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Go
        </button>
        {/* Show return button only on subpages, not /cow */}
        {pathname.startsWith("/cow/") && pathname !== "/cow" && (
          <button
            type="button"
            onClick={() => router.push("/cow")}
            style={{
              marginLeft: "1.5rem",
              padding: "0.3rem 0.9rem",
              borderRadius: "4px",
              border: "1.5px solid #4a7c59",
              background: "#26382a",
              color: "#a8c5a0",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background 0.15s",
            }}
          >
            ← Return to Individual Cow
          </button>
        )}
      </form>
      {wyId && (
        <span style={{ color: "#81c784", fontSize: "0.85rem" }}>
          Active: <b>{wyId}</b>
        </span>
      )}
    </div>
  );
};

export default function WY_Layout({ children }: { children: React.ReactNode }) {
  return (
    <WyIdProvider>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <WyIdInputBar />
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {children}
        </div>
      </div>
    </WyIdProvider>
  );
}
