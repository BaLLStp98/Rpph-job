'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
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
  UserIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  TrashIcon,
  PrinterIcon
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  // ฟิลเตอร์ กลุ่มงาน/ฝ่าย
  const [missionGroups, setMissionGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [hospitalDepartments, setHospitalDepartments] = useState<Array<{ id: string; name: string; missionGroupId: string | null }>>([]);
  const [selectedMissionGroupId, setSelectedMissionGroupId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
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
  
  // รีเซ็ตตัวกรอง
  const resetFilters = () => {
    setSelectedMissionGroupId('');
    setSelectedDepartmentId('');
    fetchApplications();
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

  // โหลดตัวเลือกกลุ่มงาน
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/prisma/mission-groups');
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.success && Array.isArray(json.data)) {
          setMissionGroups(json.data.map((g: any) => ({ id: g.id, name: g.name })));
        }
      } catch {}
    })();
  }, []);

  // โหลดตัวเลือกฝ่ายตามกลุ่มงาน
  useEffect(() => {
    (async () => {
      try {
        const url = selectedMissionGroupId
          ? `/api/hospital-departments?missionGroupId=${selectedMissionGroupId}`
          : '/api/hospital-departments';
        const res = await fetch(url);
        const json = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(json)) {
          setHospitalDepartments(json.map((d: any) => ({ id: String(d.id), name: d.name, missionGroupId: d.missionGroupId || null })));
        } else if (res.ok && json?.success && Array.isArray(json.data)) {
          setHospitalDepartments(json.data.map((d: any) => ({ id: String(d.id), name: d.name, missionGroupId: d.missionGroupId || null })));
        }
      } catch {}
    })();
  }, [selectedMissionGroupId]);

  // เมื่อเลือกฝ่าย ให้รีเฟรชข้อมูลตามฝ่าย
  useEffect(() => {
    if (!selectedDepartmentId) return;
    const dept = hospitalDepartments.find(d => d.id === selectedDepartmentId);
    if (!dept?.name) return;
    (async () => {
      try {
        const url = new URL('/api/resume-deposit', window.location.origin);
        url.searchParams.set('admin', 'true');
        url.searchParams.set('limit', '100');
        url.searchParams.set('department', dept.name);
        const res = await fetch(url.toString());
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.success && Array.isArray(json.data)) {
          const mapped = json.data.map((app: any) => ({
            id: app.id,
            firstName: app.firstName || '',
            lastName: app.lastName || '',
            appliedPosition: app.expectedPosition || 'ไม่ระบุ',
            email: app.email || '',
            phone: app.phone || '',
            department: app.department || dept.name,
            missionGroupId: dept.missionGroupId || null,
            status: (app.status || 'PENDING').toLowerCase(),
            createdAt: app.createdAt || new Date().toISOString(),
            profileImageUrl: app.profileImageUrl || ''
          }));
          setApplications(mapped);
        }
      } catch {}
    })();
  }, [selectedDepartmentId, hospitalDepartments]);

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
              app.status === 'pending' || app.status === 'PENDING' || app.status === 'รอพิจารณา'
            ).length,
            approved: processedData.filter((app: ApplicationData) => 
              app.status === 'hired' || app.status === 'HIRED' || app.status === 'อนุมัติ'
            ).length
          };
          setStats(newStats);
          console.log('📊 สถิติ:', newStats);
        } else {
          console.error('❌ Invalid response structure:', responseData);
          setError('รูปแบบข้อมูลไม่ถูกต้อง');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch applications:', response.status, errorText);
        setError(`ไม่สามารถดึงข้อมูลได้ (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (application: ApplicationData) => {
    setSelectedApplication(application);
    setUploadedDocuments([]); // รีเซ็ตข้อมูลไฟล์แนบ
    onDetailModalOpen();
    // ตั้งค่า dropdown สถานะเริ่มต้นตามข้อมูล
    try {
      const current = String((application as any)?.status || '').toLowerCase();
      const initial = (current === 'approved' || current === 'hired' || current === 'อนุมัติ') ? 'อนุมัติ' : 'รอพิจารณา';
      setDetailStatus(initial);
    } catch {}
    
    // Debug: ตรวจสอบข้อมูล profileImage
    console.log('🔍 Selected Application:', application);
    console.log('🔍 Profile Image:', application.profileImage);
    console.log('🔍 Profile Image Type:', typeof application.profileImage);
    console.log('🔍 Profile Image Length:', application.profileImage?.length);
    
    // จัดการรูปภาพโปรไฟล์เหมือนกับหน้า register
    if (application.profileImage) {
      console.log('✅ ใช้ profileImage ที่มีอยู่:', application.profileImage);
    } else if (application.id) {
      // ลองหารูปภาพตาม ID เหมือนกับหน้า register
      try {
        const jpgPath = `/api/image?file=profile_${application.id}.jpg`;
        console.log('🔍 ลองหา JPG path:', jpgPath);
        const jpgResponse = await fetch(jpgPath);
        if (jpgResponse.ok) {
          console.log('✅ พบ JPG image:', jpgPath);
          setSelectedApplication(prev => prev ? { ...prev, profileImage: jpgPath } : null);
        } else {
          const pngPath = `/api/image?file=profile_${application.id}.png`;
          console.log('🔍 ลองหา PNG path:', pngPath);
          const pngResponse = await fetch(pngPath);
          if (pngResponse.ok) {
            console.log('✅ พบ PNG image:', pngPath);
            setSelectedApplication(prev => prev ? { ...prev, profileImage: pngPath } : null);
          } else {
            console.log('❌ ไม่พบรูปภาพสำหรับ ID:', application.id);
          }
        }
      } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการหารูปภาพ:', error);
      }
    }
    
    // ดึงข้อมูลเอกสารแนบ
    try {
      console.log('🔍 กำลังดึงข้อมูลเอกสารแนบสำหรับ ID:', application.id);
      const response = await fetch(`/api/resume-documents?resumeDepositId=${application.id}`);
      console.log('🔍 API Response Status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('🔍 API Response Data:', responseData);
        
        if (responseData.success && responseData.data) {
          setUploadedDocuments(responseData.data);
          console.log('✅ Uploaded Documents:', responseData.data);
        } else {
          console.log('❌ ไม่พบข้อมูลเอกสารแนบ:', responseData);
          setUploadedDocuments([]);
        }
      } else {
        console.error('❌ Failed to fetch documents:', response.status);
        setUploadedDocuments([]);
      }
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      setUploadedDocuments([]);
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedApplication(null);
    setShowDetailModal(false);
    onDetailModalOpenChange(); // ปิด modal ผ่าน useDisclosure
  };

  const handlePreviewFile = (filePath: string, fileName: string) => {
    setPreviewFile({
      url: filePath,
      name: fileName,
      type: fileName.split('.').pop()?.toLowerCase() || 'unknown'
    });
    setShowPreviewModal(true);
  };

  

  // ฟังก์ชันดึงข้อมูลเอกสารแนบ
  const fetchDocuments = async (resumeDepositId: string) => {
    try {
      console.log('🔍 กำลังดึงข้อมูลเอกสารแนบสำหรับ resumeDepositId:', resumeDepositId);
      const response = await fetch(`/api/resume-documents?resumeDepositId=${resumeDepositId}`);
      console.log('🔍 fetchDocuments API Response Status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('🔍 fetchDocuments API Response Data:', responseData);
        
        if (responseData.success && responseData.data) {
          console.log('✅ fetchDocuments สำเร็จ:', responseData.data);
          return responseData.data;
        } else {
          console.log('❌ fetchDocuments ไม่พบข้อมูล:', responseData);
          return [];
        }
      } else {
        console.error('❌ fetchDocuments Failed:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ fetchDocuments Error:', error);
      return [];
    }
  };

  // ฟังก์ชันลบไฟล์เอกสารแนบ
  const handleDeleteDocument = async (documentId: string, documentType: string) => {
    if (!(selectedApplication as any)?.id) {
      alert('ไม่พบข้อมูลใบสมัครงาน');
      return;
    }

    try {
      const response = await fetch(`/api/resume-documents/${documentId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // อัปเดตข้อมูลเอกสารที่อัปโหลดแล้ว
        const documents = await fetchDocuments(selectedApplication?.id || '');
        setUploadedDocuments(documents);
        alert('ลบไฟล์สำเร็จ');
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการลบไฟล์');
      }
    } catch (error) {
      console.error('Delete document error:', error);
      alert('เกิดข้อผิดพลาดในการลบไฟล์');
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  // ฟังก์ชันสำหรับพิมพ์เอกสาร
  const handlePrintDocument = (application: ApplicationData) => {
    if (!application?.id) {
      alert('ไม่พบข้อมูลใบสมัครงาน');
      return;
    }
    
    // เปิดหน้า print-all พร้อมส่ง ID
    const printUrl = `/official-documents/print-all?id=${application.id}`;
    window.open(printUrl, '_blank');
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      console.log('🔍 handleStatusUpdate called:', { applicationId, newStatus });
      
      const requestBody = { status: newStatus };
      console.log('🔍 Sending request body:', requestBody);
      console.log('🔍 Request URL:', `/api/resume-deposit/${applicationId}`);
      console.log('🔍 Request method:', 'PATCH');
      
      const response = await fetch(`/api/resume-deposit/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🔍 API Response status:', response.status);
      console.log('🔍 API Response ok:', response.ok);
      console.log('🔍 API Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('🔍 API Response URL:', response.url);

      if (response.ok) {
        const responseData = await response.json();
        console.log('🔍 API Response data:', responseData);
        console.log('🔍 API Response success:', responseData.success);
        console.log('🔍 API Response message:', responseData.message);
        
        if (responseData.success) {
          console.log('✅ สถานะอัปเดตสำเร็จ');
          
          // อัปเดตสถานะใน applications list ทันที
          setApplications(prev => 
            prev.map(app => 
              app.id === applicationId 
                ? { ...app, status: newStatus }
                : app
            )
          );
          
          // อัปเดตสถานะใน modal ถ้าเปิดอยู่
          if (selectedApplication && selectedApplication.id === applicationId) {
            setSelectedApplication(prev => 
              prev ? { ...prev, status: newStatus } : null
            );
          }
          
          // อัปเดตสถิติ
          const updatedApplications = applications.map(app => 
            app.id === applicationId ? { ...app, status: newStatus } : app
          );
          
          const newStats = {
            total: updatedApplications.length,
            pending: updatedApplications.filter((app: ApplicationData) => 
              app.status === 'pending' || app.status === 'PENDING' || app.status === 'รอพิจารณา'
            ).length,
        approved: updatedApplications.filter((app: ApplicationData) => 
          app.status === 'hired' || app.status === 'HIRED' || app.status === 'อนุมัติ'
        ).length
          };
          setStats(newStats);
          
          // แสดงข้อความสำเร็จ
          alert(`อัปเดตสถานะเป็น "${newStatus}" สำเร็จ`);
          
          // ปิด modal ถ้าเปิดอยู่
          if (selectedApplication && selectedApplication.id === applicationId) {
            handleCloseDetailModal();
          }
        } else {
          console.error('❌ API returned success: false:', responseData);
          console.error('❌ API error message:', responseData.message);
          console.error('❌ API error details:', responseData);
          throw new Error(responseData.message || 'Failed to update status');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        console.error('❌ Error details:', {
          statusCode: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        });
        
        // พยายาม parse error response เป็น JSON
        try {
          const errorData = JSON.parse(errorText);
          console.error('❌ Parsed error data:', errorData);
          console.error('❌ Parsed error success:', errorData.success);
          console.error('❌ Parsed error message:', errorData.message);
          console.error('❌ Parsed error data type:', typeof errorData);
          console.error('❌ Parsed error data keys:', Object.keys(errorData));
        } catch (parseError) {
          console.error('❌ Could not parse error response as JSON:', parseError);
          console.error('❌ Raw error text:', errorText);
          console.error('❌ Raw error text length:', errorText.length);
          console.error('❌ Raw error text type:', typeof errorText);
        }
        
        throw new Error(`Failed to update status: ${errorText}`);
      }
    } catch (error: unknown) {
      console.error('❌ Error updating status:', error);
      const errorMessage = error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ';
      alert(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${errorMessage}`);
    }
  };

  const getStatusText = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    const statusMap: { [key: string]: string } = {
      'pending': 'รอพิจารณา',
      'approved': 'อนุมัติ',
      'hired': 'อนุมัติ',
    };
    return statusMap[lowerCaseStatus] || status;
  };

  const getStatusColor = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    const colorMap: { [key: string]: string } = {
      'pending': 'warning',
      'approved': 'success',
      'hired': 'success',
    };
    return colorMap[lowerCaseStatus] || 'default';
  };

  // ฟังก์ชันแปลงเพศเป็นภาษาไทย
  const getGenderText = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      'male': 'ชาย',
      'female': 'หญิง',
      'MALE': 'ชาย',
      'FEMALE': 'หญิง',
      'ชาย': 'ชาย',
      'หญิง': 'หญิง'
    };
    return genderMap[gender] || gender || '-';
  };

  // ฟังก์ชันแปลงสถานภาพเป็นภาษาไทย
  const getMaritalStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'single': 'โสด',
      'married': 'สมรส',
      'divorced': 'หย่าร้าง',
      'widowed': 'หม้าย',
      'SINGLE': 'โสด',
      'MARRIED': 'สมรส',
      'DIVORCED': 'หย่าร้าง',
      'WIDOWED': 'หม้าย',
      'โสด': 'โสด',
      'สมรส': 'สมรส',
      'หย่าร้าง': 'หย่าร้าง',
      'หม้าย': 'หม้าย'
    };
    return statusMap[status] || status || '-';
  };

  // กรองตาม dropdown กลุ่มงาน/ฝ่าย ก่อน
  const applicationsAfterDropdown = applications.filter(app => {
    // กรองตามฝ่าย (หากเลือกฝ่าย)
    if (selectedDepartmentId) {
      const dept = hospitalDepartments.find(d => d.id === selectedDepartmentId);
      if (dept?.name && app.department !== dept.name) return false;
    }

    // กรองตามกลุ่มงาน (หากเลือกกลุ่มงาน)
    if (selectedMissionGroupId) {
      const deptOfApp = hospitalDepartments.find(d => d.name === app.department);
      if (!deptOfApp || String(deptOfApp.missionGroupId || '') !== String(selectedMissionGroupId)) return false;
    }

    return true;
  });

  const filteredApplications = applicationsAfterDropdown.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.expectedPosition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // รายการผู้สมัครที่รอพิจารณา (ตามตัวกรอง dropdown ปัจจุบันด้วย)
  const pendingApplications = applicationsAfterDropdown.filter((app: ApplicationData) => {
    const s = (app.status || '').toLowerCase();
    return s === 'pending' || s === 'รอพิจารณา';
  });

  // รายการผู้สมัครที่อนุมัติ (ตามตัวกรอง dropdown ปัจจุบันด้วย)
  const approvedApplications = applicationsAfterDropdown.filter((app: ApplicationData) => {
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              color="primary"
              onPress={fetchApplications}
              startContent={<ArrowPathIcon className="w-4 h-4" />}
            >
              ลองใหม่
            </Button>
          </div>
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">ระบบจัดการใบสมัครงาน</h1>
            <p className="mt-2 text-gray-600">จัดการและติดตามสถานะใบสมัครงาน</p>
          </div>
          </div>
        </div>

      <div className="space-y-8">
        
          {/* สถิติ */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm lg:text-base">ทั้งหมด</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.total}</p>
                </div>
                <UsersIcon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-200" />
          </div>
        </CardBody>
      </Card>

          <Card isPressable className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white cursor-pointer rounded-lg" onPress={onPendingModalOpen}>
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm lg:text-base">รอพิจารณา</p>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.pending}</p>
            </div>
                <ClockIcon className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-200" />
          </div>
            </CardBody>
          </Card>

          <Card isPressable className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg cursor-pointer" onPress={onApprovedModalOpen}>
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

        </div>

        {/* ฟิลเตอร์และค้นหา */}
        <Card>
          <CardBody className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือตำแหน่ง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />}
                  className="w-full"
                  size="sm"
                  classNames={{
                    input: "rounded-lg border-2 border-blue-200 focus:border-blue-500",
                    inputWrapper: "rounded-lg border-2 border-blue-200 focus-within:border-blue-500"
                  }}
                />
              </div>
              <div className="flex gap-4">
                <Select
                  placeholder="กรองตามสถานะ"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                  className="w-full lg:w-48"
                  size="sm"
                  classNames={{
                    trigger: "rounded-lg border-2 border-blue-200 focus-within:border-blue-500",
                    value: "text-gray-900"
                  }}
                >
                  <SelectItem key="all">ทั้งหมด</SelectItem>
                  <SelectItem key="pending">รอพิจารณา</SelectItem>
                  <SelectItem key="approved">อนุมัติ</SelectItem>
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ฟิลเตอร์ กลุ่มงาน/ฝ่าย แบบ @departments/ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">กลุ่มงาน</label>
            <select
              value={selectedMissionGroupId}
              onChange={(e) => {
                setSelectedMissionGroupId(e.target.value);
                setSelectedDepartmentId('');
              }}
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">ทั้งหมด</option>
              {missionGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ฝ่าย</label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">ทั้งหมด</option>
              {hospitalDepartments
                .filter((d) => !selectedMissionGroupId || d.missionGroupId === selectedMissionGroupId)
                .map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
            >
              รีเซ็ตตัวกรอง
            </button>
          </div>
        </div>

        {/* ตารางข้อมูล */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">รายชื่อผู้สมัคร</h2>
        </CardHeader>
          <CardBody>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">ไม่มีข้อมูลใบสมัครงาน</h3>
                <p className="text-gray-500 mb-4">
                  {applications.length === 0 
                    ? 'ยังไม่มีใบสมัครงานในระบบ' 
                    : 'ไม่พบข้อมูลที่ตรงกับการค้นหา'
                  }
                </p>
              </div>
            ) : (
              <Table aria-label="Applications table">
                <TableHeader className="bg-gray-100 rounded-t-lg">
                  <TableColumn className="bg-gray-100">ชื่อ-นามสกุล</TableColumn>
                  <TableColumn className="bg-gray-100">ตำแหน่งที่สมัคร</TableColumn>
                  <TableColumn className="bg-gray-100">กลุ่มงาน</TableColumn>
                  <TableColumn className="bg-gray-100">ฝ่าย</TableColumn>
                  <TableColumn className="bg-gray-100">สถานะ</TableColumn>
                  <TableColumn className="bg-gray-100">วันที่สมัคร</TableColumn>
                  <TableColumn className="bg-gray-100">การดำเนินการ</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
              {application.profileImage ? (
                <img
                            src={application.profileImage}
                            alt="รูปภาพโปรไฟล์"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  onError={(e) => {
                              console.log('❌ รูปภาพโหลดไม่สำเร็จ:', application.profileImage);
                              console.log('❌ Error details:', e);
                            }}
                            onLoad={() => {
                              console.log('✅ รูปภาพโหลดสำเร็จ:', application.profileImage);
                            }}
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
                          {/* <p className="text-sm text-gray-500">{application.email}</p> */}
              </div>
            </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{application.expectedPosition}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-600">
                        {
                          (() => {
                            const byId = missionGroups.find(g => g.id === String(application.missionGroupId || ''))?.name;
                            if (byId) return byId;
                            const dept = hospitalDepartments.find(d => d.name === application.department);
                            if (!dept?.missionGroupId) return '-';
                            return missionGroups.find(g => g.id === String(dept.missionGroupId))?.name || '-';
                          })()
                        }
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-600">{application.department}</p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(application.status) as any}
                        variant="flat"
                        size="sm"
                        className={`rounded-lg ${
                          application.status === 'approved' || application.status === 'APPROVED' || application.status === 'อนุมัติ'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {getStatusText(application.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">
                        {new Date(application.createdAt).toLocaleDateString('th-TH')}
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
                        {/* <Button
                          size="sm"
                          color="secondary"
                          variant="flat"
                          startContent={<PrinterIcon className="w-4 h-4" />}
                          onPress={() => handlePrintDocument(application)}
                        >
                          พิมพ์เอกสาร
                        </Button> */}
                        {/* {(() => {
                          console.log('🔍 Status check for application:', {
                            id: application.id,
                            name: `${application.firstName} ${application.lastName}`,
                            status: application.status,
                            isPending: application.status === 'pending' || application.status === 'PENDING' || application.status === 'รอพิจารณา',
                            isApproved: application.status === 'approved' || application.status === 'APPROVED' || application.status === 'อนุมัติ'
                          });
                          return application.status === 'pending' || application.status === 'PENDING' || application.status === 'รอพิจารณา';
                        })() ? (
                          <Button
                            size="sm"
                            color="success"
                            variant="solid"
                            startContent={<CheckCircleIcon className="w-4 h-4" />}
                            onPress={() => {
                              console.log('🔍 Button clicked: อนุมัติ for application:', application.id);
                              handleStatusUpdate(application.id, 'อนุมัติ');
                            }}
                          >
                            อนุมัติ
                          </Button>
                        ) : application.status === 'approved' || application.status === 'APPROVED' || application.status === 'อนุมัติ' ? (
                          <Button
                            size="sm"
                            color="warning"
                            variant="solid"
                            startContent={<ClockIcon className="w-4 h-4" />}
                            onPress={() => {
                              console.log('🔍 Button clicked: รอพิจารณา for application:', application.id);
                              handleStatusUpdate(application.id, 'รอพิจารณา');
                            }}
                          >
                            รอพิจารณา
                          </Button>
                        ) : null} */}
          </div>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
            </div>
            
      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onOpenChange={onDetailModalOpenChange}
        size="full"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-gradient-to-br from-blue-50 to-blue-100",
          body: "py-6",
          backdrop: "bg-black/50 backdrop-blur-md",
          header: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
          footer: "bg-gradient-to-r from-blue-50 to-blue-100",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  {/* รูปภาพโปรไฟล์ */}
                  <div className="flex-shrink-0">
                    {(selectedApplication as any)?.profileImage ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={(selectedApplication as any)?.profileImage}
                          alt="รูปภาพโปรไฟล์"
                          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                          onError={(e) => {
                            console.log('❌ รูปภาพโหลดไม่สำเร็จ:', (selectedApplication as any)?.profileImage);
                            console.log('❌ Error details:', e);
                          }}
                          onLoad={() => {
                            console.log('✅ รูปภาพโหลดสำเร็จ:', (selectedApplication as any)?.profileImage);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="flat"
                          color="secondary"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onPress={() => {
                            const url = (selectedApplication as any)?.profileImage as string;
                            if (url) handlePreviewFile(url, 'รูปโปรไฟล์');
                          }}
                        >
                          ดูรูป
                        </Button>
                      </div>
                    ) : (
                      <Avatar
                        name={`${(selectedApplication as any)?.firstName || ''} ${(selectedApplication as any)?.lastName || ''}`}
                        size="lg"
                        className="w-16 h-16 border-4 border-white shadow-lg"
                      />
                    )}
            </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      รายละเอียดใบสมัครงาน
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {(selectedApplication as any)?.prefix ? `${(selectedApplication as any).prefix} ` : ''}{(selectedApplication as any)?.firstName} {(selectedApplication as any)?.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip
                        color={getStatusColor((selectedApplication as any)?.status) as any}
                        variant="flat"
                        size="sm"
                        className="text-xs"
                      >
                        {getStatusText((selectedApplication as any)?.status)}
                      </Chip>
                      <span className="text-blue-200 text-xs">
                        สมัครเมื่อ: {formatDateForDisplay((selectedApplication as any)?.createdAt || '')}
                      </span>
            </div>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="bg-white">
                {selectedApplication && (
                  <div className="space-y-6">
                    {/* ข้อมูลส่วนตัว */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                        ข้อมูลส่วนตัว
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
            <div>
                          <label className="text-sm font-medium text-gray-600">คำนำหน้า</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.prefix || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">ชื่อ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.firstName || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">นามสกุล</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.lastName || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">อายุ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.age || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">วันเกิด</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {formatDateForDisplay((selectedApplication as any)?.birthDate || '')}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">เพศ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {getGenderText((selectedApplication as any)?.gender || '')}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">อำเภอ/เขตที่เกิด</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.placeOfBirth || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">จังหวัดที่เกิด</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.placeOfBirthProvince || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">เชื้อชาติ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.race || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">สัญชาติ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.nationality || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">ศาสนา</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.religion || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">สถานภาพ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {getMaritalStatusText((selectedApplication as any)?.maritalStatus || '')}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.phone || '-'}
                          </div>
            </div>
            <div>
                          <label className="text-sm font-medium text-gray-600">อีเมล</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.email || '-'}
                          </div>
                        </div>
            </div>
          </div>

                    {/* ข้อมูลบัตรประชาชน */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        ข้อมูลบัตรประชาชน
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                <div>
                          <label className="text-sm font-medium text-gray-600">เลขบัตรประชาชน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.idNumber || '-'}
                          </div>
                </div>
                <div>
                          <label className="text-sm font-medium text-gray-600">ออกโดย</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.idCardIssuedAt || '-'}
                          </div>
                </div>
                <div>
                          <label className="text-sm font-medium text-gray-600">วันที่ออกบัตร</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {formatDateForDisplay((selectedApplication as any)?.idCardIssueDate || '')}
                          </div>
                </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">วันที่บัตรหมดอายุ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {formatDateForDisplay((selectedApplication as any)?.idCardExpiryDate || '')}
                          </div>
              </div>
            </div>
                    </div>

                    {/* ข้อมูลที่อยู่ตามทะเบียนบ้าน */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        ที่อยู่ตามทะเบียนบ้าน
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">ที่อยู่</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.addressAccordingToHouseRegistration || '-'}
                          </div>
            </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เลขที่</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_house_number || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">หมู่ที่</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_village_number || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ตรอก/ซอย</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_alley || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ถนน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_road || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ตำบล/แขวง</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_sub_district || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">อำเภอ/เขต</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_district || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">จังหวัด</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_province || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">รหัสไปรษณีย์</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_postal_code || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์บ้าน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_phone || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์มือถือ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.house_registration_mobile || '-'}
                          </div>
                        </div>
            </div>
          </div>

                    {/* ข้อมูลที่อยู่ปัจจุบัน */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        ที่อยู่ปัจจุบัน
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">ที่อยู่</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.currentAddress || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เลขที่</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_house_number || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">หมู่ที่</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_village_number || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ตรอก/ซอย</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_alley || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ถนน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_road || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ตำบล/แขวง</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_sub_district || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">อำเภอ/เขต</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_district || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">จังหวัด</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_province || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">รหัสไปรษณีย์</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_postal_code || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์บ้าน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_phone || '-'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์มือถือ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.current_address_mobile || '-'}
                          </div>
                        </div>
            </div>
                    </div>

                    {/* ข้อมูลการติดต่อฉุกเฉิน */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        การติดต่อฉุกเฉิน
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">ชื่อผู้ติดต่อฉุกเฉิน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.emergencyContact || '-'}
                          </div>
              </div>
              <div>
                          <label className="text-sm font-medium text-gray-600">ความสัมพันธ์</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.emergencyRelationship || '-'}
                          </div>
              </div>
              <div>
                          <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์ฉุกเฉิน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.emergencyPhone || '-'}
                          </div>
              </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">ที่อยู่ฉุกเฉิน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.emergencyAddress || '-'}
                          </div>
            </div>
              </div>
            </div>

                    {/* ข้อมูลการสมัครงาน */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                        ข้อมูลการสมัครงาน
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
              <div>
                          <label className="text-sm font-medium text-gray-600">ตำแหน่งที่สมัคร</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.expectedPosition || '-'}
                          </div>
              </div>
              <div>
                          <label className="text-sm font-medium text-gray-600">ฝ่าย/กลุ่มงาน</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.department || '-'}
                          </div>
              </div>
              <div>
                          <label className="text-sm font-medium text-gray-600">เงินเดือนที่คาดหวัง</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.expectedSalary || '-'}
                          </div>
              </div>
              <div>
                          <label className="text-sm font-medium text-gray-600">วันที่สามารถเริ่มงานได้</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {formatDateForDisplay((selectedApplication as any)?.availableDate || '')}
                          </div>
              </div>
                      </div>
                    </div>

                    {/* ข้อมูลการศึกษา */}
                    {(selectedApplication as any)?.education && (selectedApplication as any).education.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                          ข้อมูลการศึกษา
                        </h4>
                        <div className="space-y-4">
                          {(selectedApplication as any).education.map((edu: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="grid grid-cols-3 gap-4">
              <div>
                                  <label className="text-sm font-medium text-gray-600">ระดับการศึกษา</label>
                                  <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                                    {edu.level || '-'}
                                  </div>
              </div>
              <div>
                                  <label className="text-sm font-medium text-gray-600">สถาบันการศึกษา</label>
                                  <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                                    {edu.institution || edu.school || '-'}
                                  </div>
              </div>
              <div>
                                  <label className="text-sm font-medium text-gray-600">สาขาวิชา</label>
                                  <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                                    {edu.major || '-'}
                                  </div>
              </div>
              <div>
                                  <label className="text-sm font-medium text-gray-600">ปีที่จบ</label>
                                  <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                                    {edu.year || edu.endYear || '-'}
                                  </div>
              </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">เกรดเฉลี่ย</label>
                                  <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                                    {edu.gpa || '-'}
                                  </div>
            </div>
            </div>
          </div>
                          ))}
                  </div>
                </div>
              )}
              
                    {/* ข้อมูลประสบการณ์ทำงาน */}
                    {(selectedApplication as any)?.workExperience && (selectedApplication as any).workExperience.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                          ประสบการณ์ทำงาน
                        </h4>
                        <div className="space-y-4">
                          {(selectedApplication as any).workExperience.map((work: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                                  <p className="text-gray-800">{work.position || '-'}</p>
                  </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">บริษัท/องค์กร</label>
                                  <p className="text-gray-800">{work.company || '-'}</p>
                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">วันที่เริ่มงาน</label>
                                  <p className="text-gray-800">{work.startDate || '-'}</p>
                  </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">วันที่สิ้นสุด</label>
                                  <p className="text-gray-800">{work.endDate || '-'}</p>
                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">เงินเดือน</label>
                                  <p className="text-gray-800">{work.salary || '-'}</p>
                  </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">เหตุผลที่ออก</label>
                                  <p className="text-gray-800">{work.reason || work.description || '-'}</p>
                </div>
            </div>
                            </div>
                          ))}
                        </div>
            </div>
          )}

                    {/* ข้อมูลการรับราชการก่อนหน้า */}
                    {(selectedApplication as any)?.previousGovernmentService && (selectedApplication as any).previousGovernmentService.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                          การรับราชการก่อนหน้า
                        </h4>
                        <div className="space-y-4">
                          {(selectedApplication as any).previousGovernmentService.map((service: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                                  <p className="text-gray-800">{service.position || '-'}</p>
            </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">หน่วยงาน</label>
                                  <p className="text-gray-800">{service.department || '-'}</p>
          </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">วันที่</label>
                                  <p className="text-gray-800">{service.date || '-'}</p>
          </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">ประเภท</label>
                                  <p className="text-gray-800">{service.type || '-'}</p>
    </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-600">เหตุผล</label>
                                  <p className="text-gray-800">{service.reason || '-'}</p>
            </div>
          </div>
        </div>
                          ))}
      </div>
                      </div>
                    )}

                    {/* ข้อมูลคู่สมรส */}
                    {(selectedApplication as any)?.spouseInfo && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                          ข้อมูลคู่สมรส
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">ชื่อคู่สมรส</label>
                            <p className="text-gray-800">{(selectedApplication as any)?.spouseInfo?.firstName || '-'}</p>
          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">นามสกุลคู่สมรส</label>
                            <p className="text-gray-800">{(selectedApplication as any)?.spouseInfo?.lastName || '-'}</p>
        </div>
      </div>
                      </div>
                    )}

                    {/* ข้อมูลที่ทำงานฉุกเฉิน */}
                    {(selectedApplication as any)?.emergencyWorkplace && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                          ข้อมูลที่ทำงานฉุกเฉิน
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">ชื่อที่ทำงาน</label>
                            <p className="text-gray-800">{(selectedApplication as any)?.emergencyWorkplace?.name || '-'}</p>
            </div>
            <div>
                            <label className="text-sm font-medium text-gray-600">เขต/อำเภอ</label>
                            <p className="text-gray-800">{(selectedApplication as any)?.emergencyWorkplace?.district || '-'}</p>
                </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">จังหวัด</label>
                            <p className="text-gray-800">{(selectedApplication as any)?.emergencyWorkplace?.province || '-'}</p>
            </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">เบอร์โทรศัพท์</label>
                            <p className="text-gray-800">{(selectedApplication as any)?.emergencyWorkplace?.phone || '-'}</p>
          </div>
            </div>
        </div>
                    )}

                    {/* ข้อมูลสิทธิการรักษา */}
                    {(selectedApplication as any)?.medicalRights && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                          ข้อมูลสิทธิการรักษา
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">สิทธิหลักประกันสุขภาพถ้วนหน้า</label>
                            <p className="text-gray-800">{(selectedApplication as any).medicalRights.hasUniversalHealthcare ? 'มี' : 'ไม่มี'}</p>
          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">โรงพยาบาลหลักประกันสุขภาพ</label>
                            <p className="text-gray-800">{(selectedApplication as any).medicalRights.universalHealthcareHospital || '-'}</p>
        </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">สิทธิประกันสังคม</label>
                            <p className="text-gray-800">{(selectedApplication as any).medicalRights.hasSocialSecurity ? 'มี' : 'ไม่มี'}</p>
                </div>
                <div>
                            <label className="text-sm font-medium text-gray-600">โรงพยาบาลประกันสังคม</label>
                            <p className="text-gray-800">{(selectedApplication as any).medicalRights.socialSecurityHospital || '-'}</p>
                </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">สิทธิข้าราชการ</label>
                            <p className="text-gray-800">{(selectedApplication as any).medicalRights.hasCivilServantRights ? 'มี' : 'ไม่มี'}</p>
                </div>
                <div>
                            <label className="text-sm font-medium text-gray-600">สิทธิอื่นๆ</label>
                            <p className="text-gray-800">{(selectedApplication as any).medicalRights.otherRights || '-'}</p>
                </div>
              </div>
                      </div>
                    )}

                    {/* ข้อมูลเจ้าหน้าที่ */}
                    {(selectedApplication as any)?.staffInfo && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                          ข้อมูลเจ้าหน้าที่
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">ตำแหน่ง</label>
                            <p className="text-gray-800">{(selectedApplication as any).staffInfo.position || '-'}</p>
                </div>
                <div>
                            <label className="text-sm font-medium text-gray-600">หน่วยงาน</label>
                            <p className="text-gray-800">{(selectedApplication as any).staffInfo.department || '-'}</p>
                </div>
                <div>
                            <label className="text-sm font-medium text-gray-600">วันที่เริ่มทำงาน</label>
                            <p className="text-gray-800">{(selectedApplication as any).staffInfo.startWork || '-'}</p>
                </div>
              </div>
        </div>
                    )}

                    {/* ข้อมูลเพิ่มเติม */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        ข้อมูลเพิ่มเติม
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
              <div>
                          <label className="text-sm font-medium text-gray-600">ความสามารถพิเศษ</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.skills || '-'}
                          </div>
              </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ภาษา</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.languages || '-'}
                          </div>
              </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ทักษะคอมพิวเตอร์</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.computerSkills || '-'}
                          </div>
            </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ใบรับรอง</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.certificates || '-'}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-600">บุคคลอ้างอิง</label>
                          <div className="px-3 py-2 bg-white border-2 border-blue-200 rounded-lg text-gray-800">
                            {(selectedApplication as any)?.references || '-'}
                          </div>
                      </div>
                      </div>
                    </div>

                    {/* ข้อมูลเอกสารแนบ */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        เอกสารแนบ
                      </h4>
                      {uploadedDocuments && uploadedDocuments.length > 0 ? (
                        <div className="space-y-3">
                          {uploadedDocuments.map((doc: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                  <div className="flex flex-col">
                                    <span className="text-sm text-gray-700 font-medium">
                                      {doc.fileName || doc.name || 'เอกสาร'}
                          </span>
                                    <span className="text-xs text-gray-500">
                                      ขนาด: {doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + ' MB' : '-'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ประเภท: {doc.documentType || 'เอกสาร'}
                                    </span>
                      </div>
                      </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ อัปโหลดแล้ว
                                </span>
                      </div>
                              <div className="flex gap-2">
                                <Button
                                  color="secondary"
                        variant="bordered"
                        size="sm"
                                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 rounded-lg shadow-sm transition-all duration-200"
                                  onPress={() => {
                                    if (doc.filePath || doc.url) {
                                      window.open(doc.filePath || doc.url, '_blank');
                                    } else {
                                      alert('ไม่พบไฟล์');
                                    }
                                  }}
                                >
                                  ดูตัวอย่าง
                                </Button>
                      <Button
                                  color="danger"
                                  variant="bordered"
                        size="sm"
                                  className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                                  onPress={() => {
                                    if (confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
                                      handleDeleteDocument(doc.id, doc.documentType);
                                    }
                                  }}
                                >
                                  <TrashIcon className="w-4 h-4" />
                      </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-400 mb-4">
                            <DocumentTextIcon className="w-16 h-16 mx-auto" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">ไม่มีเอกสารแนบ</h3>
                          <p className="text-gray-500 text-sm">
                            ยังไม่มีเอกสารแนบสำหรับใบสมัครงานนี้
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  ปิด
                </Button>
                {selectedApplication && (
                  <div className="flex items-center gap-2">
                    <Button 
                      color="secondary" 
                      variant="flat"
                      startContent={<PrinterIcon className="w-4 h-4" />}
                      onPress={() => handlePrintDocument(selectedApplication)}
                    >
                      พิมพ์เอกสาร
                    </Button>
                    <Select
                      size="sm"
                      aria-label="เลือกสถานะใบสมัคร"
                      selectedKeys={[detailStatus]}
                      onSelectionChange={(keys) => setDetailStatus(Array.from(keys)[0] as string)}
                      className="w-44"
                    >
                      <SelectItem key="รอพิจารณา">รอพิจารณา</SelectItem>
                      <SelectItem key="อนุมัติ">อนุมัติ</SelectItem>
                    </Select>
                    <Button 
                      color="primary" 
                      variant="solid"
                      onPress={() => {
                        if (!detailStatus) return;
                        handleStatusUpdate(selectedApplication.id, detailStatus);
                      }}
                    >
                      บันทึก
                    </Button>
                  </div>
                )}
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
                          <p className="text-gray-600">
                            {
                              (() => {
                                const byId = missionGroups.find(g => g.id === String((application as any).missionGroupId || ''))?.name;
                                if (byId) return byId;
                                const dept = hospitalDepartments.find(d => d.name === application.department);
                                if (!dept?.missionGroupId) return '-';
                                return missionGroups.find(g => g.id === String(dept.missionGroupId))?.name || '-';
                              })()
                            }
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">{application.department}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {new Date(application.createdAt).toLocaleDateString('th-TH')}
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
      {/* Preview File Modal */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                ดูตัวอย่างไฟล์: {previewFile.name || 'ไม่ระบุชื่อ'}
              </h3>
                    <button
                onClick={handleClosePreviewModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
                    </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {previewFile.type === 'pdf' ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-0"
                  title={previewFile.name}
                />
              ) : previewFile.type === 'jpg' || previewFile.type === 'jpeg' || previewFile.type === 'png' || previewFile.type === 'gif' ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้</p>
                    <p className="text-sm text-gray-500 mt-2">ประเภทไฟล์: {previewFile.type}</p>
                    <Button
                      color="primary"
                      variant="flat"
                      className="mt-4"
                      onClick={() => window.open(previewFile.url, '_blank')}
                    >
                      เปิดไฟล์ในแท็บใหม่
                    </Button>
                  </div>
              </div>
            )}
              </div>
            <div className="flex justify-end p-4 border-t">
              <Button
                onClick={handleClosePreviewModal}
                color="primary"
                variant="solid"
              >
                ปิด
              </Button>
            </div>
          </div>
        </div>
      )}

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
                          <p className="text-gray-600">
                            {
                              (() => {
                                const byId = missionGroups.find(g => g.id === String((application as any).missionGroupId || ''))?.name;
                                if (byId) return byId;
                                const dept = hospitalDepartments.find(d => d.name === application.department);
                                if (!dept?.missionGroupId) return '-';
                                return missionGroups.find(g => g.id === String(dept.missionGroupId))?.name || '-';
                              })()
                            }
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600">{application.department}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {new Date(application.createdAt).toLocaleDateString('th-TH')}
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
    </div>
  );
} 
