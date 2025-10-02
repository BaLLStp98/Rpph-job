'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Interface สำหรับข้อมูลที่ส่งมาจาก application-data
interface ApplicationData {
  id: string;
  submittedAt: string;
  status: string;
  prefix: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  idCardIssuedAt?: string;
  idCardIssueDate?: string;
  idCardExpiryDate?: string;
  birthDate: string;
  age?: string;
  race?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: string;
  addressAccordingToHouseRegistration?: string;
  // ฟิลด์ย่อยสำหรับที่อยู่ตามทะเบียนบ้าน
  houseRegistrationAddress?: {
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
  currentAddress: string;
  // ฟิลด์ย่อยสำหรับที่อยู่ปัจจุบัน
  currentAddressDetail?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phone?: string;
    mobilePhone?: string;
    mobile?: string;
  };
  phone: string;
  email: string;
  emergencyContact?: string;
  emergencyContactFirstName?: string;
  emergencyContactLastName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyPhone?: string;
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
  appliedPosition: string;
  expectedSalary: string;
  availableDate?: string;
  currentWork?: boolean;
  department?: string;
  division?: string;
  previousGovernmentService?: Array<{
    position: string;
    department: string;
    resignationReason: string;
    resignationDate: string;
  }>;
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
    district?: string;
    province?: string;
    startDate: string;
    endDate: string;
    description?: string;
    salary?: string;
    reason?: string;
    phone?: string;
    reasonForLeaving?: string;
  }>;
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  spouseInfo?: {
    firstName: string;
    lastName: string;
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
  // ฟิลด์ที่อยู่แบบแยกจากฐานข้อมูล
  house_registration_house_number?: string;
  house_registration_village_number?: string;
  house_registration_alley?: string;
  house_registration_road?: string;
  house_registration_sub_district?: string;
  house_registration_district?: string;
  house_registration_province?: string;
  house_registration_postal_code?: string;
  house_registration_phone?: string;
  house_registration_mobile?: string;
  current_address_house_number?: string;
  current_address_village_number?: string;
  current_address_alley?: string;
  current_address_road?: string;
  current_address_sub_district?: string;
  current_address_district?: string;
  current_address_province?: string;
  current_address_postal_code?: string;
  current_address_phone?: string;
  current_address_mobile?: string;
  emergency_address_house_number?: string;
  emergency_address_village_number?: string;
  emergency_address_alley?: string;
  emergency_address_road?: string;
  emergency_address_sub_district?: string;
  emergency_address_district?: string;
  emergency_address_province?: string;
  emergency_address_postal_code?: string;
  emergency_address_phone?: string;
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
  multipleEmployers?: string[];
  staffInfo?: {
    position: string;
    department: string;
    startWork: string;
  };
  profileImage?: string;
  updatedAt?: string;
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
}

export default function PrintAllDocuments() {
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDateThai = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Helper: คืนค่า วัน/เดือน(ชื่อไทย)/ปี ค.ศ. แยกส่วน
  const getThaiDay = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return String(d.getDate());
  };

  const getThaiMonthName = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('th-TH-u-ca-gregory', { month: 'long' }).format(d);
  };

  const getGregorianYear = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return String(d.getFullYear());
  };

  // ฟังก์ชันสำหรับแยกข้อมูลที่อยู่
  const parseAddress = (addressString: string) => {
    if (!addressString) return {};
    
    const patterns = [
      /บ้านเลขที่\s*(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*\/\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
    ];

    for (const pattern of patterns) {
      const match = addressString.match(pattern);
      if (match) {
        if (pattern === patterns[0] || pattern === patterns[1]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: match[3].trim(),
            road: match[4].trim(),
            subDistrict: match[5].trim(),
            district: match[6].trim(),
            province: match[7].trim(),
            postalCode: match[8],
          };
        } else if (pattern === patterns[2]) {
          return {
            houseNumber: match[1],
            villageNumber: '',
            alley: match[2].trim(),
            road: match[3].trim(),
            subDistrict: match[4].trim(),
            district: match[5].trim(),
            province: match[6].trim(),
            postalCode: match[7],
          };
        } else if (pattern === patterns[3]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: '',
            road: '',
            subDistrict: match[3].trim(),
            district: match[4].trim(),
            province: match[5].trim(),
            postalCode: match[6],
          };
        } else if (pattern === patterns[4]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: match[3].trim(),
            road: '',
            subDistrict: match[4].trim(),
            district: match[5].trim(),
            province: match[6].trim(),
            postalCode: match[7],
          };
        } else if (pattern === patterns[5]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: '',
            road: '',
            subDistrict: match[3].trim(),
            district: match[4].trim(),
            province: match[5].trim(),
            postalCode: match[6],
          };
        }
      }
    }

    const parts = addressString.split(',').map(part => part.trim());
    if (parts.length >= 4) {
      return {
        houseNumber: parts[0] || '',
        villageNumber: parts[1] || '',
        alley: parts[2] || '',
        road: parts[3] || '',
        subDistrict: parts[4] || '',
        district: parts[5] || '',
        province: parts[6] || '',
        postalCode: parts[7] || '',
      };
    }

    return {};
  };

  // โหลดข้อมูลจาก URL parameters
  useEffect(() => {
    if (searchParams) {
      const data: Partial<ApplicationData> = {};
      
      searchParams.forEach((value, key) => {
        try {
          if (value.startsWith('{') || value.startsWith('[')) {
            (data as any)[key] = JSON.parse(value);
          } else {
            (data as any)[key] = value;
          }
        } catch {
          (data as any)[key] = value;
        }
      });

      if (Object.keys(data).length > 0) {
        setApplicationData(data as ApplicationData);
      }
    }
  }, [searchParams]);

  // ฟังก์ชันพิมพ์
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <style jsx global>{`
        /* กำหนดฟอนต์เริ่มต้นของเอกสารให้เป็น Angsana New */
        * {
          font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
        }
        .print-a4-container, .print-a4-container * {
          font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
        }
        /* ขยายตัวหนังสือพื้นฐานและกำหนดบรรทัดให้เท่ากันทุกบรรทัด */
        .print-a4-container { font-size: 18px; line-height: 1.1; }
        .print-a4-container .text-xs { font-size: 16px !important; line-height: 1.1; }
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-a4-container { font-size: 18px !important; line-height: 1.0 !important; }
          .print-a4-container .text-xs { font-size: 16px !important; line-height: 1.0 !important; }
          .print-a4-container .mb-2 { margin-bottom: 2px !important; }
          .print-a4-container .mb-1 { margin-bottom: 1px !important; }
          .print-a4-container .mt-1 { margin-top: 1px !important; }
          .print-a4-container .mt-0\.5 { margin-top: 0.5px !important; }
          .print-a4-container .pt-0\.5 { padding-top: 0.5px !important; }
          .print-a4-container .py-1 { padding-top: 1px !important; padding-bottom: 1px !important; }
          .print-a4-container .h-3 { height: 1em !important; }
          .print-a4-container .h-4 { height: 1.05em !important; }
          .print-a4-container .h-3 { height: 1.25em !important; }
          .print-a4-container .h-4 { height: 1.25em !important; }
          .print-a4-container .h-20 { height: 5em !important; }
          .print-a4-container .flex.items-center { padding-top: 0.02em; padding-bottom: 0.02em; }
          body * {
            visibility: hidden !important;
            font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
          }
          .print-a4-container, .print-a4-container * {
            visibility: visible !important;
            font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
          }
          .print-a4-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 1mm 1mm 1mm 1mm !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>
      
      {/* Print Button */}
      <div className="mb-4 no-print">
        <Button
          color="success"
          variant="solid"
          size="lg"
          startContent={<DocumentTextIcon className="w-5 h-5" />}
          onClick={handlePrint}
        >
          พิมพ์เอกสารทั้งหมด
        </Button>
      </div>

      {/* Print Container */}
      <div ref={containerRef} className="print-a4-container bg-white shadow-lg">
        <div className="p-8">
          {/* หน้า 1 - ประวัติส่วนตัว */}
          <div className="mb-12">
            {/* Header */}
            <div className="text-center mb-6 relative">
              <div className="flex justify-center items-center mb-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center">
                  <Image src="/image/LOGO-LOGIN.png" alt="logo" width={1000} height={1000} />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ<br/>
                ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร
              </h1>
              
              {/* ช่องติดรูปถ่าย */}
              <div className="w-[1.3in] h-[1.5in] border-2 border-gray-400 flex items-center justify-center absolute right-0 top-0">
                {applicationData?.profileImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src={`/api/image?file=${applicationData.profileImage}`}
                      alt="รูปถ่ายผู้สมัคร"
                      width={120}
                      height={150}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Failed to load profile image:', applicationData.profileImage);
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="text-center">
                              <div class="text-xs text-gray-500 mb-1">ติดรูปถ่าย</div>
                              <div class="text-xs text-gray-500">ขนาด ๑ นิ้ว</div>
                              <div class="text-xs text-red-500 mt-1">ไม่สามารถโหลดรูปได้</div>
                            </div>
                          `;
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ Profile image loaded successfully:', applicationData.profileImage);
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">ติดรูปถ่าย</div>
                    <div className="text-xs text-gray-500">ขนาด ๑ นิ้ว</div>
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-red-500 mt-1">
                        Debug: {applicationData?.profileImage ? 'มีรูป' : 'ไม่มีรูป'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ๑. ประวัติส่วนตัว */}
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๑. ประวัติส่วนตัว</h2>
              
              {/* ๑.๑ ชื่อ */}
              <div className="mb-1 px-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xm font-semibold text-gray-700 whitespace-nowrap">๑.๑ ชื่อ</h3>
                  <div className="flex items-center gap-2 text-xm w-full">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>คำนำหน้า</span>
                      <div className="flex-1 min-w-[60px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.prefix || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>ชื่อ</span>
                      <div className="flex-1 min-w-[100px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.firstName || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>นามสกุล</span>
                      <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.lastName || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>อายุ</span>
                      <div className="flex-1 min-w-[40px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.age || ''}</span>
                      </div>
                      <span>ปี</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>เชื้อชาติ</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.race || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>สัญชาติ</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.nationality || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>ศาสนา</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.religion || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๒ สถานภาพทางครอบครัว */}
              <div className="mb-1 px-2">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-xm font-semibold text-gray-700 whitespace-nowrap mb-0">๑.๒ สถานภาพทางครอบครัว</h3>
                  <div className="flex items-center gap-3 text-xm">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'โสด'} readOnly />
                      <span>โสด</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'สมรส'} readOnly />
                      <span>สมรส</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หย่าร้าง'} readOnly />
                      <span>หย่าร้าง</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หม้าย'} readOnly />
                      <span>หม้าย</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xm px-2">
                  <span>ชื่อ-สกุล คู่สมรส</span>
                  <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">
                      {applicationData?.maritalStatus === 'สมรส' && applicationData?.spouseInfo 
                        ? `${applicationData.spouseInfo.firstName || ''} ${applicationData.spouseInfo.lastName || ''}`.trim()
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* ๑.๓ เลขที่บัตรประจำตัวประชาชน */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๓ เลขที่บัตรประจำตัวประชาชน</h3>
                <div className="flex items-center gap-2 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>เลขที่</span>
                    <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.idNumber || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>ออกให้ ณ อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.idCardIssuedAt || ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="whitespace-nowrap">วันที่ออกบัตร</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay(applicationData?.idCardIssueDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName(applicationData?.idCardIssueDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear(applicationData?.idCardIssueDate || '')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="whitespace-nowrap">หมดอายุวันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay(applicationData?.idCardExpiryDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName(applicationData?.idCardExpiryDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear(applicationData?.idCardExpiryDate || '')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่ */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่</h3>
                <div className="grid grid-cols-4 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>บ้านเลขที่</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_house_number || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').houseNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>หมู่ที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_village_number || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').villageNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตรอก/ซอย</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_alley || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').alley}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ถนน</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_road || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').road}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตำบล/แขวง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_sub_district || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').subDistrict}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_district || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').district}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_province || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').province}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>รหัสไปรษณีย์</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_postal_code || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').postalCode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_phone || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์มือถือ</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_mobile || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๕ ที่อยู่ปัจจุบันเลขที่ */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๕ ที่อยู่ปัจจุบันเลขที่</h3>
                <div className="grid grid-cols-4 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>บ้านเลขที่</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_house_number || parseAddress(applicationData?.currentAddress || '').houseNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>หมู่ที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_village_number || parseAddress(applicationData?.currentAddress || '').villageNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตรอก/ซอย</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_alley || parseAddress(applicationData?.currentAddress || '').alley}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ถนน</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_road || parseAddress(applicationData?.currentAddress || '').road}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตำบล/แขวง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_sub_district || parseAddress(applicationData?.currentAddress || '').subDistrict}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_district || parseAddress(applicationData?.currentAddress || '').district}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_province || parseAddress(applicationData?.currentAddress || '').province}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>รหัสไปรษณีย์</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_postal_code || parseAddress(applicationData?.currentAddress || '').postalCode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_phone || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์มือถือ</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_mobile || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๖ บุคคลที่สามารถติดต่อได้ทันที */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๖ บุคคลที่สามารถติดต่อได้ทันที ชื่อ</h3>
                <div className="grid grid-cols-4 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>ชื่อ</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyContact?.split(' ')[0] || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>นามสกุล</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyContact?.split(' ').slice(1).join(' ') || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ความสัมพันธ์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyRelationship || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>บ้านเลขที่</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_house_number || applicationData?.emergencyAddress?.houseNumber || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>หมู่ที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_village_number || applicationData?.emergencyAddress?.villageNumber || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตรอก/ซอย</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_alley || applicationData?.emergencyAddress?.alley || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ถนน</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_road || applicationData?.emergencyAddress?.road || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตำบล/แขวง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_sub_district || applicationData?.emergencyAddress?.subDistrict || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_district || applicationData?.emergencyAddress?.district || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_province || applicationData?.emergencyAddress?.province || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>รหัสไปรษณีย์</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_postal_code || applicationData?.emergencyAddress?.postalCode || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_phone || applicationData?.emergencyPhone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ชื่อสถานที่ทำงาน</span>
                    <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.name || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.district || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.province || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.phone || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๗ ประวัติการศึกษา */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๗ ประวัติการศึกษา</h3>
                {(applicationData?.education || []).slice(0, 3).map((edu, index) => (
                  <div key={index} className="mb-1 p-1 text-xm px-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">วุฒิการศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800 whitespace-nowrap">{edu.level || edu.degree || ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">สาขา/วิชาเอก</span>
                        <div className="flex-1 min-w-[100px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800">{edu.major || ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">จากสถานศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800 whitespace-nowrap">{edu.institution || edu.school || ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* แสดงช่องว่างสำหรับข้อมูลที่เหลือ */}
                {Array.from({ length: Math.max(0, 3 - (applicationData?.education || []).length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="mb-0.5 p-1 text-xm px-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">วุฒิการศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900"></div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">สาขา/วิชาเอก</span>
                        <div className="flex-1 min-w-[100px] h-3 border-b-2 border-dotted border-gray-900"></div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">จากสถานศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ๑.๘ ปัจจุบันทำงานในตำแหน่ง */}
              <div className="mb-1 px-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xm font-semibold text-gray-700 whitespace-nowrap">๑.๘</h3>
                  <div className="flex items-center gap-2 text-xm w-full">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className="whitespace-nowrap">ชื่อสถานที่ทำงาน</span>
                      <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.company || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>ตำแหน่ง</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.position || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>อำเภอ/เขต</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.district || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.province || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.phone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ตั้งแต่วันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay((applicationData?.workExperience || [])[0]?.startDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName((applicationData?.workExperience || [])[0]?.startDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear((applicationData?.workExperience || [])[0]?.startDate || '')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ถึงวันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง</h3>
                <div className="grid grid-cols-3 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>ตำแหน่ง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.position || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>สังกัด</span>
                    <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.company || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ออกจากราชการเพราะ</span>
                    <div className="flex-1 min-w-[144px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.reason || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">เมื่อวันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง</h3>
                <div className="flex items-center gap-2 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>ตำแหน่งที่สมัคร</span>
                    <div className="flex-1 min-w-[200px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.appliedPosition || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>เงินเดือนที่คาดหวัง</span>
                    <div className="flex-1 min-w-[150px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.expectedSalary || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>วันที่สามารถเริ่มงาน</span>
                    <div className="flex-1 min-w-[150px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.availableDate || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* หน้า 2 - ข้อมูลเพิ่มเติม */}
          <div className="mb-12 page-break">
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- ๒ -</span>
            </div>
            
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง</h2>
              <div className="mb-1 px-2">
                <div className="space-y-2 text-xm">
                  <div className="flex items-center gap-1">
                    <span>ตำแหน่ง</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.appliedPosition || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ฝ่าย/กลุ่มงาน</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.department || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๒. ความรู้ ความสามารถ/ทักษะพิเศษ</h2>
              <div className="mb-1 px-2">
                <div className="space-y-2 text-xm">
                  <div className="h-20 border border-gray-300 rounded p-2">
                    <div className="w-full h-full border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  <div className="h-20 border border-gray-300 rounded p-2">
                    <div className="w-full h-full border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  <div className="h-20 border border-gray-300 rounded p-2">
                    <div className="w-full h-full border-b-2 border-dotted border-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๓. คุณสมบัติทั่วไปและลักษณะต้องห้าม</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๑</span>
                    <p>ข้าพเจ้าเป็นผู้เลื่อมใสในการปกครองระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุขด้วยความบริสุทธิ์ใจ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๒</span>
                    <div>
                      <p>ข้าพเจ้าไม่เป็นผู้มีกายทุพพลภาพจนไม่สามารถปฏิบัติหน้าที่ได้ คนไร้ความสามารถ คนเสมือนไร้ความสามารถ คนวิกลจริตหรือจิตฟั่นเฟือนไม่สมประกอบ หรือเป็นโรค ดังต่อไปนี้</p>
                      <div className="ml-4 mt-2 space-y-1">
                        <p>(ก) วัณโรคในระยะแพร่กระจายเชื้อ</p>
                        <p>(ข) โรคเท้าช้างในระยะที่ปรากฏอาการเป็นที่รังเกียจแก่สังคม</p>
                        <p>(ค) โรคติดยาเสพติดให้โทษ</p>
                        <p>(ง) โรคพิษสุราเรื้อรัง</p>
                        <p>(จ) โรคติดต่อร้ายแรงหรือโรคเรื้อรังที่ปรากฏอาการเด่นชัดหรือรุนแรงและเป็นอุปสรรคต่อการปฏิบัติงานในหน้าที่ตามที่ปลัดกรุงเทพมหานครกำหนด</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๓</span>
                    <p>ข้าพเจ้าไม่เป็นผู้อยู่ในระหว่างถูกสั่งพักราชการหรือถูกสั่งให้ออกจากราชการไว้ก่อนตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๔</span>
                    <p>ข้าพเจ้าไม่เป็นผู้บกพร่องในศีลธรรมอันดีจนเป็นที่รังเกียจของสังคม</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๕</span>
                    <p>ข้าพเจ้าไม่เป็นบุคคลล้มละลาย</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๖</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยต้องรับโทษจำคุกโดยคำพิพากษาถึงที่สุดให้จำคุกเพราะกระทำความผิดทางอาญาเว้นแต่เป็นโทษสำหรับความผิดที่ได้กระทำโดยประมาทหรือความผิดลหุโทษ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๗</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษให้ออก ปลดออกหรือไล่ออก เพราะกระทำผิดวินัยจากส่วนราชการรัฐวิสาหกิจ หรือหน่วยงานอื่นของรัฐ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๘</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษให้ออกหรือปลดออกเพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๙</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษไล่ออก เพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๑๐</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยกระทำการทุจริตในการสอบเข้ารับราชการ หรือเข้าปฏิบัติงานในหน่วยงานของรัฐ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๑๑</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษให้ออก ปลดออก หรือไล่ออก เพราะกระทำผิดวินัยอย่างร้ายแรงตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* หน้า 3 - สำหรับเจ้าหน้าที่ */}
          <div className="mb-12 page-break">
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- ๓ -</span>
            </div>
            
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">สำหรับเจ้าหน้าที่</h2>
              
              <div className="mb-2">
                <h2 className="text-xm font-bold text-gray-800 mb-1">๔. การยื่นเอกสารและหลักฐานประกอบการรับสมัคร</h2>
                <div className="mb-1 px-2">
                  <div className="mb-4 text-xm">
                    <p className="mb-3">ผู้สมัครได้ยื่นเอกสารและหลักฐานพร้อมใบสมัคร มีดังนี้</p>
                  </div>
                  
                  <div className="space-y-3 text-xm">
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>สำเนาบัตรประจำตัวประชาชน</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>สำเนาทะเบียนบ้าน</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>สำเนาหลักฐานทางทหาร (เฉพาะผู้สมัครเพศชาย) ได้แก่ ใบสำคัญ (แบบ สด.๙) สมุดประจำตัวทหารกองหนุน (แบบ สด.๘) สำเนาทะเบียนทหารกองประจำการ (สด.๓) หรือ สด.๔๓ แล้วแต่กรณี</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>สำเนาหลักฐานการศึกษา เช่น ใบประกาศนียบัตร หรือ ใบปริญญาบัตร และระเบียนแสดงผลการเรียน (Transcript)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>ใบรับรองแพทย์ ซึ่งออกไม่เกิน ๑ เดือน (ออกโดยโรงพยาบาลราชพิพัฒน์เท่านั้น)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>ใบอนุญาตที่เกี่ยวข้องกับตำแหน่ง เช่น ใบอนุญาตขับรถยนต์ หรือใบอนุญาตขับเรือ ใบประกอบวิชาชีพ ฯลฯ</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-3 h-3 mt-1" />
                      <span>เอกสารอื่นๆ (ถ้ามี) เช่น สำเนาหลักฐานการเปลี่ยนชื่อตัว ชื่อสกุล สำเนาหลักฐานการสมรสหรือใบหย่า</span>
                    </div>
                  </div>
                  
                  {/* เส้นประ 3 เส้น */}
                  <div className="mt-4 space-y-2">
                    <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600"></div>
                    <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600"></div>
                    <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  
                  {/* ส่วนลงชื่อเจ้าหน้าที่ */}
                  <div className="mt-6 text-xm">
                    <div className="flex justify-start items-center">
                      <span>(ลงชื่อ)</span>
                      <div className="w-96 h-6 border-b-2 border-dotted border-gray-600 ml-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๕. การตรวจสอบคุณสมบัติ</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="w-3 h-3 mt-1" />
                    <span>มีคุณสมบัติตามมาตรฐานกำหนดตำแหน่ง</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="w-3 h-3 mt-1" />
                    <span>ขาดคุณสมบัติ เนื่องจาก</span>
                    <div className="w-96 h-4 border-b-2 border-dotted border-gray-600 ml-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* หน้า 4 - ข้อมูลสิทธิการรักษา */}
          <div className="mb-12 page-break">
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- ๔ -</span>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-xm font-bold text-gray-800">ข้อมูลสิทธิการรักษา</h2>
              <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600 mt-1"></div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">1. ข้อมูลส่วนตัว</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-center gap-2">
                    <span>1 ชื่อ {applicationData?.prefix || ''} {applicationData?.firstName || ''} {applicationData?.lastName || ''}</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.prefix || ''} {applicationData?.firstName || ''} {applicationData?.lastName || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>เชื้อชาติ</span>
                    <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.race || ''}</span>
                    </div>
                    <span className="ml-4">สัญชาติ</span>
                    <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.nationality || ''}</span>
                    </div>
                    <span className="ml-4">ศาสนา</span>
                    <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.religion || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">2. เลขประจำตัวประชาชน</h2>
              <div className="mb-1 px-2">
                <div className="flex items-center gap-1 text-xm">
                  {applicationData?.idNumber ? (
                    applicationData.idNumber.split('').map((digit, index) => (
                      <React.Fragment key={index}>
                        <div className="w-6 h-6 border border-gray-600 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800">{digit}</span>
                        </div>
                        {(index === 0 || index === 4) && <span>-</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <span>-</span>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <span>-</span>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">3. สิทธิการรักษา</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>มีสิทธิหลักประกันสุขภาพ (บัตรทอง) ที่ รพ.</span>
                    <div className="w-48 h-4 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>มีสิทธิประกันสังคม</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>มีสิทธิข้าราชการ (สิทธิของตนเอง)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>อื่นๆ ระบุ</span>
                    <div className="w-48 h-4 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">4. ชื่อสถานประกอบการกรณีทำงานกับนายจ้างหลายราย ณ ปัจจุบัน</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  {(applicationData?.workExperience || []).slice(0, 3).map((work, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{index + 1}.</span>
                      <div className="w-96 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{work.company || ''}</span>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - (applicationData?.workExperience || []).length) }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex items-center gap-2">
                      <span>{3 - (applicationData?.workExperience || []).length + index + 1}.</span>
                      <div className="w-96 h-4 border-b-2 border-dotted border-gray-600"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">5. สถานภาพครอบครัว</h2>
              <div className="mb-1 px-2">
                <div className="flex items-center gap-6 text-xm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'โสด'} readOnly />
                    <span>โสด</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'สมรส'} readOnly />
                    <span>สมรสจดทะเบียน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'สมรสไม่จดทะเบียน'} readOnly />
                    <span>สมรสไม่จดทะเบียน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หย่าร้าง'} readOnly />
                    <span>หย่า</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'แยกกันอยู่'} readOnly />
                    <span>แยกกันอยู่</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
