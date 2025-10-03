'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
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
  SelectItem
} from '@heroui/react';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface ApplicationData {
  id: string;
  createdAt: string;
  status: string;
  prefix: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  idCardIssuedAt?: string;
  idCardIssueDate?: string;
  idCardExpiryDate?: string;
  age?: string;
  race?: string;
  placeOfBirth?: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: string;
  addressAccordingToHouseRegistration?: string;
  currentAddress: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  emergencyAddress?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
  };
  emergencyWorkplace?: {
    name?: string;
    district?: string;
    province?: string;
    phone?: string;
  };
  appliedPosition: string;
  expectedSalary: string;
  availableDate?: string;
  currentWork?: boolean;
  department?: string;
  education: Array<{
    level?: string;
    degree?: string;
    institution?: string;
    school?: string;
    major?: string;
    year?: string;
    graduationYear?: string;
    gpa: string;
  }>;
  workExperience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    description?: string;
    salary?: string;
    reason?: string;
  }>;
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  spouseInfo?: {
    firstName?: string;
    lastName?: string;
  };
  registeredAddress?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
  };
  currentAddressDetail?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    homePhone?: string;
    mobilePhone?: string;
  };
  medicalRights?: {
    hasUniversalHealthcare?: boolean;
    universalHealthcareHospital?: string;
    hasSocialSecurity?: boolean;
    socialSecurityHospital?: string;
    dontWantToChangeHospital?: boolean;
    wantToChangeHospital?: boolean;
    newHospital?: string;
    hasCivilServantRights?: boolean;
    otherRights?: string;
  };
  multipleEmployers?: string[];
  staffInfo?: {
    position?: string;
    department?: string;
    startWork?: string;
  };
  profileImage?: string;
  documents?: {
    idCard?: string;
    houseRegistration?: string;
    militaryCertificate?: string;
    educationCertificate?: string;
    medicalCertificate?: string;
    drivingLicense?: string;
    nameChangeCertificate?: string;
    otherDocuments?: string[];
  };
  updatedAt?: string;
}


export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

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
      const response = await fetch('/api/resume-deposit');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const apps = data.data || [];
      
      // Debug: ตรวจสอบข้อมูล profileImage
      console.log('🔍 Admin API Response:', data);
      console.log('🔍 Applications with profileImage:', apps.map(app => ({
        id: app.id,
        name: `${app.firstName} ${app.lastName}`,
        profileImage: app.profileImage
      })));
      
      setApplications(apps);
      
      // คำนวณสถิติ
      setStats({
        total: apps.length,
        pending: apps.filter((app: ApplicationData) => app.status.toLowerCase() === 'pending').length,
        approved: apps.filter((app: ApplicationData) => app.status.toLowerCase() === 'approved').length,
        rejected: apps.filter((app: ApplicationData) => app.status.toLowerCase() === 'rejected').length
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'รอพิจารณา';
      case 'approved': return 'ผ่านการคัดเลือก';
      case 'rejected': return 'ไม่ผ่าน';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };


  const handleLogout = () => {
    logout();
    alert('ออกจากระบบ Admin สำเร็จ');
    router.push('/dashboard');
  };

  const handleViewDetails = async (application: ApplicationData) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
    
    // Debug: ตรวจสอบข้อมูล profileImage
    console.log('🔍 Selected Application:', application);
    console.log('🔍 Profile Image URL:', application.profileImage);
    console.log('🔍 Profile Image Type:', typeof application.profileImage);
    
    // ดึงข้อมูลเอกสารแนบ
    if (application.id) {
      try {
        const documents = await fetchUploadedDocuments(application.id);
        setUploadedDocuments(documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setUploadedDocuments([]);
      }
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedApplication(null);
    setShowDetailModal(false);
  };

  const handlePreviewFile = (fileUrl: string, fileName: string) => {
    setPreviewFile({
      url: fileUrl,
      name: fileName,
      type: fileName.split('.').pop()?.toLowerCase() || 'unknown'
    });
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/resume-deposit/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchApplications();
        alert(`อัปเดตสถานะเป็น: ${getStatusText(newStatus)}`);
        handleCloseDetailModal();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const generatePDF = async () => {
    if (!selectedApplication) return;
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application: selectedApplication }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `application_${selectedApplication.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  const printAllDocuments = () => {
    if (!selectedApplication) return;
    
    const printUrl = `/official-documents/print-all?id=${selectedApplication.id}`;
    
    // เปิดหน้าพิมพ์รวมในแท็บใหม่
    const newWindow = window.open(printUrl, '_blank');
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
        }, 1500); // รอ 1.5 วินาทีให้หน้าโหลดเสร็จ
      };
    }
  };

  // ฟังก์ชันดึงข้อมูลเอกสารที่อัปโหลดแล้ว
  const fetchUploadedDocuments = async (resumeDepositId: string) => {
    try {
      const response = await fetch(`/api/resume-documents?resumeDepositId=${resumeDepositId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        console.error('Fetch documents failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  };


  // กรองข้อมูล
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appliedPosition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // คำนวณข้อมูลสำหรับตาราง
  const pages = Math.ceil(filteredApplications.length / rowsPerPage);
  const items = filteredApplications.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md">
              <CardBody className="text-center p-8">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
                <p className="text-gray-600 mb-4">{error}</p>
            <Button
              color="primary"
                  onClick={fetchApplications}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  ลองใหม่
            </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ระบบจัดการผู้สมัครงาน</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
              {user && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">ผู้ใช้งาน:</span>
                  <span className="text-xs font-medium text-blue-600">
                    {user.firstName} {user.lastName} ({user.role === 'superadmin' ? 'Super Admin' : 'Admin'})
                  </span>
                </div>
              )}
            </div>
          </div>
                      <div className="flex items-center gap-4">
              <Badge color="primary" variant="flat">
                Admin
              </Badge>
            <Button
                color="danger"
                variant="flat"
                size="sm"
                onClick={handleLogout}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                }
              >
                ออกจากระบบ
            </Button>
            </div>
        </div>
      </div> */}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-lg min-h-screen lg:min-h-0">
          <div className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">เมนูจัดการ</h2>
            <nav className="space-y-2">
              <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-sm sm:text-base"
                startContent={<UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => router.push('/departments')}
              >
                ประกาศรับสมัครงาน
              </Button>
              <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 text-gray-700 hover:bg-green-50 hover:text-green-700 text-sm sm:text-base"
                startContent={<UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => router.push('/admin/members')}
              >
                จัดการสมาชิก
              </Button>
              <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 text-gray-700 hover:bg-orange-50 hover:text-orange-700 text-sm sm:text-base"
                startContent={<ClipboardDocumentListIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => router.push('/admin/contract-renewal')}
              >
                จัดการต่อสัญญาพนักงาน
              </Button>
              {/* <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 text-gray-700 hover:bg-purple-50 hover:text-purple-700 text-sm sm:text-base"
                startContent={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
                onClick={() => router.push('/dashboard')}
              >
                กลับหน้า Dashboard
              </Button> */}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* สถิติ */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">ผู้สมัครทั้งหมด</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
          </div>
        </CardBody>
      </Card>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">รอพิจารณา</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">ผ่านการคัดเลือก</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">ไม่ผ่าน</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ตารางผู้สมัครงาน */}
        <Card className="shadow-lg border-0 rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">รายชื่อผู้สมัครงาน</h2>
                <p className="text-sm text-gray-600">จัดการและตรวจสอบข้อมูลผู้สมัครงาน</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  placeholder="ค้นหาผู้สมัคร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  className="w-full sm:w-64"
                />
                <Select
                  placeholder="สถานะ"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setStatusFilter(selectedKey);
                  }}
                  startContent={<FunnelIcon className="w-4 h-4 text-gray-400" />}
                  className="w-full sm:w-40"
                  classNames={{
                    trigger: "bg-white border-gray-300",
                    value: "text-gray-900",
                    listbox: "bg-white"
                  }}
                >
                  <SelectItem key="all">ทั้งหมด</SelectItem>
                  <SelectItem key="pending">รอพิจารณา</SelectItem>
                  <SelectItem key="approved">ผ่านการคัดเลือก</SelectItem>
                  <SelectItem key="rejected">ไม่ผ่าน</SelectItem>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <Table 
              aria-label="ตารางผู้สมัครงาน"
              classNames={{
                wrapper: "min-h-[400px]",
              }}
            >
              <TableHeader>
                <TableColumn>ผู้สมัคร</TableColumn>
                <TableColumn>ตำแหน่ง</TableColumn>
                <TableColumn>ฝ่าย</TableColumn>
                <TableColumn>เบอร์โทร</TableColumn>
                <TableColumn>วันที่สมัคร</TableColumn>
                <TableColumn>สถานะ</TableColumn>
                <TableColumn>การดำเนินการ</TableColumn>
              </TableHeader>
              <TableBody emptyContent="ไม่พบข้อมูลผู้สมัครงาน">
                {items.map((application) => (
                  <TableRow key={application.id} className="hover:bg-gray-100 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={application.profileImage ? (application.profileImage.startsWith('http') ? application.profileImage : `/api/image?file=${application.profileImage}`) : undefined}
                          name={`${application.firstName} ${application.lastName}`}
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {application.prefix ? `${application.prefix} ` : ''}{application.firstName} {application.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{application.appliedPosition}</p>
                        {/* <p className="text-sm text-gray-600">{application.expectedSalary}</p> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {application.department ? (
                          <span className="text-gray-900 text-sm">
                            {application.department}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-gray-900">{application.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-600">{formatDate(application.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(application.status)}
                        variant="bordered"
                        size="sm"
                        className={`font-medium ${
                          application.status.toLowerCase() === 'approved' 
                            ? 'border-green-500 text-green-700 bg-green-50' 
                            : application.status.toLowerCase() === 'pending'
                            ? 'border-yellow-500 text-yellow-700 bg-yellow-50'
                            : application.status.toLowerCase() === 'rejected'
                            ? 'border-red-500 text-red-700 bg-red-50'
                            : 'border-gray-500 text-gray-700 bg-gray-50'
                        }`}
                      >
                        {getStatusText(application.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="primary"
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                        startContent={<EyeIcon className="w-4 h-4" />}
                        onClick={() => handleViewDetails(application)}
                      >
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Custom Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8 py-4">
                {/* Previous Button */}
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current page
                  const shouldShow = 
                    pageNum === 1 || 
                    pageNum === pages || 
                    Math.abs(pageNum - page) <= 1

                  if (!shouldShow) {
                    // Show ellipsis
                    if (pageNum === 2 && page > 4) {
                      return (
                        <span key={pageNum} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      )
                    }
                    if (pageNum === pages - 1 && page < pages - 3) {
                      return (
                        <span key={pageNum} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* Next Button */}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === pages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  ›
                </button>
              </div>
            )}
            
            {/* Page Info */}
            <div className="flex justify-center items-center p-4 border-t">
              <div className="text-sm text-gray-600">
                แสดง {((page - 1) * rowsPerPage) + 1} ถึง {Math.min(page * rowsPerPage, filteredApplications.length)} จาก {filteredApplications.length} รายการ
              </div>
            </div>
          </CardBody>
        </Card>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                รายละเอียดใบสมัครงาน: {selectedApplication.prefix ? `${selectedApplication.prefix} ` : ''}{selectedApplication.firstName} {selectedApplication.lastName}
              </h3>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto min-h-[80vh]">
              <div className="space-y-8">
      {/* ข้อมูลส่วนตัว */}
                <div className="bg-white rounded-lg shadow-lg border-0">
                  <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <UserIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
          </div>
                  </div>
                  <div className="p-8">
          {/* Profile Image */}
          <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              รูปถ่ายประจำตัว
            </h3>
            <div className="flex items-center gap-6">
                        {selectedApplication.profileImage ? (
                <img
                            src={selectedApplication.profileImage.startsWith('http') ? selectedApplication.profileImage : `/api/image?file=${selectedApplication.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                              console.error('❌ Failed to load profile image:', selectedApplication.profileImage);
                              console.error('❌ Image src:', e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                            onLoad={() => {
                              console.log('✅ Profile image loaded successfully:', selectedApplication.profileImage);
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">ไม่มีรูปถ่าย</div>
                            <div className="text-xs text-gray-500">ขนาด ๑ นิ้ว</div>
                          </div>
                        )}
              <div 
                className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg"
                          style={{ display: selectedApplication.profileImage ? 'none' : 'flex' }}
              >
                          {selectedApplication.firstName.charAt(0)}{selectedApplication.lastName.charAt(0)}
              </div>
              <div>
                          <p className="text-sm text-gray-700"><span className="font-medium">ชื่อ:</span> {selectedApplication.prefix ? `${selectedApplication.prefix} ` : ''}{selectedApplication.firstName} {selectedApplication.lastName}</p>
                          <p className="text-sm text-gray-700"><span className="font-medium">ตำแหน่งที่สมัคร:</span> {selectedApplication.appliedPosition}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">คำนำหน้า</label>
              <input
                          value={selectedApplication.prefix || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อ</label>
              <input
                          value={selectedApplication.firstName || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">นามสกุล</label>
              <input
                          value={selectedApplication.lastName || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">อีเมล</label>
              <input
                          value={selectedApplication.email || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เบอร์โทรศัพท์</label>
              <input
                          value={selectedApplication.phone || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">วันเกิด</label>
              <input
                          value={selectedApplication.birthDate || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เพศ</label>
              <input
                          value={selectedApplication.gender || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ตำแหน่งที่สมัคร</label>
              <input
                          value={selectedApplication.appliedPosition || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เงินเดือนที่คาดหวัง</label>
              <input
                          value={selectedApplication.expectedSalary || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-600 mb-1 block">ที่อยู่ปัจจุบัน</label>
            <textarea
                        value={selectedApplication.currentAddress || ''}
              disabled
              readOnly
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              rows={3}
            />
          </div>

          {/* ข้อมูลเพิ่มเติม */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เลขบัตรประชาชน</label>
              <input
                          value={selectedApplication.idNumber || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">อายุ</label>
              <input
                          value={selectedApplication.age || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เชื้อชาติ</label>
              <input
                          value={selectedApplication.race || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">สถานที่เกิด</label>
              <input
                          value={selectedApplication.placeOfBirth || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">สัญชาติ</label>
              <input
                          value={selectedApplication.nationality || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ศาสนา</label>
              <input
                          value={selectedApplication.religion || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">สถานะสมรส</label>
              <input
                          value={selectedApplication.maritalStatus || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">วันที่สามารถเริ่มงานได้</label>
              <input
                          value={selectedApplication.availableDate || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ทำงานปัจจุบัน</label>
              <input
                          value={selectedApplication.currentWork ? 'ใช่' : 'ไม่'}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* ข้อมูลติดต่อฉุกเฉิน */}
                    {(selectedApplication.emergencyContact || selectedApplication.emergencyPhone) && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลติดต่อฉุกเฉิน</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อผู้ติดต่อฉุกเฉิน</label>
                  <input
                              value={selectedApplication.emergencyContact || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">เบอร์โทรฉุกเฉิน</label>
                  <input
                              value={selectedApplication.emergencyPhone || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ความสัมพันธ์</label>
                  <input
                              value={selectedApplication.emergencyRelationship || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
                  </div>
                </div>

      {/* ข้อมูลการศึกษา */}
                <div className="bg-white rounded-lg shadow-lg border-0">
                  <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลการศึกษา</h2>
          </div>
                  </div>
                  <div className="p-8">
                    {selectedApplication.education && selectedApplication.education.length > 0 ? (
            <div className="space-y-6">
                        {selectedApplication.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">การศึกษา #{index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">ระดับการศึกษา</label>
                      <input
                        value={edu.level || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">สถาบันการศึกษา</label>
                      <input
                        value={edu.institution || edu.school || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">สาขาวิชา</label>
                      <input
                        value={edu.major || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">ปีที่จบ</label>
                      <input
                        value={edu.year || edu.graduationYear || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">เกรดเฉลี่ย</label>
                      <input
                        value={edu.gpa || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีข้อมูลการศึกษา</p>
            </div>
          )}
                  </div>
                </div>

      {/* ข้อมูลประสบการณ์การทำงาน */}
                <div className="bg-white rounded-lg shadow-lg border-0">
                  <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลประสบการณ์การทำงาน</h2>
          </div>
                  </div>
                  <div className="p-8">
                    {selectedApplication.workExperience && selectedApplication.workExperience.length > 0 ? (
            <div className="space-y-6">
                        {selectedApplication.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">ประสบการณ์การทำงาน #{index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">ตำแหน่ง</label>
                      <input
                        value={work.position || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">บริษัท</label>
                      <input
                        value={work.company || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">ระยะเวลา</label>
                      <input
                        value={`${work.startDate || ''} - ${work.endDate || ''}`}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">เงินเดือน</label>
                      <input
                        value={work.salary || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  {(work.description || work.reason) && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600 mb-1 block">รายละเอียดงาน</label>
                      <textarea
                        value={work.description || work.reason || ''}
                        disabled
                        readOnly
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีข้อมูลประสบการณ์การทำงาน</p>
            </div>
          )}
                  </div>
                </div>

      {/* ทักษะและความสามารถ */}
                {(selectedApplication.skills || selectedApplication.languages || selectedApplication.computerSkills || selectedApplication.certificates || selectedApplication.references) && (
                  <div className="bg-white rounded-lg shadow-lg border-0">
                    <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ทักษะและความสามารถ</h2>
            </div>
                    </div>
                    <div className="p-8">
            <div className="space-y-6">
                        {selectedApplication.skills && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ทักษะพิเศษ</label>
                  <textarea
                              value={selectedApplication.skills}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
              
                        {selectedApplication.languages && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ภาษา</label>
                  <textarea
                              value={selectedApplication.languages}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={2}
                  />
                </div>
              )}
              
                        {selectedApplication.computerSkills && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ทักษะคอมพิวเตอร์</label>
                  <textarea
                              value={selectedApplication.computerSkills}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
              
                        {selectedApplication.certificates && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ใบรับรอง/ประกาศนียบัตร</label>
                  <textarea
                              value={selectedApplication.certificates}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
              
                        {selectedApplication.references && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">บุคคลอ้างอิง</label>
                  <textarea
                              value={selectedApplication.references}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
            </div>
                    </div>
                  </div>
      )}

      {/* ข้อมูลคู่สมรส */}
                {selectedApplication.spouseInfo && (
                  <div className="bg-white rounded-lg shadow-lg border-0">
                    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ข้อมูลคู่สมรส</h2>
            </div>
                    </div>
                    <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อคู่สมรส</label>
                <input
                            value={selectedApplication.spouseInfo.firstName || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">นามสกุลคู่สมรส</label>
                <input
                            value={selectedApplication.spouseInfo.lastName || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
            </div>
                    </div>
                  </div>
      )}

      {/* ที่อยู่ตามทะเบียนบ้าน */}
                {selectedApplication.registeredAddress && (
                  <div className="bg-white rounded-lg shadow-lg border-0">
                    <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 text-white relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-sky-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ที่อยู่ตามทะเบียนบ้าน</h2>
            </div>
                    </div>
                    <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">บ้านเลขที่</label>
                <input
                            value={selectedApplication.registeredAddress.houseNumber || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">หมู่</label>
                <input
                            value={selectedApplication.registeredAddress.villageNumber || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ซอย</label>
                <input
                            value={selectedApplication.registeredAddress.alley || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ถนน</label>
                <input
                            value={selectedApplication.registeredAddress.road || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ตำบล/แขวง</label>
                <input
                            value={selectedApplication.registeredAddress.subDistrict || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">อำเภอ/เขต</label>
                <input
                            value={selectedApplication.registeredAddress.district || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">จังหวัด</label>
                <input
                            value={selectedApplication.registeredAddress.province || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">รหัสไปรษณีย์</label>
                <input
                            value={selectedApplication.registeredAddress.postalCode || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
            </div>
                    </div>
                  </div>
      )}

      {/* เอกสารแนบ */}
                <div className="bg-white rounded-lg shadow-lg border-0">
                  <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">เอกสารแนบ</h2>
          </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* สำเนาบัตรประชาชน */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            จำเป็น
                          </span>
                </div>
                        <h4 className="font-semibold text-gray-700 mb-2">สำเนาบัตรประชาชน</h4>
                        <p className="text-sm text-gray-500 mb-3">สำเนาบัตรประชาชน</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'idCard').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                  </div>
                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
                              </div>
                  <div className="flex gap-2">
                                <Button
                                  color="secondary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
                    </Button>
                  </div>
                </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'idCard').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
                </div>
              )}
                        </div>
                      </div>

                      {/* สำเนาทะเบียนบ้าน */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            จำเป็น
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-700 mb-2">สำเนาทะเบียนบ้าน</h4>
                        <p className="text-sm text-gray-500 mb-3">สำเนาทะเบียนบ้าน</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'houseRegistration').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
                              </div>
                  <div className="flex gap-2">
                                <Button
                                  color="secondary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
                    </Button>
                  </div>
                </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'houseRegistration').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
                </div>
              )}
            </div>
            </div>

                      {/* ใบรับรองการศึกษา */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            จำเป็น
                          </span>
            </div>
                        <h4 className="font-semibold text-gray-700 mb-2">ใบรับรองการศึกษา</h4>
                        <p className="text-sm text-gray-500 mb-3">ใบรับรองการศึกษา</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'educationCertificate').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
          </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
                              </div>
                              <div className="flex gap-2">
            <Button
                                  color="secondary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
            </Button>
          </div>
    </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'educationCertificate').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ใบรับรองการเกณฑ์ทหาร */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            ตามความเหมาะสม
                          </span>
            </div>
                        <h4 className="font-semibold text-gray-700 mb-2">ใบรับรองการเกณฑ์ทหาร</h4>
                        <p className="text-sm text-gray-500 mb-3">ใบรับรองการเกณฑ์ทหาร</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'militaryCertificate').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
          </div>
        </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
      </div>
                              <div className="flex gap-2">
                <Button
                                  color="secondary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
                </Button>
          </div>
        </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'militaryCertificate').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
      </div>
                          )}
                        </div>
                      </div>

                      {/* ใบรับรองแพทย์ */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            ตามความเหมาะสม
                          </span>
            </div>
                        <h4 className="font-semibold text-gray-700 mb-2">ใบรับรองแพทย์</h4>
                        <p className="text-sm text-gray-500 mb-3">ใบรับรองแพทย์</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'medicalCertificate').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
            </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
          </div>
                              <div className="flex gap-2">
              <Button
                                  color="secondary"
                                  variant="bordered"
                size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
              </Button>
            </div>
        </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'medicalCertificate').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ใบขับขี่ */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            ตามความเหมาะสม
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-700 mb-2">ใบขับขี่</h4>
                        <p className="text-sm text-gray-500 mb-3">ใบขับขี่</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'drivingLicense').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
                              </div>
                              <div className="flex gap-2">
              <Button
                                  color="secondary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
              </Button>
          </div>
        </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'drivingLicense').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
                </div>
                          )}
                </div>
              </div>

                      {/* ใบเปลี่ยนชื่อ */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            ตามความเหมาะสม
                          </span>
                </div>
                        <h4 className="font-semibold text-gray-700 mb-2">ใบเปลี่ยนชื่อ</h4>
                        <p className="text-sm text-gray-500 mb-3">ใบเปลี่ยนชื่อ</p>
                        <div className="space-y-2">
                          {uploadedDocuments.filter(doc => doc.documentType === 'nameChangeCertificate').map((doc, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-green-700 font-medium">
                                      {doc.fileName}
                                    </span>
                                    <span className="text-xs text-green-600">
                                      ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </span>
                </div>
              </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
                </div>
                              <div className="flex gap-2">
                                <Button
                                  color="secondary"
                                  variant="bordered"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                                  onClick={() => handlePreviewFile(doc.filePath, doc.fileName)}
                                >
                                  ดูตัวอย่าง
                                </Button>
                </div>
              </div>
                          ))}
                          {uploadedDocuments.filter(doc => doc.documentType === 'nameChangeCertificate').length === 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
                </div>
                          )}
                </div>
              </div>
        </div>
                  </div>
              </div>
              
                {/* ส่วนการอนุมัติใบสมัครงาน */}
                <div className="bg-white rounded-lg shadow-lg border-0">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white relative overflow-hidden p-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20"></div>
                    <div className="relative flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <CheckIcon className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-semibold">การอนุมัติใบสมัครงาน</h2>
                    </div>
                  </div>
                  <div className="p-8">
                    {/* ปุ่มพิมพ์เอกสาร */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {/* <h4 className="text-lg font-semibold text-gray-700 mb-4">พิมพ์เอกสาร</h4> */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* <Button
                          color="primary"
                          size="lg"
                          startContent={<DocumentTextIcon className="w-5 h-5" />}
                          onClick={generatePDF}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          ดาวน์โหลด PDF
                        </Button> */}
                        <Button
                          color="success"
                          size="lg"
                          startContent={<DocumentTextIcon className="w-5 h-5" />}
                          onClick={printAllDocuments}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                          พิมพ์ใบสมัครงาน
                        </Button>
              </div>
            </div>

                    {/* ปุ่มอนุมัติ */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        color="success"
                        size="lg"
                        startContent={<CheckIcon className="w-5 h-5" />}
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        อนุมัติการสมัคร
                      </Button>
                      <Button
                        color="warning"
                        size="lg"
                        startContent={<ClockIcon className="w-5 h-5" />}
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'pending')}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        รอพิจารณา
                      </Button>
                      <Button
                        color="danger"
                        size="lg"
                        startContent={<XMarkIcon className="w-5 h-5" />}
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                      >
                        ปฏิเสธการสมัคร
                      </Button>
                        </div>
                      </div>
                      </div>
                      </div>
                      </div>
            <div className="flex justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                สถานะปัจจุบัน: 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  selectedApplication.status.toLowerCase() === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedApplication.status.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedApplication.status.toLowerCase() === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(selectedApplication.status)}
                </span>
                      </div>
                      <Button
                onClick={handleCloseDetailModal}
                        color="primary"
                variant="solid"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                ปิด
                      </Button>
            </div>
        </div>
                </div>
              )}

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
            <div className="flex-1 p-4 overflow-hidden min-h-[80vh]">
              {previewFile.type === 'pdf' ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-0"
                  title={previewFile.name || 'PDF Preview'}
                  style={{ 
                    minHeight: '90vh',
                    width: '100%',
                    height: '100%'
                  }}
                />
              ) : ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(previewFile.type) ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name || 'Preview'}
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้</p>
                    <p className="text-sm text-gray-500">ไฟล์: {previewFile.name || 'ไม่ระบุชื่อ'}</p>
                    <p className="text-sm text-gray-500">ประเภท: {previewFile.type || 'ไม่ระบุประเภท'}</p>
                    <div className="mt-4">
                      <Button
                        color="primary"
                        variant="solid"
                        onClick={() => window.open(previewFile.url, '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        เปิดในแท็บใหม่
                      </Button>
              </div>
              </div>
            </div>
              )}
        </div>
            <div className="flex justify-end p-4 border-t">
              <Button
                onClick={handleClosePreviewModal}
                color="primary"
                variant="solid"
                className="bg-blue-500 hover:bg-blue-600 text-white"
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