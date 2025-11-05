'use client'

import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { User } from '@/types/infoprofile'

interface AvatarUploadProps {
  user: User
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const { updateUser } = useAuth()

  // const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file && user?.id) {
  //     const formData = new FormData()
  //     formData.append("avatar", file)

  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`, {
  //         method: "PATCH",
  //         body: formData,
  //       })

  //       const text = await response.text()
        
  //       try {
  //         const data = JSON.parse(text)
  //         if (response.ok) {
  //           toast.success("✅ Successfully updated avatar")
  //           if (updateUser) {
  //             updateUser({ ...user, avatar: URL.createObjectURL(file) })
  //           }
  //         } else {
  //           toast.error(data.message || "❌ Failed to upload image")
  //         }
  //       } catch (error) {
  //         toast.error("⚠️ Error processing response")
  //       }
  //     } catch (error) {
  //       toast.error("⚠️ Network error occurred")
  //     }
  //   }
  // }

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative group">
        <Image
          src={user?.avatar || '/default-avatar.png'}
          width={80}
          height={80}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover"
        />
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
                     rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="text-white text-sm font-medium">Change</span>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          // onChange={handleAvatarUpload}
        />
      </div>
      <div>
        <h3 className="font-semibold">Profile Picture</h3>
        <p className="text-sm text-gray-500">Click on the image to change</p>
      </div>
    </div>
  )
}