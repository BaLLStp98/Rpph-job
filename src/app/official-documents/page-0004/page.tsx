'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Interface สำหรับข้อมูลที่ส่งมาจาก application-data
interface ApplicationData {
  prefix: string;
  firstName: string;
  lastName: string;
  age: string;
  race: string;
  nationality: string;
  religion: string;
  birthDate: string;
  placeOfBirth: string;
  gender: string;
  maritalStatus: string;
  idNumber: string;
  idCardIssuedAt: string;
  idCardIssueDate: string;
  idCardExpiryDate: string;
  addressAccordingToHouseRegistration: string;
  currentAddress: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  emergencyAddress: any;
  emergencyWorkplace: any;
  appliedPosition: string;
  expectedSalary: string;
  availableDate: string;
  currentWork: boolean;
  department: string;
  education: any[];
  workExperience: any[];
  profileImage: string;
  submittedAt: string;
  status: string;
  spouseInfo?: {
    firstName: string;
    lastName: string;
  };
  // ข้อมูลที่อยู่แบบแยกจากฐานข้อมูล
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
}

export default function OfficialDocumentsPage4() {
  const [currentPage, setCurrentPage] = useState(4);
  const totalPages = 4;
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // ตรวจสอบว่าอยู่ใน iframe หรือไม่
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Helper แสดงวัน/เดือน(ไทย)/ปี ค.ศ. (ไม่บวก 543)
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

  // โหลดข้อมูลจาก URL parameters
  useEffect(() => {
    console.log('Page 4 - SearchParams:', searchParams);
    if (searchParams) {
      const data: Partial<ApplicationData> = {};
      
      // ดึงข้อมูลจาก URL parameters
      searchParams.forEach((value, key) => {
        console.log(`Page 4 - Key: ${key}, Value: ${value}`);
        try {
          // ลองแปลงเป็น JSON ก่อน (สำหรับ object/array)
          if (value.startsWith('{') || value.startsWith('[')) {
            data[key as keyof ApplicationData] = JSON.parse(value);
          } else {
            data[key as keyof ApplicationData] = value;
          }
        } catch {
          // ถ้าแปลง JSON ไม่ได้ ให้เก็บเป็น string
          data[key as keyof ApplicationData] = value;
        }
      });

      console.log('Page 4 - Parsed data:', data);
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
      const rawScale = Math.min(widthRatio, heightRatio);
      const nextScale = Math.min(rawScale * 1.0, 1);
      setScale(nextScale);
      content.style.transform = `scale(${nextScale})`;
      content.style.transformOrigin = 'top center';
    };

    resizeToFit();
    window.addEventListener('resize', resizeToFit);
    return () => window.removeEventListener('resize', resizeToFit);
  }, [applicationData]);

  // Debug: แสดงข้อมูลที่ได้รับ
  console.log('Page 4 - Application Data:', applicationData);

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
          {/* Form Header */}
          <div className="px-2">
            {/* Page Number */}
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- 4 -</span>
            </div>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h2 className="text-xm font-bold text-gray-800">สำหรับผู้สมัคร</h2>
                {/* Debug Info */}
                {applicationData && (
                  <div className="text-xs text-green-600 mt-1">
                    ✓ ข้อมูลโหลดแล้ว: {applicationData.firstName} {applicationData.lastName}
                  </div>
                )}
                {!applicationData && (
                  <div className="text-xs text-red-600 mt-1">
                    ✗ ไม่พบข้อมูลจาก URL parameters
                  </div>
                )}
              </div>
            </div>
              <div className="text-center">
                <h2 className="text-xm font-bold text-gray-800">ข้อมูลสิทธิการรักษา</h2>
                <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600 mt-1"></div>
              </div>

            {/* 1. ข้อมูลส่วนตัว */}
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">1. ข้อมูลส่วนตัว</h2>
              
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                <div className="flex items-center gap-2">
                  <span>1 ชื่อ {applicationData?.prefix || ''} {applicationData?.firstName || ''} {applicationData?.lastName || ''}</span>
                  <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">{applicationData?.prefix || ''} {applicationData?.firstName || ''} {applicationData?.lastName || ''}</span>
                  </div>
                  <span className="ml-4">เพศ</span>
                  <div className="w-16 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">{applicationData?.gender || ''}</span>
                  </div>
                  <span className="ml-2">อายุ</span>
                  <div className="w-12 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">{applicationData?.age || ''}</span>
                  </div>
                  <span>ปี</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>เกิดวันที่</span>
                  <div className="w-16 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">{getThaiDay(applicationData?.birthDate || '')}</span>
                  </div>
                  <span>เดือน</span>
                  <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">{getThaiMonthName(applicationData?.birthDate || '')}</span>
                  </div>
                  <span>ปี</span>
                  <div className="w-20 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">{getGregorianYear(applicationData?.birthDate || '')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>สัญชาติ</span>
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

            {/* 2. เลขประจำตัวประชาชน */}
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">2. เลขประจำตัวประชาชน</h2>
              
              <div className="mb-1 px-2">
                <div className="flex items-center gap-1 text-xm">
                
                {applicationData?.idNumber ? (
                  applicationData.idNumber.split('').map((digit, index) => (
                    <React.Fragment key={index}>
                      <div className="w-6 h-6 border border-gray-600 flex items-center justify-center">
                        <span className="text-xs font-medium">{digit}</span>
                      </div>
                      {(index === 0 || index === 4 || index === 9 || index === 11) && <span>-</span>}
                    </React.Fragment>
                  ))
                ) : (
                  <>
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
                    <div className="w-6 h-6 border border-gray-600"></div>
                    <div className="w-6 h-6 border border-gray-600"></div>
                    <span>-</span>
                    <div className="w-6 h-6 border border-gray-600"></div>
                    <div className="w-6 h-6 border border-gray-600"></div>
                    <span>-</span>
                    <div className="w-6 h-6 border border-gray-600"></div>
                  </>
                )}
                </div>
              </div>
            </div>

            {/* 3. สิทธิการรักษา */}
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
                  <span>มีสิทธิประกันสังคม ที่ รพ.</span>
                  <div className="w-48 h-4 border-b-2 border-dotted border-gray-600"></div>
                </div>
                
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>ไม่ประสงค์เปลี่ยนสถานพยาบาลที่มีสิทธิประกันตน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>ประสงค์เปลี่ยนสถานพยาบาลที่มีสิทธิประกันตนมาที่ รพ.</span>
                    <div className="w-32 h-4 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  <div className="ml-6 text-xs text-gray-600">
                    <p>(กรณีประสงค์เปลี่ยนสถานพยาบาลกรุณาติดต่อสำนักงานประกันสังคม หรือเปลี่ยนผ่านระบบ</p>
                    <p>ออนไลน์ได้ที่แอพ SSO ของสำนักงานประกันสังคมด้วยตนเอง)</p>
                  </div>
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

            {/* 4. ข้อมูลสถานประกอบการ */}
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
                {/* แสดงช่องว่างสำหรับข้อมูลที่เหลือ */}
                {Array.from({ length: Math.max(0, 3 - (applicationData?.workExperience || []).length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="flex items-center gap-2">
                    <span>{3 - (applicationData?.workExperience || []).length + index + 1}.</span>
                    <div className="w-96 h-4 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* 5. สถานภาพครอบครัว */}
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
                  <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หม้าย'} readOnly />
                  <span>หม้าย</span>
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

            {/* ส่วนลงชื่อ */}
            <div className="mt-8 pt-4">
              <div className="flex justify-end items-center text-xm">
                <div className="flex items-center gap-2">
                  <span>ลงชื่อ</span>
                  <div className="w-64 h-6 border-b-2 border-dotted border-gray-600"></div>
                </div>
              </div>
              <div className="flex justify-end items-center text-xm mt-2">
                <div className="flex items-center gap-2">
                  <span>(</span>
                  <div className="w-32 h-4 border-b-2 border-dotted border-gray-600"></div>
                  <span>)</span>
                </div>
              </div>
              <div className="flex justify-end items-center text-xm mt-2">
                <div className="flex items-center gap-2">
                  <span>วันที่</span>
                  <div className="w-8 h-4 border-b-2 border-dotted border-gray-600"></div>
                  <span>/</span>
                  <div className="w-8 h-4 border-b-2 border-dotted border-gray-600"></div>
                  <span>/</span>
                  <div className="w-12 h-4 border-b-2 border-dotted border-gray-600"></div>
                </div>
              </div>
            </div>

            {/* หมายเหตุ */}
            <div className="mt-8 pt-4">
              <div className="text-xm text-gray-700">
                <p className="mb-2">หมายเหตุ 1. กรุณาแนบสำเนาบัตรประชาชนพร้อมรับรองสำเนาถูกต้อง 1 ฉบับ</p>
              </div>
            </div>

            {/* สำหรับเจ้าหน้าที่ */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <h2 className="text-base font-bold text-gray-800 mb-3">สำหรับเจ้าหน้าที่</h2>
              
              <div className="flex items-center gap-6 text-xm">
                <div className="flex items-center gap-2">
                  <span>ตำแหน่ง</span>
                  <div className="w-32 h-4 border-b-2 border-dotted border-gray-600"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span>หน่วยงาน</span>
                  <div className="w-32 h-4 border-b-2 border-dotted border-gray-600"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span>เริ่มงาน</span>
                  <div className="w-24 h-4 border-b-2 border-dotted border-gray-600"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center text-xm text-gray-600">
                <div>
                  <p>โรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร</p>
                  <p>โทรศัพท์: 021024222,024212222</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    color="default"
                    variant="bordered"
                    startContent={<ChevronLeftIcon className="w-4 h-4" />}
                    onClick={() => window.open('/official-documents/page-0003', '_blank')}
                  >
                    หน้าก่อนหน้า
                  </Button>
                  <div className="text-right">
                    <p>หน้า {currentPage} จาก {totalPages}</p>
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
