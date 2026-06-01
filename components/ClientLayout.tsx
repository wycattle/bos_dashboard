"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

/** Pages that accept a wyId search param. The sidebar WY_id form will route to
 *  whichever of these pages is currently active, falling back to /cow. */
const WY_ID_PAGES = ["/cow", "/net-revenue"] as const;

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleWYIdSubmit = (wyId: string) => {
    const activePage = WY_ID_PAGES.find((p) => pathname.startsWith(p)) ?? "/cow";
    router.push(`${activePage}?wyId=${encodeURIComponent(wyId)}`);
  };

  return (
    <div className="app-shell">
      <Sidebar onWYIdSubmit={handleWYIdSubmit} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default ClientLayout;
