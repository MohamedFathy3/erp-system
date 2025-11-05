'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api'
import toast from 'react-hot-toast'
import AvatarUpload from './AvatarUpload'
import { User, FormData } from '@/types/infoprofile'

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { updateUser } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    phoneExt: user.phoneExt || '',
    cell: user.cell || '',
  })
  const [saving, setSaving] = useState(false)

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
       
      } else {
        toast.error(`Failed to update ${user.name}'s data`)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Failed to update data: ${err.message}`)
      } else {
        toast.error('Failed to update data: An unknown error occurred')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
      
      <AvatarUpload user={user} />
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
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
              Email Address
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
              Phone Number
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
              Phone Extension
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
              Mobile Number
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
              Address
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
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}