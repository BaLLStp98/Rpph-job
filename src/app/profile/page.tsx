'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Button, Spinner } from '@heroui/react'
import {
  ProfileImageSection,
  PersonalInfoSection,
  EducationSection,
  WorkExperienceSection,
  DocumentsSection
} from './components'

interface ProfileData {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  lineDisplayName: string;
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
  isHospitalStaff: boolean;
  hospitalDepartment: string;
  username: string;
  password: string;
  profileImageUrl: string | null;
  // เพิ่มฟิลด์เสริมที่มาจาก @register / ResumeDeposit
  idNumber?: string;
  idCardIssuedAt?: string;
  idCardIssueDate?: string;
  idCardExpiryDate?: string;
  registeredAddressText?: string;
  currentAddressText?: string;
  emergencyAddressText?: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  emergencyWorkplaceName?: string;
  emergencyWorkplaceDistrict?: string;
  emergencyWorkplaceProvince?: string;
  emergencyWorkplacePhone?: string;
  // ข้อมูลการศึกษาและประสบการณ์
  educationList?: Array<{
    level: string;
    institution: string;
    major: string;
    graduationYear: string;
    gpa: string;
  }>;
  workList?: Array<{
    position: string;
    company: string;
    district: string;
    province: string;
    startDate: string;
    endDate: string;
    salary: string;
    reason: string;
    current: boolean;
  }>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State declarations
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [hospitalDepartments, setHospitalDepartments] = useState<Array<{id: string, name: string}>>([])
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ id: number, documentType: string, fileName: string, filePath: string, fileSize?: number, mimeType?: string }>>([])
  
  // ฟังก์ชันดึงข้อมูลหน่วยงานโรงพยาบาล
  const fetchHospitalDepartments = async () => {
    try {
      const response = await fetch('/api/hospital-departments')
        if (response.ok) {
          const result = await response.json()
        setHospitalDepartments(result.hospitalDepartments || [])
      }
    } catch (error) {
      console.error('Error fetching hospital departments:', error)
    }
  }
  
  // ฟังก์ชันดึงข้อมูลโปรไฟล์
    const fetchProfileData = async () => {
    if (status !== 'authenticated') return
      
      try {
        const email = session?.user?.email || ''
        const response = await fetch(`/api/resume-deposit?search=${encodeURIComponent(email)}`)
        
        if (response.ok) {
          const result = await response.json()
          const list = result?.data || []
          if (Array.isArray(list) && list.length > 0) {
          const resume = list[0] // ใช้ข้อมูลล่าสุด
          
          // แปลงข้อมูลจาก ResumeDeposit เป็น ProfileData
          const profile: ProfileData = {
              id: resume.id,
              prefix: resume.prefix || '',
            firstName: resume.firstName || '',
            lastName: resume.lastName || '',
            lineDisplayName: resume.lineDisplayName || '',
            email: resume.email || '',
              phone: resume.phone || '',
            gender: resume.gender || '',
            birthDate: resume.birthDate || '',
            nationality: resume.nationality || '',
              religion: resume.religion || '',
            maritalStatus: resume.maritalStatus || '',
            address: resume.currentAddressText || '',
            province: resume.currentAddress?.province || '',
            district: resume.currentAddress?.district || '',
            subDistrict: resume.currentAddress?.subDistrict || '',
            postalCode: resume.currentAddress?.postalCode || '',
              emergencyContact: resume.emergencyContact || '',
              emergencyPhone: resume.emergencyPhone || '',
            isHospitalStaff: resume.isHospitalStaff || false,
            hospitalDepartment: resume.hospitalDepartment || '',
            username: resume.username || '',
            password: resume.password || '',
              profileImageUrl: resume.profileImageUrl,
            idNumber: resume.idNumber,
            idCardIssuedAt: resume.idCardIssuedAt,
            idCardIssueDate: resume.idCardIssueDate,
            idCardExpiryDate: resume.idCardExpiryDate,
            registeredAddressText: resume.registeredAddressText,
            currentAddressText: resume.currentAddressText,
            emergencyAddressText: resume.emergencyAddressText,
            spouseFirstName: resume.spouseFirstName,
            spouseLastName: resume.spouseLastName,
            emergencyWorkplaceName: resume.emergencyWorkplaceName,
            emergencyWorkplaceDistrict: resume.emergencyWorkplaceDistrict,
            emergencyWorkplaceProvince: resume.emergencyWorkplaceProvince,
            emergencyWorkplacePhone: resume.emergencyWorkplacePhone,
            educationList: resume.educationList || [],
            workList: resume.workList || []
          }
          
          setProfileData(profile)
          
          // ดึงเอกสารแนบ
            try {
              const docsRes = await fetch(`/api/resume-documents?resumeDepositId=${resume.id}`)
              const docsJson = await docsRes.json().catch(() => ({}))
              const docs = (docsJson?.data || docsJson || []) as any[]
              if (Array.isArray(docs)) {
                setUploadedDocuments(docs.map((d: any) => ({
                  id: d.id,
                  documentType: d.documentType,
                  fileName: d.fileName,
                  filePath: d.filePath,
                  fileSize: d.fileSize,
                mimeType: d.mimeType
                })))
              }
          } catch (error) {
            console.error('Error fetching documents:', error)
          }
            
          // ตรวจสอบรูปภาพโปรไฟล์
            if (resume.profileImageUrl) {
            setProfileImage(`/api/image?file=${resume.profileImageUrl}`)
          } else {
            // ลองหาไฟล์รูปภาพจาก public/image
              try {
                const pngPath = `/image/profile_${resume.id}.png`
                const pngResponse = await fetch(pngPath)
                if (pngResponse.ok) {
                  setProfileImage(pngPath)
                } else {
                  const jpgPath = `/image/profile_${resume.id}.jpg`
                  const jpgResponse = await fetch(jpgPath)
                  if (jpgResponse.ok) {
                    setProfileImage(jpgPath)
                  }
                }
              } catch (error) {
              console.error('Error checking profile image:', error)
              }
            }
          }
        }
      } catch (error) {
          console.error('Error fetching profile data:', error)
      } finally {
          setLoading(false)
        }
  }

  // ฟังก์ชันสร้าง className สำหรับ input/dropdown
  const getInputClassName = (hasError: boolean = false) => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    
    if (hasError) {
      return `${baseClass} border-red-500 focus:border-red-500`
    } else if (saved) {
      return `${baseClass} border-green-500 focus:border-green-500`
    } else {
      return `${baseClass} border-gray-300 focus:border-blue-500`
    }
  }

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล
  const handleChange = (field: string, value: string | boolean) => {
    if (!profileData) return
    
    setProfileData(prev => ({
      ...prev!,
      [field]: value
    }))
    
    // ล้าง error เมื่อมีการเปลี่ยนแปลง
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลการศึกษา
  const handleEducationChange = (index: number, field: string, value: string) => {
    if (!profileData || !profileData.educationList) return
    
    const updatedEducationList = [...profileData.educationList]
    updatedEducationList[index] = { ...updatedEducationList[index], [field]: value }
    setProfileData(prev => ({ ...prev!, educationList: updatedEducationList }))
  }

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลการทำงาน
  const handleWorkChange = (index: number, field: string, value: string | boolean) => {
    if (!profileData || !profileData.workList) return
    
    const updatedWorkList = [...profileData.workList]
    updatedWorkList[index] = { ...updatedWorkList[index], [field]: value }
    setProfileData(prev => ({ ...prev!, workList: updatedWorkList }))
  }
    
  // ฟังก์ชันเพิ่ม/ลบข้อมูลการศึกษา
  const addEducation = () => {
    if (!profileData || !profileData.educationList || profileData.educationList.length >= 5) return
    setProfileData(prev => ({
      ...prev!,
      educationList: [...(prev!.educationList || []), { level: '', institution: '', major: '', graduationYear: '', gpa: '' }]
    }))
  }

  const removeEducation = (index: number) => {
    if (!profileData || !profileData.educationList) return
    const updatedEducationList = profileData.educationList.filter((_, i) => i !== index)
    setProfileData(prev => ({ ...prev!, educationList: updatedEducationList }))
  }

  // ฟังก์ชันเพิ่ม/ลบข้อมูลการทำงาน
  const addWork = () => {
    if (!profileData || !profileData.workList || profileData.workList.length >= 5) return
    setProfileData(prev => ({
      ...prev!,
      workList: [...(prev!.workList || []), { position: '', company: '', district: '', province: '', startDate: '', endDate: '', salary: '', reason: '', current: false }]
    }))
  }

  const removeWork = (index: number) => {
    if (!profileData || !profileData.workList) return
    const updatedWorkList = profileData.workList.filter((_, i) => i !== index)
    setProfileData(prev => ({ ...prev!, workList: updatedWorkList }))
  }

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    if (!profileData) return
    
    setSaving(true)
    setErrors({})
    
    try {
      // Validation
      const newErrors: {[key: string]: string} = {}
      
      if (!profileData.prefix) newErrors.prefix = 'กรุณาเลือกคำนำหน้า'
      if (!profileData.firstName) newErrors.firstName = 'กรุณากรอกชื่อ'
      if (!profileData.lastName) newErrors.lastName = 'กรุณากรอกนามสกุล'
      if (!profileData.email) newErrors.email = 'กรุณากรอกอีเมล'
      if (!profileData.phone) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์'
      if (!profileData.gender) newErrors.gender = 'กรุณาเลือกเพศ'
      if (!profileData.birthDate) newErrors.birthDate = 'กรุณาเลือกวันเกิด'
      if (!profileData.nationality) newErrors.nationality = 'กรุณากรอกสัญชาติ'
      if (!profileData.religion) newErrors.religion = 'กรุณากรอกศาสนา'
      if (!profileData.maritalStatus) newErrors.maritalStatus = 'กรุณาเลือกสถานภาพ'
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setSaving(false)
        return
      }

      // Update resume-deposit basic information
      const userResponse = await fetch(`/api/resume-deposit/${profileData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        prefix: profileData.prefix,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
          gender: profileData.gender,
          birthDate: profileData.birthDate,
        nationality: profileData.nationality,
        religion: profileData.religion,
          maritalStatus: profileData.maritalStatus,
        isHospitalStaff: profileData.isHospitalStaff,
        hospitalDepartment: profileData.hospitalDepartment,
          educationList: profileData.educationList,
          workList: profileData.workList
        })
      })
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${errorData.message}`)
        return
      }
      
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 3000)
      
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  // ฟังก์ชันลบเอกสาร
  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('คุณต้องการลบเอกสารนี้หรือไม่?')) return
    
    try {
      const response = await fetch(`/api/resume-documents/${documentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId))
      } else {
        alert('เกิดข้อผิดพลาดในการลบเอกสาร')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('เกิดข้อผิดพลาดในการลบเอกสาร')
    }
  }

  // Effects
  useEffect(() => {
    fetchHospitalDepartments()
  }, [])

  useEffect(() => {
    fetchProfileData()
  }, [status, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {/* Dashboard Button - Top Right */}
        <div className="flex justify-end mb-6">
          <Button
            color="primary"
            variant="solid"
            size="md"
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            กลับไปหน้า Dashboard
          </Button>
        </div>

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

        {/* Profile Image Section */}
        <div className="mb-8">
          <ProfileImageSection
            profileImage={profileImage}
            profileData={profileData}
            editing={editing}
            onImageChange={setProfileImage}
            onImageDelete={() => setProfileImage(null)}
          />
                </div>

        {/* Personal Info Section */}
        <div className="mb-8">
          <PersonalInfoSection
            profileData={profileData}
            editing={editing}
            errors={errors}
            hospitalDepartments={hospitalDepartments}
            onEdit={() => setEditing(true)}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            onChange={handleChange}
            getInputClassName={getInputClassName}
                />
              </div>

        {/* Education Section */}
        <div className="mb-8">
          <EducationSection
            profileData={profileData}
            editing={editing}
            errors={errors}
            onAddEducation={addEducation}
            onRemoveEducation={removeEducation}
            onEducationChange={handleEducationChange}
            getInputClassName={getInputClassName}
                />
              </div>

        {/* Work Experience Section */}
        <div className="mb-8">
          <WorkExperienceSection
            profileData={profileData}
            editing={editing}
            errors={errors}
            onAddWork={addWork}
            onRemoveWork={removeWork}
            onWorkChange={handleWorkChange}
            getInputClassName={getInputClassName}
                />
              </div>

        {/* Documents Section */}
        <div className="mb-8">
          <DocumentsSection
            uploadedDocuments={uploadedDocuments}
            onDeleteDocument={handleDeleteDocument}
                />
              </div>

        {/* Status Messages */}
        {saving && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            กำลังบันทึกข้อมูล...
                </div>
              )}

        {saved && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            บันทึกข้อมูลสำเร็จ!
                </div>
              )}
      </div>
    </div>
  )
} 