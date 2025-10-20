'use client'

import { 
  Home, Database,
  ChevronDown, ChevronRight, LucideIcon, ComputerIcon,
  User as UserIcon,Gauge
} from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { useState } from 'react'
import '../styles/globals.css'

type ChildItem = {
  name: string
  href: string
  icon: LucideIcon
}

type NavItem = {
  name: string
  href?: string
  icon: LucideIcon
  children?: ChildItem[]
  roles?: string[]
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: Home, href: '/' ,roles: ['admin','help_desk']  },
  { name: 'Analytics_IT', icon: Gauge, href: '/Analytics', roles: ['admin'] },
  { name: 'MasterData', icon: Database, href: '/MasterData', roles: ['admin','help_desk'] },
  { name: 'IT Module', icon: ComputerIcon, href: '/It_module',roles: ['admin','help_desk']  },
  { name: 'Profile', icon: UserIcon, href: '/Profile', roles: ['admin','help_desk']  },
  { name: 'employee', icon: UserIcon, href: '/employee', roles: ['employee']  },
  { name: 'tickets', icon: ComputerIcon, href: '/employee/tickets', roles: ['employee']  },
  { name: 'Profile', icon: UserIcon, href: '/Profile', roles: ['employee']  },

]

export default function Sidebar({
  open,
  collapsed,
  onClose,
}: {
  open: boolean
  collapsed: boolean
  onClose: () => void
}) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const roles = user ? (Array.isArray(user.role) ? user.role : [user.role]) : []

  const filteredNavItems = navItems.filter(item => {
    if (item.roles) {
      return item.roles.some(role => roles.includes(role))
    }
    return true
  })

  function toggleDropdown(name: string) {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r dark:border-gray-700',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-60',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-auto'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed ? (
              <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-opacity duration-300">
                ERP System
              </h2>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                E
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                const isOpen = openDropdown === item.name

                if (item.children) {
                  return (
                    <li key={item.name}>
                      <div
                        className={cn(
                          'flex items-center justify-between rounded-lg text-sm font-medium transition-colors',
                          collapsed && 'justify-center',
                          isActive
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        {/* اللينك الرئيسي */}
                        <Link
                          href={item.href!}
                          className="flex items-center gap-3 px-3 py-2 flex-1"
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span
                            className={cn(
                              'transition-opacity duration-300',
                              collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                            )}
                          >
                            {item.name}
                          </span>
                        </Link>

                        {/* زرار التوسيع */}
                        {!collapsed && (
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className="p-2"
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Submenu */}
                      {isOpen && !collapsed && (
                        <ul className="ml-10 mt-1 space-y-1">
                          {item.children!.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={cn(
                                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                                  pathname === child.href
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                              >
                                <child.icon className="h-4 w-4 shrink-0" />
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                }

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href!}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        collapsed && 'justify-center',
                        isActive
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span
                        className={cn(
                          'transition-opacity duration-300',
                          collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
