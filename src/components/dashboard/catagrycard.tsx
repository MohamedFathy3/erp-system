import {
  Landmark,
  Layers,
  Users,
  Briefcase,
  Wallet,
  Clock,
  LineChart,
  Archive,
  Megaphone,
  Cpu,
  HardDrive,
  MonitorSmartphone,
  Laptop2,
  ShieldCheck,
  Settings,
  UserCog,
  BookText,
  Tag,
Globe,
DollarSign,
Warehouse,
} from 'lucide-react';
import Link from 'next/link'

import { useState } from 'react'

const managementCards = [
  {
    id: 'issue-categories',
    title: 'Issue Categories',
    description: 'Manage issue categories settings.',
    icon: Tag,
    category: 'Settings',
  },
  {
    id: 'employee',
    title: 'Employee',
    description: 'Manage employee settings.',
    icon: Users,
    category: 'HR',
  },
  {
    id: 'campaign',
    title: 'Campaign',
    description: 'Manage campaign settings.',
    icon: Megaphone,
    category: 'HR',
  },
  {
    id: 'ticket-eta',
    title: 'Ticket ETA',
    description: 'Manage ticket ETA settings.',
    icon: Clock,
    category: 'Settings',
  },
  {
    id: 'device-status',
    title: 'Device Status',
    description: 'Manage device status settings.',
    icon: ShieldCheck,
    category: 'Settings',
  },
  {
    id: 'positions',
    title: 'Positions',
    description: 'Manage positions settings.',
    icon: Briefcase,
    category: 'HR',
  },
  {
    id: 'it-device-model',
    title: 'IT Device Model',
    description: 'Manage IT device model settings.',
    icon: Laptop2,
    category: 'Settings',
  },
  {
    id: 'payroll',
    title: 'Payroll',
    description: 'Manage payroll settings.',
    icon: Wallet,
    category: 'Finance',
  },
  {
    id: 'storage-drivers',
    title: 'Storage Drivers',
    description: 'Manage storage drivers settings.',
    icon: HardDrive,
    category: 'Settings',
  },
  {
    id: 'it-brands',
    title: 'IT Brands',
    description: 'Manage IT brands settings.',
    icon: Landmark,
    category: 'Settings',
  },
  {
    id: 'device-type',
    title: 'Device Type',
    description: 'Manage device type settings.',
    icon: MonitorSmartphone,
    category: 'Settings',
  },
  {
    id: 'processors',
    title: 'Processors',
    description: 'Manage processors settings.',
    icon: Cpu,
    category: 'Settings',
  },
  {
    id: 'training-and-development',
    title: 'Training and Development',
    description: 'Manage training and development settings.',
    icon: BookText,
    category: 'Settings',
  },
  {
    id: 'performance-appraisals',
    title: 'Performance Appraisals',
    description: 'Manage performance appraisals settings.',
    icon: LineChart,
    category: 'Settings',
  },
  {
    id: 'ram',
    title: 'RAM',
    description: 'Manage RAM settings.',
    icon: LineChart,
    category: 'Settings',
  },
  {
    id: 'hr-partners',
    title: 'HR Partners',
    description: 'Manage HR partners settings.',
    icon: UserCog,
    category: 'HR',
  },
  {
    id: 'graphic-cards',
    title: 'Graphic Cards',
    description: 'Manage graphic cards settings.',
    icon: Layers,
    category: 'Settings',
  },
]


const filters = [
  {
    label: 'Settings',
    icon: Settings,
    count: managementCards.filter(item => item.category === 'Settings').length,
    color: 'text-blue-500',
  },
  {
    label: 'Geography',
    icon: Globe,
    count: managementCards.filter(item => item.category === 'Geography').length,
    color: 'text-green-500',
  },
  {
    label: 'Finance',
    icon: DollarSign,
    count: managementCards.filter(item => item.category === 'Finance').length,
    color: 'text-yellow-500',
  },
  {
    label: 'HR',
    icon: Users,
    count: managementCards.filter(item => item.category === 'HR').length,
    color: 'text-red-500',
  },
  {
    label: 'Third Party',
    icon: Archive,
    count: managementCards.filter(item => item.category === 'Third Party').length,
    color: 'text-purple-500',
  },
  {
    label: 'HR Partners',
    icon: Users,
    count: managementCards.filter(item => item.category === 'HR Partners').length,
    color: 'text-pink-500',
  },
  {
    label: 'Warehouse',
    icon: Warehouse,
    count: managementCards.filter(item => item.category === 'Warehouse').length,
    color: 'text-orange-500',
  },
]

export default function MasterDataPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredManagementCards = activeFilter === 'All'
    ? managementCards
    : managementCards.filter(card => card.category === activeFilter)

  return (
    <div className="mt-8">
      <div className="mt-10 flex flex-wrap justify-center items-center gap-6">
        {filters.map(({ label, icon: Icon, color }) => {
          const isActive = activeFilter === label
          return (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={`
                    group relative flex flex-col items-center justify-center w-16 h-16 rounded-full
                    transition-all duration-300 border-2
                    ${isActive
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 shadow-md'
                      : 'bg-white dark:bg-gray-800 border-gray-300 hover:border-blue-400 hover:shadow'
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-6 h-6 transition-transform duration-1000 ease-in-out
                      group-hover:rotate-[360deg]
                      ${isActive ? color : 'text-gray-500 dark:text-gray-300'}
                    `}
                  />
                  <span
                    className={`
                      absolute bottom-[-1.5rem] text-xs opacity-0 group-hover:opacity-100 transition-opacity
                      ${isActive ? 'text-black dark:text-white' : 'text-gray-400'}
                    `}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8"></div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredManagementCards.map((card, index) => {
                const Icon = card.icon
                return (
            <div
  key={index}
  className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition"
>
  <div className="absolute top-0 left-0 w-full h-3 bg-green-900 dark:bg-green-200" />

  <div className="flex items-center justify-between p-6">
    <div className="flex items-center gap-4">
      <div className="p-4 bg-blue-200 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {card.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {card.description}
        </p>
      </div>
    </div>

<Link
  href={
    card.id === 'campaign' ? '/companies' :
    card.id === 'employee' ? '/employees' :
    card.id === 'payroll' ? '/payroll' :
    `/manage/${card.id}`
  }
  className="
    flex items-center justify-center gap-1
    w-28 h-10 rounded-lg
    bg-blue-100 dark:bg-blue-900
    text-blue-600 dark:text-blue-300
    text-xs font-medium
    hover:bg-blue-200 dark:hover:bg-blue-800 
    hover:shadow-md transition-all duration-200
  "
>
  <Icon className="w-4 h-4" />
  Manage
</Link>

  </div>
</div>

              )
            })}
          </div>
        </div>
      )
}