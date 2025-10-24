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
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  PrinterIcon,
  UserIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

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
  suggestion?: string;
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
  spouse_first_name?: string;
  spouse_last_name?: string;
  
  // ข้อมูลที่ทำงานฉุกเฉิน
  emergencyWorkplace?: {
    name: string;
    district: string;
    province: string;
    phone: string;
  };
  emergency_workplace_name?: string;
  emergency_workplace_district?: string;
  emergency_workplace_province?: string;
  emergency_workplace_phone?: string;
  
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
  address?: string;
  
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
  emergencyContactFirstName?: string;
  emergencyContactLastName?: string;
  
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

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // ฟิลเตอร์ ฝ่าย
  const [hospitalDepartments, setHospitalDepartments] = useState<Array<{ id: string; name: string; missionGroupId: string | null; positions: string }>>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [detailStatus, setDetailStatus] = useState<string>('');
  const [selectedPositionApplicants, setSelectedPositionApplicants] = useState<ApplicationData[]>([]);
  const [showPositionModal, setShowPositionModal] = useState(false);
  
  // Bulk status change state
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // ข้อเสนอแนะเพิ่มเติม
  const [suggestion, setSuggestion] = useState<string>('');
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination logic
  const getDepartmentPositions = () => {
    console.log('🔍 getDepartmentPositions - hospitalDepartments:', hospitalDepartments);
    console.log('🔍 getDepartmentPositions - applications:', applications);
    
    let filteredDepartments = hospitalDepartments;
    
    // กรองตามฝ่ายที่เลือก
    if (selectedDepartmentId && selectedDepartmentId !== '') {
      filteredDepartments = hospitalDepartments.filter(dept => dept.id === selectedDepartmentId);
      console.log('🔍 Filtered departments by selectedDepartmentId:', filteredDepartments);
    }
    
    const departmentPositions = filteredDepartments.map((dept, index) => {
      // หาผู้สมัครในฝ่ายนี้
      const applicantsInDept = applications.filter(app => 
        app.department === dept.name
      );
      console.log(`🔍 Department: ${dept.name}, Applicants:`, applicantsInDept);
      
      // ดึงตำแหน่งงานจาก departments แทนที่จะมาจาก applications
      const departmentPositions = dept.positions ? dept.positions.split(',').map(p => p.trim()).filter(p => p) : [];
      console.log(`🔍 Department: ${dept.name}, Positions from DB:`, departmentPositions);
      
      // นับจำนวนผู้สมัครตามตำแหน่ง
      const positionCounts = applicantsInDept.reduce((acc, app) => {
        const position = app.expectedPosition || 'ไม่ระบุ';
        acc[position] = (acc[position] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const result = {
        department: dept.name,
        positions: departmentPositions.length > 0 ? departmentPositions : Object.keys(positionCounts),
        positionCounts,
        totalApplicants: applicantsInDept.length,
        index: index + 1
      };
      
      console.log(`🔍 Final result for ${dept.name}:`, result);
      return result;
    });

    // กรองตามคำค้นหา
    if (searchTerm) {
      const filtered = departmentPositions.filter(dept => 
        dept.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.positions.some(position => 
          position.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      console.log('🔍 Filtered by search term:', filtered);
      return filtered;
    }

    console.log('🔍 Final departmentPositions:', departmentPositions);
    return departmentPositions;
  };

  const allDepartmentPositions = getDepartmentPositions();
  const totalPages = Math.ceil(allDepartmentPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = allDepartmentPositions.slice(startIndex, endIndex);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [hospitalDepartments, applications, searchTerm, selectedDepartmentId]);

  // ฟังก์ชันแปลงวันที่จาก ISO format เป็น d/m/Y (ปีไทย)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const thaiYear = year + 543; // แปลงเป็นปีไทย
      return `${day}/${month}/${thaiYear}`;
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

  useEffect(() => {
    fetchApplications();
  }, []);

  // โหลดตัวเลือกฝ่าย
  useEffect(() => {
    (async () => {
      try {
        console.log('🔄 กำลังดึงข้อมูลฝ่ายจาก /api/prisma/departments...');
        const res = await fetch('/api/prisma/departments?limit=1000', {
          cache: 'no-store', // ป้องกัน cache issues
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        console.log('📊 API Response:', json);
        
        if (json?.success && Array.isArray(json.data)) {
          const mappedData = json.data.map((d: any) => ({ 
            id: String(d.id), 
            name: d.name, 
            missionGroupId: d.missionGroupId || null,
            positions: d.positions || ''
          }));
          console.log('📋 Mapped Departments:', mappedData);
          setHospitalDepartments(mappedData);
        } else {
          console.error('❌ Failed to fetch departments:', json);
        }
      } catch (error) {
        console.error('❌ Error fetching departments:', error);
        // ไม่ต้อง set error state สำหรับ departments เพราะไม่ใช่ข้อมูลหลัก
      }
    })();
  }, []);


  const fetchApplications = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 กำลังดึงข้อมูลใบสมัครงานจาก /api/resume-deposit...', { retryCount });
      
      // 🔒 Admin: Admin สามารถดูข้อมูลทั้งหมดได้ (ไม่กรองตาม user)
      const apiUrl = '/api/resume-deposit?admin=true';
      console.log('🔍 API Request URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // ป้องกัน cache issues
      });
      
      console.log('🔍 API Response Status:', response.status, response.statusText);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Response Data:', responseData);
        
        // ตรวจสอบ response structure
        if (responseData.success && responseData.data) {
          const data = responseData.data;
          console.log('✅ ดึงข้อมูลสำเร็จ:', data);
          
          // จัดการรูปภาพโปรไฟล์และแปลงข้อมูลที่อยู่
          const processedData = await Promise.all(data.map(async (app: ApplicationData) => {
            // แปลงข้อมูลที่อยู่ตามทะเบียนบ้าน
            const registeredAddress = {
              houseNumber: (app as any).house_registration_house_number || '',
              villageNumber: (app as any).house_registration_village_number || '',
              alley: (app as any).house_registration_alley || '',
              road: (app as any).house_registration_road || '',
              subDistrict: (app as any).house_registration_sub_district || '',
              district: (app as any).house_registration_district || '',
              province: (app as any).house_registration_province || '',
              postalCode: (app as any).house_registration_postal_code || '',
              phone: (app as any).house_registration_phone || '',
              mobile: (app as any).house_registration_mobile || ''
            };

            // แปลงข้อมูลที่อยู่ปัจจุบัน
            const currentAddressDetail = {
              houseNumber: (app as any).current_address_house_number || '',
              villageNumber: (app as any).current_address_village_number || '',
              alley: (app as any).current_address_alley || '',
              road: (app as any).current_address_road || '',
              subDistrict: (app as any).current_address_sub_district || '',
              district: (app as any).current_address_district || '',
              province: (app as any).current_address_province || '',
              postalCode: (app as any).current_address_postal_code || '',
              homePhone: (app as any).current_address_phone || '',
              mobilePhone: (app as any).current_address_mobile || ''
            };

            // แปลงข้อมูลที่อยู่ฉุกเฉิน
            const emergencyAddressDetail = {
              houseNumber: (app as any).emergency_address_house_number || '',
              villageNumber: (app as any).emergency_address_village_number || '',
              alley: (app as any).emergency_address_alley || '',
              road: (app as any).emergency_address_road || '',
              subDistrict: (app as any).emergency_address_sub_district || '',
              district: (app as any).emergency_address_district || '',
              province: (app as any).emergency_address_province || '',
              postalCode: (app as any).emergency_address_postal_code || '',
              phone: (app as any).emergency_address_phone || ''
            };

            // แปลงข้อมูลคู่สมรส
            const spouseInfo = {
              firstName: (app as any).spouse_first_name || '',
              lastName: (app as any).spouse_last_name || ''
            };

            // แปลงข้อมูลที่ทำงานฉุกเฉิน
            const emergencyWorkplace = {
              name: (app as any).emergency_workplace_name || '',
              district: (app as any).emergency_workplace_district || '',
              province: (app as any).emergency_workplace_province || '',
              phone: (app as any).emergency_workplace_phone || ''
            };

            // แปลงข้อมูลสิทธิการรักษา
            const medicalRights = {
              hasUniversalHealthcare: (app as any).medical_rights_has_universal_healthcare || false,
              universalHealthcareHospital: (app as any).medical_rights_universal_healthcare_hospital || '',
              hasSocialSecurity: (app as any).medical_rights_has_social_security || false,
              socialSecurityHospital: (app as any).medical_rights_social_security_hospital || '',
              dontWantToChangeHospital: (app as any).medical_rights_dont_want_to_change_hospital || false,
              wantToChangeHospital: (app as any).medical_rights_want_to_change_hospital || false,
              newHospital: (app as any).medical_rights_new_hospital || '',
              hasCivilServantRights: (app as any).medical_rights_has_civil_servant_rights || false,
              otherRights: (app as any).medical_rights_other_rights || ''
            };

            // แปลงข้อมูลเจ้าหน้าที่
            const staffInfo = {
              position: (app as any).staff_position || '',
              department: (app as any).staff_department || '',
              startWork: (app as any).staff_start_work || ''
            };

            // สร้างออบเจ็กต์ที่แปลงแล้ว
            const transformedApp = {
              ...app,
              registeredAddress,
              currentAddressDetail,
              emergencyAddressDetail,
              spouseInfo,
              emergencyWorkplace,
              medicalRights,
              staffInfo,
              emergencyContactFirstName: (app as any).emergencyContactFirstName || '',
              emergencyContactLastName: (app as any).emergencyContactLastName || ''
            };

            if (transformedApp.profileImage) {
              console.log('✅ ใช้ profileImage ที่มีอยู่:', transformedApp.profileImage);
              return transformedApp;
            } else if (transformedApp.id) {
              // ลองหารูปภาพตาม ID เหมือนกับหน้า register
              try {
                const jpgPath = `/api/image?file=profile_${transformedApp.id}.jpg`;
                console.log('🔍 ลองหา JPG path:', jpgPath);
                const jpgResponse = await fetch(jpgPath);
                if (jpgResponse.ok) {
                  console.log('✅ พบ JPG image:', jpgPath);
                  return { ...transformedApp, profileImage: jpgPath };
                } else {
                  const pngPath = `/api/image?file=profile_${transformedApp.id}.png`;
                  console.log('🔍 ลองหา PNG path:', pngPath);
                  const pngResponse = await fetch(pngPath);
                  if (pngResponse.ok) {
                    console.log('✅ พบ PNG image:', pngPath);
                    return { ...transformedApp, profileImage: pngPath };
                  } else {
                    console.log('❌ ไม่พบรูปภาพสำหรับ ID:', transformedApp.id);
                    return transformedApp;
                  }
                }
              } catch (error) {
                console.error('❌ เกิดข้อผิดพลาดในการหารูปภาพ:', error);
                return transformedApp;
              }
            }
            return transformedApp;
          }));
          
          setApplications(processedData);
          
          // คำนวณสถิติ
          console.log('📊 Processing data for stats:', processedData.length, 'applications');
          
          const approvedCount = processedData.filter((app: ApplicationData) => 
            app.status === 'approved' || app.status === 'ผ่านการพิจารณา' || app.status === 'HIRED'
          ).length;
          
          const pendingCount = processedData.filter((app: ApplicationData) => 
            app.status === 'pending' || app.status === 'รอพิจารณา' || app.status === 'PENDING'
          ).length;
          
          const newStats = {
            total: processedData.length,
            pending: pendingCount,
            approved: approvedCount
          };
          
          console.log('📊 Stats calculation:', {
            total: newStats.total,
            pending: newStats.pending,
            approved: newStats.approved,
            approvedCount: approvedCount,
            pendingCount: pendingCount,
            allStatuses: processedData.map(app => ({ id: app.id, status: app.status }))
          });
          
          setStats(newStats);
          console.log('📊 Stats updated:', newStats);
          
        } else {
          console.error('❌ ไม่พบข้อมูลใน response:', responseData);
          setError('ไม่พบข้อมูลใบสมัครงาน');
        }
      } else {
        console.error('❌ การดึงข้อมูลล้มเหลว:', response.status, response.statusText);
        
        // ลองดึง error message จาก response
        try {
          const errorData = await response.json();
          console.error('❌ Error response data:', errorData);
          setError(`ไม่สามารถดึงข้อมูลได้: ${errorData.message || response.statusText}`);
        } catch (parseError) {
          console.error('❌ Cannot parse error response:', parseError);
          setError(`ไม่สามารถดึงข้อมูลได้: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาด:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        if (retryCount < 2) {
          console.log(`🔄 ลองใหม่อีกครั้ง (${retryCount + 1}/2)...`);
          setTimeout(() => {
            fetchApplications(retryCount + 1);
          }, 1000 * (retryCount + 1)); // เพิ่ม delay ตามจำนวนครั้งที่ลอง
          return;
        }
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      } else {
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    } finally {
      setLoading(false);
    }
  };

  // ฟิลเตอร์ข้อมูล
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // ข้อมูลสำหรับ modal
  const pendingApplications = applications.filter(app => 
    app.status === 'pending' || app.status === 'รอพิจารณา'
  );
  
  const approvedApplications = applications.filter(app => 
    app.status === 'approved' || app.status === 'ผ่านการพิจารณา'
  );

  const handleViewDetails = (application: ApplicationData) => {
    console.log('🔍 handleViewDetails - Setting selectedApplication:', {
      id: application.id,
      status: application.status,
      name: `${application.firstName} ${application.lastName}`
    });
    setSelectedApplication(application);
    // ตั้งค่าสถานะให้ตรงกับข้อมูลปัจจุบัน
    const currentStatus = application.status === 'approved' || application.status === 'ผ่านการพิจารณา' ? 'approved' : 'pending';
    setDetailStatus(currentStatus);
    console.log('🔍 handleViewDetails - Set detailStatus to:', currentStatus);
    onDetailModalOpen();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedApplication) return;
    
    console.log('🔄 กำลังเปลี่ยนสถานะ:', {
      applicationId: selectedApplication.id,
      newStatus: newStatus,
      currentStatus: selectedApplication.status
    });
    
    try {
      const requestBody = { status: newStatus };
      console.log('📤 Sending status change request:', {
        applicationId: selectedApplication.id,
        requestBody: requestBody,
        newStatus: newStatus,
        currentStatus: selectedApplication.status,
        detailStatus: detailStatus
      });
      
      const response = await fetch(`/api/resume-deposit/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 API Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Success:', result);
        
        // อัปเดตสถานะใน state
        setApplications(prev => {
          const updated = prev.map(app => 
            app.id === selectedApplication.id 
              ? { ...app, status: newStatus }
              : app
          );
          console.log('🔍 Updated applications state:', {
            oldStatus: selectedApplication.status,
            newStatus: newStatus,
            updatedApp: updated.find(app => app.id === selectedApplication.id),
            totalApps: updated.length
          });
          return updated;
        });
        
        // อัปเดตสถานะใน modal และ selectedApplication
        setDetailStatus(newStatus);
        setSelectedApplication(prev => {
          const updated = prev ? { ...prev, status: newStatus } : null;
          console.log('🔍 Updated selectedApplication:', {
            prev: prev,
            updated: updated,
            newStatus: newStatus,
            prevStatus: prev?.status
          });
          return updated;
        });
        
        // ปิด modal หลังจากเปลี่ยนสถานะสำเร็จ
        onDetailModalOpenChange();
        
        // อัปเดต stats หลังจากเปลี่ยนสถานะ
        setStats(prevStats => {
          const oldStatus = selectedApplication.status;
          const isNewApproved = newStatus === 'approved' || newStatus === 'ผ่านการพิจารณา' || newStatus === 'HIRED';
          const isOldApproved = oldStatus === 'approved' || oldStatus === 'ผ่านการพิจารณา' || oldStatus === 'HIRED';
          const isNewPending = newStatus === 'pending' || newStatus === 'รอพิจารณา' || newStatus === 'PENDING';
          const isOldPending = oldStatus === 'pending' || oldStatus === 'รอพิจารณา' || oldStatus === 'PENDING';
          
          const newStats = {
            ...prevStats,
            approved: isNewApproved && !isOldApproved 
              ? prevStats.approved + 1 
              : !isNewApproved && isOldApproved
              ? prevStats.approved - 1
              : prevStats.approved,
            pending: isNewPending && !isOldPending
              ? prevStats.pending + 1
              : !isNewPending && isOldPending
              ? prevStats.pending - 1
              : prevStats.pending
          };
          
          console.log('📊 Stats updated after status change:', {
            prevStats,
            newStats,
            oldStatus,
            newStatus,
            isNewApproved,
            isOldApproved,
            isNewPending,
            isOldPending
          });
          return newStats;
        });
        
        // รีเฟรชข้อมูลเพื่อให้แน่ใจว่าข้อมูลเป็นปัจจุบัน
        console.log('✅ Status updated successfully, refreshing data...');
        await fetchApplications();
        
        // ส่งสัญญาณให้ dashboard รีเฟรชข้อมูลสถิติ
        localStorage.setItem('statusChanged', 'true');
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'statusChanged',
          newValue: 'true',
          storageArea: localStorage
        }));
        
        alert(`เปลี่ยนสถานะเป็น "${newStatus}" สำเร็จ`);
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถเปลี่ยนสถานะได้'}`);
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  // ฟังก์ชันจัดการการเลือกหลายรายการ
  const handleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  // ฟังก์ชันเปลี่ยนสถานะหลายคนพร้อมกัน
  const handleBulkStatusChange = async () => {
    if (selectedApplications.length === 0 || !bulkStatus) return;
    
    try {
      const promises = selectedApplications.map(id => 
        fetch(`/api/resume-deposit/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: bulkStatus }),
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(response => response.ok).length;
      
      if (successCount > 0) {
        // อัปเดตสถานะใน state
        setApplications(prev => 
          prev.map(app => 
            selectedApplications.includes(app.id)
              ? { ...app, status: bulkStatus }
              : app
          )
        );
        
        // รีเซ็ตการเลือก
        setSelectedApplications([]);
        setBulkStatus('');
        setShowBulkModal(false);
        
        // รีเฟรชข้อมูล
        fetchApplications();
        
        // ส่งสัญญาณให้ dashboard รีเฟรชข้อมูลสถิติ
        localStorage.setItem('statusChanged', 'true');
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'statusChanged',
          newValue: 'true',
          storageArea: localStorage
        }));
        
        alert(`เปลี่ยนสถานะสำเร็จ ${successCount} รายการ`);
      }
    } catch (error) {
      console.error('Error updating bulk status:', error);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  // บันทึกข้อเสนอแนะเพิ่มเติม
  const handleSaveSuggestion = async () => {
    if (!selectedApplication || !suggestion.trim()) {
      alert('กรุณาใส่ข้อเสนอแนะ');
      return;
    }

    try {
      console.log('💾 บันทึกข้อเสนอแนะ:', {
        applicationId: selectedApplication.id,
        suggestion: suggestion.trim()
      });

      const response = await fetch(`/api/resume-deposit/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          suggestion: suggestion.trim() 
        }),
        cache: 'no-store',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ บันทึกข้อเสนอแนะสำเร็จ:', result);
        
        // อัปเดตข้อมูลใน state
        setApplications(prev => 
          prev.map(app => 
            app.id === selectedApplication.id 
              ? { ...app, suggestion: suggestion.trim() }
              : app
          )
        );
        
        // อัปเดต selectedApplication
        setSelectedApplication(prev => 
          prev ? { ...prev, suggestion: suggestion.trim() } : null
        );
        
        alert('บันทึกข้อเสนอแนะสำเร็จ');
        setShowSuggestionModal(false);
        setSuggestion('');
      } else {
        const errorData = await response.json();
        console.error('❌ Error saving suggestion:', errorData);
        alert(`เกิดข้อผิดพลาด: ${errorData.message || 'ไม่สามารถบันทึกข้อเสนอแนะได้'}`);
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchApplications()}>ลองใหม่</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">จัดการผู้สมัคร</h1>
        <p className="text-gray-600">ดูและจัดการข้อมูลผู้สมัครงานทั้งหมด</p>
      </div>

      {/* สถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200 rounded-lg shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center">
              <UsersIcon className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm text-blue-600 font-medium">ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-800">
                  {(() => {
                    console.log('📊 Stats card - total count:', stats.total);
                    return stats.total;
                  })()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200 rounded-lg shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm text-orange-600 font-medium">รอพิจารณา</p>
                <p className="text-2xl font-bold text-orange-800">
                  {(() => {
                    console.log('📊 Stats card - pending count:', stats.pending);
                    return stats.pending;
                  })()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-green-50 border-green-200 rounded-lg shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-600 font-medium">ผ่านการพิจารณา</p>
                <p className="text-2xl font-bold text-green-800">
                  {(() => {
                    console.log('📊 Stats card - approved count:', stats.approved);
                    console.log('📊 Stats card - full stats object:', stats);
                    console.log('📊 Stats card - applications length:', applications.length);
                    return stats.approved;
                  })()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ตัวกรอง */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* ค้นหา */}
            <Input
              placeholder="ค้นหาชื่อฝ่าย,ตำแหน่งที่เปิดรับ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              className="max-w-sm bg-white rounded-lg shadow-sm"
            />
  
            {/* กรองฝ่าย */}
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="max-w-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">ทั้งหมด</option>
              {hospitalDepartments.map((dept) => (
                <option
                className="bg-white hover:bg-gray-100 rounded-lg"
                key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            
            {/* ปุ่มรีเซ็ต */}
            <Button
              color="default"
              variant="flat"
              onPress={() => {
                setSearchTerm('');
                setSelectedDepartmentId('');
                setCurrentPage(1);
              }}
              className="max-w-24 bg-white text-gray-400 rounded-lg shadow-sm"
            >
              ล้างตัวกรอง
            </Button>
            
            {/* ปุ่มเปลี่ยนสถานะหลายคน */}
            {selectedApplications.length > 0 && (
              <Button
                color="warning"
                variant="solid"
                onPress={() => setShowBulkModal(true)}
                className="max-w-sm"
              >
                เปลี่ยนสถานะ ({selectedApplications.length} รายการ)
              </Button>
            )}
          </div>
 
        </CardBody>
      </Card>

      {/* ตารางข้อมูล */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* <CardHeader className="bg-gray-50 rounded-t-lg border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">ฝ่ายที่เปิดรับสมัคร</h2>
        </CardHeader> */}
        <CardBody className="p-0">
          <Table aria-label="Departments table" className="bg-white">
            <TableHeader className="bg-gray-100">
              <TableColumn className="bg-gray-100 text-gray-700 font-semibold rounded-l-lg">ลำดับ</TableColumn>
              <TableColumn className="bg-gray-100 text-gray-700 font-semibold">ฝ่าย</TableColumn>
              <TableColumn className="bg-gray-100 text-gray-700 font-semibold">ตำแหน่งที่เปิดรับ</TableColumn>
              <TableColumn className="bg-gray-100 text-gray-700 font-semibold">จำนวนที่เปิดรับ</TableColumn>
              <TableColumn className="bg-gray-100 text-gray-700 font-semibold">จำนวนผู้สมัคร</TableColumn>
              <TableColumn className="bg-gray-100 text-gray-700 font-semibold rounded-r-lg">การดำเนินการ</TableColumn>
            </TableHeader>
            <TableBody emptyContent="ไม่พบรายการ">
              {currentPageData.map((dept) => (
                  <TableRow key={dept.department} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="bg-white border-b border-gray-200">
                      <p className="font-medium text-gray-800">{dept.index}</p>
                    </TableCell>
                    <TableCell className="bg-white border-b border-gray-200">
                      <p className="text-gray-700 font-medium">{dept.department}</p>
                    </TableCell>
                    <TableCell className="bg-white border-b border-gray-200">
                      <div className="space-y-1">
                        {dept.positions.map((position, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{position}</span>
                            
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white border-b border-gray-200">
                      <div className="text-center">
                        <span className="text-lg font-bold text-green-600">
                          {dept.positions.length}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">ตำแหน่ง</span>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white border-b border-gray-200">
                      <div className="text-center">
                        <span className="text-lg font-bold text-blue-600">
                          {dept.totalApplicants}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">คน</span>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onPress={() => {
                            // แสดงรายชื่อผู้สมัครในฝ่ายนี้
                            const applicantsInDept = filteredApplications.filter(app => 
                              app.department === dept.department
                            );
                            setSelectedPositionApplicants(applicantsInDept);
                            setShowPositionModal(true);
                          }}
                        >
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          
          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8 py-4 bg-white rounded-b-lg border-t border-gray-200">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                ‹
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - currentPage) <= 1

                if (!shouldShow) {
                  // Show ellipsis
                  if (pageNum === 2 && currentPage > 4) {
                    return (
                      <span key={pageNum} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 3) {
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                ›
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onOpenChange={onDetailModalOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-white rounded-2xl shadow-lg",
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-sm",
          header: "bg-gray-50 rounded-t-2xl",
          footer: "bg-gray-50 rounded-b-2xl"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              
              <ModalBody>
                {selectedApplication && (
                  <div className="space-y-8">
                    {/* ข้อมูลส่วนตัว */}
                    <Card className="shadow-xl border-0 rounded-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white relative overflow-hidden rounded-t-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                              <UserIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-semibold align-middle">ข้อมูลส่วนตัว</h2>
                          </div>
                          {selectedApplication.status === 'HIRED' && (
                            <Chip
                              color="success"
                              variant="flat"
                              className="bg-green-100 text-green-800 border-green-300 "
                            >
                              ผ่านการพิจารณา
                            </Chip>
                          )}
                        </div>
                      </CardHeader>
                      <CardBody className="p-8">
                        {/* ๑. ประวัติส่วนตัว */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                            ๑. ประวัติส่วนตัว
                          </h3>
                          
                          {/* รูปโปรไฟล์ */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              รูปโปรไฟล์
                            </h4>
                            
                            <div className="flex justify-center mb-6">
                              <div className="relative">
                                <img
                                  src={selectedApplication.profileImage ? 
                                    (selectedApplication.profileImage.startsWith('http') ?
                                      selectedApplication.profileImage :
                                      `/api/image?file=${encodeURIComponent(selectedApplication.profileImage)}`) :
                                    `/api/image?file=profile_${selectedApplication.id}.jpg`
                                  }
                                  alt="รูปโปรไฟล์"
                                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                                  onError={(e) => {
                                    console.log('❌ Profile image load error, trying PNG:', selectedApplication.id);
                                    e.currentTarget.src = `/api/image?file=profile_${selectedApplication.id}.png`;
                                    e.currentTarget.onerror = () => {
                                      console.log('❌ No profile image found for ID:', selectedApplication.id);
                                      e.currentTarget.style.display = 'none';
                                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.classList.remove('hidden');
                                    };
                                  }}
                                  onLoad={() => {
                                    console.log('✅ Profile image loaded:', selectedApplication.id);
                                  }}
                                />
                                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 shadow-lg flex items-center justify-center hidden">
                                  <UserIcon className="w-16 h-16 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ๑.๑ ชื่อ (นาย/นาง/นางสาว) */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๑.๑ ชื่อ (นาย/นาง/นางสาว)
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">คำนำหน้า</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.prefix || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ชื่อ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.firstName || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">นามสกุล</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.lastName || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">วัน เดือน ปีเกิด</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {formatDateForDisplay(selectedApplication.birthDate || '') || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">อายุ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.age || '-'} ปี
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">เพศ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {(() => {
                                    const gender = selectedApplication.gender;
                                    if (gender === 'MALE') return 'ชาย';
                                    if (gender === 'FEMALE') return 'หญิง';
                                    if (gender === 'ชาย') return 'ชาย';
                                    if (gender === 'หญิง') return 'หญิง';
                                    return gender || '-';
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ๑.๒ สถานภาพทางครอบครัว */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๑.๒ สถานภาพทางครอบครัว
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">สถานภาพ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {(() => {
                                    const status = selectedApplication.maritalStatus;
                                    if (status === 'SINGLE') return 'โสด';
                                    if (status === 'MARRIED') return 'สมรส';
                                    if (status === 'DIVORCED') return 'หย่า';
                                    if (status === 'WIDOWED') return 'หม้าย';
                                    if (status === 'UNKNOWN') return 'ไม่ระบุ';
                                    if (status === 'โสด') return 'โสด';
                                    if (status === 'สมรส') return 'สมรส';
                                    if (status === 'หย่า') return 'หย่า';
                                    if (status === 'หม้าย') return 'หม้าย';
                                    return status || '-';
                                  })()}
                                </div>
                              </div>
                              {(selectedApplication.maritalStatus === 'MARRIED' || selectedApplication.maritalStatus === 'สมรส') && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">ชื่อ-สกุล คู่สมรส</label>
                                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                    {selectedApplication.spouse_first_name} {selectedApplication.spouse_last_name}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ๑.๓ เลขบัตรประชาชน */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๑.๓ เลขบัตรประชาชน
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">เลขบัตรประชาชน</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.idNumber || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ออกโดย</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.idCardIssuedAt || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">วันที่ออกบัตร</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {formatDateForDisplay(selectedApplication.idCardIssueDate || '') || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">วันที่บัตรหมดอายุ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {formatDateForDisplay(selectedApplication.idCardExpiryDate || '') || '-'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ๑.๔ ข้อมูลส่วนตัวเพิ่มเติม */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๑.๔ ข้อมูลส่วนตัวเพิ่มเติม
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">เชื้อชาติ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.race || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">สัญชาติ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.nationality || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ศาสนา</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.religion || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">สถานที่เกิด</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.placeOfBirth || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">จังหวัดที่เกิด</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.placeOfBirthProvince || '-'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ๑.๔ ที่อยู่ตามทะเบียนบ้าน */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๑.๔ ที่อยู่ตามทะเบียนบ้าน
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">บ้านเลขที่</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.houseNumber || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">หมู่ที่</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.villageNumber || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ตรอก/ซอย</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.alley || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ถนน</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.road || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ตำบล/แขวง</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.subDistrict || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.district || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.province || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.postalCode || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.phone || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.registeredAddress?.mobile || '-'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ๑.๕ ที่อยู่ปัจจุบัน */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๑.๕ ที่อยู่ปัจจุบัน
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">บ้านเลขที่</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.houseNumber || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">หมู่ที่</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.villageNumber || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ตรอก/ซอย</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.alley || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ถนน</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.road || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ตำบล/แขวง</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.subDistrict || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.district || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.province || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.postalCode || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.homePhone || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.currentAddressDetail?.mobilePhone || '-'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* ๒. ข้อมูลการติดต่อ */}
                    <Card className="shadow-xl border-0 rounded-lg">
                      <CardHeader className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <UsersIcon className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-semibold">ข้อมูลการติดต่อ</h2>
                        </div>
                      </CardHeader>
                      <CardBody className="p-8">
                        {/* ๒. ข้อมูลการติดต่อ */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                            ๒. ข้อมูลการติดต่อ
                          </h3>
                          
                          {/* ๒.๑ บุคคลที่สามารถติดต่อได้ทันที */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๒.๑ บุคคลที่สามารถติดต่อได้ทันที
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md ">
                                  {selectedApplication.emergencyContactFirstName} {selectedApplication.emergencyContactLastName}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ความสัมพันธ์</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.emergencyRelationship || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.emergencyPhone || '-'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ๒.๒ ข้อมูลสถานที่ทำงานผู้ติดต่อฉุกเฉิน */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                              ๒.๒ ข้อมูลสถานที่ทำงานผู้ติดต่อฉุกเฉิน
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ชื่อสถานที่ทำงาน</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.emergency_workplace_name || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.emergency_workplace_district || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.emergency_workplace_province || '-'}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">โทรศัพท์</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                  {selectedApplication.emergency_workplace_phone || '-'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* ๒. ความรู้ ความสามารถ/ทักษะพิเศษ */}
                    <Card className="shadow-xl border-0 rounded-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <DocumentTextIcon className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-semibold">ความรู้ ความสามารถ และทักษะพิเศษ</h2>
                        </div>
                      </CardHeader>
                      <CardBody className="p-8">
                        {/* ๒. ความรู้ ความสามารถ/ทักษะพิเศษ */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                            ๒. ความรู้ ความสามารถ/ทักษะพิเศษ
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">ความรู้ ความสามารถ และทักษะพิเศษ</label>
                              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[80px]">
                                {selectedApplication.skills || '-'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">ภาษาที่ใช้ได้</label>
                              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                {selectedApplication.languages || '-'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">ทักษะคอมพิวเตอร์</label>
                              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                {selectedApplication.computerSkills || '-'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">ใบรับรอง</label>
                              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                {selectedApplication.certificates || '-'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">ข้อมูลอ้างอิง</label>
                              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                {selectedApplication.references || '-'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* ๓. ข้อมูลการสมัคร */}
                    <Card className="shadow-xl border-0 rounded-lg">
                      <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <BriefcaseIcon className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-semibold">ข้อมูลการสมัคร</h2>
                        </div>
                      </CardHeader>
                      <CardBody className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ตำแหน่งที่สมัคร</label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                              {selectedApplication.expectedPosition || '-'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ฝ่าย</label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                              {selectedApplication.department || '-'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">เงินเดือนที่คาดหวัง</label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                              {selectedApplication.expectedSalary || '-'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">วันที่พร้อมเริ่มงาน</label>
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                              {formatDateForDisplay(selectedApplication.availableDate || '') || '-'}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* ไฟล์แนบ */}
                    <Card className="shadow-xl border-0 rounded-lg">
                      <CardHeader className="bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-slate-400/20"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <DocumentTextIcon className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-semibold">ไฟล์แนบ</h2>
                        </div>
                      </CardHeader>
                      <CardBody className="p-8">
                        {selectedApplication.documents ? (
                          <div className="space-y-3">
                            {Object.entries(selectedApplication.documents).map(([key, value], index) => {
                              if (!value || (Array.isArray(value) && value.length === 0)) return null;
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center gap-3">
                                    <DocumentTextIcon className="w-5 h-5 text-blue-500" />
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {key === 'idCard' && 'บัตรประจำตัวประชาชน'}
                                        {key === 'houseRegistration' && 'ทะเบียนบ้าน'}
                                        {key === 'militaryCertificate' && 'ใบรับรองทหาร'}
                                        {key === 'educationCertificate' && 'ใบรับรองการศึกษา'}
                                        {key === 'medicalCertificate' && 'ใบรับรองแพทย์'}
                                        {key === 'drivingLicense' && 'ใบขับขี่'}
                                        {key === 'nameChangeCertificate' && 'ใบเปลี่ยนชื่อ'}
                                        {key === 'otherDocuments' && 'เอกสารอื่นๆ'}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {Array.isArray(value) ? `${value.length} ไฟล์` : '1 ไฟล์'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      color="primary"
                                      variant="flat"
                                      startContent={<EyeIcon className="w-4 h-4" />}
                                      onPress={() => {
                                        if (Array.isArray(value)) {
                                          value.forEach((filePath: string) => {
                                            window.open(`/api/image?path=${encodeURIComponent(filePath)}`, '_blank');
                                          });
                                        } else if (typeof value === 'string') {
                                          window.open(`/api/image?path=${encodeURIComponent(value)}`, '_blank');
                                        }
                                      }}
                                    >
                                      ดู
                                    </Button>
                                    <Button
                                      size="sm"
                                      color="default"
                                      variant="flat"
                                      startContent={<PrinterIcon className="w-4 h-4" />}
                                      onPress={() => {
                                        if (Array.isArray(value)) {
                                          value.forEach((filePath: string) => {
                                            window.open(`/api/image?path=${encodeURIComponent(filePath)}`, '_blank');
                                          });
                                        } else if (typeof value === 'string') {
                                          window.open(`/api/image?path=${encodeURIComponent(value)}`, '_blank');
                                        }
                                      }}
                                    >
                                      พิมพ์
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>ไม่มีไฟล์แนบ</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>

                    {/* การเปลี่ยนสถานะ */}
                    <Card className="shadow-xl border-0">
                      <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <DocumentTextIcon className="w-6 h-6" />
                          </div>
                          <h2 className="text-xl font-semibold">การจัดการสถานะ</h2>
                        </div>
                      </CardHeader>
                      <CardBody className="p-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 min-w-[100px]">
                              สถานะปัจจุบัน:
                            </label>
                            <Chip
                              color={selectedApplication?.status === 'approved' || selectedApplication?.status === 'ผ่านการพิจารณา' || selectedApplication?.status === 'HIRED' ? 'success' : 'warning'}
                              variant="flat"
                              className={`font-medium ${
                                selectedApplication?.status === 'approved' || selectedApplication?.status === 'ผ่านการพิจารณา' || selectedApplication?.status === 'HIRED' 
                                  ? 'bg-green-100 text-green-800 border-green-300' 
                                  : 'bg-orange-100 text-orange-800 border-orange-300'
                              }`}
                            >
                              {(() => {
                                const status = selectedApplication?.status;
                                console.log('🔍 Chip rendering - selectedApplication.status:', status);
                                console.log('🔍 Chip rendering - selectedApplication object:', selectedApplication);
                                const displayText = status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED' ? 'ผ่านการพิจารณา' : 'รอพิจารณา';
                                console.log('🔍 Chip rendering - displayText:', displayText);
                                return displayText;
                              })()}
                            </Chip>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 min-w-[100px]">
                              เปลี่ยนเป็น:
                            </label>
                          <Select
                              placeholder="เลือกสถานะใหม่"
                            selectedKeys={detailStatus ? [detailStatus] : []}
                            onSelectionChange={(keys) => {
                              const key = Array.from(keys)[0] as string;
                              console.log('🔍 Select onSelectionChange - Setting detailStatus:', key);
                              setDetailStatus(key || '');
                            }}
                            className="max-w-xs bg-white rounded-lg shadow-sm"
                              variant="bordered"
                            classNames={{
                              trigger: "bg-white border-gray-300",
                              value: "text-gray-900",
                              popover: "bg-white",
                              listbox: "bg-white"
                            }}
                          >
                            <SelectItem key="pending" className="bg-white hover:bg-gray-50">รอพิจารณา</SelectItem>
                              <SelectItem key="approved" className="bg-white hover:bg-gray-50">ผ่านการพิจารณา</SelectItem>

                          </Select>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                          <Button
                            color="primary"
                            onPress={() => {
                              console.log('🔍 Save button clicked - detailStatus:', detailStatus);
                              console.log('🔍 Save button clicked - selectedApplication:', selectedApplication);
                              handleStatusChange(detailStatus);
                            }}
                              className="min-w-[120px]"
                            >
                              บันทึกการเปลี่ยนแปลง
                            </Button>
                            <Button
                              color="default"
                              variant="light"
                              onPress={() => setDetailStatus(selectedApplication?.status || 'pending')}
                            >
                              ยกเลิก
                          </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button 
                    color="secondary" 
                    variant="bordered" 
                    onPress={() => {
                      setSuggestion(selectedApplication?.suggestion || '');
                      setShowSuggestionModal(true);
                    }}
                    startContent={<DocumentTextIcon className="w-4 h-4" />}
                  >
                    ข้อเสนอแนะ
                  </Button>
                  <Button color="primary" variant="solid" onPress={onClose}>ปิด</Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                <Table aria-label="Pending applications table">
                  <TableHeader className="bg-gray-100 rounded-t-lg">
                    <TableColumn className="bg-gray-100 rounded-t-lg">
                      <input
                        type="checkbox"
                        checked={selectedApplications.length === pendingApplications.length && pendingApplications.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableColumn>
                    <TableColumn className="bg-gray-100 rounded-t-lg">ชื่อ-นามสกุล</TableColumn>
                    <TableColumn className="bg-gray-100 ">ตำแหน่งที่สมัคร</TableColumn>
                    <TableColumn className="bg-gray-100 ">กลุ่มงาน</TableColumn>
                    <TableColumn className="bg-gray-100 ">ฝ่าย</TableColumn>
                    <TableColumn className="bg-gray-100 ">วันที่สมัคร</TableColumn>
                    <TableColumn className="bg-gray-100 rounded-t-lg">การดำเนินการ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="ไม่พบรายการ">
                    {pendingApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(application.id)}
                            onChange={() => handleSelectApplication(application.id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {application.profileImage ? (
                              <img
                                src={application.profileImage}
                                alt="รูปภาพโปรไฟล์"
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm "
                              />
                            ) : (
                              <Avatar
                                name={`${application.firstName} ${application.lastName}`}
                                size="sm"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {application.prefix} {application.firstName} {application.lastName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{application.expectedPosition}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">-</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">{application.department}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {formatDateForDisplay(application.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onPress={() => handleViewDetails(application)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                รายชื่อผู้สมัครที่สถานะ "ผ่านการพิจารณา"
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Approved applications table">
                  <TableHeader className="bg-gray-100 ">
                    <TableColumn className="bg-gray-100 rounded-t-lg">ชื่อ-นามสกุล</TableColumn>
                    <TableColumn className="bg-gray-100 ">ตำแหน่งที่สมัคร</TableColumn>
                    <TableColumn className="bg-gray-100 ">กลุ่มงาน</TableColumn>
                    <TableColumn className="bg-gray-100 ">ฝ่าย</TableColumn>
                    <TableColumn className="bg-gray-100 ">วันที่สมัคร</TableColumn>
                    <TableColumn className="bg-gray-100 rounded-t-lg">การดำเนินการ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="ไม่พบรายการ">
                    {approvedApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {application.profileImage ? (
                              <img
                                src={application.profileImage}
                                alt="รูปภาพโปรไฟล์"
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm "
                              />
                            ) : (
                              <Avatar
                                name={`${application.firstName} ${application.lastName}`}
                                size="sm"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {application.prefix} {application.firstName} {application.lastName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{application.expectedPosition}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">-</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">{application.department}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {formatDateForDisplay(application.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onPress={() => handleViewDetails(application)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" onPress={onClose}>ปิด</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Position Applicants Modal */}
      <Modal 
        isOpen={showPositionModal} 
        onOpenChange={setShowPositionModal}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-white rounded-2xl shadow-lg",
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
                <div>
                  <h3 className="text-lg font-semibold">รายชื่อผู้สมัครในฝ่าย</h3>
                  {selectedPositionApplicants.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {selectedPositionApplicants[0].department}
                    </p>
                  )}
                </div>
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Position applicants table">
                  <TableHeader>
                    <TableColumn>ชื่อ-นามสกุล</TableColumn>
                    <TableColumn>อีเมล</TableColumn>
                    <TableColumn>เบอร์โทร</TableColumn>
                    <TableColumn>สถานะ</TableColumn>
                    <TableColumn>วันที่สมัคร</TableColumn>
                    <TableColumn>การดำเนินการ</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="ไม่พบรายการ">
                    {selectedPositionApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {applicant.profileImage ? (
                              <img
                                src={applicant.profileImage}
                                alt="รูปภาพโปรไฟล์"
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                              />
                            ) : (
                              <Avatar
                                name={`${applicant.firstName} ${applicant.lastName}`}
                                size="sm"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {applicant.prefix} {applicant.firstName} {applicant.lastName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">{applicant.email}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">{applicant.phone}</p>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={(() => {
                              const status = applicant.status;
                              if (status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED') {
                                return 'success';
                              } else if (status === 'pending' || status === 'รอพิจารณา' || status === 'PENDING') {
                                return 'warning';
                              } else if (status === 'REVIEWING') {
                                return 'primary';
                              } else if (status === 'CONTACTED') {
                                return 'secondary';
                              } else if (status === 'REJECTED') {
                                return 'danger';
                              } else if (status === 'ARCHIVED') {
                                return 'default';
                              } else {
                                return 'warning';
                              }
                            })()}
                            variant="flat"
                            size="sm"
                            className={(() => {
                              const status = applicant.status;
                              if (status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED') {
                                return 'bg-green-100 text-green-800 border-green-300';
                              } else if (status === 'pending' || status === 'รอพิจารณา' || status === 'PENDING') {
                                return 'bg-orange-100 text-orange-800 border-orange-300';
                              } else {
                                return '';
                              }
                            })()}
                          >
                            {(() => {
                              const status = applicant.status;
                              if (status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED') {
                                return 'ผ่านการพิจารณา';
                              } else if (status === 'pending' || status === 'รอพิจารณา' || status === 'PENDING') {
                                return 'รอพิจารณา';
                              } else if (status === 'REVIEWING') {
                                return 'กำลังพิจารณา';
                              } else if (status === 'CONTACTED') {
                                return 'ติดต่อแล้ว';
                              } else if (status === 'REJECTED') {
                                return 'ปฏิเสธ';
                              } else if (status === 'ARCHIVED') {
                                return 'เก็บถาวร';
                              } else {
                                return status || 'รอพิจารณา';
                              }
                            })()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {formatDateForDisplay(applicant.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onPress={() => {
                                handleViewDetails(applicant);
                                setShowPositionModal(false);
                              }}
                            >
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" onPress={onClose}>ปิด</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Bulk Status Change Modal */}
      <Modal 
        isOpen={showBulkModal} 
        onClose={() => setShowBulkModal(false)}
        size="md"
        classNames={{
          base: "max-h-[90vh] bg-white rounded-2xl shadow-lg",
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-sm",
          header: "bg-white rounded-t-2xl",
          footer: "bg-white rounded-b-2xl"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">เปลี่ยนสถานะหลายคนพร้อมกัน</h3>
                    <p className="text-sm text-orange-100">
                      เลือกแล้ว {selectedApplications.length} รายการ
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="p-6">
                <div className="space-y-6">
                  {/* แสดงรายชื่อที่เลือก */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">รายการที่เลือก:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {selectedApplications.map(id => {
                        const app = applications.find(a => a.id === id);
                        return app ? (
                          <div key={id} className="flex items-center justify-between bg-white rounded px-3 py-2">
                            <span className="text-sm text-gray-700">
                              {app.prefix} {app.firstName} {app.lastName}
                            </span>
                            <Chip
                              color={(() => {
                                const status = app.status;
                                if (status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED') {
                                  return 'success';
                                } else if (status === 'pending' || status === 'รอพิจารณา' || status === 'PENDING') {
                                  return 'warning';
                                } else if (status === 'REVIEWING') {
                                  return 'primary';
                                } else if (status === 'CONTACTED') {
                                  return 'secondary';
                                } else if (status === 'REJECTED') {
                                  return 'danger';
                                } else if (status === 'ARCHIVED') {
                                  return 'default';
                                } else {
                                  return 'warning';
                                }
                              })()}
                              variant="flat"
                              size="sm"
                              className={(() => {
                                const status = app.status;
                                if (status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED') {
                                  return 'bg-green-100 text-green-800 border-green-300';
                                } else if (status === 'pending' || status === 'รอพิจารณา' || status === 'PENDING') {
                                  return 'bg-orange-100 text-orange-800 border-orange-300';
                                } else {
                                  return '';
                                }
                              })()}
                            >
                              {(() => {
                                const status = app.status;
                                if (status === 'approved' || status === 'ผ่านการพิจารณา' || status === 'HIRED') {
                                  return 'ผ่านการพิจารณา';
                                } else if (status === 'pending' || status === 'รอพิจารณา' || status === 'PENDING') {
                                  return 'รอพิจารณา';
                                } else if (status === 'REVIEWING') {
                                  return 'กำลังพิจารณา';
                                } else if (status === 'CONTACTED') {
                                  return 'ติดต่อแล้ว';
                                } else if (status === 'REJECTED') {
                                  return 'ปฏิเสธ';
                                } else if (status === 'ARCHIVED') {
                                  return 'เก็บถาวร';
                                } else {
                                  return status || 'รอพิจารณา';
                                }
                              })()}
                            </Chip>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* เลือกสถานะใหม่ */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      เปลี่ยนสถานะเป็น:
                    </label>
                    <Select
                      placeholder="เลือกสถานะใหม่"
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      variant="bordered"
                      className="w-full bg-white rounded-lg shadow-sm"
                      classNames={{
                        trigger: "bg-white border-gray-300",
                        value: "text-gray-900",
                        popover: "bg-white",
                        listbox: "bg-white"
                      }}
                    >
                      <SelectItem key="pending" className="bg-white hover:bg-gray-50">รอพิจารณา</SelectItem>
                      <SelectItem key="approved" className="bg-white hover:bg-gray-50">ผ่านการพิจารณา</SelectItem>

                    </Select>
                  </div>

                  {/* คำเตือน */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-800">คำเตือน</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          การเปลี่ยนแปลงนี้จะส่งผลต่อ {selectedApplications.length} รายการทันที 
                          กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="bg-gray-50">
                <Button 
                  color="default" 
                  variant="light" 
                  onPress={() => setShowBulkModal(false)}
                  className="mr-2"
                >
                  ยกเลิก
                </Button>
                <Button 
                  color="warning" 
                  onPress={handleBulkStatusChange}
                  disabled={!bulkStatus}
                  className="min-w-[120px]"
                >
                  เปลี่ยนสถานะ
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Suggestion Modal */}
      <Modal 
        isOpen={showSuggestionModal} 
        onClose={() => setShowSuggestionModal(false)}
        size="lg"
        classNames={{
          base: "max-h-[90vh] bg-white rounded-2xl shadow-lg",
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">ข้อเสนอแนะเพิ่มเติม</h3>
                    <p className="text-sm text-gray-500">
                      {selectedApplication?.prefix} {selectedApplication?.firstName} {selectedApplication?.lastName}
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ข้อเสนอแนะ
                    </label>
                    <textarea
                      placeholder="กรุณาใส่ข้อเสนอแนะเพิ่มเติม..."
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  
                  {selectedApplication?.suggestion && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ข้อเสนอแนะเดิม:</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {selectedApplication.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button 
                    color="default" 
                    variant="light" 
                    onPress={() => setShowSuggestionModal(false)}
                    className="mr-2"
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={handleSaveSuggestion}
                    disabled={!suggestion.trim()}
                    className="min-w-[120px]"
                  >
                    บันทึก
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}