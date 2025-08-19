'use client';

import React from 'react';
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea
} from '@heroui/react';
import { 
  DocumentTextIcon,
  PrinterIcon,
  EyeIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Page4Additional() {
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
              <div className="p-3 bg-red-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  หน้า 4 - ข้อมูลตามเอกสารทางการ
                </h1>
                <p className="text-gray-600">ข้อมูลการสมัคร คุณสมบัติ และคำรับรอง</p>
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
              <h1 className="text-2xl font-bold text-gray-800">
                ข้อมูลตามเอกสารทางการ
              </h1>
            </div>

            {/* Section 1: Application Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง
              </h3>
              <div className="mb-4">
                <Input
                  placeholder="กรุณากรอกตำแหน่งที่สมัคร"
                  className="border-dashed border-2 border-gray-300"
                  variant="bordered"
                />
              </div>
              <h4 className="text-md font-medium text-gray-700 mb-2">
                ฝ่าย/กลุ่มงาน
              </h4>
              <div className="mb-4">
                <Input
                  placeholder="กรุณากรอกฝ่าย/กลุ่มงาน"
                  className="border-dashed border-2 border-gray-300"
                  variant="bordered"
                />
              </div>
            </div>

            {/* Section 2: Knowledge and Skills */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ๒. ความรู้ ความสามารถ/ทักษะพิเศษ
              </h3>
              <Textarea
                placeholder="กรุณากรอกความรู้ ความสามารถ และทักษะพิเศษของท่าน"
                className="border-dashed border-2 border-gray-300 min-h-[120px]"
                variant="bordered"
              />
            </div>

            {/* Section 3: General Qualifications and Prohibitions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ๓. คุณสมบัติทั่วไปและลักษณะต้องห้าม
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๑</span>
                  <span>เป็นผู้มีความเลื่อมใสในการปกครองระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุขอย่างแท้จริง</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๒</span>
                  <span>ไม่เป็นผู้ทุพพลภาพหรือเป็นโรคที่ต้องห้ามตามที่กำหนดไว้ในข้อ ๓.๒ (ก) ถึง (จ)</span>
                </div>
                <div className="ml-6 space-y-2 text-xs text-gray-600">
                  <div>(ก) วัณโรคในระยะติดต่อ</div>
                  <div>(ข) โรคเรื้อนในระยะที่สังคมรังเกียจ</div>
                  <div>(ค) โรคติดยาเสพติดให้โทษ</div>
                  <div>(ง) โรคพิษสุราเรื้อรัง</div>
                  <div>(จ) โรคติดต่อร้ายแรงหรือโรคเรื้อรังที่มีอาการชัดเจนหรือรุนแรงซึ่งขัดขวางการปฏิบัติราชการตามที่ปลัดกรุงเทพมหานครกำหนด</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๓</span>
                  <span>ไม่เป็นผู้ถูกสั่งพักราชการหรือสั่งให้ออกจากราชการไว้ก่อนตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารงานบุคคลของข้าราชการกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือกฎหมายอื่น</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๔</span>
                  <span>ไม่เป็นผู้ขาดความประพฤติที่ดีจนเป็นที่รังเกียจของสังคม</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๕</span>
                  <span>ไม่เป็นบุคคลล้มละลาย</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๖</span>
                  <span>ไม่เป็นผู้ที่เคยต้องคำพิพากษาให้จำคุกโดยคำพิพากษาถึงที่สุดให้จำคุกในความผิดอาญา เว้นแต่ความผิดที่ได้กระทำโดยประมาทหรือความผิดลหุโทษ</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๗</span>
                  <span>ไม่เป็นผู้ที่เคยถูกลงโทษไล่ออก ปลดออก หรือไล่ออกจากราชการเพราะกระทำผิดวินัยจากส่วนราชการ รัฐวิสาหกิจ หรือหน่วยงานอื่นของรัฐ</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๘</span>
                  <span>ไม่เป็นผู้ที่เคยถูกลงโทษไล่ออกหรือปลดออกเพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารงานบุคคลของข้าราชการกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือกฎหมายอื่น</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๙</span>
                  <span>ไม่เป็นผู้ที่เคยถูกลงโทษไล่ออกเพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารงานบุคคลของข้าราชการกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือกฎหมายอื่น</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">๓.๑๐</span>
                  <span>ไม่เป็นผู้ที่เคยกระทำการทุจริตในการสอบแข่งขันเข้ารับราชการหรือในการเข้ารับราชการ</span>
                </div>
              </div>
            </div>

            {/* Declaration and Signature */}
            <div className="mb-8">
              <div className="text-sm text-gray-700 leading-relaxed mb-6">
                ข้าพเจ้าขอรับรองว่าข้อมูลและเอกสารที่แนบมาด้วยในการสมัครครั้งนี้เป็นความจริงทุกประการ หากปรากฏว่าข้าพเจ้าไม่เป็นไปตามคุณสมบัติที่ประกาศรับสมัครไว้ ข้าพเจ้าขอรับผิดชอบและยอมให้ถูกตัดสิทธิ์โดยไม่เรียกร้องสิทธิ์ใดๆ และหากข้าพเจ้าได้ให้ข้อมูลที่เป็นเท็จโดยเจตนา ข้าพเจ้าขอรับผิดชอบตามกฎหมายว่าด้วยการกระทำความผิดต่อเจ้าหน้าที่ในการปฏิบัติราชการ
              </div>
              
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-sm text-gray-600">(ลงชื่อ)</span>
                </div>
                <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
                <div className="text-sm text-gray-500">ผู้สมัคร</div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-2">หมายเหตุ:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</div>
                <div>• เอกสารที่แนบมาจะไม่ส่งคืน</div>
                <div>• การสมัครจะถือว่าเสร็จสิ้นเมื่อส่งเอกสารครบถ้วนแล้ว</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Document Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">เอกสารเต็ม - หน้า 4</h2>
              <p className="text-sm text-gray-600">ข้อมูลตามเอกสารทางการ</p>
            </ModalHeader>
            <ModalBody>
              <div className="bg-white p-6 rounded-lg">
                {/* Page Header */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-2">- ๒ -</div>
                  <h1 className="text-xl font-bold text-gray-800">
                    ข้อมูลตามเอกสารทางการ
                  </h1>
                </div>

                {/* Section 1: Application Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    ๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง
                  </h3>
                  <div className="mb-3">
                    <div className="border-b-2 border-dashed border-gray-300 h-8"></div>
                  </div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    ฝ่าย/กลุ่มงาน
                  </h4>
                  <div className="mb-3">
                    <div className="border-b-2 border-dashed border-gray-300 h-8"></div>
                  </div>
                </div>

                {/* Section 2: Knowledge and Skills */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    ๒. ความรู้ ความสามารถ/ทักษะพิเศษ
                  </h3>
                  <div className="space-y-2">
                    <div className="border-b-2 border-dashed border-gray-300 h-6"></div>
                    <div className="border-b-2 border-dashed border-gray-300 h-6"></div>
                    <div className="border-b-2 border-dashed border-gray-300 h-6"></div>
                    <div className="border-b-2 border-dashed border-gray-300 h-6"></div>
                  </div>
                </div>

                {/* Section 3: General Qualifications and Prohibitions */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    ๓. คุณสมบัติทั่วไปและลักษณะต้องห้าม
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๑</span>
                      <span>เป็นผู้มีความเลื่อมใสในการปกครองระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุขอย่างแท้จริง</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๒</span>
                      <span>ไม่เป็นผู้ทุพพลภาพหรือเป็นโรคที่ต้องห้ามตามที่กำหนดไว้ในข้อ ๓.๒ (ก) ถึง (จ)</span>
                    </div>
                    <div className="ml-6 space-y-1 text-xs text-gray-600">
                      <div>(ก) วัณโรคในระยะติดต่อ</div>
                      <div>(ข) โรคเรื้อนในระยะที่สังคมรังเกียจ</div>
                      <div>(ค) โรคติดยาเสพติดให้โทษ</div>
                      <div>(ง) โรคพิษสุราเรื้อรัง</div>
                      <div>(จ) โรคติดต่อร้ายแรงหรือโรคเรื้อรังที่มีอาการชัดเจนหรือรุนแรงซึ่งขัดขวางการปฏิบัติราชการตามที่ปลัดกรุงเทพมหานครกำหนด</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๓</span>
                      <span>ไม่เป็นผู้ถูกสั่งพักราชการหรือสั่งให้ออกจากราชการไว้ก่อนตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารงานบุคคลของข้าราชการกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือกฎหมายอื่น</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๔</span>
                      <span>ไม่เป็นผู้ขาดความประพฤติที่ดีจนเป็นที่รังเกียจของสังคม</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๕</span>
                      <span>ไม่เป็นบุคคลล้มละลาย</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๖</span>
                      <span>ไม่เป็นผู้ที่เคยต้องคำพิพากษาให้จำคุกโดยคำพิพากษาถึงที่สุดให้จำคุกในความผิดอาญา เว้นแต่ความผิดที่ได้กระทำโดยประมาทหรือความผิดลหุโทษ</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๗</span>
                      <span>ไม่เป็นผู้ที่เคยถูกลงโทษไล่ออก ปลดออก หรือไล่ออกจากราชการเพราะกระทำผิดวินัยจากส่วนราชการ รัฐวิสาหกิจ หรือหน่วยงานอื่นของรัฐ</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๘</span>
                      <span>ไม่เป็นผู้ที่เคยถูกลงโทษไล่ออกหรือปลดออกเพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารงานบุคคลของข้าราชการกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือกฎหมายอื่น</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๙</span>
                      <span>ไม่เป็นผู้ที่เคยถูกลงโทษไล่ออกเพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารงานบุคคลของข้าราชการกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือกฎหมายอื่น</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">๓.๑๐</span>
                      <span>ไม่เป็นผู้ที่เคยกระทำการทุจริตในการสอบแข่งขันเข้ารับราชการหรือในการเข้ารับราชการ</span>
                    </div>
                  </div>
                </div>

                {/* Declaration and Signature */}
                <div className="mb-6">
                  <div className="text-sm text-gray-700 leading-relaxed mb-4">
                    ข้าพเจ้าขอรับรองว่าข้อมูลและเอกสารที่แนบมาด้วยในการสมัครครั้งนี้เป็นความจริงทุกประการ หากปรากฏว่าข้าพเจ้าไม่เป็นไปตามคุณสมบัติที่ประกาศรับสมัครไว้ ข้าพเจ้าขอรับผิดชอบและยอมให้ถูกตัดสิทธิ์โดยไม่เรียกร้องสิทธิ์ใดๆ และหากข้าพเจ้าได้ให้ข้อมูลที่เป็นเท็จโดยเจตนา ข้าพเจ้าขอรับผิดชอบตามกฎหมายว่าด้วยการกระทำความผิดต่อเจ้าหน้าที่ในการปฏิบัติราชการ
                  </div>
                  
                  <div className="text-center">
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">(ลงชื่อ)</span>
                    </div>
                    <div className="border-b-2 border-gray-400 h-10 mb-2"></div>
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
