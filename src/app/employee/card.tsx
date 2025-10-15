'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmployeePage() {
  const { user } = useAuth()
  const [activeCard] = useState(null)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-8 transition-colors duration-300">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg mb-2 transition-colors duration-300">
          Employee Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
          Welcome back, {user?.name ?? 'Employee'}
        </p>
        <div className="mt-4 bg-blue-100 dark:bg-indigo-800/30 rounded-full px-4 py-2 inline-block transition-colors duration-300">
          <p className="text-blue-800 dark:text-indigo-200 text-sm transition-colors duration-300">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-6xl">
        <div className="bg-white dark:bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 dark:border-indigo-700/50 shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600 dark:text-white mb-2 transition-colors duration-300">12</div>
          <p className="text-gray-600 dark:text-indigo-200 transition-colors duration-300">Pending Tasks</p>
        </div>
        <div className="bg-white dark:bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 dark:border-indigo-700/50 shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600 dark:text-white mb-2 transition-colors duration-300">7</div>
          <p className="text-gray-600 dark:text-indigo-200 transition-colors duration-300">New Tickets</p>
        </div>
        <div className="bg-white dark:bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200 dark:border-indigo-700/50 shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-blue-600 dark:text-white mb-2 transition-colors duration-300">3</div>
          <p className="text-gray-600 dark:text-indigo-200 transition-colors duration-300">Urgent Issues</p>
        </div>
      </div>

      {/* Main Cards Section */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-6xl">
        {/* Operation Card */}
        <div 
          className={`flex-1 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-indigo-500 dark:via-purple-500 dark:to-indigo-700 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-w-[280px] max-w-[400px] cursor-pointer hover:-translate-y-2 ${activeCard === 'operation' ? 'ring-4 ring-blue-300 dark:ring-white/50' : ''}`}
        >
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <span className="text-5xl">⚙️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Operations</h3>
          <p className="text-blue-100 dark:text-indigo-100 text-center text-base mb-6">
            Manage your operations and tasks with ease.
          </p>
          <button
            className="bg-white text-blue-700 dark:text-indigo-700 font-semibold px-6 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-indigo-100 transition-all duration-300"
            onClick={() => router.push('/employee/operations')}
          >
            Access Operations
          </button>
        </div>

        {/* Support Tickets Card */}
        <div 
          className={`flex-1 bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 dark:from-pink-500 dark:via-red-400 dark:to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-w-[280px] max-w-[400px] cursor-pointer hover:-translate-y-2 ${activeCard === 'support' ? 'ring-4 ring-orange-300 dark:ring-white/50' : ''}`}
        >
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <span className="text-5xl">🎫</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Support Tickets</h3>
          <p className="text-orange-100 dark:text-pink-100 text-center text-base mb-6">
            Track and respond to support tickets efficiently.
          </p>
          <button
            className="bg-white text-orange-700 dark:text-purple-700 font-semibold px-6 py-2 rounded-full hover:bg-orange-50 dark:hover:bg-pink-100 transition-all duration-300"
            onClick={() => router.push('/employee/tickets')}
          >
            View Tickets
          </button>
        </div>

        {/* Settings Card */}
        <div 
          className={`flex-1 bg-gradient-to-br from-green-400 via-teal-400 to-cyan-500 dark:from-green-500 dark:via-teal-400 dark:to-blue-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-w-[280px] max-w-[400px] cursor-pointer hover:-translate-y-2 ${activeCard === 'settings' ? 'ring-4 ring-green-300 dark:ring-white/50' : ''}`}
        >
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <span className="text-5xl">🔧</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Settings</h3>
          <p className="text-green-100 dark:text-green-100 text-center text-base mb-6">
            Customize your personal preferences.
          </p>
          <button
            className="bg-white text-green-700 dark:text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-green-50 dark:hover:bg-teal-100 transition-all duration-300"
            onClick={() => router.push('/employee/settings')}
          >
            Open Settings
          </button>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-12 bg-white dark:bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 w-full max-w-4xl border border-gray-200 dark:border-indigo-700/50 shadow-lg transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center transition-colors duration-300">
          Quick Actions
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => router.push('/employee/issue')}
          >
            New Issue
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => router.push('/employee/report-issue')}
          >
            Report Issue
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => router.push('/employee/request-time-off')}
          >
            Request Time Off
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => router.push('/employee/schedule')}
          >
            View Schedule
          </button>
        </div>
      </div>
    </div>
  )
}