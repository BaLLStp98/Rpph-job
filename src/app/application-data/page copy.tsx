'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Thai } from 'flatpickr/dist/l10n/th.js';
import {
  Card,
  CardBody,
  CardHeader, 
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Chip
} from '@nextui-org/react';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
  PrinterIcon,
  ArrowLeftIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

// Interface สำหรับข้อมูลใบสมัครงาน
interface ApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedPosition: string;
  department: string;
  status: string;
  createdAt: string;
  source?: string; // 'ResumeDeposit' หรือ 'ApplicationForm'
  profileImage?: string;
  profileImageUrl?: string;
  // ข้อมูลส่วนตัว
  prefix?: string;
  birthDate?: string;
  age?: string;
  race?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender?: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: string;
  currentAddress?: string;
  // ข้อมูลบัตรประชาชน
  idNumber?: string;
  idCardIssuedAt?: string;
  idCardIssueDate?: string;
  idCardExpiryDate?: string;
  // ข้อมูลการติดต่อ
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  // ข้อมูลที่อยู่
  registeredAddress?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
    mobile?: string;
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
  emergencyAddress?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
  };
  emergencyWorkplace?: {
    name?: string;
    district?: string;
    province?: string;
    phone?: string;
  };
  // ข้อมูลคู่สมรส
  spouseInfo?: {
    firstName?: string;
    lastName?: string;
  };
  // ข้อมูลสิทธิการรักษา
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
  // ข้อมูลการสมัครงาน
  expectedSalary?: string;
  availableDate?: string;
  currentWork?: boolean;
  unit?: string;
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  applicantSignature?: string;
  applicationDate?: string;
  // ข้อมูลการทำงานในภาครัฐ
  previousGovernmentService?: Array<{
    position?: string;
    department?: string;
    reason?: string;
    date?: string;
  }>;
  // ข้อมูลนายจ้างหลายราย
  multipleEmployers?: string[];
  // ข้อมูลการศึกษา
  education: Array<{
    level?: string;
    institution?: string;
    school?: string;
    major?: string;
    year?: string;
    graduationYear?: string;
    gpa?: string;
  }>;
  // ข้อมูลประสบการณ์ทำงาน
  workExperience: Array<{
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    salary?: string;
    reason?: string;
  }>;
  // ข้อมูลเอกสาร
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

// Component สำหรับแสดงข้อมูลในรูปแบบเดียวกับหน้า register
const ApplicationFormView = ({ 
  application, 
  isEditing = false,
  onInputChange,
  uploadingFiles = {},
  onFileSelect
}: { 
  application: ApplicationData;
  isEditing?: boolean;
  onInputChange?: (field: string, value: any) => void;
  uploadingFiles?: {[key: string]: boolean};
  onFileSelect?: (event: React.ChangeEvent<HTMLInputElement>, documentType: string, applicationId: string) => void;
}) => {
  // Refs for flatpickr
  const birthDateRef = useRef<HTMLInputElement>(null);
  const idCardIssueDateRef = useRef<HTMLInputElement>(null);
  const idCardExpiryDateRef = useRef<HTMLInputElement>(null);
  const applicationDateRef = useRef<HTMLInputElement>(null);
  const availableDateRef = useRef<HTMLInputElement>(null);

  // แปลงค่าตำแหน่งที่สมัครให้ถูกต้อง พร้อม fallback หลายแหล่งและถอดรหัส
  const resolveAppliedPosition = (appLike: any, isApplicationForm?: boolean): string => {
    console.log('🔍 resolveAppliedPosition called with:', {
      appLike: appLike,
      isApplicationForm,
      appliedPosition: appLike?.appliedPosition,
      expectedPosition: appLike?.expectedPosition,
      staff_position: appLike?.staff_position,
      jobPosition: appLike?.jobPosition
    });

    // ใช้ฟิลด์ตามชนิดข้อมูล แล้วค่อย fallback แบบปลอดภัย ไม่ใช้ field ทั่วไปที่อาจเป็นชื่อฝ่าย
    const candidates = [
      isApplicationForm ? appLike?.appliedPosition : appLike?.expectedPosition,
      // fallbacks ที่ปลอดภัยกว่า
      appLike?.appliedPosition,
      appLike?.expectedPosition,
      appLike?.staff_position,
      appLike?.jobPosition,
    ].filter(Boolean) as string[];

    console.log('🔍 candidates:', candidates);

    if (candidates.length === 0) {
      console.log('🔍 No candidates found, returning ไม่ระบุ');
      return 'ไม่ระบุ';
    }
    
    const raw = candidates.find((v) => {
      if (typeof v !== 'string') return false;
      const t = v.trim();
      return t.length > 0 && t.toLowerCase() !== 'null' && t.toLowerCase() !== 'undefined';
    }) || '';

    console.log('🔍 raw value found:', raw);

    if (!raw) {
      console.log('🔍 No valid raw value, returning ไม่ระบุ');
      return 'ไม่ระบุ';
    }
    
    const normalized = raw.replace(/\+/g, ' ').trim();
    try {
      const result = decodeURIComponent(normalized);
      console.log('🔍 Final result:', result);
      return result;
    } catch {
      console.log('🔍 Decode failed, returning normalized:', normalized);
      return normalized;
    }
  };

  // ตั้งค่า flatpickr สำหรับ input วันที่ต่างๆ
  useEffect(() => {
    // วันเกิด
    if (birthDateRef.current) {
      const inst = (birthDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(birthDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        onChange: function(selectedDates, dateStr, instance) {
          if (onInputChange) {
            onInputChange('birthDate', dateStr);
          }
        }
      });
    }

    // วันที่ออกบัตร
    if (idCardIssueDateRef.current) {
      const inst = (idCardIssueDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(idCardIssueDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        onChange: function(selectedDates, dateStr, instance) {
          if (onInputChange) {
            onInputChange('idCardIssueDate', dateStr);
          }
        }
      });
    }

    // วันหมดอายุบัตร
    if (idCardExpiryDateRef.current) {
      const inst = (idCardExpiryDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(idCardExpiryDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        onChange: function(selectedDates, dateStr, instance) {
          if (onInputChange) {
            onInputChange('idCardExpiryDate', dateStr);
          }
        }
      });
    }

    // วันที่สมัคร
    if (applicationDateRef.current) {
      const inst = (applicationDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(applicationDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        onChange: function(selectedDates, dateStr, instance) {
          if (onInputChange) {
            onInputChange('applicationDate', dateStr);
          }
        }
      });
    }

    // วันที่พร้อมเริ่มงาน
    if (availableDateRef.current) {
      const inst = (availableDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(availableDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        onChange: function(selectedDates, dateStr, instance) {
          if (onInputChange) {
            onInputChange('availableDate', dateStr);
          }
        }
      });
    }
  }, [isEditing, application, onInputChange]);

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ฟังก์ชันแปลงวันที่จาก ISO format เป็น d/m/Y สำหรับ flatpickr
  const formatDateForFlatpickr = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {/* ข้อมูลส่วนตัว */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
          <div className="relative flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                 <UserIcon className="w-6 h-6" />
               </div>
               <h2 className="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
           </div>
         </CardHeader>
        <CardBody className="p-8">
          {/* ๑. ประวัติส่วนตัว */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
              ๑. ประวัติส่วนตัว
              </h3>
            
            {/* รูปโปรไฟล์ */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                รูปโปรไฟล์
              </h4>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {application.profileImageUrl ? (
                    <img
                      src={application.profileImageUrl.startsWith('http') ?
                        application.profileImageUrl :
                        `/api/image?file=${encodeURIComponent(application.profileImageUrl)}`}
                      alt="รูปโปรไฟล์"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                      onError={(e) => {
                        console.log('❌ Large profile image load error:', application.profileImageUrl);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                      onLoad={() => {
                        console.log('✅ Large profile image loaded:', application.profileImageUrl);
                      }}
                    />
                  ) : null}
                  <div className={`w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 shadow-lg flex items-center justify-center ${application.profileImageUrl ? 'hidden' : ''}`}>
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                  </div>
                </div>

            {/* ๑.๑ ชื่อ (นาย/นาง/นางสาว) */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๑.๑ ชื่อ (นาย/นาง/นางสาว)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">คำนำหน้า</label>
                   {isEditing ? (
                     <select
                       value={application.prefix || ''}
                       onChange={(e) => onInputChange?.('prefix', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                       <option value="">เลือกคำนำหน้า</option>
                       <option value="นาย">นาย</option>
                       <option value="นาง">นาง</option>
                       <option value="นางสาว">นางสาว</option>
                       <option value="เด็กชาย">เด็กชาย</option>
                       <option value="เด็กหญิง">เด็กหญิง</option>
                       <option value="ด.ช.">ด.ช.</option>
                       <option value="ด.ญ.">ด.ญ.</option>
                       <option value="ผศ.">ผศ.</option>
                       <option value="รศ.">รศ.</option>
                       <option value="ศ.">ศ.</option>
                     </select>
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.prefix || '-'}
                    </div>
                   )}
                </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">ชื่อ</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.firstName || ''}
                       onChange={(e) => onInputChange?.('firstName', e.target.value)}
                       placeholder="กรอกชื่อ (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.firstName || '-'}
                     </div>
               )}
             </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">นามสกุล</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.lastName || ''}
                       onChange={(e) => onInputChange?.('lastName', e.target.value)}
                       placeholder="กรอกนามสกุล (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.lastName || '-'}
                     </div>
                   )}
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">วัน เดือน ปีเกิด</label>
                   {isEditing ? (
                     <input
                       ref={birthDateRef}
                       type="text"
                       value={formatDateForFlatpickr(application.birthDate || '')}
                       onChange={(e) => onInputChange?.('birthDate', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="dd/mm/yyyy"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {formatDate(application.birthDate || '') || '-'}
                     </div>
                   )}
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">อายุ</label>
                   {isEditing ? (
                     <input
                       type="number"
                       value={application.age || ''}
                       onChange={(e) => onInputChange?.('age', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.age || '-'}
                     </div>
                   )}
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">เพศ</label>
                   {isEditing ? (
                     <div className="flex gap-4">
                       <label className="flex items-center gap-2">
                         <input 
                           type="radio" 
                           name="gender" 
                           value="ชาย"
                           checked={application.gender === 'ชาย'}
                           onChange={(e) => onInputChange?.('gender', e.target.value)}
                           className="w-4 h-4" 
                         />
                         <span>ชาย</span>
                       </label>
                       <label className="flex items-center gap-2">
                         <input 
                           type="radio" 
                           name="gender" 
                           value="หญิง"
                           checked={application.gender === 'หญิง'}
                           onChange={(e) => onInputChange?.('gender', e.target.value)}
                           className="w-4 h-4" 
                         />
                         <span>หญิง</span>
                       </label>
                     </div>
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.gender || '-'}
                     </div>
                   )}
                 </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สัญชาติ</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.nationality || ''}
                       onChange={(e) => onInputChange?.('nationality', e.target.value)}
                       placeholder="กรอกสัญชาติ (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.nationality || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ศาสนา</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.religion || ''}
                       onChange={(e) => onInputChange?.('religion', e.target.value)}
                       placeholder="กรอกศาสนา (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.religion || '-'}
                    </div>
                  )}
                </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">สถานภาพสมรส</label>
                   {isEditing ? (
                     <div className="flex gap-6">
                       <label className="flex items-center gap-2">
                         <input 
                           type="radio" 
                           name="maritalStatus" 
                           value="โสด"
                           checked={application.maritalStatus === 'โสด'}
                           onChange={(e) => onInputChange?.('maritalStatus', e.target.value)}
                           className="w-4 h-4" 
                         />
                         <span>โสด</span>
                       </label>
                       <label className="flex items-center gap-2">
                         <input 
                           type="radio" 
                           name="maritalStatus" 
                           value="สมรส"
                           checked={application.maritalStatus === 'สมรส'}
                           onChange={(e) => onInputChange?.('maritalStatus', e.target.value)}
                           className="w-4 h-4" 
                         />
                         <span>สมรส</span>
                       </label>
                       <label className="flex items-center gap-2">
                         <input 
                           type="radio" 
                           name="maritalStatus" 
                           value="หย่าร้าง"
                           checked={application.maritalStatus === 'หย่าร้าง'}
                           onChange={(e) => onInputChange?.('maritalStatus', e.target.value)}
                           className="w-4 h-4" 
                         />
                         <span>หย่าร้าง</span>
                       </label>
                       <label className="flex items-center gap-2">
                         <input 
                           type="radio" 
                           name="maritalStatus" 
                           value="หม้าย"
                           checked={application.maritalStatus === 'หม้าย'}
                           onChange={(e) => onInputChange?.('maritalStatus', e.target.value)}
                           className="w-4 h-4" 
                         />
                         <span>หม้าย</span>
                       </label>
                     </div>
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.maritalStatus || '-'}
                     </div>
                   )}
                 </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เชื้อชาติ</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.race || ''}
                       onChange={(e) => onInputChange?.('race', e.target.value)}
                       placeholder="กรอกเชื้อชาติ (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.race || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สถานที่เกิด</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.placeOfBirth || ''}
                       onChange={(e) => onInputChange?.('placeOfBirth', e.target.value)}
                       placeholder="กรอกสถานที่เกิด (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.placeOfBirth || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">จังหวัดที่เกิด</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.placeOfBirthProvince || ''}
                       onChange={(e) => onInputChange?.('placeOfBirthProvince', e.target.value)}
                       placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.placeOfBirthProvince || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>
             </div>
             
          {/* ๒. ข้อมูลบัตรประชาชน */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
              ๒. ข้อมูลบัตรประชาชน
            </h3>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">เลขบัตรประชาชน</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.idNumber || ''}
                       onChange={(e) => onInputChange?.('idNumber', e.target.value)}
                       placeholder="กรอกเลขบัตรประชาชน (เฉพาะตัวเลข)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.idNumber || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ออกโดย</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.idCardIssuedAt || ''}
                       onChange={(e) => onInputChange?.('idCardIssuedAt', e.target.value)}
                       placeholder="กรอกออกโดย (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.idCardIssuedAt || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">วันที่ออกบัตร</label>
                 {isEditing ? (
                   <input
                       ref={idCardIssueDateRef}
                       type="text"
                       value={formatDateForFlatpickr(application.idCardIssueDate || '')}
                     onChange={(e) => onInputChange?.('idCardIssueDate', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="dd/mm/yyyy"
                   />
                 ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {formatDate(application.idCardIssueDate || '') || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">วันที่บัตรหมดอายุ</label>
                 {isEditing ? (
                   <input
                       ref={idCardExpiryDateRef}
                       type="text"
                       value={formatDateForFlatpickr(application.idCardExpiryDate || '')}
                     onChange={(e) => onInputChange?.('idCardExpiryDate', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="dd/mm/yyyy"
                   />
                 ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {formatDate(application.idCardExpiryDate || '') || '-'}
                   </div>
                 )}
               </div>
             </div>
          </div>

          {/* ๓. ข้อมูลการติดต่อ */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
              ๓. ข้อมูลการติดต่อ
            </h3>
            
            {/* ๓.๑ ที่อยู่ตามทะเบียนบ้าน */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๓.๑ ที่อยู่ตามทะเบียนบ้าน
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เลขที่</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.houseNumber || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.houseNumber', e.target.value)}
                      placeholder="กรอกเลขที่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.houseNumber || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">หมู่ที่</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.villageNumber || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.villageNumber', e.target.value)}
                      placeholder="กรอกหมู่ที่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.villageNumber || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ตรอก/ซอย</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.alley || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.alley', e.target.value)}
                      placeholder="กรอกตรอก/ซอย"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.alley || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ถนน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.road || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.road', e.target.value)}
                      placeholder="กรอกถนน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.road || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ตำบล/แขวง</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.subDistrict || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.subDistrict', e.target.value)}
                      placeholder="กรอกตำบล/แขวง"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.subDistrict || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.district || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.district', e.target.value)}
                      placeholder="กรอกอำเภอ/เขต"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.district || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.province || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.province', e.target.value)}
                      placeholder="กรอกจังหวัด"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.province || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.postalCode || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.postalCode', e.target.value)}
                      placeholder="กรอกรหัสไปรษณีย์"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.postalCode || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.phone || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.phone', e.target.value)}
                      placeholder="กรอกโทรศัพท์บ้าน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.phone || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.registeredAddress?.mobile || ''}
                      onChange={(e) => onInputChange?.('registeredAddress.mobile', e.target.value)}
                      placeholder="กรอกโทรศัพท์มือถือ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.registeredAddress?.mobile || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ๓.๒ ที่อยู่ปัจจุบัน */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๓.๒ ที่อยู่ปัจจุบัน
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เลขที่</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.houseNumber || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.houseNumber', e.target.value)}
                      placeholder="กรอกเลขที่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.houseNumber || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">หมู่ที่</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.villageNumber || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.villageNumber', e.target.value)}
                      placeholder="กรอกหมู่ที่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.villageNumber || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ตรอก/ซอย</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.alley || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.alley', e.target.value)}
                      placeholder="กรอกตรอก/ซอย"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.alley || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ถนน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.road || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.road', e.target.value)}
                      placeholder="กรอกถนน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.road || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ตำบล/แขวง</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.subDistrict || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.subDistrict', e.target.value)}
                      placeholder="กรอกตำบล/แขวง"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.subDistrict || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.district || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.district', e.target.value)}
                      placeholder="กรอกอำเภอ/เขต"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.district || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.province || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.province', e.target.value)}
                      placeholder="กรอกจังหวัด"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.province || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.postalCode || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.postalCode', e.target.value)}
                      placeholder="กรอกรหัสไปรษณีย์"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.postalCode || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.homePhone || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.homePhone', e.target.value)}
                      placeholder="กรอกโทรศัพท์บ้าน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.homePhone || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.currentAddressDetail?.mobilePhone || ''}
                      onChange={(e) => onInputChange?.('currentAddressDetail.mobilePhone', e.target.value)}
                      placeholder="กรอกโทรศัพท์มือถือ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.currentAddressDetail?.mobilePhone || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ๓.๓ ข้อมูลการติดต่อ */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๓.๓ ข้อมูลการติดต่อ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.phone || ''}
                       onChange={(e) => onInputChange?.('phone', e.target.value)}
                       placeholder="กรอกเบอร์โทรศัพท์ (เฉพาะตัวเลข)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.phone || '-'}
                     </div>
               )}
             </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">อีเมล</label>
                   {isEditing ? (
                     <input
                       type="email"
                       value={application.email || ''}
                       onChange={(e) => onInputChange?.('email', e.target.value)}
                       placeholder="กรอกอีเมล"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.email || '-'}
                     </div>
                   )}
                 </div>
              </div>
            </div>
             </div>
             
          {/* ๔. ข้อมูลผู้ติดต่อฉุกเฉิน */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
              ๔. ข้อมูลผู้ติดต่อฉุกเฉิน
            </h3>
            
            {/* ๔.๑ ข้อมูลผู้ติดต่อฉุกเฉิน */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๔.๑ ข้อมูลผู้ติดต่อฉุกเฉิน
              </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.emergencyContact || ''}
                       onChange={(e) => onInputChange?.('emergencyContact', e.target.value)}
                       placeholder="กรอกชื่อ-นามสกุล (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.emergencyContact || '-'}
                     </div>
                   )}
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.emergencyPhone || ''}
                       onChange={(e) => onInputChange?.('emergencyPhone', e.target.value)}
                       placeholder="กรอกเบอร์โทรศัพท์ (เฉพาะตัวเลข)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.emergencyPhone || '-'}
                     </div>
                   )}
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">ความสัมพันธ์</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.emergencyRelationship || ''}
                       onChange={(e) => onInputChange?.('emergencyRelationship', e.target.value)}
                       placeholder="กรอกความสัมพันธ์ (เฉพาะตัวอักษร)"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                     <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                       {application.emergencyRelationship || '-'}
                     </div>
                   )}
                 </div>
               </div>
             </div>
             
            {/* ๔.๒ ที่อยู่ฉุกเฉิน */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๔.๒ ที่อยู่ฉุกเฉิน
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เลขที่</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.houseNumber || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.houseNumber', e.target.value)}
                      placeholder="กรอกเลขที่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.houseNumber || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">หมู่ที่</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.villageNumber || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.villageNumber', e.target.value)}
                      placeholder="กรอกหมู่ที่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.villageNumber || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ตรอก/ซอย</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.alley || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.alley', e.target.value)}
                      placeholder="กรอกตรอก/ซอย"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.alley || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ถนน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.road || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.road', e.target.value)}
                      placeholder="กรอกถนน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.road || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ตำบล/แขวง</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.subDistrict || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.subDistrict', e.target.value)}
                      placeholder="กรอกตำบล/แขวง"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.subDistrict || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.district || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.district', e.target.value)}
                      placeholder="กรอกอำเภอ/เขต"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.district || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.province || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.province', e.target.value)}
                      placeholder="กรอกจังหวัด"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.province || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.postalCode || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.postalCode', e.target.value)}
                      placeholder="กรอกรหัสไปรษณีย์"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.postalCode || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyAddress?.phone || ''}
                      onChange={(e) => onInputChange?.('emergencyAddress.phone', e.target.value)}
                      placeholder="กรอกโทรศัพท์"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyAddress?.phone || '-'}
                    </div>
                  )}
                </div>
              </div>
             </div>
             
            {/* ๔.๓ ที่ทำงานฉุกเฉิน */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                ๔.๓ ที่ทำงานฉุกเฉิน
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ชื่อที่ทำงาน</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyWorkplace?.name || ''}
                      onChange={(e) => onInputChange?.('emergencyWorkplace.name', e.target.value)}
                      placeholder="กรอกชื่อที่ทำงาน"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyWorkplace?.name || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyWorkplace?.district || ''}
                      onChange={(e) => onInputChange?.('emergencyWorkplace.district', e.target.value)}
                      placeholder="กรอกอำเภอ/เขต"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyWorkplace?.district || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyWorkplace?.province || ''}
                      onChange={(e) => onInputChange?.('emergencyWorkplace.province', e.target.value)}
                      placeholder="กรอกจังหวัด"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyWorkplace?.province || '-'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โทรศัพท์</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={application.emergencyWorkplace?.phone || ''}
                      onChange={(e) => onInputChange?.('emergencyWorkplace.phone', e.target.value)}
                      placeholder="กรอกโทรศัพท์"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {application.emergencyWorkplace?.phone || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ข้อมูลคู่สมรส */}
      {(application.spouseInfo?.firstName || application.spouseInfo?.lastName) && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ชื่อ</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={application.spouseInfo?.firstName || ''}
                    onChange={(e) => onInputChange?.('spouseInfo.firstName', e.target.value)}
                    placeholder="กรอกชื่อคู่สมรส"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.spouseInfo?.firstName || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">นามสกุล</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={application.spouseInfo?.lastName || ''}
                    onChange={(e) => onInputChange?.('spouseInfo.lastName', e.target.value)}
                    placeholder="กรอกนามสกุลคู่สมรส"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.spouseInfo?.lastName || '-'}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ข้อมูลสิทธิการรักษา */}
      {(application.medicalRights?.hasUniversalHealthcare || application.medicalRights?.hasSocialSecurity || application.medicalRights?.hasCivilServantRights) && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <DocumentTextIcon className="w-6 h-6" />
             </div>
              <h2 className="text-xl font-semibold">ข้อมูลสิทธิการรักษา</h2>
           </div>
          </CardHeader>
          <CardBody className="p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สิทธิหลักประกันสุขภาพถ้วนหน้า</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.medicalRights?.hasUniversalHealthcare ? 'มี' : 'ไม่มี'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โรงพยาบาลหลักประกันสุขภาพ</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.medicalRights?.universalHealthcareHospital || '-'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สิทธิประกันสังคม</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.medicalRights?.hasSocialSecurity ? 'มี' : 'ไม่มี'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">โรงพยาบาลประกันสังคม</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.medicalRights?.socialSecurityHospital || '-'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สิทธิข้าราชการ</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.medicalRights?.hasCivilServantRights ? 'มี' : 'ไม่มี'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">สิทธิอื่นๆ</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {application.medicalRights?.otherRights || '-'}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ข้อมูลการทำงานในภาครัฐ */}
      {application.previousGovernmentService && application.previousGovernmentService.length > 0 && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ข้อมูลการทำงานในภาครัฐ</h2>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <div className="space-y-6">
              {application.previousGovernmentService.map((gov, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">การทำงานในภาครัฐ {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {gov.position || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">หน่วยงาน</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {gov.department || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เหตุผลที่ออก</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {gov.reason || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่ออก</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {formatDate(gov.date || '') || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ข้อมูลนายจ้างหลายราย */}
      {application.multipleEmployers && application.multipleEmployers.length > 0 && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BriefcaseIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">ข้อมูลนายจ้างหลายราย</h2>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <div className="space-y-4">
              {application.multipleEmployers.map((employer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {employer || '-'}
                  </div>
                </div>
              ))}
           </div>
        </CardBody>
      </Card>
      )}

      {/* ข้อมูลการศึกษา */}
      {application.education && application.education.length > 0 && (
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
            <div className="space-y-6">
              {application.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">ระดับการศึกษา {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ระดับการศึกษา</label>
                      {isEditing ? (
                        <select
                          value={edu.level || ''}
                          onChange={(e) => onInputChange?.(`education[${index}].level`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">เลือกระดับการศึกษา</option>
                          <option value="ประถมศึกษา">ประถมศึกษา</option>
                          <option value="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</option>
                          <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                          <option value="ประกาศนียบัตรวิชาชีพ (ปวช.)">ประกาศนียบัตรวิชาชีพ (ปวช.)</option>
                          <option value="ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)">ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</option>
                          <option value="ปริญญาตรี">ปริญญาตรี</option>
                          <option value="ปริญญาโท">ปริญญาโท</option>
                          <option value="ปริญญาเอก">ปริญญาเอก</option>
                        </select>
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.level || '-'}
                     </div>
                      )}
                     </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถาบัน</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.institution || edu.school || ''}
                          onChange={(e) => onInputChange?.(`education[${index}].institution`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ชื่อสถาบัน"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.institution || edu.school || '-'}
                     </div>
                      )}
                     </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สาขาวิชา</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.major || ''}
                          onChange={(e) => onInputChange?.(`education[${index}].major`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="สาขาวิชา"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.major || '-'}
                     </div>
                      )}
                   </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ปีที่จบ</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.year || edu.graduationYear || ''}
                          onChange={(e) => onInputChange?.(`education[${index}].year`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ปีที่จบ (เช่น 2565)"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.year || edu.graduationYear || '-'}
                </div>
                      )}
            </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เกรดเฉลี่ย</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => onInputChange?.(`education[${index}].gpa`, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="เกรดเฉลี่ย (เช่น 3.50)"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.gpa || '-'}
            </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </CardBody>
      </Card>
      )}

      {/* ข้อมูลประสบการณ์ทำงาน */}
      {application.workExperience && application.workExperience.length > 0 && (
      <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
              <h2 className="text-xl font-semibold">ข้อมูลประสบการณ์ทำงาน</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
            <div className="space-y-6">
              {isEditing && (
                <div className="flex justify-end mb-4">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      const newWork = {
                        position: '',
                        company: '',
                        startDate: '',
                        endDate: '',
                        salary: '',
                        reason: ''
                      };
                      onInputChange?.('workExperience', [...(application.workExperience || []), newWork]);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    + เพิ่มประสบการณ์ทำงาน
                  </Button>
                </div>
              )}
              {application.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-700">ประสบการณ์ทำงาน {index + 1}</h4>
                    {isEditing && application.workExperience.length > 1 && (
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => {
                          const updatedWorkExperience = application.workExperience.filter((_, i) => i !== index);
                          onInputChange?.('workExperience', updatedWorkExperience);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={work.position || ''}
                          onChange={(e) => onInputChange?.(`workExperience[${index}].position`, e.target.value)}
                          placeholder="กรอกตำแหน่ง"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.position || '-'}
                      </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">บริษัท</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={work.company || ''}
                          onChange={(e) => onInputChange?.(`workExperience[${index}].company`, e.target.value)}
                          placeholder="กรอกบริษัท"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.company || '-'}
                      </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่เริ่มงาน</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formatDateForFlatpickr(work.startDate || '')}
                          onChange={(e) => onInputChange?.(`workExperience[${index}].startDate`, e.target.value)}
                          placeholder="dd/mm/yyyy"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {formatDate(work.startDate || '') || '-'}
                      </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formatDateForFlatpickr(work.endDate || '')}
                          onChange={(e) => onInputChange?.(`workExperience[${index}].endDate`, e.target.value)}
                          placeholder="dd/mm/yyyy"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {formatDate(work.endDate || '') || '-'}
                      </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เงินเดือน</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={work.salary || ''}
                          onChange={(e) => onInputChange?.(`workExperience[${index}].salary`, e.target.value)}
                          placeholder="กรอกเงินเดือน"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.salary || '-'}
                      </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เหตุผลที่ออก</label>
                      {isEditing ? (
                        <textarea
                          value={work.reason || ''}
                          onChange={(e) => onInputChange?.(`workExperience[${index}].reason`, e.target.value)}
                          placeholder="กรอกเหตุผลที่ออก"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.reason || '-'}
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ข้อมูลการสมัครงาน */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลการสมัครงาน</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">ตำแหน่งที่สมัคร</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={resolveAppliedPosition(application, true) || ''}
                       onChange={(e) => onInputChange?.('appliedPosition', e.target.value)}
                       placeholder="กรอกตำแหน่งที่สมัคร"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                 <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                   {resolveAppliedPosition(application, true) || '-'}
                 </div>
                       )}
                     </div>
             {/* <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">เงินเดือนที่คาดหวัง</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.expectedSalary || ''}
                       onChange={(e) => onInputChange?.('expectedSalary', e.target.value)}
                       placeholder="กรอกเงินเดือนที่คาดหวัง"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                 <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                   {application.expectedSalary || '-'}
                     </div>
               )}
             </div> */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">วันที่พร้อมเริ่มงาน</label>
              {isEditing ? (
                <input
                  ref={availableDateRef}
                  type="text"
                  value={formatDateForFlatpickr(application.availableDate || '')}
                  onChange={(e) => onInputChange?.('availableDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="dd/mm/yyyy"
                />
              ) : (
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {formatDate(application.availableDate || '') || '-'}
              </div>
              )}
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ฝ่าย</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {application.department || '-'}
              </div>
            </div> */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">หน่วยงาน</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {application.unit || '-'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ทำงานปัจจุบัน</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {application.currentWork ? 'ใช่' : 'ไม่'}
              </div>
            </div> */}
                     </div>
                     
          {/* ทักษะและความสามารถ */}
          <div className="mt-8 space-y-4">
            <h4 className="text-md font-semibold text-gray-700">ทักษะและความสามารถ</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ทักษะ</label>
                   {isEditing ? (
                     <textarea
                       value={application.skills || ''}
                       onChange={(e) => onInputChange?.('skills', e.target.value)}
                       placeholder="กรุณากรอกความรู้ ความสามารถ และทักษะพิเศษของท่าน"
                       rows={3}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.skills || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ภาษา</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.languages || ''}
                       onChange={(e) => onInputChange?.('languages', e.target.value)}
                       placeholder="กรอกภาษาที่ใช้ได้"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.languages || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ทักษะคอมพิวเตอร์</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.computerSkills || ''}
                       onChange={(e) => onInputChange?.('computerSkills', e.target.value)}
                       placeholder="กรอกทักษะคอมพิวเตอร์"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.computerSkills || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ใบรับรอง</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.certificates || ''}
                       onChange={(e) => onInputChange?.('certificates', e.target.value)}
                       placeholder="กรอกใบรับรอง"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.certificates || '-'}
                   </div>
                 )}
               </div>
             </div>
                     </div>
                     
          {/* ข้อมูลผู้แนะนำ */}
          {/* <div className="mt-8 space-y-4">
            <h4 className="text-md font-semibold text-gray-700">ข้อมูลผู้อ้างอิง</h4>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">ผู้อ้างอิง</label>
                   {isEditing ? (
                     <textarea
                       value={application.references || ''}
                       onChange={(e) => onInputChange?.('references', e.target.value)}
                       placeholder="กรุณากรอกข้อมูลผู้อ้างอิง"
                       rows={3}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                     />
                   ) : (
                 <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                   {application.references || '-'}
                 </div>
               )}
             </div>
                   </div> */}
                  
          {/* ข้อมูลการสมัคร */}
          {/* <div className="mt-8 space-y-4">
            <h4 className="text-md font-semibold text-gray-700">ข้อมูลการสมัคร</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">วันที่สมัคร</label>
                 {isEditing ? (
                   <input
                   ref={applicationDateRef}
                   type="text"
                   value={formatDateForFlatpickr(application.applicationDate || '')}
                     onChange={(e) => onInputChange?.('applicationDate', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="dd/mm/yyyy"
                   />
                 ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {formatDate(application.applicationDate || '') || '-'}
                   </div>
                 )}
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ลายมือชื่อผู้สมัคร</label>
                   {isEditing ? (
                     <input
                       type="text"
                       value={application.applicantSignature || ''}
                       onChange={(e) => onInputChange?.('applicantSignature', e.target.value)}
                       placeholder="กรอกลายมือชื่อผู้สมัคร"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                   <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                     {application.applicantSignature || '-'}
                   </div>
                 )}
               </div>
             </div>
          </div> */}
        </CardBody>
      </Card>

      {/* ข้อมูลแนบเอกสาร */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-slate-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">ข้อมูลแนบเอกสาร</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {/* ๔. เอกสารแนบ */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
              ๔. เอกสารแนบ
            </h3>
            
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
                  {application.documents?.idCard ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.idCard.split('/').pop() || 'บัตรประชาชน'}
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
                          onClick={() => window.open(application.documents?.idCard, '_blank')}
                >
                          ดูตัวอย่าง
                </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`idCard-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'idCard', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`idCard-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-idCard`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-idCard`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
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
                  {application.documents?.houseRegistration ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.houseRegistration.split('/').pop() || 'ทะเบียนบ้าน'}
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
                          onClick={() => window.open(application.documents?.houseRegistration, '_blank')}
                >
                          ดูตัวอย่าง
                </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`houseRegistration-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'houseRegistration', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`houseRegistration-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-houseRegistration`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-houseRegistration`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
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
                  {application.documents?.educationCertificate ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.educationCertificate.split('/').pop() || 'ใบรับรองการศึกษา'}
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
                          onClick={() => window.open(application.documents?.educationCertificate, '_blank')}
                        >
                          ดูตัวอย่าง
                        </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`educationCertificate-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'educationCertificate', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`educationCertificate-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-educationCertificate`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-educationCertificate`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
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
                  {application.documents?.militaryCertificate ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.militaryCertificate.split('/').pop() || 'ใบรับรองการเกณฑ์ทหาร'}
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
                          onClick={() => window.open(application.documents?.militaryCertificate, '_blank')}
                >
                          ดูตัวอย่าง
                </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`militaryCertificate-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'militaryCertificate', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`militaryCertificate-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-militaryCertificate`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-militaryCertificate`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
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
                  {application.documents?.medicalCertificate ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.medicalCertificate.split('/').pop() || 'ใบรับรองแพทย์'}
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
                          onClick={() => window.open(application.documents?.medicalCertificate, '_blank')}
                >
                          ดูตัวอย่าง
                </Button>
                        <Button
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`medicalCertificate-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'medicalCertificate', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`medicalCertificate-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-medicalCertificate`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-medicalCertificate`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
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
                  {application.documents?.drivingLicense ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.drivingLicense.split('/').pop() || 'ใบขับขี่'}
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
                          onClick={() => window.open(application.documents?.drivingLicense, '_blank')}
                        >
                          ดูตัวอย่าง
                      </Button>
                      <Button 
                          color="danger"
                          variant="bordered"
                        size="sm" 
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
                      </Button>
                    </div>
                  </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`drivingLicense-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'drivingLicense', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`drivingLicense-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-drivingLicense`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-drivingLicense`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
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
                  {application.documents?.nameChangeCertificate ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm text-green-700 font-medium">
                              {application.documents.nameChangeCertificate.split('/').pop() || 'ใบเปลี่ยนชื่อ'}
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
                          onClick={() => window.open(application.documents?.nameChangeCertificate, '_blank')}
                        >
                          ดูตัวอย่าง
                        </Button>
              <Button
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                          onClick={async () => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              try {
                                const response = await fetch(`/api/resume-documents`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    resumeDepositId: application.id,
                                    documentType: 'idCard'
                                  }),
                                });

                                if (response.ok) {
                                  alert('ลบไฟล์เรียบร้อยแล้ว');
                                  window.location.reload();
                                } else {
                                  try {
                                    const contentType = response.headers.get('content-type');
                                    if (contentType && contentType.includes('application/json')) {
                                      const errorData = await response.json();
                                      alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
                                    } else {
                                      const errorText = await response.text();
                                      alert(`เกิดข้อผิดพลาด: ${errorText || 'ไม่สามารถลบไฟล์ได้'} (Status: ${response.status})`);
                                    }
                                  } catch (parseError) {
                                    alert(`เกิดข้อผิดพลาด: ไม่สามารถลบไฟล์ได้ (Status: ${response.status})`);
                                  }
                                }
                              } catch (error) {
                                console.error('Error deleting file:', error);
                                alert('เกิดข้อผิดพลาดในการลบไฟล์');
                              }
                            }
                          }}
                        >
                          ลบ
              </Button>
            </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 block mb-3">ไม่มีไฟล์แนบ</span>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            id={`nameChangeCertificate-${application.id}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onFileSelect?.(e, 'nameChangeCertificate', application.id)}
                            className="hidden"
                          />
                          <Button
                            color="primary"
                            variant="bordered"
                            size="sm"
                            startContent={<CloudArrowUpIcon className="w-4 h-4" />}
                            onClick={() => document.getElementById(`nameChangeCertificate-${application.id}`)?.click()}
                            disabled={uploadingFiles[`${application.id}-nameChangeCertificate`]}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                          >
                            {uploadingFiles[`${application.id}-nameChangeCertificate`] ? 'กำลังอัปโหลด...' : 'อัปโหลดไฟล์'}
                          </Button>
                        </div>
                      </div>
              </div>
            )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default function ApplicationData() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusUpdateNotification, setStatusUpdateNotification] = useState<string | null>(null);
  const [newApplicationNotification, setNewApplicationNotification] = useState<string | null>(null);
  
  // Upload states
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const departmentName = searchParams.get('department');
  const resumeUserIdParam = searchParams.get('resumeUserId');
  const userIdParam = searchParams.get('userId');
  const adminParam = searchParams.get('admin');
  const limitParam = searchParams.get('limit');
  
  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ApplicationData | null>(null);


  // ฟังก์ชันสำหรับเพิ่มใบสมัครงานใหม่จากฝ่ายอื่น
  const addNewApplication = async (applicationData: ApplicationData) => {
    try {
      console.log('🆕 Adding new application from different department:', applicationData);
      
      // เพิ่มใบสมัครงานใหม่ใน state
      setApplications(prev => {
        // ตรวจสอบว่าใบสมัครงานนี้มีอยู่แล้วหรือไม่
        const exists = prev.some(app => app.id === applicationData.id);
        if (exists) {
          console.log('⚠️ Application already exists, skipping...');
          return prev;
        }
        
        // เพิ่มใบสมัครงานใหม่ที่ต้นของรายการ
        const newApplications = [applicationData, ...prev];
        console.log('✅ New application added to state');
        return newApplications;
      });
      
      // แสดงข้อความแจ้งเตือน
      setNewApplicationNotification(`ใบสมัครงานใหม่จากฝ่าย ${applicationData.department} - ${applicationData.firstName} ${applicationData.lastName}`);
      
      // ซ่อนข้อความแจ้งเตือนหลังจาก 5 วินาที
      setTimeout(() => {
        setNewApplicationNotification(null);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error adding new application:', error);
    }
  };

  // แปลงค่าฝ่ายให้ถูกต้อง และถอดรหัสกรณีเป็น percent-encoded
  const resolveDepartment = (appLike: any): string => {
    const candidates = [
      appLike?.department,
      appLike?.staff_department,
      appLike?.departmentName,
      appLike?.department_name,
      appLike?.department?.name,
      // ใช้ค่าจาก query string หากมี (เช่นดูตามฝ่าย)
      typeof departmentName === 'string' && departmentName ? departmentName : null,
    ].filter(Boolean) as string[];

    if (candidates.length === 0) return '';

    // เลือกค่าตัวแรกที่ไม่ว่าง และไม่ใช่คำว่า 'null' หรือ 'undefined'
    const raw = candidates.find((v) => {
      if (typeof v !== 'string') return false;
      const t = v.trim();
      return t.length > 0 && t.toLowerCase() !== 'null' && t.toLowerCase() !== 'undefined';
    }) || '';

    if (!raw) return '';

    // แก้กรณีเครื่องหมาย '+' แทนช่องว่าง และถอดรหัส URL
    const normalized = raw.replace(/\+/g, ' ').trim();
    try {
      return decodeURIComponent(normalized);
    } catch {
      return normalized;
    }
  };

  // แปลงค่าตำแหน่งที่สมัครให้ถูกต้อง พร้อม fallback หลายแหล่งและถอดรหัส
  const resolveAppliedPosition = (appLike: any, isApplicationForm?: boolean): string => {
    // ใช้ฟิลด์ตามชนิดข้อมูล แล้วค่อย fallback แบบปลอดภัย ไม่ใช้ field ทั่วไปที่อาจเป็นชื่อฝ่าย
    const candidates = [
      isApplicationForm ? appLike?.appliedPosition : appLike?.expectedPosition,
      // fallbacks ที่ปลอดภัยกว่า
      appLike?.appliedPosition,
      appLike?.expectedPosition,
      appLike?.staff_position,
      appLike?.jobPosition,
    ].filter(Boolean) as string[];

    if (candidates.length === 0) return 'ไม่ระบุ';
    const raw = candidates.find((v) => {
      if (typeof v !== 'string') return false;
      const t = v.trim();
      return t.length > 0 && t.toLowerCase() !== 'null' && t.toLowerCase() !== 'undefined';
    }) || '';

    if (!raw) return 'ไม่ระบุ';
    const normalized = raw.replace(/\+/g, ' ').trim();
    try {
      return decodeURIComponent(normalized);
    } catch {
      return normalized;
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลใบสมัครงาน (ดึงจากทั้ง ResumeDeposit และ ApplicationForm)
  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // 🔒 Security: ดึงข้อมูล userId และ lineId จาก session
      const userId = (session?.user as any)?.id || '';
      const userEmail = (session?.user as any)?.email || '';
      const userLineId = (session?.user as any)?.lineId || '';
      
      console.log('🔍 Fetching applications from both ResumeDeposit and ApplicationForm...');
      
      // ดึงข้อมูลจาก ResumeDeposit (ใบสมัครใบแรก)
      const resumeUrl = new URL('/api/resume-deposit', window.location.origin);
      if (userIdParam) {
        resumeUrl.searchParams.set('userId', userIdParam);
        if (limitParam) resumeUrl.searchParams.set('limit', limitParam);
        if (adminParam === 'true') resumeUrl.searchParams.set('admin', 'true');
      } else if (resumeUserIdParam) {
        resumeUrl.searchParams.set('userId', resumeUserIdParam);
        resumeUrl.searchParams.set('limit', '100');
      } else if (userId) {
        resumeUrl.searchParams.set('userId', userId);
      } else if (userLineId) {
        resumeUrl.searchParams.set('lineId', userLineId);
      } else if (userEmail) {
        resumeUrl.searchParams.set('email', userEmail);
      } else {
        if (departmentName) {
          resumeUrl.searchParams.set('department', departmentName);
          resumeUrl.searchParams.set('admin', 'true');
        } else {
          resumeUrl.searchParams.set('admin', 'true');
          resumeUrl.searchParams.set('limit', '100');
        }
      }
      
      // ดึงข้อมูลจาก ApplicationForm (ใบสมัครถัดไป)
      const applicationUrl = new URL('/api/prisma/applications', window.location.origin);
      if (userIdParam) {
        applicationUrl.searchParams.set('userId', userIdParam);
        if (limitParam) applicationUrl.searchParams.set('limit', limitParam);
        if (adminParam === 'true') applicationUrl.searchParams.set('admin', 'true');
      } else if (resumeUserIdParam) {
        applicationUrl.searchParams.set('userId', resumeUserIdParam);
        applicationUrl.searchParams.set('limit', '100');
      } else if (userId) {
        applicationUrl.searchParams.set('userId', userId);
      } else if (userLineId) {
        applicationUrl.searchParams.set('lineId', userLineId);
      } else if (userEmail) {
        applicationUrl.searchParams.set('email', userEmail);
      } else {
      if (departmentName) {
          applicationUrl.searchParams.set('department', departmentName);
          applicationUrl.searchParams.set('admin', 'true');
        } else {
          applicationUrl.searchParams.set('admin', 'true');
          applicationUrl.searchParams.set('limit', '100');
        }
      }
      
      // เพิ่ม department parameter ถ้ามี
      if (departmentName) {
        applicationUrl.searchParams.set('department', departmentName);
        applicationUrl.searchParams.set('limit', '100');
        applicationUrl.searchParams.set('admin', 'true');
      }
      // เรียก API ทั้งสองพร้อมกัน
      console.log('🔍 Fetching from ResumeDeposit:', resumeUrl.toString());
      console.log('🔍 Fetching from ApplicationForm:', applicationUrl.toString());
      
      const [resumeResponse, applicationResponse] = await Promise.all([
        fetch(resumeUrl.toString()),
        fetch(applicationUrl.toString())
      ]);
      
      if (!resumeResponse.ok && !applicationResponse.ok) {
        throw new Error('Failed to fetch applications from both sources');
      }
      
      let resumeData = [];
      let applicationData = [];
      
      // ดึงข้อมูลจาก ResumeDeposit
      if (resumeResponse.ok) {
        const resumeJson = await resumeResponse.json();
        if (resumeJson.success && Array.isArray(resumeJson.data)) {
          resumeData = resumeJson.data;
          console.log('🔍 ResumeDeposit data:', resumeData.length, 'records');
        }
      }
      
      // ดึงข้อมูลจาก ApplicationForm
      if (applicationResponse.ok) {
        const applicationJson = await applicationResponse.json();
        if (applicationJson.success && Array.isArray(applicationJson.data)) {
          applicationData = applicationJson.data;
          console.log('🔍 ApplicationForm data:', applicationData.length, 'records');
        }
      }
      
      // รวมข้อมูลจากทั้งสองแหล่ง
      const combinedData = [...resumeData, ...applicationData];
      console.log('🔍 Combined data:', combinedData.length, 'records');
      console.log('🔍 Session data:', { userId, userEmail, userLineId });
      console.log('🔍 URL params:', { userIdParam, resumeUserIdParam, departmentName, adminParam, limitParam });

      // ใช้ข้อมูลที่รวมแล้ว
      let data = combinedData;
      
      // Final fallback: หากยังไม่พบข้อมูล ให้ลองค้นหาทั้งหมดและใช้ fuzzy matching
      if (Array.isArray(data) && data.length === 0) {
        console.log('🔄 Application-data - Final fallback: trying to fetch all data with fuzzy matching');
        try {
          const finalUrl = new URL('/api/resume-deposit', window.location.origin);
          finalUrl.searchParams.set('admin', 'true');
          finalUrl.searchParams.set('limit', '10');
          const finalRes = await fetch(finalUrl.toString());
          if (finalRes.ok) {
            const finalJson = await finalRes.json();
            const allData = finalJson.data || [];
            console.log('🔍 Application-data - Final fallback data:', allData.length, 'records');
            
            // ลองหาด้วย fuzzy matching
            const filtered = allData.filter((r: any) => {
              // ตรวจสอบ userId
              if (r?.userId && r.userId === userId) {
                console.log('🔍 Application-data fallback: Found by userId:', r.id);
                return true;
              }
              
              // ตรวจสอบ lineId
              if (r?.lineId && r.lineId === userLineId) {
                console.log('🔍 Application-data fallback: Found by lineId:', r.id);
                return true;
              }
              
              // ตรวจสอบ email (fuzzy matching)
              if (r?.email && userEmail) {
                const dbEmail = r.email.toLowerCase();
                const sessionEmail = userEmail.toLowerCase();
                
                // Exact match
                if (dbEmail === sessionEmail) {
                  console.log('🔍 Application-data fallback: Found by exact email match:', r.id);
                  return true;
                }
                
                // Partial match (contains)
                if (dbEmail.includes(sessionEmail.split('@')[0]) || sessionEmail.includes(dbEmail.split('@')[0])) {
                  console.log('🔍 Application-data fallback: Found by partial email match:', r.id);
                  return true;
                }
              }
              
              return false;
            });
            
            if (filtered.length > 0) {
              data = filtered;
              console.log('✅ Application-data fallback: Found', filtered.length, 'matching records');
            } else {
              console.log('❌ Application-data fallback: No matching records found');
            }
          }
        } catch (finalError) {
          console.error('❌ Application-data final fallback error:', finalError);
        }
      }
      
      // แปลงข้อมูลจากทั้ง ResumeDeposit และ ApplicationForm เป็น ApplicationData
      const applicationsData: ApplicationData[] = data.map((app: any) => {
        // ตรวจสอบว่าเป็นข้อมูลจาก ResumeDeposit หรือ ApplicationForm
        const isResumeDeposit = app.expectedPosition !== undefined;
        const isApplicationForm = app.appliedPosition !== undefined;
        
        console.log('🔍 Processing record:', { 
          id: app.id, 
          isResumeDeposit, 
          isApplicationForm,
          source: isResumeDeposit ? 'ResumeDeposit' : isApplicationForm ? 'ApplicationForm' : 'Unknown',
          profileImageUrl: app.profileImageUrl,
          hasProfileImage: !!app.profileImageUrl
        });
        
        return {
          id: app.id,
          firstName: app.firstName || '',
          lastName: app.lastName || '',
          // ใช้ตำแหน่งจากการ์ดที่กดสมัครด้วยตัวช่วยที่รองรับหลายรูปแบบ
          appliedPosition: resolveAppliedPosition(app, isApplicationForm),
          email: app.email || '',
          phone: app.phone || '',
          currentAddress: isApplicationForm ? (app.currentAddress || '') : (app.address || ''),
          birthDate: app.birthDate || '',
        gender: app.gender === 'MALE' ? 'ชาย' : app.gender === 'FEMALE' ? 'หญิง' : app.gender || '',
        education: (app.education || []).map((edu: any) => ({
          level: edu.level || '',
            institution: isApplicationForm ? (edu.institution || '') : (edu.school || ''),
            school: isApplicationForm ? (edu.institution || '') : (edu.school || ''),
          major: edu.major || '',
          startYear: edu.startYear || '',
            endYear: isApplicationForm ? (edu.year || '') : (edu.endYear || ''),
            year: isApplicationForm ? (edu.year || '') : (edu.endYear || ''), // Keep for backward compatibility
            graduationYear: isApplicationForm ? (edu.year || '') : (edu.endYear || ''),
          gpa: edu.gpa?.toString() || ''
        })),
        workExperience: (app.workExperience || []).map((work: any) => ({
          position: work.position || '',
          company: work.company || '',
          startDate: work.startDate || '',
          endDate: work.endDate || '',
          salary: work.salary || '',
            reason: isApplicationForm ? (work.reason || '') : (work.description || '')
        })),
        profileImage: app.profileImageUrl ? `/api/image?file=${encodeURIComponent(app.profileImageUrl)}` : '',
          profileImageUrl: app.profileImageUrl || '',
        documents: (app.documents || []).reduce((acc: any, doc: any) => {
          acc[doc.documentType] = doc.filePath;
          return acc;
        }, {}),
        // ข้อมูลเพิ่มเติม
        prefix: app.prefix || '',
        age: app.age?.toString() || '',
        race: app.race || '',
        placeOfBirth: app.placeOfBirth || '',
        placeOfBirthProvince: app.placeOfBirthProvince || '',
        nationality: app.nationality || '',
        religion: app.religion || '',
        maritalStatus: app.maritalStatus === 'SINGLE' ? 'โสด' : 
                      app.maritalStatus === 'MARRIED' ? 'สมรส' : 
                      app.maritalStatus === 'DIVORCED' ? 'หย่า' : 
                      app.maritalStatus === 'WIDOWED' ? 'หม้าย' : app.maritalStatus || '',
        idNumber: app.idNumber || '',
        idCardIssuedAt: app.idCardIssuedAt || '',
        idCardIssueDate: app.idCardIssueDate || '',
        idCardExpiryDate: app.idCardExpiryDate || '',
        emergencyContact: app.emergencyContact || '',
        emergencyPhone: app.emergencyPhone || '',
        emergencyRelationship: app.emergencyRelationship || '',
        // ข้อมูลที่อยู่
        registeredAddress: {
          houseNumber: app.house_registration_house_number || '',
          villageNumber: app.house_registration_village_number || '',
          alley: app.house_registration_alley || '',
          road: app.house_registration_road || '',
          subDistrict: app.house_registration_sub_district || '',
          district: app.house_registration_district || '',
          province: app.house_registration_province || '',
          postalCode: app.house_registration_postal_code || '',
          phone: app.house_registration_phone || '',
          mobile: app.house_registration_mobile || ''
        },
        currentAddressDetail: {
          houseNumber: app.current_address_house_number || '',
          villageNumber: app.current_address_village_number || '',
          alley: app.current_address_alley || '',
          road: app.current_address_road || '',
          subDistrict: app.current_address_sub_district || '',
          district: app.current_address_district || '',
          province: app.current_address_province || '',
          postalCode: app.current_address_postal_code || '',
          homePhone: app.current_address_phone || '',
          mobilePhone: app.current_address_mobile || ''
        },
        emergencyAddress: {
          houseNumber: app.emergency_address_house_number || '',
          villageNumber: app.emergency_address_village_number || '',
          alley: app.emergency_address_alley || '',
          road: app.emergency_address_road || '',
          subDistrict: app.emergency_address_sub_district || '',
          district: app.emergency_address_district || '',
          province: app.emergency_address_province || '',
          postalCode: app.emergency_address_postal_code || '',
          phone: app.emergency_address_phone || ''
        },
        emergencyWorkplace: {
          name: app.emergency_workplace_name || '',
          district: app.emergency_workplace_district || '',
          province: app.emergency_workplace_province || '',
          phone: app.emergency_workplace_phone || ''
        },
        // ข้อมูลคู่สมรส
        spouseInfo: {
          firstName: app.spouse_first_name || '',
          lastName: app.spouse_last_name || ''
        },
        // ข้อมูลสิทธิการรักษา
        medicalRights: {
          hasUniversalHealthcare: app.medical_rights_has_universal_healthcare || false,
          universalHealthcareHospital: app.medical_rights_universal_healthcare_hospital || '',
          hasSocialSecurity: app.medical_rights_has_social_security || false,
          socialSecurityHospital: app.medical_rights_social_security_hospital || '',
          dontWantToChangeHospital: app.medical_rights_dont_want_to_change_hospital || false,
          wantToChangeHospital: app.medical_rights_want_to_change_hospital || false,
          newHospital: app.medical_rights_new_hospital || '',
          hasCivilServantRights: app.medical_rights_has_civil_servant_rights || false,
          otherRights: app.medical_rights_other_rights || ''
        },
        expectedSalary: app.expectedSalary || '',
        availableDate: app.availableDate || '',
        currentWork: false, // ไม่มีข้อมูลใน API
        department: resolveDepartment(app),
        unit: app.unit || '',
        skills: app.skills || '',
        languages: app.languages || '',
        computerSkills: app.computerSkills || '',
        certificates: app.certificates || '',
        references: app.references || '',
        applicantSignature: app.applicantSignature || '',
        applicationDate: app.applicationDate || '',
        // ข้อมูลการทำงานในภาครัฐ
        previousGovernmentService: (app.previousGovernmentService || []).map((gov: any) => ({
          position: gov.position || '',
          department: gov.department || '',
          reason: gov.reason || '',
          date: gov.date || ''
        })),
        // ข้อมูลนายจ้างหลายราย
        multipleEmployers: app.multiple_employers ? JSON.parse(app.multiple_employers) : [],
        status: (() => {
          const rawStatus = app.status || 'PENDING';
          const normalizedStatus = rawStatus.toLowerCase();
          console.log('🔍 Status conversion:', { raw: rawStatus, normalized: normalizedStatus });
          return normalizedStatus;
        })(),
        createdAt: app.createdAt || new Date().toISOString(),
        // เพิ่มข้อมูลแหล่งที่มา
        source: isResumeDeposit ? 'ResumeDeposit' : isApplicationForm ? 'ApplicationForm' : 'Unknown'
        };
      });
        
        setApplications(applicationsData);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับเปิด modal ดูรายละเอียด
  const handleViewDetails = (application: ApplicationData) => {
    setSelectedApplication(application);
    onOpen();
  };

  // ฟังก์ชันสำหรับปิด modal
  const handleCloseDetails = () => {
    setSelectedApplication(null);
    setIsEditing(false);
    setEditingApplication(null);
    onClose();
  };

  // ฟังก์ชันสำหรับจัดการสีและข้อความของสถานะ
  const getStatusInfo = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    console.log('🔍 getStatusInfo - Input status:', status, 'Lowercase:', lowerCaseStatus);
    
    if (lowerCaseStatus === 'hired' || lowerCaseStatus === 'อนุมัติ') {
      return {
        text: 'ผ่านการพิจารณา',
        color: 'success' as const,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300'
      };
    } else if (lowerCaseStatus === 'pending' || lowerCaseStatus === 'รอพิจารณา') {
      return {
        text: 'รอพิจารณา',
        color: 'warning' as const,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300'
      };
    } else {
      console.log('🔍 getStatusInfo - Unknown status, using default:', status);
      return {
        text: status,
        color: 'default' as const,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-300'
      };
    }
  };

  // ฟังก์ชันเริ่มแก้ไขข้อมูล
  const handleEditApplication = () => {
    if (selectedApplication) {
      console.log('🔍 Starting edit mode for application:', selectedApplication.id);
      console.log('🔍 Selected application data:', selectedApplication);
      
      // สร้าง deep copy ของข้อมูลเพื่อป้องกันการแก้ไขข้อมูลต้นฉบับ
      const deepCopy = JSON.parse(JSON.stringify(selectedApplication));
      setEditingApplication(deepCopy);
      setIsEditing(true);
      
      console.log('🔍 Editing application set:', deepCopy);
    } else {
      console.error('❌ No selected application to edit');
      alert('ไม่พบข้อมูลที่ต้องการแก้ไข');
    }
  };

  // ฟังก์ชันยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingApplication(null);
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSaveApplication = async () => {
    if (!editingApplication) {
      console.error('❌ No editing application found');
      alert('ไม่พบข้อมูลที่กำลังแก้ไข');
      return;
    }

    try {
      setIsSaving(true);
      
      console.log('🔍 Saving application:', editingApplication.id);
      console.log('🔍 Data being sent:', JSON.stringify(editingApplication, null, 2));
      
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!editingApplication.id) {
        throw new Error('ไม่พบ ID ของข้อมูลที่ต้องการบันทึก');
      }
      
      if (!editingApplication.firstName || !editingApplication.lastName) {
        throw new Error('กรุณากรอกชื่อและนามสกุล');
      }
      
      // ตรวจสอบข้อมูลที่ส่งไปยัง API
      const dataToSend = {
        ...editingApplication,
        // ตรวจสอบและแปลงข้อมูลให้ถูกต้อง
        idCardIssueDate: editingApplication.idCardIssueDate ? new Date(editingApplication.idCardIssueDate) : null,
        idCardExpiryDate: editingApplication.idCardExpiryDate ? new Date(editingApplication.idCardExpiryDate) : null,
        birthDate: editingApplication.birthDate ? new Date(editingApplication.birthDate) : null,
        availableDate: editingApplication.availableDate ? new Date(editingApplication.availableDate) : null,
        age: editingApplication.age ? parseInt(editingApplication.age.toString()) : null
      };
      
      console.log('🔍 Processed data for API:', JSON.stringify(dataToSend, null, 2));
      
      // ตรวจสอบข้อมูล education ก่อนส่ง
      if (dataToSend.education && Array.isArray(dataToSend.education)) {
        console.log('🔍 Education data being sent:', dataToSend.education);
        dataToSend.education.forEach((edu: any, index: number) => {
          console.log(`🔍 Education ${index}:`, {
            level: edu.level,
            school: edu.school,
            major: edu.major,
            startYear: edu.startYear,
            endYear: edu.endYear,
            gpa: edu.gpa
          });
        });
      }
      
      const response = await fetch(`/api/resume-deposit/${editingApplication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('🔍 API Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          try {
            console.warn('❗ API Error Response:', {
              status: response.status,
              statusText: response.statusText,
              data: errorData
            });
          } catch (logError) {
            console.log('❌ Error logging failed:', logError);
          }
          errorMessage = errorData?.message || errorMessage;
        } catch (parseError) {
          try {
            console.warn('❗ Failed to parse error response:', parseError);
          } catch (logError) {
            console.log('❌ Error logging failed:', logError);
          }
          errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
        // แสดงข้อผิดพลาดและออกจากฟังก์ชันโดยไม่ throw เพื่อหลีกเลี่ยง overlay
        try {
          window.alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล:\n${errorMessage}`);
        } catch {}
        setIsSaving(false);
        return;
      }

      const result = await response.json();
      console.log('✅ Save successful:', result);

      // ใช้ข้อมูลที่ API ส่งกลับมาแทนข้อมูลที่แก้ไข
      const updatedData = result.data;
      if (updatedData) {
        // แปลงข้อมูลจาก API ให้ตรงกับรูปแบบที่ใช้ใน frontend
        const formattedData = {
          id: updatedData.id,
          firstName: updatedData.firstName || '',
          lastName: updatedData.lastName || '',
          email: updatedData.email || '',
          phone: updatedData.phone || '',
          appliedPosition: resolveAppliedPosition(updatedData, Array.isArray((updatedData as any)?.education) ? false : false),
          department: updatedData.department || '',
          status: updatedData.status || '',
          createdAt: updatedData.createdAt || '',
          profileImage: updatedData.profileImageUrl || '',
          profileImageUrl: updatedData.profileImageUrl || '',
          // ข้อมูลส่วนตัว
          prefix: updatedData.prefix || '',
          birthDate: updatedData.birthDate || '',
          age: updatedData.age?.toString() || '',
          race: updatedData.race || '',
          placeOfBirth: updatedData.placeOfBirth || '',
          placeOfBirthProvince: updatedData.placeOfBirthProvince || '',
          gender: updatedData.gender === 'MALE' ? 'ชาย' : updatedData.gender === 'FEMALE' ? 'หญิง' : updatedData.gender || '',
          nationality: updatedData.nationality || '',
          religion: updatedData.religion || '',
          maritalStatus: updatedData.maritalStatus === 'SINGLE' ? 'โสด' : 
                        updatedData.maritalStatus === 'MARRIED' ? 'สมรส' : 
                        updatedData.maritalStatus === 'DIVORCED' ? 'หย่า' : 
                        updatedData.maritalStatus === 'WIDOWED' ? 'หม้าย' : updatedData.maritalStatus || '',
          currentAddress: updatedData.address || '',
          // ข้อมูลบัตรประชาชน
          idNumber: updatedData.idNumber || '',
          idCardIssuedAt: updatedData.idCardIssuedAt || '',
          idCardIssueDate: updatedData.idCardIssueDate || '',
          idCardExpiryDate: updatedData.idCardExpiryDate || '',
          // ข้อมูลการติดต่อ
          emergencyContact: updatedData.emergencyContact || '',
          emergencyPhone: updatedData.emergencyPhone || '',
          emergencyRelationship: updatedData.emergencyRelationship || '',
          // ข้อมูลการศึกษา
          education: (updatedData.education || []).map((edu: any) => ({
            level: edu.level || '',
            institution: edu.school || '',
            school: edu.school || '',
            major: edu.major || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || '',
            year: edu.endYear || '',
            graduationYear: edu.endYear || '',
            gpa: edu.gpa?.toString() || ''
          })),
          // ข้อมูลประสบการณ์ทำงาน
          workExperience: (updatedData.workExperience || []).map((work: any) => ({
            position: work.position || '',
            company: work.company || '',
            startDate: work.startDate || '',
            endDate: work.endDate || '',
            salary: work.salary || '',
            reason: work.reason || ''
          })),
          // ข้อมูลการรับราชการก่อนหน้า
          previousGovernmentService: (updatedData.previousGovernmentService || []).map((gov: any) => ({
            position: gov.position || '',
            department: gov.department || '',
            reason: gov.reason || '',
            date: gov.date || '',
            type: gov.type || 'civilServant'
          })),
          // ข้อมูลอื่นๆ
          skills: updatedData.skills || '',
          languages: updatedData.languages || '',
          computerSkills: updatedData.computerSkills || '',
          certificates: updatedData.certificates || '',
          references: updatedData.references || '',
          expectedPosition: updatedData.expectedPosition || '',
          expectedSalary: updatedData.expectedSalary || '',
          availableDate: updatedData.availableDate || '',
          currentWork: updatedData.currentWork || false,
          unit: updatedData.unit || '',
          additionalInfo: updatedData.additionalInfo || '',
          notes: updatedData.notes || '',
          // ข้อมูลคู่สมรส
          spouse_first_name: updatedData.spouse_first_name || '',
          spouse_last_name: updatedData.spouse_last_name || '',
          // ข้อมูลเจ้าหน้าที่
          staff_position: updatedData.staff_position || '',
          staff_department: updatedData.staff_department || '',
          staff_start_work: updatedData.staff_start_work || ''
        };

        // อัปเดตข้อมูลใน state ด้วยข้อมูลที่ API ส่งกลับมา
      setApplications(prev => 
        prev.map(app => 
            app.id === updatedData.id ? formattedData : app
        )
      );

      // อัปเดต selectedApplication
        setSelectedApplication(formattedData);
        
        console.log('✅ Updated application data with API response:', formattedData);
      } else {
        // ถ้าไม่มีข้อมูลจาก API ให้ใช้ข้อมูลที่แก้ไข
        setApplications(prev => 
          prev.map(app => 
            app.id === editingApplication.id ? editingApplication : app
          )
        );
      setSelectedApplication(editingApplication);
      }

      setIsEditing(false);
      setEditingApplication(null);
      
      // รีเฟรชข้อมูลจากฐานข้อมูลเพื่อให้แน่ใจว่าข้อมูลเป็นข้อมูลล่าสุด
      try {
        console.log('🔄 Refreshing data from database...');
        await fetchApplications();
        console.log('✅ Data refreshed successfully');
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh data, but save was successful:', refreshError);
      }
      
      window.alert('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      try {
        console.warn('❗ Error saving application:', error);
      } catch (logError) {
        console.log('❌ Error logging failed:', logError);
      }
      
      let errorMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // แสดงข้อความข้อผิดพลาดที่ชัดเจน
      try {
        console.warn('❗ Final error message:', errorMessage);
        window.alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล:\n${errorMessage}`);
      } catch (logError) {
        console.log('❌ Error logging failed:', logError);
        window.alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ย้อนกลับ: ไม่จัดการสมัครงานจากหน้านี้

  // ฟังก์ชันลบข้อมูลใบสมัครงาน
  const handleDeleteApplication = async (applicationId: string) => {
    if (!applicationId) return;
    const confirmed = window.confirm('ยืนยันการลบข้อมูลใบสมัครงานนี้หรือไม่? การลบไม่สามารถย้อนกลับได้');
    if (!confirmed) return;

    try {
      setIsSaving(true);

      // ใช้ API ลบจาก resume-deposit โดยตรง (เพราะข้อมูลมาจาก resume-deposit)
      const res = await fetch(`/api/resume-deposit/${applicationId}`, { method: 'DELETE' });

      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          message = err?.message || message;
        } catch {}
        window.alert(`ลบไม่สำเร็จ: ${message}`);
        return;
      }

      // เอารายการที่ลบออกจาก state และปิด modal
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(null);
        setIsEditing(false);
        setEditingApplication(null);
        onClose();
      }
      window.alert('ลบข้อมูลใบสมัครเรียบร้อยแล้ว');
    } catch (e) {
      console.error('❌ Error deleting application:', e);
      window.alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  // ฟังก์ชันอัปเดตข้อมูลที่กำลังแก้ไข
  const handleInputChange = (field: string, value: any) => {
    if (!editingApplication) {
      console.error('❌ No editing application found for input change');
      return;
    }

    console.log('🔍 Input change:', { field, value, editingApplicationId: editingApplication.id });

    // จัดการกรณี path เป็นรูปแบบ parent[index].child เช่น education[0].level
    const arrayPathMatch = field.match(/^(\w+)\[(\d+)\]\.([\w.]+)$/);
    if (arrayPathMatch) {
      const parentKey = arrayPathMatch[1];
      const index = parseInt(arrayPathMatch[2], 10);
      const childKey = arrayPathMatch[3];

      console.log('🔍 Array path match:', { parentKey, index, childKey });

      setEditingApplication(prev => {
        if (!prev) return prev;
        
        const newData = { ...prev };
        if (!newData[parentKey as keyof ApplicationData]) {
          (newData as any)[parentKey] = [];
        }
        
        const array = [...(newData[parentKey as keyof ApplicationData] as any[])];
        if (!array[index]) {
          array[index] = {};
        }
        
        const newItem = { ...array[index] };
        setNestedValue(newItem, childKey, value);
        array[index] = newItem;
        
        (newData as any)[parentKey] = array;
        
        console.log('🔍 Updated array data:', { parentKey, array });
        console.log('🔍 Final education data:', newData.education);
        return newData;
      });
    } else {
      // จัดการกรณี path ธรรมดา
      console.log('🔍 Simple path update:', { field, value });
      
      setEditingApplication(prev => {
        if (!prev) return prev;
        const newData = { ...prev };
        setNestedValue(newData, field, value);
        
        console.log('🔍 Updated simple data:', { field, value, newData });
        return newData;
      });
    }
  };

  // ฟังก์ชันช่วยสำหรับ set nested value
  const setNestedValue = (obj: any, path: string, value: any) => {
    console.log('🔍 setNestedValue called:', { path, value, obj });
    
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    console.log('🔍 Path keys:', keys, 'Last key:', lastKey);
    
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        console.log('🔍 Creating new object for key:', key);
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    console.log('🔍 Target object before setting:', target);
    target[lastKey] = value;
    console.log('🔍 Target object after setting:', target);
  };


  // ฟังก์ชันอัปโหลดไฟล์
  const handleFileUpload = async (file: File, documentType: string, applicationId: string) => {
    const uploadKey = `${applicationId}-${documentType}`;
    
    try {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));
      setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('resumeDepositId', applicationId);
      formData.append('documentType', documentType);

      const response = await fetch('/api/resume-documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('อัปโหลดไฟล์เรียบร้อยแล้ว');
        // รีเฟรชข้อมูล
        fetchApplications();
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถอัปโหลดไฟล์ได้'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
      setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));
    }
  };

  // ฟังก์ชันจัดการการเลือกไฟล์
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, documentType: string, applicationId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 10MB');
        return;
      }
      
      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('รองรับเฉพาะไฟล์ PDF, JPG, JPEG, PNG เท่านั้น');
        return;
      }

      handleFileUpload(file, documentType, applicationId);
    }
  };






  // ฟังก์ชันลบไฟล์
  const handleDeleteFile = async (documentType: string, applicationId: string) => {
    try {
      if (!applicationId) {
        alert('ไม่พบข้อมูลใบสมัคร');
        return;
      }

      const response = await fetch(`/api/resume-documents`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeDepositId: applicationId,
          documentType: documentType
        }),
      });

      if (response.ok) {
        alert('ลบไฟล์เรียบร้อยแล้ว');
        // รีเฟรชข้อมูล
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถลบไฟล์ได้'}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('เกิดข้อผิดพลาดในการลบไฟล์');
    }
  };

  // ฟังก์ชันสำหรับพิมพ์เอกสาร
  const handlePrintDocument = (application: ApplicationData) => {
    // ส่งเฉพาะ ID ไปยัง print-all เพื่อให้ดึงข้อมูลจาก API
    const printUrl = `/official-documents/print-all?id=${application.id}`;
    window.open(printUrl, '_blank');
  };

  useEffect(() => {
    fetchApplications();
    // รีเฟรชเมื่อ session พร้อม หรือเมื่อมีการเปลี่ยนพารามิเตอร์ใน URL
  }, [session, departmentName, resumeUserIdParam]);

  // เปิดฟังก์ชัน addNewApplication ให้เรียกใช้จากภายนอก
  useEffect(() => {
    (window as any).addNewApplicationToApplicationData = addNewApplication;
    return () => {
      delete (window as any).addNewApplicationToApplicationData;
    };
  }, []);


  // ตรวจสอบใบสมัครงานใหม่ทุก 10 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewApplications();
    }, 10000); // ตรวจสอบทุก 10 วินาที

    return () => clearInterval(interval);
  }, [applications]);

  // ฟังก์ชันสำหรับตรวจสอบใบสมัครงานใหม่
  const checkForNewApplications = async () => {
    try {
      console.log('🔍 Checking for new applications...');
      
      // 🔒 Security: ดึงข้อมูล userId และ lineId จาก session
      const userId = (session?.user as any)?.id || '';
      const userEmail = (session?.user as any)?.email || '';
      const userLineId = (session?.user as any)?.lineId || '';
      
      if (!userId && !userLineId && !userEmail) {
        console.warn('⚠️ ไม่พบ userId, lineId หรือ userEmail - ข้ามการตรวจสอบใบสมัครงานใหม่');
        return;
      }
      
      // สร้าง URL พร้อม parameters สำหรับความปลอดภัย
      const url = new URL('/api/resume-deposit', window.location.origin);
      if (userId) {
        url.searchParams.set('userId', userId);
      } else if (userLineId) {
        url.searchParams.set('lineId', userLineId);
      } else if (userEmail) {
        url.searchParams.set('email', userEmail);
      }
      
      const response = await fetch(url.toString());
      
      if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data || [];
        
        // ตรวจสอบว่ามีใบสมัครงานใหม่หรือไม่
        const currentApplicationIds = applications.map(app => app.id);
        const newApplications = data.filter((app: any) => !currentApplicationIds.includes(app.id));
        
        if (newApplications.length > 0) {
          console.log(`🆕 Found ${newApplications.length} new applications`);
          
          // แปลงข้อมูลใหม่เป็น ApplicationData format
          const newApplicationsData: ApplicationData[] = newApplications.map((app: any) => ({
            id: app.id,
            firstName: app.firstName || '',
            lastName: app.lastName || '',
            appliedPosition: resolveAppliedPosition(app, false),
            email: app.email || '',
            phone: app.phone || '',
            department: resolveDepartment(app),
            status: app.status || 'PENDING',
            createdAt: app.createdAt || new Date().toISOString(),
            profileImageUrl: app.profileImageUrl || '',
            prefix: app.prefix || '',
            birthDate: app.birthDate || '',
            age: app.age?.toString() || '',
            race: app.race || '',
            placeOfBirth: app.placeOfBirth || '',
            placeOfBirthProvince: app.placeOfBirthProvince || '',
            gender: app.gender === 'MALE' ? 'ชาย' : app.gender === 'FEMALE' ? 'หญิง' : app.gender || '',
            nationality: app.nationality || '',
            religion: app.religion || '',
            maritalStatus: app.maritalStatus === 'SINGLE' ? 'โสด' : 
                          app.maritalStatus === 'MARRIED' ? 'สมรส' : 
                          app.maritalStatus === 'DIVORCED' ? 'หย่า' : 
                          app.maritalStatus === 'WIDOWED' ? 'หม้าย' : app.maritalStatus || '',
            currentAddress: app.address || '',
            education: (app.education || []).map((edu: any) => ({
              level: edu.level || '',
              institution: edu.school || '',
              school: edu.school || '',
              major: edu.major || '',
              startYear: edu.startYear || '',
              endYear: edu.endYear || '',
              year: edu.endYear || '',
              graduationYear: edu.endYear || '',
              gpa: edu.gpa?.toString() || ''
            })),
            workExperience: (app.workExperience || []).map((work: any) => ({
              position: work.position || '',
              company: work.company || '',
              startDate: work.startDate || '',
              endDate: work.endDate || '',
              salary: work.salary || '',
              reason: work.description || ''
            })),
            documents: (app.documents || []).reduce((acc: any, doc: any) => {
              acc[doc.documentType] = doc.filePath;
              return acc;
            }, {})
          }));
          
          // เพิ่มใบสมัครงานใหม่
          for (const newApp of newApplicationsData) {
            await addNewApplication(newApp);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error checking for new applications:', error);
    }
  };

  // เพิ่มการตรวจสอบการเปลี่ยนแปลงสถานะแบบ real-time
  useEffect(() => {
    if (applications.length === 0) return;
    
    // ตรวจสอบการเปลี่ยนแปลงสถานะทุก 30 วินาที
    const interval = setInterval(async () => {
      try {
        // สร้าง URL สำหรับตรวจสอบสถานะให้สอดคล้องกับหลักการกรองเดียวกับ fetchApplications
        const url = new URL('/api/resume-deposit', window.location.origin);
        const userId = (session?.user as any)?.id || '';
        const userEmail = (session?.user as any)?.email || '';
        const userLineId = (session?.user as any)?.lineId || '';

        if (userIdParam) {
          url.searchParams.set('userId', userIdParam);
          if (limitParam) url.searchParams.set('limit', limitParam);
          if (adminParam === 'true') url.searchParams.set('admin', 'true');
        } else if (resumeUserIdParam) {
          url.searchParams.set('userId', resumeUserIdParam);
        } else if (userId) {
          url.searchParams.set('userId', userId);
        } else if (userLineId) {
          url.searchParams.set('lineId', userLineId);
        } else if (userEmail) {
          url.searchParams.set('email', userEmail);
        } else if (departmentName) {
          url.searchParams.set('department', departmentName);
          url.searchParams.set('admin', 'true');
        } else {
          // โหมดผู้ดูแลแบบจำกัดจำนวนเมื่อไม่มี session และไม่มี department
          url.searchParams.set('admin', 'true');
          url.searchParams.set('limit', '100');
        }

        // Override ที่มากับ query string ของหน้า
        if (adminParam === 'true') url.searchParams.set('admin', 'true');
        if (limitParam) url.searchParams.set('limit', limitParam);

        const response = await fetch(url.toString());
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.data) {
            const newData = responseData.data;
            
            // ตรวจสอบว่ามีการเปลี่ยนแปลงสถานะหรือไม่
            let hasStatusChanged = false;
            
            for (let i = 0; i < applications.length; i++) {
              const currentApp = applications[i];
              const newApp = newData.find((app: any) => app.id === currentApp.id);
              
              if (newApp) {
                const newStatus = newApp.status?.toLowerCase() || 'pending';
                console.log(`🔍 Status comparison for ${currentApp.firstName} ${currentApp.lastName}:`, {
                  current: currentApp.status,
                  new: newApp.status,
                  newNormalized: newStatus,
                  changed: currentApp.status !== newStatus
                });
                
                if (currentApp.status !== newStatus) {
                  hasStatusChanged = true;
                  console.log(`🔄 สถานะเปลี่ยนแปลงสำหรับ ${currentApp.firstName} ${currentApp.lastName}: ${currentApp.status} -> ${newStatus}`);
                  break;
                }
              }
            }
            
            if (hasStatusChanged) {
              console.log('🔄 สถานะมีการเปลี่ยนแปลง - รีเฟรชข้อมูล');
              setStatusUpdateNotification('สถานะมีการเปลี่ยนแปลง - กำลังอัปเดตข้อมูล...');
              await fetchApplications();
              setStatusUpdateNotification(null);
            }
          }
        }
      } catch (error) {
          console.log('❌ Error checking status updates:', error);
        }
    }, 30000); // ตรวจสอบทุก 30 วินาที
    
    return () => clearInterval(interval);
  }, [applications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
                <Button
                  color="primary"
                  onClick={fetchApplications}
            className="mt-4"
                >
                  ลองใหม่
                </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isOpen ? 'backdrop-blur-sm' : ''}`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  ข้อมูลใบสมัครงาน
                </h1>
        <p className="text-gray-600">
                {departmentName ? `ฝ่าย: ${departmentName}` : 'รายการใบสมัครงานทั้งหมด'}
              </p>
              
              {/* แสดงข้อความแจ้งเตือนการอัปเดตสถานะ */}
              {statusUpdateNotification && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-800 text-sm font-medium">
                      {statusUpdateNotification}
                    </span>
                  </div>
                </div>
              )}

              {/* แสดงข้อความแจ้งเตือนใบสมัครงานใหม่ */}
              {newApplicationNotification && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-800 text-sm font-medium">
                      {newApplicationNotification}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Button
              color="primary"
              variant="bordered"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              onClick={() => router.push('/dashboard')}
              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
            >
              กลับไป Dashboard
            </Button>
          </div>
          </div>
          
      {applications.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <DocumentTextIcon className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">ไม่พบข้อมูลใบสมัครงาน</p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Session: {JSON.stringify({
                userId: (session?.user as any)?.id || '',
                userEmail: (session?.user as any)?.email || '',
                userLineId: (session?.user as any)?.lineId || ''
              })}</p>
              <p>URL Params: {JSON.stringify({ userIdParam, resumeUserIdParam, departmentName, adminParam, limitParam })}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="shadow-lg hover:shadow-xl transition-shadow relative">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                    {application.profileImage || application.profileImageUrl ? (
                      <img
                        src={(application.profileImageUrl || application.profileImage)!.startsWith('http') ? 
                          (application.profileImageUrl || application.profileImage)! : 
                          `/api/image?file=${encodeURIComponent(application.profileImageUrl || application.profileImage || '')}`}
                        alt={`${application.firstName} ${application.lastName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold ${(application.profileImage || application.profileImageUrl) ? 'hidden' : ''}`}>
                    {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                    </div>
                            </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {application.prefix} {application.firstName} {application.lastName}
                        </h3>
                          </div>
                  </div>
                  
                  {/* Status Chip */}
                  <div className="absolute top-3 right-3">
                    <Chip
                      color={getStatusInfo(application.status).color}
                      variant="flat"
                      size="sm"
                      className={`${getStatusInfo(application.status).bgColor} ${getStatusInfo(application.status).textColor} ${getStatusInfo(application.status).borderColor} border font-medium`}
                    >
                      {getStatusInfo(application.status).text}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ตำแหน่ง:</span>
                    <span className="text-sm font-medium">{resolveAppliedPosition(application, true)}</span>
                      </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ฝ่าย:</span>
                    <span className="text-sm font-medium">{application.department || '-'}</span>
                      </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">เบอร์โทร:</span>
                    <span className="text-sm font-medium">{application.phone}</span>
                    </div>
                  {/* <div className="flex justify-between">
                    <span className="text-sm text-gray-600">แหล่งข้อมูล:</span>
                    <span className="text-sm font-medium">
                      {application.source === 'ResumeDeposit' ? 'ใบสมัครใบแรก' : 
                       application.source === 'ApplicationForm' ? 'ใบสมัครเพิ่มเติม' : 
                       'ไม่ระบุ'}
                    </span>
                    </div> */}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">วันที่สมัคร:</span>
                    <span className="text-sm font-medium">
                      {new Date(application.createdAt).toLocaleDateString('th-TH')}
                    </span>
                    </div>
                    </div>

                      <div className="flex gap-2">
                    {/* ย้อนกลับ: ไม่แสดงปุ่มสมัครงานจากหน้านี้ */}
                        <Button
                          color="primary"
                     variant="flat"
                     size="sm"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onClick={() => handleViewDetails(application)}
                     className="flex-1"
                        >
                          ดูรายละเอียด
                        </Button>
                   <Button
                     color="secondary"
                     variant="flat"
                     size="sm"
                     startContent={<PrinterIcon className="w-4 h-4" />}
                     onClick={() => handlePrintDocument(application)}
                   >
                     พิมพ์
                        </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

      {/* Modal ดูรายละเอียด */}
        <Modal 
          isOpen={isOpen} 
          onClose={handleCloseDetails} 
          size="5xl"
          scrollBehavior="inside"
          backdrop="blur"
          classNames={{
            base: "max-h-[90vh] bg-white/95 backdrop-blur-md",
            body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white/95 backdrop-blur-md",
            header: "bg-white/95 backdrop-blur-md",
            footer: "bg-white/95 backdrop-blur-md",
            backdrop: "backdrop-blur-md bg-black/20"
          }}
        >
        <ModalContent>
          <ModalHeader className="flex items-center gap-4">
            {/* รูปภาพโปรไฟล์ขนาดใหญ่ */}
            
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">รายละเอียดใบสมัครงาน</h2>
              
            </div>
          </ModalHeader>
           <ModalBody>
                             {selectedApplication && (
                 <ApplicationFormView 
                 application={isEditing ? editingApplication! : selectedApplication} 
                   isEditing={isEditing}
                 onInputChange={handleInputChange}
                 uploadingFiles={uploadingFiles}
                 onFileSelect={handleFileSelect}
                 />
               )}
            </ModalBody>
           <ModalFooter>
             {isEditing ? (
               <>
                 <Button color="danger" variant="light" onPress={handleCancelEdit}>
                   ยกเลิก
                 </Button>
                 <Button 
                   color="success" 
                   onPress={handleSaveApplication}
                   isLoading={isSaving}
                   disabled={isSaving}
                 >
                   {isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                 </Button>
               </>
             ) : (
               <>
                 <Button color="danger" variant="light" onPress={handleCloseDetails}>
                   ปิด
                 </Button>
                  {selectedApplication && (
                    <Button 
                      color="danger"
                      variant="flat"
                      onPress={() => handleDeleteApplication(selectedApplication.id)}
                      disabled={isSaving}
                    >
                      ลบ
                    </Button>
                  )}
                 <Button 
                   color="warning" 
                   variant="flat"
                   onPress={handleEditApplication}
                 >
                   แก้ไข
                 </Button>
                 <Button
                   color="primary"
                   onPress={() => selectedApplication && handlePrintDocument(selectedApplication)}
                   startContent={<PrinterIcon className="w-4 h-4" />}
                 >
                   พิมพ์เอกสาร
                 </Button>
               </>
             )}
           </ModalFooter>
          </ModalContent>
        </Modal>
    </div>
  );
} 
