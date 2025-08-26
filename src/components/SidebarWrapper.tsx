"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed,] = useState(true);

  // const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(true)}
      />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </>
  );
}
