'use client'

import { useState , } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './ErrorBoundary' 
import '@/styles/globals.css'
import MainLayout from '@/components/MainLayout'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MainLayout>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ErrorBoundary>

              {children}
                            </ErrorBoundary>

                    <Toaster position="top-right" reverseOrder={false} />

            </ThemeProvider>
            </MainLayout>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
  )
}
  