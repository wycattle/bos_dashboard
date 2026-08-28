/** app/(pages)/aggregates/layout.tsx */
"use client";
import { usePathname, useRouter } from "next/navigation";


//layouts wrap pages, they don't replace them:  "wrap" means literally: layout.tsx renders {children} somewhere 
// //in its JSX, and Next.js substitutes the matching page.tsx's output in place of {children}.


export default function AggregatesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ height: "100vh", overflow: "hidden", position: "relative", padding: "2.5rem 0.5rem 0.5rem 0.5rem" }}>
      <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10, display: "flex", gap: "0.5rem" }}>
        <button className="tab-button" onClick={() => router.push("/")}>
          ⌂ Home
        </button>
        <button className="tab-button" onClick={() => router.push("/aggregates")}>
          ↑ Aggregates
        </button>

      </div>
      <div style={{ overflow: "auto", height: "100%" }}>{children}</div>
    </div>
  );
}