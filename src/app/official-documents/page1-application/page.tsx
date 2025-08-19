'use client';

import React from 'react';
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react';
import { 
  DocumentTextIcon,
  PrinterIcon,
  EyeIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Page1Application() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePrint = () => {
    window.print();
  };

  const handleViewFullDocument = () => {
    onOpen();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  หน้า 1 - ใบสมัคร
                </h1>
                <p className="text-gray-600">ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="ghost"
                startContent={<ArrowLeftIcon className="w-5 h-5" />}
                onClick={() => window.location.href = '/official-documents'}
              >
                กลับไปหน้าเอกสาร
              </Button>
              <Button
                color="primary"
                variant="ghost"
                startContent={<EyeIcon className="w-5 h-5" />}
                onClick={handleViewFullDocument}
              >
                ดูเอกสารเต็ม
              </Button>
              <Button
                color="primary"
                startContent={<PrinterIcon className="w-5 h-5" />}
                onClick={handlePrint}
              >
                พิมพ์เอกสาร
              </Button>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8 print:p-0">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="text-sm text-gray-500 mb-2">-๑-</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ
              </h1>
              <h2 className="text-xl font-semibold text-gray-700">
                ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร
              </h2>
              
              {/* Header Fields */}
              <div className="grid grid-cols-3 gap-8 mt-6 text-left">
                <div>
                  <span className="text-sm text-gray-600">บันทึก ที่.</span>
                  <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                  <span className="text-sm text-gray-600">..ลว.</span>
                  <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-600">หน่วยงาน</span>
                  <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">ฝ่าย/กลุ่มงาน</span>
                  <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                  <span className="text-sm text-gray-600">ลำดับ</span>
                  <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                </div>
              </div>

              {/* Photo Placeholder */}
              <div className="mt-6 flex justify-center">
                <div className="w-24 h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-500">รูปถ่าย<br/>1 นิ้ว</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-8">
              {/* 1. Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">๑. ประวัติส่วนตัว</h3>
                
                {/* 1.1 Basic Personal Info */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๑ ข้อมูลส่วนบุคคล</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ชื่อ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">นามสกุล</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">อายุ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">วัน เดือน ปีเกิด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">สถานที่เกิด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">เชื้อชาติ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">สัญชาติ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ศาสนา</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">จังหวัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                  </div>
                </div>

                {/* 1.2 Marital Status */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">๑.๒ สถานภาพทางครอบครัว</h4>
                  <div className="space-y-3">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="maritalStatus" className="w-4 h-4" />
                        <span>โสด</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="maritalStatus" className="w-4 h-4" />
                        <span>สมรส</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="maritalStatus" className="w-4 h-4" />
                        <span>หย่าร้าง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="maritalStatus" className="w-4 h-4" />
                        <span>หม้าย</span>
                      </label>
                    </div>
                    <div className="mt-3">
                      <span className="font-medium">ชื่อ-สกุล คู่สมรส</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-8 mt-2"></div>
                    </div>
                  </div>
                </div>

                {/* 1.3 National ID Card */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๓ เลขที่บัตรประจำตัวประชาชน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">เลขที่บัตรประจำตัวประชาชน</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ออกให้ ณ อำเภอ/เขต</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">วันที่ออกบัตร</span>
                      <div className="flex gap-2 items-center">
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">เดือน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">พ.ศ.</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">หมดอายุวันที่</span>
                      <div className="flex gap-2 items-center">
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">เดือน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">พ.ศ.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.4 Registered Address */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๔ ที่อยู่ตามทะเบียนบ้าน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ที่อยู่ตามทะเบียนบ้านเลขที่</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">หมู่ที่</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตรอก/ซอย</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ถนน</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตำบล/แขวง</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">อำเภอ/เขต</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">จังหวัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">รหัสไปรษณีย์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">โทรศัพท์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">โทรศัพท์มือถือ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* 1.5 Current Address */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๕ ที่อยู่ปัจจุบัน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ที่อยู่ปัจจุบันเลขที่</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">หมู่ที่</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตรอก/ซอย</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ถนน</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตำบล/แขวง</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">อำเภอ/เขต</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">จังหวัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">รหัสไปรษณีย์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">โทรศัพท์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">โทรศัพท์มือถือ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* 1.6 Emergency Contact */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๖ บุคคลที่สามารถติดต่อได้ทันที</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ชื่อ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">นามสกุล</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ความสัมพันธ์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">บ้านเลขที่</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">หมู่ที่</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตรอก/ซอย</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ถนน</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตำบล/แขวง</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">อำเภอ/เขต</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">จังหวัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ชื่อสถานที่ทำงาน</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">โทรศัพท์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">อำเภอ/เขต</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">จังหวัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* 1.7 Educational History */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๗ ประวัติการศึกษา</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-600">วุฒิการศึกษา</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">สาขา/วิชาเอก</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">จากสถานศึกษา</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 1.8 Current Employment */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๘ ปัจจุบันทำงาน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ปัจจุบันทำงานในตำแหน่ง</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ชื่อสถานที่ทำงาน</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">อำเภอ/เขต</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">จังหวัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">โทรศัพท์</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-600">ตั้งแต่เดือน</span>
                      <div className="flex gap-2 items-center">
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">พ.ศ.</span>
                        <span className="text-sm text-gray-600">ถึงเดือน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">พ.ศ.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 1.9 Previous Government Service */}
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">๑.๙ เคยรับราชการ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">เคยรับราชการเป็นข้าราชการ/ลูกจ้าง</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ตำแหน่ง</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">สังกัด</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ออกจากราชการเพราะ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-600">เมื่อวันที่</span>
                      <div className="flex gap-2 items-center">
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">เดือน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">พ.ศ.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Document Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-white",
          body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
          header: "bg-white",
          footer: "bg-white"
        }}
      >
        <ModalContent className="bg-white">
          <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                เอกสารเต็ม - หน้า 1 ใบสมัคร
              </h2>
              <Button
                isIconOnly
                variant="light"
                onClick={onClose}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
          </ModalHeader>
          <ModalBody className="overflow-y-auto bg-white">
            <div className="space-y-8">
              <div className="border border-gray-300 p-8 rounded-lg">
                <div className="text-center mb-8">
                  <div className="text-sm text-gray-500 mb-2">-๑-</div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-700">
                    ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร
                  </h2>
                </div>
                <p className="text-gray-600 text-center">
                  เอกสารนี้เป็นแบบฟอร์มสำหรับการสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ
                  ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-white">
            <Button color="primary" onClick={onClose}>
              ปิด
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
