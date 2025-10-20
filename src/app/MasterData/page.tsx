'use client';

import MainLayout from '@/components/MainLayout'
import '@/styles/globals.css'
import Cards from '@/components/dashboard/SmalCard';
import MasterDataPage from '@/components/dashboard/catagrycard';

export default function ITModulePage() {
  return (
    <MainLayout>
      <div className="w-full min-h-screen p-6 top-13 bg-white relative">
        {/* Gradient Background */}
        <div className="fixed top-0 left-0 right-0 h-[70vh]
            bg-[linear-gradient(180deg,#dbeafe_0%,#c8e1fd_15%,#bdf5d0_30%,#e8fdef_45%,rgba(232,253,239,0.3)_70%,transparent_100%)]
            pointer-events-none z-0">
        </div>
        
        {/* المحتوى */}
        <div className="relative z-10 space-y-6">
          <Cards />
          <MasterDataPage />
        </div>
      </div>
    </MainLayout>
  )
} 