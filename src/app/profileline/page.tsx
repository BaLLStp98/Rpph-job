'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Button, Avatar, Chip, Divider } from '@heroui/react'

export default function ProfileLine() {
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ดึงข้อมูลโปรไฟล์จาก localStorage หรือ mock data
    const fetchProfileData = async () => {
      try {
        // ลองดึงข้อมูลจาก localStorage ก่อน
        const savedProfile = localStorage.getItem('profileData')
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile))
        } else {
          // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ mock data
          const mockProfile = {
            id: 'mock-user-123',
            name: 'ผู้ใช้ตัวอย่าง',
            email: 'user@example.com',
            image: '/api/image?file=profile_1754449262102.png',
            status: 'active',
            provider: 'local',
            displayName: 'ผู้ใช้ตัวอย่าง',
            createdAt: new Date().toISOString()
          }
          setProfileData(mockProfile)
          // บันทึกลง localStorage
          localStorage.setItem('profileData', JSON.stringify(mockProfile))
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
        // ใช้ mock data เป็น fallback
        const fallbackProfile = {
          id: 'fallback-user',
          name: 'ผู้ใช้ระบบ',
          email: 'user@rpph.com',
          image: null,
          status: 'active',
          provider: 'local',
          displayName: 'ผู้ใช้ระบบ',
          createdAt: new Date().toISOString()
        }
        setProfileData(fallbackProfile)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลโปรไฟล์</h3>
          <p className="text-gray-600 mb-4">กรุณาสมัครงานก่อนเพื่อดูข้อมูลโปรไฟล์</p>
          <Button color="primary" variant="solid" onClick={() => window.location.href = '/register'}>
            สมัครงาน
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar
                  src={profileData.image || ''}
                  name={profileData.name || 'User'}
                  size="lg"
                  color="success"
                  className="ring-4 ring-green-200"
                />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ProfileLine
                  </h1>
                  <p className="text-xl text-gray-700 font-medium">
                    {profileData.name || 'ผู้ใช้'}
                  </p>
                  <p className="text-gray-600">
                    {profileData.email || 'ไม่มีอีเมล'}
                  </p>
                </div>
              </div>
              <Chip color="success" variant="flat" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                Local Profile
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardBody>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">ข้อมูลโปรไฟล์</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">สถานะ:</span>
                      <Chip size="sm" color="success" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">Active</Chip>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium text-green-600">Local</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-mono text-xs text-gray-700">{profileData.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Display Name:</span>
                      <span className="font-medium text-gray-700">{profileData.displayName || 'N/A'}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardBody>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">ข้อมูลระบบ</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">วันที่สร้าง:</span>
                      <span className="font-medium text-gray-700">
                        {new Date(profileData.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">อีเมล:</span>
                      <span className="font-medium text-gray-700">{profileData.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">ประเภท:</span>
                      <span className="font-medium text-blue-600">ผู้สมัครงาน</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <Divider className="my-6" />

            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">การดำเนินการ</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  color="primary"
                  variant="solid"
                  onClick={() => window.location.href = '/profile'}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  ดูโปรไฟล์เต็ม
                </Button>
                <Button
                  color="secondary"
                  variant="bordered"
                  onClick={() => window.location.href = '/dashboard'}
                  className="border-gray-300"
                >
                  ไปหน้า Dashboard
                </Button>
                <Button
                  color="success"
                  variant="ghost"
                  onClick={() => window.location.href = '/register'}
                  className="text-green-600"
                >
                  แก้ไขข้อมูล
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
} 