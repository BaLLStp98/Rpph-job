'use client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="flex items-center space-x-2">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
          RPPH Job
        </Link>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        {status === 'authenticated' && session?.user?.image ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="relative group">
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 cursor-pointer group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Profile menu"
              className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg"
              itemClasses={{
                base: "data-[hover=true]:bg-gray-100 data-[hover=true]:text-gray-900",
              }}
            >
              <DropdownItem key="user-info" className="py-4 border-b border-gray-100">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem key="dashboard" href="/dashboard" className="flex items-center space-x-3 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Dashboard</span>
              </DropdownItem>
              <DropdownItem key="profile" href="/profile" className="flex items-center space-x-3 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">โปรไฟล์</span>
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger"
                className="flex items-center space-x-3 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                onClick={handleLogout}
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-medium text-red-600">ออกจากระบบ</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/auth/signin"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
            >
              สมัครงาน
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 