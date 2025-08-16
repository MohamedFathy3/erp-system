'use client'

import MainLayout from '@/components/MainLayout'
import '@/styles/globals.css'
import { useState } from 'react'
import Link from 'next/link'
import {
  Tag,              // Issue Categories
  Clock,            // Ticket ETA
  MonitorSmartphone, // Device Type
  Laptop2    ,
   Building2,
  Landmark,
  Users,
  Briefcase,
  Layers,
  Wallet,
  
  CalendarCheck2,
  CalendarX2,
  FileText,
  GraduationCap,
  LineChart,     
  Circle, CheckCircle, Archive, Trash2 
} from 'lucide-react'


export default function MasterDataPage() {
const cards = [
  {
    title: 'Issue Categories',
    value: '1,204',
    description: '+12% عن الشهر الماضي',
    icon: Tag, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    href: '/issue-categories',
  },
  {
    title: 'Ticket ETA',
    value: '37',
    description: 'متوسط زمن التذكرة',
    icon: Clock, 
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    href: '/ticket-eta',
  },
  {
    title: 'Device Type',
    value: '198',
    description: 'أنواع الأجهزة',
    icon: MonitorSmartphone,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    href: '/device-type',
  },
  {
    title: 'IT Device Model',
    value: '12',
    description: 'موديلات الأجهزة',
    icon: Laptop2,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    href: '/device-model',
  },
]


const managementCards = [
  {
    id: 'organizations',
    title: 'Organizations',
    description: 'Manage organizations settings.',
    icon: Building2,
  },
  {
    id: 'companies',
    title: 'Companies',
    description: 'Manage companies settings.',
    icon: Landmark,
  },
  {
    id: 'branches',
    title: 'Branches',
    description: 'Manage branches settings.',
    icon: Layers,
  },
  {
    id: 'employees',
    title: 'Employees',
    description: 'Manage employees settings.',
    icon: Users,
  },
  {
    id: 'positions',
    title: 'Positions',
    description: 'Manage positions settings.',
    icon: Briefcase,
  },
  {
    id: 'departments',
    title: 'Departments',
    description: 'Manage departments settings.',
    icon: Layers,
  },
  {
    id: 'payroll',
    title: 'Payroll',
    description: 'Manage payroll settings.',
    icon: Wallet,
  },
  {
    id: 'attendants-time',
    title: 'Attendants Time',
    description: 'Manage attendants time settings.',
    icon: Clock,
  },
  {
    id: 'leave',
    title: 'Leave',
    description: 'Manage leave settings.',
    icon: CalendarX2,
  },
  {
    id: 'absence-type',
    title: 'Absence Type',
    description: 'Manage absence type settings.',
    icon: CalendarCheck2,
  },
  {
    id: 'document-management',
    title: 'Document Management',
    description: 'Manage document management settings.',
    icon: FileText,
  },
  {
    id: 'training-and-development',
    title: 'Training and Development',
    description: 'Manage training and development settings.',
    icon: GraduationCap,
  },
  {
    id: 'performance-appraisals',
    title: 'Performance Appraisals',
    description: 'Manage performance appraisals settings.',
    icon: LineChart,
  },
]
const filters = [
  { label: 'All', icon: Circle },
  { label: 'Active', icon: CheckCircle },
  { label: 'Archived', icon: Archive },
  { label: 'Deleted', icon: Trash2 },
]
  const [activeFilter, setActiveFilter] = useState('All')
  return (

    <MainLayout>
      <div className="w-full h-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                href={card.href}
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.description}</p>
                </div>
              </Link>
            )
          })}
        </div>


      <div className="mt-8">

 <div className="mt-4 grid grid-cols-4 gap-4">
      {filters.map(({ label, icon: Icon }) => {
        const isActive = activeFilter === label
        return (
          <button
            key={label}
            onClick={() => setActiveFilter(label)}
            title={label} 
            className={`
              group relative flex items-center justify-center p-3 rounded-lg transition border shadow
              ${isActive
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-400'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <Icon
              className={`
                w-6 h-6 transition-transform duration-300
                group-hover:rotate-12
                ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}
              `}
            />
          </button>
        )
      })}
    </div>

 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
  {managementCards.map((card, index) => {
    const Icon = card.icon
    return (
      <div
        key={index}
        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{card.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
          </div>
        </div>
   <Link
  href={`/manage/${card.id}`}
  className="text-sm text-blue-500 hover:underline"
>
  Manage
</Link>
      </div>
    )
  })}
</div>


</div>

      
      
      </div>
    </MainLayout>
  )
}
