'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  CloudArrowUpIcon
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
                  {application.profileImage || application.profileImageUrl ? (
                    <img
                      src={(application.profileImageUrl || application.profileImage)!.startsWith('http') ?
                        (application.profileImageUrl || application.profileImage)! :
                        `/api/image?file=${encodeURIComponent(application.profileImageUrl || application.profileImage || '')}`}
                      alt="รูปโปรไฟล์"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 shadow-lg flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
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
                       type="date"
                       value={application.birthDate || ''}
                       onChange={(e) => onInputChange?.('birthDate', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                     type="date"
                     value={application.idCardIssueDate || ''}
                     onChange={(e) => onInputChange?.('idCardIssueDate', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                     type="date"
                     value={application.idCardExpiryDate || ''}
                     onChange={(e) => onInputChange?.('idCardExpiryDate', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.level || '-'}
                     </div>
                     </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถาบัน</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.institution || edu.school || '-'}
                     </div>
                     </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สาขาวิชา</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.major || '-'}
                     </div>
                   </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ปีที่จบ</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.year || edu.graduationYear || '-'}
                </div>
            </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เกรดเฉลี่ย</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {edu.gpa || '-'}
            </div>
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
              {application.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">ประสบการณ์ทำงาน {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.position || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">บริษัท</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.company || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่เริ่มงาน</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {formatDate(work.startDate || '') || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {formatDate(work.endDate || '') || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เงินเดือน</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.salary || '-'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เหตุผลที่ออก</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        {work.reason || '-'}
                      </div>
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
                       value={application.appliedPosition || ''}
                       onChange={(e) => onInputChange?.('appliedPosition', e.target.value)}
                       placeholder="กรอกตำแหน่งที่สมัคร"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   ) : (
                 <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                   {application.appliedPosition || '-'}
                 </div>
                       )}
                     </div>
             <div className="space-y-2">
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
             </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">วันที่พร้อมเริ่มงาน</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {formatDate(application.availableDate || '') || '-'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ฝ่าย</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                {application.department || '-'}
              </div>
            </div>
            <div className="space-y-2">
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
            </div>
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
          <div className="mt-8 space-y-4">
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
                   </div>
                  
          {/* ข้อมูลการสมัคร */}
          <div className="mt-8 space-y-4">
            <h4 className="text-md font-semibold text-gray-700">ข้อมูลการสมัคร</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">วันที่สมัคร</label>
                 {isEditing ? (
                   <input
                     type="date"
                     value={application.applicationDate || ''}
                     onChange={(e) => onInputChange?.('applicationDate', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>
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
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Upload states
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const departmentName = searchParams.get('department');
  
  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ApplicationData | null>(null);

  // ฟังก์ชันสำหรับดึงข้อมูลใบสมัครงาน
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume-deposit');
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const responseData = await response.json();
      
      // ตรวจสอบว่า API ส่งข้อมูลสำเร็จหรือไม่
      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch applications');
      }
      
      const data = responseData.data || [];
      
      // แปลงข้อมูลจาก ResumeDeposit เป็น ApplicationData
      const applicationsData: ApplicationData[] = data.map((app: any) => ({
          id: app.id,
          firstName: app.firstName || '',
          lastName: app.lastName || '',
        appliedPosition: app.expectedPosition || 'ไม่ระบุ',
          email: app.email || '',
          phone: app.phone || '',
        currentAddress: app.address || '',
          birthDate: app.birthDate || '',
        gender: app.gender === 'MALE' ? 'ชาย' : app.gender === 'FEMALE' ? 'หญิง' : app.gender || '',
        education: (app.education || []).map((edu: any) => ({
          level: edu.level || '',
          institution: edu.school || '',
          school: edu.school || '',
          major: edu.major || '',
          startYear: edu.startYear || '',
          endYear: edu.endYear || '',
          year: edu.endYear || '', // Keep for backward compatibility
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
        profileImage: app.profileImageUrl ? `/api/image?file=${encodeURIComponent(app.profileImageUrl)}` : '',
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
        department: app.department || '',
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
        status: app.status?.toLowerCase() || 'pending',
        createdAt: app.createdAt || new Date().toISOString()
      }));
        
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
          appliedPosition: updatedData.expectedPosition || '',
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

  // ฟังก์ชันลบข้อมูลใบสมัครงาน
  const handleDeleteApplication = async (applicationId: string) => {
    if (!applicationId) return;
    const confirmed = window.confirm('ยืนยันการลบข้อมูลใบสมัครงานนี้หรือไม่? การลบไม่สามารถย้อนกลับได้');
    if (!confirmed) return;

    try {
      setIsSaving(true);

      const res = await fetch(`/api/resume-deposit/${applicationId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          message = err?.message || message;
        } catch {}
        window.alert(`ลบไม่สำเร็จ: ${message}`);
        return;
      }

      // เอารายการที่ลบออกจาก state
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      // ปิด modal ถ้ากำลังดู/แก้ไขรายการนั้นอยู่
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(null);
        setIsEditing(false);
        setEditingApplication(null);
        onClose();
      }
      window.alert('ลบข้อมูลเรียบร้อยแล้ว');
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
  }, []);

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
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  ข้อมูลใบสมัครงาน
                </h1>
        <p className="text-gray-600">
                {departmentName ? `ฝ่าย: ${departmentName}` : 'รายการใบสมัครงานทั้งหมด'}
              </p>
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
                    </div>
          </Card>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="shadow-lg hover:shadow-xl transition-shadow">
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
                </CardHeader>
                <CardBody className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ตำแหน่ง:</span>
                    <span className="text-sm font-medium">{application.appliedPosition}</span>
                      </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ฝ่าย:</span>
                    <span className="text-sm font-medium">{application.department || '-'}</span>
                      </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">เบอร์โทร:</span>
                    <span className="text-sm font-medium">{application.phone}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">วันที่สมัคร:</span>
                    <span className="text-sm font-medium">
                      {new Date(application.createdAt).toLocaleDateString('th-TH')}
                    </span>
                    </div>
                    </div>

                      <div className="flex gap-2">
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
          classNames={{
            base: "max-h-[90vh] bg-white",
            body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
        <ModalContent>
          <ModalHeader className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              {selectedApplication?.profileImage || selectedApplication?.profileImageUrl ? (
                <img
                  src={(selectedApplication.profileImageUrl || selectedApplication.profileImage)!.startsWith('http') ? 
                    (selectedApplication.profileImageUrl || selectedApplication.profileImage)! : 
                    `/api/image?file=${encodeURIComponent(selectedApplication.profileImageUrl || selectedApplication.profileImage || '')}`}
                  alt={`${selectedApplication?.firstName} ${selectedApplication?.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold ${(selectedApplication?.profileImage || selectedApplication?.profileImageUrl) ? 'hidden' : ''}`}>
                {selectedApplication?.firstName?.charAt(0)}{selectedApplication?.lastName?.charAt(0)}
              </div>
              
              {/* ปุ่มจัดการรูปภาพโปรไฟล์ */}
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                {/* ปุ่มอัพโหลดรูปภาพใหม่ */}
                <label className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 cursor-pointer transition-colors shadow-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && selectedApplication) {
                        try {
                          const formData = new FormData();
                          formData.append('profileImage', file);
                          formData.append('resumeId', selectedApplication.id);

                          const response = await fetch('/api/profile-image/upload', {
                            method: 'POST',
                            body: formData
                          });

                          if (response.ok) {
                            const result = await response.json();
                            // อัพเดตข้อมูลใน state
                            setApplications(prev => 
                              prev.map(app => 
                                app.id === selectedApplication.id 
                                  ? { ...app, profileImageUrl: result.profileImage }
                                  : app
                              )
                            );
                            setSelectedApplication(prev => 
                              prev ? { ...prev, profileImageUrl: result.profileImage } : null
                            );
                            alert('อัพโหลดรูปภาพเรียบร้อยแล้ว');
                          } else {
                            alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
                          }
                        } catch (error) {
                          console.error('Error uploading image:', error);
                          alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
                        }
                      }
                    }}
                  />
                </label>
                
                {/* ปุ่มลบรูปภาพ (แสดงเฉพาะเมื่อมีรูปภาพ) */}
                {(selectedApplication?.profileImage || selectedApplication?.profileImageUrl) && (
                  <button
                    onClick={async () => {
                      if (selectedApplication && confirm('คุณต้องการลบรูปภาพโปรไฟล์หรือไม่?')) {
                        try {
                          // TODO: เรียก API ลบรูปภาพ
                          // const response = await fetch(`/api/profile-image/${selectedApplication.id}`, {
                          //   method: 'DELETE'
                          // });
                          
                          // อัพเดตข้อมูลใน state
                          setApplications(prev => 
                            prev.map(app => 
                              app.id === selectedApplication.id 
                                ? { ...app, profileImage: undefined, profileImageUrl: undefined }
                                : app
                            )
                          );
                          setSelectedApplication(prev => 
                            prev ? { ...prev, profileImage: undefined, profileImageUrl: undefined } : null
                          );
                          alert('ลบรูปภาพเรียบร้อยแล้ว');
                        } catch (error) {
                          console.error('Error deleting image:', error);
                          alert('เกิดข้อผิดพลาดในการลบรูปภาพ');
                        }
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg"
                    title="ลบรูปภาพ"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">รายละเอียดใบสมัครงาน</h2>
              <p className="text-sm text-gray-600">
                {selectedApplication?.prefix} {selectedApplication?.firstName} {selectedApplication?.lastName}
              </p>
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
