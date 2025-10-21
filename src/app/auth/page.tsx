'use client'

import React, { Suspense } from 'react'
import AuthPage from '@/components/Auth'

export default function AuthWrapper() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <AuthPage />
    </Suspense>
  )
}
