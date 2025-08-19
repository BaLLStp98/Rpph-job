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
  Pagination,
  Input,
  Select,
  SelectItem,
  useDisclosure
} from '@heroui/react';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
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
  DocumentCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ApplicationData {
  id: string;
  submittedAt: string;
  status: string;
  prefix: string;
  firstName: string;
  lastName: string;
  appliedPosition: string;
  expectedSalary: string;
  email: string;
  phone: string;
  currentAddress: string;
  birthDate: string;
  gender: string;
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
  profileImage?: string;
  documents?: {
    idCard?: string;
    houseRegistration?: string;
    militaryCertificate?: string;
    educationCertificate?: string;
    medicalCertificate?: string;
    drivingLicense?: string;
    nameChangeCertificate?: string;
  };
}

// Component สำหรับแสดงข้อมูลในรูปแบบเดียวกับหน้า application-form
const ApplicationFormView = ({ application, onStatusUpdate }: { 
  application: ApplicationData;
  onStatusUpdate?: (applicationId: string, newStatus: string) => void;
}) => {
  const generatePDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `application_${application.id}.pdf`;
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

  const printAttachedDocuments = async () => {
    try {
      const response = await fetch('/api/print-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documents_${application.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to print documents');
      }
    } catch (error) {
      console.error('Error printing documents:', error);
      alert('เกิดข้อผิดพลาดในการพิมพ์เอกสารแนบ');
    }
  };

  return (
    <div className="space-y-8">
      {/* ส่วนการพิมพ์ PDF */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">การพิมพ์เอกสาร</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          <div className="flex gap-4">
            <Button
              color="primary"
              size="lg"
              startContent={<DocumentTextIcon className="w-5 h-5" />}
              onClick={generatePDF}
              className="flex-1"
            >
              พิมพ์ใบสมัครงาน (PDF)
            </Button>
            <Button
              color="secondary"
              size="lg"
              startContent={<DocumentTextIcon className="w-5 h-5" />}
              onClick={printAttachedDocuments}
              className="flex-1"
            >
              พิมพ์เอกสารแนบ (PDF)
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลส่วนตัว */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <UserIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {/* Profile Image */}
          {application.profileImage && (
            <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                รูปถ่ายประจำตัว
              </h3>
              <div className="flex items-center gap-6">
                <img
                  src={`/image/${application.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', application.profileImage);
                    // Hide the image and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'block';
                    }
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', application.profileImage);
                  }}
                />
                <div 
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg"
                  style={{ display: 'none' }}
                >
                  {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">รูปถ่ายประจำตัว</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">คำนำหน้า</p>
              <p className="text-gray-800">{application.prefix || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">ชื่อ</p>
              <p className="text-gray-800">{application.firstName}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">นามสกุล</p>
              <p className="text-gray-800">{application.lastName}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">อีเมล</p>
              <p className="text-gray-800">{application.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</p>
              <p className="text-gray-800">{application.phone}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">วันเกิด</p>
              <p className="text-gray-800">{application.birthDate}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">เพศ</p>
              <p className="text-gray-800">{application.gender}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">ตำแหน่งที่สมัคร</p>
              <p className="text-gray-800">{application.appliedPosition}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">เงินเดือนที่คาดหวัง</p>
              <p className="text-gray-800">{application.expectedSalary}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600 mb-1">ที่อยู่ปัจจุบัน</p>
            <p className="text-gray-800">{application.currentAddress}</p>
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลการศึกษา */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลการศึกษา</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {application.education.length > 0 ? (
            <div className="space-y-6">
              {application.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">การศึกษา #{index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">ระดับการศึกษา</p>
                      <p className="text-gray-800">{edu.level || '-'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">สถาบันการศึกษา</p>
                      <p className="text-gray-800">{edu.institution || edu.school || '-'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">สาขาวิชา</p>
                      <p className="text-gray-800">{edu.major || '-'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">ปีที่จบ</p>
                      <p className="text-gray-800">{edu.year || edu.graduationYear || '-'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">เกรดเฉลี่ย</p>
                      <p className="text-gray-800">{edu.gpa || '-'}</p>
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
        </CardBody>
      </Card>

      {/* ข้อมูลประสบการณ์การทำงาน */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลประสบการณ์การทำงาน</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {application.workExperience.length > 0 ? (
            <div className="space-y-6">
              {application.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">ประสบการณ์การทำงาน #{index + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">ตำแหน่ง</p>
                      <p className="text-gray-800">{work.position}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">บริษัท</p>
                      <p className="text-gray-800">{work.company}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">ระยะเวลา</p>
                      <p className="text-gray-800">{work.startDate} - {work.endDate}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">เงินเดือน</p>
                      <p className="text-gray-800">{work.salary || '-'}</p>
                    </div>
                  </div>
                  
                  {(work.description || work.reason) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">รายละเอียดงาน</p>
                      <p className="text-gray-800">{work.description || work.reason}</p>
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
        </CardBody>
      </Card>

      {/* เอกสารแนบ */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">เอกสารแนบ</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {application.documents && Object.keys(application.documents).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.documents.idCard && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-gray-700">สำเนาบัตรประชาชน</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" color="primary" onClick={() => window.open(`/api/uploads?file=${application.documents!.idCard}`, '_blank')}>
                      ดูไฟล์
                    </Button>
                  </div>
                </div>
              )}
              
              {application.documents.houseRegistration && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-700">สำเนาทะเบียนบ้าน</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" color="primary" onClick={() => window.open(`/api/uploads?file=${application.documents!.houseRegistration}`, '_blank')}>
                      ดูไฟล์
                    </Button>
                  </div>
                </div>
              )}
              
              {application.documents.educationCertificate && (
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-sm font-medium text-gray-700">สำเนาหลักฐานการศึกษา</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" color="primary" onClick={() => window.open(`/api/uploads?file=${application.documents!.educationCertificate}`, '_blank')}>
                      ดูไฟล์
                    </Button>
                  </div>
                </div>
              )}
              
              {application.documents.medicalCertificate && (
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-sm font-medium text-gray-700">ใบรับรองแพทย์</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" color="primary" onClick={() => window.open(`/api/uploads?file=${application.documents!.medicalCertificate}`, '_blank')}>
                      ดูไฟล์
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีเอกสารแนบ</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ส่วนการยืนยันการสมัครงาน */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CheckIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">การยืนยันการสมัครงาน</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          <div className="flex gap-4">
            <Button
              color="success"
              size="lg"
              startContent={<CheckIcon className="w-5 h-5" />}
              onClick={() => onStatusUpdate?.(application.id, 'approved')}
              className="flex-1"
            >
              อนุมัติการสมัคร
            </Button>
            <Button
              color="danger"
              size="lg"
              startContent={<XMarkIcon className="w-5 h-5" />}
              onClick={() => onStatusUpdate?.(application.id, 'rejected')}
              className="flex-1"
            >
              ปฏิเสธการสมัคร
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      const response = await fetch('/api/application-form');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const apps = data.applications || [];
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

  const handleViewDetails = (application: ApplicationData) => {
    setSelectedApplication(application);
    onOpen();
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
    onClose();
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/application-form/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchApplications();
        alert(`อัปเดตสถานะเป็น: ${getStatusText(newStatus)}`);
        handleCloseDetails();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ระบบจัดการผู้สมัครงาน</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge color="primary" variant="flat">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* สถิติ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ผู้สมัครทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">รอพิจารณา</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ผ่านการคัดเลือก</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XMarkIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ไม่ผ่าน</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ตารางผู้สมัครงาน */}
        <Card className="shadow-lg border-0">
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
            <Table aria-label="ตารางผู้สมัครงาน">
              <TableHeader>
                <TableColumn>ผู้สมัคร</TableColumn>
                <TableColumn>ตำแหน่ง</TableColumn>
                <TableColumn>อีเมล</TableColumn>
                <TableColumn>เบอร์โทร</TableColumn>
                <TableColumn>วันที่สมัคร</TableColumn>
                <TableColumn>สถานะ</TableColumn>
                <TableColumn>การดำเนินการ</TableColumn>
              </TableHeader>
              <TableBody emptyContent="ไม่พบข้อมูลผู้สมัครงาน">
                {items.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={application.profileImage ? `/image/${application.profileImage}` : undefined}
                          name={`${application.firstName} ${application.lastName}`}
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {application.firstName} {application.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{application.prefix}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{application.appliedPosition}</p>
                      <p className="text-sm text-gray-600">{application.expectedSalary}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{application.email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{application.phone}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{formatDate(application.submittedAt)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={getStatusColor(application.status)}
                        variant="flat"
                        className="text-xs"
                      >
                        {getStatusText(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="primary"
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
            
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-gray-600">
                แสดง {((page - 1) * rowsPerPage) + 1} ถึง {Math.min(page * rowsPerPage, filteredApplications.length)} จาก {filteredApplications.length} รายการ
              </div>
              <Pagination
                total={pages}
                page={page}
                onChange={setPage}
                showControls
                showShadow
                color="primary"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                รายละเอียดผู้สมัครงาน
              </h2>
              <Button
                variant="bordered"
                onClick={handleCloseDetails}
              >
                ปิด
              </Button>
            </div>
            {selectedApplication && (
              <ApplicationFormView 
                application={selectedApplication} 
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 