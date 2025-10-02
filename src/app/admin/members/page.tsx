'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  lineId?: string;
  department: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  newPassword?: string;
}

interface HospitalDepartment {
  id: string;
  name: string;
}

// ข้อมูลสมาชิกจะถูกโหลดจากฐานข้อมูลผ่าน API

export default function MembersManagement() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [hospitalDepartments, setHospitalDepartments] = useState<HospitalDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  // สถิติ
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    username: '',
    lineId: '',
    department: '',
    role: '',
    status: 'เปิดใช้งาน',
    password: ''
  });

  useEffect(() => {
    fetchMembers();
    fetchHospitalDepartments();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prisma/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Convert Prisma data to members format
        const membersData = data.data.map((user: any) => ({
          id: user.id,
          prefix: user.prefix || '',
          firstName: user.firstName,
          lastName: user.lastName,
          lineDisplayName: user.lineDisplayName || '',
          email: user.email,
          phone: user.phone || '',
          gender: user.gender === 'MALE' ? 'ชาย' : user.gender === 'FEMALE' ? 'หญิง' : 'ไม่ระบุ',
          birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
          nationality: user.nationality || 'ไทย',
          religion: user.religion || '',
          maritalStatus: user.maritalStatus === 'SINGLE' ? 'โสด' : 
                        user.maritalStatus === 'MARRIED' ? 'สมรส' : 
                        user.maritalStatus === 'DIVORCED' ? 'หย่า' : 
                        user.maritalStatus === 'WIDOWED' ? 'หม้าย' : 'ไม่ระบุ',
          address: user.address || '',
          province: user.province || '',
          district: user.district || '',
          subDistrict: user.subDistrict || '',
          postalCode: user.postalCode || '',
          emergencyContact: user.emergencyContact || '',
          emergencyPhone: user.emergencyPhone || '',
          isHospitalStaff: user.isHospitalStaff || false,
          hospitalDepartment: user.hospitalDepartment || '',
          username: user.username || '',
          password: user.password || '',
          profileImageUrl: user.profileImageUrl,
          status: user.status === 'PENDING' ? 'pending' : 
                 user.status === 'ACTIVE' ? 'active' : 
                 user.status === 'INACTIVE' ? 'inactive' : 'pending',
          department: user.department || '',
          role: user.role === 'HOSPITAL_STAFF' ? 'hospital_staff' : 'applicant',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : '',
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : '',
          updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : '',
          education: user.education?.map((edu: any) => ({
            level: edu.level || '',
            school: edu.school || '',
            major: edu.major || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || '',
            gpa: edu.gpa?.toString() || ''
          })) || [],
          workExperience: user.workExperience?.map((work: any) => ({
            position: work.position || '',
            company: work.company || '',
            startDate: work.startDate ? new Date(work.startDate).toISOString().split('T')[0] : '',
            endDate: work.endDate ? new Date(work.endDate).toISOString().split('T')[0] : '',
            isCurrent: work.isCurrent || false,
            description: work.description || '',
            salary: work.salary || ''
          })) || []
        }));
        
        setMembers(membersData);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('ไม่สามารถโหลดข้อมูลสมาชิกได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalDepartments = async () => {
    try {
      const response = await fetch('/api/hospital-departments');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHospitalDepartments(data.hospitalDepartments || []);
    } catch (error) {
      console.error('Error fetching hospital departments:', error);
      alert('ไม่สามารถโหลดข้อมูลหน่วยงานได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const calculateStats = () => {
    setStats({
      total: members.length,
      active: members.filter(m => m.status === 'เปิดใช้งาน').length,
      inactive: members.filter(m => m.status === 'ปิดการใช้งาน').length
    });
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'ฝ่ายบริหารงานทั่วไป': return 'default';
      case 'คลังพัสดุ': return 'secondary';
      case 'CSSD': return 'primary';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Superadmin': return 'danger';
      case 'Admin': return 'secondary';
      case 'ผู้ดูแลระบบ': return 'danger';
      case 'เจ้าหน้าที่คลังพัสดุ': return 'primary';
      case 'เจ้าหน้าที่/พยาบาลคลังวอร์ด': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'เปิดใช้งาน': return 'success';
      case 'ปิดการใช้งาน': return 'danger';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    onOpen();
  };

  const handleEditMember = (member: Member) => {
    setEditingMember({ ...member, newPassword: '' });
    onEditOpen();
  };

  const handleCreateMember = async () => {
    try {
      if (!newMember.firstName || !newMember.lastName || !newMember.username || !newMember.department || !newMember.role || !newMember.password) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน รวมถึงรหัสผ่าน');
        return;
      }

      // สร้างข้อมูลใหม่ใน register.json
      const newApplication = {
        id: Date.now().toString(),
        lineId: newMember.lineId || '',
        prefix: 'นาย',
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        lineDisplayName: newMember.username,
        email: `${newMember.username}@hospital.com`,
        phone: '',
        gender: '',
        birthDate: '',
        nationality: 'ไทย',
        religion: '',
        maritalStatus: '',
        address: '',
        province: '',
        district: '',
        subDistrict: '',
        postalCode: '',
        emergencyContact: '',
        emergencyPhone: '',
        isHospitalStaff: newMember.role === 'เจ้าหน้าที่โรงพยาบาล',
        hospitalDepartment: newMember.department,
        username: newMember.username,
        password: newMember.password,
        profileImageUrl: null,
        educationList: [],
        workList: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: newMember.status
      };

      // Convert to Prisma format
      const prismaData = {
        lineId: newMember.lineId || null,
        prefix: newMember.prefix || '',
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        lineDisplayName: newMember.lineDisplayName || '',
        email: newMember.email || '',
        phone: newMember.phone || '',
        gender: newMember.gender === 'ชาย' ? 'MALE' : newMember.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN',
        birthDate: newMember.birthDate ? new Date(newMember.birthDate) : null,
        nationality: newMember.nationality || 'ไทย',
        religion: newMember.religion || '',
        maritalStatus: newMember.maritalStatus === 'โสด' ? 'SINGLE' : 
                      newMember.maritalStatus === 'สมรส' ? 'MARRIED' : 
                      newMember.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                      newMember.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN',
        address: newMember.address || '',
        province: newMember.province || '',
        district: newMember.district || '',
        subDistrict: newMember.subDistrict || '',
        postalCode: newMember.postalCode || '',
        emergencyContact: newMember.emergencyContact || '',
        emergencyPhone: newMember.emergencyPhone || '',
        isHospitalStaff: newMember.role === 'เจ้าหน้าที่โรงพยาบาล',
        hospitalDepartment: newMember.department,
        username: newMember.username,
        password: newMember.password,
        status: newMember.status === 'เปิดใช้งาน' ? 'ACTIVE' : 'INACTIVE',
        department: newMember.department,
        role: newMember.role === 'เจ้าหน้าที่โรงพยาบาล' ? 'HOSPITAL_STAFF' : 'APPLICANT'
      };

      const response = await fetch('/api/prisma/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prismaData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to create user');
      }

      await fetchMembers();
      onAddClose();
      setNewMember({ firstName: '', lastName: '', username: '', lineId: '', department: '', role: '', status: 'เปิดใช้งาน', password: '' });
      alert('เพิ่มสมาชิกใหม่สำเร็จ');
    } catch (error) {
      console.error('Error creating member:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มสมาชิก');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    try {
      // สร้างข้อมูลที่จะอัปเดต (ไม่รวม newPassword)
      const { newPassword, ...memberData } = editingMember;
      
      // Convert to Prisma format
      const prismaData = {
        prefix: memberData.prefix || '',
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        lineDisplayName: memberData.lineDisplayName || '',
        email: memberData.email,
        phone: memberData.phone || '',
        gender: memberData.gender === 'ชาย' ? 'MALE' : memberData.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN',
        birthDate: memberData.birthDate ? new Date(memberData.birthDate) : null,
        nationality: memberData.nationality || 'ไทย',
        religion: memberData.religion || '',
        maritalStatus: memberData.maritalStatus === 'โสด' ? 'SINGLE' : 
                      memberData.maritalStatus === 'สมรส' ? 'MARRIED' : 
                      memberData.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                      memberData.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN',
        address: memberData.address || '',
        province: memberData.province || '',
        district: memberData.district || '',
        subDistrict: memberData.subDistrict || '',
        postalCode: memberData.postalCode || '',
        emergencyContact: memberData.emergencyContact || '',
        emergencyPhone: memberData.emergencyPhone || '',
        isHospitalStaff: memberData.role === 'เจ้าหน้าที่โรงพยาบาล',
        hospitalDepartment: memberData.department,
        username: memberData.username,
        password: newPassword || memberData.password,
        status: memberData.status === 'เปิดใช้งาน' ? 'ACTIVE' : 'INACTIVE',
        department: memberData.department,
        role: memberData.role === 'เจ้าหน้าที่โรงพยาบาล' ? 'HOSPITAL_STAFF' : 'APPLICANT'
      };

      // อัปเดตข้อมูลผ่าน Prisma API
      const response = await fetch(`/api/prisma/users/${memberData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prismaData),
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      // อัปเดตข้อมูลใน state
      setMembers(prev => prev.map(m => 
        m.id === editingMember.id ? { ...m, ...memberData, updatedAt: new Date().toISOString() } : m
      ));
      
      // แสดงข้อความแจ้งเตือนถ้ามีการเปลี่ยนรหัสผ่าน
      if (newPassword && newPassword.trim() !== '') {
        alert('อัปเดตข้อมูลสมาชิกสำเร็จ และรหัสผ่านใหม่ได้รับการบันทึก');
      } else {
        alert('อัปเดตข้อมูลสมาชิกสำเร็จ');
      }
      
      setEditingMember(null);
      onEditClose();
    } catch (error) {
      console.error('Error updating member:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  };

  const handleToggleStatus = async (member: Member) => {
    const newStatus = member.status === 'เปิดใช้งาน' ? 'ปิดการใช้งาน' : 'เปิดใช้งาน';
    
    try {
      // Convert to Prisma format
      const prismaData = {
        status: newStatus === 'เปิดใช้งาน' ? 'ACTIVE' : 'INACTIVE'
      };

      // อัปเดตข้อมูลผ่าน Prisma API
      const response = await fetch(`/api/prisma/users/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prismaData),
      });

      if (response.ok) {
        // อัปเดตข้อมูลใน state
        setMembers(prev => 
          prev.map(m => 
            m.id === member.id 
              ? { ...m, status: newStatus }
              : m
          )
        );
        // alert(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`);
      } else {
        console.error('Failed to update member status');
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสมาชิกนี้?')) {
      try {
        // ลบข้อมูลผ่าน API
        const response = await fetch(`/api/users/${memberId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete member');
        }

        // อัปเดตข้อมูลใน state
        setMembers(prev => prev.filter(m => m.id !== memberId));
        alert('ลบสมาชิกสำเร็จ');
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('เกิดข้อผิดพลาดในการลบสมาชิก');
      }
    }
  };

  const handleCloseDetails = () => {
    setSelectedMember(null);
    onClose();
  };

  // กรองข้อมูล
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const pages = Math.ceil(filteredMembers.length / rowsPerPage);
  const items = filteredMembers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const uniqueDepartments = Array.from(new Set(members.map(m => m.department)));
  const uniqueRoles = Array.from(new Set(members.map(m => m.role)));
  const uniqueStatuses = Array.from(new Set(members.map(m => m.status)));

  // บทบาทพื้นฐาน + รวมกับบทบาทที่พบในระบบ
  const baseRoles = ['Superadmin', 'Admin'];
  const rolesOptions = Array.from(new Set([...baseRoles, ...uniqueRoles]));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูลสมาชิก...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">จัดการสมาชิก</h1>
              <p className="text-sm sm:text-base text-gray-600">จัดการข้อมูลสมาชิกในระบบ</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
            onClick={onAddOpen}
          >
            เพิ่มสมาชิกใหม่
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 rounded-xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">สมาชิกทั้งหมด</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-blue-200" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 rounded-xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">ใช้งานปกติ</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 rounded-xl">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">ไม่ใช้งาน</p>
                <p className="text-3xl font-bold">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border-0 rounded-xl">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ค้นหาตามชื่อ, สิทธิการใช้งาน, หน่วยงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
              />
            </div>

            <Select
              placeholder="หน่วยงาน"
              selectedKeys={[departmentFilter]}
              onSelectionChange={(keys) => setDepartmentFilter(Array.from(keys)[0] as string)}
              startContent={<FunnelIcon className="w-5 h-5 text-gray-400" />}
              items={[
                { key: 'all', label: 'ทุกหน่วยงาน' },
                ...hospitalDepartments.map(dept => ({ key: dept.name, label: dept.name }))
              ]}
            >
              {(item) => (
                <SelectItem key={item.key}>
                  {item.label}
                </SelectItem>
              )}
            </Select>

            <Select
              placeholder="สิทธิการใช้งาน"
              selectedKeys={[roleFilter]}
              onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string)}
              startContent={<FunnelIcon className="w-5 h-5 text-gray-400" />}
              items={[
                { key: 'all', label: 'ทุกสิทธิ์' },
                ...rolesOptions.map(role => ({ key: role, label: role }))
              ]}
            >
              {(item) => (
                <SelectItem key={item.key}>
                  {item.label}
                </SelectItem>
              )}
            </Select>

            <Select
              placeholder="สถานะ"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
              startContent={<FunnelIcon className="w-5 h-5 text-gray-400  bg-white" />}
              items={[
                { key: 'all', label: 'ทุกสถานะ' },
                ...uniqueStatuses.map(status => ({ key: status, label: status }))
              ]}
            >
              {(item) => (
                <SelectItem key={item.key}>
                  {item.label}
                </SelectItem>
              )}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">รายชื่อสมาชิก</h3>
            <p className="text-sm text-gray-600">
              แสดง {((page - 1) * rowsPerPage) + 1} ถึง {Math.min(page * rowsPerPage, filteredMembers.length)} จาก {filteredMembers.length} รายการ
            </p>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="ตารางสมาชิก">
            <TableHeader className="bg-gray-100">
              <TableColumn className="text-center">ลำดับ</TableColumn>
              <TableColumn>ชื่อ-นามสกุล</TableColumn>
              <TableColumn>สิทธิการใช้งาน</TableColumn>
              <TableColumn>หน่วยงาน</TableColumn>
              <TableColumn className="text-center">สถานะ</TableColumn>
              <TableColumn className="text-center">กิจกรรม</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((member, index) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">
                    <p className="text-gray-900">{(page - 1) * rowsPerPage + index + 1}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-900">นาย {member.firstName} {member.lastName}</p>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      color={member.role === 'เจ้าหน้าที่โรงพยาบาล' ? 'primary' : 'default'}
                      variant="flat"
                      className="text-xs"
                    >
                      {member.role || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-900">{member.department || '-'}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      color={getStatusColor(member.status)}
                      variant="flat"
                      className="text-xs"
                    >
                      {member.status || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        color={member.status === 'เปิดใช้งาน' ? 'success' : 'default'}
                        className={member.status === 'เปิดใช้งาน' 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                        onClick={() => handleToggleStatus(member)}
                        title={member.status === 'เปิดใช้งาน' ? 'ปิดการใช้งานสมาชิก' : 'เปิดการใช้งานสมาชิก'}
                      >
                        {member.status === 'เปิดใช้งาน' ? (
                          <EyeIcon className="w-4 h-4" />
                        ) : (
                          <EyeSlashIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        color="warning"
                        className="bg-orange-100 text-orange-600 hover:bg-orange-200"
                        onClick={() => handleEditMember(member)}
                        title="แก้ไขข้อมูลสมาชิก"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        color="danger"
                        className="bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={() => handleDeleteMember(member.id)}
                        title="ลบสมาชิก"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-gray-600">
              แสดง {((page - 1) * rowsPerPage) + 1} ถึง {Math.min(page * rowsPerPage, filteredMembers.length)} จาก {filteredMembers.length} รายการ
            </div>
            <Pagination
              total={pages}
              page={page}
              onChange={setPage}
              showControls
              showShadow
              color="primary"
            />
          </div>
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={handleCloseDetails} 
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[95vh] bg-gradient-to-br from-gray-50 to-white",
          body: "overflow-y-auto max-h-[calc(95vh-140px)] bg-transparent p-0",
          header: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
          footer: "bg-white border-t border-gray-200"
        }}
      >
        <ModalContent className="bg-white">
          <ModalHeader className="flex flex-col gap-3 sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    รายละเอียดสมาชิก
                  </h2>
                  <p className="text-blue-100">ข้อมูลสมาชิกระบบ</p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={handleCloseDetails}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            {selectedMember && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">ข้อมูลส่วนตัว</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                        <p className="text-gray-900">นาย {selectedMember.firstName} {selectedMember.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">สิทธิการใช้งาน</label>
                        <Badge 
                          color={selectedMember.role === 'เจ้าหน้าที่โรงพยาบาล' ? 'primary' : 'default'}
                          variant="flat"
                          className="text-xs"
                        >
                          {selectedMember.role || '-'}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">หน่วยงาน</label>
                        <p className="text-gray-900">{selectedMember.department || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">ข้อมูลระบบ</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">สิทธิการใช้งาน</label>
                        <Badge
                          color={getRoleColor(selectedMember.role)}
                          variant="flat"
                        >
                          {selectedMember.role}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">สถานะ</label>
                        <Badge
                          color={getStatusColor(selectedMember.status)}
                          variant="flat"
                        >
                          {selectedMember.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">เข้าใช้งานล่าสุด</label>
                        <p className="text-gray-900">{formatDate(selectedMember.lastLogin)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">วันที่สร้าง</label>
                        <p className="text-gray-900">{formatDate(selectedMember.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Add Member Modal */}
      <Modal 
        isOpen={isAddOpen} 
        onClose={onAddClose}
        size="2xl"
        classNames={{
          base: "bg-white",
          header: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          footer: "bg-white border-t border-gray-200"
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">เพิ่มสมาชิกใหม่</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                  <Input
                    value={newMember.firstName}
                    onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล</label>
                  <Input
                    value={newMember.lastName}
                    onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้งาน</label>
                <Input
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Line ID</label>
                <Input
                  value={newMember.lineId}
                  onChange={(e) => setNewMember({ ...newMember, lineId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
                <Input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">หน่วยงาน</label>
                <Select
                  selectedKeys={[newMember.department]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setNewMember({ ...newMember, department: selectedKey });
                  }}
                  classNames={{
                    trigger: "bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
                    value: "text-gray-900 font-medium",
                    listbox: "bg-white border border-gray-200 shadow-lg rounded-lg"
                  }}
                  endContent={
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  }
                >
                  {hospitalDepartments.map(dept => (
                    <SelectItem 
                      key={dept.name}
                      classNames={{
                        base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                        title: "text-gray-900 font-medium"
                      }}
                      startContent={
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                          {dept.name.charAt(0)}
                        </div>
                      }
                    >
                      {dept.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สิทธิการใช้งาน</label>
                <Select
                  selectedKeys={[newMember.role]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setNewMember({ ...newMember, role: selectedKey });
                  }}
                  classNames={{
                    trigger: "bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
                    value: "text-gray-900 font-medium",
                    listbox: "bg-white border border-gray-200 shadow-lg rounded-lg"
                  }}
                  endContent={
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  }
                >
                  {rolesOptions.map(role => (
                    <SelectItem 
                      key={role}
                      classNames={{
                        base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                        title: "text-gray-900 font-medium"
                      }}
                      startContent={
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                          {role.charAt(0)}
                        </div>
                      }
                    >
                      {role}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                <Select
                  selectedKeys={[newMember.status]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setNewMember({ ...newMember, status: selectedKey });
                  }}
                  classNames={{
                    trigger: "bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
                    value: "text-gray-900 font-medium",
                    listbox: "bg-white border border-gray-200 shadow-lg rounded-lg"
                  }}
                  endContent={
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  }
                >
                  <SelectItem 
                    key="เปิดใช้งาน"
                    classNames={{
                      base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                      title: "text-gray-900 font-medium"
                    }}
                    startContent={
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                        <EyeIcon className="w-4 h-4" />
                      </div>
                    }
                  >
                    เปิดใช้งาน
                  </SelectItem>
                  <SelectItem 
                    key="ปิดการใช้งาน"
                    classNames={{
                      base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                      title: "text-gray-900 font-medium"
                    }}
                    startContent={
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                        <EyeSlashIcon className="w-4 h-4" />
                      </div>
                    }
                  >
                    ปิดการใช้งาน
                  </SelectItem>
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onAddClose}>ยกเลิก</Button>
            <Button color="primary" onPress={handleCreateMember}>บันทึก</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditOpen} 
        onClose={onEditClose} 
        size="2xl"
        classNames={{
          base: "bg-white",
          header: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          footer: "bg-white border-t border-gray-200"
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">แก้ไขข้อมูลสมาชิก</h3>
          </ModalHeader>
          <ModalBody>
            {editingMember && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                    <input
                      type="text"
                      placeholder="กรอกชื่อ"
                      value={editingMember.firstName}
                      onChange={(e) => setEditingMember({...editingMember, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล</label>
                    <input
                      type="text"
                      placeholder="กรอกนามสกุล"
                      value={editingMember.lastName}
                      onChange={(e) => setEditingMember({...editingMember, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    />
                  </div>
                </div>
                
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้งาน</label>
                   <input
                     type="text"
                     placeholder="กรอกชื่อผู้ใช้งาน"
                     value={editingMember.username}
                     onChange={(e) => setEditingMember({...editingMember, username: e.target.value})}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านใหม่</label>
                   <input
                     type="password"
                     placeholder="ใส่รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)"
                     onChange={(e) => setEditingMember({...editingMember, newPassword: e.target.value})}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                   />
                   <p className="text-xs text-gray-500 mt-1">เว้นว่างถ้าไม่ต้องการเปลี่ยนรหัสผ่าน</p>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Line</label>
                   <input
                     type="text"
                     placeholder="กรอก Line"
                     value={editingMember.lineId || ''}
                     onChange={(e) => setEditingMember({...editingMember, lineId: e.target.value})}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                   />
                 </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หน่วยงาน</label>
                  <Select
                    selectedKeys={[editingMember.department]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setEditingMember({...editingMember, department: selectedKey});
                    }}
                    classNames={{
                      trigger: "bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
                      value: "text-gray-900 font-medium",
                      listbox: "bg-white border border-gray-200 shadow-lg rounded-lg"
                    }}
                  >
                    {hospitalDepartments.map(dept => (
                      <SelectItem 
                        key={dept.name}
                        classNames={{
                          base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                          title: "text-gray-900 font-medium"
                        }}
                        startContent={
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                            {dept.name.charAt(0)}
                          </div>
                        }
                      >
                        {dept.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สิทธิการใช้งาน</label>
                  <Select
                    selectedKeys={[editingMember.role]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setEditingMember({...editingMember, role: selectedKey});
                    }}
                    classNames={{
                      trigger: "bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
                      value: "text-gray-900 font-medium",
                      listbox: "bg-white border border-gray-200 shadow-lg rounded-lg"
                    }}
                  >
                    {rolesOptions.map(role => (
                      <SelectItem 
                        key={role}
                        classNames={{
                          base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                          title: "text-gray-900 font-medium"
                        }}
                        startContent={
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                            {role.charAt(0)}
                          </div>
                        }
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                  <Select
                    selectedKeys={[editingMember.status]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setEditingMember({...editingMember, status: selectedKey});
                    }}
                    classNames={{
                      trigger: "bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
                      value: "text-gray-900 font-medium",
                      listbox: "bg-white border border-gray-200 shadow-lg rounded-lg"
                    }}
                  >
                    <SelectItem 
                      key="เปิดใช้งาน"
                      classNames={{
                        base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                        title: "text-gray-900 font-medium"
                      }}
                      startContent={
                        <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                          <EyeIcon className="w-4 h-4" />
                        </div>
                      }
                    >
                      เปิดใช้งาน
                    </SelectItem>
                    <SelectItem 
                      key="ปิดการใช้งาน"
                      classNames={{
                        base: "bg-white hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150",
                        title: "text-gray-900 font-medium"
                      }}
                      startContent={
                        <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          <EyeSlashIcon className="w-4 h-4" />
                        </div>
                      }
                    >
                      ปิดการใช้งาน
                    </SelectItem>
                  </Select>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditClose}>
              ยกเลิก
            </Button>
            <Button color="primary" onPress={handleSaveEdit}>
              บันทึก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
