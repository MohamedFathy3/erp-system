"use client";

import MainLayout from '../components/MainLayout'

import '../styles/globals.css'

import { useAuth } from '@/contexts/AuthContext' // صحح اسم الاستيراد

export default function Home() {
  const { user } = useAuth()

  return (
    
    <MainLayout>
      
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">hello {user?.name}</h1>

          {/* <DashboardCards /> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <Suspense fallback={<ChartSkeleton />}>
            <EmployeeChart />
          </Suspense>
          
          <Suspense fallback={<ChartSkeleton />}>
            <IssuesChart />
          </Suspense>
          
          <Suspense fallback={<ChartSkeleton />}>
            <DevicesChart />
          </Suspense>
          
          <Suspense fallback={<ChartSkeleton />}>
            <CompaniesChart />
          </Suspense> */}
        </div>
      </div>

    </MainLayout>
  )
}