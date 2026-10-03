/** app/(pages)/aggregates/layout.tsx */
"use client";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { label: "Feed", href: "/aggregates/feed_related" },
  { label: "Finance", href: "/aggregates/finance_related" },
  { label: "Insem", href: "/aggregates/insem_related" },
  { label: "Milk", href: "/aggregates/milk_related" },
];

export default function AggregatesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {/* Home: top-left */}
      <button
        className="tab-button"
        style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10 }}
        onClick={() => router.push("/")}
      >
        ⌂ Home
      </button>

      {/* Category tabs: centered */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", padding: "0.5rem" }}>
        {tabs.map((t) => (
          <button
            key={t.href}
            className={`tab-button${pathname.startsWith(t.href) ? " active" : ""}`}
            onClick={() => router.push(t.href)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Child layouts/pages fill the rest */}
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>{children}</div>
    </div>
  );
}