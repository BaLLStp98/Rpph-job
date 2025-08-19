'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Badge,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination
} from '@heroui/react';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  EyeIcon,
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  manager: string;
  managerEmail: string;
  managerPhone: string;
  location: string;
  employeeCount: number;
  status: 'active' | 'inactive';
  salary: string;
  applicationStartDate: string;
  applicationEndDate: string;
  education: string;
  gender: 'male' | 'female' | 'any';
  positions: string;
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'แผนกเทคโนโลยีสารสนเทศ',
    code: 'IT',
    description: 'ดูแลระบบเทคโนโลยีสารสนเทศและการพัฒนาซอฟต์แวร์',
    manager: 'นายสมชาย ใจดี',
    managerEmail: 'somchai@company.com',
    managerPhone: '081-234-5678',
    location: 'ชั้น 3 อาคาร A',
    employeeCount: 15,
    status: 'active',
    salary: '2,500,000 บาท',
    applicationStartDate: '2024-01-15',
    applicationEndDate: '2024-02-15',
    education: 'ปริญญาตรี สาขาคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'โปรแกรมเมอร์, นักวิเคราะห์ระบบ, ผู้ดูแลระบบ'
  },
  {
    id: '2',
    name: 'แผนกทรัพยากรบุคคล',
    code: 'HR',
    description: 'จัดการทรัพยากรบุคคล การสรรหา และการพัฒนาพนักงาน',
    manager: 'นางสาวสมหญิง รักดี',
    managerEmail: 'somying@company.com',
    managerPhone: '082-345-6789',
    location: 'ชั้น 2 อาคาร B',
    employeeCount: 8,
    status: 'active',
    salary: '1,200,000 บาท',
    applicationStartDate: '2024-01-10',
    applicationEndDate: '2024-02-10',
    education: 'ปริญญาตรี สาขาบริหารธุรกิจหรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'เจ้าหน้าที่ทรัพยากรบุคคล, นักสรรหาพนักงาน, ผู้ฝึกอบรม'
  },
  {
    id: '3',
    name: 'แผนกการเงินและบัญชี',
    code: 'FIN',
    description: 'จัดการด้านการเงิน การบัญชี และการวางแผนงบประมาณ',
    manager: 'นายสมศักดิ์ เงินดี',
    managerEmail: 'somsak@company.com',
    managerPhone: '083-456-7890',
    location: 'ชั้น 1 อาคาร A',
    employeeCount: 12,
    status: 'active',
    salary: '1,800,000 บาท',
    applicationStartDate: '2024-01-05',
    applicationEndDate: '2024-02-05',
    education: 'ปริญญาตรี สาขาบัญชีหรือการเงิน',
    gender: 'any',
    positions: 'นักบัญชี, นักวิเคราะห์การเงิน, เจ้าหน้าที่การเงิน'
  },
  {
    id: '4',
    name: 'แผนกการตลาด',
    code: 'MKT',
    description: 'วางแผนและดำเนินการด้านการตลาด การประชาสัมพันธ์',
    manager: 'นางสาวสมปอง ดีใจ',
    managerEmail: 'sompong@company.com',
    managerPhone: '084-567-8901',
    location: 'ชั้น 4 อาคาร B',
    employeeCount: 10,
    status: 'active',
    salary: '2,000,000 บาท',
    applicationStartDate: '2024-01-20',
    applicationEndDate: '2024-02-20',
    education: 'ปริญญาตรี สาขาการตลาดหรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'นักการตลาด, นักประชาสัมพันธ์, นักออกแบบสื่อ'
  },
  {
    id: '5',
    name: 'แผนกผลิต',
    code: 'PROD',
    description: 'ดูแลกระบวนการผลิต การควบคุมคุณภาพ และการจัดการคลังสินค้า',
    manager: 'นายสมพร ผลิตดี',
    managerEmail: 'somporn@company.com',
    managerPhone: '085-678-9012',
    location: 'โรงงาน 1',
    employeeCount: 45,
    status: 'active',
    salary: '5,000,000 บาท',
    applicationStartDate: '2024-01-08',
    applicationEndDate: '2024-02-08',
    education: 'ปริญญาตรี สาขาวิศวกรรมศาสตร์หรือสาขาที่เกี่ยวข้อง',
    gender: 'male',
    positions: 'วิศวกรผลิต, เจ้าหน้าที่ควบคุมคุณภาพ, พนักงานผลิต'
  },
  {
    id: '6',
    name: 'แผนกวิจัยและพัฒนา',
    code: 'R&D',
    description: 'วิจัยและพัฒนาผลิตภัณฑ์ใหม่ เทคโนโลยี และนวัตกรรม',
    manager: 'ดร.สมคิด คิดดี',
    managerEmail: 'somkid@company.com',
    managerPhone: '086-789-0123',
    location: 'ชั้น 5 อาคาร A',
    employeeCount: 20,
    status: 'active',
    salary: '3,500,000 บาท',
    applicationStartDate: '2024-01-12',
    applicationEndDate: '2024-02-12',
    education: 'ปริญญาโท สาขาวิทยาศาสตร์หรือเทคโนโลยี',
    gender: 'any',
    positions: 'นักวิจัย, นักพัฒนาผลิตภัณฑ์, นักวิเคราะห์ข้อมูล'
  },
  {
    id: '7',
    name: 'แผนกบริการลูกค้า',
    code: 'CS',
    description: 'ให้บริการลูกค้า การสนับสนุน และการแก้ไขปัญหา',
    manager: 'นางสาวสมศรี บริการดี',
    managerEmail: 'somsri@company.com',
    managerPhone: '087-890-1234',
    location: 'ชั้น 1 อาคาร B',
    employeeCount: 18,
    status: 'active',
    salary: '1,500,000 บาท',
    applicationStartDate: '2024-01-18',
    applicationEndDate: '2024-02-18',
    education: 'ปริญญาตรี สาขาบริการลูกค้าหรือสาขาที่เกี่ยวข้อง',
    gender: 'female',
    positions: 'เจ้าหน้าที่บริการลูกค้า, นักสนับสนุนเทคนิค, ผู้จัดการลูกค้า'
  },
  {
    id: '8',
    name: 'แผนกจัดซื้อจัดจ้าง',
    code: 'PROC',
    description: 'จัดการการจัดซื้อจัดจ้าง การเจรจาต่อรอง และการจัดการซัพพลายเออร์',
    manager: 'นายสมชาติ จัดซื้อดี',
    managerEmail: 'somchat@company.com',
    managerPhone: '088-901-2345',
    location: 'ชั้น 2 อาคาร A',
    employeeCount: 7,
    status: 'active',
    salary: '800,000 บาท',
    applicationStartDate: '2024-01-22',
    applicationEndDate: '2024-02-22',
    education: 'ปริญญาตรี สาขาบริหารธุรกิจหรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'เจ้าหน้าที่จัดซื้อ, นักเจรจาต่อรอง, ผู้จัดการซัพพลายเออร์'
  },
  {
    id: '9',
    name: 'แผนกกฎหมายและธุรการ',
    code: 'LEGAL',
    description: 'ดูแลด้านกฎหมาย เอกสารสัญญา และการปฏิบัติตามกฎระเบียบ',
    manager: 'นางสาวสมใจ กฎหมายดี',
    managerEmail: 'somjai@company.com',
    managerPhone: '089-012-3456',
    location: 'ชั้น 3 อาคาร B',
    employeeCount: 9,
    status: 'active',
    salary: '1,300,000 บาท',
    applicationStartDate: '2024-01-25',
    applicationEndDate: '2024-02-25',
    education: 'ปริญญาตรี สาขานิติศาสตร์หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'นักกฎหมาย, เจ้าหน้าที่ธุรการ, ผู้จัดการเอกสาร'
  }
];

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    code: '',
    description: '',
    manager: '',
    managerEmail: '',
    managerPhone: '',
    location: '',
    employeeCount: 0,
    status: 'active',
    salary: '',
    applicationStartDate: '',
    applicationEndDate: '',
    education: '',
    gender: 'any',
    positions: ''
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentStartMonth, setCurrentStartMonth] = useState(new Date());
  const [currentEndMonth, setCurrentEndMonth] = useState(new Date());
  
  // New department date picker states
  const [showNewStartDatePicker, setShowNewStartDatePicker] = useState(false);
  const [showNewEndDatePicker, setShowNewEndDatePicker] = useState(false);
  const [currentNewStartMonth, setCurrentNewStartMonth] = useState(new Date());
  const [currentNewEndMonth, setCurrentNewEndMonth] = useState(new Date());


  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'danger';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน';
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'ชาย';
      case 'female':
        return 'หญิง';
      case 'any':
        return 'ไม่จำกัดเพศ';
      default:
        return 'ไม่ระบุ';
    }
  };

  const handleViewDetails = (department: Department) => {
    setSelectedDepartment(department);
    onOpen();
  };

  const handleCloseDetails = () => {
    setSelectedDepartment(null);
    onClose();
  };

  const handleDeleteDepartment = (departmentId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบแผนกนี้?')) {
      setDepartments(prev => prev.filter(d => d.id !== departmentId));
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    onEditOpen();
    
    // Initialize date picker months based on current dates
    if (department.applicationStartDate) {
      const startDate = new Date(department.applicationStartDate);
      setCurrentStartMonth(startDate);
    }
    if (department.applicationEndDate) {
      const endDate = new Date(department.applicationEndDate);
      setCurrentEndMonth(endDate);
    }
  };

  const handleSaveEdit = () => {
    if (editingDepartment) {
      setDepartments(prev => 
        prev.map(d => d.id === editingDepartment.id ? editingDepartment : d)
      );
      setEditingDepartment(null);
      onEditClose();
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    onEditClose();
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  // New department functions
  const handleAddNewDepartment = () => {
    setNewDepartment({
      name: '',
      code: '',
      description: '',
      manager: '',
      managerEmail: '',
      managerPhone: '',
      location: '',
      employeeCount: 0,
      status: 'active',
      salary: '',
      applicationStartDate: '',
      applicationEndDate: '',
      education: '',
      gender: 'any',
      positions: ''
    });
    setCurrentNewStartMonth(new Date());
    setCurrentNewEndMonth(new Date());
    onAddOpen();
  };

  const handleSaveNewDepartment = () => {
    if (newDepartment.name && newDepartment.code) {
      const newDept: Department = {
        id: (departments.length + 1).toString(),
        name: newDepartment.name || '',
        code: newDepartment.code || '',
        description: newDepartment.description || '',
        manager: newDepartment.manager || '',
        managerEmail: newDepartment.managerEmail || '',
        managerPhone: newDepartment.managerPhone || '',
        location: newDepartment.location || '',
        employeeCount: newDepartment.employeeCount || 0,
        status: newDepartment.status || 'active',
        salary: newDepartment.salary || '',
        applicationStartDate: newDepartment.applicationStartDate || '',
        applicationEndDate: newDepartment.applicationEndDate || '',
        education: newDepartment.education || '',
        gender: newDepartment.gender || 'any',
        positions: newDepartment.positions || ''
      };
      
      setDepartments(prev => [...prev, newDept]);
      setNewDepartment({
        name: '',
        code: '',
        description: '',
        manager: '',
        managerEmail: '',
        managerPhone: '',
        location: '',
        employeeCount: 0,
        status: 'active',
        salary: '',
        applicationStartDate: '',
        applicationEndDate: '',
        education: '',
        gender: 'any',
        positions: ''
      });
      onAddClose();
      setShowNewStartDatePicker(false);
      setShowNewEndDatePicker(false);
    }
  };

  const handleCancelNewDepartment = () => {
    setNewDepartment({
      name: '',
      code: '',
      description: '',
      manager: '',
      managerEmail: '',
      managerPhone: '',
      location: '',
      employeeCount: 0,
      status: 'active',
      salary: '',
      applicationStartDate: '',
      applicationEndDate: '',
      education: '',
      gender: 'any',
      positions: ''
    });
    onAddClose();
    setShowNewStartDatePicker(false);
    setShowNewEndDatePicker(false);
  };

  const pages = Math.ceil(departments.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return departments.slice(start, end);
  }, [page, departments, rowsPerPage]);

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const thaiYear = date.getFullYear() + 543;
      const thaiMonth = date.toLocaleDateString('th-TH', { month: 'long' });
      const thaiDay = date.getDate();
      
      return `${thaiDay} ${thaiMonth} ${thaiYear}`;
    } catch (error) {
      return dateString;
    }
  };

  // Date picker helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date, isStartDate: boolean) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;
    
    if (isStartDate) {
      setEditingDepartment(prev => prev ? { ...prev, applicationStartDate: isoDate } : null);
      setShowStartDatePicker(false);
    } else {
      setEditingDepartment(prev => prev ? { ...prev, applicationEndDate: isoDate } : null);
      setShowEndDatePicker(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next', isStartDate: boolean) => {
    if (isStartDate) {
      setCurrentStartMonth(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    } else {
      setCurrentEndMonth(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  // Helper functions for month and year selection
  const getThaiMonths = () => [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const getYearsArray = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleMonthChange = (monthIndex: number, isStartDate: boolean) => {
    if (isStartDate) {
      setCurrentStartMonth(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(monthIndex);
        return newDate;
      });
    } else {
      setCurrentEndMonth(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(monthIndex);
        return newDate;
      });
    }
  };

  const handleYearChange = (year: number, isStartDate: boolean) => {
    if (isStartDate) {
      setCurrentStartMonth(prev => {
        const newDate = new Date(prev);
        newDate.setFullYear(year);
        return newDate;
      });
    } else {
      setCurrentEndMonth(prev => {
        const newDate = new Date(prev);
        newDate.setFullYear(year);
        return newDate;
      });
    }
  };

  // New department date picker functions
  const handleNewDateSelect = (date: Date, isStartDate: boolean) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;
    
    if (isStartDate) {
      setNewDepartment(prev => ({ ...prev, applicationStartDate: isoDate }));
      setShowNewStartDatePicker(false);
    } else {
      setNewDepartment(prev => ({ ...prev, applicationEndDate: isoDate }));
      setShowNewEndDatePicker(false);
    }
  };

  const navigateNewMonth = (direction: 'prev' | 'next', isStartDate: boolean) => {
    if (isStartDate) {
      setCurrentNewStartMonth(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    } else {
      setCurrentNewEndMonth(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  const handleNewMonthChange = (monthIndex: number, isStartDate: boolean) => {
    if (isStartDate) {
      setCurrentNewStartMonth(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(monthIndex);
        return newDate;
      });
    } else {
      setCurrentNewEndMonth(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(monthIndex);
        return newDate;
      });
    }
  };

  const handleNewYearChange = (year: number, isStartDate: boolean) => {
    if (isStartDate) {
      setCurrentNewStartMonth(prev => {
        const newDate = new Date(prev);
        newDate.setFullYear(year);
        return newDate;
      });
    } else {
      setCurrentNewEndMonth(prev => {
        const newDate = new Date(prev);
        newDate.setFullYear(year);
        return newDate;
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-gray-600">กำลังโหลดข้อมูลแผนก...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <BuildingOfficeIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  แผนกต่างๆ
                </h1>
                <p className="text-gray-600">จัดการและดูข้อมูลแผนกทั้งหมดในองค์กร</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                color="success"
                variant="ghost"
                startContent={<PlusIcon className="w-5 h-5" />}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                onClick={handleAddNewDepartment}
              >
                เพิ่มแผนกใหม่
              </Button>
              <Button
                color="primary"
                variant="ghost"
                startContent={<ArrowLeftIcon className="w-5 h-5" />}
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              >
                กลับไปหน้า Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">แผนกทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">แผนกที่เปิดใช้งาน</p>
                  <p className="text-2xl font-bold text-green-600">
                    {departments.filter(d => d.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">พนักงานทั้งหมด</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {departments.reduce((sum, d) => sum + d.employeeCount, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Departments Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">รายการแผนกทั้งหมด</h2>
                <p className="text-sm text-gray-600">แสดงข้อมูลแผนกทั้งหมดในระบบ</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <Table 
              aria-label="Departments table"
              selectionMode="none"
              classNames={{
                wrapper: "min-h-[400px]",
              }}
            >
              <TableHeader>
                <TableColumn>รหัสแผนก</TableColumn>
                <TableColumn>ชื่อแผนก</TableColumn>
                <TableColumn>ตำแหน่งที่เปิดรับสมัคร</TableColumn>
                <TableColumn>จำนวนพนักงาน</TableColumn>
                <TableColumn>หัวหน้าแผนก</TableColumn>
                <TableColumn>สถานะ</TableColumn>
                <TableColumn>การดำเนินการ</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"ไม่พบข้อมูลแผนก"}>
                {items.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <Chip color="primary" variant="flat" size="sm">
                        {department.code}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-800">{department.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {department.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-800">{department.positions}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-800">{department.employeeCount}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-800">{department.manager}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <EnvelopeIcon className="w-3 h-3" />
                          <span className="truncate max-w-32">{department.managerEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(department.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(department.status)}
                      </Chip>
                    </TableCell>
                                         <TableCell>
                       <div className="flex gap-2">
                         <Button
                           isIconOnly
                           size="sm"
                           variant="ghost"
                           color="primary"
                           className="bg-blue-100 text-blue-600 hover:bg-blue-200"
                           onClick={() => handleViewDetails(department)}
                         >
                           <EyeIcon className="w-4 h-4" />
                         </Button>
                                                   <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            color="warning"
                            className="bg-orange-100 text-orange-600 hover:bg-orange-200"
                            onClick={() => handleEditDepartment(department)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                         <Button
                           isIconOnly
                           size="sm"
                           variant="ghost"
                           color="danger"
                           className="bg-red-100 text-red-600 hover:bg-red-200"
                           onClick={() => handleDeleteDepartment(department.id)}
                         >
                           <TrashIcon className="w-4 h-4" />
                         </Button>
                       </div>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="py-2 px-2 flex justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          </CardBody>
        </Card>

        {/* Department Detail Modal */}
        {isOpen && selectedDepartment && (
          <Modal 
            isOpen={isOpen} 
            onClose={handleCloseDetails} 
            size="4xl"
            classNames={{
              backdrop: "bg-white/80 backdrop-blur-sm",
              base: "bg-white shadow-2xl max-h-[90vh]",
              header: "bg-white",
              body: "bg-white overflow-y-auto max-h-[60vh]",
              footer: "bg-white"
            }}
            placement="center"
            scrollBehavior="inside"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedDepartment.name}</h2>
                    <p className="text-sm text-gray-600">รหัส: {selectedDepartment.code}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">รหัสแผนก</label>
                        <p className="text-gray-800">{selectedDepartment.code}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อแผนก</label>
                        <p className="text-gray-800">{selectedDepartment.name}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                        <p className="text-gray-800">{selectedDepartment.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อหัวหน้าแผนก</label>
                        <p className="text-gray-800">{selectedDepartment.manager}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">อีเมลหัวหน้าแผนก</label>
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-800">{selectedDepartment.managerEmail}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์หัวหน้าแผนก</label>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-800">{selectedDepartment.managerPhone}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">จำนวนพนักงาน</label>
                        <p className="text-gray-800">{selectedDepartment.employeeCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">อัตราค่าจ้าง</label>
                      <p className="text-gray-800">{selectedDepartment.salary}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถานะ</label>
                      <Chip
                        color={getStatusColor(selectedDepartment.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(selectedDepartment.status)}
                      </Chip>
                    </div>
                  </div>

                  {/* Application Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่เปิดรับสมัคร</label>
                      <p className="text-gray-800">{formatDate(selectedDepartment.applicationStartDate)}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดการรับสมัคร</label>
                      <p className="text-gray-800">{formatDate(selectedDepartment.applicationEndDate)}</p>
                    </div>
                  </div>

                  {/* Education and Gender Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วุฒิการศึกษา</label>
                      <p className="text-gray-800">{selectedDepartment.education}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เพศที่ต้องการ</label>
                      <p className="text-gray-800">{getGenderText(selectedDepartment.gender)}</p>
                    </div>
                  </div>

                  {/* Positions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่งที่เปิดรับสมัคร</label>
                      <p className="text-gray-800">{selectedDepartment.positions}</p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseDetails}>
                  ปิด
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
                 )}

        {/* Edit Department Modal */}
        {isEditOpen && editingDepartment && (
          <Modal 
            isOpen={isEditOpen} 
            onClose={handleCancelEdit} 
            size="4xl"
            classNames={{
              backdrop: "bg-white/80 backdrop-blur-sm",
              base: "bg-white shadow-2xl max-h-[90vh]",
              header: "bg-white",
              body: "bg-white overflow-y-auto max-h-[60vh]",
              footer: "bg-white"
            }}
            placement="center"
            scrollBehavior="inside"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg">
                    <PencilIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">แก้ไขข้อมูลแผนก</h2>
                    <p className="text-sm text-gray-600">{editingDepartment.name}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">รหัสแผนก</label>
                        <input
                          type="text"
                          placeholder="เช่น IT, HR, FIN"
                          value={editingDepartment.code}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, code: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อแผนก</label>
                        <input
                          type="text"
                          placeholder="ชื่อแผนก"
                          value={editingDepartment.name}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                                             <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                         <textarea
                           placeholder="คำอธิบายแผนก"
                           value={editingDepartment.description}
                           onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, description: e.target.value } : null)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                           rows={3}
                         />
                       </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อหัวหน้าแผนก</label>
                        <input
                          type="text"
                          placeholder="ชื่อหัวหน้าแผนก"
                          value={editingDepartment.manager}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, manager: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">อีเมลหัวหน้าแผนก</label>
                        <input
                          type="email"
                          placeholder="manager@company.com"
                          value={editingDepartment.managerEmail}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, managerEmail: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์หัวหน้าแผนก</label>
                        <input
                          type="text"
                          placeholder="081-234-5678"
                          value={editingDepartment.managerPhone}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, managerPhone: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">จำนวนพนักงาน</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingDepartment.employeeCount.toString()}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, employeeCount: parseInt(e.target.value) || 0 } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">อัตราค่าจ้าง</label>
                      <input
                        type="text"
                        placeholder="เช่น 2,500,000 บาท"
                        value={editingDepartment.salary}
                        onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, salary: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถานะ</label>
                      <select
                        value={editingDepartment.status}
                        onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">เปิดใช้งาน</option>
                        <option value="inactive">ปิดใช้งาน</option>
                      </select>
                    </div>
                  </div>

                                                       {/* Application Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">วันที่เปิดรับสมัคร</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="วัน เดือน ปี ไทย (เช่น 15 มกราคม 2567)"
                            value={formatDate(editingDepartment.applicationStartDate)}
                            onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          />
                          {showStartDatePicker && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80">
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <button
                                    onClick={() => navigateMonth('prev', true)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    ←
                                  </button>
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={currentStartMonth.getMonth()}
                                      onChange={(e) => handleMonthChange(parseInt(e.target.value), true)}
                                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                      {getThaiMonths().map((month, index) => (
                                        <option key={index} value={index}>
                                          {month}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      value={currentStartMonth.getFullYear()}
                                      onChange={(e) => handleYearChange(parseInt(e.target.value), true)}
                                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                      {getYearsArray().map(year => (
                                        <option key={year} value={year}>
                                          {year + 543}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <button
                                    onClick={() => navigateMonth('next', true)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    →
                                  </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                  {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                      {day}
                                    </div>
                                  ))}
                                  {getDaysInMonth(currentStartMonth).map((day, index) => (
                                    <div key={index} className="text-center p-2">
                                      {day ? (
                                        <button
                                          onClick={() => handleDateSelect(day, true)}
                                          className={`w-8 h-8 rounded-full hover:bg-blue-100 ${
                                            day.toDateString() === new Date(editingDepartment.applicationStartDate).toDateString()
                                              ? 'bg-blue-500 text-white'
                                              : 'text-gray-700'
                                          }`}
                                        >
                                          {day.getDate()}
                                        </button>
                                      ) : (
                                        <div className="w-8 h-8"></div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดการรับสมัคร</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="วัน เดือน ปี ไทย (เช่น 15 กุมภาพันธ์ 2567)"
                            value={formatDate(editingDepartment.applicationEndDate)}
                            onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                          />
                          {showEndDatePicker && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80">
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <button
                                    onClick={() => navigateMonth('prev', false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    ←
                                  </button>
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={currentEndMonth.getMonth()}
                                      onChange={(e) => handleMonthChange(parseInt(e.target.value), false)}
                                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                      {getThaiMonths().map((month, index) => (
                                        <option key={index} value={index}>
                                          {month}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      value={currentEndMonth.getFullYear()}
                                      onChange={(e) => handleYearChange(parseInt(e.target.value), false)}
                                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                      {getYearsArray().map(year => (
                                        <option key={year} value={year}>
                                          {year + 543}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <button
                                    onClick={() => navigateMonth('next', false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    →
                                  </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                  {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                      {day}
                                    </div>
                                  ))}
                                  {getDaysInMonth(currentEndMonth).map((day, index) => (
                                    <div key={index} className="text-center p-2">
                                      {day ? (
                                        <button
                                          onClick={() => handleDateSelect(day, false)}
                                          className={`w-8 h-8 rounded-full hover:bg-blue-100 ${
                                            day.toDateString() === new Date(editingDepartment.applicationEndDate).toDateString()
                                              ? 'bg-blue-500 text-white'
                                              : 'text-gray-700'
                                          }`}
                                        >
                                          {day.getDate()}
                                        </button>
                                      ) : (
                                        <div className="w-8 h-8"></div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                  </div>

                  {/* Education and Gender Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วุฒิการศึกษา</label>
                      <textarea
                        placeholder="เช่น ปริญญาตรี สาขาคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง"
                        value={editingDepartment.education}
                        onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, education: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เพศที่ต้องการ</label>
                      <select
                        value={editingDepartment.gender}
                        onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, gender: e.target.value as 'male' | 'female' | 'any' } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="any">ไม่จำกัดเพศ</option>
                      </select>
                    </div>
                  </div>

                  {/* Positions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่งที่เปิดรับสมัคร</label>
                      <textarea
                        placeholder="เช่น โปรแกรมเมอร์, นักวิเคราะห์ระบบ, ผู้ดูแลระบบ"
                        value={editingDepartment.positions}
                        onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, positions: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>

                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCancelEdit}>
                  ยกเลิก
                </Button>
                <Button color="primary" onPress={handleSaveEdit}>
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Add New Department Modal */}
        {isAddOpen && (
          <Modal 
            isOpen={isAddOpen} 
            onClose={handleCancelNewDepartment} 
            size="4xl"
            classNames={{
              backdrop: "bg-white/80 backdrop-blur-sm",
              base: "bg-white shadow-2xl max-h-[90vh]",
              header: "bg-white",
              body: "bg-white overflow-y-auto max-h-[60vh]",
              footer: "bg-white"
            }}
            placement="center"
            scrollBehavior="inside"
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">เพิ่มแผนกใหม่</h2>
                    <p className="text-sm text-gray-600">กรอกข้อมูลแผนกใหม่</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">รหัสแผนก *</label>
                        <input
                          type="text"
                          placeholder="เช่น IT, HR, FIN"
                          value={newDepartment.code}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, code: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อแผนก *</label>
                        <input
                          type="text"
                          placeholder="ชื่อแผนก"
                          value={newDepartment.name}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                        <textarea
                          placeholder="คำอธิบายแผนก"
                          value={newDepartment.description}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อหัวหน้าแผนก</label>
                        <input
                          type="text"
                          placeholder="ชื่อหัวหน้าแผนก"
                          value={newDepartment.manager}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, manager: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">อีเมลหัวหน้าแผนก</label>
                        <input
                          type="email"
                          placeholder="manager@company.com"
                          value={newDepartment.managerEmail}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, managerEmail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์หัวหน้าแผนก</label>
                        <input
                          type="text"
                          placeholder="081-234-5678"
                          value={newDepartment.managerPhone}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, managerPhone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">จำนวนพนักงาน</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newDepartment.employeeCount?.toString() || '0'}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">อัตราค่าจ้าง</label>
                      <input
                        type="text"
                        placeholder="เช่น 2,500,000 บาท"
                        value={newDepartment.salary}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, salary: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถานะ</label>
                      <select
                        value={newDepartment.status}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">เปิดใช้งาน</option>
                        <option value="inactive">ปิดใช้งาน</option>
                      </select>
                    </div>
                  </div>

                  {/* Application Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่เปิดรับสมัคร</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="วัน เดือน ปี ไทย (เช่น 15 มกราคม 2567)"
                          value={newDepartment.applicationStartDate ? formatDate(newDepartment.applicationStartDate) : ''}
                          onClick={() => setShowNewStartDatePicker(!showNewStartDatePicker)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        />
                        {showNewStartDatePicker && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  onClick={() => navigateNewMonth('prev', true)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  ←
                                </button>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={currentNewStartMonth.getMonth()}
                                    onChange={(e) => handleNewMonthChange(parseInt(e.target.value), true)}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {getThaiMonths().map((month, index) => (
                                      <option key={index} value={index}>
                                        {month}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={currentNewStartMonth.getFullYear()}
                                    onChange={(e) => handleNewYearChange(parseInt(e.target.value), true)}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {getYearsArray().map(year => (
                                      <option key={year} value={year}>
                                        {year + 543}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  onClick={() => navigateNewMonth('next', true)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  →
                                </button>
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                    {day}
                                  </div>
                                ))}
                                {getDaysInMonth(currentNewStartMonth).map((day, index) => (
                                  <div key={index} className="text-center p-2">
                                    {day ? (
                                      <button
                                        onClick={() => handleNewDateSelect(day, true)}
                                        className={`w-8 h-8 rounded-full hover:bg-blue-100 ${
                                          day.toDateString() === new Date(newDepartment.applicationStartDate || '').toDateString()
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700'
                                        }`}
                                      >
                                        {day.getDate()}
                                      </button>
                                    ) : (
                                      <div className="w-8 h-8"></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดการรับสมัคร</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="วัน เดือน ปี ไทย (เช่น 15 กุมภาพันธ์ 2567)"
                          value={newDepartment.applicationEndDate ? formatDate(newDepartment.applicationEndDate) : ''}
                          onClick={() => setShowNewEndDatePicker(!showNewEndDatePicker)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        />
                        {showNewEndDatePicker && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-80">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  onClick={() => navigateNewMonth('prev', false)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  ←
                                </button>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={currentNewEndMonth.getMonth()}
                                    onChange={(e) => handleNewMonthChange(parseInt(e.target.value), false)}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {getThaiMonths().map((month, index) => (
                                      <option key={index} value={index}>
                                        {month}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={currentNewEndMonth.getFullYear()}
                                    onChange={(e) => handleNewYearChange(parseInt(e.target.value), false)}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    {getYearsArray().map(year => (
                                      <option key={year} value={year}>
                                        {year + 543}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  onClick={() => navigateNewMonth('next', false)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  →
                                </button>
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                                    {day}
                                  </div>
                                ))}
                                {getDaysInMonth(currentNewEndMonth).map((day, index) => (
                                  <div key={index} className="text-center p-2">
                                    {day ? (
                                      <button
                                        onClick={() => handleNewDateSelect(day, false)}
                                        className={`w-8 h-8 rounded-full hover:bg-blue-100 ${
                                          day.toDateString() === new Date(newDepartment.applicationEndDate || '').toDateString()
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700'
                                        }`}
                                      >
                                        {day.getDate()}
                                      </button>
                                    ) : (
                                      <div className="w-8 h-8"></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Education and Gender Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วุฒิการศึกษา</label>
                      <textarea
                        placeholder="เช่น ปริญญาตรี สาขาคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง"
                        value={newDepartment.education}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, education: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เพศที่ต้องการ</label>
                      <select
                        value={newDepartment.gender}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'any' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="any">ไม่จำกัดเพศ</option>
                      </select>
                    </div>
                  </div>

                  {/* Positions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่งที่เปิดรับสมัคร</label>
                      <textarea
                        placeholder="เช่น โปรแกรมเมอร์, นักวิเคราะห์ระบบ, ผู้ดูแลระบบ"
                        value={newDepartment.positions}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, positions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCancelNewDepartment}>
                  ยกเลิก
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSaveNewDepartment}
                  isDisabled={!newDepartment.name || !newDepartment.code}
                >
                  เพิ่มแผนกใหม่
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
       </div>
     </div>
   );
 } 