'use client'

import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  )
}
