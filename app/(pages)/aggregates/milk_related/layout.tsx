/** app/(pages)/aggregates/milk_related/layout.tsx */
"use client";
import { usePathname, useRouter } from "next/navigation";

const base = "/aggregates/milk_related";

const tabs = [
  { label: "fullday", href: `${base}/fullday` },
  { label: "wy_cp_diff", href: `${base}/wy_cp_diff` },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", gap: "0.5rem", padding: "0.5rem" }}>
        {/* Back up one level: left edge of this row */}
        <button
          className="tab-button"
          style={{ position: "absolute", left: "0.5rem", top: "0.5rem" }}
          onClick={() => router.push("/aggregates")}
        >
          ↑ Aggregates
        </button>

        {tabs.map((t) => (
          <button
            key={t.href}
            className={`tab-button${pathname === t.href ? " active" : ""}`}
            onClick={() => router.push(t.href)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>{children}</div>
    </div>
  );
}