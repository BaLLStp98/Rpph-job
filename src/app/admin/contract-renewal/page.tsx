'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface ContractData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  currentContractStart: string;
  currentContractEnd: string;
  contractType: 'permanent' | 'temporary' | 'probation';
  status: 'active' | 'expiring' | 'expired' | 'renewed';
  renewalDate?: string;
  salary: string;
  manager: string;
  notes?: string;
}

const mockContracts: ContractData[] = [];

export default function ContractRenewalManagement() {
  const router = useRouter();
  const { user, logout } = useUser();
  // เริ่มต้นด้วยข้อมูลทันทีเพื่อให้เร็วขึ้น
  const [contracts, setContracts] = useState<ContractData[]>(mockContracts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contractTypeFilter, setContractTypeFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isRenewalOpen, onOpen: onRenewalOpen, onClose: onRenewalClose } = useDisclosure();
  
  // State สำหรับฟอร์มต่อสัญญา
  const [renewalForm, setRenewalForm] = useState({
    employeeId: '',
    employeeName: '',
    newStartDate: '',
    newEndDate: '',
    contractStartDate: '',
    contractEndDate: '',
    newSalary: '',
    notes: '' 
  });

  // สถิติ - ใช้ useMemo เพื่อคำนวณใหม่เมื่อ contracts เปลี่ยน
  const stats = useMemo(() => {
    return {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'active').length,
      expiring: contracts.filter(c => c.status === 'expiring').length,
      expired: contracts.filter(c => c.status === 'expired').length,
      renewed: contracts.filter(c => c.status === 'renewed').length
    };
  }, [contracts]);

  // ฟังก์ชันดึงสถิติข้อมูล ContractRenewal
  const fetchContractRenewalStats = async () => {
    try {
      const response = await fetch('/api/contract-renewals');
      const result = await response.json();
      
      if (result.success) {
        const data = result.data;
        const stats = {
          total: data.length,
          pending: data.filter((item: any) => item.status === 'PENDING').length,
          approved: data.filter((item: any) => item.status === 'APPROVED').length,
          rejected: data.filter((item: any) => item.status === 'REJECTED').length
        };
        
        console.log('Contract Renewal Statistics:', stats);
        return stats;
      }
    } catch (error) {
      console.error('Error fetching contract renewal stats:', error);
    }
  };

  // useEffect สำหรับโหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchContracts();
    fetchContractRenewalStats();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ดึงข้อมูลจาก API
      const response = await fetch('/api/contract-renewals');
      const result = await response.json();
      
      if (result.success) {
        // แสดงข้อมูล ContractRenewal ในรูปแบบตาราง
        displayContractRenewalData(result.data);
        
        // แปลงข้อมูลจาก ContractRenewal เป็น ContractData
        const contractData = result.data.map((contract: any) => ({
          id: contract.id,
          employeeId: contract.employeeId,
          employeeName: contract.employeeName,
          department: contract.department,
          position: contract.position,
          currentContractStart: contract.contractStartDate || '',
          currentContractEnd: contract.contractEndDate || '',
          contractType: 'temporary', // กำหนดเป็นชั่วคราวเป็นค่าเริ่มต้น
          status: contract.status === 'APPROVED' ? 'renewed' : 
                 contract.status === 'REJECTED' ? 'expired' : 'active',
          renewalDate: contract.newStartDate,
          salary: contract.newSalary || '',
          manager: '', // ไม่มีข้อมูลใน ContractRenewal
          notes: contract.notes || ''
        }));
        
        setContracts(contractData);
      } else {
        throw new Error(result.error || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      // ใช้ข้อมูล mock เป็น fallback
      setContracts(mockContracts);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expiring': return 'warning';
      case 'expired': return 'danger';
      case 'renewed': return 'primary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ใช้งานอยู่';
      case 'expiring': return 'ใกล้หมดอายุ';
      case 'expired': return 'หมดอายุแล้ว';
      case 'renewed': return 'ต่อสัญญาแล้ว';
      default: return 'ไม่ระบุ';
    }
  };

  const getContractTypeText = (type: string) => {
    switch (type) {
      case 'permanent': return 'ประจำ';
      case 'temporary': return 'ชั่วคราว';
      case 'probation': return 'ทดลองงาน';
      default: return 'ไม่ระบุ';
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ฟังก์ชันแสดงวันที่แบบปลอดภัย (รองรับค่าว่าง/ไม่ถูกต้อง)
  const formatDateThai = (value: string | null | undefined) => {
    if (!value) return '-'
    const d = new Date(value as string)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('th-TH')
  }

  // ฟังก์ชันดึงข้อมูลรายละเอียดการต่อสัญญา
  const fetchContractDetails = async (contractId: string) => {
    try {
      const response = await fetch(`/api/contract-renewals/${contractId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
      throw error;
    }
  };

  // ฟังก์ชันอัปเดตสถานะการต่อสัญญา
  const updateContractStatus = async (contractId: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    try {
      const response = await fetch(`/api/contract-renewals/${contractId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      const result = await response.json();
      
      if (result.success) {
        // รีเฟรชข้อมูลหลังจากอัปเดต
        await fetchContracts();
        return true;
      } else {
        throw new Error(result.error || 'ไม่สามารถอัปเดตข้อมูลได้');
      }
    } catch (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  };

  // ใช้ useMemo สำหรับการกรองข้อมูล
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contract.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesType = contractTypeFilter === 'all' || contract.contractType === contractTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [contracts, searchTerm, statusFilter, contractTypeFilter]);

  // ฟังก์ชันสำหรับดึงข้อมูลตามสถานะ ContractRenewal
  const fetchContractsByStatus = async (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      const url = status === 'all' 
        ? '/api/contract-renewals' 
        : `/api/contract-renewals?status=${status}`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        const contractData = result.data.map((contract: any) => ({
          id: contract.id,
          employeeId: contract.employeeId,
          employeeName: contract.employeeName,
          department: contract.department,
          position: contract.position,
          currentContractStart: contract.contractStartDate || '',
          currentContractEnd: contract.contractEndDate || '',
          contractType: 'temporary',
          status: contract.status === 'APPROVED' ? 'renewed' : 
                 contract.status === 'REJECTED' ? 'expired' : 'active',
          renewalDate: contract.newStartDate,
          salary: contract.newSalary || '',
          manager: '',
          notes: contract.notes || ''
        }));
        
        setContracts(contractData);
      } else {
        throw new Error(result.error || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching contracts by status:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (contract: ContractData) => {
    setSelectedContract(contract);
    onOpen();
  };

  // ฟังก์ชันสำหรับปิด modal อย่างรวดเร็ว
  const handleCloseModal = () => {
    setSelectedContract(null);
    onClose();
  };

  // ฟังก์ชันสำหรับเปิดต่อสัญญา
  const handleOpenRenewal = () => {
    // รีเซ็ตฟอร์ม
    setRenewalForm({
      employeeId: '',
      employeeName: '',
      newStartDate: '',
      newEndDate: '',
      contractStartDate: '',
      contractEndDate: '',
      newSalary: '',
      notes: ''
    });
    onRenewalOpen();
  };

  // ฟังก์ชันบันทึกการต่อสัญญา
  const handleSubmitRenewal = async () => {
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!renewalForm.employeeId || !renewalForm.employeeName) {
        alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
        return;
      }

      // สร้าง FormData
      const formData = new FormData();
      formData.append('employeeId', renewalForm.employeeId);
      formData.append('employeeName', renewalForm.employeeName);
      formData.append('newStartDate', renewalForm.newStartDate);
      formData.append('newEndDate', renewalForm.newEndDate);
      formData.append('contractStartDate', renewalForm.contractStartDate);
      formData.append('contractEndDate', renewalForm.contractEndDate);
      formData.append('newSalary', renewalForm.newSalary);
      formData.append('notes', renewalForm.notes);

      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/contract-renewals', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('บันทึกข้อมูลการต่อสัญญาเรียบร้อยแล้ว');
        // รีเฟรชข้อมูล
        await fetchContracts();
        // ปิด modal
        onRenewalClose();
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error submitting renewal:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // ฟังก์ชันสำหรับปิด modal ต่อสัญญา
  const handleCloseRenewal = () => {
    setRenewalForm({
      employeeId: '',
      employeeName: '',
      newStartDate: '',
      newEndDate: '',
      contractStartDate: '',
      contractEndDate: '',
      newSalary: '',
      notes: ''
    });
    onRenewalClose();
  };

  // ฟังก์ชันสำหรับแสดงข้อมูล ContractRenewal ในรูปแบบตาราง
  const displayContractRenewalData = (data: any[]) => {
    console.log('Contract Renewal Data:', data);
    
    // แสดงข้อมูลในรูปแบบตาราง
    const tableData = data.map((item, index) => ({
      index: index + 1,
      id: item.id,
      employeeName: item.employeeName,
      department: item.department,
      position: item.position,
      status: item.status,
      newStartDate: item.newStartDate ? new Date(item.newStartDate).toLocaleDateString('th-TH') : '-',
      newEndDate: item.newEndDate ? new Date(item.newEndDate).toLocaleDateString('th-TH') : '-',
      newSalary: item.newSalary || '-',
      createdAt: new Date(item.createdAt).toLocaleDateString('th-TH'),
      attachments: item.attachments?.length || 0
    }));
    
    console.table(tableData);
    return tableData;
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงในฟอร์ม
  const handleRenewalFormChange = (field: string, value: string) => {
    setRenewalForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ฟังก์ชันสำหรับบันทึกการต่อสัญญา
  const handleSaveRenewal = () => {
    // TODO: บันทึกการต่อสัญญา
    console.log('บันทึกการต่อสัญญา:', renewalForm);
    alert('บันทึกการต่อสัญญาเรียบร้อยแล้ว');
    handleCloseRenewal();
  };


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="md" />
          <p className="mt-2 text-gray-600 text-sm">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-lg min-h-screen lg:min-h-0">
          <div className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">เมนูจัดการ</h2>
            <nav className="space-y-2">
              <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 text-gray-700 hover:bg-blue-50 hover:text-blue-700 text-sm sm:text-base"
                startContent={<BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => router.push('/departments')}
              >
                จัดการแผนก
              </Button>
              <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 text-gray-700 hover:bg-green-50 hover:text-green-700 text-sm sm:text-base"
                startContent={<UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => router.push('/admin/members')}
              >
                จัดการสมาชิก
              </Button>
              <Button
                variant="light"
                className="w-full justify-start h-10 sm:h-12 bg-orange-50 text-orange-700 hover:bg-orange-100 text-sm sm:text-base"
                startContent={<DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              >
                จัดการต่อสัญญาพนักงาน
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="light"
                  startContent={<ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  onClick={() => router.push('/admin')}
                  className="text-gray-600 text-sm sm:text-base"
                >
                  กลับ
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">จัดการต่อสัญญาพนักงาน</h1>
                  <p className="text-sm sm:text-base text-gray-600">จัดการการต่อสัญญาพนักงานในระบบ</p>
                </div>
              </div>
            </div>
          </div>

          {/* สถิติ */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <Card className="shadow-lg border-0">
              <CardBody className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">สัญญาทั้งหมด</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg border-0">
              <CardBody className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">ใช้งานอยู่</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.active}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg border-0">
              <CardBody className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                    <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">ใกล้หมดอายุ</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.expiring}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg border-0">
              <CardBody className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">หมดอายุแล้ว</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.expired}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg border-0">
              <CardBody className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">ต่อสัญญาแล้ว</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stats.renewed}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* ฟิลเตอร์ */}
          <Card className="shadow-lg border-0 mb-6">
            <CardBody className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="ค้นหาพนักงาน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    color="success"
                    variant="flat"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onClick={handleOpenRenewal}
                    className="whitespace-nowrap"
                  >
                    เปิดต่อสัญญา
                  </Button>
                  
                  <Select
                    placeholder="สถานะ"
                    selectedKeys={[statusFilter]}
                    onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                    className="w-40"
                  >
                    <SelectItem key="all">ทั้งหมด</SelectItem>
                    <SelectItem key="active">ใช้งานอยู่</SelectItem>
                    <SelectItem key="expiring">ใกล้หมดอายุ</SelectItem>
                    <SelectItem key="expired">หมดอายุแล้ว</SelectItem>
                    <SelectItem key="renewed">ต่อสัญญาแล้ว</SelectItem>
                  </Select>
                  <Select
                    placeholder="ประเภทสัญญา"
                    selectedKeys={[contractTypeFilter]}
                    onSelectionChange={(keys) => setContractTypeFilter(Array.from(keys)[0] as string)}
                    className="w-40"
                  >
                    <SelectItem key="all">ทั้งหมด</SelectItem>
                    <SelectItem key="permanent">ประจำ</SelectItem>
                    <SelectItem key="temporary">ชั่วคราว</SelectItem>
                    <SelectItem key="probation">ทดลองงาน</SelectItem>
                  </Select>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* ตารางข้อมูล */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">รายการสัญญาพนักงาน</h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <Table aria-label="ตารางสัญญาพนักงาน">
                <TableHeader>
                  <TableColumn>ชื่อ-นามสกุล</TableColumn>
                  <TableColumn>แผนก/ตำแหน่ง</TableColumn>
                  <TableColumn>ประเภทสัญญา</TableColumn>
                  <TableColumn>วันที่เริ่มต้น</TableColumn>
                  <TableColumn>วันที่สิ้นสุด</TableColumn>
                  <TableColumn>สถานะ</TableColumn>
                  <TableColumn>การดำเนินการ</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลสัญญา</h3>
                            <p className="text-gray-500 mb-4">ยังไม่มีข้อมูลสัญญาพนักงานในระบบ</p>
                            <Button
                              color="primary"
                              variant="flat"
                              startContent={<PlusIcon className="w-4 h-4" />}
                              onPress={handleOpenRenewal}
                            >
                              เพิ่มสัญญาใหม่
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContracts.map((contract) => {
                      const daysUntilExpiry = getDaysUntilExpiry(contract.currentContractEnd);
                      return (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">{contract.employeeName}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{contract.department}</div>
                              <div className="text-sm text-gray-500">{contract.position}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip size="sm" variant="flat" color="primary">
                              {getContractTypeText(contract.contractType)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {formatDateThai(contract.currentContractStart)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {formatDateThai(contract.currentContractEnd)}
                            </div>
                            {contract.status === 'expiring' && daysUntilExpiry <= 30 && (
                              <div className="text-xs text-yellow-600 mt-1">
                                เหลือ {daysUntilExpiry} วัน
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip size="sm" variant="flat" color={getStatusColor(contract.status)}>
                              {getStatusText(contract.status)}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Button
                              color="primary"
                              size="sm"
                              variant="flat"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onClick={() => handleViewDetails(contract)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* Modal สำหรับดูรายละเอียด */}
          <Modal isOpen={isOpen} onClose={handleCloseModal} size="3xl">
            <ModalContent className="bg-white">
              <ModalHeader className="flex flex-col gap-1 bg-white">
                <h3 className="text-lg font-semibold">รายละเอียดสัญญาพนักงาน</h3>
                <p className="text-sm text-gray-600">
                  {selectedContract?.employeeName} - {selectedContract?.position}
                </p>
              </ModalHeader>
              <ModalBody className="bg-white">
                {selectedContract && (
                  <div className="space-y-6">
                    {/* ข้อมูลพื้นฐาน */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 border-b pb-2">ข้อมูลพนักงาน</h4>
                        <div className="space-y-3">
                          {/* <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">รหัสพนักงาน:</span>
                            <span className="text-sm text-gray-900">{selectedContract.employeeId}</span>
                          </div> */}
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">ชื่อ-นามสกุล:</span>
                            <span className="text-sm text-gray-900">{selectedContract.employeeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">แผนก:</span>
                            <span className="text-sm text-gray-900">{selectedContract.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">ตำแหน่ง:</span>
                            <span className="text-sm text-gray-900">{selectedContract.position}</span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">ผู้จัดการ:</span>
                            <span className="text-sm text-gray-900">{selectedContract.manager}</span>
                          </div> */}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 border-b pb-2">ข้อมูลสัญญา</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">ประเภทสัญญา:</span>
                            <Chip size="sm" variant="flat" color="primary">
                              {getContractTypeText(selectedContract.contractType)}
                            </Chip>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">สถานะ:</span>
                            <Chip size="sm" variant="flat" color={getStatusColor(selectedContract.status)}>
                              {getStatusText(selectedContract.status)}
                            </Chip>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">เงินเดือน:</span>
                            <span className="text-sm text-gray-900 font-medium">{selectedContract.salary} บาท</span>
                          </div> */}
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">วันที่เริ่มต้น:</span>
                            <span className="text-sm text-gray-900">
                              {formatDateThai(selectedContract.currentContractStart)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">วันที่สิ้นสุด:</span>
                            <span className="text-sm text-gray-900">
                              {formatDateThai(selectedContract.currentContractEnd)}
                            </span>
                          </div>
                          {selectedContract.renewalDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">วันที่ต่อสัญญา:</span>
                              <span className="text-sm text-gray-900">
                                {formatDateThai(selectedContract.renewalDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลเพิ่มเติม */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-800 border-b pb-2">ข้อมูลเพิ่มเติม</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">ระยะเวลาที่เหลือ:</span>
                          <span className={`text-sm font-medium ${
                            getDaysUntilExpiry(selectedContract.currentContractEnd) <= 30 
                              ? 'text-red-600' 
                              : getDaysUntilExpiry(selectedContract.currentContractEnd) <= 60 
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                          }`}>
                            {getDaysUntilExpiry(selectedContract.currentContractEnd)} วัน
                          </span>
                        </div>
                        {selectedContract.notes && (
                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-600">หมายเหตุ:</span>
                            <p className="text-sm text-gray-900 mt-1">{selectedContract.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* สถานะการแจ้งเตือน */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-800 border-b pb-2">สถานะการแจ้งเตือน</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-3 rounded-lg border ${
                          selectedContract.status === 'active' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <CheckIcon className={`w-4 h-4 ${
                              selectedContract.status === 'active' ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              selectedContract.status === 'active' ? 'text-green-800' : 'text-gray-600'
                            }`}>
                              สัญญาใช้งานอยู่
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border ${
                          selectedContract.status === 'expiring' 
                            ? 'bg-yellow-50 border-yellow-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <ClockIcon className={`w-4 h-4 ${
                              selectedContract.status === 'expiring' ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              selectedContract.status === 'expiring' ? 'text-yellow-800' : 'text-gray-600'
                            }`}>
                              ใกล้หมดอายุ
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border ${
                          selectedContract.status === 'expired' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <ExclamationTriangleIcon className={`w-4 h-4 ${
                              selectedContract.status === 'expired' ? 'text-red-600' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              selectedContract.status === 'expired' ? 'text-red-800' : 'text-gray-600'
                            }`}>
                              หมดอายุแล้ว
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="bg-white">
                <Button color="primary" onPress={handleCloseModal}>
                  ปิด
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal สำหรับต่อสัญญา */}
          <Modal isOpen={isRenewalOpen} onClose={handleCloseRenewal} size="3xl" scrollBehavior="inside">
            <ModalContent className="bg-gradient-to-br from-white to-gray-50 shadow-2xl">
              <ModalHeader className="flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">ต่อสัญญาพนักงาน</h3>
                    <p className="text-blue-100 text-sm">กรอกข้อมูลการต่อสัญญาพนักงานใหม่</p>
                  </div>
                </div>
              </ModalHeader>
              
              <ModalBody className="p-6 bg-white">
                <div className="space-y-8">
                  {/* ข้อมูลสัญญาใหม่ */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-green-800">ข้อมูลสัญญาใหม่</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          วันที่เริ่มต้นสัญญาใหม่
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={renewalForm.newStartDate}
                          onChange={(e) => handleRenewalFormChange('newStartDate', e.target.value)}
                          className="bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                          placeholder="เลือกวันที่เริ่มต้น"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          วันที่สิ้นสุดสัญญาใหม่
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={renewalForm.newEndDate}
                          onChange={(e) => handleRenewalFormChange('newEndDate', e.target.value)}
                          className="bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                          placeholder="เลือกวันที่สิ้นสุด"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ระยะเวลาการต่อสัญญา */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-orange-800">ระยะเวลาการต่อสัญญา</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          วันที่เริ่มให้ต่อ
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={renewalForm.contractStartDate}
                          onChange={(e) => handleRenewalFormChange('contractStartDate', e.target.value)}
                          className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                          placeholder="เลือกวันที่เริ่มให้ต่อ"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          วันสุดท้ายที่ให้ต่อ
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={renewalForm.contractEndDate}
                          onChange={(e) => handleRenewalFormChange('contractEndDate', e.target.value)}
                          className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                          placeholder="เลือกวันสุดท้ายที่ให้ต่อ"
                        />
                      </div>
                    </div>
                  </div>

                  {/* หมายเหตุ */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gray-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">หมายเหตุเพิ่มเติม</h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">รายละเอียดเพิ่มเติม (ถ้ามี)</label>
                      <Input
                        placeholder="กรอกหมายเหตุหรือรายละเอียดเพิ่มเติม..."
                        value={renewalForm.notes}
                        onChange={(e) => handleRenewalFormChange('notes', e.target.value)}
                        className="bg-white border-gray-200 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              
              <ModalFooter className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-t border-gray-200">
                <div className="flex gap-3 w-full justify-end">
                  <Button 
                    color="danger" 
                    variant="light" 
                    onPress={handleCloseRenewal}
                    className="px-6 py-2 font-medium"
                    startContent={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    color="success" 
                    onPress={handleSaveRenewal}
                    className="px-6 py-2 font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    startContent={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  >
                    บันทึกการต่อสัญญา
                  </Button>
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </div>
      </div>
    </div>
  );
}
