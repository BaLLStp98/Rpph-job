'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react';
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  XMarkIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon as DocIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowDownTrayIcon
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
  profileImage?: string;
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

export default function ApplicationStatus() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State สำหรับ preview เอกสาร
  const [previewDocument, setPreviewDocument] = useState<{url: string, name: string} | null>(null);
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/application-form');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'under_review':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอตรวจสอบ';
      case 'approved':
        return 'อนุมัติ';
      case 'rejected':
        return 'ไม่อนุมัติ';
      case 'under_review':
        return 'อยู่ระหว่างตรวจสอบ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (application: ApplicationData) => {
    setSelectedApplication(application);
    onOpen();
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
    onClose();
  };

  const handlePreviewDocument = (fileName: string, documentName: string) => {
    // ตรวจสอบว่าเป็นรูปภาพหรือเอกสาร PDF
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    const fileUrl = isImage ? `/api/image?file=${fileName}` : `/api/uploads?file=${fileName}`;
    setPreviewDocument({ url: fileUrl, name: documentName });
    onPreviewOpen();
  };

  const handleDownloadDocument = (fileName: string, documentName: string) => {
    const link = document.createElement('a');
    // ตรวจสอบว่าเป็นรูปภาพหรือเอกสาร PDF
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    link.href = isImage ? `/api/image?file=${fileName}` : `/api/uploads?file=${fileName}`;
    link.download = documentName;
    link.click();
  };

  const getDocumentDisplayName = (docType: string) => {
    const names: { [key: string]: string } = {
      idCard: 'สำเนาบัตรประชาชน',
      houseRegistration: 'สำเนาทะเบียนบ้าน',
      militaryCertificate: 'สำเนาหลักฐานการเกณฑ์ทหาร',
      educationCertificate: 'สำเนาหลักฐานการศึกษา',
      medicalCertificate: 'ใบรับรองแพทย์',
      drivingLicense: 'ใบอนุญาตขับขี่',
      nameChangeCertificate: 'ใบเปลี่ยนชื่อ'
    };
    return names[docType] || docType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                สถานะการสมัครงาน
              </h1>
              <p className="text-gray-600">ติดตามสถานะการสมัครงานของคุณ</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ใบสมัครทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-800">{applications.length}</p>
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
                  <p className="text-sm text-gray-600">รอตรวจสอบ</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">อนุมัติ</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ไม่อนุมัติ</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">รายการใบสมัครงาน</h2>
          
          {applications.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardBody className="p-8 text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีใบสมัครงาน</h3>
                <p className="text-gray-500 mb-4">คุณยังไม่ได้ส่งใบสมัครงานใดๆ</p>
                <Button
                  color="primary"
                  onClick={() => window.location.href = '/application-form'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  สมัครงาน
                </Button>
              </CardBody>
            </Card>
          ) : (
            applications.map((application, index) => (
              <Card key={application.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Profile Image */}
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Application Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {application.firstName} {application.lastName}
                          </h3>
                          <Badge
                            color={getStatusColor(application.status)}
                            variant="flat"
                            className="text-xs"
                          >
                            {getStatusText(application.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">ตำแหน่ง:</span> {application.appliedPosition}
                          </div>
                          <div>
                            <span className="font-medium">เงินเดือนที่คาดหวัง:</span> {application.expectedSalary}
                          </div>
                          <div>
                            <span className="font-medium">วันที่สมัคร:</span> {formatDate(application.submittedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        color="primary"
                        startContent={<EyeIcon className="w-4 h-4" />}
                        onClick={() => handleViewDetails(application)}
                      >
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Detail Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={handleCloseDetails} 
          size="5xl"
          scrollBehavior="inside"
          classNames={{
            base: "max-h-[90vh] bg-white",
            body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  รายละเอียดใบสมัครงาน
                </h2>
                <Button
                  isIconOnly
                  variant="light"
                  onClick={handleCloseDetails}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="overflow-y-auto bg-white">
              {selectedApplication && (
                <div className="space-y-8">
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
                      {selectedApplication.profileImage && (
                        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
                          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            รูปถ่ายประจำตัว
                          </h3>
                          <div className="flex items-center gap-6">
                            <div className="relative group">
                              <img
                                src={`/api/image?file=${selectedApplication.profileImage}`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                style={{
                                  objectFit: 'fill',
                                  width: '96px',
                                  height: '96px'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">คำนำหน้า</p>
                          <p className="text-gray-800">{selectedApplication.prefix || '-'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">ชื่อ</p>
                          <p className="text-gray-800">{selectedApplication.firstName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">นามสกุล</p>
                          <p className="text-gray-800">{selectedApplication.lastName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">อีเมล</p>
                          <p className="text-gray-800">{selectedApplication.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</p>
                          <p className="text-gray-800">{selectedApplication.phone}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">วันเกิด</p>
                          <p className="text-gray-800">{selectedApplication.birthDate}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">เพศ</p>
                          <p className="text-gray-800">{selectedApplication.gender}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">ตำแหน่งที่สมัคร</p>
                          <p className="text-gray-800">{selectedApplication.appliedPosition}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">เงินเดือนที่คาดหวัง</p>
                          <p className="text-gray-800">{selectedApplication.expectedSalary}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-600 mb-1">ที่อยู่ปัจจุบัน</p>
                        <p className="text-gray-800">{selectedApplication.currentAddress}</p>
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
                      {selectedApplication.education && selectedApplication.education.length > 0 ? (
                        <div className="space-y-6">
                          {selectedApplication.education.map((edu, index) => (
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
                      {selectedApplication.workExperience && selectedApplication.workExperience.length > 0 ? (
                        <div className="space-y-6">
                          {selectedApplication.workExperience.map((work, index) => (
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
                                  <p className="text-sm font-medium text-gray-600 mb-1">วันที่เริ่มงาน</p>
                                  <p className="text-gray-800">{work.startDate}</p>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">วันที่สิ้นสุด</p>
                                  <p className="text-gray-800">{work.endDate}</p>
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
                          <DocIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold">เอกสารแนบ</h2>
                      </div>
                    </CardHeader>
                    <CardBody className="p-8">
                                             {selectedApplication.documents && Object.keys(selectedApplication.documents).length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {Object.entries(selectedApplication.documents).map(([docType, fileName]) => (
                             <div key={docType} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                               <div className="flex items-center gap-3">
                                 <DocIcon className="w-5 h-5 text-blue-600" />
                                 <span className="text-sm font-medium text-gray-700">
                                   {getDocumentDisplayName(docType)}
                                 </span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <Chip size="sm" color="success" variant="flat">
                                   ✓ อัปโหลดแล้ว
                                 </Chip>
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   color="primary"
                                   startContent={<EyeIcon className="w-4 h-4" />}
                                   onClick={() => handlePreviewDocument(fileName, getDocumentDisplayName(docType))}
                                 >
                                   ดูเอกสาร
                                 </Button>
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   color="primary"
                                   startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                                   onClick={() => handleDownloadDocument(fileName, `${getDocumentDisplayName(docType)}.pdf`)}
                                 >
                                   ดาวน์โหลด
                                 </Button>
                               </div>
                             </div>
                           ))}
                         </div>
                      ) : (
                        <div className="text-center py-8">
                          <DocIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">ไม่มีเอกสารแนบ</p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-white">
              <Button color="primary" onClick={handleCloseDetails}>
                ปิด
              </Button>
            </ModalFooter>
                     </ModalContent>
         </Modal>

         {/* Document Preview Modal */}
         <Modal 
           isOpen={isPreviewOpen} 
           onClose={onPreviewClose} 
           size="5xl"
           scrollBehavior="inside"
           classNames={{
             base: "max-h-[90vh] bg-white",
             body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
             header: "bg-white",
             footer: "bg-white"
           }}
         >
           <ModalContent className="bg-white">
             <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-semibold">ดูเอกสาร: {previewDocument?.name}</h3>
                 <Button
                   isIconOnly
                   variant="light"
                   onClick={onPreviewClose}
                 >
                   <XMarkIcon className="w-5 h-5" />
                 </Button>
               </div>
             </ModalHeader>
             <ModalBody className="overflow-y-auto bg-white">
               {previewDocument && (
                 <div className="w-full h-[70vh]">
                   <iframe
                     src={previewDocument.url}
                     className="w-full h-full border-0 rounded-lg"
                     title={previewDocument.name}
                   />
                 </div>
               )}
             </ModalBody>
             <ModalFooter className="bg-white">
               <Button color="primary" onClick={onPreviewClose}>
                 ปิด
               </Button>
             </ModalFooter>
           </ModalContent>
         </Modal>
       </div>
     </div>
   );
} 