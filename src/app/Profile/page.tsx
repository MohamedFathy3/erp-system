'use client'


import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import MainLayout from '@/components/MainLayout'
import ProfileSidebar from '@/components/Profil/ProfileSidebar'
import ProfileForm from '@/components/Profil/ProfileForm'
import DeviceInfo from '@/components/Profil/DeviceInfo'
import TicketsSection from '@/components/Profil/TicketsSection'
import { ActiveTab, User, Ticket as ProfileTicket, createProfileUser } from '@/types/infoprofile'

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')

  if (!authUser) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Please log in to view your profile</p>
        </div>
      </MainLayout>
    )
  }

  // Convert AuthUser to User type for profile components
  const user: User = createProfileUser(authUser)

  // Convert tickets to the correct type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userTickets: ProfileTicket[] = (user.tickets || []).map((ticket: any) => ({
    id: ticket.id,
    createdAt: ticket.createdAt || ticket.created_at,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    dailyStatus: ticket.dailyStatus,
    category: {
      name: ticket.category?.name || 'Uncategorized'
    }
  }))

  const overdueTickets: ProfileTicket[] = userTickets.filter(ticket => 
    ticket.status === 'postponed' || ticket.dailyStatus === false || ticket.dailyStatus === undefined
  )

  const assignedTickets: ProfileTicket[] = userTickets.filter(ticket => 
    ticket.status === 'open' || ticket.status === 'pending'
  )

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar 
            user={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="w-full md:w-2/3 lg:w-3/4">
            {activeTab === 'profile' && <ProfileForm user={user} />}
            {/* {activeTab === 'device' && <DeviceInfo deviceInfo={user.latestDevice || null} />} */}
            {activeTab === 'tickets' && (
              <TicketsSection 
                overdueTickets={overdueTickets}
                assignedTickets={assignedTickets}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}