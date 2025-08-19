'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Button, Avatar, Chip, Badge } from '@heroui/react'

interface ProfileData {
  id: string;
    prefix: string;
    firstName: string;
    lastName: string;
  email: string;
  phone: string;
  gender: string;
    birthDate: string;
    nationality: string;
    religion: string;
    maritalStatus: string;
    address: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
    emergencyContact: string;
    emergencyPhone: string;
  profileImageUrl: string | null;
  educationList: Array<{
    level: string;
    school: string;
    major: string;
    startYear: string;
    endYear: string;
    gpa: string;
  }>;
  workList: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    salary: string;
  }>;
  createdAt: string;
  status: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the latest application data
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/register')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.applications.length > 0) {
            // Get the most recent application
            const latestApplication = result.applications[result.applications.length - 1]
            setProfileData(latestApplication)
            
            // ดึงรูปภาพโปรไฟล์จากโฟลเดอร์ image
            if (latestApplication.id) {
              console.log('กำลังค้นหารูปภาพสำหรับ id:', latestApplication.id);
              
              try {
                // ลองหาไฟล์ PNG ก่อน (เพราะเห็นว่าไฟล์ในโฟลเดอร์เป็น PNG)
                const pngPath = `/image/profile_${latestApplication.id}.png`;
                console.log('กำลังตรวจสอบไฟล์ PNG:', pngPath);
                
                const pngResponse = await fetch(pngPath);
                if (pngResponse.ok) {
                  console.log('พบรูปภาพ PNG:', pngPath);
                  setProfileImage(pngPath);
                } else {
                  console.log('ไม่พบรูปภาพ PNG, กำลังตรวจสอบ JPG...');
                  // ลองหาไฟล์ JPG
                  const jpgPath = `/image/profile_${latestApplication.id}.jpg`;
                  console.log('กำลังตรวจสอบไฟล์ JPG:', jpgPath);
                  
                  const jpgResponse = await fetch(jpgPath);
                  if (jpgResponse.ok) {
                    console.log('พบรูปภาพ JPG:', jpgPath);
                    setProfileImage(jpgPath);
                  } else {
                    console.log('ไม่พบรูปภาพใดๆ ทั้ง PNG และ JPG');
                  }
                }
              } catch (error) {
                console.log('เกิดข้อผิดพลาดในการตรวจสอบรูปภาพ:', error);
              }
            } else {
              console.log('ไม่พบ id ในข้อมูล');
            }
          }
      }
    } catch (error) {
        console.error('Error fetching profile data:', error)
    } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      case 'under_review': return 'primary'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอพิจารณา'
      case 'approved': return 'ผ่านการคัดเลือก'
      case 'rejected': return 'ไม่ผ่าน'
      case 'under_review': return 'กำลังตรวจสอบ'
      default: return 'ไม่ทราบสถานะ'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            โปรไฟล์ของฉัน
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ข้อมูลการสมัครงานและประวัติส่วนตัว
          </p>
        </div>

        {/* Application Status */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">สถานะการสมัครงาน</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Chip color={getStatusColor(profileData.status)} variant="flat">
                  {getStatusText(profileData.status)}
                </Chip>
                <Badge content="รหัสใบสมัคร" color="primary" variant="flat">
                  {profileData.id}
                </Badge>
        </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">วันที่สมัคร:</span>
                <p className="font-medium">{new Date(profileData.createdAt).toLocaleDateString('th-TH')}</p>
              </div>
              <div>
                <span className="text-gray-500">อีเมล:</span>
                <p className="font-medium">{profileData.email}</p>
              </div>
              <div>
                <span className="text-gray-500">เบอร์โทร:</span>
                <p className="font-medium">{profileData.phone}</p>
              </div>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-yellow-800 text-sm font-medium">
                  Debug Info: ID = {profileData.id}, Profile Image = {profileImage ? 'Found' : 'Not Found'}
                </p>
              </div>
            </div>
            
            {profileImage && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-blue-800 text-sm font-medium">
                    รูปภาพโปรไฟล์ได้ถูกดึงมาจากโฟลเดอร์ Image แล้ว
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Profile Image */}
        {profileImage && (
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">รูปภาพโปรไฟล์</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt={`รูปภาพโปรไฟล์ของ ${profileData?.firstName} ${profileData?.lastName}`}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      console.log('รูปภาพโหลดไม่สำเร็จ:', e);
                      setProfileImage(null);
                    }}
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    R
                  </div>
                </div>
                <p className="text-sm text-blue-600 mt-3 font-medium">
                  รูปภาพจากโฟลเดอร์ Image
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* No Profile Image */}
        {!profileImage && (
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">รูปภาพโปรไฟล์</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  ไม่มีรูปภาพโปรไฟล์
                </p>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  รูปภาพจะแสดงที่นี่เมื่อคุณอัปโหลดรูปในหน้า Register
                </p>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  รูปภาพจะถูกบันทึกในโฟลเดอร์ Image
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Personal Information */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                  </div>
              <h2 className="text-2xl font-bold text-gray-900">ข้อมูลส่วนบุคคล</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <span className="text-gray-500 text-sm">ชื่อ-นามสกุล</span>
                <p className="font-medium">{profileData.prefix} {profileData.firstName} {profileData.lastName}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">เพศ</span>
                <p className="font-medium">{profileData.gender}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">วันเกิด</span>
                <p className="font-medium">{new Date(profileData.birthDate).toLocaleDateString('th-TH')}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">สัญชาติ</span>
                <p className="font-medium">{profileData.nationality || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">ศาสนา</span>
                <p className="font-medium">{profileData.religion || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">สถานภาพสมรส</span>
                <p className="font-medium">{profileData.maritalStatus || '-'}</p>
              </div>
                  </div>
                  
            <div className="mt-6">
              <span className="text-gray-500 text-sm">ที่อยู่</span>
              <p className="font-medium mt-1">
                {profileData.address}
                {profileData.subDistrict && `, ${profileData.subDistrict}`}
                {profileData.district && `, ${profileData.district}`}
                {profileData.province && `, ${profileData.province}`}
                {profileData.postalCode && ` ${profileData.postalCode}`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <span className="text-gray-500 text-sm">ชื่อผู้ติดต่อฉุกเฉิน</span>
                <p className="font-medium">{profileData.emergencyContact || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">เบอร์โทรฉุกเฉิน</span>
                <p className="font-medium">{profileData.emergencyPhone || '-'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Education History */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ประวัติการศึกษา</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {profileData.educationList.map((education, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">ข้อมูลการศึกษา #{index + 1}</h3>
                    {education.gpa && (
                      <Chip color="success" variant="flat" size="sm">
                        GPA: {education.gpa}
                      </Chip>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">ระดับการศึกษา</span>
                      <p className="font-medium">{education.level}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">ชื่อสถานศึกษา</span>
                      <p className="font-medium">{education.school}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">สาขา/วิชาเอก</span>
                      <p className="font-medium">{education.major || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">ปีการศึกษา</span>
                      <p className="font-medium">
                        {education.startYear} - {education.endYear}
                      </p>
                    </div>
                  </div>
              </div>
            ))}
            </div>
          </CardBody>
        </Card>

        {/* Work Experience */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ประวัติการทำงาน</h2>
              </div>
            </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {profileData.workList.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">ข้อมูลการทำงาน #{index + 1}</h3>
                    {work.isCurrent && (
                      <Chip color="primary" variant="flat" size="sm">
                        ทำงานอยู่ปัจจุบัน
                      </Chip>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-sm">ตำแหน่ง</span>
                      <p className="font-medium">{work.position}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">ชื่อบริษัท/องค์กร</span>
                      <p className="font-medium">{work.company}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">วันที่เริ่มงาน</span>
                      <p className="font-medium">
                        {work.startDate ? new Date(work.startDate).toLocaleDateString('th-TH') : '-'}
                      </p>
              </div>
              <div>
                      <span className="text-gray-500 text-sm">วันที่สิ้นสุดงาน</span>
                      <p className="font-medium">
                        {work.isCurrent ? 'ปัจจุบัน' : (work.endDate ? new Date(work.endDate).toLocaleDateString('th-TH') : '-')}
                      </p>
              </div>
              <div>
                      <span className="text-gray-500 text-sm">เงินเดือน</span>
                      <p className="font-medium">{work.salary ? `${work.salary} บาท` : '-'}</p>
                    </div>
                  </div>
                  {work.description && (
                    <div className="mt-4">
                      <span className="text-gray-500 text-sm">รายละเอียดงาน</span>
                      <p className="font-medium mt-1">{work.description}</p>
                    </div>
                  )}
              </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            color="primary"
            variant="solid"
            size="lg"
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            กลับไปหน้า Dashboard
          </Button>
          <Button
            color="secondary"
            variant="bordered"
            size="lg"
            onClick={() => window.location.href = '/register'}
            className="border-gray-300"
          >
            แก้ไขข้อมูล
          </Button>
        </div>
      </div>
    </div>
  )
} 