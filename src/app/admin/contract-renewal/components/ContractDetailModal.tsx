'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@heroui/react';

interface ContractData {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  currentContractEnd: string;
  newContractStart: string;
  newContractEnd: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
}

interface ContractDetailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  contract: ContractData | null;
  onStatusChange: (contractId: string, newStatus: string) => void;
}

export default function ContractDetailModal({
  isOpen,
  onOpenChange,
  contract,
  onStatusChange
}: ContractDetailModalProps) {
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติ',
      rejected: 'ปฏิเสธ',
      expired: 'หมดอายุ'
    };
    return statusMap[status] || status;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-800">
                รายละเอียดการต่อสัญญา: {contract?.employeeName}
              </h3>
            </ModalHeader>
            <ModalBody>
              {contract && (
                <div className="space-y-6">
                  {/* ข้อมูลพนักงาน */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลพนักงาน</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">ชื่อ-นามสกุล</label>
                        <p className="text-gray-800">{contract?.employeeName || '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                        <p className="text-gray-800">{contract?.position || '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">แผนก</label>
                        <p className="text-gray-800">{contract?.department || '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">สถานะ</label>
                        <p className="text-gray-800">{getStatusText(contract?.status || '')}</p>
                      </div>
                    </div>
                  </div>

                  {/* ข้อมูลสัญญา */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลสัญญา</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">สัญญาเดิมสิ้นสุด</label>
                        <p className="text-gray-800">{contract?.currentContractEnd ? new Date(contract.currentContractEnd).toLocaleDateString('th-TH') : '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">สัญญาใหม่เริ่ม</label>
                        <p className="text-gray-800">{contract?.newContractStart ? new Date(contract.newContractStart).toLocaleDateString('th-TH') : '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">สัญญาใหม่สิ้นสุด</label>
                        <p className="text-gray-800">{contract?.newContractEnd ? new Date(contract.newContractEnd).toLocaleDateString('th-TH') : '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">วันที่สร้าง</label>
                        <p className="text-gray-800">{contract?.createdAt ? new Date(contract.createdAt).toLocaleDateString('th-TH') : '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                ปิด
              </Button>
              {contract?.status === 'pending' && (
                <>
                  <Button 
                    color="success" 
                    onPress={() => onStatusChange(contract.id, 'approved')}
                  >
                    อนุมัติ
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={() => onStatusChange(contract.id, 'rejected')}
                  >
                    ปฏิเสธ
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
