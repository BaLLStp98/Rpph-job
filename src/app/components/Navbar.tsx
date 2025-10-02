'use client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="w-full flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Link href="/" className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer leading-tight">
        โรงพยาบาลราชพิพัฒน์
        </Link>
      </div>
      {/* Center contact text */}
      <div className="flex-1 text-center hidden sm:block text-[11px] sm:text-xs text-gray-700">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2.003 5.884c.063-1.351 1.2-2.4 2.552-2.4h1.118c.9 0 1.69.56 1.974 1.408l.52 1.56c.25.748.04 1.576-.53 2.116l-.79.748a12.035 12.035 0 005.23 5.23l.748-.79c.54-.57 1.368-.78 2.116-.53l1.56.52c.848.284 1.408 1.074 1.408 1.974v1.118c0 1.352-1.05 2.489-2.4 2.552a16.94 16.94 0 01-7.49-2.27 16.752 16.752 0 01-5.26-5.26 16.94 16.94 0 01-2.27-7.49z" />
          </svg>
          <span>02 102 4222, 02 421 2222, Line ID : @IRPP</span>
        </span>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        {status === 'authenticated' && session?.user?.image ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="relative group">
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 cursor-pointer group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Profile menu"
              className="w-48 sm:w-56 bg-white border border-gray-200 shadow-lg rounded-lg"
              itemClasses={{
                base: "data-[hover=true]:bg-gray-100 data-[hover=true]:text-gray-900",
              }}
            >
              <DropdownItem key="user-info" className="py-3 sm:py-4 border-b border-gray-100">
                <div className="flex flex-col space-y-1 sm:space-y-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {session.user.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem key="dashboard" href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-700">Dashboard</span>
              </DropdownItem>
              <DropdownItem key="profile" href="/register" className="flex items-center space-x-2 sm:space-x-3 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-700">โปรไฟล์</span>
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger"
                className="flex items-center space-x-2 sm:space-x-3 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                onClick={handleLogout}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-medium text-red-600">ออกจากระบบ</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Link 
            href="/api/auth/signin"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-1.5 sm:mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
} 