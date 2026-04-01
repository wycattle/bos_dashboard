"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleWYIdSubmit = (wyId: string) => {
    router.push(`/cow?wyId=${encodeURIComponent(wyId)}`);
  };

  return (
    <div className="app-shell">
      <Sidebar onWYIdSubmit={handleWYIdSubmit} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default ClientLayout;
