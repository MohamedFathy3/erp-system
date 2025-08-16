'use client'

import { Menu, Search, Bell, User, ChevronsLeft } from 'lucide-react'
import { Button } from './ui/button'
import { ThemeToggle } from './ThemeToggle'
import '../styles/globals.css'

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
       
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronsLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3   top-1/2   -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              style={{borderRadius: '15px'}}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 focus:outline-none   rounded-lg  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}