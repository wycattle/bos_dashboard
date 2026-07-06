"use client";

import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="app-shell" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default ClientLayout;
