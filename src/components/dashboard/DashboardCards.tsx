'use client'

import { useEffect, useState } from 'react'
import { fetchDashboardStats } from '@/services/dashboardService'
import { 
  UsersIcon, 
  BugAntIcon, 
  ComputerDesktopIcon, 
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const StatCard = ({ title, value, icon: Icon, secondaryValues }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
    <div className="flex flex-wrap gap-2 text-xs">
      {secondaryValues.map((item: any, i: number) => (
        <span key={i} className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-current mr-1 opacity-70"></span>
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  </div>
)

export default function DashboardCards() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => {
        setError('خطأ في تحميل البيانات')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 h-28 animate-pulse"></div>
      ))}
    </div>
  )

  if (error || !data) return (
    <div className="text-red-500 dark:text-red-400 text-sm p-2">{error}</div>
  )

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard 
        title="الموظفين" 
        value={data.employees.total} 
        icon={UsersIcon}
        secondaryValues={[
          {label: 'نشط', value: data.employees.active},
          {label: 'غير نشط', value: data.employees.inactive}
        ]}
      />
      
      <StatCard 
        title="المشكلات" 
        value={data.issues.total} 
        icon={BugAntIcon}
        secondaryValues={[
          {label: 'مفتوحة', value: data.issues.open},
          {label: 'مغلقة', value: data.issues.closed}
        ]}
      />
      
      <StatCard 
        title="الأجهزة" 
        value={data.devices.total} 
        icon={ComputerDesktopIcon}
        secondaryValues={[
          {label: 'معينة', value: data.devices.assigned},
          {label: 'غير معينة', value: data.devices.unassigned}
        ]}
      />
      
      <StatCard 
        title="الشركات" 
        value={data.companies.total} 
        icon={BuildingOfficeIcon}
        secondaryValues={[
          {label: 'نشطة', value: data.companies.active},
          {label: 'غير نشطة', value: data.companies.inactive}
        ]}
      />
    </div>
  )
}
