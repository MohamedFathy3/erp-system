'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import MainLayout from '@/components/MainLayout'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  phoneExt:string
  cell:string
  
}



// ticket.ts
export interface Ticket {
  id: number
  createdAt: string
  title: string
  status: 'open' | 'pending' | 'postponed' | 'closed'
  priority: 'High' | 'Medium' | 'Low'
  dailyStatus?: boolean
  category: {
    name: string
  }
}

interface StorageInfo {
  type: string
  size: string
}

interface CpuInfo {
  name: string
}

interface GpuInfo {
  model: string
}

interface MemoryInfo {
  size: string
}

interface DeviceInfo {
  type?: string
  serialNumber?: string
  memory?: MemoryInfo
  cpu?: CpuInfo
  storages?: StorageInfo[]
  gpu?: GpuInfo
  active?: boolean
  purchaseDate?: string
  warrantyExpireDate?: string
}



type ActiveTab = 'profile' | 'device' | 'tickets'

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    phoneExt:'',
    cell:'',
  })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        phoneExt: user.phoneExt || '',
        cell: user.cell || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSaving(true)

  if (!user?.id) {
    toast.error('User ID is missing')
    setSaving(false)
    return
  }

  try {
    const response = await apiFetch(`/user/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.status) {
      toast.success(`Successfully updated ${user.name}'s data`)

      // Update user data in context
      if (updateUser) {
        updateUser({ ...user, ...formData })
      }
    } else {
      toast.error(`Failed to update ${user.name}'s data`)
    }
  } catch (err: unknown) {
    // Check if the error is an instance of Error
    if (err instanceof Error) {
      toast.error(`Failed to update data: ${err.message}`)
    } else {
      toast.error('Failed to update data: An unknown error occurred')
    }
  } finally {
    setSaving(false)
  }
}





  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">يجب تسجيل الدخول لعرض الملف الشخصي</p>
        </div>
      </MainLayout>
    )
  }

  // const userTickets = user.tickets || []
  
const deviceInfo: DeviceInfo | null = user.latestDevice || null

// const overdueTickets: Ticket[] = userTickets.filter(ticket => 
//   ticket.status === 'postponed' || ticket.dailyStatus === false || ticket.dailyStatus === undefined
// )

// const assignedTickets: Ticket[] = userTickets.filter(ticket => 
//   ticket.status === 'open' || ticket.status === 'pending'
// )



  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* الشريط الجانبي */}
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

  {/* الزرار اللي بيظهر فوق الصورة عند hover */}
  <label
    htmlFor="avatar-upload"
    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
               rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
  >
    <span className="text-white text-sm font-medium">تغيير</span>
  </label>

  {/* input مخفي لرفع الصورة */}
<input
  id="avatar-upload"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={async (e) => {
    const file = e.target.files?.[0]
    if (file && user?.id) {
      const formData = new FormData()
      formData.append("avatar", file)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`, {
          method: "PATCH", 
          body: formData,
        })

        const text = await response.text()
        console.log(text)

        try {
          const data = JSON.parse(text)
          if (response.ok) {
            toast.success("✅ Successfully updated the avatar")
            if (updateUser) {
              updateUser({ ...user, avatar: URL.createObjectURL(file) })
            }
          } else {
            toast.error(data.message || "❌ Failed to upload the image")
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(`⚠️ Error: ${error.message}`)
          } else {
            toast.error("⚠️ Unexpected error occurred")
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(`⚠️ Error: ${error.message}`)
        } else {
          toast.error("⚠️ Unexpected error occurred")
        }
      }
    }
  }}
/>

</div>

                <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {user?.role === 'admin' ?  'user' : 'help_desk'}
                </p>
                
                <div className="w-full mt-6 space-y-4">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-right py-2 px-4 rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-user-circle ml-2"></i>
                    الملف الشخصي
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('device')}
                    className={`w-full text-right py-2 px-4 rounded-lg transition-colors ${
                      activeTab === 'device' 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-laptop ml-2"></i>
                    معلومات الجهاز
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className={`w-full text-right py-2 px-4 rounded-lg transition-colors ${
                      activeTab === 'tickets' 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-ticket-alt ml-2"></i>
                    التذاكر
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6"> profile</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                     Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                   Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        disabled
                        value={formData.email}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Phone Ext.
                      </label>
                      <input
                        type="text"
                        name="phoneExt"
                        value={formData.phoneExt}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        cell
                      </label>
                      <input
                        type="text"
                        name="cell"
                        value={formData.cell}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors ${
                      saving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'device' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6"> Device information</h1>
                
                {deviceInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">type</h3>
                        <p className="text-lg">{deviceInfo.type || 'invalid date'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400"> serialNumber</h3>
                        <p className="text-lg font-mono">{deviceInfo.serialNumber || 'invalid date '}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400"> memory</h3>
                        <p className="text-lg">{deviceInfo.memory?.size || 'invalid date'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">processor</h3>
                        <p className="text-lg">{deviceInfo.cpu?.name || 'invalid date'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
  <div>
  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</h3>
  <div className="text-lg">
    {deviceInfo.storages && deviceInfo.storages.length > 0 ? (
     deviceInfo.storages.map((storage: StorageInfo, index: number) => (
  <p key={index}>{storage.type} && {storage.size}</p>
))

    ) : (
      <p>invalid data</p>
    )}
  </div>
</div>


                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400"> Graphic Card</h3>
                        <p className="text-lg">{deviceInfo.gpu?.model || ' invalid date'}</p>
                      </div>
                      
                    <div>
  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">status</h3>
  <p className={`text-lg font-semibold ${
    deviceInfo.active ? 'text-green-600' : 'text-gray-500'
  }`}>
    {deviceInfo.active ? 'active' : 'inactive '}
  </p>
</div>

                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">warrantyExpireDate</h3>
                        <p className="text-lg">{deviceInfo.warrantyExpireDate || ' invalid date'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <i className="fas fa-laptop text-4xl text-gray-400 mb-3"></i>
                    <p className="text-gray-500">no Device information</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                {/* التذاكر المتأخرة */}
                {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">المهام المتأخرة</h2>
                    <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                      عرض الكل
                    </button>
                  </div>
                  
                  {overdueTickets.length > 0 ? (
                    <div className="space-y-4">
                      {overdueTickets.map(ticket => (
                        <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{ticket.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{ticket.category.name}</p>
                          <p className="text-xs text-gray-400 mt-2">تم الإنشاء: {ticket.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <i className="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
                      <p className="text-gray-500">لا توجد مهام متأخرة</p>
                    </div>
                  )}
                </div> */}

                {/* التذاكر المعينة */}
                {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">المهام المعينة</h2>
                    <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                      عرض الكل
                    </button>
                  </div> */}
                  
                  {/* {assignedTickets.length > 0 ? (
                    <div className="space-y-4">
                      {assignedTickets.map(ticket => (
                        <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{ticket.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                              ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{ticket.category.name}</p>
                          <p className="text-xs text-gray-400 mt-2">تم الإنشاء: {ticket.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <i className="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
                      <p className="text-gray-500">لا توجد مهام معينة</p>
                    </div> */}
                  {/* )} */}
                {/* </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}