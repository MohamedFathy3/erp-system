import Image from 'next/image'
import { User, ActiveTab } from '@/types/infoprofile'

interface ProfileSidebarProps {
  user: User
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

export default function ProfileSidebar({ user, activeTab, onTabChange }: ProfileSidebarProps) {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="relative group w-24 h-24">
            <Image
              src={user?.avatar || '/default-avatar.png'}
              width={96}
              height={96}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover"
            />
          </div>

          <h2 className="text-xl font-bold mt-4">{user?.name || 'User'}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <p className="text-sm text-gray-400 mt-1 capitalize">
            {user?.role === 'admin' ? 'Administrator' : 'Help Desk'}
          </p>
          
          <div className="w-full mt-6 space-y-4">
            <button
              onClick={() => onTabChange('profile')}
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fas fa-user-circle mr-2"></i>
              Profile
            </button>
            
            <button
              onClick={() => onTabChange('device')}
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'device' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fas fa-laptop mr-2"></i>
              Device Information
            </button>
            
            <button
              onClick={() => onTabChange('tickets')}
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'tickets' 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <i className="fas fa-ticket-alt mr-2"></i>
              Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}