"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import Breadcrumb from "./Breadcrumb";
import { AuthProvider } from "../contexts/AuthContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <AuthProvider>

    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(true)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Page content (scrollable area) */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
           <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
    </AuthProvider>

  );
}
