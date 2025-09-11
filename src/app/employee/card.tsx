'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmployeePage() {
  const { user } = useAuth()
  const [activeCard, setActiveCard] = useState(null)
  const router = useRouter()



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex flex-col items-center justify-center px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-2">
          Employee Dashboard
        </h1>
        <p className="text-indigo-300 text-lg">
          Welcome back, {user?.name ?? 'Employee'}
        </p>
        <div className="mt-4 bg-indigo-800/30 rounded-full px-4 py-2 inline-block">
          <p className="text-indigo-200 text-sm">
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
        <div className="bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-indigo-700/50">
          <div className="text-3xl font-bold text-white mb-2">12</div>
          <p className="text-indigo-200">Pending Tasks</p>
        </div>
        <div className="bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-indigo-700/50">
          <div className="text-3xl font-bold text-white mb-2">7</div>
          <p className="text-indigo-200">New Tickets</p>
        </div>
        <div className="bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-indigo-700/50">
          <div className="text-3xl font-bold text-white mb-2">3</div>
          <p className="text-indigo-200">Urgent Issues</p>
        </div>
      </div>

      {/* Main Cards Section */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-6xl">
        {/* Operation Card */}
        <div 
          className={`flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-w-[280px] max-w-[400px] cursor-pointer hover:-translate-y-2 ${activeCard === 'operation' ? 'ring-4 ring-white/50' : ''}`}
        >
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <span className="text-5xl">⚙️</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Operations</h3>
          <p className="text-indigo-100 text-center text-base mb-6">
            Manage your operations and tasks with ease.
          </p>
          <button
            className="bg-white text-indigo-700 font-semibold px-6 py-2 rounded-full hover:bg-indigo-100 transition-colors"
            onClick={() => router.push('/employee/operations')}
          >
            Access Operations
          </button>
        </div>

        {/* Support Tickets Card */}
        <div 
          className={`flex-1 bg-gradient-to-br from-pink-500 via-red-400 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-w-[280px] max-w-[400px] cursor-pointer hover:-translate-y-2 ${activeCard === 'support' ? 'ring-4 ring-white/50' : ''}`}
        >
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <span className="text-5xl">🎫</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Support Tickets</h3>
          <p className="text-pink-100 text-center text-base mb-6">
            Track and respond to support tickets efficiently.
          </p>
          <button
            className="bg-white text-purple-700 font-semibold px-6 py-2 rounded-full hover:bg-pink-100 transition-colors"
            onClick={() => router.push('/employee/tickets')}
          >
            View Tickets
          </button>
        </div>

        {/* Settings Card */}
        <div 
          className={`flex-1 bg-gradient-to-br from-green-500 via-teal-400 to-blue-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-w-[280px] max-w-[400px] cursor-pointer hover:-translate-y-2 ${activeCard === 'settings' ? 'ring-4 ring-white/50' : ''}`}
        >
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <span className="text-5xl">🔧</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Settings</h3>
          <p className="text-green-100 text-center text-base mb-6">
            Customize your personal preferences.
          </p>
          <button
            className="bg-white text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-100 transition-colors"
            onClick={() => router.push('/employee/settings')}
          >
            Open Settings
          </button>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-12 bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 w-full max-w-4xl border border-indigo-700/50">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
            onClick={() => router.push('/employee/issue')}
          >
            New Issue
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
            onClick={() => router.push('/employee/report-issue')}
          >
            Report Issue
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
            onClick={() => router.push('/employee/request-time-off')}
          >
            Request Time Off
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
            onClick={() => router.push('/employee/schedule')}
          >
            View Schedule
          </button>
        </div>
      </div>
    </div>
  )
}