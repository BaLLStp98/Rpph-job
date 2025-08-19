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

export default function Page3Applicant() {
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
              <div className="p-3 bg-purple-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  หน้า 3 - สำหรับผู้สมัคร
                </h1>
                <p className="text-gray-600">ข้อมูลส่วนตัวและประวัติการทำงาน</p>
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
              <div className="text-sm text-gray-500 mb-2">- ๓ -</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                สำหรับผู้สมัคร
              </h1>
            </div>

            {/* Document Fields */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลส่วนตัว</h3>
                
                <div className="space-y-6">
                  {/* Basic Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ชื่อ-นามสกุล</span>
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
                      <span className="text-sm text-gray-600">อายุ</span>
                      <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">วันเกิด</span>
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
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">ข้อมูลการติดต่อ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">ที่อยู่ปัจจุบัน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">โทรศัพท์บ้าน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">โทรศัพท์มือถือ</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">อีเมล</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">บุคคลที่สามารถติดต่อได้ในกรณีฉุกเฉิน</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">ชื่อ-นามสกุล</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ความสัมพันธ์</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">โทรศัพท์</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ที่อยู่</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ประวัติการทำงาน</h3>
                
                <div className="space-y-6">
                  {/* Current Employment */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">งานปัจจุบัน</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">ตำแหน่ง</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ชื่อบริษัท/องค์กร</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ที่อยู่บริษัท</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">โทรศัพท์</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ระยะเวลาทำงาน</span>
                        <div className="flex gap-2 items-center">
                          <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                          <span className="text-sm text-gray-600">ปี</span>
                          <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                          <span className="text-sm text-gray-600">เดือน</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">เงินเดือน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Previous Work Experience */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">ประวัติการทำงานที่ผ่านมา</h4>
                    <div className="space-y-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="text-sm text-gray-500 mb-3">งานที่ {index}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">ตำแหน่ง</span>
                              <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">ชื่อบริษัท/องค์กร</span>
                              <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">ระยะเวลาทำงาน</span>
                              <div className="flex gap-2 items-center">
                                <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                                <span className="text-sm text-gray-600">ปี</span>
                                <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                                <span className="text-sm text-gray-600">เดือน</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">เหตุผลที่ออก</span>
                              <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills and Qualifications */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">ทักษะและคุณสมบัติ</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-600">ทักษะพิเศษ</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ภาษาที่ใช้ได้</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ใบอนุญาต/ใบรับรอง</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">ข้อมูลเพิ่มเติม</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-600">เหตุผลที่สมัครงานนี้</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ความคาดหวังในการทำงาน</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">ข้อมูลอื่นๆ ที่ต้องการแจ้ง</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Declaration */}
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="text-sm text-gray-700 leading-relaxed mb-6">
                      ข้าพเจ้าขอรับรองว่าข้อมูลที่ให้ไว้ข้างต้นเป็นความจริงทุกประการ หากปรากฏว่าเป็นข้อมูลเท็จ ข้าพเจ้าขอรับผิดชอบตามกฎหมาย
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">ลงชื่อ</span>
                      </div>
                      <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
                      <div className="text-sm text-gray-500">ผู้สมัคร</div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <span className="text-sm text-gray-600">วันที่</span>
                      <div className="flex gap-2 items-center justify-center mt-2">
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">/</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-16"></div>
                        <span className="text-sm text-gray-600">/</span>
                        <div className="border-b-2 border-dotted border-gray-400 h-6 w-20"></div>
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
              <h2 className="text-xl font-bold">เอกสารเต็ม - หน้า 3</h2>
              <p className="text-sm text-gray-600">สำหรับผู้สมัคร</p>
            </ModalHeader>
            <ModalBody>
              <div className="bg-white p-6 rounded-lg">
                {/* Page Header */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-2">- ๓ -</div>
                  <h1 className="text-xl font-bold text-gray-800">
                    สำหรับผู้สมัคร
                  </h1>
                </div>

                {/* Document Content in Modal */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">ข้อมูลส่วนตัว</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">ชื่อ-นามสกุล</span>
                          <div className="border-b border-dotted border-gray-400 h-6 mt-1"></div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">เพศ</span>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm text-gray-600">ชาย</span>
                            <span className="text-sm text-gray-600">หญิง</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">ทักษะพิเศษ</span>
                        <div className="border-b border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">เหตุผลที่สมัครงานนี้</span>
                        <div className="border-b border-dotted border-gray-400 h-6 mt-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">ลงชื่อ</span>
                    </div>
                    <div className="border-b border-gray-400 h-10 mb-2"></div>
                    <div className="text-sm text-gray-500">ผู้สมัคร</div>
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
