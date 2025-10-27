
import MainLayout from '@/components/MainLayout'
import '@/styles/globals.css'
import Cards from '@/components/dashboard/SmalCard';
import MasterDataPage from '@/components/dashboard/catagrycard';

export default function ITModulePage() {
  return (
    <MainLayout>
      <div className="w-full min-h-screen p-6 top-13  relative">
        {/* Gradient Background */}
      
        
        {/* المحتوى */}
        <div className="relative z-10 space-y-6">
          <Cards />
          <MasterDataPage />
        </div>
      </div>
    </MainLayout>
  )
} 