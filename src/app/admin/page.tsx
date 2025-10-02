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
  UserGroupIcon,
  DocumentCheckIcon,
  ClockIcon,
  ClipboardDocumentListIcon
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
          <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              รูปถ่ายประจำตัว
            </h3>
            <div className="flex items-center gap-6">
              {application.profileImage ? (
                <img
                  src={`/api/image?file=${application.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg"
                style={{ display: application.profileImage ? 'none' : 'flex' }}
              >
                {application.firstName.charAt(0)}{application.lastName.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-700"><span className="font-medium">ชื่อ:</span> {application.prefix ? `${application.prefix} ` : ''}{application.firstName} {application.lastName}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">ตำแหน่งที่สมัคร:</span> {application.appliedPosition}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">คำนำหน้า</label>
              <input
                value={application.prefix || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อ</label>
              <input
                value={application.firstName || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">นามสกุล</label>
              <input
                value={application.lastName || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">อีเมล</label>
              <input
                value={application.email || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เบอร์โทรศัพท์</label>
              <input
                value={application.phone || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">วันเกิด</label>
              <input
                value={application.birthDate || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เพศ</label>
              <input
                value={application.gender || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ตำแหน่งที่สมัคร</label>
              <input
                value={application.appliedPosition || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เงินเดือนที่คาดหวัง</label>
              <input
                value={application.expectedSalary || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-600 mb-1 block">ที่อยู่ปัจจุบัน</label>
            <textarea
              value={application.currentAddress || ''}
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
                value={application.idNumber || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">อายุ</label>
              <input
                value={application.age || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">เชื้อชาติ</label>
              <input
                value={application.race || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">สถานที่เกิด</label>
              <input
                value={application.placeOfBirth || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">สัญชาติ</label>
              <input
                value={application.nationality || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ศาสนา</label>
              <input
                value={application.religion || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">สถานะสมรส</label>
              <input
                value={application.maritalStatus || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">วันที่สามารถเริ่มงานได้</label>
              <input
                value={application.availableDate || ''}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">ทำงานปัจจุบัน</label>
              <input
                value={application.currentWork ? 'ใช่' : 'ไม่'}
                disabled
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* ข้อมูลติดต่อฉุกเฉิน */}
          {(application.emergencyContact || application.emergencyPhone) && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลติดต่อฉุกเฉิน</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อผู้ติดต่อฉุกเฉิน</label>
                  <input
                    value={application.emergencyContact || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">เบอร์โทรฉุกเฉิน</label>
                  <input
                    value={application.emergencyPhone || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ความสัมพันธ์</label>
                  <input
                    value={application.emergencyRelationship || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}
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
        </CardBody>
      </Card>

      {/* ทักษะและความสามารถ */}
      {(application.skills || application.languages || application.computerSkills || application.certificates || application.references) && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ทักษะและความสามารถ</h2>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <div className="space-y-6">
              {application.skills && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ทักษะพิเศษ</label>
                  <textarea
                    value={application.skills}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
              
              {application.languages && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ภาษา</label>
                  <textarea
                    value={application.languages}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={2}
                  />
                </div>
              )}
              
              {application.computerSkills && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ทักษะคอมพิวเตอร์</label>
                  <textarea
                    value={application.computerSkills}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
              
              {application.certificates && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">ใบรับรอง/ประกาศนียบัตร</label>
                  <textarea
                    value={application.certificates}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
              
              {application.references && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">บุคคลอ้างอิง</label>
                  <textarea
                    value={application.references}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ข้อมูลคู่สมรส */}
      {application.spouseInfo && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ข้อมูลคู่สมรส</h2>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ชื่อคู่สมรส</label>
                <input
                  value={application.spouseInfo.firstName || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">นามสกุลคู่สมรส</label>
                <input
                  value={application.spouseInfo.lastName || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ที่อยู่ตามทะเบียนบ้าน */}
      {application.registeredAddress && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-cyan-500 via-sky-500 to-cyan-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-sky-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ที่อยู่ตามทะเบียนบ้าน</h2>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">บ้านเลขที่</label>
                <input
                  value={application.registeredAddress.houseNumber || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">หมู่</label>
                <input
                  value={application.registeredAddress.villageNumber || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ซอย</label>
                <input
                  value={application.registeredAddress.alley || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ถนน</label>
                <input
                  value={application.registeredAddress.road || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">ตำบล/แขวง</label>
                <input
                  value={application.registeredAddress.subDistrict || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">อำเภอ/เขต</label>
                <input
                  value={application.registeredAddress.district || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">จังหวัด</label>
                <input
                  value={application.registeredAddress.province || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">รหัสไปรษณีย์</label>
                <input
                  value={application.registeredAddress.postalCode || ''}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent border-gray-300 disabled:bg-gray-50"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

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
              color="warning"
              size="lg"
              startContent={<ClockIcon className="w-5 h-5" />}
              onClick={() => onStatusUpdate?.(application.id, 'pending')}
              className="flex-1"
            >
              รอพิจารณา
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
  const router = useRouter();
  const { user, logout } = useUser();
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
      const response = await fetch('/api/resume-deposit');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const apps = data.data || [];
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

  const handleLogout = () => {
    logout();
    alert('ออกจากระบบ Admin สำเร็จ');
    router.push('/dashboard');
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
                          src={application.profileImage ? `/image/${application.profileImage}` : undefined}
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
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
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