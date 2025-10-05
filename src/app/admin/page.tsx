'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Chip,
  Avatar,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  UserIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

interface ApplicationData {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  age: number;
  race: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  idNumber: string;
  idCardIssuedAt: string;
  idCardIssueDate: string;
  idCardExpiryDate: string;
  addressAccordingToHouseRegistration: string;
  currentAddress: string;
  emergencyContact: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAddress: string;
  appliedPosition: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  // ข้อมูลการสมัครงาน
  expectedSalary?: string;
  availableDate?: string;
  // ข้อมูลการศึกษา
  education?: Array<{
    level: string;
    degree: string;
    major: string;
    institution: string;
    school: string;
    year?: string;
    endYear?: string;
    gpa?: string;
  }>;
  // ข้อมูลประสบการณ์ทำงาน
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    district: string;
    province: string;
    phone: string;
    reason: string;
    description?: string;
    salary?: string;
  }>;
  // ข้อมูลการรับราชการก่อนหน้า
  previousGovernmentService?: Array<{
    position: string;
    department: string;
    reason: string;
    date: string;
    type?: string;
  }>;
  // ข้อมูลเพิ่มเติม
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  // ข้อมูลคู่สมรส
  spouseInfo?: {
    firstName: string;
    lastName: string;
  };
  // ข้อมูลที่ทำงานฉุกเฉิน
  emergencyWorkplace?: {
    name: string;
    district: string;
    province: string;
    phone: string;
  };
}

export default function AdminPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  
  // Modal controls
  const { isOpen: isDetailModalOpen, onOpen: onDetailModalOpen, onOpenChange: onDetailModalOpenChange } = useDisclosure();

  // สถิติ
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 กำลังดึงข้อมูลใบสมัครงานจาก /api/resume-deposit...');
      
      const response = await fetch('/api/resume-deposit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Response Data:', responseData);
        
        // ตรวจสอบ response structure
        if (responseData.success && responseData.data) {
          const data = responseData.data;
          console.log('✅ ดึงข้อมูลสำเร็จ:', data);
          setApplications(data);
          
          // คำนวณสถิติ
          const newStats = {
            total: data.length,
            pending: data.filter((app: ApplicationData) => app.status === 'pending').length,
            approved: data.filter((app: ApplicationData) => app.status === 'approved').length,
            rejected: data.filter((app: ApplicationData) => app.status === 'rejected').length
          };
          setStats(newStats);
          console.log('📊 สถิติ:', newStats);
        } else {
          console.error('❌ Invalid response structure:', responseData);
          setError('รูปแบบข้อมูลไม่ถูกต้อง');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch applications:', response.status, errorText);
        setError(`ไม่สามารถดึงข้อมูลได้ (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (application: ApplicationData) => {
    setSelectedApplication(application);
    onDetailModalOpen();
    
    // Debug: ตรวจสอบข้อมูล profileImage
    console.log('🔍 Selected Application:', application);
    console.log('🔍 Profile Image:', application.profileImage);
    console.log('🔍 Profile Image Type:', typeof application.profileImage);
    console.log('🔍 Profile Image Length:', application.profileImage?.length);
    
    // ดึงข้อมูลเอกสารแนบ
    try {
      const response = await fetch(`/api/resume-documents?applicationId=${application.id}`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
          setUploadedDocuments(responseData.data);
          console.log('📄 Uploaded Documents:', responseData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedApplication(null);
    setShowDetailModal(false);
  };

  const handlePreviewFile = (filePath: string, fileName: string) => {
    setPreviewFile({
      url: filePath,
      name: fileName,
      type: fileName.split('.').pop()?.toLowerCase() || 'unknown'
    });
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/resume-deposit/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          await fetchApplications();
          alert(`อัปเดตสถานะเป็น: ${getStatusText(newStatus)}`);
          handleCloseDetailModal();
        } else {
          throw new Error(responseData.message || 'Failed to update status');
        }
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติ',
      rejected: 'ปฏิเสธ'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return colorMap[status] || 'default';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appliedPosition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลใบสมัครงาน...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              color="primary"
              onPress={fetchApplications}
              startContent={<ArrowPathIcon className="w-4 h-4" />}
            >
              ลองใหม่
            </Button>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
            <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">ระบบจัดการใบสมัครงาน</h1>
            <p className="mt-2 text-gray-600">จัดการและติดตามสถานะใบสมัครงาน</p>
          </div>
                      <div className="flex items-center gap-4">
              <Button
              color="primary"
              startContent={<ArrowPathIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
              onPress={fetchApplications}
                size="sm"
              className="lg:size-md"
            >
              รีเฟรช
              </Button>
            </div>
          </div>
        </div>

      <div className="space-y-8">
          {/* สถิติ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm lg:text-base">ทั้งหมด</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.total}</p>
                </div>
                <UsersIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm lg:text-base">รอดำเนินการ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.pending}</p>
                </div>
                <ClockIcon className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm lg:text-base">อนุมัติ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm lg:text-base">ปฏิเสธ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.rejected}</p>
                </div>
                <XCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-red-200" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ฟิลเตอร์และค้นหา */}
        <Card>
          <CardBody className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือตำแหน่ง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />}
                  className="w-full"
                  size="sm"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  placeholder="กรองตามสถานะ"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                  className="w-full lg:w-48"
                  size="sm"
                >
                  <SelectItem key="all">ทั้งหมด</SelectItem>
                  <SelectItem key="pending">รอดำเนินการ</SelectItem>
                  <SelectItem key="approved">อนุมัติ</SelectItem>
                  <SelectItem key="rejected">ปฏิเสธ</SelectItem>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ตารางข้อมูล */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">รายการใบสมัครงาน</h2>
          </CardHeader>
          <CardBody>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">ไม่มีข้อมูลใบสมัครงาน</h3>
                <p className="text-gray-500 mb-4">
                  {applications.length === 0 
                    ? 'ยังไม่มีใบสมัครงานในระบบ' 
                    : 'ไม่พบข้อมูลที่ตรงกับการค้นหา'
                  }
                </p>
                {applications.length === 0 && (
                  <Button
                    color="primary"
                    onPress={fetchApplications}
                    startContent={<ArrowPathIcon className="w-4 h-4" />}
                  >
                    รีเฟรชข้อมูล
                  </Button>
                )}
              </div>
            ) : (
              <Table aria-label="Applications table">
                <TableHeader>
                  <TableColumn>ชื่อ-นามสกุล</TableColumn>
                  <TableColumn>ตำแหน่งที่สมัคร</TableColumn>
                  <TableColumn>ฝ่าย/กลุ่มงาน</TableColumn>
                  <TableColumn>สถานะ</TableColumn>
                  <TableColumn>วันที่สมัคร</TableColumn>
                  <TableColumn>การดำเนินการ</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={application.profileImage}
                          name={`${application.firstName} ${application.lastName}`}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">
                            {application.prefix} {application.firstName} {application.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{application.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{application.appliedPosition}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-600">{application.department}</p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(application.status) as any}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(application.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {new Date(application.createdAt).toLocaleDateString('th-TH')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        color="primary"
                          variant="flat"
                        startContent={<EyeIcon className="w-4 h-4" />}
                          onPress={() => handleViewDetails(application)}
                      >
                        ดูรายละเอียด
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onOpenChange={onDetailModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  รายละเอียดใบสมัครงาน: {selectedApplication?.prefix ? `${selectedApplication.prefix} ` : ''}{selectedApplication?.firstName} {selectedApplication?.lastName}
                </h3>
              </ModalHeader>
              <ModalBody>
                {selectedApplication && (
                  <div className="space-y-6">
                    {/* ข้อมูลส่วนตัว */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        ข้อมูลส่วนตัว
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">คำนำหน้า</label>
                          <p className="text-gray-800">{selectedApplication?.prefix || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ชื่อ</label>
                          <p className="text-gray-800">{selectedApplication?.firstName || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">นามสกุล</label>
                          <p className="text-gray-800">{selectedApplication?.lastName || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">อายุ</label>
                          <p className="text-gray-800">{selectedApplication?.age || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เชื้อชาติ</label>
                          <p className="text-gray-800">{selectedApplication?.race || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">สัญชาติ</label>
                          <p className="text-gray-800">{selectedApplication?.nationality || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ศาสนา</label>
                          <p className="text-gray-800">{selectedApplication?.religion || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">สถานภาพ</label>
                          <p className="text-gray-800">{selectedApplication?.maritalStatus || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์</label>
                          <p className="text-gray-800">{selectedApplication?.phone || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">อีเมล</label>
                          <p className="text-gray-800">{selectedApplication?.email || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลบัตรประชาชน */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        ข้อมูลบัตรประชาชน
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">เลขบัตรประชาชน</label>
                          <p className="text-gray-800">{selectedApplication?.idNumber || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ออกโดย</label>
                          <p className="text-gray-800">{selectedApplication?.idCardIssuedAt || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">วันที่ออกบัตร</label>
                          <p className="text-gray-800">{selectedApplication?.idCardIssueDate || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">วันที่บัตรหมดอายุ</label>
                          <p className="text-gray-800">{selectedApplication?.idCardExpiryDate || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลที่อยู่ตามทะเบียนบ้าน */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        ที่อยู่ตามทะเบียนบ้าน
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">ที่อยู่</label>
                          <p className="text-gray-800">{selectedApplication?.addressAccordingToHouseRegistration || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลที่อยู่ปัจจุบัน */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        ที่อยู่ปัจจุบัน
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">ที่อยู่</label>
                          <p className="text-gray-800">{selectedApplication?.currentAddress || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลการติดต่อฉุกเฉิน */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        การติดต่อฉุกเฉิน
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">ชื่อผู้ติดต่อฉุกเฉิน</label>
                          <p className="text-gray-800">{selectedApplication?.emergencyContact || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ความสัมพันธ์</label>
                          <p className="text-gray-800">{selectedApplication?.emergencyRelationship || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์ฉุกเฉิน</label>
                          <p className="text-gray-800">{selectedApplication?.emergencyPhone || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">ที่อยู่ฉุกเฉิน</label>
                          <p className="text-gray-800">{selectedApplication?.emergencyAddress || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลการสมัครงาน */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BriefcaseIcon className="w-5 h-5" />
                        ข้อมูลการสมัครงาน
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">ตำแหน่งที่สมัคร</label>
                          <p className="text-gray-800">{selectedApplication?.appliedPosition || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ฝ่าย/กลุ่มงาน</label>
                          <p className="text-gray-800">{selectedApplication?.department || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เงินเดือนที่คาดหวัง</label>
                          <p className="text-gray-800">{selectedApplication?.expectedSalary || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">วันที่สามารถเริ่มงานได้</label>
                          <p className="text-gray-800">{selectedApplication?.availableDate || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลการศึกษา */}
                    {selectedApplication?.education && selectedApplication.education.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <AcademicCapIcon className="w-5 h-5" />
                          ข้อมูลการศึกษา
                        </h4>
                        <div className="space-y-4">
                          {selectedApplication.education.map((edu: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ระดับการศึกษา</label>
                                  <p className="text-gray-800">{edu.level || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">สถาบันการศึกษา</label>
                                  <p className="text-gray-800">{edu.institution || edu.school || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">สาขาวิชา</label>
                                  <p className="text-gray-800">{edu.major || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ปีที่จบ</label>
                                  <p className="text-gray-800">{edu.year || edu.endYear || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">เกรดเฉลี่ย</label>
                                  <p className="text-gray-800">{edu.gpa || '-'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลประสบการณ์ทำงาน */}
                    {selectedApplication?.workExperience && selectedApplication.workExperience.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5" />
                          ประสบการณ์ทำงาน
                        </h4>
                        <div className="space-y-4">
                          {selectedApplication.workExperience.map((work: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                                  <p className="text-gray-800">{work.position || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">บริษัท/องค์กร</label>
                                  <p className="text-gray-800">{work.company || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">วันที่เริ่มงาน</label>
                                  <p className="text-gray-800">{work.startDate || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">วันที่สิ้นสุด</label>
                                  <p className="text-gray-800">{work.endDate || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">เงินเดือน</label>
                                  <p className="text-gray-800">{work.salary || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">เหตุผลที่ออก</label>
                                  <p className="text-gray-800">{work.reason || work.description || '-'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลการรับราชการก่อนหน้า */}
                    {selectedApplication?.previousGovernmentService && selectedApplication.previousGovernmentService.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5" />
                          การรับราชการก่อนหน้า
                        </h4>
                        <div className="space-y-4">
                          {selectedApplication.previousGovernmentService.map((service: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                                  <p className="text-gray-800">{service.position || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">หน่วยงาน</label>
                                  <p className="text-gray-800">{service.department || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">วันที่</label>
                                  <p className="text-gray-800">{service.date || '-'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ประเภท</label>
                                  <p className="text-gray-800">{service.type || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-600">เหตุผล</label>
                                  <p className="text-gray-800">{service.reason || '-'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลคู่สมรส */}
                    {selectedApplication?.spouseInfo && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <UserIcon className="w-5 h-5" />
                          ข้อมูลคู่สมรส
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">ชื่อคู่สมรส</label>
                            <p className="text-gray-800">{selectedApplication?.spouseInfo?.firstName || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">นามสกุลคู่สมรส</label>
                            <p className="text-gray-800">{selectedApplication?.spouseInfo?.lastName || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลที่ทำงานฉุกเฉิน */}
                    {selectedApplication?.emergencyWorkplace && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5" />
                          ข้อมูลที่ทำงานฉุกเฉิน
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">ชื่อที่ทำงาน</label>
                            <p className="text-gray-800">{selectedApplication?.emergencyWorkplace?.name || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">เขต/อำเภอ</label>
                            <p className="text-gray-800">{selectedApplication?.emergencyWorkplace?.district || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">จังหวัด</label>
                            <p className="text-gray-800">{selectedApplication?.emergencyWorkplace?.province || '-'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์</label>
                            <p className="text-gray-800">{selectedApplication?.emergencyWorkplace?.phone || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลเพิ่มเติม */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        ข้อมูลเพิ่มเติม
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">ความสามารถพิเศษ</label>
                          <p className="text-gray-800">{selectedApplication?.skills || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ภาษา</label>
                          <p className="text-gray-800">{selectedApplication?.languages || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ทักษะคอมพิวเตอร์</label>
                          <p className="text-gray-800">{selectedApplication?.computerSkills || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ใบรับรอง</label>
                          <p className="text-gray-800">{selectedApplication?.certificates || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">บุคคลอ้างอิง</label>
                          <p className="text-gray-800">{selectedApplication?.references || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลเอกสารแนบ */}
                    {uploadedDocuments && uploadedDocuments.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5" />
                          เอกสารแนบ
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {uploadedDocuments.map((doc: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800">{doc.documentType || 'เอกสาร'}</p>
                                  <p className="text-sm text-gray-600">{doc.fileName || doc.name || '-'}</p>
                                </div>
                                <Button
                                  size="sm"
                                  color="primary"
                                  variant="flat"
                                  onPress={() => handlePreviewFile(doc.filePath || doc.url, doc.fileName || doc.name)}
                                >
                                  ดู
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  ปิด
                </Button>
                <Button color="primary" onPress={onClose}>
                  ตกลง
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Preview File Modal */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                ดูตัวอย่างไฟล์: {previewFile.name || 'ไม่ระบุชื่อ'}
              </h3>
                    <button
                onClick={handleClosePreviewModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
                    </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {previewFile.type === 'pdf' ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-0"
                  title={previewFile.name}
                />
              ) : previewFile.type === 'jpg' || previewFile.type === 'jpeg' || previewFile.type === 'png' || previewFile.type === 'gif' ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้</p>
                    <p className="text-sm text-gray-500 mt-2">ประเภทไฟล์: {previewFile.type}</p>
                    <Button
                      color="primary"
                      variant="flat"
                      className="mt-4"
                      onClick={() => window.open(previewFile.url, '_blank')}
                    >
                      เปิดไฟล์ในแท็บใหม่
                    </Button>
                  </div>
              </div>
            )}
              </div>
            <div className="flex justify-end p-4 border-t">
              <Button
                onClick={handleClosePreviewModal}
                color="primary"
                variant="solid"
              >
                ปิด
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
