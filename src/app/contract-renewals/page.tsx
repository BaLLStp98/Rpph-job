'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Button, Chip, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { EyeIcon, CheckIcon, XMarkIcon, DocumentIcon, DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface ContractRenewal {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  newStartDate: string | null
  newEndDate: string | null
  contractStartDate: string | null
  contractEndDate: string | null
  newSalary: string | null
  notes: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  attachments: Array<{
    id: number
    fileName: string
    filePath: string
    mimeType: string | null
    fileSize: number | null
  }>
}

export default function ContractRenewalsPage() {
  const router = useRouter()
  const [contractRenewals, setContractRenewals] = useState<ContractRenewal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRenewal, setSelectedRenewal] = useState<ContractRenewal | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // editable fields in modal
  const [editStatus, setEditStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [editNotes, setEditNotes] = useState<string>('')

  // ดึงข้อมูลการต่อสัญญา
  const fetchContractRenewals = async () => {
    try {
      setLoading(true)
      const url = statusFilter === 'all'
        ? '/api/contract-renewals'
        : `/api/contract-renewals?status=${encodeURIComponent(statusFilter)}`
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setContractRenewals(result.data)
      } else {
        console.error('Error fetching contract renewals:', result.error || result.message || result)
      }
    } catch (error) {
      console.error('Error fetching contract renewals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContractRenewals()
  }, [statusFilter])

  // เปิด modal รายละเอียด
  const openDetail = (renewal: ContractRenewal) => {
    setSelectedRenewal(renewal)
    setEditStatus(renewal.status)
    setEditNotes(renewal.notes || '')
    setIsDetailOpen(true)
  }

  // ปิด modal
  const closeDetail = () => {
    setIsDetailOpen(false)
    setSelectedRenewal(null)
  }

  // อัปเดตสถานะ
  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/contract-renewals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('อัปเดตสถานะเรียบร้อยแล้ว')
        fetchContractRenewals()
        closeDetail()
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการอัปเดต')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('เกิดข้อผิดพลาดในการอัปเดต')
    } finally {
      setIsUpdating(false)
    }
  }

  // Save edits (status + notes)
  const handleSave = async () => {
    if (!selectedRenewal) return
    try {
      setIsSaving(true)
      const response = await fetch(`/api/contract-renewals/${selectedRenewal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: editStatus, notes: editNotes })
      })
      const result = await response.json()
      if (result.success) {
        await fetchContractRenewals()
        closeDetail()
      } else {
        alert(result.error || 'บันทึกไม่สำเร็จ')
      }
    } catch (e) {
      console.error(e)
      alert('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete record
  const handleDelete = async () => {
    if (!selectedRenewal) return
    if (!confirm('ยืนยันการลบรายการต่อสัญญานี้?')) return
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/contract-renewals/${selectedRenewal.id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        await fetchContractRenewals()
        closeDetail()
      } else {
        alert(result.error || 'ลบไม่สำเร็จ')
      }
    } catch (e) {
      console.error(e)
      alert('เกิดข้อผิดพลาดในการลบ')
    } finally {
      setIsDeleting(false)
    }
  }

  // แปลงสถานะเป็นภาษาไทย
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'รอดำเนินการ'
      case 'APPROVED': return 'อนุมัติ'
      case 'REJECTED': return 'ปฏิเสธ'
      default: return status
    }
  }

  // แปลงสถานะเป็นสี
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning'
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'danger'
      default: return 'default'
    }
  }

  // แปลงวันที่
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('th-TH')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">ประวัติการต่อสัญญา</h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600">ติดตามสถานะคำขอและดูรายละเอียดการต่อสัญญาอย่างเป็นระเบียบ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mr-2">
                <span>ทั้งหมด:</span>
                <span className="px-2 py-0.5 rounded-full bg-white/80 border text-gray-700">{contractRenewals.length}</span>
              </div>
              <Button
                color="primary"
                variant="ghost"
                startContent={<ArrowLeftIcon className="w-5 h-5" />}
                onPress={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-lg"
              >
                กลับไปหน้า Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Filter */}
        

        {/* Cards */}
        {loading ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardBody>
              <div className="flex justify-center py-10">
                <Spinner size="lg" color="primary" />
              </div>
            </CardBody>
          </Card>
        ) : contractRenewals.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardBody>
              <div className="py-12 flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-blue-50 text-blue-500">
                  <DocumentIcon className="w-8 h-8" />
                </div>
                <div className="text-gray-800 font-medium">ยังไม่มีประวัติการต่อสัญญา</div>
                <div className="text-gray-500 text-sm">เมื่อมีคำขอ ระบบจะแสดงรายการที่นี่</div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {contractRenewals.map((renewal) => (
              <Card key={renewal.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400" />
                <CardHeader className="flex items-start justify-between gap-3 pb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{renewal.employeeName}</h3>
                    <div className="text-xs text-gray-500 mt-0.5">ยื่นคำขอ: {formatDate(renewal.createdAt)}</div>
                  </div>
                  <Chip color={getStatusColor(renewal.status)} size="sm" variant="flat">
                    {getStatusText(renewal.status)}
                  </Chip>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start justify-between">
                      <span className="text-gray-600">หน่วยงาน/ตำแหน่ง</span>
                      <span className="text-gray-900 text-right">
                        {renewal.department}
                        <span className="block text-gray-500 text-xs">{renewal.position}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">สัญญาใหม่</span>
                      <span className="text-gray-900">{formatDate(renewal.newStartDate)} - {formatDate(renewal.newEndDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ไฟล์แนบ</span>
                      <span className="text-gray-900">{renewal.attachments?.length || 0} ไฟล์</span>
                    </div>
                    
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      color="primary"
                      variant="light"
                      startContent={<EyeIcon className="w-4 h-4" />}
                      onPress={() => openDetail(renewal)}
                      className="flex-1"
                    >
                      ดูรายละเอียด
                    </Button>
                    {renewal.status === 'PENDING' && (
                      <>
                        <Button size="sm" color="success" variant="flat" onPress={() => updateStatus(renewal.id, 'APPROVED')}>อนุมัติ</Button>
                        <Button size="sm" color="danger" variant="flat" onPress={() => updateStatus(renewal.id, 'REJECTED')}>ปฏิเสธ</Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Modal 
          isOpen={isDetailOpen} 
          onClose={closeDetail} 
          size="2xl" 
          scrollBehavior="inside"
          classNames={{
            backdrop: "bg-black/30 backdrop-blur-sm",
            base: "w-[95vw] max-w-[95vw] sm:max-w-3xl rounded-3xl overflow-hidden",
            body: "max-h-[70vh] sm:max-h-[75vh] overflow-y-auto",
            header: "sticky top-0 z-10 bg-white",
            footer: "sticky bottom-0 z-10 bg-white"
          }}
        >
          <ModalContent className="bg-white shadow-2xl rounded-3xl border border-gray-100">
            <ModalHeader>
              <h3 className="text-lg font-semibold">รายละเอียดการต่อสัญญา</h3>
            </ModalHeader>
            <ModalBody>
              {selectedRenewal && (
                <div className="space-y-4 bg-white p-4 rounded-lg">
                  {/* ข้อมูลพื้นฐาน (editable) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                      <Input 
                        value={selectedRenewal.employeeName}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, employeeName: e.target.value }) as any}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">หน่วยงาน</label>
                      <Input 
                        value={selectedRenewal.department}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, department: e.target.value }) as any}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                      <Input 
                        value={selectedRenewal.position}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, position: e.target.value }) as any}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                  </div>

                  {/* ข้อมูลสัญญา (editable dates) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">วันที่เริ่มสัญญาใหม่</label>
                      <Input
                        type="date"
                        value={selectedRenewal.newStartDate ? new Date(selectedRenewal.newStartDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, newStartDate: e.target.value } as any)}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดสัญญาใหม่</label>
                      <Input
                        type="date"
                        value={selectedRenewal.newEndDate ? new Date(selectedRenewal.newEndDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, newEndDate: e.target.value } as any)}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">วันที่เริ่มสัญญาเดิม</label>
                      <Input
                        type="date"
                        value={selectedRenewal.contractStartDate ? new Date(selectedRenewal.contractStartDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, contractStartDate: e.target.value } as any)}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดสัญญาเดิม</label>
                      <Input
                        type="date"
                        value={selectedRenewal.contractEndDate ? new Date(selectedRenewal.contractEndDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, contractEndDate: e.target.value } as any)}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">วันที่ยื่นคำขอ</label>
                      <Input
                        type="date"
                        value={selectedRenewal.createdAt ? new Date(selectedRenewal.createdAt).toISOString().split('T')[0] : ''}
                        onChange={(e) => setSelectedRenewal({ ...selectedRenewal, createdAt: e.target.value } as any)}
                        className="mt-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* หมายเหตุ */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">หมายเหตุ</label>
                    <textarea
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                      rows={3}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="กรอกหมายเหตุเพิ่มเติม"
                    />
                  </div>

                  {/* ไฟล์แนบ */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">ไฟล์แนบ</label>
                    <div className="space-y-2">
                      {selectedRenewal.attachments.length > 0 && selectedRenewal.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <DocumentIcon className="w-5 h-5 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachment.fileName}</span>
                          <Button
                            size="sm"
                            color="primary"
                            variant="light"
                            onPress={() => window.open(attachment.filePath, '_blank')}
                          >
                            เปิด
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={async (e) => {
                          const file = e.target.files && e.target.files[0]
                          if (!file || !selectedRenewal) return
                          const fd = new FormData()
                          fd.append('file', file)
                          const res = await fetch(`/api/contract-renewals/${selectedRenewal.id}/attachments`, {
                            method: 'POST',
                            body: fd
                          })
                          const result = await res.json()
                          if (result.success) {
                            await fetchContractRenewals()
                            // อัปเดตใน modal ทันทีหากยังเปิดอยู่
                            setSelectedRenewal((prev) => prev ? ({...prev, attachments: [...prev.attachments, result.data]}) as any : prev)
                          } else {
                            alert(result.error || 'อัปโหลดไฟล์ไม่สำเร็จ')
                          }
                        }}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={closeDetail}>
                ปิด
              </Button>
              <Button color="danger" variant="flat" onPress={handleDelete} isLoading={isDeleting}>
                ลบ
              </Button>
              <Button color="primary" onPress={handleSave} isLoading={isSaving}>
                บันทึก
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
