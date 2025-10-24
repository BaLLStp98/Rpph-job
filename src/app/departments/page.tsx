'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ModalFooter
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
  TrashIcon,
  DocumentTextIcon
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
  createdAt?: string;
  updatedAt?: string;
  missionGroupId?: string | null;
  missionGroupName?: string | null;
  // แนบไฟล์ของฝ่าย (ออปชัน) ใช้โครงสร้างให้สอดคล้องกับ API departments attachments
  attachments?: { id?: number; fileName: string; filePath: string; originalName?: string; fileSize?: number; createdAt?: string }[];
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'ฝ่ายอายุรกรรม',
    code: 'MED',
    description: 'ให้บริการรักษาผู้ป่วยโรคภายใน ตรวจวินิจฉัย และให้คำปรึกษาทางการแพทย์',
    manager: 'นพ.สมชาย ใจดี',
    managerEmail: 'somchai.med@hospital.com',
    managerPhone: '081-234-5678',
    location: 'ชั้น 2 อาคารผู้ป่วยนอก',
    employeeCount: 25,
    status: 'active',
    salary: '3,500,000 บาท',
    applicationStartDate: '2024-01-15',
    applicationEndDate: '2024-02-15',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือปริญญาตรี สาขาพยาบาลศาสตร์',
    gender: 'any',
    positions: 'แพทย์ผู้เชี่ยวชาญ, พยาบาลวิชาชีพ, เจ้าหน้าที่เทคนิคการแพทย์'
  },
  {
    id: '2',
    name: 'ฝ่ายศัลยกรรม',
    code: 'SURG',
    description: 'ให้บริการผ่าตัดรักษาโรคต่างๆ และการดูแลผู้ป่วยหลังผ่าตัด',
    manager: 'นพ.สมหญิง รักดี',
    managerEmail: 'somying.surg@hospital.com',
    managerPhone: '082-345-6789',
    location: 'ชั้น 3 อาคารผ่าตัด',
    employeeCount: 30,
    status: 'active',
    salary: '4,000,000 บาท',
    applicationStartDate: '2024-01-10',
    applicationEndDate: '2024-02-10',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือปริญญาตรี สาขาพยาบาลศาสตร์',
    gender: 'any',
    positions: 'ศัลยแพทย์, พยาบาลผ่าตัด, เจ้าหน้าที่ห้องผ่าตัด'
  },
  {
    id: '3',
    name: 'ฝ่ายกุมารเวชกรรม',
    code: 'PED',
    description: 'ให้บริการรักษาและดูแลสุขภาพเด็กตั้งแต่แรกเกิดจนถึงวัยรุ่น',
    manager: 'นพ.สมศักดิ์ ใจงาม',
    managerEmail: 'somsak.ped@hospital.com',
    managerPhone: '083-456-7890',
    location: 'ชั้น 1 อาคารกุมารเวชกรรม',
    employeeCount: 20,
    status: 'active',
    salary: '3,200,000 บาท',
    applicationStartDate: '2024-01-20',
    applicationEndDate: '2024-02-20',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือปริญญาตรี สาขาพยาบาลศาสตร์',
    gender: 'any',
    positions: 'กุมารแพทย์, พยาบาลกุมารเวช, เจ้าหน้าที่ดูแลเด็ก'
  },
  {
    id: '4',
    name: 'ฝ่ายสูติ-นรีเวชกรรม',
    code: 'OBGYN',
    description: 'ให้บริการดูแลสุขภาพสตรี ตั้งครรภ์ และการคลอดบุตร',
    manager: 'นพ.สมพร ใจดี',
    managerEmail: 'somporn.obgyn@hospital.com',
    managerPhone: '084-567-8901',
    location: 'ชั้น 2 อาคารสูติกรรม',
    employeeCount: 18,
    status: 'active',
    salary: '3,800,000 บาท',
    applicationStartDate: '2024-01-25',
    applicationEndDate: '2024-02-25',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือปริญญาตรี สาขาพยาบาลศาสตร์',
    gender: 'female',
    positions: 'สูติ-นรีแพทย์, พยาบาลสูติกรรม, เจ้าหน้าที่ห้องคลอด'
  },
  {
    id: '5',
    name: 'ฝ่ายวิสัญญีวิทยา',
    code: 'ANES',
    description: 'ให้บริการการวางยาสลบและการดูแลผู้ป่วยระหว่างการผ่าตัด',
    manager: 'นพ.สมหมาย ใจดี',
    managerEmail: 'sommai.anes@hospital.com',
    managerPhone: '085-678-9012',
    location: 'ชั้น 3 อาคารผ่าตัด',
    employeeCount: 12,
    status: 'active',
    salary: '4,500,000 บาท',
    applicationStartDate: '2024-02-01',
    applicationEndDate: '2024-03-01',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือปริญญาตรี สาขาพยาบาลศาสตร์',
    gender: 'any',
    positions: 'วิสัญญีแพทย์, พยาบาลวิสัญญี, เจ้าหน้าที่วิสัญญี'
  },
  {
    id: '6',
    name: 'ฝ่ายรังสีวิทยา',
    code: 'RAD',
    description: 'ให้บริการตรวจวินิจฉัยด้วยรังสี X-ray, CT, MRI และการรักษาด้วยรังสี',
    manager: 'นพ.สมศักดิ์ ใจงาม',
    managerEmail: 'somsak.rad@hospital.com',
    managerPhone: '086-789-0123',
    location: 'ชั้น 1 อาคารรังสีวิทยา',
    employeeCount: 15,
    status: 'active',
    salary: '3,000,000 บาท',
    applicationStartDate: '2024-02-05',
    applicationEndDate: '2024-03-05',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือปริญญาตรี สาขาเทคนิคการแพทย์',
    gender: 'any',
    positions: 'รังสีแพทย์, เทคนิคการแพทย์รังสี, เจ้าหน้าที่รังสี'
  },
  {
    id: '7',
    name: 'ฝ่ายห้องปฏิบัติการ',
    code: 'LAB',
    description: 'ให้บริการตรวจวิเคราะห์ตัวอย่างเลือด ปัสสาวะ และตัวอย่างอื่นๆ',
    manager: 'นพ.สมพร ใจดี',
    managerEmail: 'somporn.lab@hospital.com',
    managerPhone: '087-890-1234',
    location: 'ชั้น 1 อาคารห้องปฏิบัติการ',
    employeeCount: 22,
    status: 'active',
    salary: '2,800,000 บาท',
    applicationStartDate: '2024-02-10',
    applicationEndDate: '2024-03-10',
    education: 'ปริญญาตรี สาขาเทคนิคการแพทย์ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'เทคนิคการแพทย์, เจ้าหน้าที่ห้องปฏิบัติการ, นักวิทยาศาสตร์'
  },
  {
    id: '8',
    name: 'ฝ่ายเภสัชกรรม',
    code: 'PHARM',
    description: 'ให้บริการจัดยา ให้คำปรึกษาการใช้ยา และการตรวจสอบยาคุณภาพ',
    manager: 'ภก.สมชาย ใจดี',
    managerEmail: 'somchai.pharm@hospital.com',
    managerPhone: '088-901-2345',
    location: 'ชั้น 1 อาคารเภสัชกรรม',
    employeeCount: 16,
    status: 'active',
    salary: '2,500,000 บาท',
    applicationStartDate: '2024-02-15',
    applicationEndDate: '2024-03-15',
    education: 'ปริญญาตรี สาขาเภสัชศาสตร์ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'เภสัชกร, เจ้าหน้าที่เภสัชกรรม, เจ้าหน้าที่จัดยา'
  },
  {
    id: '9',
    name: 'ฝ่ายพยาบาล',
    code: 'NURSE',
    description: 'ให้บริการดูแลผู้ป่วย ให้การพยาบาล และประสานงานกับทีมแพทย์',
    manager: 'นางสาวสมหญิง รักดี',
    managerEmail: 'somying.nurse@hospital.com',
    managerPhone: '089-012-3456',
    location: 'ทุกชั้นอาคารผู้ป่วย',
    employeeCount: 80,
    status: 'active',
    salary: '1,800,000 บาท',
    applicationStartDate: '2024-02-20',
    applicationEndDate: '2024-03-20',
    education: 'ปริญญาตรี สาขาพยาบาลศาสตร์ หรือประกาศนียบัตรพยาบาล',
    gender: 'any',
    positions: 'พยาบาลวิชาชีพ, พยาบาลผู้ช่วย, เจ้าหน้าที่พยาบาล'
  },
  {
    id: '10',
    name: 'ฝ่ายบริหาร',
    code: 'ADMIN',
    description: 'จัดการงานบริหาร งบประมาณ และการประสานงานระหว่างฝ่ายต่างๆ',
    manager: 'นางสมพร ใจดี',
    managerEmail: 'somporn.admin@hospital.com',
    managerPhone: '090-123-4567',
    location: 'ชั้น 4 อาคารบริหาร',
    employeeCount: 12,
    status: 'active',
    salary: '2,200,000 บาท',
    applicationStartDate: '2024-02-25',
    applicationEndDate: '2024-03-25',
    education: 'ปริญญาตรี สาขาบริหารธุรกิจ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'เจ้าหน้าที่บริหาร, เจ้าหน้าที่งบประมาณ, เจ้าหน้าที่ประสานงาน'
  },
  {
    id: '11',
    name: 'ฝ่ายเทคโนโลยีสารสนเทศ',
    code: 'IT',
    description: 'ดูแลระบบเทคโนโลยีสารสนเทศและการพัฒนาซอฟต์แวร์ของโรงพยาบาล',
    manager: 'นายสมชาย ใจดี',
    managerEmail: 'somchai.it@hospital.com',
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
    id: '12',
    name: 'ฝ่ายทรัพยากรบุคคล',
    code: 'HR',
    description: 'จัดการทรัพยากรบุคคล การสรรหา และการพัฒนาพนักงานของโรงพยาบาล',
    manager: 'นางสาวสมหญิง รักดี',
    managerEmail: 'somying.hr@hospital.com',
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
    id: '13',
    name: 'ฝ่ายการเงินและบัญชี',
    code: 'FIN',
    description: 'จัดการด้านการเงิน การบัญชี และการวางแผนงบประมาณของโรงพยาบาล',
    manager: 'นางสมศักดิ์ เงินดี',
    managerEmail: 'somsak.fin@hospital.com',
    managerPhone: '091-234-5678',
    location: 'ชั้น 4 อาคารบริหาร',
    employeeCount: 10,
    status: 'active',
    salary: '2,000,000 บาท',
    applicationStartDate: '2024-03-01',
    applicationEndDate: '2024-04-01',
    education: 'ปริญญาตรี สาขาบัญชี หรือสาขาการเงิน',
    gender: 'any',
    positions: 'นักบัญชี, เจ้าหน้าที่การเงิน, เจ้าหน้าที่งบประมาณ'
  },
  {
    id: '14',
    name: 'ฝ่ายโภชนาการ',
    code: 'NUTRI',
    description: 'ให้บริการอาหารและโภชนาการสำหรับผู้ป่วย และให้คำปรึกษาด้านโภชนาการ',
    manager: 'นางสาวสมพร ใจดี',
    managerEmail: 'somporn.nutri@hospital.com',
    managerPhone: '092-345-6789',
    location: 'ชั้น 1 อาคารโภชนาการ',
    employeeCount: 14,
    status: 'active',
    salary: '1,800,000 บาท',
    applicationStartDate: '2024-03-05',
    applicationEndDate: '2024-04-05',
    education: 'ปริญญาตรี สาขาโภชนาการ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'นักโภชนาการ, เจ้าหน้าที่โภชนาการ, พ่อครัว-แม่ครัว'
  },
  {
    id: '15',
    name: 'ฝ่ายกายภาพบำบัด',
    code: 'PT',
    description: 'ให้บริการกายภาพบำบัด การฟื้นฟูสมรรถภาพ และการออกกำลังกายบำบัด',
    manager: 'นพ.สมชาย ใจดี',
    managerEmail: 'somchai.pt@hospital.com',
    managerPhone: '093-456-7890',
    location: 'ชั้น 1 อาคารกายภาพบำบัด',
    employeeCount: 12,
    status: 'active',
    salary: '2,200,000 บาท',
    applicationStartDate: '2024-03-10',
    applicationEndDate: '2024-04-10',
    education: 'ปริญญาตรี สาขากายภาพบำบัด หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'นักกายภาพบำบัด, เจ้าหน้าที่กายภาพบำบัด, ผู้ช่วยกายภาพบำบัด'
  },
  {
    id: '16',
    name: 'ฝ่ายจิตเวช',
    code: 'PSYCH',
    description: 'ให้บริการรักษาและดูแลผู้ป่วยทางจิตเวช และให้คำปรึกษาด้านสุขภาพจิต',
    manager: 'นพ.สมหญิง รักดี',
    managerEmail: 'somying.psych@hospital.com',
    managerPhone: '094-567-8901',
    location: 'ชั้น 2 อาคารจิตเวช',
    employeeCount: 16,
    status: 'active',
    salary: '3,000,000 บาท',
    applicationStartDate: '2024-03-15',
    applicationEndDate: '2024-04-15',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือสาขาจิตวิทยา',
    gender: 'any',
    positions: 'จิตแพทย์, นักจิตวิทยา, เจ้าหน้าที่จิตเวช'
  },
  {
    id: '17',
    name: 'ฝ่ายทันตกรรม',
    code: 'DENT',
    description: 'ให้บริการรักษาและดูแลสุขภาพช่องปากและฟัน',
    manager: 'ทพ.สมศักดิ์ ใจงาม',
    managerEmail: 'somsak.dent@hospital.com',
    managerPhone: '095-678-9012',
    location: 'ชั้น 1 อาคารทันตกรรม',
    employeeCount: 8,
    status: 'active',
    salary: '2,800,000 บาท',
    applicationStartDate: '2024-03-20',
    applicationEndDate: '2024-04-20',
    education: 'ปริญญาตรี สาขาทันตแพทยศาสตร์ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'ทันตแพทย์, ผู้ช่วยทันตแพทย์, เจ้าหน้าที่ทันตกรรม'
  },
  {
    id: '18',
    name: 'ฝ่ายจักษุวิทยา',
    code: 'EYE',
    description: 'ให้บริการรักษาและดูแลสุขภาพตา และการผ่าตัดตา',
    manager: 'นพ.สมพร ใจดี',
    managerEmail: 'somporn.eye@hospital.com',
    managerPhone: '096-789-0123',
    location: 'ชั้น 2 อาคารจักษุวิทยา',
    employeeCount: 6,
    status: 'active',
    salary: '3,500,000 บาท',
    applicationStartDate: '2024-03-25',
    applicationEndDate: '2024-04-25',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'จักษุแพทย์, ผู้ช่วยจักษุแพทย์, เจ้าหน้าที่จักษุ'
  },
  {
    id: '19',
    name: 'ฝ่ายหู คอ จมูก',
    code: 'ENT',
    description: 'ให้บริการรักษาและดูแลโรคหู คอ จมูก และการผ่าตัด',
    manager: 'นพ.สมหมาย ใจดี',
    managerEmail: 'sommai.ent@hospital.com',
    managerPhone: '097-890-1234',
    location: 'ชั้น 2 อาคารหู คอ จมูก',
    employeeCount: 8,
    status: 'active',
    salary: '3,200,000 บาท',
    applicationStartDate: '2024-04-01',
    applicationEndDate: '2024-05-01',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'แพทย์หู คอ จมูก, ผู้ช่วยแพทย์, เจ้าหน้าที่หู คอ จมูก'
  },
  {
    id: '20',
    name: 'ฝ่ายศัลยกรรมกระดูก',
    code: 'ORTHO',
    description: 'ให้บริการรักษาและผ่าตัดโรคกระดูก ข้อต่อ และกล้ามเนื้อ',
    manager: 'นพ.สมศักดิ์ ใจงาม',
    managerEmail: 'somsak.ortho@hospital.com',
    managerPhone: '098-901-2345',
    location: 'ชั้น 3 อาคารศัลยกรรม',
    employeeCount: 10,
    status: 'active',
    salary: '4,200,000 บาท',
    applicationStartDate: '2024-04-05',
    applicationEndDate: '2024-05-05',
    education: 'ปริญญาตรี สาขาแพทยศาสตร์ หรือสาขาที่เกี่ยวข้อง',
    gender: 'any',
    positions: 'ศัลยแพทย์กระดูก, พยาบาลผ่าตัด, เจ้าหน้าที่ศัลยกรรม'
  }
];

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  
  // ฟังก์ชันสำหรับจัดการ loading state
  const setButtonLoading = (buttonId: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [buttonId]: isLoading
    }));
  };

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
  
  // File upload states for new department
  const [newDepartmentFiles, setNewDepartmentFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  
  // File upload states for editing department
  const [editingDepartmentFiles, setEditingDepartmentFiles] = useState<File[]>([]);
  const [isUploadingEditFiles, setIsUploadingEditFiles] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  // Mission groups (ดึงข้อมูลจากฐานข้อมูล)
  const [missionGroups, setMissionGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [newMissionGroupId, setNewMissionGroupId] = useState<string>(''); // store group name as key
  const [editMissionGroupId, setEditMissionGroupId] = useState<string>(''); // store group name as key
  const [departmentsByGroup, setDepartmentsByGroup] = useState<Record<string, Array<{ id: string; name: string; code: string }>>>({});
  const [loadingMissionGroups, setLoadingMissionGroups] = useState(false);
  
  // Hospital departments (ดึงข้อมูลจากฐานข้อมูล)
  const [hospitalDepartments, setHospitalDepartments] = useState<Array<{ id: number; name: string; missionGroupId: string | null }>>([]);
  const [selectedMissionGroupId, setSelectedMissionGroupId] = useState<string>('');
  const [selectedHospitalDepartmentId, setSelectedHospitalDepartmentId] = useState<string>('');
  const [loadingHospitalDepartments, setLoadingHospitalDepartments] = useState(false);

  // ดึงข้อมูลกลุ่มงานจากฐานข้อมูล
  const fetchMissionGroups = async () => {
    try {
      setLoadingMissionGroups(true);
      const response = await fetch('/api/prisma/mission-groups');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMissionGroups(data.data);
          console.log('✅ Mission Groups loaded:', data.data);
        } else {
          console.error('❌ Failed to load mission groups:', data);
          // Fallback to derived groups
          rebuildMissionGroupsFromDepartments();
        }
      } else {
        console.error('❌ API Error loading mission groups:', response.status);
        // Fallback to derived groups
        rebuildMissionGroupsFromDepartments();
      }
    } catch (error) {
      console.error('❌ Error fetching mission groups:', error);
      // Fallback to derived groups
      rebuildMissionGroupsFromDepartments();
    } finally {
      setLoadingMissionGroups(false);
    }
  };

  // ดึงข้อมูลฝ่ายจากฐานข้อมูล
  const fetchHospitalDepartments = async (missionGroupId?: string) => {
    try {
      console.log('🔍 fetchHospitalDepartments called with missionGroupId:', missionGroupId);
      setLoadingHospitalDepartments(true);
      const url = missionGroupId 
        ? `/api/hospital-departments?missionGroupId=${missionGroupId}`
        : '/api/hospital-departments';
      console.log('🔍 Fetching URL:', url);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setHospitalDepartments(data.data);
          console.log('✅ Hospital Departments loaded:', data.data.length, 'items');
          console.log('🔍 First item:', data.data[0]);
        } else {
          console.error('❌ Failed to load hospital departments:', data);
        }
      } else {
        console.error('❌ API Error loading hospital departments:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching hospital departments:', error);
    } finally {
      setLoadingHospitalDepartments(false);
    }
  };

  // Fallback: สร้างกลุ่มงานจาก departments (เดิม)
  const rebuildMissionGroupsFromDepartments = () => {
    const groupMap: Record<string, Array<{ id: string; name: string; code: string }>> = {};
    const nameSet = new Set<string>();
    departments.forEach((d: any) => {
      const groupName: string = d?.missionGroupName || '';
      const key = groupName || 'ไม่ระบุกลุ่มงาน';
      nameSet.add(key);
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push({ id: d.id, name: d.name, code: (d as any).code || '' });
    });
    setDepartmentsByGroup(groupMap);
    setMissionGroups(Array.from(nameSet).map(n => ({ id: n, name: n })));
  };

  // ดึงข้อมูลกลุ่มงานเมื่อ component mount
  useEffect(() => {
    fetchMissionGroups();
    fetchHospitalDepartments();
  }, []);

  // ดึงข้อมูลฝ่ายเมื่อเลือกกลุ่มงาน
  useEffect(() => {
    if (selectedMissionGroupId) {
      fetchHospitalDepartments(selectedMissionGroupId);
    } else {
      fetchHospitalDepartments();
    }
  }, [selectedMissionGroupId]);

  // เมื่อเลือกฝ่าย ให้ตั้งค่ากลุ่มงานที่เกี่ยวข้อง
  useEffect(() => {
    console.log('🔍 useEffect triggered - selectedHospitalDepartmentId:', selectedHospitalDepartmentId);
    console.log('🔍 hospitalDepartments.length:', hospitalDepartments.length);
    
    if (selectedHospitalDepartmentId && hospitalDepartments.length > 0) {
      const selectedDept = hospitalDepartments.find(d => d.id.toString() === selectedHospitalDepartmentId);
      console.log('🔍 Found selected department:', selectedDept);
      
      if (selectedDept && selectedDept.missionGroupId && selectedDept.missionGroupId !== selectedMissionGroupId) {
        console.log('🔍 Setting mission group to:', selectedDept.missionGroupId);
        setSelectedMissionGroupId(selectedDept.missionGroupId);
      }
    }
  }, [selectedHospitalDepartmentId, hospitalDepartments, selectedMissionGroupId]);

  // Rebuild mission groups and mapping from loaded departments (fallback)
  useEffect(() => {
    if (missionGroups.length === 0) {
      rebuildMissionGroupsFromDepartments();
    }
  }, [departments]);
  
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

  // Fetch departments data
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prisma/departments?limit=1000');
      if (response.ok) {
        const data = await response.json();
        const list = (data.data || []).map((d: any) => ({
          ...d,
          status: (d.status || 'ACTIVE').toString().toLowerCase()
        }));
        setDepartments(list);
        console.log('📊 Loaded departments:', list.length, 'total');
        console.log('📊 Sample department with mission group:', list[0]);
      } else {
        console.error('❌ Failed to fetch departments');
        // Fallback to mock data if API fails
        setDepartments(mockDepartments);
      }
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
      // Fallback to mock data if API fails
      setDepartments(mockDepartments);
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลฝ่ายตามกลุ่มงาน
  const fetchDepartmentsByGroup = async (missionGroupId: string) => {
    try {
      console.log('🔍 Fetching departments for group:', missionGroupId);
      const response = await fetch(`/api/prisma/departments/by-mission-group?missionGroupId=${missionGroupId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          console.log('✅ Departments by group loaded:', data.data);
          return data.data;
        } else {
          console.error('❌ Failed to load departments by group:', data);
          return [];
        }
      } else {
        console.error('❌ API Error loading departments by group:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching departments by group:', error);
      return [];
    }
  };

  // Load departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);


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

  // Add debouncing to prevent rapid consecutive calls
  const [updatingDepartments, setUpdatingDepartments] = useState<Set<string>>(new Set());
  
  const handleToggleStatus = async (department: Department) => {
    // Prevent multiple simultaneous updates for the same department
    if (updatingDepartments.has(department.id)) {
      console.log('Department update already in progress, skipping...');
      return;
    }
    
    const newStatus = department.status === 'active' ? 'inactive' : 'active';
    
    // Mark as updating
    setUpdatingDepartments(prev => new Set(prev).add(department.id));
    
    // Optimistic update - update UI immediately
    setDepartments(prev => 
      prev.map(d => 
        d.id === department.id 
          ? { ...d, status: newStatus }
          : d
      )
    );
    
    try {
      const response = await fetch(`/api/prisma/departments/${department.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (response.ok) {
        // Sync modal states (if open) so EyeIcon and dropdown stay consistent
        setEditingDepartment(prev => prev && prev.id === department.id ? { ...prev, status: newStatus } as Department : prev);
        setSelectedDepartment(prev => prev && (prev as Department).id === department.id ? { ...(prev as Department), status: newStatus } as any : prev);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update department status:', errorData);
        
        // Show specific error message
        if (response.status === 404) {
          alert('ไม่พบฝ่ายที่ต้องการอัปเดต กรุณารีเฟรชหน้า');
        } else {
          alert('เกิดข้อผิดพลาดในการอัปเดตสถานะฝ่าย');
        }
        
        // Revert optimistic update on failure
        setDepartments(prev => 
          prev.map(d => 
            d.id === department.id 
              ? { ...d, status: department.status }
              : d
          )
        );
      }
    } catch (error) {
      console.error('Error updating department status:', error);
      // Revert optimistic update on failure
      setDepartments(prev => 
        prev.map(d => 
          d.id === department.id 
            ? { ...d, status: department.status }
            : d
        )
      );
    } finally {
      // Remove from updating set
      setUpdatingDepartments(prev => {
        const newSet = new Set(prev);
        newSet.delete(department.id);
        return newSet;
      });
    }
  };

  const handleCloseDetails = () => {
    setSelectedDepartment(null);
    onClose();
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบฝ่ายนี้?')) {
      try {
        const response = await fetch(`/api/prisma/departments/${departmentId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setDepartments(prev => prev.filter(d => d.id !== departmentId));
        } else {
          alert('เกิดข้อผิดพลาดในการลบฝ่าย');
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('เกิดข้อผิดพลาดในการลบฝ่าย');
      }
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    // ตั้งค่า mission group จาก ID ของกลุ่มงาน
    setEditMissionGroupId((department as any).missionGroupId || '');
    // mapping ถูกสร้างจาก departments อยู่แล้ว
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

  const handleOpenPreview = (department: Department) => {
    setSelectedDepartment(department);
    onOpen();
  };

  const handleSaveEdit = async () => {
    if (editingDepartment) {
      try {
        // ตัด attachments ออกจาก payload ไม่ส่งให้ API อัปเดตข้อมูลฝ่าย
        const { attachments: _omitAttachments, ...payload } = editingDepartment as any
        // missionGroupName ใช้ฝั่งแสดงผลเท่านั้น ในที่นี้เลี่ยงไม่ส่งค่าที่ backend ไม่รองรับ
        const response = await fetch(`/api/prisma/departments/${editingDepartment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          const result = await response.json();
          let updatedDepartment = result.data;

          // Normalize enum-like fields from API (e.g., 'ACTIVE' -> 'active') to match UI expectations
          if (updatedDepartment?.status) {
            updatedDepartment.status = String(updatedDepartment.status).toLowerCase();
          }
          if (updatedDepartment?.gender) {
            updatedDepartment.gender = String(updatedDepartment.gender).toLowerCase();
          }
          
          // อัปโหลดไฟล์ใหม่ถ้ามี
          if (editingDepartmentFiles.length > 0) {
            const uploadedFiles = await uploadEditFiles(editingDepartment.id);
            console.log('📎 Uploaded new files:', uploadedFiles);
            
            // อัปเดต attachments ใน updatedDepartment
            updatedDepartment.attachments = [
              ...(updatedDepartment.attachments || []),
              ...uploadedFiles
            ];
          }
          
          setDepartments(prev => 
            prev.map(d => d.id === updatedDepartment.id ? { ...d, ...updatedDepartment } : d)
          );
          // sync dropdown state
          setEditMissionGroupId('')
          setEditingDepartment(null);
          setEditingDepartmentFiles([]);
          onEditClose();
          setShowStartDatePicker(false);
          setShowEndDatePicker(false);
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกการเปลี่ยนแปลง');
        }
      } catch (error) {
        console.error('Error updating department:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกการเปลี่ยนแปลง');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setEditingDepartmentFiles([]);
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
    setNewMissionGroupId('');
    setNewDepartmentFiles([]);
    setCurrentNewStartMonth(new Date());
    setCurrentNewEndMonth(new Date());
    onAddOpen();
  };

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewDepartmentFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setNewDepartmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (departmentId: string) => {
    if (newDepartmentFiles.length === 0) return [];

    setIsUploadingFiles(true);
    const uploadedFiles = [];

    try {
      for (const file of newDepartmentFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('departmentId', departmentId);

        const response = await fetch('/api/departments/upload-attachment', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          uploadedFiles.push({
            fileName: result.data?.fileName || file.name,
            filePath: result.data?.filePath || result.filePath || result.fileName,
            originalName: result.data?.fileName || file.name,
            id: result.data?.id,
            fileSize: result.data?.fileSize,
            createdAt: result.data?.createdAt
          });
        } else {
          console.error('Failed to upload file:', file.name);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploadingFiles(false);
    }

    return uploadedFiles;
  };

  // File handling functions for editing department
  const handleEditFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setEditingDepartmentFiles(prev => [...prev, ...files]);
  };

  const handleRemoveEditFile = (index: number) => {
    setEditingDepartmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadEditFiles = async (departmentId: string) => {
    if (editingDepartmentFiles.length === 0) return [];

    setIsUploadingEditFiles(true);
    const uploadedFiles = [];

    try {
      for (const file of editingDepartmentFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('departmentId', departmentId);

        const response = await fetch('/api/departments/upload-attachment', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          uploadedFiles.push({
            fileName: result.data?.fileName || file.name,
            filePath: result.data?.filePath || result.filePath || result.fileName,
            originalName: result.data?.fileName || file.name,
            id: result.data?.id,
            fileSize: result.data?.fileSize,
            createdAt: result.data?.createdAt
          });
        } else {
          console.error('Failed to upload file:', file.name);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploadingEditFiles(false);
    }

    return uploadedFiles;
  };

  const handleSaveNewDepartment = async () => {
    if (newDepartment.name && newMissionGroupId) {
      try {
        // สร้างฝ่ายใหม่ก่อน
        const response = await fetch('/api/prisma/departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            ...newDepartment,
            missionGroupId: newMissionGroupId
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          const newDept = result.data;
          
          // อัปโหลดไฟล์ถ้ามี
          if (newDepartmentFiles.length > 0) {
            const uploadedFiles = await uploadFiles(newDept.id);
            console.log('📎 Uploaded files:', uploadedFiles);
          }
          
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
          setNewMissionGroupId('');
          setNewDepartmentFiles([]);
          onAddClose();
          setShowNewStartDatePicker(false);
          setShowNewEndDatePicker(false);
        } else {
          alert('เกิดข้อผิดพลาดในการเพิ่มฝ่ายใหม่');
        }
      } catch (error) {
        console.error('Error adding new department:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มฝ่ายใหม่');
      }
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
  const items = useMemo(() => {
    // เรียงลำดับฝ่ายจากวันที่สร้างใหม่ไปเก่า
    const sortedDepartments = [...departments].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || '2024-01-01').getTime();
      const dateB = new Date(b.createdAt || b.updatedAt || '2024-01-01').getTime();
      return dateB - dateA; // เรียงจากใหม่ไปเก่า
    });
    
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedDepartments.slice(start, end);
  }, [page, departments, rowsPerPage]);

  // ตัวกรองกลุ่มงาน/ฝ่าย เหนือ table (ใช้ตัวแปรใหม่แล้ว)

  const filteredDepartments = useMemo(() => {
    console.log('🔍 filteredDepartments useMemo triggered');
    console.log('🔍 selectedMissionGroupId:', selectedMissionGroupId);
    console.log('🔍 selectedHospitalDepartmentId:', selectedHospitalDepartmentId);
    console.log('🔍 departments.length:', departments.length);
    console.log('🔍 hospitalDepartments.length:', hospitalDepartments.length);
    
    let data = departments;
    if (selectedMissionGroupId) {
      data = data.filter(d => (d as any).missionGroupId === selectedMissionGroupId);
      console.log('🔍 After mission group filter:', data.length);
    }
    if (selectedHospitalDepartmentId) {
      // กรองตาม hospital department ที่เลือก
      const selectedDept = hospitalDepartments.find(d => d.id.toString() === selectedHospitalDepartmentId);
      console.log('🔍 Selected department for filtering:', selectedDept);
      if (selectedDept) {
        data = data.filter(d => d.name === selectedDept.name);
        console.log('🔍 After hospital department filter:', data.length);
      }
    }
    console.log('🔍 Final filtered data length:', data.length);
    return data;
  }, [departments, selectedMissionGroupId, selectedHospitalDepartmentId, hospitalDepartments]);

  const filteredPages = Math.ceil(filteredDepartments.length / rowsPerPage);
  const filteredItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDepartments.slice(start, end);
  }, [filteredDepartments, page, rowsPerPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // แปลง ISO format หรือ YYYY-MM-DD เป็น Date object
      const date = new Date(dateString);
      
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

  // ฟังก์ชันแปลงวันที่จาก ISO format เป็น d/m/Y (ปีไทย)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear() + 543; // แปลงเป็นปีไทย
      return `${day}/${month}/${year}`;
    } catch {
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
              <p className="text-gray-600">กำลังโหลดข้อมูลฝ่าย...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <BuildingOfficeIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">
                ประกาศรับสมัคร
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">จัดการและดูข้อมูลฝ่ายและกลุ่มงานทั้งหมดในองค์กร</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                color="success"
                variant="ghost"
                startContent={loadingStates['add-department'] ? <Spinner classNames={{label: "text-foreground mt-4"}} label="default" variant="default" /> : <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl"
                isLoading={loadingStates['add-department']}
                onClick={async () => {
                  setButtonLoading('add-department', true);
                  try {
                    await handleAddNewDepartment();
                  } finally {
                    setButtonLoading('add-department', false);
                  }
                }}
              >
                <span className="hidden sm:inline">เพิ่มประกาศรับสมัครใหม่</span>
                <span className="sm:hidden">เพิ่มประกาศ</span>
              </Button>
              <Button
                color="primary"
                variant="ghost"
                startContent={loadingStates['navigate-back'] ? <Spinner classNames={{label: "text-foreground mt-4"}} label="default" variant="default" /> : <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl"
                isLoading={loadingStates['navigate-back']}
                onClick={async () => {
                  setButtonLoading('navigate-back', true);
                  try {
                    window.location.href = '/admin';
                  } finally {
                    setButtonLoading('navigate-back', false);
                  }
                }}
              >
                <span className="hidden sm:inline">กลับไปหน้า Dashboard Admin</span>
                <span className="sm:hidden">กลับ</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">ฝ่ายทั้งหมด</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">{filteredDepartments.length}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">ฝ่ายที่เปิดใช้งาน</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 truncate">
                    {filteredDepartments.filter(d => d.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-0 rounded-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">จำนวนตำแหน่งที่เปิดรับสมัคร</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 truncate">
                    {filteredDepartments.reduce((sum, d) => sum + d.employeeCount, 0)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                  <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Departments Table */}
        <Card className="shadow-lg border-0 rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-xl font-semibold text-gray-800">รายการฝ่ายทั้งหมด</h2>
                  <p className="text-sm text-gray-600">
                    {selectedMissionGroupId && selectedHospitalDepartmentId 
                      ? `แสดงฝ่ายที่เลือกจากกลุ่มงานที่เลือก` 
                      : selectedMissionGroupId 
                        ? `แสดงฝ่ายจากกลุ่มงานที่เลือก` 
                        : selectedHospitalDepartmentId
                          ? `แสดงฝ่ายที่เลือก`
                          : `แสดงข้อมูลฝ่ายทั้งหมดในระบบ`
                    }
                    {(selectedMissionGroupId || selectedHospitalDepartmentId) && (
                      <span className="ml-2 text-blue-600 font-medium">
                        ({filteredDepartments.length} รายการ)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">กลุ่มงาน</label>
                  <select
                    value={selectedMissionGroupId}
                    onChange={(e) => {
                      setSelectedMissionGroupId(e.target.value);
                      setSelectedHospitalDepartmentId(''); // รีเซ็ตฝ่ายเมื่อเปลี่ยนกลุ่มงาน
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    disabled={loadingMissionGroups}
                  >
                    <option value="">ทั้งหมด</option>
                    {loadingMissionGroups ? (
                      <option value="" disabled>กำลังโหลด...</option>
                    ) : (
                      missionGroups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">ฝ่าย</label>
                  <select
                    value={selectedHospitalDepartmentId}
                    onChange={(e) => {
                      console.log('🔍 Selecting hospital department:', e.target.value);
                      setSelectedHospitalDepartmentId(e.target.value);
                      // ไม่ต้องรีเซ็ตกลุ่มงาน เพราะ useEffect จะจัดการให้
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    disabled={loadingHospitalDepartments}
                  >
                    <option value="">ทั้งหมด</option>
                    {loadingHospitalDepartments ? (
                      <option value="" disabled>กำลังโหลด...</option>
                    ) : (
                      hospitalDepartments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { 
                      setSelectedMissionGroupId(''); 
                      setSelectedHospitalDepartmentId(''); 
                    }}
                    className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    รีเซ็ตตัวกรอง
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {/* Mobile Card Layout */}
            <div className="block sm:hidden p-2 sm:p-4 space-y-3 sm:space-y-4">
              {(filteredItems as Department[]).map((department: Department, index: number) => {
                const sequenceNumber = (page - 1) * rowsPerPage + index + 1;
                return (
                  <Card key={department.id} className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Chip color="primary" variant="flat" size="sm" className="flex-shrink-0">
                            {sequenceNumber}
                          </Chip>
                          <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">{department.name}</h3>
                        </div>
                        <Chip
                          color={getStatusColor(department.status)}
                          variant="flat"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          {getStatusText(department.status)}
                        </Chip>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">กลุ่มงาน:</span>
                          <span className="text-sm font-medium">{department.missionGroupName || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">ตำแหน่ง:</span>
                          <span className="text-sm font-medium">{department.positions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">จำนวนที่เปิดรับ:</span>
                          <span className="text-sm font-medium">{department.employeeCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">วันที่สร้าง:</span>
                          <span className="text-sm font-medium">
                            {formatDateForDisplay(department.createdAt || '')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row gap-1 sm:gap-2 pt-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={loadingStates[`view-${department.id}`] ? <Spinner classNames={{label: "text-foreground mt-4"}} label="default" variant="default" /> : <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl sm:bg-transparent sm:hover:bg-transparent sm:text-primary sm:border-transparent"
                          isLoading={loadingStates[`view-${department.id}`]}
                          onPress={async () => {
                            setButtonLoading(`view-${department.id}`, true);
                            try {
                              setSelectedDepartment(department);
                              onOpen();
                            } finally {
                              setButtonLoading(`view-${department.id}`, false);
                            }
                          }}
                        >
                          <span className="hidden sm:inline">ดูรายละเอียด</span>
                          <span className="sm:hidden">ดู</span>
                        </Button>
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          startContent={loadingStates[`edit-${department.id}`] ? <Spinner classNames={{label: "text-foreground mt-4"}} label="default" variant="default" /> : <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl sm:bg-transparent sm:hover:bg-transparent sm:text-warning sm:border-transparent"
                          isLoading={loadingStates[`edit-${department.id}`]}
                          onPress={async () => {
                            setButtonLoading(`edit-${department.id}`, true);
                            try {
                              handleEditDepartment(department);
                            } finally {
                              setButtonLoading(`edit-${department.id}`, false);
                            }
                          }}
                        >
                          <span className="hidden sm:inline">แก้ไข</span>
                          <span className="sm:hidden">แก้</span>
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          startContent={loadingStates[`delete-${department.id}`] ? <Spinner classNames={{label: "text-foreground mt-4"}} label="default" variant="default" /> : <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl sm:bg-transparent sm:hover:bg-transparent sm:text-danger sm:border-transparent"
                          isLoading={loadingStates[`delete-${department.id}`]}
                          onPress={async () => {
                            setButtonLoading(`delete-${department.id}`, true);
                            try {
                              await handleDeleteDepartment(department.id);
                            } finally {
                              setButtonLoading(`delete-${department.id}`, false);
                            }
                          }}
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <Table 
                aria-label="Departments table"
                selectionMode="none"
                classNames={{
                  wrapper: "min-h-[400px]",
                }}
                className="min-w-full"
              >
                <TableHeader>
                  <TableColumn className="hidden sm:table-cell">ลำดับ</TableColumn>
                  <TableColumn className="hidden md:table-cell">กลุ่มงาน</TableColumn>
                  <TableColumn>ฝ่าย</TableColumn>
                  <TableColumn className="hidden lg:table-cell">ตำแหน่งที่เปิดรับสมัคร</TableColumn>
                  <TableColumn className="hidden sm:table-cell">จำนวนที่เปิดรับ</TableColumn>
                  <TableColumn className="hidden sm:table-cell">สถานะ</TableColumn>
                  <TableColumn className="hidden md:table-cell">วันที่สร้าง</TableColumn>
                  <TableColumn>การดำเนินการ</TableColumn>
                </TableHeader>
              <TableBody emptyContent={"ไม่พบข้อมูลฝ่าย"}>
                {(filteredItems as Department[]).map((department: Department, index: number) => {
                  // คำนวณลำดับที่ต่อจากหน้าก่อนหน้า
                  const sequenceNumber = (page - 1) * rowsPerPage + index + 1;
                  
                  return (
                    <TableRow key={department.id} className="hover:bg-gray-100 transition-colors">
                      <TableCell className="hidden sm:table-cell">
                        <Chip color="primary" variant="flat" size="sm">
                          {sequenceNumber}
                        </Chip>
                      </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p className="text-gray-800">{department.missionGroupName || '-'}</p>
                      </div>
                      </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-800">{department.name}</p>
                        <p className="text-sm text-gray-600 sm:hidden">{department.missionGroupName || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="font-medium text-gray-800">{department.positions}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="font-medium text-gray-800">{department.employeeCount}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Chip
                        color={getStatusColor(department.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(department.status)}
                      </Chip>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm text-gray-600">
                        {formatDateForDisplay(department.createdAt || '')}
                      </div>
                    </TableCell>
                                         <TableCell>
                       <div className="flex gap-2">
                         <Button
                           isIconOnly
                           size="sm"
                           variant="ghost"
                           color={department.status === 'active' ? 'success' : 'default'}
                           className={department.status === 'active' 
                             ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                           }
                          onClick={() => handleOpenPreview(department)}
                          title={'ดูตัวอย่างข้อมูลหน่วยงาน'}
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
                  );
                })}
              </TableBody>
            </Table>
            </div>
            {/* Custom Pagination */}
            {(filteredPages > 1 ? filteredPages : pages) > 1 && (
              <div className="flex flex-row justify-center items-center gap-1 sm:gap-2 lg:gap-4 mt-4 sm:mt-6 lg:mt-8 py-3 sm:py-4 px-2 sm:px-4 overflow-x-auto">
                {/* Previous Button */}
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 sm:bg-white sm:text-gray-700 sm:hover:bg-gray-50 sm:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">‹</span>
                  <span className="sm:hidden">ก่อนหน้า</span>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: filteredPages || pages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current page
                  const shouldShow = 
                    pageNum === 1 || 
                    pageNum === pages || 
                    Math.abs(pageNum - page) <= 1

                  if (!shouldShow) {
                    // Show ellipsis
                    if (pageNum === 2 && page > 4) {
                      return (
                        <span key={pageNum} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      )
                    }
                    if (pageNum === pages - 1 && page < pages - 3) {
                      return (
                        <span key={pageNum} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 sm:bg-white sm:hover:bg-gray-50 sm:border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* Next Button */}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pages}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                    page === pages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 sm:bg-white sm:text-gray-700 sm:hover:bg-gray-50 sm:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">›</span>
                  <span className="sm:hidden">ถัดไป</span>
                </button>
              </div>
            )}
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
              base: "bg-white shadow-2xl max-h-[90vh] sm:max-h-[95vh]",
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
                  {/* Basic Information (เหมือน modal แก้ไข) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">กลุ่มงาน</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedDepartment.missionGroupName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      </div>
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ฝ่าย</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedDepartment.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      </div>
                    </div>

                  {/* Positions + Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่งที่เปิดรับสมัคร</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedDepartment.positions}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      </div>
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เพศ</label>
                      <select
                        disabled
                        value={selectedDepartment.gender}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      >
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="any">ไม่จำกัดเพศ</option>
                      </select>
                        </div>
                    
                      </div>

                  {/* Coordinator + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ชื่อผู้ประสานงาน</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedDepartment.manager}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      </div>
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedDepartment.managerPhone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  {/* Headcount + Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">จำนวนที่เปิดรับ</label>
                      <input
                        type="number"
                        readOnly
                        value={selectedDepartment.employeeCount}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถานะ</label>
                      <select
                        disabled
                        value={selectedDepartment.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                      >
                        <option value="active">เปิดใช้งาน</option>
                        <option value="inactive">ปิดใช้งาน</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่เปิดรับสมัคร</label>
                      <input
                        type="text"
                        readOnly
                        value={formatDate(selectedDepartment.applicationStartDate)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดการรับสมัคร</label>
                      <input
                        type="text"
                        readOnly
                        value={formatDate(selectedDepartment.applicationEndDate)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  {/* Education + Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วุฒิการศึกษา</label>
                      <textarea
                        readOnly
                        value={selectedDepartment.education}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                    <textarea
                      readOnly
                      value={selectedDepartment.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                      rows={3}
                    />
                    </div>
                    
                  </div>

                  {/* Description */}
                  
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
              base: "bg-white shadow-2xl max-h-[90vh] sm:max-h-[95vh]",
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
                    <h2 className="text-xl font-semibold">แก้ไขข้อมูลประกาศรับสมัคร</h2>
                    <p className="text-sm text-gray-600">{editingDepartment.name}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">รหัสฝ่าย</label>
                        <input
                          type="text"
                          placeholder="เช่น IT, HR, FIN"
                          value={editingDepartment.code}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, code: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div> */}
                      {/* กลุ่มงาน (dropdown) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">กลุ่มงาน</label>
                        <select
                          value={editMissionGroupId}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setEditMissionGroupId(val);
                            // reset department name when group changes
                            setEditingDepartment(prev => prev ? { ...prev, name: '' } : prev);
                            if (val) {
                              try {
                                await fetchHospitalDepartments(val);
                              } catch (err) {
                                console.error('❌ Error fetching hospital departments by group:', err);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          disabled={loadingMissionGroups}
                        >
                          <option value="">เลือกกลุ่มงาน</option>
                          {loadingMissionGroups ? (
                            <option value="" disabled>กำลังโหลด...</option>
                          ) : (
                            missionGroups.map(g => (
                              <option key={g.id} value={g.id}>{g.name}</option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ฝ่าย</label>
                        <select
                          value={editingDepartment.name}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          disabled={!editMissionGroupId || loadingHospitalDepartments}
                        >
                          <option value="">เลือกฝ่าย</option>
                          {editMissionGroupId ? (
                            loadingHospitalDepartments ? (
                              <option value="" disabled>กำลังโหลด...</option>
                            ) : (
                              hospitalDepartments
                                .filter(dept => dept.missionGroupId === editMissionGroupId)
                                .map(dept => (
                                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))
                            )
                          ) : (
                            <option value="" disabled>เลือกกลุ่มงานก่อน</option>
                          )}
                        </select>
                      </div>
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำแหน่งที่เปิดรับสมัคร</label>
                      <input
                        type="text"
                        placeholder="เช่น โปรแกรมเมอร์, นักวิเคราะห์ระบบ, ผู้ดูแลระบบ"
                        value={editingDepartment.positions}
                        onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, positions: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                                             <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เพศ</label>
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

                    {/* Coordinator name + phone in the same row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อผู้ประสานงาน</label>
                        <input
                          type="text"
                          placeholder="ชื่อหัวหน้าฝ่าย"
                          value={editingDepartment.manager}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, manager: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                        <input
                          type="text"
                          placeholder="081-234-5678"
                          value={editingDepartment.managerPhone}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, managerPhone: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Headcount + status in the same row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">จำนวนที่เปิดรับ</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingDepartment.employeeCount.toString()}
                          onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, employeeCount: parseInt(e.target.value) || 0 } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">สถานะ</label>
                      <select
                        value={editingDepartment.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as 'active' | 'inactive'
                          setEditingDepartment(prev => prev ? { ...prev, status: newStatus } : null)
                          try {
                            const response = await fetch(`/api/prisma/departments/${editingDepartment.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus })
                            })
                            if (response.ok) {
                              const result = await response.json()
                              const updated = result.data
                              setDepartments(prev => prev.map(d => d.id === updated.id ? { ...d, status: updated.status } : d))
                            } else {
                              console.error('Failed to update status from dropdown')
                            }
                          } catch (err) {
                            console.error('Error updating status from dropdown:', err)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">เปิดใช้งาน</option>
                        <option value="inactive">ปิดใช้งาน</option>
                      </select>
                      </div>
                    </div>
                    </div>
                    
                  {/* Additional Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    
                  </div>

                                                       {/* Application Requirements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                         <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                      <textarea
                           placeholder="คำอธิบายการรับสมัคร"
                           value={editingDepartment.description}
                           onChange={(e) => setEditingDepartment(prev => prev ? { ...prev, description: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                  

                    
                  </div>

                  {/* Positions */}

                  {/* Attachments */}
                  {/* File Attachments */}
                  <div className="space-y-4">
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        เอกสารแนบ (ถ้ามี)
                      </h3>
                      
                      {/* File Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                          onChange={handleEditFileSelect}
                          className="hidden"
                          id="edit-file-upload"
                        />
                        <label
                          htmlFor="edit-file-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <div className="p-3 bg-blue-50 rounded-full">
                            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              รองรับไฟล์: PDF, DOC, DOCX, JPG, PNG, TXT (ขนาดไม่เกิน 10MB)
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Selected Files List */}
                      {editingDepartmentFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">ไฟล์ที่เลือกใหม่:</h4>
                          <div className="space-y-2">
                            {editingDepartmentFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveEditFile(index)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  title="ลบไฟล์"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Existing Files List */}
                    {editingDepartment && (editingDepartment as any).attachments?.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">ไฟล์ที่แนบแล้ว:</h4>
                      <div className="space-y-2">
                          {((editingDepartment as any).attachments as any[]).map((att, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                              >
                                <div className="flex items-center gap-3">
                                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                  <div>
                                    <a 
                                      href={(typeof att === 'string' ? att : att.filePath)} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-sm font-medium text-green-700 hover:underline"
                                    >
                                      {(() => {
                                        if (typeof att === 'string') {
                                          return att.split('/').pop() || att;
                                        } else if (att && typeof att === 'object') {
                                          return att.originalName || att.fileName || att.filePath?.split('/').pop() || 'Unknown File';
                                        }
                                        return 'Unknown File';
                                      })()}
                                    </a>
                                    <p className="text-xs text-green-600">ไฟล์เดิม</p>
                                  </div>
                                </div>
                              <button
                                  onClick={async () => {
                                    if (!confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                                      return;
                                    }
                                    
                                    try {
                                      // ลบไฟล์จากฐานข้อมูลถ้าเป็น object ที่มี id
                                      if (att && typeof att === 'object' && att.id) {
                                        const response = await fetch(`/api/departments/upload-attachment?attachmentId=${att.id}`, {
                                          method: 'DELETE'
                                        });
                                        
                                        if (response.ok) {
                                          console.log('✅ ไฟล์ถูกลบจากฐานข้อมูลแล้ว');
                                          alert('ลบไฟล์สำเร็จ');
                                        } else {
                                          console.error('❌ เกิดข้อผิดพลาดในการลบไฟล์จากฐานข้อมูล');
                                          alert('เกิดข้อผิดพลาดในการลบไฟล์');
                                          return;
                                        }
                                      }
                                      
                                      // ลบไฟล์จาก state
                                  setEditingDepartment(prev => prev ? {
                                    ...prev,
                                    attachments: (((prev as any).attachments as any[]) || []).filter((_: any, index: number) => index !== idx)
                                  } : null)
                                    } catch (error) {
                                      console.error('❌ เกิดข้อผิดพลาดในการลบไฟล์:', error);
                                      alert('เกิดข้อผิดพลาดในการลบไฟล์');
                                    }
                                }}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  title="ลบไฟล์"
                              >
                                  <TrashIcon className="w-4 h-4" />
                              </button>
                              </div>
                          ))}
                      </div>
                  </div>
                      )}

                      {/* Upload Progress */}
                      {isUploadingEditFiles && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Spinner size="sm" />
                            <span className="text-sm text-blue-700">
                              กำลังอัปโหลดไฟล์... ({editingDepartmentFiles.length} ไฟล์)
                            </span>
                </div>
                        </div>
                      )}
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
                    <h2 className="text-xl font-semibold">เพิ่มประกาศรับสมัครใหม่</h2>
                    <p className="text-sm text-gray-600">กรอกข้อมูลฝ่ายและกลุ่มงานใหม่</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">รหัสฝ่ายและกลุ่มงาน *</label>
                        <input
                          type="text"
                          placeholder="เช่น IT, HR, FIN"
                          value={newDepartment.code}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, code: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div> */}
                      {/* กลุ่มงาน (dropdown) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">กลุ่มงาน*</label>
                        <select
                          value={newMissionGroupId}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setNewMissionGroupId(val);
                            // reset department name when group changes
                            setNewDepartment(prev => ({ ...prev, name: '' }));
                            if (val) {
                              try {
                                await fetchHospitalDepartments(val);
                              } catch (err) {
                                console.error('❌ Error fetching hospital departments by group:', err);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          disabled={loadingMissionGroups}
                        >
                          <option value="">เลือกกลุ่มงาน</option>
                          {loadingMissionGroups ? (
                            <option value="" disabled>กำลังโหลด...</option>
                          ) : (
                            missionGroups.map(g => (
                              <option key={g.id} value={g.id}>{g.name}</option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* ชื่อฝ่าย */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ฝ่าย*</label>
                        <select
                          value={newDepartment.name || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const list = hospitalDepartments.filter(dept => dept.missionGroupId === newMissionGroupId);
                            const selected = list.find(d => d.name === value);
                            setNewDepartment(prev => ({
                              ...prev,
                              name: value,
                              code: selected?.name || prev.code || ''
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          disabled={!newMissionGroupId || loadingHospitalDepartments}
                        >
                          <option value="">เลือกฝ่าย</option>
                          {newMissionGroupId ? (
                            loadingHospitalDepartments ? (
                              <option value="" disabled>กำลังโหลด...</option>
                            ) : (
                              hospitalDepartments
                                .filter(dept => dept.missionGroupId === newMissionGroupId)
                                .map(dept => (
                                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))
                            )
                          ) : (
                            <option value="" disabled>เลือกกลุ่มงานก่อน</option>
                          )}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ตำแหน่งที่เปิดรับสมัคร</label>
                        <input
                          type="text"
                          placeholder="เช่น โปรแกรมเมอร์, นักวิเคราะห์ระบบ, ผู้ดูแลระบบ"
                          value={newDepartment.positions}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, positions: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">เพศ</label>
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

                    {/* Coordinator + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อผู้ประสานงาน</label>
                        <input
                          type="text"
                          placeholder="ชื่อผู้ประสานงาน"
                          value={newDepartment.manager}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, manager: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                        <input
                          type="text"
                          placeholder="081-234-5678"
                          value={newDepartment.managerPhone}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, managerPhone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                   

                    {/* Headcount + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">จำนวนที่เปิดรับ</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newDepartment.employeeCount?.toString() || '0'}
                          onChange={(e) => setNewDepartment(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
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
                  </div>

                  {/* Additional Information (optional fields can go here) */}

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
                     {/* คำอธิบายการรับสมัคร */}
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">คำอธิบาย</label>
                       <textarea
                         placeholder="คำอธิบายการรับสมัคร"
                         value={newDepartment.description || ''}
                         onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                         rows={3}
                       />
                     </div>
                    
                  </div>

                  

                  {/* File Attachments */}
                  <div className="space-y-4">
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        เอกสารแนบ (ถ้ามี)
                      </h3>

                      {/* File Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <div className="p-3 bg-blue-50 rounded-full">
                            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                    </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
                            <p className="text-xs text-gray-500 mt-1">รองรับไฟล์: PDF, DOC, DOCX, JPG, PNG, TXT (ขนาดไม่เกิน 10MB)</p>
                          </div>
                        </label>
                  </div>

                      {/* Selected Files List */}
                      {newDepartmentFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">ไฟล์ที่เลือก:</h4>
                    <div className="space-y-2">
                            {newDepartmentFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                                <button onClick={() => handleRemoveFile(index)} className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="ลบไฟล์">
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Progress */}
                      {isUploadingFiles && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Spinner size="sm" />
                            <span className="text-sm text-blue-700">กำลังอัปโหลดไฟล์... ({newDepartmentFiles.length} ไฟล์)</span>
                          </div>
                        </div>
                      )}
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
                  isDisabled={!newMissionGroupId || !newDepartment.name}
                >
                  บันทึก
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
       </div>
     </div>
   );
 } 