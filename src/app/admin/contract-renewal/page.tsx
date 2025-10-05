'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Avatar,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentCheckIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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

export default function ContractRenewalPage() {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  
  // Modal controls
  const { isOpen: isDetailModalOpen, onOpen: onDetailModalOpen, onOpenChange: onDetailModalOpenChange } = useDisclosure();

  // สถิติ
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      // Mock data - ในระบบจริงจะเรียก API
      const mockContracts: ContractData[] = [
        {
          id: '1',
          employeeName: 'สมชาย ใจดี',
          position: 'พยาบาล',
          department: 'หอผู้ป่วยใน',
          currentContractEnd: '2024-12-31',
          newContractStart: '2025-01-01',
          newContractEnd: '2025-12-31',
          status: 'pending',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          employeeName: 'สมหญิง รักงาน',
          position: 'แพทย์',
          department: 'แผนกอายุรกรรม',
          currentContractEnd: '2024-11-30',
          newContractStart: '2024-12-01',
          newContractEnd: '2025-11-30',
          status: 'approved',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-20'
        },
        {
          id: '3',
          employeeName: 'วิชัย ทำงานดี',
          position: 'เภสัชกร',
          department: 'แผนกเภสัชกรรม',
          currentContractEnd: '2024-10-31',
          newContractStart: '2024-11-01',
          newContractEnd: '2025-10-31',
          status: 'rejected',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-18'
        }
      ];
      
      setContracts(mockContracts);
      
      // คำนวณสถิติ
      const newStats = {
        total: mockContracts.length,
        pending: mockContracts.filter(contract => contract.status === 'pending').length,
        approved: mockContracts.filter(contract => contract.status === 'approved').length,
        rejected: mockContracts.filter(contract => contract.status === 'rejected').length,
        expired: mockContracts.filter(contract => contract.status === 'expired').length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract: ContractData) => {
    setSelectedContract(contract);
    onDetailModalOpen();
  };

  const handleStatusChange = async (contractId: string, newStatus: string) => {
    try {
      // Mock API call
      setContracts(prev => prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, status: newStatus as any }
          : contract
      ));
      
      alert(`อัปเดตสถานะเป็น: ${getStatusText(newStatus)}`);
      onDetailModalOpen();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติ',
      rejected: 'ปฏิเสธ',
      expired: 'หมดอายุ'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      expired: 'default'
    };
    return colorMap[status] || 'default';
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">การจัดการต่อสัญญา</h1>
            <p className="mt-2 text-gray-600">จัดการการต่อสัญญาจ้างงานของพนักงาน</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              color="primary"
              startContent={<ArrowPathIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
              onPress={fetchContracts}
              size="sm"
              className="lg:size-md"
            >
              รีเฟรช
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* สถิติ */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm lg:text-base">ทั้งหมด</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.total}</p>
                </div>
                <DocumentCheckIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm lg:text-base">รอดำเนินการ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.pending}</p>
                </div>
                <ClockIcon className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm lg:text-base">อนุมัติ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm lg:text-base">ปฏิเสธ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.rejected}</p>
                </div>
                <XCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-red-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm lg:text-base">หมดอายุ</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.expired}</p>
                </div>
                <CalendarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-gray-200" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ฟิลเตอร์และค้นหา */}
        <Card>
          <CardBody className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อ, ตำแหน่ง, หรือแผนก..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />}
                  className="w-full"
                  size="sm"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  placeholder="กรองตามสถานะ"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                  className="w-full lg:w-48"
                  size="sm"
                >
                  <SelectItem key="all">ทั้งหมด</SelectItem>
                  <SelectItem key="pending">รอดำเนินการ</SelectItem>
                  <SelectItem key="approved">อนุมัติ</SelectItem>
                  <SelectItem key="rejected">ปฏิเสธ</SelectItem>
                  <SelectItem key="expired">หมดอายุ</SelectItem>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ตารางข้อมูล */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">รายการต่อสัญญา</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Contracts table">
              <TableHeader>
                <TableColumn>ชื่อ-นามสกุล</TableColumn>
                <TableColumn>ตำแหน่ง</TableColumn>
                <TableColumn>แผนก</TableColumn>
                <TableColumn>สัญญาเดิม</TableColumn>
                <TableColumn>สัญญาใหม่</TableColumn>
                <TableColumn>สถานะ</TableColumn>
                <TableColumn>การดำเนินการ</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={contract.employeeName}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{contract.employeeName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{contract.position}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-600">{contract.department}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {new Date(contract.currentContractEnd).toLocaleDateString('th-TH')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {new Date(contract.newContractStart).toLocaleDateString('th-TH')} - {new Date(contract.newContractEnd).toLocaleDateString('th-TH')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(contract.status) as any}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(contract.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onPress={() => handleViewDetails(contract)}
                        >
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onOpenChange={onDetailModalOpenChange}
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
                  รายละเอียดการต่อสัญญา: {selectedContract?.employeeName}
                </h3>
              </ModalHeader>
              <ModalBody>
                {selectedContract && (
                  <div className="space-y-6">
                    {/* ข้อมูลพนักงาน */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลพนักงาน</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">ชื่อ-นามสกุล</label>
                          <p className="text-gray-800">{selectedContract?.employeeName || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                          <p className="text-gray-800">{selectedContract?.position || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">แผนก</label>
                          <p className="text-gray-800">{selectedContract?.department || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">สถานะ</label>
                          <p className="text-gray-800">{getStatusText(selectedContract?.status || '')}</p>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลสัญญา */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลสัญญา</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">สัญญาเดิมสิ้นสุด</label>
                          <p className="text-gray-800">{selectedContract?.currentContractEnd ? new Date(selectedContract.currentContractEnd).toLocaleDateString('th-TH') : '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">สัญญาใหม่เริ่ม</label>
                          <p className="text-gray-800">{selectedContract?.newContractStart ? new Date(selectedContract.newContractStart).toLocaleDateString('th-TH') : '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">สัญญาใหม่สิ้นสุด</label>
                          <p className="text-gray-800">{selectedContract?.newContractEnd ? new Date(selectedContract.newContractEnd).toLocaleDateString('th-TH') : '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">วันที่สร้าง</label>
                          <p className="text-gray-800">{selectedContract?.createdAt ? new Date(selectedContract.createdAt).toLocaleDateString('th-TH') : '-'}</p>
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
                {selectedContract?.status === 'pending' && (
                  <>
                    <Button 
                      color="success" 
                      onPress={() => handleStatusChange(selectedContract.id, 'approved')}
                    >
                      อนุมัติ
                    </Button>
                    <Button 
                      color="danger" 
                      onPress={() => handleStatusChange(selectedContract.id, 'rejected')}
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
    </div>
  );
}