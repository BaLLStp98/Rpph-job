'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner
} from '@heroui/react';
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface ResumeDeposit {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  expectedPosition: string;
  expectedSalary: string;
  status: string;
  createdAt: string;
  education: Array<{
    level: string;
    school: string;
    major: string;
    gpa: number;
  }>;
  workExperience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    salary: string;
  }>;
}

export default function ResumeDepositsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [resumeDeposits, setResumeDeposits] = useState<ResumeDeposit[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeDeposit | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Fetch resume deposits
  const fetchResumeDeposits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`/api/resume-deposit?${params}`);
      
      if (response.ok) {
        const result = await response.json();
        setResumeDeposits(result.data);
        setTotalPages(result.pagination.pages);
      } else {
        console.error('Failed to fetch resume deposits');
      }
    } catch (error) {
      console.error('Error fetching resume deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeDeposits();
  }, [page, search, statusFilter]);

  // Handle view details
  const handleViewDetails = (resume: ResumeDeposit) => {
    setSelectedResume(resume);
    onOpen();
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/resume-deposit/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchResumeDeposits();
        alert('อัปเดตสถานะเรียบร้อยแล้ว');
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'REVIEWING': return 'primary';
      case 'CONTACTED': return 'success';
      case 'HIRED': return 'success';
      case 'REJECTED': return 'danger';
      case 'ARCHIVED': return 'default';
      default: return 'default';
    }
  };

  // Status text mapping
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'รอดำเนินการ';
      case 'REVIEWING': return 'กำลังพิจารณา';
      case 'CONTACTED': return 'ติดต่อแล้ว';
      case 'HIRED': return 'รับเข้าทำงาน';
      case 'REJECTED': return 'ไม่เหมาะสม';
      case 'ARCHIVED': return 'เก็บถาวร';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">จัดการการฝากประวัติ</h1>
                <p className="text-gray-600">รายการผู้ที่ฝากประวัติเพื่อรอการติดต่อ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="ghost"
                startContent={<ArrowLeftIcon className="w-5 h-5" />}
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              >
                กลับไปหน้า Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อ, อีเมล, เบอร์โทร, ตำแหน่งที่ต้องการ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  placeholder="กรองตามสถานะ"
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string || '')}
                  startContent={<FunnelIcon className="w-5 h-5 text-gray-400" />}
                >
                  <SelectItem key="">ทุกสถานะ</SelectItem>
                  <SelectItem key="PENDING">รอดำเนินการ</SelectItem>
                  <SelectItem key="REVIEWING">กำลังพิจารณา</SelectItem>
                  <SelectItem key="CONTACTED">ติดต่อแล้ว</SelectItem>
                  <SelectItem key="HIRED">รับเข้าทำงาน</SelectItem>
                  <SelectItem key="REJECTED">ไม่เหมาะสม</SelectItem>
                  <SelectItem key="ARCHIVED">เก็บถาวร</SelectItem>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Resume Deposits Table */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">รายการการฝากประวัติ</h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              <>
                <Table aria-label="Resume deposits table">
                  <TableHeader>
                    <TableColumn>ชื่อ-นามสกุล</TableColumn>
                    <TableColumn>ติดต่อ</TableColumn>
                    <TableColumn>ตำแหน่งที่ต้องการ</TableColumn>
                    <TableColumn>เงินเดือนที่ต้องการ</TableColumn>
                    <TableColumn>สถานะ</TableColumn>
                    <TableColumn>วันที่ฝาก</TableColumn>
                    <TableColumn>การจัดการ</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {resumeDeposits.map((resume) => (
                      <TableRow key={resume.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {resume.prefix} {resume.firstName} {resume.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{resume.email}</div>
                            <div className="text-gray-500">{resume.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {resume.expectedPosition || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {resume.expectedSalary || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={getStatusColor(resume.status)}
                            variant="flat"
                            size="sm"
                          >
                            {getStatusText(resume.status)}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(resume.createdAt).toLocaleDateString('th-TH')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="flat"
                              color="primary"
                              isIconOnly
                              onPress={() => handleViewDetails(resume)}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      page={page}
                      total={totalPages}
                      onChange={setPage}
                      showControls
                    />
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>

        {/* Details Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="5xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              <h3 className="text-xl font-semibold">
                รายละเอียดการฝากประวัติ - {selectedResume?.prefix} {selectedResume?.firstName} {selectedResume?.lastName}
              </h3>
            </ModalHeader>
            <ModalBody>
              {selectedResume && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">ข้อมูลส่วนตัว</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>ชื่อ-นามสกุล:</strong> {selectedResume.prefix} {selectedResume.firstName} {selectedResume.lastName}</div>
                      <div><strong>อีเมล:</strong> {selectedResume.email}</div>
                      <div><strong>เบอร์โทร:</strong> {selectedResume.phone}</div>
                      <div><strong>ตำแหน่งที่ต้องการ:</strong> {selectedResume.expectedPosition || '-'}</div>
                      <div><strong>เงินเดือนที่ต้องการ:</strong> {selectedResume.expectedSalary || '-'}</div>
                    </div>
                  </div>

                  {/* Education */}
                  {selectedResume.education && selectedResume.education.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">ประวัติการศึกษา</h4>
                      <div className="space-y-2">
                        {selectedResume.education.map((edu, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div><strong>ระดับ:</strong> {edu.level}</div>
                            <div><strong>สถานศึกษา:</strong> {edu.school}</div>
                            {edu.major && <div><strong>สาขา:</strong> {edu.major}</div>}
                            {edu.gpa && <div><strong>เกรดเฉลี่ย:</strong> {edu.gpa}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Experience */}
                  {selectedResume.workExperience && selectedResume.workExperience.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">ประสบการณ์การทำงาน</h4>
                      <div className="space-y-2">
                        {selectedResume.workExperience.map((work, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div><strong>ตำแหน่ง:</strong> {work.position}</div>
                            <div><strong>บริษัท:</strong> {work.company}</div>
                            <div><strong>ระยะเวลา:</strong> {work.startDate} - {work.endDate || 'ปัจจุบัน'}</div>
                            {work.salary && <div><strong>เงินเดือน:</strong> {work.salary}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">อัปเดตสถานะ</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        color="warning"
                        variant="flat"
                        onPress={() => handleStatusUpdate(selectedResume.id, 'REVIEWING')}
                      >
                        กำลังพิจารณา
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        onPress={() => handleStatusUpdate(selectedResume.id, 'CONTACTED')}
                      >
                        ติดต่อแล้ว
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        variant="solid"
                        onPress={() => handleStatusUpdate(selectedResume.id, 'HIRED')}
                      >
                        รับเข้าทำงาน
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleStatusUpdate(selectedResume.id, 'REJECTED')}
                      >
                        ไม่เหมาะสม
                      </Button>
                      <Button
                        size="sm"
                        color="default"
                        variant="flat"
                        onPress={() => handleStatusUpdate(selectedResume.id, 'ARCHIVED')}
                      >
                        เก็บถาวร
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                ปิด
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
