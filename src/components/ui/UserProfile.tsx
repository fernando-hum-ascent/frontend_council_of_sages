import { useState } from 'react'
import { User, Edit2, Check, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface UserProfileProps {
  compact?: boolean
  className?: string
}

export function UserProfile({
  compact = false,
  className = '',
}: UserProfileProps) {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  const handleSave = async () => {
    if (displayName.trim() && displayName !== user?.displayName) {
      try {
        await updateProfile({ displayName: displayName.trim() })
      } catch (error) {
        console.error('Failed to update profile:', error)
      }
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDisplayName(user?.displayName || '')
    setIsEditing(false)
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-4 w-4 text-gray-600" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800">
            {user?.displayName || 'User'}
          </p>
          <p className="truncate text-xs text-gray-600">{user?.email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Profile Picture */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-20 w-20 rounded-full"
              />
            ) : (
              <User className="h-8 w-8 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-3">
        {/* Display Name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Display Name
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter display name"
              />
              <button
                onClick={handleSave}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-400 text-white hover:bg-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">
                {user?.displayName || 'Not set'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:text-gray-800"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Email
          </label>
          <span className="text-sm text-gray-800">{user?.email}</span>
        </div>

        {/* Email Verification Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Email Status
          </label>
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              user?.emailVerified
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {user?.emailVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>
    </div>
  )
}
