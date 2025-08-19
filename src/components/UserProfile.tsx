'use client'

import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center space-x-4">
        <a
          href="/auth/signin"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          เข้าสู่ระบบ
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600 font-medium">
              {session?.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {session?.user?.name || 'ผู้ใช้'}
        </span>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        ออกจากระบบ
      </button>
    </div>
  )
} 