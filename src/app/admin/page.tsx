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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import DepartmentChart from './components/DepartmentChart';

interface ApplicationData {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  age: number;
  race: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  idNumber: string;
  idCardIssuedAt: string;
  idCardIssueDate: string;
  idCardExpiryDate: string;
  addressAccordingToHouseRegistration: string;
  currentAddress: string;
  emergencyContact: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAddress: string;
  expectedPosition: string;
  department: string;
  missionGroupId?: string | null;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  
  // ข้อมูลส่วนตัวเพิ่มเติม
  birthDate?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender?: string;
  
  // ข้อมูลการสมัครงาน
  expectedSalary?: string;
  availableDate?: string;
  currentWork?: boolean;
  applicantSignature?: string;
  applicationDate?: string;
  
  // ข้อมูลการศึกษา
  education?: Array<{
    level: string;
    degree?: string;
    major: string;
    institution: string;
    school?: string;
    year?: string;
    endYear?: string;
    gpa?: string;
  }>;
  
  // ข้อมูลประสบการณ์ทำงาน
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    district?: string;
    province?: string;
    phone?: string;
    reason: string;
    description?: string;
    salary?: string;
  }>;
  
  // ข้อมูลการรับราชการก่อนหน้า
  previousGovernmentService?: Array<{
    position: string;
    department: string;
    reason: string;
    date: string;
    type?: string;
  }>;
  
  // ข้อมูลเพิ่มเติม
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  
  // ข้อมูลคู่สมรส
  spouseInfo?: {
    firstName: string;
    lastName: string;
  };
  
  // ข้อมูลที่ทำงานฉุกเฉิน
  emergencyWorkplace?: {
    name: string;
    district: string;
    province: string;
    phone: string;
  };
  
  // ข้อมูลที่อยู่ตามทะเบียนบ้าน
  registeredAddress?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phone?: string;
    mobile?: string;
  };
  
  // ข้อมูลที่อยู่ปัจจุบัน
  currentAddressDetail?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    homePhone: string;
    mobilePhone: string;
  };
  
  // ข้อมูลที่อยู่ฉุกเฉิน
  emergencyAddressDetail?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phone?: string;
  };
  
  // ข้อมูลสิทธิการรักษา
  medicalRights?: {
    hasUniversalHealthcare: boolean;
    universalHealthcareHospital: string;
    hasSocialSecurity: boolean;
    socialSecurityHospital: string;
    dontWantToChangeHospital: boolean;
    wantToChangeHospital: boolean;
    newHospital: string;
    hasCivilServantRights: boolean;
    otherRights: string;
  };
  
  // ข้อมูลเจ้าหน้าที่
  staffInfo?: {
    position: string;
    department: string;
    startWork: string;
  };
  
  // ข้อมูลเอกสาร
  documents?: {
    idCard?: string;
    houseRegistration?: string;
    militaryCertificate?: string;
    educationCertificate?: string;
    medicalCertificate?: string;
    drivingLicense?: string;
    nameChangeCertificate?: string;
    otherDocuments?: string[];
  };
}

export default function AdminPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [detailStatus, setDetailStatus] = useState<string>('');

  // ฟังก์ชันแปลงวันที่จาก ISO format เป็น d/m/Y
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };
  
  // Modal controls
  const { isOpen: isDetailModalOpen, onOpen: onDetailModalOpen, onOpenChange: onDetailModalOpenChange } = useDisclosure();
  const { isOpen: isPendingModalOpen, onOpen: onPendingModalOpen, onOpenChange: onPendingModalOpenChange } = useDisclosure();
  const { isOpen: isApprovedModalOpen, onOpen: onApprovedModalOpen, onOpenChange: onApprovedModalOpenChange } = useDisclosure();

  // สถิติ
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0
  });

  // ข้อมูลสำหรับกราฟ
  const [departmentData, setDepartmentData] = useState<Array<{
    department: string;
    count: number;
    color: string;
  }>>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 กำลังดึงข้อมูลใบสมัครงานจาก /api/resume-deposit...');
      
      // 🔒 Admin: Admin สามารถดูข้อมูลทั้งหมดได้ (ไม่กรองตาม user)
      const response = await fetch('/api/resume-deposit?admin=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Response Data:', responseData);
        
        // ตรวจสอบ response structure
        if (responseData.success && responseData.data) {
          const data = responseData.data;
          console.log('✅ ดึงข้อมูลสำเร็จ:', data);
          
          // จัดการรูปภาพโปรไฟล์เหมือนกับหน้า register
          const processedData = await Promise.all(data.map(async (app: ApplicationData) => {
            if (app.profileImage) {
              console.log('✅ ใช้ profileImage ที่มีอยู่:', app.profileImage);
              return app;
            } else if (app.id) {
              // ลองหารูปภาพตาม ID เหมือนกับหน้า register
              try {
                const jpgPath = `/api/image?file=profile_${app.id}.jpg`;
                console.log('🔍 ลองหา JPG path:', jpgPath);
                const jpgResponse = await fetch(jpgPath);
                if (jpgResponse.ok) {
                  console.log('✅ พบ JPG image:', jpgPath);
                  return { ...app, profileImage: jpgPath };
      } else {
                  const pngPath = `/api/image?file=profile_${app.id}.png`;
                  console.log('🔍 ลองหา PNG path:', pngPath);
                  const pngResponse = await fetch(pngPath);
                  if (pngResponse.ok) {
                    console.log('✅ พบ PNG image:', pngPath);
                    return { ...app, profileImage: pngPath };
                  } else {
                    console.log('❌ ไม่พบรูปภาพสำหรับ ID:', app.id);
                    return app;
                  }
      }
    } catch (error) {
                console.error('❌ เกิดข้อผิดพลาดในการหารูปภาพ:', error);
                return app;
              }
            }
            return app;
          }));
          
          setApplications(processedData);
          
          // คำนวณสถิติ
          const newStats = {
            total: processedData.length,
            pending: processedData.filter((app: ApplicationData) => 
              app.status === 'pending' || app.status === 'รอพิจารณา'
            ).length,
            approved: processedData.filter((app: ApplicationData) => 
              app.status === 'approved' || app.status === 'อนุมัติ'
            ).length
          };
          setStats(newStats);

          // สร้างข้อมูลสำหรับกราฟ
          const departmentCounts = processedData.reduce((acc, app) => {
            const dept = app.department || 'ไม่ระบุ';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          // สีสำหรับแต่ละฝ่าย
          const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-orange-500',
            'bg-teal-500',
            'bg-cyan-500'
          ];

          const chartData = Object.entries(departmentCounts).map(([department, count], index) => ({
            department,
            count: count as number,
            color: colors[index % colors.length]
          })).sort((a, b) => (b.count as number) - (a.count as number)); // เรียงตามจำนวนจากมากไปน้อย

          setDepartmentData(chartData);
          
        } else {
          console.error('❌ ไม่พบข้อมูลใน response:', responseData);
          setError('ไม่พบข้อมูลใบสมัครงาน');
        }
      } else {
        console.error('❌ การดึงข้อมูลล้มเหลว:', response.status, response.statusText);
        setError('ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาด:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  // รายการผู้สมัครที่รอพิจารณา
  const pendingApplications = applications.filter((app: ApplicationData) => {
    const s = (app.status || '').toLowerCase();
    return s === 'pending' || s === 'รอพิจารณา';
  });

  // รายการผู้สมัครที่อนุมัติ
  const approvedApplications = applications.filter((app: ApplicationData) => {
    const s = (app.status || '').toLowerCase();
    return s === 'approved' || s === 'hired' || s === 'อนุมัติ';
  });

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลใบสมัครงาน...</p>
            </div>
          </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchApplications}>ลองใหม่</Button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">ภาพรวมระบบจัดการใบสมัครงาน</p>
        </div>
        
          {/* สถิติ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">ทั้งหมด</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-blue-400 rounded-full p-3">
                <UsersIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-200" />
                </div>
          </div>
        </CardBody>
      </Card>

          <Card isPressable className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white cursor-pointer rounded-lg" onPress={onPendingModalOpen}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">รอพิจารณา</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
                <div className="bg-yellow-400 rounded-full p-3">
                <ClockIcon className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-200" />
                </div>
          </div>
            </CardBody>
          </Card>

          <Card isPressable className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg cursor-pointer" onPress={onApprovedModalOpen}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">อนุมัติ</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
                <div className="bg-green-400 rounded-full p-3">
                <CheckCircleIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-200" />
              </div>
            </div>
          </CardBody>
        </Card>
        </div>

        {/* กราฟแสดงจำนวนผู้สมัครตามฝ่าย */}
        <DepartmentChart data={departmentData} className="mb-8" />
            </div>
            
      {/* Pending Applications Modal */}
      <Modal 
        isOpen={isPendingModalOpen} 
        onOpenChange={onPendingModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-gray-50 rounded-2xl shadow-lg",
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-sm",
          header: "bg-gray-50 rounded-t-2xl",
          footer: "bg-gray-50 rounded-b-2xl"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                รายชื่อผู้สมัครที่สถานะ "รอพิจารณา"
              </ModalHeader>
              <ModalBody>
                <div className="text-center py-8">
                  <p className="text-gray-500">ไม่มีข้อมูลผู้สมัครที่รอพิจารณา</p>
            </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" onPress={onClose}>ปิด</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Approved Applications Modal */}
      <Modal 
        isOpen={isApprovedModalOpen} 
        onOpenChange={onApprovedModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-gray-50 rounded-2xl shadow-lg",
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-sm",
          header: "bg-gray-50 rounded-t-2xl",
          footer: "bg-gray-50 rounded-b-2xl"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                รายชื่อผู้สมัครที่สถานะ "อนุมัติ"
              </ModalHeader>
              <ModalBody>
                        <div className="text-center py-8">
                  <p className="text-gray-500">ไม่มีข้อมูลผู้สมัครที่อนุมัติ</p>
                          </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" onPress={onClose}>ปิด</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 