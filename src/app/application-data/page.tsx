'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  PrinterIcon
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
  onInputChange
}: { 
  application: ApplicationData;
  isEditing?: boolean;
  onInputChange?: (field: string, value: any) => void;
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
                  {application.profileImage ? (
                    <img
                      src={application.profileImage}
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
              <label className="text-sm font-medium text-gray-700">แผนก</label>
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
            <h4 className="text-md font-semibold text-gray-700">ข้อมูลผู้แนะนำ</h4>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">ผู้แนะนำ</label>
                   {isEditing ? (
                     <textarea
                       value={application.references || ''}
                       onChange={(e) => onInputChange?.('references', e.target.value)}
                       placeholder="กรุณากรอกข้อมูลผู้แนะนำ"
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  ) : (
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
                        </Button>
                    </div>
                    </div>
                  ) : (
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
                      </Button>
                    </div>
                  </div>
                  ) : (
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
                          onClick={() => {
                            if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                              // TODO: เพิ่มฟังก์ชันลบไฟล์
                              alert('ฟีเจอร์ลบไฟล์จะเพิ่มในอนาคต');
                            }
                          }}
                        >
                          ลบ
              </Button>
            </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-sm text-gray-500">ไม่มีไฟล์แนบ</span>
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
  const [editingApplication, setEditingApplication] = useState<ApplicationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const departmentName = searchParams.get('department');
  
  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);

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
    setEditingApplication(null);
    setIsEditing(false);
    onClose();
  };

  // ฟังก์ชันเริ่มแก้ไขข้อมูล
  const handleEditApplication = (application: ApplicationData) => {
    setEditingApplication({ ...application });
    setIsEditing(true);
  };

  // ฟังก์ชันยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setEditingApplication(null);
    setIsEditing(false);
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSaveApplication = async () => {
    if (!editingApplication) return;

    try {
      setIsSaving(true);
      
      const response = await fetch(`/api/resume-deposit/${editingApplication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingApplication),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      // อัปเดตข้อมูลใน state
      setApplications(prev => 
        prev.map(app => 
          app.id === editingApplication.id ? editingApplication : app
        )
      );

      // อัปเดต selectedApplication ถ้าเป็นตัวเดียวกัน
      if (selectedApplication?.id === editingApplication.id) {
        setSelectedApplication(editingApplication);
      }

      setIsEditing(false);
      setEditingApplication(null);
      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error saving application:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  // ฟังก์ชันอัปเดตข้อมูลที่กำลังแก้ไข (รองรับ path ของ array เช่น education[0].level)
  const handleInputChange = (field: string, value: any) => {
    if (!editingApplication) return;

    // จัดการกรณี path เป็นรูปแบบ parent[index].child เช่น education[0].level
    const arrayPathMatch = field.match(/^(\w+)\[(\d+)\]\.([\w.]+)$/);
    if (arrayPathMatch) {
      const parentKey = arrayPathMatch[1];
      const index = parseInt(arrayPathMatch[2], 10);
      const childKey = arrayPathMatch[3];

      setEditingApplication(prev => {
        const previous = prev as any;
        const parentArray = Array.isArray(previous[parentKey]) ? [...previous[parentKey]] : [];
        const targetItem = { ...(parentArray[index] || {}) };
        targetItem[childKey] = value;
        parentArray[index] = targetItem;

        return {
          ...(previous as any),
          [parentKey]: parentArray
        } as any;
      });
      return;
    }

    // จัดการกรณี path เป็นรูปแบบ parent.child
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditingApplication(prev => ({
        ...prev!,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
      return;
    }

    // คีย์ปกติระดับบนสุด
    setEditingApplication(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  // ฟังก์ชันสำหรับพิมพ์เอกสาร
  const handlePrintDocument = (application: ApplicationData) => {
    // ส่งเฉพาะ ID ไปยัง official-documents เพื่อให้ดึงข้อมูลจาก API
    const printUrl = `/official-documents?id=${application.id}`;
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  ข้อมูลใบสมัครงาน
                </h1>
        <p className="text-gray-600">
          {departmentName ? `แผนก: ${departmentName}` : 'รายการใบสมัครงานทั้งหมด'}
        </p>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                            </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {application.prefix} {application.firstName} {application.lastName}
                        </h3>
                    <p className="text-sm text-gray-600">{application.email}</p>
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
                    <span className="text-sm text-gray-600">แผนก:</span>
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
                     color="warning"
                     variant="flat"
                          size="sm"
                     onClick={() => handleEditApplication(application)}
                   >
                     แก้ไข
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
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">
                  รายละเอียดใบสมัครงาน
                </h2>
            <p className="text-sm text-gray-600">
              {selectedApplication?.prefix} {selectedApplication?.firstName} {selectedApplication?.lastName}
            </p>
            </ModalHeader>
           <ModalBody>
                             {selectedApplication && (
                 <ApplicationFormView 
                 application={isEditing ? editingApplication! : selectedApplication} 
                   isEditing={isEditing}
                 onInputChange={handleInputChange}
                 />
               )}
            </ModalBody>
           <ModalFooter>
             {isEditing ? (
               <>
                <Button
                   color="danger" 
                  variant="light"
                   onPress={handleCancelEdit}
                   disabled={isSaving}
                >
                   ยกเลิก
                </Button>
                    <Button
                   color="success" 
                   onPress={handleSaveApplication}
                   disabled={isSaving}
                   isLoading={isSaving}
                 >
                   {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
               </>
             ) : (
               <>
                 <Button color="danger" variant="light" onPress={handleCloseDetails}>
                   ปิด
                    </Button>
                <Button
                   color="warning" 
                   variant="flat" 
                   onPress={() => selectedApplication && handleEditApplication(selectedApplication)}
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
