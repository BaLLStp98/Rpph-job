'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function OfficialDocumentsPage3() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 4;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // ตรวจสอบว่าอยู่ใน iframe หรือไม่
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

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
  }, []);

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
              <span className="text-xm font-bold text-gray-800">- ๓ -</span>
            </div>

            {/* สำหรับเจ้าหน้าที่ */}
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">สำหรับเจ้าหน้าที่</h2>
              
              {/* ๔. การยื่นเอกสารและหลักฐานประกอบการรับสมัคร */}
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
            </div>

            {/* ๕. การตรวจสอบคุณสมบัติ */}
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

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <div>
                  <p>โรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร</p>
                  <p>โทรศัพท์: 02-xxx-xxxx</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    color="default"
                    variant="bordered"
                    startContent={<ChevronLeftIcon className="w-4 h-4" />}
                    onClick={() => window.open('/official-documents/page-0002', '_blank')}
                  >
                    หน้าก่อนหน้า
                  </Button>
                  <Button
                    color="primary"
                    variant="bordered"
                    startContent={<ChevronRightIcon className="w-4 h-4" />}
                    onClick={() => window.open('/official-documents/page-0004', '_blank')}
                  >
                    หน้าต่อไป
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
    
  );
}