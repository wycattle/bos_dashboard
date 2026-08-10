/** app/(pages)/cow/page.tsx */
"use client";
import { useRouter } from "next/navigation";

export default function CowPage() {
  const router = useRouter();

  const goTo = (path: string) => {
    const params = new URLSearchParams(window.location.search);
    const wyId = params.get("wy_id");
    router.push(wyId ? `${path}?wy_id=${wyId}` : path);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button onClick={() => goTo("/cow/tables")} style={navButtonStyle}>Tables</button>
        <button onClick={() => goTo("/cow/plots")} style={navButtonStyle}>Plots</button>
      </div>
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