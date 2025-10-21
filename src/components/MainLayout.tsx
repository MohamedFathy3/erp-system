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

  // بيانات الشركة - يمكن جلبها من environment variables أو config
  const companyInfo = {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Pyramids Freight Services",
    website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || "wsa-elite.com/",
    year: new Date().getFullYear()
  };

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden relative">
        {/* Gradient Background - التدرج من تحت ال header للأسفل */}
        <div 
          className="fixed top-16 bottom-0 left-0 right-0 z-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(59, 130, 246, 0.1) 0%, 
                rgba(59, 130, 246, 0.05) 20%,
                rgba(34, 197, 94, 0.03) 40%,
                rgba(255, 255, 255, 0) 80%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Left Blue Gradient Border - من تحت ال header للأسفل */}
        <div 
          className="fixed left-0 top-16 bottom-0 w-1 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, #3b82f6, #10b981, transparent)",
          }}
        />

        {/* Right Green Gradient Border - من تحت ال header للأسفل */}
        <div 
          className="fixed right-0 top-16 bottom-0 w-1 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, #10b981, #3b82f6, transparent)",
          }}
        />

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(true)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col relative z-1">
          {/* Navbar */}
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          {/* Page content (scrollable area) */}
          <div className="flex-1 flex flex-col overflow-hidden">
         <main className="relative flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900 transition-all duration-500">
  {/* الخلفية التدريجية داخل الصفحة (تغطي 60%) */}
  <div
    className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-0"
    style={{
      background: `
        linear-gradient(180deg,
          #dbeafe 0%,      /* أزرق فاتح */
          #c8e1fd 15%,     /* أزرق أفتح */
          #bdf5d0 35%,     /* أخضر فاتح */
          #e8fdef 55%,     /* أبيض مخضر */
          #ffffff 100%     /* أبيض خالص */
        )
      `,
    }}
  ></div>

  {/* المحتوى فوق الخلفية */}
  <div className="relative z-10">
    <Breadcrumb />
    <div className="mt-4">{children}</div>
  </div>
</main>



            {/* Footer */}
            <div className="relative">
              {/* Footer Top Gradient Line */}
              <div 
                className="h-1 w-full"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #10b981, #3b82f6)",
                }}
              />
              
              <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 py-4 px-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                  {/* Company Name */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    © {companyInfo.year} {companyInfo.name}. All rights reserved.
                  </div>
                  
                  {/* Copyright and Links */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Powered by {companyInfo.name}</span>
                    <span className="hidden md:inline">•</span>
                    <a 
                      href={`https://${companyInfo.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {companyInfo.website}
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}