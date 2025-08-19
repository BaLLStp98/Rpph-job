'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ยินดีต้อนรับสู่ RPPH Job
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          ระบบสมัครงานและจัดการโปรไฟล์ที่ทันสมัย
        </p>
      </div>

      {/* ปุ่มหลัก - Check Profile */}
      <div className="text-center space-y-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">ตรวจสอบโปรไฟล์</h2>
          <p className="text-gray-600 mb-6">
            ดูสถานะการสมัครงานของคุณ
          </p>
          <Link
            href="/check-profile"
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ตรวจสอบโปรไฟล์
          </Link>
        </div>
      </div>

      {/* ขั้นตอนการใช้งาน */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg max-w-2xl w-full">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">ขั้นตอนการใช้งาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <p>ตรวจสอบโปรไฟล์</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <p>เข้าสู่ระบบด้วย Line</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <p>กรอกข้อมูลสมัครงาน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2024 RPPH Job. All rights reserved.</p>
      </div>
    </div>
  )
}
