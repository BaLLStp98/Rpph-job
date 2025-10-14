import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { UserIcon } from '@heroicons/react/24/outline';

interface SpouseInfo { firstName: string; lastName: string }
interface Address {
  houseNumber: string; villageNumber: string; alley: string; road: string;
  subDistrict: string; district: string; province: string; postalCode: string;
  phone?: string; mobile?: string; homePhone?: string; mobilePhone?: string;
}

interface PersonalFormData {
  prefix: string; firstName: string; lastName: string;
  birthDate: string; age: string; placeOfBirth?: string; placeOfBirthProvince?: string;
  race?: string; nationality: string; religion: string; phone: string; email: string;
  gender: string; maritalStatus: string; idNumber: string; idCardIssuedAt: string;
  idCardIssueDate: string; idCardExpiryDate: string;
  spouseInfo?: SpouseInfo;
  registeredAddress?: Address & { mobile?: string };
  currentAddressDetail?: Address & { homePhone?: string; mobilePhone?: string };
  emergencyContactFirstName?: string; emergencyContactLastName?: string; emergencyRelationship?: string; emergencyPhone: string;
  emergencyAddress?: Address; emergencyWorkplace?: { name: string; district: string; province: string; phone: string };
}

interface RegisterPersonalTabProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  birthDateRef: React.RefObject<HTMLInputElement | null>;
  idCardIssueDateRef: React.RefObject<HTMLInputElement | null>;
  idCardExpiryDateRef: React.RefObject<HTMLInputElement | null>;
  formData: PersonalFormData;
  errors: Record<string, string>;
  hasError: (key: string) => boolean;
  getErrorMessage: (key: string) => string;
  copyFromRegisteredAddress: boolean;
  setCopyFromRegisteredAddress: (checked: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formatDateForDisplay: (iso: string) => string;
  parseDateFromThai: (thai: string) => string;
  handleInputChange: (key: string, value: any) => void;
  handleTextOnlyChange: (key: string, value: string) => void;
  handleNumberOnlyChange: (key: string, value: string) => void;
  handlePostalCodeChange: (key: string, value: string) => void;
  handleIdNumberChange: (value: string) => void;
}

export default function RegisterPersonalTab(props: RegisterPersonalTabProps) {
  const {
    sectionRef,
    birthDateRef,
    idCardIssueDateRef,
    idCardExpiryDateRef,
    formData,
    errors,
    hasError,
    getErrorMessage,
    copyFromRegisteredAddress,
    setCopyFromRegisteredAddress,
    setFormData,
    formatDateForDisplay,
    parseDateFromThai,
    handleInputChange,
    handleTextOnlyChange,
    handleNumberOnlyChange,
    handlePostalCodeChange,
    handleIdNumberChange
  } = props;

  return (
    <Card className="shadow-xl border-0">
      <div ref={sectionRef} />
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
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">๑. ประวัติส่วนตัว</h3>

          {/* ๑.๑ ชื่อ */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">๑.๑ ชื่อ (นาย/นาง/นางสาว)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">คำนำหน้า<span className="text-red-500">*</span></label>
                <select
                  value={formData.prefix}
                  onChange={(e) => handleInputChange('prefix', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${hasError('prefix') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                >
                  <option value="">เลือกคำนำหน้า</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="ดร.">ดร.</option>
                  <option value="ผศ.">ผศ.</option>
                  <option value="รศ.">รศ.</option>
                  <option value="ศ.">ศ.</option>
                </select>
                {hasError('prefix') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('prefix')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ชื่อ<span className="text-red-500">*</span></label>
                <input type="text" value={formData.firstName} onChange={(e) => handleTextOnlyChange('firstName', e.target.value)} placeholder="กรอกชื่อ (เฉพาะตัวอักษร)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${hasError('firstName') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                {hasError('firstName') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('firstName')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">นามสกุล<span className="text-red-500">*</span></label>
                <input type="text" value={formData.lastName} onChange={(e) => handleTextOnlyChange('lastName', e.target.value)} placeholder="กรอกนามสกุล (เฉพาะตัวอักษร)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${hasError('lastName') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                {hasError('lastName') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('lastName')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">วัน เดือน ปีเกิด<span className="text-red-500">*</span></label>
                <input ref={birthDateRef} type="text" value={formatDateForDisplay(formData.birthDate)} onChange={(e) => {
                  const iso = parseDateFromThai(e.target.value); handleInputChange('birthDate', iso);
                }} placeholder="เลือกวัน เดือน ปีเกิด"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${hasError('birthDate') ? 'border-red-500 focus:ring-red-500' : 'border-gray-500 focus:ring-blue-500'}`} />
                {hasError('birthDate') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('birthDate')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อายุ<span className="text-red-500">*</span></label>
                <input type="text" value={formData.age} onChange={(e) => handleNumberOnlyChange('age', e.target.value)} placeholder="กรอกอายุ (เฉพาะตัวเลข)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${hasError('age') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                {hasError('age') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('age')}</p>}
                <p className="text-xs text-gray-500">กรุณากรอกอายุ</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">สถานที่เกิด อำเภอ/เขต<span className="text-red-500">*</span></label>
                <input type="text" value={formData.placeOfBirth || ''} onChange={(e) => handleTextOnlyChange('placeOfBirth', e.target.value)} placeholder="กรอกสถานที่เกิด (เฉพาะตัวอักษร)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${hasError('placeOfBirth') ? 'border-red-500' : 'border-gray-300'} `} />
                {hasError('placeOfBirth') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('placeOfBirth')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                <input type="text" value={formData.placeOfBirthProvince || ''} onChange={(e) => handleTextOnlyChange('placeOfBirthProvince', e.target.value)} placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('placeOfBirthProvince') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('placeOfBirthProvince') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('placeOfBirthProvince')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เชื้อชาติ<span className="text-red-500">*</span></label>
                <input type="text" value={formData.race || ''} onChange={(e) => handleTextOnlyChange('race', e.target.value)} placeholder="กรอกเชื้อชาติ (เฉพาะตัวอักษร)"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('race') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('race') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('race')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">สัญชาติ<span className="text-red-500">*</span></label>
                <input type="text" value={formData.nationality} onChange={(e) => handleTextOnlyChange('nationality', e.target.value)} placeholder="กรอกสัญชาติ"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('nationality') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('nationality') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('nationality')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ศาสนา<span className="text-red-500">*</span></label>
                <input type="text" value={formData.religion} onChange={(e) => handleTextOnlyChange('religion', e.target.value)} placeholder="กรอกศาสนา"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('religion') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('religion') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('religion')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์<span className="text-red-500">*</span></label>
                <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="0812345678"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('phone') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('phone') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('phone')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อีเมล<span className="text-red-500">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="email@example.com"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('email') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('email') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('email')}</p>}
              </div>
              <div>
                <span className="text-sm text-gray-600">เพศ<span className="text-red-500">*</span></span>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="ชาย" checked={formData.gender === 'ชาย'} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-4 h-4" />
                    <span>ชาย</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="หญิง" checked={formData.gender === 'หญิง'} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-4 h-4" />
                    <span>หญิง</span>
                  </label>
                </div>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>

          {/* ๑.๒ สถานภาพทางครอบครัว */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๒ สถานภาพทางครอบครัว<span className="text-red-500">*</span></h4>
            <div className="space-y-3">
              <div className="flex gap-6">
                {['โสด','สมรส','หย่าร้าง','หม้าย'].map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input type="radio" name="maritalStatus" value={s} checked={formData.maritalStatus === s} onChange={(e) => handleInputChange('maritalStatus', e.target.value)} className="w-4 h-4" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>}

              {formData.maritalStatus === 'สมรส' && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                  <h5 className="font-medium text-gray-800 mb-3">ข้อมูลคู่สมรส</h5>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ชื่อ-สกุล คู่สมรส<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={`${formData.spouseInfo?.firstName || ''} ${formData.spouseInfo?.lastName || ''}`.trim()}
                        onChange={(e) => {
                          const filteredName = e.target.value.replace(/\d/g, '');
                          const parts = filteredName.split(' ');
                          const firstName = parts[0] || '';
                          const lastName = parts.slice(1).join(' ') || '';
                          setFormData((prev) => ({ ...prev, spouseInfo: { firstName, lastName } }));
                        }}
                        placeholder="กรอกชื่อ-สกุล คู่สมรส"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('spouseInfoFirstName') || hasError('spouseInfoLastName') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {(hasError('spouseInfoFirstName') || hasError('spouseInfoLastName')) && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('spouseInfoFirstName') || getErrorMessage('spouseInfoLastName')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ๑.๓ เลขที่บัตรประจำตัวประชาชน */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๓ เลขที่บัตรประจำตัวประชาชน<span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เลขบัตรประชาชน<span className="text-red-500">*</span></label>
                <input type="text" value={formData.idNumber} onChange={(e) => handleIdNumberChange(e.target.value)} placeholder="13 หลัก"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('idNumber') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                <div className="flex justify-between items-center">
                  {hasError('idNumber') && <p className="text-red-500 text-xs">{getErrorMessage('idNumber')}</p>}
                  <p className="text-xs text-gray-500 ml-auto">{formData.idNumber.length}/13 หลัก</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ออกให้ ณ อำเภอ/เขต<span className="text-red-500">*</span></label>
                <input type="text" value={formData.idCardIssuedAt} onChange={(e) => handleTextOnlyChange('idCardIssuedAt', e.target.value)} placeholder="สถานที่ออกบัตร"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('idCardIssuedAt') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('idCardIssuedAt') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardIssuedAt')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">วันที่ออกบัตร<span className="text-red-500">*</span></label>
                <input ref={idCardIssueDateRef} type="text" value={formatDateForDisplay(formData.idCardIssueDate)} onChange={(e) => {
                  const iso = parseDateFromThai(e.target.value); handleInputChange('idCardIssueDate', iso);
                }} placeholder="เลือกวันที่ออกบัตร"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('idCardIssueDate') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('idCardIssueDate') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardIssueDate')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">วันหมดอายุบัตร<span className="text-red-500">*</span></label>
                <input ref={idCardExpiryDateRef} type="text" value={formatDateForDisplay(formData.idCardExpiryDate)} onChange={(e) => {
                  const iso = parseDateFromThai(e.target.value); handleInputChange('idCardExpiryDate', iso);
                }} placeholder="เลือกวันหมดอายุบัตร"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('idCardExpiryDate') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('idCardExpiryDate') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardExpiryDate')}</p>}
              </div>
            </div>
          </div>

          {/* ๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่ */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่<span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เลขที่<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.houseNumber || ''} onChange={(e) => handleNumberOnlyChange('registeredAddress.houseNumber', e.target.value)} placeholder="เลขที่"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressHouseNumber') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressHouseNumber') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressHouseNumber')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">หมู่ที่<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.villageNumber || ''} onChange={(e) => handleNumberOnlyChange('registeredAddress.villageNumber', e.target.value)} placeholder="หมู่ที่"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressVillageNumber') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressVillageNumber') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressVillageNumber')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ตรอก/ซอย<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.alley || ''} onChange={(e) => handleInputChange('registeredAddress.alley', e.target.value)} placeholder="ตรอก/ซอย"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressAlley') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressAlley') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressAlley')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ถนน<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.road || ''} onChange={(e) => handleInputChange('registeredAddress.road', e.target.value)} placeholder="ถนน"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressRoad') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressRoad') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressRoad')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ตำบล/แขวง<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.subDistrict || ''} onChange={(e) => handleTextOnlyChange('registeredAddress.subDistrict', e.target.value)} placeholder="ตำบล/แขวง"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressSubDistrict') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressSubDistrict') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressSubDistrict')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.district || ''} onChange={(e) => handleTextOnlyChange('registeredAddress.district', e.target.value)} placeholder="อำเภอ/เขต"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressDistrict') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressDistrict') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressDistrict')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.province || ''} onChange={(e) => handleTextOnlyChange('registeredAddress.province', e.target.value)} placeholder="จังหวัด"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressProvince') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressProvince') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressProvince')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.postalCode || ''} onChange={(e) => handlePostalCodeChange('registeredAddress.postalCode', e.target.value)} placeholder="5 หลัก"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressPostalCode') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                <div className="flex justify-between items-center">
                  {hasError('registeredAddressPostalCode') && <p className="text-red-500 text-xs">{getErrorMessage('registeredAddressPostalCode')}</p>}
                  <p className="text-xs text-gray-500 ml-auto">{formData.registeredAddress?.postalCode?.length || 0}/5 หลัก</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                <input type="text" value={formData.registeredAddress?.phone || ''} onChange={(e) => handleInputChange('registeredAddress.phone', e.target.value)} placeholder="โทรศัพท์บ้าน"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressPhone') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressPhone') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressPhone')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ<span className="text-red-500">*</span></label>
                <input type="text" value={formData.registeredAddress?.mobile || ''} onChange={(e) => handleInputChange('registeredAddress.mobile', e.target.value)} placeholder="มือถือ"
                  className={`w-full px-3 py-2 border rounded-md ${hasError('registeredAddressMobile') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                {hasError('registeredAddressMobile') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressMobile')}</p>}
              </div>
            </div>
          </div>

          {/* ๑.๕ ที่อยู่ปัจจุบัน */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold text-gray-700 text-left">๑.๕ ที่อยู่ปัจจุบันเลขที่</h4>
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={copyFromRegisteredAddress} onChange={(e) => setCopyFromRegisteredAddress(e.target.checked)} className="w-4 h-4" />
                <span>คัดลอกจากที่อยู่ทะเบียนบ้าน</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">เลขที่<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.houseNumber || ''} onChange={(e) => handleNumberOnlyChange('currentAddressDetail.houseNumber', e.target.value)} placeholder="เลขที่" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressHouseNumber') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressHouseNumber') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressHouseNumber')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">หมู่ที่<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.villageNumber || ''} onChange={(e) => handleNumberOnlyChange('currentAddressDetail.villageNumber', e.target.value)} placeholder="หมู่ที่" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressVillageNumber') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressVillageNumber') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressVillageNumber')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ตรอก/ซอย<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.alley || ''} onChange={(e) => handleInputChange('currentAddressDetail.alley', e.target.value)} placeholder="ตรอก/ซอย" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressAlley') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressAlley') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressAlley')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ถนน<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.road || ''} onChange={(e) => handleInputChange('currentAddressDetail.road', e.target.value)} placeholder="ถนน" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressRoad') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressRoad') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressRoad')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ตำบล/แขวง<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.subDistrict || ''} onChange={(e) => handleTextOnlyChange('currentAddressDetail.subDistrict', e.target.value)} placeholder="ตำบล/แขวง" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressSubDistrict') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressSubDistrict') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressSubDistrict')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.district || ''} onChange={(e) => handleTextOnlyChange('currentAddressDetail.district', e.target.value)} placeholder="อำเภอ/เขต" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressDistrict') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressDistrict') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressDistrict')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.province || ''} onChange={(e) => handleTextOnlyChange('currentAddressDetail.province', e.target.value)} placeholder="จังหวัด" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressProvince') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressProvince') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressProvince')}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์<span className="text-red-500">*</span></label>
                <input type="text" value={formData.currentAddressDetail?.postalCode || ''} onChange={(e) => handlePostalCodeChange('currentAddressDetail.postalCode', e.target.value)} placeholder="5 หลัก" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressPostalCode') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                <div className="flex justify-between items-center">
                  {hasError('currentAddressPostalCode') && <p className="text-red-500 text-xs">{getErrorMessage('currentAddressPostalCode')}</p>}
                  <p className="text-xs text-gray-500 ml-auto">{formData.currentAddressDetail?.postalCode?.length || 0}/5 หลัก</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                <input type="tel" value={formData.currentAddressDetail?.homePhone || ''} onChange={(e) => handleNumberOnlyChange('currentAddressDetail.homePhone', e.target.value)} placeholder="โทรศัพท์บ้าน" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ<span className="text-red-500">*</span></label>
                <input type="tel" value={formData.currentAddressDetail?.mobilePhone || ''} onChange={(e) => handleNumberOnlyChange('currentAddressDetail.mobilePhone', e.target.value)} placeholder="โทรศัพท์มือถือ" disabled={copyFromRegisteredAddress}
                  className={`w-full px-3 py-2 border rounded-md ${hasError('currentAddressMobilePhone') ? 'border-red-500' : copyFromRegisteredAddress ? 'border-gray-200 bg-gray-100 text-gray-500' : 'border-gray-300 focus:ring-blue-500'} focus:outline-none focus:ring-2`} />
                {hasError('currentAddressMobilePhone') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressMobilePhone')}</p>}
              </div>
            </div>
          </div>

          {/* ๑.๖ บุคคลที่สามารถติดต่อได้ทันที */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๖ บุคคลที่สามารถติดต่อได้ทันที</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ชื่อ ผู้ติดต่อฉุกเฉิน<span className="text-red-500">*</span></label>
                  <input type="text" value={formData.emergencyContactFirstName || ''} onChange={(e) => handleTextOnlyChange('emergencyContactFirstName', e.target.value)} placeholder="ชื่อ"
                    className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyContactFirstName') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                  {hasError('emergencyContactFirstName') && <div className="text-xs text-red-600">{getErrorMessage('emergencyContactFirstName')}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">นามสกุล ผู้ติดต่อฉุกเฉิน<span className="text-red-500">*</span></label>
                  <input type="text" value={formData.emergencyContactLastName || ''} onChange={(e) => handleTextOnlyChange('emergencyContactLastName', e.target.value)} placeholder="นามสกุล"
                    className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyContactLastName') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                  {hasError('emergencyContactLastName') && <div className="text-xs text-red-600">{getErrorMessage('emergencyContactLastName')}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ความสัมพันธ์<span className="text-red-500">*</span></label>
                  <input type="text" value={formData.emergencyRelationship || ''} onChange={(e) => handleTextOnlyChange('emergencyRelationship', e.target.value)} placeholder="ความสัมพันธ์"
                    className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyRelationship') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                  {hasError('emergencyRelationship') && <div className="text-xs text-red-600">{getErrorMessage('emergencyRelationship')}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เบอร์โทรฉุกเฉิน<span className="text-red-500">*</span></label>
                  <input type="text" value={formData.emergencyPhone} onChange={(e) => handleNumberOnlyChange('emergencyPhone', e.target.value)} placeholder="เบอร์โทร"
                    className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyPhone') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                  {hasError('emergencyPhone') && <div className="text-xs text-red-600">{getErrorMessage('emergencyPhone')}</div>}
                </div>
              </div>

              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">ที่อยู่ผู้ติดต่อฉุกเฉิน</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['houseNumber','villageNumber','alley','road','subDistrict','district','province','postalCode','phone'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">{field}</label>
                      <input
                        type="text"
                        value={(formData.emergencyAddress as any)?.[field] || ''}
                        onChange={(e) => handleInputChange(`emergencyAddress.${field}`, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">ข้อมูลสถานที่ทำงานผู้ติดต่อฉุกเฉิน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ชื่อสถานที่ทำงาน<span className="text-red-500">*</span></label>
                    <input type="text" value={formData.emergencyWorkplace?.name || ''} onChange={(e) => handleInputChange('emergencyWorkplace.name', e.target.value)} placeholder="ชื่อสถานที่ทำงาน"
                      className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyWorkplaceName') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                    {hasError('emergencyWorkplaceName') && <div className="text-xs text-red-600">{getErrorMessage('emergencyWorkplaceName')}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                    <input type="text" value={formData.emergencyWorkplace?.district || ''} onChange={(e) => handleTextOnlyChange('emergencyWorkplace.district', e.target.value)} placeholder="อำเภอ/เขต"
                      className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyWorkplaceDistrict') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                    {hasError('emergencyWorkplaceDistrict') && <div className="text-xs text-red-600">{getErrorMessage('emergencyWorkplaceDistrict')}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                    <input type="text" value={formData.emergencyWorkplace?.province || ''} onChange={(e) => handleTextOnlyChange('emergencyWorkplace.province', e.target.value)} placeholder="จังหวัด"
                      className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyWorkplaceProvince') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                    {hasError('emergencyWorkplaceProvince') && <div className="text-xs text-red-600">{getErrorMessage('emergencyWorkplaceProvince')}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">โทรศัพท์<span className="text-red-500">*</span></label>
                    <input type="text" value={formData.emergencyWorkplace?.phone || ''} onChange={(e) => handleInputChange('emergencyWorkplace.phone', e.target.value)} placeholder="โทรศัพท์"
                      className={`w-full px-3 py-2 border rounded-md ${hasError('emergencyWorkplacePhone') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2`} />
                    {hasError('emergencyWorkplacePhone') && <div className="text-xs text-red-600">{getErrorMessage('emergencyWorkplacePhone')}</div>}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


