'use client'

import { useState , } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '../contexts/AuthContext'
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './ErrorBoundary' 




export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ErrorBoundary>

              {children}
                            </ErrorBoundary>

                    <Toaster position="top-right" reverseOrder={false} />

            </ThemeProvider>
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
  