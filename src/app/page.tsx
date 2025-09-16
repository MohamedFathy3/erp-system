"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // لو مش مسجل دخول، يحوّل لصفحة تسجيل الدخول
    }
  }, [loading, user, router]);

if (loading || !user) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-gray-700">Checking your login status...</p>
    </div>
  );
}

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Hello {user.name}</h1>
        {/* باقي المحتوى */}
      </div>
    </MainLayout>
  );
}
