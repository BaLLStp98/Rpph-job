'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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

export default function OfficialDocuments() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 4;
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย (ปีคริสต์ศักราช ไม่บวก 543)
  const formatDateThai = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // ใช้ locale ไทย แต่บังคับปฏิทินเกรกอเรียนด้วย -u-ca-gregory
      return new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบ พ.ศ.
  const formatDateBuddhist = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const buddhistYear = date.getFullYear() + 543;
      return `${date.getDate()}/${date.getMonth() + 1}/${buddhistYear}`;
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
    
    // ลองแยกข้อมูลจากรูปแบบต่างๆ ที่อาจมี
    const patterns = [
      // รูปแบบ: บ้านเลขที่ 123 หมู่ 4 ซอยสุขุมวิท 42 ถนนสุขุมวิท ตำบลบางนาใต้ อำเภอเขตบางนา จังหวัดกรุงเทพมหานคร 10260
      /บ้านเลขที่\s*(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      // รูปแบบ: 123 หมู่ 4 ซอยสุขุมวิท 42 ถนนสุขุมวิท ตำบลบางนาใต้ อำเภอเขตบางนา จังหวัดกรุงเทพมหานคร 10260
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      // รูปแบบ: 123/4 ซอยสุขุมวิท 42 ถนนสุขุมวิท ตำบลบางนาใต้ อำเภอเขตบางนา จังหวัดกรุงเทพมหานคร 10260
      /(\d+[ก-๙]*\/\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      // รูปแบบ: 123 หมู่ 4 ตำบลบางนาใต้ อำเภอเขตบางนา จังหวัดกรุงเทพมหานคร 10260
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      // รูปแบบ: 123 หมู่ 4 ซอยสุขุมวิท 42 ตำบลบางนาใต้ อำเภอเขตบางนา จังหวัดกรุงเทพมหานคร 10260 (ไม่มีถนน)
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      // รูปแบบ: 123 หมู่ 4 ตำบลบางนาใต้ อำเภอเขตบางนา จังหวัดกรุงเทพมหานคร 10260 (ไม่มีซอยและถนน)
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
    ];

    for (const pattern of patterns) {
      const match = addressString.match(pattern);
      if (match) {
        if (pattern === patterns[0] || pattern === patterns[1]) {
          // รูปแบบที่มีซอยและถนน
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
          // รูปแบบที่มีเลขที่/หมู่
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
          // รูปแบบพื้นฐาน
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
          // รูปแบบที่มีซอยแต่ไม่มีถนน
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
          // รูปแบบพื้นฐาน (ไม่มีซอยและถนน)
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

    // ถ้าไม่ตรงกับรูปแบบใดๆ ให้ลองแยกด้วย comma
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
      
      // ดึงข้อมูลจาก URL parameters
      searchParams.forEach((value, key) => {
        try {
          // ลองแปลงเป็น JSON ก่อน (สำหรับ object/array)
          if (value.startsWith('{') || value.startsWith('[')) {
            (data as any)[key] = JSON.parse(value);
          } else {
            (data as any)[key] = value;
          }
        } catch {
          // ถ้าแปลง JSON ไม่ได้ ให้เก็บเป็น string
          (data as any)[key] = value;
        }
      });

      if (Object.keys(data).length > 0) {
        setApplicationData(data as ApplicationData);
      }
    }
  }, [searchParams]);

  // ปรับขนาดเนื้อหาให้พอดีกับหน้า A4 แบบอัตโนมัติ
  useEffect(() => {
    const resizeToFit = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      content.style.transform = 'scale(1)';
      content.style.transformOrigin = 'top center';

      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      if (!contentWidth || !contentHeight) return;

      const widthRatio = availableWidth / contentWidth;
      const heightRatio = availableHeight / contentHeight;
      // เผื่อระยะเพื่อให้พอดีหน้าเดียว (บีบเพิ่มเพื่อให้ลงหน้าเดียวแน่นอน)
      const rawScale = Math.min(widthRatio, heightRatio);
      const nextScale = Math.min(rawScale * 1.0, 1);
      setScale(nextScale);
      content.style.transform = `scale(${nextScale})`;
      content.style.transformOrigin = 'top center';
    };

    resizeToFit();
    window.addEventListener('resize', resizeToFit);
    // จัดสเกลใหม่ก่อน/หลังสั่งพิมพ์ เพื่อให้พอดี 1 หน้า
    const shrinkForPrint = () => {
      const content = contentRef.current;
      if (!content) return;
      // ลดสเกลเล็กน้อยเฉพาะตอนพิมพ์ เพื่อกันการ wrap/ซ้อนจาก reflow ขณะพิมพ์
      const current = scale || 1;
      content.style.transform = `scale(${Math.min(current * 1.0, 1)})`;
    };
    const restoreAfterPrint = () => {
      const content = contentRef.current;
      if (!content) return;
      content.style.transform = `scale(${scale || 1})`;
    };

    window.addEventListener('beforeprint', shrinkForPrint);
    window.addEventListener('afterprint', restoreAfterPrint);
    return () => window.removeEventListener('resize', resizeToFit);
  }, [applicationData]);

  // ตรวจสอบว่าอยู่ใน iframe หรือไม่
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <div className={`${isInIframe ? 'min-h-screen' : 'min-h-screen bg-gray-100'} flex items-center justify-center p-4`} style={{ paddingLeft: '20px', paddingRight: '20px' }}>
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
            margin: 0; /* ให้เริ่มชิดขอบกระดาษที่สุดเท่าที่เบราว์เซอร์/เครื่องพิมพ์อนุญาต */
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* พิมพ์ให้ลงหน้าเดียวโดยลดระยะห่างบรรทัด (ไม่บีบขนาดฟอนต์) */
          .print-a4-container { font-size: 18px !important; line-height: 1.0 !important; }
          .print-a4-container .text-xs { font-size: 16px !important; line-height: 1.0 !important; }
          /* ลดระยะห่างแนวตั้งของบล็อกต่างๆ */
          .print-a4-container .mb-2 { margin-bottom: 2px !important; }
          .print-a4-container .mb-1 { margin-bottom: 1px !important; }
          .print-a4-container .mt-1 { margin-top: 1px !important; }
          .print-a4-container .mt-0\.5 { margin-top: 0.5px !important; }
          .print-a4-container .pt-0\.5 { padding-top: 0.5px !important; }
          .print-a4-container .py-1 { padding-top: 1px !important; padding-bottom: 1px !important; }
          /* ความสูงเส้นประให้สั้นลง เพื่อกินพื้นที่น้อยลง */
          .print-a4-container .h-3 { height: 1em !important; }
          .print-a4-container .h-4 { height: 1.05em !important; }
          /* ปรับความสูงช่องเส้นประอิง em เพื่อกันซ้อนแนวตั้ง */
          .print-a4-container .h-3 { height: 1.25em !important; }
          .print-a4-container .h-4 { height: 1.25em !important; }
          .print-a4-container .h-20 { height: 5em !important; }
          /* ให้แถวข้อมูลมีจังหวะคงที่ด้วย padding แนวตั้งเท่ากัน */
          .print-a4-container .flex.items-center { padding-top: 0.02em; padding-bottom: 0.02em; }
          /* พิมพ์เฉพาะกล่องเอกสาร A4 */
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
            top: -2mm !important; /* เลื่อนขึ้นบนอีกนิด */
            width: 100% !important;
            height: auto !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 1mm 1mm 1mm 1mm !important; /* ลด padding ให้ใกล้ขอบกระดาษมากขึ้น */
          }
          /* จัดระยะหัวเอกสารให้แน่นขึ้น และตัด margin/padding ที่ไม่จำเป็นของโลโก้/หัวเรื่อง */
          .header-block { margin-top: 0 !important; margin-bottom: 0.2mm !important; }
          .logo-area { margin-top: 0 !important; margin-bottom: 0 !important; }
          .title-area { margin-top: 0 !important; }
          .title-text { margin: 0 !important; }
          .title-heading { margin: 0 !important; padding: 0 !important; line-height: 1.0 !important; }
          /* ปรับตำแหน่งกล่องรูปถ่ายให้ไม่ซ้อนทับกับหัวเรื่อง */
          .w-\[1\.3in\].h-\[1\.5in\] { 
            top: -3% !important; 
            right: 0 !important;
            z-index: 10 !important;
          }
          /* รูปภาพไม่เพิ่มช่องว่างด้านล่าง (baseline gap) */
          img { display: block !important; vertical-align: top !important; }
          .text-center.mb-6 { margin-bottom: 1mm !important; }
          .text-center.mb-6 > .flex.mb-2 { margin-bottom: 0.5mm !important; }
          .relative.flex.items-center.justify-center { margin-top: 0 !important; }
          /* เลื่อนกล่องติดรูปถ่ายขึ้นในโหมดพิมพ์ */
          .w-\[1in\].h-\[1\.3in\] { top: 2% !important; }
          /* ไม่ตัดเนื้อหา และคุมให้อยู่หน้าเดียวด้วยความสูงคงที่ */
          .a4-content { overflow: visible !important; height: auto !important; }
          .print-a4-container, .a4-content { page-break-inside: avoid !important; break-inside: avoid !important; }
        }
        
        /* สไตล์สำหรับ iframe */
        iframe {
          width: 100%;
          height: 100vh;
          border: none;
        }
      `}</style>
      
      {/* A4 Size Container */}
      <div ref={containerRef} className={`w-[210mm] h-[297mm] bg-white ${isInIframe ? 'shadow-none border-none' : 'shadow-lg border border-gray-300'} print-a4-container`} style={{ fontFamily: "'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important" }}>
        {/* Application Form Content (auto scale) */}
        <div ref={contentRef} className="a4-content h-full p-[30px] overflow-hidden leading-[1.0]" style={{ width: 'auto', transformOrigin: 'top left' }}>
          {/* หน้า 1: ข้อมูลส่วนตัว */}
          {currentPage === 1 && (
            <div className="bg-white">
              {/* Form Header */}
              <div className="bg-white">
            {/* Header Fields */}
            <div className="flex justify-between items-center mb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium">บันทึก ที่.</span>
                <div className="w-16 h-4 border-b-2 border-dotted border-gray-900"></div>
                <span className="font-medium">..ลว.</span>
                <div className="w-16 h-4 border-b-2 border-dotted border-gray-900"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">หน่วยงาน</span>
                <div className="w-24 h-4 border-b-2 border-dotted border-gray-900"></div>
                <span className="font-medium">ฝ่าย/กลุ่มงาน</span>
                <div className="w-24 h-4 border-b-2 border-dotted border-gray-900"></div>
                <span className="font-medium">ลำดับ</span>
                <div className="w-12 h-4 border-b-2 border-dotted border-gray-900"></div>
              </div>
            </div>

            {/* Logo and Title */}
            <div className="text-center mb-6 header-block">
              <div className="flex justify-center items-center mb-2 logo-area">
                <div className="w-20 h-20  rounded-full flex items-center justify-center">
                  <Image src="/image/LOGO-LOGIN.png" alt="logo" width={1000} height={1000} />
                </div>
              </div>
              <div className="relative flex items-center justify-center title-area">
                <div className="text-center title-text">
                  <h1 className="text-2xl font-bold text-gray-800 leading-tight title-heading">
                    ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ<br/>
                    ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร
                  </h1>
                </div>
                <div className="w-[1.3in] h-[1.5in] border-2 border-gray-400 flex items-center justify-center absolute right-0 top-[0.1%] -translate-y-1/2">
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
            </div>

               {/* ๑. ประวัติส่วนตัว */}
               {/* จัดกึ่งกลางหน้ากระดาษสำหรับหมวด ๑ และ ๑.๑–๑.๙ */}
               <div className="mx-auto" style={{ width: '95%' }}>
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
                    <div className="flex-1 min-w-[40px] h-3 border-b-2 border-dotted border-gray-900"></div>
                    <span>เดือน</span>
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
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>วัน/เดือน/ปีเกิด</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{formatDateThai(applicationData?.birthDate || '')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>สถานที่เกิด อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.placeOfBirth || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.placeOfBirth || ''}</span>
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
                    <span >ตำบล/แขวง</span>
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

              {/* ๑.๘.๑ ข้อมูลเจ้าหน้าที่โรงพยาบาล */}
              {applicationData?.staffInfo && (
                <div className="mb-1 px-2">
                  <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๘.๑ ข้อมูลเจ้าหน้าที่โรงพยาบาล</h3>
                  <div className="grid grid-cols-3 gap-2 text-xm px-2">
                    <div className="flex items-center gap-1">
                      <span>ตำแหน่ง</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.staffInfo.position || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>สังกัด</span>
                      <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.staffInfo.department || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>วันที่เริ่มงาน</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.staffInfo.startWork || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ๑.๘.๒ ข้อมูลสิทธิการรักษาพยาบาล */}
              {applicationData?.medicalRights && (
                <div className="mb-1 px-2">
                  <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๘.๒ ข้อมูลสิทธิการรักษาพยาบาล</h3>
                  <div className="grid grid-cols-2 gap-2 text-xm px-2">
                    <div className="flex items-center gap-1">
                      <span>สิทธิประกันสุขภาพถ้วนหน้า</span>
                      <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.medicalRights.hasUniversalHealthcare ? 'มี' : 'ไม่มี'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>โรงพยาบาล</span>
                      <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.medicalRights.universalHealthcareHospital || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>สิทธิประกันสังคม</span>
                      <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.medicalRights.hasSocialSecurity ? 'มี' : 'ไม่มี'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>โรงพยาบาล</span>
                      <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData.medicalRights.socialSecurityHospital || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ๑.๘.๓ ข้อมูลนายจ้างหลายราย */}
              {applicationData?.multipleEmployers && applicationData.multipleEmployers.length > 0 && (
                <div className="mb-1 px-2">
                  <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๘.๓ ข้อมูลนายจ้างหลายราย</h3>
                  <div className="text-xm px-2">
                    <div className="flex flex-wrap gap-2">
                      {applicationData.multipleEmployers.map((employer, index) => (
                        <span key={index} className="text-xm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded">
                          {employer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง</h3>
                {(applicationData?.previousGovernmentService || []).length > 0 ? (
                  (applicationData?.previousGovernmentService || []).map((service, index) => (
                    <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
                      <div className="grid grid-cols-3 gap-2 text-xm">
                        <div className="flex items-center gap-1">
                          <span>ตำแหน่ง</span>
                          <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                            <span className="text-xm font-medium text-gray-800">{service.position || ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>สังกัด</span>
                          <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                            <span className="text-xm font-medium text-gray-800">{service.department || ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>ออกจากราชการเพราะ</span>
                          <div className="flex-1 min-w-[144px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                            <span className="text-xm font-medium text-gray-800">{service.resignationReason || ''}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xm">
                        <div className="flex items-center gap-1">
                          <span className="whitespace-nowrap">เมื่อวันที่</span>
                          <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                            <span className="text-xm font-medium text-gray-800">{getThaiDay(service.resignationDate || '')}</span>
                          </div>
                          <span>เดือน</span>
                          <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                            <span className="text-xm font-medium text-gray-800">{getThaiMonthName(service.resignationDate || '')}</span>
                          </div>
                          <span>ปี</span>
                          <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                            <span className="text-xm font-medium text-gray-800">{getGregorianYear(service.resignationDate || '')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-xm px-2">
                    <div className="flex items-center gap-1">
                      <span>ตำแหน่ง</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800"></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>สังกัด</span>
                      <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800"></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>ออกจากราชการเพราะ</span>
                      <div className="flex-1 min-w-[144px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
            </div>
            </div>
            

          )}

          {/* หน้า 2: ข้อมูลการศึกษาและประสบการณ์การทำงาน */}
          {currentPage === 2 && (
            <div className="bg-white">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">๒. ข้อมูลการศึกษาและประสบการณ์การทำงาน</h2>
              </div>
              
              {/* ๒.๑ ประวัติการศึกษา */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๒.๑ ประวัติการศึกษา</h3>
                {(applicationData?.education || []).map((edu, index) => (
                  <div key={index} className="mb-2 p-2 border border-gray-300 rounded">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">ระดับการศึกษา:</span> {edu.level || ''}
                      </div>
                      <div>
                        <span className="font-medium">สถาบัน:</span> {edu.institution || edu.school || ''}
                      </div>
                      <div>
                        <span className="font-medium">สาขา:</span> {edu.major || ''}
                      </div>
                      <div>
                        <span className="font-medium">ปีที่จบ:</span> {edu.graduationYear || edu.year || ''}
                      </div>
                      <div>
                        <span className="font-medium">เกรดเฉลี่ย:</span> {edu.gpa || ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ๒.๒ ประสบการณ์การทำงาน */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๒.๒ ประสบการณ์การทำงาน</h3>
                {(applicationData?.workExperience || []).map((work, index) => (
                  <div key={index} className="mb-2 p-2 border border-gray-300 rounded">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">ตำแหน่ง:</span> {work.position || ''}
                      </div>
                      <div>
                        <span className="font-medium">บริษัท:</span> {work.company || ''}
                      </div>
                      <div>
                        <span className="font-medium">วันที่เริ่ม:</span> {work.startDate || ''}
                      </div>
                      <div>
                        <span className="font-medium">วันที่สิ้นสุด:</span> {work.endDate || ''}
                      </div>
                      <div>
                        <span className="font-medium">เงินเดือน:</span> {work.salary || ''}
                      </div>
                      <div>
                        <span className="font-medium">เหตุผลที่ออก:</span> {work.reason || ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* หน้า 3: ข้อมูลทักษะและความสามารถ */}
          {currentPage === 3 && (
            <div className="bg-white">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">๓. ข้อมูลทักษะและความสามารถ</h2>
              </div>
              
              {/* ๓.๑ ทักษะพิเศษ */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๓.๑ ทักษะพิเศษ</h3>
                <div className="p-2 border border-gray-300 rounded">
                  <p className="text-sm">{applicationData?.skills || ''}</p>
                </div>
              </div>

              {/* ๓.๒ ภาษาที่ใช้ได้ */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๓.๒ ภาษาที่ใช้ได้</h3>
                <div className="p-2 border border-gray-300 rounded">
                  <p className="text-sm">{applicationData?.languages || ''}</p>
                </div>
              </div>

              {/* ๓.๓ ทักษะคอมพิวเตอร์ */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๓.๓ ทักษะคอมพิวเตอร์</h3>
                <div className="p-2 border border-gray-300 rounded">
                  <p className="text-sm">{applicationData?.computerSkills || ''}</p>
                </div>
              </div>

              {/* ๓.๔ ใบรับรอง/ประกาศนียบัตร */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๓.๔ ใบรับรอง/ประกาศนียบัตร</h3>
                <div className="p-2 border border-gray-300 rounded">
                  <p className="text-sm">{applicationData?.certificates || ''}</p>
                </div>
              </div>

              {/* ๓.๕ บุคคลอ้างอิง */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๓.๕ บุคคลอ้างอิง</h3>
                <div className="p-2 border border-gray-300 rounded">
                  <p className="text-sm">{applicationData?.references || ''}</p>
                </div>
              </div>
            </div>
          )}

          {/* หน้า 4: ข้อมูลตำแหน่งงานและเอกสารแนบ */}
          {currentPage === 4 && (
            <div className="bg-white">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">๔. ข้อมูลตำแหน่งงานและเอกสารแนบ</h2>
              </div>
              
              {/* ๔.๑ ข้อมูลตำแหน่งงาน */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๔.๑ ข้อมูลตำแหน่งงาน</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ตำแหน่งที่สมัคร:</span> {applicationData?.appliedPosition || ''}
                  </div>
                  <div>
                    <span className="font-medium">สังกัด:</span> {applicationData?.department || ''}
                  </div>
                  <div>
                    <span className="font-medium">ฝ่าย/กลุ่มงาน:</span> {applicationData?.division || ''}
                  </div>
                  <div>
                    <span className="font-medium">วันที่พร้อมเริ่มงาน:</span> {applicationData?.availableDate || ''}
                  </div>
                  <div>
                    <span className="font-medium">เงินเดือนที่คาดหวัง:</span> {applicationData?.expectedSalary || ''}
                  </div>
                </div>
              </div>

              {/* ๔.๒ เอกสารแนบ */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">๔.๒ เอกสารแนบ</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">บัตรประจำตัวประชาชน:</span> {applicationData?.documents?.idCard ? '✓' : '✗'}
                  </div>
                  <div>
                    <span className="font-medium">ทะเบียนบ้าน:</span> {applicationData?.documents?.houseRegistration ? '✓' : '✗'}
                  </div>
                  <div>
                    <span className="font-medium">ใบรับรองการศึกษา:</span> {applicationData?.documents?.educationCertificate ? '✓' : '✗'}
                  </div>
                  <div>
                    <span className="font-medium">ใบรับรองแพทย์:</span> {applicationData?.documents?.medicalCertificate ? '✓' : '✗'}
                  </div>
                  <div>
                    <span className="font-medium">ใบรับรองทหาร:</span> {applicationData?.documents?.militaryCertificate ? '✓' : '✗'}
                  </div>
                  <div>
                    <span className="font-medium">ใบขับขี่:</span> {applicationData?.documents?.drivingLicense ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            </div>
          )}

              {/* Print All Documents Button */}
              <div className="mt-4 pt-2 border-t border-gray-300 print:hidden">
                <div className="flex justify-center">
                  <Button
                    color="success"
                    variant="solid"
                    size="lg"
                    startContent={<DocumentTextIcon className="w-5 h-5" />}
                    onClick={() => {
                      // สร้างข้อมูลที่จะส่งไปทุกหน้า
                      const exportData = {
                        // ข้อมูลส่วนตัว
                        prefix: applicationData?.prefix || '',
                        firstName: applicationData?.firstName || '',
                        lastName: applicationData?.lastName || '',
                        age: applicationData?.age || '',
                        race: applicationData?.race || '',
                        nationality: applicationData?.nationality || '',
                        religion: applicationData?.religion || '',
                        birthDate: applicationData?.birthDate || '',
                        placeOfBirth: applicationData?.placeOfBirth || '',
                        gender: applicationData?.gender || '',
                        maritalStatus: applicationData?.maritalStatus || '',
                        
                        // ข้อมูลบัตรประชาชน
                        idNumber: applicationData?.idNumber || '',
                        idCardIssuedAt: applicationData?.idCardIssuedAt || '',
                        idCardIssueDate: applicationData?.idCardIssueDate || '',
                        idCardExpiryDate: applicationData?.idCardExpiryDate || '',
                        
                        // ข้อมูลที่อยู่
                        addressAccordingToHouseRegistration: applicationData?.addressAccordingToHouseRegistration || '',
                        currentAddress: applicationData?.currentAddress || '',
                        phone: applicationData?.phone || '',
                        email: applicationData?.email || '',
                        
                        // ข้อมูลติดต่อฉุกเฉิน
                        emergencyContact: applicationData?.emergencyContact || '',
                        emergencyPhone: applicationData?.emergencyPhone || '',
                        emergencyRelationship: applicationData?.emergencyRelationship || '',
                        emergencyWorkplace: applicationData?.emergencyWorkplace || {},
                        
                        // ข้อมูลตำแหน่งงาน
                        appliedPosition: applicationData?.appliedPosition || '',
                        expectedSalary: applicationData?.expectedSalary || '',
                        availableDate: applicationData?.availableDate || '',
                        currentWork: applicationData?.currentWork || false,
                        department: applicationData?.department || '',
                        
                        // ประวัติการศึกษา
                        education: applicationData?.education || [],
                        
                        // ประวัติการทำงาน
                        workExperience: applicationData?.workExperience || [],
                        
                        // ข้อมูลเพิ่มเติม
                        profileImage: applicationData?.profileImage || '',
                        submittedAt: applicationData?.submittedAt || '',
                        status: applicationData?.status || '',
                        
                        // ข้อมูลคู่สมรส
                        spouseInfo: applicationData?.spouseInfo || {
                          firstName: '',
                          lastName: ''
                        }
                      };

                      // สร้าง URL parameters
                      const params = new URLSearchParams();
                      Object.entries(exportData).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                          if (typeof value === 'object') {
                            params.append(key, JSON.stringify(value));
                          } else {
                            params.append(key, String(value));
                          }
                        }
                      });

                      // เปิดหน้าพิมพ์รวมที่รวมเนื้อหาทั้ง 4 หน้า
                      const queryString = params.toString();
                      const printUrl = `/official-documents/print-all?${queryString}`;
                      
                      // เปิดหน้าพิมพ์รวมในแท็บใหม่
                      const newWindow = window.open(printUrl, '_blank');
                      if (newWindow) {
                        newWindow.onload = () => {
                          setTimeout(() => {
                            newWindow.print();
                          }, 1500); // รอ 1.5 วินาทีให้หน้าโหลดเสร็จ
                        };
                      }
                    }}
                  >
                    พิมพ์เอกสารทั้งหมด
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-1 pt-0.5 border-t border-gray-300 print:hidden">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  
                  <div className="flex items-center gap-1">
                    <div>
                      <p>หน้า {currentPage} จาก {totalPages}</p>
                    </div>
                    <Button
                      color="primary"
                      variant="bordered"
                      size="sm"
                      endContent={<ChevronLeftIcon className="w-3 h-3" />}
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      disabled={currentPage === 1}
                    >
                      หน้าก่อน
                    </Button>
                    <Button
                      color="primary"
                      variant="bordered"
                      size="sm"
                      startContent={<ChevronRightIcon className="w-3 h-3" />}
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      disabled={currentPage === totalPages}
                    >
                      หน้าต่อไป
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}

