"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import InputBox from "@/components/shared/InputBox";

export default function CowPanel({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wy_id = searchParams.get("wy_id") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("wy_id", id);
    else params.delete("wy_id");
    router.push(`${pathname}?${params.toString()}`);
    inputRef.current?.focus();
  };

  const goTo = (path: string) => {
  const params = new URLSearchParams(searchParams.toString());
  const query = params.toString();
  router.push(query ? `${path}?${query}` : path);
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
      <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10, display: "flex", gap: "0.5rem" }}>
        {/* <button onClick={() => router.back()} style={navButtonStyle}>← Back</button> */}
        <button onClick={() => router.push("/")} style={navButtonStyle}>⌂ Home</button>
      </div>

      <div 
      
      style={{ margin: "5rem auto 1rem", display: "flex", flexDirection: "column", 
        alignItems: "center", gap: "1rem" }}>
        <InputBox
          inputRef={inputRef}
          onSubmit={handleSubmit}
          initialValue={wy_id}
          placeholder="Enter WY ID"
        />
      <div style={{ display: "flex", gap: "3rem" }}>
        <button onClick={() => goTo("/cow/tables")} style={navButtonStyle}>Tables</button>
        <button onClick={() => goTo("/cow/plots")} style={navButtonStyle}>Plots</button>
      </div>
      </div>

      {children}
    </div>
  );
}

const navButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  fontWeight: 600,
  background: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #475569",
  borderRadius: "6px",
  cursor: "pointer",
};