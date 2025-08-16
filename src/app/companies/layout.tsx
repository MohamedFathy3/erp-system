// app/layout.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // لازم تستخدم useState عشان تمنع إعادة إنشاء queryClient كل مرة
  const [queryClient] = useState(() => new QueryClient());

  return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
  );
}
