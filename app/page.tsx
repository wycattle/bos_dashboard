import Link from "next/link";

const modules = [
  { href: "/tenday", label: "Ten-Day Records", description: "View and sort ten-day milk production data." },
  { href: "/aggregate", label: "Aggregate Data", description: "Summary statistics across the herd." },
  { href: "/cow", label: "Individual Cow", description: "Look up data for a specific animal by WY ID." },
];

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>BOS Dashboard</h1>
      <p style={{ marginBottom: "2rem", color: "var(--muted-foreground)" }}>
        Select a module to get started.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            style={{
              display: "block",
              padding: "1.25rem 1.5rem",
              background: "var(--surface-contrast)",
              border: "1px solid var(--surface-border)",
              borderRadius: "8px",
              minWidth: "200px",
              textDecoration: "none",
              color: "var(--foreground)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "0.4rem" }}>{m.label}</strong>
            <span style={{ fontSize: "0.9em", color: "var(--muted-foreground)" }}>{m.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
