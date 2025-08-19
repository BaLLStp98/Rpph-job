'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Button, Avatar, Chip, Badge, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'

export default function Dashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // ข้อมูลแผนกต่างๆ
  const departments = [
    { id: 'all', name: 'ทั้งหมด', icon: '🏥', color: 'primary' },
    { id: 'emergency', name: 'ห้องฉุกเฉิน', icon: '🚑', color: 'danger' },
    { id: 'surgery', name: 'ศัลยกรรม', icon: '⚕️', color: 'warning' },
    { id: 'pediatrics', name: 'กุมารเวชศาสตร์', icon: '👶', color: 'success' },
    { id: 'cardiology', name: 'โรคหัวใจ', icon: '❤️', color: 'danger' },
    { id: 'neurology', name: 'ประสาทวิทยา', icon: '🧠', color: 'secondary' },
    { id: 'orthopedics', name: 'ออร์โธปิดิกส์', icon: '🦴', color: 'warning' },
    { id: 'dermatology', name: 'ผิวหนัง', icon: '🔬', color: 'primary' },
    { id: 'ophthalmology', name: 'จักษุวิทยา', icon: '👁️', color: 'secondary' },
    { id: 'dental', name: 'ทันตกรรม', icon: '🦷', color: 'success' },
    { id: 'psychiatry', name: 'จิตเวชศาสตร์', icon: '🧠', color: 'primary' },
    { id: 'radiology', name: 'รังสีวิทยา', icon: '📷', color: 'secondary' },
    { id: 'laboratory', name: 'ห้องปฏิบัติการ', icon: '🧪', color: 'success' },
    { id: 'pharmacy', name: 'เภสัชกรรม', icon: '💊', color: 'warning' },
    { id: 'nursing', name: 'พยาบาลศาสตร์', icon: '👩‍⚕️', color: 'primary' },
    { id: 'administration', name: 'บริหาร', icon: '📋', color: 'secondary' }
  ]

  // ข้อมูลประกาศรับสมัคร
  const jobPostings = [
    {
      id: 1,
      title: 'นักจัดการงานทั่วไป',
      department: 'IT',
      departmentName: 'IT',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '15,000 - 20,000',
      experience: '2-5 ปี',
      education: 'คณะหรือสาขาที่เกี่ยวข้อง',
      postedDate: '2024-01-15',
      deadline: '2025-12-31',
      urgent: true,
      description: 'รับสมัครนักจัดการงานทั่วไปสำหรับแผนกคอมพิวเตอร์'
    },
    {
      id: 2,
      title: 'พยาบาลวิชาชีพ',
      department: 'nursing',
      departmentName: 'พยาบาลศาสตร์',
      location: 'โรงพยาบาลกรุงเทพ',
      type: 'full-time',
      salary: '25,000 - 35,000',
      experience: '1-3 ปี',
      education: 'พยาบาลศาสตร์',
      postedDate: '2024-01-14',
      deadline: '2024-02-10',
      urgent: false,
      description: 'รับสมัครพยาบาลวิชาชีพสำหรับแผนกต่างๆ'
    },
    {
      id: 3,
      title: 'แพทย์เวชศาสตร์ฉุกเฉิน',
      department: 'emergency',
      departmentName: 'ห้องฉุกเฉิน',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '45,000 - 60,000',
      experience: '3-7 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-10',
      deadline: '2024-03-15',
      urgent: true,
      description: 'รับสมัครแพทย์เวชศาสตร์ฉุกเฉินที่มีประสบการณ์ในการดูแลผู้ป่วยฉุกเฉิน'
    },
    {
      id: 4,
      title: 'ศัลยแพทย์',
      department: 'surgery',
      departmentName: 'ศัลยกรรม',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '50,000 - 70,000',
      experience: '5-10 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-12',
      deadline: '2024-04-20',
      urgent: false,
      description: 'รับสมัครศัลยแพทย์ที่มีความเชี่ยวชาญในการผ่าตัดทั่วไป'
    },
    {
      id: 5,
      title: 'กุมารแพทย์',
      department: 'pediatrics',
      departmentName: 'กุมารเวชศาสตร์',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '40,000 - 55,000',
      experience: '3-8 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-08',
      deadline: '2024-02-28',
      urgent: false,
      description: 'รับสมัครกุมารแพทย์ที่มีความรักและเข้าใจเด็ก'
    },
    {
      id: 6,
      title: 'แพทย์โรคหัวใจ',
      department: 'cardiology',
      departmentName: 'โรคหัวใจ',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '55,000 - 75,000',
      experience: '5-12 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-05',
      deadline: '2024-05-10',
      urgent: true,
      description: 'รับสมัครแพทย์โรคหัวใจที่มีความเชี่ยวชาญในการวินิจฉัยและรักษาโรคหัวใจ'
    },
    {
      id: 7,
      title: 'แพทย์ประสาทวิทยา',
      department: 'neurology',
      departmentName: 'ประสาทวิทยา',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '50,000 - 65,000',
      experience: '4-10 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-13',
      deadline: '2024-03-30',
      urgent: false,
      description: 'รับสมัครแพทย์ประสาทวิทยาที่มีความเชี่ยวชาญในการวินิจฉัยโรคทางระบบประสาท'
    },
    {
      id: 8,
      title: 'แพทย์ออร์โธปิดิกส์',
      department: 'orthopedics',
      departmentName: 'ออร์โธปิดิกส์',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '45,000 - 60,000',
      experience: '4-8 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-11',
      deadline: '2024-04-15',
      urgent: false,
      description: 'รับสมัครแพทย์ออร์โธปิดิกส์ที่มีความเชี่ยวชาญในการรักษาโรคกระดูกและข้อ'
    },
    {
      id: 9,
      title: 'แพทย์ผิวหนัง',
      department: 'dermatology',
      departmentName: 'ผิวหนัง',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '40,000 - 55,000',
      experience: '3-7 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-09',
      deadline: '2024-03-25',
      urgent: false,
      description: 'รับสมัครแพทย์ผิวหนังที่มีความเชี่ยวชาญในการวินิจฉัยและรักษาโรคผิวหนัง'
    },
    {
      id: 10,
      title: 'แพทย์จักษุวิทยา',
      department: 'ophthalmology',
      departmentName: 'จักษุวิทยา',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '45,000 - 60,000',
      experience: '4-9 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-07',
      deadline: '2024-04-05',
      urgent: false,
      description: 'รับสมัครแพทย์จักษุวิทยาที่มีความเชี่ยวชาญในการรักษาโรคตา'
    },
    {
      id: 11,
      title: 'ทันตแพทย์',
      department: 'dental',
      departmentName: 'ทันตกรรม',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '35,000 - 50,000',
      experience: '2-6 ปี',
      education: 'ทันตแพทยศาสตร์',
      postedDate: '2024-01-06',
      deadline: '2024-02-20',
      urgent: false,
      description: 'รับสมัครทันตแพทย์ที่มีความเชี่ยวชาญในการรักษาโรคฟันและช่องปาก'
    },
    {
      id: 12,
      title: 'จิตแพทย์',
      department: 'psychiatry',
      departmentName: 'จิตเวชศาสตร์',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '45,000 - 60,000',
      experience: '4-8 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-04',
      deadline: '2024-03-18',
      urgent: false,
      description: 'รับสมัครจิตแพทย์ที่มีความเข้าใจและเอาใจใส่ผู้ป่วยทางจิตเวช'
    },
    {
      id: 13,
      title: 'รังสีแพทย์',
      department: 'radiology',
      departmentName: 'รังสีวิทยา',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '50,000 - 65,000',
      experience: '4-10 ปี',
      education: 'แพทยศาสตร์',
      postedDate: '2024-01-03',
      deadline: '2024-04-12',
      urgent: false,
      description: 'รับสมัครรังสีแพทย์ที่มีความเชี่ยวชาญในการอ่านผลการตรวจทางรังสี'
    },
    {
      id: 14,
      title: 'นักเทคนิคการแพทย์',
      department: 'laboratory',
      departmentName: 'ห้องปฏิบัติการ',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '20,000 - 30,000',
      experience: '1-4 ปี',
      education: 'เทคนิคการแพทย์',
      postedDate: '2024-01-02',
      deadline: '2024-02-15',
      urgent: true,
      description: 'รับสมัครนักเทคนิคการแพทย์ที่มีความละเอียดและแม่นยำในการตรวจวิเคราะห์'
    },
    {
      id: 15,
      title: 'เภสัชกร',
      department: 'pharmacy',
      departmentName: 'เภสัชกรรม',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '25,000 - 35,000',
      experience: '2-5 ปี',
      education: 'เภสัชศาสตร์',
      postedDate: '2024-01-01',
      deadline: '2024-02-28',
      urgent: false,
      description: 'รับสมัครเภสัชกรที่มีความรู้ด้านยาและความปลอดภัยในการใช้ยา'
    },
    {
      id: 16,
      title: 'เจ้าหน้าที่บริหาร',
      department: 'administration',
      departmentName: 'บริหาร',
      location: 'โรงพยาบาลราชพิพัฒน์',
      type: 'full-time',
      salary: '18,000 - 25,000',
      experience: '2-4 ปี',
      education: 'บริหารธุรกิจหรือสาขาที่เกี่ยวข้อง',
      postedDate: '2024-01-16',
      deadline: '2024-03-10',
      urgent: false,
      description: 'รับสมัครเจ้าหน้าที่บริหารที่มีความสามารถในการจัดการและประสานงาน'
    }
  ]

  // กรองข้อมูลตามการค้นหาและแผนกที่เลือก
  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                โรงพยาบาลราชพิพัฒน์
              </h1>
            </div>
              <div className="flex items-center space-x-4">
              <Input
                placeholder="ค้นหางาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                startContent={
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <Button color="primary" variant="flat" size="sm">
                เข้าสู่ระบบ
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">แผนกต่างๆ</h2>
            
            {/* Custom Dropdown Button */}
            <div className="w-full mb-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {departments.find(d => d.id === selectedDepartment)?.icon || '🏥'}
                  </span>
                  <span className="font-medium">
                    {departments.find(d => d.id === selectedDepartment)?.name || 'ทั้งหมด'}
                  </span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu with Slide Animation */}
              <div className={`mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                isDropdownOpen 
                  ? 'max-h-96 opacity-100 transform translate-y-0' 
                  : 'max-h-0 opacity-0 transform -translate-y-2'
              }`}>
                <div className="py-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        setSelectedDepartment(dept.id)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-all duration-200 ${
                        selectedDepartment === dept.id 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{dept.icon}</span>
                      <span className="font-medium">{dept.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Data Link */}
            <div className="w-full mt-6">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                onClick={() => router.push('/application-data')}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                ดูข้อมูลใบสมัครงาน
              </Button>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ประกาศรับสมัครงาน
                  </h1>
                  <p className="text-gray-600">
                ค้นหางานที่เหมาะสมกับคุณในโรงพยาบาลราชพิพัฒน์
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <Chip color="success" variant="flat">
                  {filteredJobs.length} ตำแหน่ง
                </Chip>
                <Chip color="danger" variant="flat">
                  {filteredJobs.filter(job => job.urgent).length} ตำแหน่งด่วน
                </Chip>
              </div>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {job.title}
                          </h3>
                          {job.urgent && (
                            <Badge color="danger" variant="flat" size="sm">
                              ด่วน
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="text-2xl">{departments.find(d => d.id === job.department)?.icon}</span>
                          <span>{job.departmentName}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-3">

                      
                      <div className="flex items-center space-x-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-gray-600">{job.salary}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                        <span className="text-gray-600">{job.experience}</span>
                    </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-gray-600">{job.education}</span>
                    </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">หมดเขต: {new Date(job.deadline).toLocaleDateString('th-TH')}</span>
                  </div>

                      <p className="text-sm text-gray-600 line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex space-x-2 pt-2">
                    <Button
                      color="primary"
                      variant="solid"
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                          onClick={() => router.push('/application-form')}
                        >
                          สมัครงาน
                    </Button>
                    <Button
                      color="secondary"
                      variant="solid"
                          size="sm"
                          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          รายละเอียด
                    </Button>
                      </div>
                  </div>
                </CardBody>
              </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบตำแหน่งงาน</h3>
                <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือเลือกแผนกอื่น</p>
              </div>
            )}
        </div>
        </main>
      </div>
    </div>
  )
} 