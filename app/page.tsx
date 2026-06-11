import Link from "next/link";

const sections = [
  { label: "Daily Data", href: "/dashboard" },
  { label: "Aggregates", href: "/aggregates" },
  { label: "Individual Cow", href: "/cow" },
] as const;

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1
        style={{
          color: "var(--foreground)",
          marginBottom: "2rem",
          fontSize: "2rem",
        }}
      >
        BOS Dashboard
      </h1>
      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {sections.map(({ label, href }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "1.25rem 1.5rem",
                border: "1px solid var(--surface-border)",
                borderRadius: "0.5rem",
                background: "var(--surface-contrast)",
                color: "var(--foreground)",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              {label}
              <span
                style={{ float: "right", color: "var(--muted-foreground)" }}
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </main>
  );
}
