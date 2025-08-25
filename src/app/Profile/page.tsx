'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import MainLayout from '@/components/MainLayout'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      await apiFetch('/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setMessage('✅ Profile updated successfully!')
    } catch (err) {
      setError('❌ Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

        <div className="flex justify-center mb-6">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {message && <p className="text-center mt-4 text-sm text-green-500">{message}</p>}
          {error && <p className="text-center mt-4 text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </MainLayout>
  )
}
