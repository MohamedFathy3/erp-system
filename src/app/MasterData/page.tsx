'use client';

import MainLayout from '@/components/MainLayout'
import '@/styles/globals.css'
import Cards from '@/components/dashboard/SmalCard';
import MasterDataPage from '@/components/dashboard/catagrycard';






export default function ITModulePage() {

  return (
    <MainLayout>
      <div className="w-full h-300  p-6 bg-white dark:from-gray-900 dark:to-gray-800">
         <Cards />

         <MasterDataPage />

      </div>
    </MainLayout>
  )
}

