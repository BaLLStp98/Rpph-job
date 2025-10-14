'use client';

import React, { useRef } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { UserIcon } from '@heroicons/react/24/outline';

interface FormData {
  profileImage?: File;
  prefix: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  idCardIssuedAt: string;
  idCardIssueDate: string;
  idCardExpiryDate: string;
  birthDate: string;
  age: string;
  race?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  addressAccordingToHouseRegistration: string;
  currentAddress: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyContactFirstName?: string;
  emergencyContactLastName?: string;
  emergencyPhone: string;
  emergencyRelationship?: string;
  emergencyAddress?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phone?: string;
  };
  emergencyWorkplace?: {
    name: string;
    district: string;
    province: string;
    phone: string;
  };
  registeredAddress?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phone?: string;
    mobile?: string;
  };
  currentAddressDetail?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    homePhone: string;
    mobilePhone: string;
  };
  medicalRights?: {
    hasUniversalHealthcare: boolean;
    universalHealthcareHospital: string;
    hasSocialSecurity: boolean;
    socialSecurityHospital: string;
    dontWantToChangeHospital: boolean;
    wantToChangeHospital: boolean;
    newHospital: string;
    hasCivilServantRights: boolean;
    otherRights: string;
  };
  staffInfo?: {
    position: string;
    department: string;
    startWork: string;
  };
}

interface PersonalInfoTabProps {
  formData: FormData;
  errors: { [key: string]: string };
  sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> };
  handleInputChange: (key: string, value: string | boolean | File | File[]) => void;
  handleTextOnlyChange: (key: string, value: string) => void;
  handleNumberOnlyChange: (key: string, value: string) => void;
  handleIdNumberChange: (value: string) => void;
  handlePostalCodeChange: (key: string, value: string) => void;
  handleCopyFromRegisteredAddress: (checked: boolean) => void;
  hasError: (fieldName: string) => boolean;
  getErrorMessage: (fieldName: string) => string;
  birthDateRef: React.RefObject<HTMLInputElement>;
}

export default function PersonalInfoTab({
  formData,
  errors,
  sectionRefs,
  handleInputChange,
  handleTextOnlyChange,
  handleNumberOnlyChange,
  handleIdNumberChange,
  handlePostalCodeChange,
  handleCopyFromRegisteredAddress,
  hasError,
  getErrorMessage,
  birthDateRef
}: PersonalInfoTabProps) {
  return (
    <Card className="shadow-xl border-0">
      <div ref={sectionRefs.profile} />
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
          
          {/* ๑.๑ ชื่อ (นาย/นาง/นางสาว) */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
              ๑.๑ ชื่อ (นาย/นาง/นางสาว)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">คำนำหน้า<span className="text-red-500">*</span></label>
                <select
                  name="prefix"
                  data-error-key="prefix"
                  value={formData.prefix}
                  onChange={(e) => handleInputChange('prefix', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('prefix') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">เลือกคำนำหน้า</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option>
                  <option value="ดร.">ดร.</option>
                  <option value="ผศ.">ผศ.</option>
                  <option value="รศ.">รศ.</option>
                  <option value="ศ.">ศ.</option>
                </select>
                {hasError('prefix') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('prefix')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ชื่อ<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  data-error-key="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="กรอกชื่อ"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('firstName') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('firstName') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('firstName')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">นามสกุล<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  data-error-key="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="กรอกนามสกุล"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('lastName') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('lastName') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('lastName')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อายุ<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="age"
                  data-error-key="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="กรอกอายุ"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('age') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('age') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('age')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">วัน เดือน ปีเกิด<span className="text-red-500">*</span></label>
                <input
                 ref={birthDateRef}
                  type="text"
                  name="birthDate"
                  data-error-key="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  placeholder="เลือกวัน เดือน ปีเกิด"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('birthDate') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-500 focus:ring-blue-500'
                  }`}
                />
                {hasError('birthDate') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('birthDate')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">สถานที่เกิด อำภเอ/เขต<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="placeOfBirth"
                  data-error-key="placeOfBirth"
                  value={formData.placeOfBirth || ''}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                  placeholder="กรอกสถานที่เกิด"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('placeOfBirth') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('placeOfBirth') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('placeOfBirth')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="placeOfBirthProvince"
                  data-error-key="placeOfBirthProvince"
                  value={formData.placeOfBirthProvince || ''}
                  onChange={(e) => handleInputChange('placeOfBirthProvince', e.target.value)}
                  placeholder="กรอกจังหวัด"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('placeOfBirthProvince') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('placeOfBirthProvince') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('placeOfBirthProvince')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เชื้อชาติ<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="race"
                  data-error-key="race"
                  value={formData.race || ''}
                  onChange={(e) => handleInputChange('race', e.target.value)}
                  placeholder="กรอกเชื้อชาติ"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('race') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('race') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('race')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">สัญชาติ<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nationality"
                  data-error-key="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="กรอกสัญชาติ"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('nationality') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('nationality') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('nationality')}</p>
                )}
              </div>
            </div>
          </div>

          {/* ๑.๒ เพศ */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
              ๑.๒ เพศ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เพศ<span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  data-error-key="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('gender') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">เลือกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
                {hasError('gender') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('gender')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ศาสนา<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="religion"
                  data-error-key="religion"
                  value={formData.religion}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  placeholder="กรอกศาสนา"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('religion') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('religion') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('religion')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">สถานภาพสมรส<span className="text-red-500">*</span></label>
                <select
                  name="maritalStatus"
                  data-error-key="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('maritalStatus') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">เลือกสถานภาพสมรส</option>
                  <option value="โสด">โสด</option>
                  <option value="สมรส">สมรส</option>
                  <option value="หย่า">หย่า</option>
                  <option value="หม้าย">หม้าย</option>
                </select>
                {hasError('maritalStatus') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('maritalStatus')}</p>
                )}
              </div>
            </div>
          </div>

          {/* ๑.๓ ข้อมูลบัตรประชาชน */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
              ๑.๓ ข้อมูลบัตรประชาชน
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เลขบัตรประชาชน<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="idNumber"
                  data-error-key="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleIdNumberChange(e.target.value)}
                  placeholder="กรอกเลขบัตรประชาชน"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('idNumber') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('idNumber') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('idNumber')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ออกโดย<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="idCardIssuedAt"
                  data-error-key="idCardIssuedAt"
                  value={formData.idCardIssuedAt}
                  onChange={(e) => handleInputChange('idCardIssuedAt', e.target.value)}
                  placeholder="กรอกออกโดย"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('idCardIssuedAt') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('idCardIssuedAt') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardIssuedAt')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">วันที่ออกบัตร<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="idCardIssueDate"
                  data-error-key="idCardIssueDate"
                  value={formData.idCardIssueDate}
                  onChange={(e) => handleInputChange('idCardIssueDate', e.target.value)}
                  placeholder="เลือกวันที่ออกบัตร"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('idCardIssueDate') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('idCardIssueDate') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardIssueDate')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">วันที่หมดอายุ<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="idCardExpiryDate"
                  data-error-key="idCardExpiryDate"
                  value={formData.idCardExpiryDate}
                  onChange={(e) => handleInputChange('idCardExpiryDate', e.target.value)}
                  placeholder="เลือกวันที่หมดอายุ"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('idCardExpiryDate') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('idCardExpiryDate') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardExpiryDate')}</p>
                )}
              </div>
            </div>
          </div>

          {/* ๑.๔ ที่อยู่ตามทะเบียนบ้าน */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
              ๑.๔ ที่อยู่ตามทะเบียนบ้าน
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ที่อยู่ตามทะเบียนบ้าน<span className="text-red-500">*</span></label>
                <textarea
                  name="addressAccordingToHouseRegistration"
                  data-error-key="addressAccordingToHouseRegistration"
                  value={formData.addressAccordingToHouseRegistration}
                  onChange={(e) => handleInputChange('addressAccordingToHouseRegistration', e.target.value)}
                  placeholder="กรอกที่อยู่ตามทะเบียนบ้าน"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('addressAccordingToHouseRegistration') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('addressAccordingToHouseRegistration') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('addressAccordingToHouseRegistration')}</p>
                )}
              </div>
            </div>
          </div>

          {/* ๑.๕ ที่อยู่ปัจจุบัน */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
              ๑.๕ ที่อยู่ปัจจุบัน
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ที่อยู่ปัจจุบัน<span className="text-red-500">*</span></label>
                <textarea
                  name="currentAddress"
                  data-error-key="currentAddress"
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  placeholder="กรอกที่อยู่ปัจจุบัน"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('currentAddress') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('currentAddress') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddress')}</p>
                )}
              </div>
            </div>
          </div>

          {/* ๑.๖ ข้อมูลการติดต่อ */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
              ๑.๖ ข้อมูลการติดต่อ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="phone"
                  data-error-key="phone"
                  value={formData.phone}
                  onChange={(e) => handleNumberOnlyChange('phone', e.target.value)}
                  placeholder="กรอกเบอร์โทรศัพท์"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('phone') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('phone') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('phone')}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อีเมล<span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  data-error-key="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="กรอกอีเมล"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError('email') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {hasError('email') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('email')}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ๒. ข้อมูลผู้ติดต่อฉุกเฉิน */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
            ๒. ข้อมูลผู้ติดต่อฉุกเฉิน
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุลผู้ติดต่อฉุกเฉิน<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="emergencyContact"
                data-error-key="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="กรอกชื่อ-นามสกุลผู้ติดต่อฉุกเฉิน"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('emergencyContact') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('emergencyContact') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('emergencyContact')}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="emergencyPhone"
                data-error-key="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={(e) => handleNumberOnlyChange('emergencyPhone', e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('emergencyPhone') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('emergencyPhone') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('emergencyPhone')}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ความสัมพันธ์<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="emergencyRelationship"
                data-error-key="emergencyRelationship"
                value={formData.emergencyRelationship || ''}
                onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
                placeholder="กรอกความสัมพันธ์"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('emergencyRelationship') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('emergencyRelationship') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('emergencyRelationship')}</p>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
