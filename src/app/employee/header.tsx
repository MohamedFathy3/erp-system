'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleProfile = () => {
    router.push('/profile')
  }

  const handleDashboard = () => {
    router.push('/employee')
  }

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto py-4 flex items-center justify-between">
        {/* Dashboard button on the left */}
        <button
          onClick={handleDashboard}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition"
        >
          Employee Dashboard
        </button>
        {/* User info & avatar on the right */}
        <div className="flex items-center gap-3 relative group">
          <span className="text-lg font-semibold">{user?.name}</span>
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="avatar"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500"
          />
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-12 min-w-[140px] bg-white text-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-auto z-10">
            <button
              className="block w-full px-4 py-2 text-left hover:bg-indigo-100"
              onClick={handleProfile}
            >
              Profile
            </button>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-indigo-100"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}