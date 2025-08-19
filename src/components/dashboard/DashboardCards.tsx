'use client'

import { useEffect, useState } from 'react'
import { fetchDashboardStats } from '@/services/dashboardService'
import {
  UsersIcon,
  BugAntIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

type SecondaryValue = {
  label: string
  value: number
}

type StatCardProps = {
  title: string
  value: number
  icon: React.ElementType
  secondaryValues: SecondaryValue[]
}

const StatCard = ({ title, value, icon: Icon, secondaryValues }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
      {secondaryValues.map(({ label, value }, i) => (
        <span key={i} className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-current mr-1 opacity-70"></span>
          {label}: {value}
        </span>
      ))}
    </div>
  </div>
)

export default function DashboardCards() {
  const [statsData, setStatsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => {
        setStatsData(res)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load data')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 h-28 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error || !statsData) {
    return <div className="text-red-500 dark:text-red-400 text-sm p-2">{error}</div>
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        title="Employees"
        value={statsData.employees?.total || 0}
        icon={UsersIcon}
        secondaryValues={[
          { label: 'Active', value: statsData.employees?.active || 0 },
          { label: 'Inactive', value: statsData.employees?.inactive || 0 }
        ]}
      />

      <StatCard
        title="Issues"
        value={statsData.issues?.total || 0}
        icon={BugAntIcon}
        secondaryValues={[
          { label: 'Open', value: statsData.issues?.open || 0 },
          { label: 'Closed', value: statsData.issues?.closed || 0 }
        ]}
      />

      <StatCard
        title="Devices"
        value={statsData.devices?.total || 0}
        icon={ComputerDesktopIcon}
        secondaryValues={[
          { label: 'Assigned', value: statsData.devices?.assigned || 0 },
          { label: 'Unassigned', value: statsData.devices?.unassigned || 0 }
        ]}
      />

      <StatCard
        title="Companies"
        value={statsData.companies?.total || 0}
        icon={BuildingOfficeIcon}
        secondaryValues={[
          { label: 'Active', value: statsData.companies?.active || 0 },
          { label: 'Inactive', value: statsData.companies?.inactive || 0 }
        ]}
      />
    </div>
  )
}
