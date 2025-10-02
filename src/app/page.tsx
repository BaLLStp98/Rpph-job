'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner, Card, CardHeader, CardBody, Chip } from '@heroui/react'

type Department = {
  id: string
  name: string
  description?: string
  status?: string
  salary?: string
  employeeCount?: number
  education?: string
  positions?: string
  applicationStartDate?: string
  applicationEndDate?: string
}

type DeptAttachment = {
  id?: number
  path?: string
  filename?: string
  fileName?: string
  file_path?: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [attachments, setAttachments] = useState<DeptAttachment[]>([])
  const [attLoading, setAttLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    // หากเข้าสู่ระบบแล้ว ให้นำผู้ใช้ไปหน้า Dashboard ทันที
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/departments')
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = await res.json()
        const raw: any[] = (json?.data || json?.departments || (Array.isArray(json) ? json : [])) as any[]
        const list: Department[] = raw.map((d: any) => ({
          ...d,
          status: (d?.status || 'ACTIVE').toString().toLowerCase()
        }))
        setDepartments(list as Department[])
      } catch (e: any) {
        setError(e?.message || 'โหลดข้อมูลแผนกไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const openDetails = async (dep: Department) => {
    setSelectedDepartment(dep)
    setAttLoading(true)
    setAttachments([])
    onOpen()
    try {
      const res = await fetch(`/api/departments?id=${encodeURIComponent(dep.id)}`)
      const json = await res.json()
      // รองรับหลายรูปแบบผลลัพธ์
      const data = json?.data || json
      const att: DeptAttachment[] = (data?.attachments
        || data?.[0]?.attachments
        || data?.department?.attachments
        || []) as DeptAttachment[]
      setAttachments(att)
    } catch (_) {
      setAttachments([])
    } finally {
      setAttLoading(false)
    }
  }

  const buildFileUrl = (a: DeptAttachment) => {
    // รองรับทั้ง path เต็มและชื่อไฟล์; fallback ไปโฟลเดอร์ /uploads/departments
    const name = a.fileName || a.filename
    const raw = a.path || a.file_path || (name ? `/uploads/departments/${name}` : '')
    return encodeURI(raw.startsWith('/') ? raw : `/${raw}`)
  }

  const isImage = (url: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(url)
  const isPdf = (url: string) => /\.pdf(\?|#|$)/i.test(url)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-4 mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2">
          ยินดีต้อนรับสู่ RPPH Job
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          ระบบสมัครงานและจัดการโปรไฟล์ที่ทันสมัย
        </p>
        {/* <div className="pt-2">
          <Button
            color="primary"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={() => signIn('line', { callbackUrl: '/dashboard' })}
          >
            เข้าสู่ระบบด้วย LINE
          </Button>
        </div> */}
      </div>

      {/* รายการแผนกจากฐานข้อมูล */}
      <div className="w-full max-w-6xl px-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">ฝ่ายที่เปิดรับสมัคร</h2>
          {loading && <span className="text-sm text-gray-500">กำลังโหลด…</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {departments.map(dep => (
            <Card key={dep.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm relative rounded-xl">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                      {dep.name}
                    </h3>
                    {/* {dep.description && (
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{dep.description}</p>
                    )} */}
                  </div>
                  {/* {dep.status && (
                    <Chip size="sm" variant="flat" color={dep.status === 'active' ? 'success' : 'default'} className="ml-2">
                      {dep.status === 'active' ? 'เปิดใช้งาน' : dep.status === 'inactive' ? 'ปิดใช้งาน' : dep.status}
                    </Chip>
                  )} */}
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-600 truncate">จำนวนที่เปิดรับสมัคร: {dep.employeeCount ?? 0} ตำแหน่ง</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span className="text-gray-600 truncate">วุฒิการศึกษา: {dep.education || 'ไม่ระบุ'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span className="text-gray-600 truncate">ตำแหน่งที่เปิดรับสมัคร: {dep.positions || 'ไม่ระบุ'}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 truncate">เปิดรับสมัคร: {dep.applicationStartDate ? new Date(dep.applicationStartDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 truncate">ปิดรับสมัคร: {dep.applicationEndDate ? new Date(dep.applicationEndDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-3">
                  <Button 
                    color="primary" 
                    variant="solid" 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs sm:text-sm border-0 rounded-xl"
                    onClick={() => signIn('line', { callbackUrl: `/register?department=${encodeURIComponent(dep.name)}&departmentId=${encodeURIComponent(dep.id)}` })}
                  >
                    สมัครงาน
                  </Button>
                  <Button
                    color="secondary"
                    variant="solid"
                    size="sm"
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs sm:text-sm border-0 rounded-xl"
                    onClick={() => openDetails(dep)}
                  >
                    รายละเอียด
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
          {!loading && !error && departments.length === 0 && (
            <div className="col-span-full text-sm text-gray-500">ยังไม่มีข้อมูลฝ่าย</div>
          )}
        </div>
      </div>

      {/* Modal รายละเอียดแผนก */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="full"
        classNames={{
          backdrop: "bg-white/80 backdrop-blur-sm",
          base: "bg-white shadow-2xl h-[95vh] w-[95vw] max-w-none",
          body: "bg-white overflow-y-auto h-[80vh]",
          header: "bg-white",
          footer: "bg-white",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {selectedDepartment?.name || 'รายละเอียดฝ่าย'}
          </ModalHeader>
          <ModalBody>
            {!selectedDepartment ? (
              <div className="text-sm text-gray-500">ไม่พบข้อมูลฝ่าย</div>
            ) : (
              <div className="space-y-4 text-sm text-gray-700">
                {/* {selectedDepartment.description && (
                  <p className="leading-relaxed">{selectedDepartment.description}</p>
                )} */}
                {/* <div className="flex flex-wrap items-center gap-2">
                  {selectedDepartment.status && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">สถานะ: {selectedDepartment.status}</span>
                  )}
                  {selectedDepartment.salary && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">เงินเดือน: {selectedDepartment.salary}</span>
                  )}
                </div> */}

                <div>
                  {/* <h4 className="font-semibold mb-2">ไฟล์แนบ</h4> */}
                  {attLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm"><Spinner size="sm" /> กำลังโหลดไฟล์แนบ…</div>
                  ) : attachments.length === 0 ? (
                    <div className="text-gray-500 text-sm">ไม่มีไฟล์แนบ</div>
                  ) : (
                    <div className="space-y-6">
                      {attachments.map((a, idx) => {
                        const url = buildFileUrl(a)
                        const label = a.filename || a.fileName || 'ไฟล์แนบ'
                        if (isImage(url)) {
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  )}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedDepartment && (
              <div className="flex items-center gap-2 w-full justify-end">
                <Button 
                  color="primary"
                  onClick={() => signIn('line', { callbackUrl: `/register?department=${encodeURIComponent(selectedDepartment.name)}&departmentId=${encodeURIComponent(selectedDepartment.id)}` })}
                >
                  สมัครงาน
                </Button>
                {/* <Link href={`/departments?id=${encodeURIComponent(selectedDepartment.id)}`}>
                  <Button variant="bordered">ดูรายละเอียดหน้าแผนก</Button>
                </Link> */}
                <Button variant="light" onClick={onClose}>ปิด</Button>
              </div>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-xs sm:text-sm px-2">
        <p>&copy; 2024 RPPH Job. All rights reserved.</p>
      </div>
    </div>
  )
}
