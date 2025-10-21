'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Button, Chip, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem } from '@heroui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useUser } from '../../contexts/UserContext'
import { getSession, useSession } from 'next-auth/react'

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, login, loginWithUser, logout } = useUser()
  const { data: session, status } = useSession()

  
  // Department data state
  const [departmentsData, setDepartmentsData] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(true)
  
  // Resume deposit data state
  const [resumeDepositData, setResumeDepositData] = useState<any[]>([])
  const [resumeDepositLoading, setResumeDepositLoading] = useState(true)
  const [userHasResume, setUserHasResume] = useState<boolean>(false)
  // Loading states for buttons
  const [navigatingPath, setNavigatingPath] = useState<string | null>(null)
  const [applyingDeptId, setApplyingDeptId] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  
  // Department filter state
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active')
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Detail modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailDepartment, setDetailDepartment] = useState<any | null>(null)
  const openDetail = (dept: any) => { setDetailDepartment(dept); setIsDetailOpen(true) }
  const closeDetail = () => { setIsDetailOpen(false); setDetailDepartment(null) }

  // Announcement modal state
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [announcementDepartment, setAnnouncementDepartment] = useState<any | null>(null)
  const [approvedApplicants, setApprovedApplicants] = useState<any[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  
  // Statistics state
  const [approvedCounts, setApprovedCounts] = useState<Record<string, number>>({})
  const openAnnouncement = (dept: any) => { 
    setAnnouncementDepartment(dept); 
    setIsAnnouncementOpen(true);
    fetchApprovedApplicants(dept.name);
  }
  const closeAnnouncement = () => { 
    setIsAnnouncementOpen(false); 
    setAnnouncementDepartment(null);
    setApprovedApplicants([]);
  }

  // ฟังก์ชันดึงข้อมูลผู้ผ่านการสมัคร
  const fetchApprovedApplicants = async (departmentName: string) => {
    try {
      setLoadingApplicants(true);
      console.log('🔄 กำลังดึงข้อมูลผู้ผ่านการพิจารณาสำหรับ:', departmentName);
      
      const response = await fetch(`/api/resume-deposit?department=${encodeURIComponent(departmentName)}&status=approved&admin=true`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ ข้อมูลผู้ผ่านการพิจารณา:', data);
        setApprovedApplicants(data.data || []);
      } else {
        console.error('❌ Error fetching approved applicants:', response.status, response.statusText);
        setApprovedApplicants([]);
      }
    } catch (error) {
      console.error('❌ Error fetching approved applicants:', error);
      setApprovedApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  }

  // ฟังก์ชันตรวจสอบว่าหมดเวลารับสมัครหรือไม่
  const isApplicationExpired = (endDate: string | null) => {
    if (!endDate) return false;
    const now = new Date();
    const deadline = new Date(endDate);
    return now > deadline;
  }

  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // ตรวจว่ามีใบสมัครงานแล้วหรือไม่ เพื่อกำหนดการแสดง Sidebar
  const [hasApplication, setHasApplication] = useState<boolean>(false)
  const [checkingApplication, setCheckingApplication] = useState<boolean>(true)

  useEffect(() => {
    const checkMyApplication = async () => {
      if (status !== 'authenticated') return
      try {
        setCheckingApplication(true)
        const res = await fetch('/api/prisma/applications?mine=1&limit=1')
        if (!res.ok) {
          setHasApplication(false)
        } else {
          const json = await res.json().catch(() => ({}))
          const list = (json?.data || json?.applications || (Array.isArray(json) ? json : [])) as any[]
          setHasApplication(Array.isArray(list) && list.length > 0)
        }
      } catch (_) {
        setHasApplication(false)
      } finally {
        setCheckingApplication(false)
      }
    }
    checkMyApplication()
  }, [status])

  // Modal ต่อสัญญา
  const { isOpen: isRenewOpen, onOpen: openRenewModal, onClose: closeRenewModal } = useDisclosure()
  const [renewForm, setRenewForm] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    department: '',
    position: '',
    newStartDate: '',
    newEndDate: '',
    contractStartDate: '',
    contractEndDate: '',
    newSalary: '',
    notes: '',
  })
  const [renewFile, setRenewFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ฟังก์ชันบันทึกข้อมูลการต่อสัญญา
  const handleSubmitRenewal = async () => {
    try {
      setIsSubmitting(true)

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!renewForm.prefix || !renewForm.firstName || !renewForm.lastName || !renewForm.department || !renewForm.position) {
        alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
        return
      }

      // สร้าง FormData
      const formData = new FormData()
      formData.append('prefix', renewForm.prefix)
      formData.append('firstName', renewForm.firstName)
      formData.append('lastName', renewForm.lastName)
      formData.append('department', renewForm.department)
      formData.append('position', renewForm.position)
      formData.append('newStartDate', renewForm.newStartDate)
      formData.append('newEndDate', renewForm.newEndDate)
      formData.append('contractStartDate', renewForm.contractStartDate)
      formData.append('contractEndDate', renewForm.contractEndDate)
      formData.append('newSalary', renewForm.newSalary)
      formData.append('notes', renewForm.notes)
      
      if (renewFile) {
        formData.append('file', renewFile)
      }

      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/contract-renewals', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        alert('บันทึกข้อมูลการต่อสัญญาเรียบร้อยแล้ว')
        // รีเซ็ตฟอร์ม
        setRenewForm({
          prefix: '',
          firstName: '',
          lastName: '',
          department: '',
          position: '',
          newStartDate: '',
          newEndDate: '',
          contractStartDate: '',
          contractEndDate: '',
          newSalary: '',
          notes: '',
        })
        setRenewFile(null)
        closeRenewModal()
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      } finally {
      setIsSubmitting(false)
    }
  }

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    if ( status !== 'loading' && status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  // Department names for dropdown (derive from data)
  const departmentNames = useMemo(() => {
    const names = Array.isArray(departmentsData)
      ? departmentsData
          .filter((d: any) => !!d?.name)
          .map((d: any) => d.name as string)
      : []
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'th'))
  }, [departmentsData])
  


  // Auto-login ด้วย LineID จาก NextAuth session
  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const session = await getSession();
        const lineId = (session as any)?.user?.lineId || (session as any)?.user?.sub || (session as any)?.profile?.userId;
        if (!lineId || isAuthenticated) return;

        const res = await fetch('/api/users');
        if (!res.ok) return;
        const data = await res.json();
        const matched = (data.users || []).find((u: any) => u.lineId && u.lineId === lineId && (u.role === 'admin' || u.role === 'superadmin'));
        if (matched) {
          loginWithUser(matched);
        }
      } catch (e) {
        // Auto-login failed silently
      }
    };
    tryAutoLogin();
  }, [isAuthenticated]);

  // Fetch departments data
  // ฟังก์ชันดึงข้อมูลจาก resume-deposit
  const fetchResumeDepositData = async () => {
    try {
      setResumeDepositLoading(true);
      // ส่งตัวกรองตามผู้ใช้ปัจจุบันไปยัง API เพื่อให้ได้เฉพาะข้อมูลของผู้ใช้
      const params = new URLSearchParams();
      params.set('limit', '100');
      try {
        const userId = (session as any)?.user?.id || '';
        const lineIdCandidate = (session as any)?.user?.lineId || (session as any)?.user?.sub || (session as any)?.profile?.userId || '';
        const email = (session as any)?.user?.email || '';

        // ส่งตัวบ่งชี้ผู้ใช้ให้มากที่สุดเพื่อให้ API จับคู่ได้แน่นอน
        if (userId) params.set('userId', String(userId));
        if (lineIdCandidate) {
          params.set('lineId', String(lineIdCandidate));
        } else if (email) {
          params.set('email', String(email));
        }
      } catch {}
      // หากเป็นผู้ดูแล ให้สามารถดึงทั้งหมดได้เมื่อจำเป็น
      if (isAdmin) {
        params.set('admin', 'true');
      }
      const url = `/api/resume-deposit?${params.toString()}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let resumeData = data.data || [];
        
        // หากไม่พบข้อมูล ให้ลอง fallback
        if (resumeData.length === 0) {
          try {
            const fallbackResponse = await fetch('/api/resume-deposit?admin=true&limit=10');
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              const allData = fallbackData.data || [];
              
              // ลองหาด้วย fuzzy matching
              const userId = (session as any)?.user?.id || '';
              const userLineId = (session as any)?.user?.lineId || (session as any)?.user?.sub || (session as any)?.profile?.userId || '';
              const email = (session as any)?.user?.email || '';
              
              const filtered = allData.filter((r: any) => {
                // ตรวจสอบ userId
                if (r?.userId && r.userId === userId) {
                  return true;
                }
                
                // ตรวจสอบ lineId
                if (r?.lineId && r.lineId === userLineId) {
                  return true;
                }
                
                // ตรวจสอบ email (fuzzy matching)
                if (r?.email && email) {
                  const dbEmail = r.email.toLowerCase();
                  const sessionEmail = email.toLowerCase();
                  
                  // Exact match
                  if (dbEmail === sessionEmail) {
                    return true;
                  }
                  
                  // Partial match (contains)
                  if (dbEmail.includes(sessionEmail.split('@')[0]) || sessionEmail.includes(dbEmail.split('@')[0])) {
                    return true;
                  }
                }
                
                return false;
              });
              
              if (filtered.length > 0) {
                resumeData = filtered;
              }
            }
          } catch (fallbackError) {
            // Fallback error handled silently
          }
        }
        
        setResumeDepositData(resumeData);
      } else {
        // Failed to fetch resume deposit data
      }
    } catch (error) {
      // Error fetching resume deposit data
    } finally {
      setResumeDepositLoading(false);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const response = await fetch(`/api/prisma/departments?status=${statusFilter}&limit=100`);
        if (response.ok) {
          const data = await response.json();
          // Map enum status (e.g., ACTIVE) to lowercase (active) for UI filters
          const list = (data.data || []).map((d: any) => ({
            ...d,
            status: (d.status || 'ACTIVE').toString().toLowerCase()
          }));
          setDepartmentsData(list);
          
          // ดึงข้อมูลสถิติผู้ผ่านการพิจารณาสำหรับแต่ละฝ่าย
          const counts: Record<string, number> = {};
          for (const dept of list) {
            try {
              const count = await getApprovedCount(dept.name);
              counts[dept.name] = count;
            } catch (error) {
              console.error(`Error fetching approved count for ${dept.name}:`, error);
              counts[dept.name] = 0;
            }
          }
          setApprovedCounts(counts);
        } else {
          // Failed to fetch departments
        }
      } catch (error) {
        // Error fetching departments
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
    fetchResumeDepositData();
  }, [statusFilter]);

  // ตรวจว่าผู้ใช้ปัจจุบันมีข้อมูลฝากประวัติหรือยัง (ตรวจสอบจากข้อมูลฝากประวัติโดยตรง)
  useEffect(() => {
    if (!session?.user) { 
      setUserHasResume(false); 
      return 
    }
    
    // มีเรคคอร์ดฝากประวัติอย่างน้อย 1 รายการถือว่าเพียงพอสำหรับการสมัคร
    const hasResume = Array.isArray(resumeDepositData) && resumeDepositData.length > 0

    setUserHasResume(hasResume)
  }, [resumeDepositData, session?.user])

  // รีเฟรชข้อมูลฝากประวัติทันทีเมื่อเข้าสู่ระบบเรียบร้อย เพื่อป้องกันเหตุ fetch ก่อน session พร้อม
  useEffect(() => {
    if (status === 'authenticated') {
      fetchResumeDepositData();
    }
  }, [status, (session as any)?.user?.id, (session as any)?.user?.email])

  // ฟังการเปลี่ยนแปลงจากหน้าอื่น (เช่น การเปลี่ยนสถานะในหน้า admin)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'statusChanged' && e.newValue) {
        console.log('🔄 ตรวจพบการเปลี่ยนสถานะ รีเฟรชข้อมูลสถิติ');
        refreshApprovedCounts();
        // ลบข้อมูลจาก localStorage หลังจากใช้แล้ว
        localStorage.removeItem('statusChanged');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // ตรวจสอบ localStorage เมื่อโหลดหน้า
    if (localStorage.getItem('statusChanged')) {
      console.log('🔄 ตรวจพบการเปลี่ยนสถานะใน localStorage รีเฟรชข้อมูลสถิติ');
      refreshApprovedCounts();
      localStorage.removeItem('statusChanged');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [departmentsData]);

  // รีเฟรชข้อมูลเมื่อผู้ใช้กลับมาจากหน้า resume-deposit
  useEffect(() => {
    const handleFocus = () => {
      fetchResumeDepositData();
    };

    // รีเฟรชข้อมูลเมื่อโหลดหน้าใหม่
    const handleLoad = () => {
      fetchResumeDepositData();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('load', handleLoad);
    
    // รีเฟรชข้อมูลทันทีเมื่อ component mount
    handleLoad();
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // ฟังก์ชันดึงข้อมูลฝ่ายและกลุ่มงานจาก departments
  const getDepartmentInfo = (deptName: string) => {
    const deptData = departmentsData.find((dept: any) => 
      dept.name === deptName
    ) as any;
    
    if (deptData) {
      return {
        department: deptData.name || 'ไม่ระบุ',
        workGroup: deptData.missionGroupName || 'ไม่ระบุ',
        appliedPosition: deptData.positions || 'ไม่ระบุ'
      };
    }
    
    return {
      department: 'ไม่ระบุ',
      workGroup: 'ไม่ระบุ',
      appliedPosition: 'ไม่ระบุ'
    };
  };

  // ฟังก์ชันดึงข้อมูลสถิติผู้ผ่านการพิจารณา
  const getApprovedCount = async (deptName: string) => {
    try {
      const response = await fetch(`/api/resume-deposit?department=${encodeURIComponent(deptName)}&status=approved&admin=true`);
      if (response.ok) {
        const data = await response.json();
        return data.data ? data.data.length : 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching approved count:', error);
      return 0;
    }
  };

  // ฟังก์ชันรีเฟรชข้อมูลสถิติ
  const refreshApprovedCounts = async () => {
    const counts: Record<string, number> = {};
    for (const dept of departmentsData) {
      try {
        const count = await getApprovedCount(dept.name);
        counts[dept.name] = count;
      } catch (error) {
        console.error(`Error fetching approved count for ${dept.name}:`, error);
        counts[dept.name] = 0;
      }
    }
    setApprovedCounts(counts);
  };

  // Filter and sort departments based on selected department, status, and search query
  const filteredDepartments = departmentsData
    .filter((dept: any) => {
      // Status filter
      const statusMatch = statusFilter === 'all' ? true : dept.status === statusFilter
      
      // Department filter
      const departmentMatch = selectedDepartment === 'all' ? true : dept.name === selectedDepartment
      
      // Search filter
      const searchMatch = searchQuery === '' ? true : 
        dept.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.positions?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.education?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return statusMatch && departmentMatch && searchMatch
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || a.updatedAt || '2024-01-01').getTime()
      const dateB = new Date(b.createdAt || b.updatedAt || '2024-01-01').getTime()
      return dateB - dateA
    })

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDepartmentSelect = (departmentName: string) => {
    setSelectedDepartment(departmentName)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when search changes
  }

  // Helpers for attachment preview (align with Home page)
  const isImage = (url: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(url)
  const isPdf = (url: string) => /\.pdf(\?|#|$)/i.test(url)
  const buildFileUrl = (att: any) => {
    const name = att?.fileName || att?.filename
    const raw = att?.path || att?.file_path || (name ? `/uploads/departments/${name}` : '')
    return encodeURI(raw && raw.startsWith('/') ? raw : `/${raw}`)
  }









  // แสดงหน้า loading ถ้ายังไม่ได้ตรวจสอบสถานะการเข้าสู่ระบบ
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
      </div>
    )
  }

  // แสดงหน้า login ถ้ายังไม่ได้เข้าสู่ระบบ
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูข้อมูลได้</p>
          <Button 
            color="primary" 
            onClick={() => router.push('/auth/signin')}
            className="px-8"
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header with Toggle Button */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            isIconOnly
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {(
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white shadow-lg border-r border-gray-200 p-3 sm:p-4 md:p-6
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-3 sm:space-y-4">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">เมนู</h3>
              <Button
                isIconOnly
                variant="ghost"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Desktop Menu Title */}
            <h3 className="hidden lg:block text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">เมนู</h3>
            
              <Button
              color="primary"
              variant="ghost"
              className="w-full justify-start text-xs sm:text-sm rounded-lg transition-colors hover:bg-blue-50"
                isLoading={navigatingPath === '/'}
                onClick={() => { setNavigatingPath('/'); router.push('/') }}
                startContent={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h4" />
                  </svg>
                }
              >
              หน้าแรก
              </Button>

              <Button
                color="secondary"
                variant="ghost"
                className="w-full justify-start text-xs sm:text-sm rounded-lg transition-colors hover:bg-blue-50"
                isLoading={navigatingPath === '/register'}
                onClick={() => {
                  setNavigatingPath('/register');
                  try {
                    // ส่งพารามิเตอร์แบบบังคับใช้ resumeUserId เป็นตัวอ้างอิงหลัก
                    const userId = (session as any)?.user?.id || '';
                    const params = new URLSearchParams();
                    if (userId) {
                      params.set('resumeUserId', String(userId));
                    }
                    const url = params.toString() ? `/register?${params.toString()}` : '/register';
                    router.push(url);
                  } catch {
                    router.push('/register');
                  }
                }}
                startContent={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              >
              ฝากประวัติ
              </Button>
              
              
              
              
              
              <Button
              color="primary"
              variant="ghost"
              className="w-full justify-start text-xs sm:text-sm rounded-lg transition-colors hover:bg-blue-50"
                isLoading={navigatingPath === '/application-data'}
                onClick={() => { setNavigatingPath('/application-data'); router.push('/application-data') }}
                startContent={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
              ดูประวัติการสมัครงาน
              </Button>


              

              <Button
                color="success"
                variant="ghost"
                className="w-full justify-start text-xs sm:text-sm rounded-lg transition-colors hover:bg-blue-50"
                onClick={openRenewModal}
                startContent={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                ต่อสัญญา
              </Button>

              <Button
                color="warning"
                variant="ghost"
                className="w-full justify-start text-xs sm:text-sm rounded-lg transition-colors hover:bg-blue-50"
                onClick={() => router.push('contract-renewals')}
                startContent={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              >
                ประวัติการต่อสัญญา
              </Button>
              <Button
              color="secondary"
              variant="ghost"
              className="w-full justify-start text-xs sm:text-sm rounded-lg transition-colors hover:bg-blue-50"
                isLoading={navigatingPath === '/contact'}
                onClick={() => { setNavigatingPath('/contact'); router.push('/contact') }}
                startContent={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              >
              ติดต่อเรา
              </Button>

          

            

            {/* Department Filter Dropdown */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                กรองตามแผนก
              </h4>
              <Dropdown 
                classNames={{
                  content: "max-h-80 overflow-y-auto bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl",
                  trigger: "w-full"
                }}
                placement="bottom-start"
              >
                <DropdownTrigger>
                  <Button
                    color="primary"
                    variant="bordered"
                    className="w-full justify-between bg-white/80 backdrop-blur-sm border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 text-xs sm:text-sm"
                    endContent={
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    }
                    startContent={
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    }
                  >
                    <span className="truncate">
                      {selectedDepartment === 'all' ? 'ทั้งหมด' : selectedDepartment}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Department filter"
                  onAction={(key) => handleDepartmentSelect(key as string)}
                  items={[
                    { key: 'all', label: 'ทั้งหมด', icon: '🏢' },
                    ...departmentNames.map(deptName => ({ 
                      key: deptName, 
                      label: deptName,
                      icon: '🏥'
                    }))
                  ]}
                  classNames={{
                    base: "max-h-80 overflow-y-auto",
                    list: "py-2"
                  }}
                >
                  {(item) => (
                    <DropdownItem 
                      key={item.key}
                      className="flex items-center space-x-2 sm:space-x-3 py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-blue-50/80 transition-colors duration-150"
                      startContent={
                        <span className="text-sm sm:text-lg">{item.icon}</span>
                      }
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
              
              {/* Selected Department Info
              {selectedDepartment !== 'all' && (
                <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-blue-700 font-medium">
                      แสดงเฉพาะ: {selectedDepartment}
                    </span>
                  </div>
                </div>
            )} */}
            </div>
          </div>
        </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:ml-0">
          <div className="max-w-6xl mx-auto">
            {/* Departments Overview Section - ย้ายขึ้นมาบนสุด */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                <div className="mb-2 sm:mb-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  ตำแหน่งงานที่เปิดรับสมัคร
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    ข้อมูลฝ่ายและตำแหน่งที่เปิดรับสมัคร
                  </p>
                </div>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="ค้นหาตำแหน่งงาน, ฝ่าย, วุฒิการศึกษา..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-sm text-gray-600">
                    ผลการค้นหา: {filteredDepartments.length} รายการ
                  </div>
                )}
              </div>

              {/* Departments Cards - แสดง 9 cards */}
              {departmentsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner size="lg" color="primary" />
                  <span className="ml-3 text-gray-600">กำลังโหลดข้อมูลฝ่าย...</span>
            </div>
              ) : (
                <>
                  {filteredDepartments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m-6 4h6m-6 4h6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery ? 'ไม่พบผลการค้นหา' : 'ไม่มีข้อมูลฝ่าย'}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery 
                          ? `ไม่พบตำแหน่งงานที่ตรงกับ "${searchQuery}"` 
                          : 'ยังไม่มีข้อมูลฝ่ายที่เปิดรับสมัคร'
                        }
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => handleSearchChange('')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ล้างการค้นหา
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                    {currentDepartments.map((dept: any) => (
                      <Card key={dept.id} className="shadow-lg hover:shadow-xl transition-transform duration-300 border-0 bg-white/80 backdrop-blur-sm relative rounded-xl hover:-translate-y-1">
                        {/* New Badge for recently added departments */}
                        {(() => {
                          const createdDate = new Date(dept.createdAt || dept.updatedAt || '2024-01-01')
                          const now = new Date()
                          const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                          return daysDiff <= 7 ? (
                            <div className="absolute -top-2 -right-2 z-10">
                              <Chip color="success" variant="solid" size="sm" className="text-xs font-medium">
                                
                              </Chip>
                            </div>
                          ) : null
                        })()}
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                                ตำแหน่ง: {dept.positions || 'ไม่ระบุตำแหน่ง'}
                          </h3>
                              {/* <p className="text-sm text-gray-600 line-clamp-2">
                                {dept.description}
                              </p> */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-2 sm:space-y-3">
                            {/* ชื่อฝ่าย */}
                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-gray-600 truncate font-medium">ฝ่าย: {dept.name}</span>
                            </div>

                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-gray-600 truncate">จำนวนที่เปิดรับสมัคร: {dept.employeeCount} ตำแหน่ง</span>
                            </div>

                            {/* ฝ่ายและกลุ่มงานในโรงพยาบาล - ดึงข้อมูลจาก resume-deposit */}
                            {(() => {
                              const deptInfo = getDepartmentInfo(dept.name);
                              return (
                                <>
                                  {/* <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="text-gray-600 truncate">ฝ่าย: {deptInfo.department}</span>
                                  </div> */}

                                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-gray-600 truncate">กลุ่มงาน: {deptInfo.workGroup}</span>
                                  </div>

                                  {/* <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                    </svg>
                                    <span className="text-gray-600 truncate">ตำแหน่งที่สมัคร: {deptInfo.appliedPosition}</span>
                                  </div> */}
                                </>
                              );
                            })()}

                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                              </svg>
                              <span className="text-gray-600 truncate">วุฒิการศึกษา: {dept.education || 'ไม่ระบุ'}</span>
                            </div>

                            {/* จำนวนผู้ผ่านการพิจารณา */}
                            {/* <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-green-600 font-medium truncate">
                                ผู้ผ่านการพิจารณา: {approvedCounts[dept.name] || 0} คน
                              </span>
                            </div> */}
                      
                     


                      {/* วันที่เปิดรับสมัคร */}
                      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600 truncate">เปิดรับสมัคร: {dept.applicationStartDate ? new Date(dept.applicationStartDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                    </div>

                                            {/* วันที่ปิดรับสมัคร */}
                      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600 truncate">ปิดรับสมัคร: {dept.applicationEndDate ? new Date(dept.applicationEndDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                  </div>

                      {/* วันที่เพิ่มแผนก */}
                      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 truncate">เพิ่มเมื่อ: {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                      </div>

                      <div className="flex flex-row space-x-2 pt-2">
                    {/* ปุ่มสมัครงาน - disable เมื่อหมดเวลารับสมัคร */}
                    <Button
                      color="primary"
                      variant="solid"
                      size="sm"
                      disabled={isApplicationExpired(dept.applicationEndDate)}
                      className={`flex-1 text-xs sm:text-sm border-0 rounded-xl text-white ${
                        isApplicationExpired(dept.applicationEndDate) 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : userHasResume 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-300 text-gray-600'
                      }`}
                      isLoading={applyingDeptId === String(dept.id) || resumeDepositLoading}
                      onClick={() => {
                        if (isApplicationExpired(dept.applicationEndDate)) {
                          alert('หมดเวลารับสมัครแล้ว');
                          return;
                        }
                        setApplyingDeptId(String(dept.id))
                        if (!userHasResume) {
                          alert('กรุณาฝากประวัติก่อนทำการสมัครงาน')
                          try {
                            const userId = (session as any)?.user?.id || ''
                            const email = (session as any)?.user?.email || ''
                            const params = new URLSearchParams()
                            if (userId) params.set('resumeUserId', String(userId))
                            else if (email) params.set('resumeEmail', String(email))
                            const url = params.toString() ? `/register?${params.toString()}` : '/register'
                            router.push(url)
                          } catch {
                            router.push('/register')
                          }
                          setApplyingDeptId(null)
                          return
                        }
                        try {
                          const userId = (session as any)?.user?.id || ''
                          const email = (session as any)?.user?.email || ''
                          const params = new URLSearchParams()
                          params.set('department', encodeURIComponent(dept.name))
                          params.set('departmentId', String(dept.id))
                          if (userId) params.set('resumeUserId', String(userId))
                          else if (email) params.set('resumeEmail', String(email))
                          router.push(`/register?${params.toString()}`)
                        } catch {
                          router.push(`/register?department=${encodeURIComponent(dept.name)}&departmentId=${dept.id}`)
                        }
                      }}
                    >
                      {isApplicationExpired(dept.applicationEndDate) 
                        ? 'หมดเวลารับสมัคร' 
                        : resumeDepositLoading 
                          ? 'กำลังตรวจสอบ...' 
                          : (userHasResume ? 'สมัครงาน' : 'ฝากประวัติก่อน')
                      }
                    </Button>
                    
                    {/* ปุ่มรายละเอียด */}
                    <Button
                      color="secondary"
                      variant="solid"
                      size="sm"
                      className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs sm:text-sm border-0 rounded-xl"
                      onClick={() => openDetail(dept)}
                    >
                      รายละเอียด
                    </Button>
                    
                    {/* ปุ่มประกาศรายชื่อ - แสดงเมื่อหมดเวลารับสมัคร */}
                    {isApplicationExpired(dept.applicationEndDate) && (
                      <Button
                        color="success"
                        variant="solid"
                        size="sm"
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 text-xs sm:text-sm border-0 rounded-xl"
                        onClick={() => openAnnouncement(dept)}
                      >
                        ประกาศรายชื่อ
                      </Button>
                    )}
                      </div>
                  </div>
                </CardBody>
              </Card>
              ))}
            </div>
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8">
                          {/* Previous Button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            ‹
                          </button>

                          {/* Page Numbers */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current page
                            const shouldShow = 
                              page === 1 || 
                              page === totalPages || 
                              Math.abs(page - currentPage) <= 1

                            if (!shouldShow) {
                              // Show ellipsis
                              if (page === 2 && currentPage > 4) {
                                return (
                                  <span key={page} className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 text-xs sm:text-sm">
                                    ...
                                  </span>
                                )
                              }
                              if (page === totalPages - 1 && currentPage < totalPages - 3) {
                                return (
                                  <span key={page} className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 text-xs sm:text-sm">
                                    ...
                                  </span>
                                )
                              }
                              return null
                            }

                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}

                          {/* Next Button */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                              currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            ›
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>


        </div>
        </main>
      </div>

    
      {/* Detail Modal */}
      {isDetailOpen && detailDepartment && (
        <Modal 
          isOpen={isDetailOpen} 
          onClose={closeDetail}
          size="full"
          classNames={{
            backdrop: "bg-white/80 backdrop-blur-sm",
            base: "bg-white shadow-2xl h-[95vh] w-[95vw] max-w-none",
            body: "bg-white overflow-y-auto h-[80vh]",
            header: "bg-white",
            footer: "bg-white",
          }}
          hideCloseButton={true}
        >
        <ModalContent>
            <ModalHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">{(detailDepartment as any).name}</span>
                {/* <span className="text-xs text-gray-500">รายละเอียดและเอกสารแนบ</span> */}
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={closeDetail}
                className="text-gray-500 hover:text-gray-700 text-2xl rounded-lg transition-colors hover:bg-blue-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </ModalHeader>
          <ModalBody>
              <div className="space-y-4">
                {/* <p className="text-sm text-gray-700">{(detailDepartment as any).description}</p> */}

                {/* Attachments viewer */}
                {Array.isArray((detailDepartment as any).attachments) && (detailDepartment as any).attachments.length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-6">
                      {((detailDepartment as any).attachments as any[]).map((att: any, idx: number) => {
                        const url = buildFileUrl(att)
                        const label = att?.filename || att?.fileName || 'ไฟล์แนบ'
                        if (isImage(url)) {
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-center">
                                <img src={url} alt={label} className="max-w-xl max-h-200 rounded border object-contain" />
                              </div>
                            </div>
                          )
                        }
                        if (isPdf(url)) {
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-center">
                                <iframe src={url} title={label} className="w-full max-w-5xl h-[80vh] border rounded" />
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div key={idx} className="text-sm">
                            <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{label}</a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">ไม่มีไฟล์แนบ</div>
                )}
            </div>
          </ModalBody>
            {/* <ModalFooter>
              <Button variant="light" onPress={closeDetail}>ปิด</Button>
            </ModalFooter> */}
        </ModalContent>
      </Modal>
      )}

      {/* Announcement Modal - แสดงรายชื่อผู้ผ่านการสมัคร */}
      {isAnnouncementOpen && (
        <Modal 
          isOpen={isAnnouncementOpen} 
          onClose={closeAnnouncement} 
          size="5xl" 
          scrollBehavior="inside"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black/50 backdrop-blur-sm",
            base: "backdrop-blur-sm"
          }}
        >
          <ModalContent className="bg-white shadow-2xl">
            <ModalHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">ประกาศรายชื่อผู้ผ่านการสมัคร</h3>
                  <p className="text-sm text-green-100">
                    {announcementDepartment?.name} - {approvedApplicants.length} คน
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="bg-white p-6">
              {loadingApplicants ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" color="primary" />
                  <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
                </div>
              ) : approvedApplicants.length > 0 ? (
                <div className="space-y-4">
                  {/* สถิติ */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-green-800">สรุปผลการประกาศ</h4>
                        <p className="text-green-600">จำนวนผู้ผ่านการสมัคร: {approvedApplicants.length} คน</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">วันที่ประกาศ: {new Date().toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>
                  </div>

                  {/* ตารางรายชื่อ */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">ลำดับ</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">ชื่อ-นามสกุล</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">ตำแหน่งที่สมัคร</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">เบอร์โทรศัพท์</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">อีเมล</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">สถานะ</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">วันที่สมัคร</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedApplicants.map((applicant, index) => (
                          <tr key={applicant.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                              {applicant.prefix} {applicant.firstName} {applicant.lastName}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                              {applicant.expectedPosition || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                              {applicant.phone || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                              {applicant.email || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                              <Chip
                                color="success"
                                variant="flat"
                                size="sm"
                                className="text-xs"
                              >
                                ผ่านการพิจารณา
                              </Chip>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                              {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString('th-TH') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ปุ่มพิมพ์ */}
                  {/* <div className="flex justify-center gap-4 mt-6">
                    <Button
                      color="primary"
                      variant="solid"
                      size="lg"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => window.print()}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      พิมพ์รายชื่อ
                    </Button>
                  </div> */}

                  {/* หมายเหตุ */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">หมายเหตุ</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• รายชื่อผู้ผ่านการสมัครจะได้รับการติดต่อกลับในขั้นตอนต่อไป</li>
                      <li>• หากมีข้อสงสัย กรุณาติดต่อฝ่ายทรัพยากรบุคคล</li>
                      <li>• ข้อมูลนี้เป็นข้อมูลล่าสุด ณ วันที่ประกาศ</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีรายชื่อผู้ผ่านการสมัคร</h3>
                  <p className="text-gray-500">กรุณาติดต่อฝ่ายทรัพยากรบุคคลเพื่อตรวจสอบข้อมูล</p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-gray-50">
              <Button 
                color="default" 
                variant="light" 
                onPress={closeAnnouncement}
                className="mr-2"
              >
                ปิด
              </Button>
              {/* <Button 
                color="primary" 
                onPress={() => {
                  // ฟังก์ชันพิมพ์หรือส่งออกข้อมูล
                  window.print();
                }}
              >
                พิมพ์รายชื่อ
              </Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Renew Contract Modal */}
      {isRenewOpen && (
        <Modal 
          isOpen={isRenewOpen} 
          onClose={closeRenewModal} 
          size="xl" 
          scrollBehavior="inside"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black/50 backdrop-blur-sm",
            base: "backdrop-blur-sm"
          }}
        >
          <ModalContent className="bg-white shadow-2xl">
            <ModalHeader className="bg-white">
              <div>
                <h3 className="text-lg font-semibold">ต่อสัญญา</h3>
                <p className="text-sm text-gray-600">กรอกข้อมูลผู้ขอและแนบไฟล์ที่เกี่ยวข้อง</p>
              </div>
            </ModalHeader>
            <ModalBody className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">คำนำหน้า</label>
                      <Select
                        selectedKeys={renewForm.prefix ? [renewForm.prefix] : []}
                        onSelectionChange={(keys) => {
                          const key = Array.from(keys)[0] as string
                          setRenewForm((p) => ({ ...p, prefix: key }))
                        }}
                        placeholder="เลือกคำนำหน้า"
                        variant="bordered"
                        classNames={{
                          base: "mt-1",
                          trigger: "h-10 bg-white border border-gray-300 rounded-md data-[hover=true]:border-blue-400 data-[open=true]:border-blue-500",
                          value: "text-gray-800 truncate pr-2",
                          innerWrapper: "pr-14", /* เว้นที่ด้านขวาเพิ่มเพื่อไม่ให้ placeholder ทับไอคอน */
                          selectorIcon: "text-gray-500 right-3",
                          popoverContent: "bg-white border border-gray-200 shadow-xl rounded-lg",
                          listbox: "max-h-60"
                        }}
                      >
                        <SelectItem key="นาย">นาย</SelectItem>
                        <SelectItem key="นาง">นาง</SelectItem>
                        <SelectItem key="นางสาว">นางสาว</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ชื่อ</label>
                      <Input value={renewForm.firstName} onChange={(e) => setRenewForm((p)=>({ ...p, firstName: e.target.value }))} placeholder="กรอกชื่อ" className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">นามสกุล</label>
                      <Input value={renewForm.lastName} onChange={(e) => setRenewForm((p)=>({ ...p, lastName: e.target.value }))} placeholder="กรอกนามสกุล" className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">หน่วยงาน</label>
                  <Input value={renewForm.department} onChange={(e) => setRenewForm((p)=>({ ...p, department: e.target.value }))} placeholder="กรอกหน่วยงาน" className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                  <Input value={renewForm.position} onChange={(e) => setRenewForm((p)=>({ ...p, position: e.target.value }))} placeholder="กรอกตำแหน่ง" className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">วันที่เริ่มสัญญาใหม่</label>
                  <Input 
                    type="date"
                    value={renewForm.newStartDate} 
                    onChange={(e) => setRenewForm((p)=>({ ...p, newStartDate: e.target.value }))} 
                    className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดสัญญาใหม่</label>
                  <Input 
                    type="date"
                    value={renewForm.newEndDate} 
                    onChange={(e) => setRenewForm((p)=>({ ...p, newEndDate: e.target.value }))} 
                    className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-700">เงินเดือนใหม่</label>
                  <Input value={renewForm.newSalary} onChange={(e) => setRenewForm((p)=>({ ...p, newSalary: e.target.value }))} placeholder="กรอกเงินเดือนใหม่" className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" />
                </div> */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">หมายเหตุ</label>
                  <textarea 
                    value={renewForm.notes} 
                    onChange={(e) => setRenewForm((p)=>({ ...p, notes: e.target.value }))} 
                    placeholder="กรอกหมายเหตุเพิ่มเติม" 
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none" 
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">แนบไฟล์ (PDF/รูปภาพ)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setRenewFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {renewFile && (
                    <div className="text-xs text-gray-600 mt-1">ไฟล์: {renewFile.name}</div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-white">
              <Button 
                color="danger" 
                variant="light" 
                onPress={closeRenewModal}
                isDisabled={isSubmitting}
                className="rounded-lg transition-colors hover:bg-blue-50"
              >
                ยกเลิก
              </Button>
              <Button 
                color="success" 
                onPress={handleSubmitRenewal}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                className="rounded-lg transition-colors hover:bg-blue-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

    </div>
  )
} 