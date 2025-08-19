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

export default function Page2Officials() {
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
              <div className="p-3 bg-green-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  หน้า 2 - สำหรับเจ้าหน้าที่
                </h1>
                <p className="text-gray-600">ข้อมูลสิทธิการรักษา และสถานภาพครอบครัว</p>
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
              <div className="text-sm text-gray-500 mb-2">- ๒ -</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                สำหรับผู้สมัคร
              </h1>
            </div>

            {/* Document Fields */}
            <div className="space-y-8">
              {/* Medical Rights Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลสิทธิการรักษา</h3>
                
                <div className="space-y-6">
                  {/* 1. Personal Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">1. ชื่อ นาย/นาง/นางสาว...</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">ชื่อ</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">เพศ</span>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="gender" className="w-4 h-4" />
                            <span className="text-sm text-gray-600">ชาย</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="gender" className="w-4 h-4" />
                            <span className="text-sm text-gray-600">หญิง</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">อายุ (ปี)</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">วันที่เกิด</span>
                        <div className="flex gap-2 items-center">
                          <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                          <span className="text-sm text-gray-600">วัน</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                          <span className="text-sm text-gray-600">เดือน</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 w-20"></div>
                          <span className="text-sm text-gray-600">พ.ศ.</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">สัญชาติ</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ศาสนา</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* 2. National ID Number */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">2. เลขประจำตัวประชาชน</h4>
                    <div className="flex gap-2">
                      {Array.from({ length: 13 }, (_, i) => (
                        <div key={i} className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Medical Rights */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">3. สิทธิการรักษา</h4>
                    <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="w-5 h-5 mt-1" />
                        <div>
                          <span className="text-sm text-gray-600">มีสิทธิหลักประกันสุขภาพ (บัตรทอง) ที่ รพ.</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1 w-48"></div>
                        </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="w-5 h-5 mt-1" />
                        <div>
                          <span className="text-sm text-gray-600">มีสิทธิประกันสังคม ที่ รพ.</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1 w-48"></div>
                        </div>
                </div>
                
                      <div className="ml-8 space-y-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="w-5 h-5 mt-1" />
                          <span className="text-sm text-gray-600">ไม่ประสงค์เปลี่ยนสถานพยาบาลที่มีสิทธิประกันตน</span>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="w-5 h-5 mt-1" />
                          <div>
                            <span className="text-sm text-gray-600">ประสงค์เปลี่ยนสถานพยาบาลที่มีสิทธิประกันตนมาที่ รพ.</span>
                            <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1 w-48"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          (กรณีประสงค์เปลี่ยนสถานพยาบาลกรุณาติดต่อสำนักงานประกันสังคม หรือเปลี่ยนผ่านระบบออนไลน์ได้ที่แอพ SSO ของสำนักงานประกันสังคมด้วยตนเอง)
                        </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="w-5 h-5 mt-1" />
                        <div>
                          <span className="text-sm text-gray-600">มีสิทธิข้าราชการ (สิทธิของตนเอง)</span>
                        </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="w-5 h-5 mt-1" />
                        <div>
                          <span className="text-sm text-gray-600">อื่นๆ ระบุ</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1 w-48"></div>
                        </div>
                      </div>
                    </div>
                </div>
                
                  {/* 4. Multiple Employers */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">4. ชื่อสถานประกอบการกรณีทำงานกับนายจ้างหลายราย ณ ปัจจุบัน</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">{index}.</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 flex-1"></div>
                        </div>
                      ))}
                </div>
              </div>

                  {/* 5. Family Status */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">5. สถานภาพครอบครัว</h4>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="familyStatus" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">โสด</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="familyStatus" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">สมรสจดทะเบียน</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="familyStatus" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">หม้าย</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="familyStatus" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">หย่า</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="familyStatus" className="w-4 h-4" />
                        <span className="text-sm text-gray-600">แยกกันอยู่</span>
                      </label>
                    </div>
              </div>

                  {/* Signature Block */}
              <div className="mt-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm text-gray-600">ลงชื่อ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-8 flex-1"></div>
                </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm text-gray-600">( )</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-8 flex-1"></div>
                </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">วันที่</span>
                      <div className="flex gap-2 items-center">
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">/</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">/</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-20"></div>
                </div>
              </div>
            </div>

                  {/* Notes */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">หมายเหตุ</h4>
                    <div className="text-sm text-gray-600">
                      1. กรุณาแนบสำเนาบัตรประชาชนพร้อมรับรองสำเนาถูกต้อง 1 ฉบับ
                </div>
              </div>

                  {/* For Official Use */}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">สำหรับเจ้าหน้าที่</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">ตำแหน่ง</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">หน่วยงาน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                </div>
                      <div>
                        <span className="text-sm text-gray-600">เริ่มงาน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Document Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">เอกสารเต็ม - หน้า 2</h2>
              <p className="text-sm text-gray-600">สำหรับผู้สมัคร</p>
          </ModalHeader>
            <ModalBody>
              <div className="bg-white p-6 rounded-lg">
                {/* Page Header */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-2">- ๒ -</div>
                  <h1 className="text-xl font-bold text-gray-800">
                    สำหรับผู้สมัคร
                  </h1>
                </div>

                {/* Document Content in Modal */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">ข้อมูลสิทธิการรักษา</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">1. ชื่อ นาย/นาง/นางสาว...</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">ชื่อ</span>
                            <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">เพศ</span>
                            <div className="flex gap-4 mt-2">
                              <span className="text-sm text-gray-600">ชาย</span>
                              <span className="text-sm text-gray-600">หญิง</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">2. เลขประจำตัวประชาชน</h4>
                        <div className="flex gap-2">
                          {Array.from({ length: 13 }, (_, i) => (
                            <div key={i} className="w-6 h-6 border border-gray-300 rounded"></div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">3. สิทธิการรักษา</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">□</span>
                            <span className="text-sm text-gray-600">มีสิทธิหลักประกันสุขภาพ (บัตรทอง) ที่ รพ.</span>
                            <div className="border-b border-dotted border-gray-400 h-4 w-32"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">□</span>
                            <span className="text-sm text-gray-600">มีสิทธิประกันสังคม ที่ รพ.</span>
                            <div className="border-b border-dotted border-gray-400 h-4 w-32"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">5. สถานภาพครอบครัว</h4>
                        <div className="flex gap-4">
                          <span className="text-sm text-gray-600">□ โสด</span>
                          <span className="text-sm text-gray-600">□ สมรสจดทะเบียน</span>
                          <span className="text-sm text-gray-600">□ หม้าย</span>
                          <span className="text-sm text-gray-600">□ หย่า</span>
                          <span className="text-sm text-gray-600">□ แยกกันอยู่</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">ลงชื่อ</span>
                        </div>
                        <div className="border-b border-gray-400 h-8 mb-2"></div>
                        <div className="text-sm text-gray-500">( )</div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
              ปิด
            </Button>
              <Button color="primary" onPress={handlePrint}>
                พิมพ์เอกสาร
              </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
    </div>
  );
}
