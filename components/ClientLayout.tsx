"use client";

import React from "react";
// import { useRouter, usePathname } from "next/navigation";
// import wyid_inputbox from "./wyid_inputbox";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// /** Note: Pages that accept a wyId search param. The wyid_inputbox WY_id form will route to
//  *  whichever of these pages is currently active, falling back to /cow. */
// const WY_ID_PAGES = ["/cow", "/net-revenue"] as const;

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <>
      <style>{`
        :root {
          --bg: #ffffff;
          --card-bg: #ffffff;
          --text: #000000;
          --border: #ccc;
          --danger: #d00;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #1a1a2e;
            --card-bg: #16213e;
            --text: #e0e0e0;
            --border: #444;
            --danger: #ff6b6b;
          }
        }
      `}</style>
      <div className="app-shell">
        {/* <wyid_inputbox ... /> */}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </>
  );
};
export default ClientLayout;
