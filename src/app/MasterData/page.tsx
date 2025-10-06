'use client';

import MainLayout from '@/components/MainLayout'
import '@/styles/globals.css'
import Cards from '@/components/dashboard/SmalCard';
import MasterDataPage from '@/components/dashboard/catagrycard';






export default function ITModulePage() {

  return (
    <MainLayout>
      <div className="w-full h-full  p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
         <Cards />

         <MasterDataPage />

      </div>
    </MainLayout>
  )
}

