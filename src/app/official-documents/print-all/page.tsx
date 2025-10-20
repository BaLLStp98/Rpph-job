'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import { DocumentTextIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Interface สำหรับข้อมูลที่ส่งมาจาก application-data
interface ApplicationData {
  id: string;
  submittedAt: string;
  status: string;
  prefix: string;
  firstName: string;
  lastName: string;
  idNumber?: string;
  idCardIssuedAt?: string;
  idCardIssueDate?: string;
  idCardExpiryDate?: string;
  birthDate: string;
  age?: string;
  race?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: string;
  addressAccordingToHouseRegistration?: string;
  // ฟิลด์ย่อยสำหรับที่อยู่ตามทะเบียนบ้าน
  houseRegistrationAddress?: {
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
  currentAddress: string;
  // ฟิลด์ย่อยสำหรับที่อยู่ปัจจุบัน
  currentAddressDetail?: {
    houseNumber: string;
    villageNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
    phone?: string;
    mobilePhone?: string;
    mobile?: string;
  };
  phone: string;
  email: string;
  emergencyContact?: string;
  emergencyContactFirstName?: string;
  emergencyContactLastName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  emergencyAddress?: {
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
  emergencyWorkplace?: {
    name: string;
    district: string;
    province: string;
    phone: string;
  };
  appliedPosition: string;
  expectedSalary: string;
  availableDate?: string;
  currentWork?: boolean;
  department?: string;
  division?: string;
  previousGovernmentService?: Array<{
    position: string;
    department: string;
    resignationReason: string;
    resignationDate: string;
  }>;
  education: Array<{
    level?: string;
    degree?: string;
    institution?: string;
    school?: string;
    major?: string;
    year?: string;
    graduationYear?: string;
    gpa: string;
  }>;
  workExperience: Array<{
    position: string;
    company: string;
    district?: string;
    province?: string;
    startDate: string;
    endDate: string;
    description?: string;
    salary?: string;
    reason?: string;
    phone?: string;
    reasonForLeaving?: string;
  }>;
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  spouseInfo?: {
    firstName: string;
    lastName: string;
  };
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
  // ฟิลด์ที่อยู่แบบแยกจากฐานข้อมูล
  house_registration_house_number?: string;
  house_registration_village_number?: string;
  house_registration_alley?: string;
  house_registration_road?: string;
  house_registration_sub_district?: string;
  house_registration_district?: string;
  house_registration_province?: string;
  house_registration_postal_code?: string;
  house_registration_phone?: string;
  house_registration_mobile?: string;
  current_address_house_number?: string;
  current_address_village_number?: string;
  current_address_alley?: string;
  current_address_road?: string;
  current_address_sub_district?: string;
  current_address_district?: string;
  current_address_province?: string;
  current_address_postal_code?: string;
  current_address_phone?: string;
  current_address_mobile?: string;
  emergency_address_house_number?: string;
  emergency_address_village_number?: string;
  emergency_address_alley?: string;
  emergency_address_road?: string;
  emergency_address_sub_district?: string;
  emergency_address_district?: string;
  emergency_address_province?: string;
  emergency_address_postal_code?: string;
  emergency_address_phone?: string;
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
  multipleEmployers?: string[];
  staffInfo?: {
    position: string;
    department: string;
    startWork: string;
  };
  profileImage?: string;
  updatedAt?: string;
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

export default function PrintAllDocuments() {
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // helper: แปลง path ให้เป็น public URL ที่ปลอดภัย
  const toPublicUrl = (rawPath?: string): string => {
    if (!rawPath) return '';
    const p = rawPath.startsWith('http') ? rawPath : (rawPath.startsWith('/') ? rawPath : `/${rawPath}`);
    return encodeURI(p);
  };

  // helper: แก้ปัญหา _next/image ซ้อน /api/image?file=...
  const resolveProfileImage = (raw?: string): string => {
    console.log('🔍 resolveProfileImage - Input:', raw);
    
    if (!raw) {
      console.log('🔍 resolveProfileImage - No raw input, returning empty string');
      return '';
    }
    
    if (raw.startsWith('/api/image?')) {
      console.log('🔍 resolveProfileImage - Already has /api/image?, returning as is');
      return raw; // อย่าห่อซ้ำ
    }
    
    if (raw.startsWith('http')) {
      console.log('🔍 resolveProfileImage - HTTP URL, returning as is');
      return raw;
    }
    
    if (raw.startsWith('/')) {
      console.log('🔍 resolveProfileImage - Absolute path, returning as is');
      return raw;
    }
    
    const result = `/api/image?file=${encodeURIComponent(raw)}`;
    console.log('🔍 resolveProfileImage - Result:', result);
    return result;
  };

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDateThai = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Helper: คืนค่า วัน/เดือน(ชื่อไทย)/ปี ค.ศ. แยกส่วน
  const getThaiDay = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return String(d.getDate());
  };

  const getThaiMonthName = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('th-TH-u-ca-gregory', { month: 'long' }).format(d);
  };

  const getGregorianYear = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return String(d.getFullYear());
  };

  // ฟังก์ชันสำหรับแยกข้อมูลที่อยู่
  const parseAddress = (addressString: string) => {
    if (!addressString) return {};
    
    const patterns = [
      /บ้านเลขที่\s*(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*\/\d+[ก-๙]*)\s*ซอย\s*([^ถนน]+)\s*ถนน\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ซอย\s*([^ตำบล]+)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
      /(\d+[ก-๙]*)\s*หมู่\s*(\d+[ก-๙]*)\s*ตำบล\s*([^อำเภอ]+)\s*อำเภอ\s*([^จังหวัด]+)\s*จังหวัด\s*([^0-9]+)\s*(\d{5})/,
    ];

    for (const pattern of patterns) {
      const match = addressString.match(pattern);
      if (match) {
        if (pattern === patterns[0] || pattern === patterns[1]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: match[3].trim(),
            road: match[4].trim(),
            subDistrict: match[5].trim(),
            district: match[6].trim(),
            province: match[7].trim(),
            postalCode: match[8],
          };
        } else if (pattern === patterns[2]) {
          return {
            houseNumber: match[1],
            villageNumber: '',
            alley: match[2].trim(),
            road: match[3].trim(),
            subDistrict: match[4].trim(),
            district: match[5].trim(),
            province: match[6].trim(),
            postalCode: match[7],
          };
        } else if (pattern === patterns[3]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: '',
            road: '',
            subDistrict: match[3].trim(),
            district: match[4].trim(),
            province: match[5].trim(),
            postalCode: match[6],
          };
        } else if (pattern === patterns[4]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: match[3].trim(),
            road: '',
            subDistrict: match[4].trim(),
            district: match[5].trim(),
            province: match[6].trim(),
            postalCode: match[7],
          };
        } else if (pattern === patterns[5]) {
          return {
            houseNumber: match[1],
            villageNumber: match[2],
            alley: '',
            road: '',
            subDistrict: match[3].trim(),
            district: match[4].trim(),
            province: match[5].trim(),
            postalCode: match[6],
          };
        }
      }
    }

    const parts = addressString.split(',').map(part => part.trim());
    if (parts.length >= 4) {
      return {
        houseNumber: parts[0] || '',
        villageNumber: parts[1] || '',
        alley: parts[2] || '',
        road: parts[3] || '',
        subDistrict: parts[4] || '',
        district: parts[5] || '',
        province: parts[6] || '',
        postalCode: parts[7] || '',
      };
    }

    return {};
  };

  // ฟังก์ชันแปลงชื่อประเภทเอกสารเป็นภาษาไทย
  const getDocumentTypeName = (documentType: string) => {
    const typeNames: {[key: string]: string} = {
      'idCard': 'สำเนาบัตรประชาชน',
      'houseRegistration': 'สำเนาทะเบียนบ้าน',
      'educationCertificate': 'ใบรับรองการศึกษา',
      'militaryCertificate': 'ใบรับรองการเกณฑ์ทหาร',
      'medicalCertificate': 'ใบรับรองแพทย์',
      'drivingLicense': 'ใบขับขี่',
      'nameChangeCertificate': 'ใบเปลี่ยนชื่อ'
    };
    return typeNames[documentType] || documentType;
  };

  // แปลงพาธไฟล์แนบให้เป็น URL สาธารณะที่ปลอดภัย (รองรับชื่อไฟล์ภาษาไทย/ช่องว่าง)
  const getAttachmentUrl = (rawPath: string): string => {
    if (!rawPath) return '';
    const publicPath = rawPath.startsWith('http') ? rawPath : (rawPath.startsWith('/') ? rawPath : `/${rawPath}`);
    // ใช้ encodeURI เพื่อคงเครื่องหมาย / และเข้ารหัสเฉพาะอักขระที่จำเป็น เหมาะกับชื่อไฟล์ภาษาไทยและช่องว่าง
    return encodeURI(publicPath);
  };

  // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมด
  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching all applications...');
      
      const response = await fetch('/api/resume-deposit?admin=true&limit=100', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('🔍 All Applications API Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.log('🔍 Could not parse error JSON:', jsonError);
        }
        
        console.error('❌ All Applications API Error:', {
          status: response.status,
          message: errorMessage
        });
        
        throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${errorMessage}`);
      }
      
      const responseData = await response.json();
      console.log('🔍 All Applications Response data received:', !!responseData);
      console.log('🔍 All Applications Response success:', responseData.success);
      
      if (!responseData.success) {
        const errorMsg = responseData.message || 'Failed to fetch applications';
        console.error('❌ All Applications API returned success: false:', errorMsg);
        throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${errorMsg}`);
      }
      
      const applications = responseData.data;
      
      if (!applications || !Array.isArray(applications)) {
        console.error('❌ No applications data in response');
        throw new Error('ไม่พบข้อมูลใบสมัครงาน');
      }
      
      console.log('✅ All Applications received successfully:', {
        count: applications.length,
        firstApp: applications[0] ? {
          id: applications[0].id,
          name: `${applications[0].firstName} ${applications[0].lastName}`,
          position: applications[0].expectedPosition,
          hasProfileImage: !!applications[0].profileImageUrl,
          profileImageUrl: applications[0].profileImageUrl
        } : null
      });
      
      // แสดงรายการใบสมัครงานทั้งหมด
      setApplicationData({
        id: 'all',
        firstName: 'รายการใบสมัครงานทั้งหมด',
        lastName: '',
        expectedPosition: 'ทั้งหมด',
        department: 'ทั้งหมด',
        profileImage: null,
        profileImageUrl: null,
        // เพิ่มข้อมูลอื่นๆ ตามต้องการ
      } as any);
      
      // เก็บรายการทั้งหมดไว้ใน state
      setAllApplications(applications);
      
    } catch (err) {
      console.error('❌ Error fetching all applications:', err);
      
      let userFriendlyMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      
      if (err instanceof Error) {
        if (err.message.includes('ไม่พบข้อมูล')) {
          userFriendlyMessage = 'ไม่พบข้อมูลใบสมัครงาน';
        } else if (err.message.includes('ไม่มีสิทธิ์')) {
          userFriendlyMessage = 'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
        } else if (err.message.includes('ระบบ')) {
          userFriendlyMessage = 'เกิดข้อผิดพลาดในระบบ';
        } else {
          userFriendlyMessage = err.message;
        }
      }
      
      console.error('❌ Final error message:', userFriendlyMessage);
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchApplicationData = async (applicationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // ตรวจสอบว่า applicationId มีค่าหรือไม่
      if (!applicationId || applicationId.trim() === '') {
        console.error('❌ Invalid application ID:', applicationId);
        throw new Error('ไม่พบ ID ของใบสมัครงาน');
      }
      
      console.log('🔍 Fetching application data for ID:', applicationId);
      
      // ดึงข้อมูลจาก ResumeDeposit เท่านั้น
      const apiUrl = `/api/resume-deposit/${applicationId}`;
      console.log('🔍 Frontend - Fetching from API:', apiUrl);
      console.log('🔍 Frontend - Application ID:', applicationId);
      console.log('🔍 Frontend - Current URL:', window.location.href);
      
      // ตรวจสอบว่า URL ถูกต้องหรือไม่
      if (!apiUrl.includes(applicationId)) {
        console.error('❌ Invalid API URL construction');
        throw new Error('ไม่สามารถสร้าง URL สำหรับ API ได้');
      }
      
      const response = await fetch(apiUrl, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('🔍 Frontend - API Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        url: response.url,
        type: response.type,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // ตรวจสอบว่า response เป็น valid หรือไม่
      if (!response) {
        console.error('❌ No response received from API');
        throw new Error('ไม่ได้รับ response จาก API');
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.log('🔍 Could not parse error JSON:', jsonError);
        }
        
        console.error('❌ API Error:', {
          status: response.status,
          message: errorMessage,
          applicationId: applicationId,
          url: `/api/resume-deposit/${applicationId}`
        });
        
        // แสดงข้อความ error ที่เป็นมิตรกับผู้ใช้
        if (response.status === 404) {
          throw new Error('ไม่พบข้อมูลใบสมัครงานที่ต้องการ');
        } else if (response.status === 403) {
          throw new Error('ไม่มีสิทธิ์เข้าถึงข้อมูลนี้');
        } else if (response.status === 500) {
          throw new Error('เกิดข้อผิดพลาดในระบบ');
        } else {
          throw new Error(`เกิดข้อผิดพลาด: ${errorMessage}`);
        }
      }
      
      // ตรวจสอบว่า response มี content หรือไม่
      const contentType = response.headers.get('content-type');
      console.log('🔍 Response content type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Response is not JSON:', contentType);
        throw new Error('API ไม่ส่งข้อมูลในรูปแบบ JSON');
      }
      
      const responseData = await response.json();
      console.log('🔍 Frontend - Response data received:', !!responseData);
      console.log('🔍 Frontend - Response data type:', typeof responseData);
      console.log('🔍 Frontend - Response data keys:', Object.keys(responseData));
      console.log('🔍 Frontend - Response success:', responseData.success);
      
      if (!responseData.success) {
        const errorMsg = responseData.message || 'Failed to fetch application data';
        console.error('❌ API returned success: false:', errorMsg);
        throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${errorMsg}`);
      }
      
      const data = responseData.data;
      
      if (!data) {
        console.error('❌ No data in response');
        console.error('❌ ResponseData structure:', Object.keys(responseData));
        throw new Error('ไม่พบข้อมูลในระบบ');
      }
      
      // ตรวจสอบว่า data มีโครงสร้างที่ถูกต้องหรือไม่
      if (typeof data !== 'object') {
        console.error('❌ Data is not an object:', typeof data);
        throw new Error('ข้อมูลที่ได้รับไม่ถูกต้อง');
      }
      
      console.log('✅ Frontend - Data received successfully:', {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        expectedPosition: data.expectedPosition,
        hasProfileImage: !!data.profileImageUrl,
        profileImageUrl: data.profileImageUrl,
        profileImage: data.profileImage,
        dataKeys: Object.keys(data)
      });
      
      // Debug: แสดงข้อมูลที่ได้รับจาก API
      console.log('🔍 Print-All API Response Data:', data);
      console.log('🔍 Print-All Data keys:', Object.keys(data));
      console.log('🔍 Print-All Raw data fields:', {
        prefix: data.prefix,
        firstName: data.firstName,
        lastName: data.lastName,
        idNumber: data.idNumber,
        birthDate: data.birthDate,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        idCardIssuedAt: data.idCardIssuedAt,
        idCardIssueDate: data.idCardIssueDate,
        idCardExpiryDate: data.idCardExpiryDate,
        house_registration_house_number: data.house_registration_house_number,
        house_registration_village_number: data.house_registration_village_number,
        house_registration_alley: data.house_registration_alley,
        house_registration_road: data.house_registration_road,
        house_registration_sub_district: data.house_registration_sub_district,
        house_registration_district: data.house_registration_district,
        house_registration_province: data.house_registration_province,
        house_registration_postal_code: data.house_registration_postal_code,
        addressAccordingToHouseRegistration: data.addressAccordingToHouseRegistration
      });
      
      // ข้อมูลจาก ResumeDeposit เท่านั้น
      console.log('🔍 Data source: ResumeDeposit');
      console.log('🔍 ResumeDeposit fields:', { 
        hasExpectedPosition: !!data.expectedPosition,
        hasSchool: !!data.education?.[0]?.school,
        hasDescription: !!data.workExperience?.[0]?.description
      });
      
      // แปลงข้อมูลจาก ResumeDeposit เป็น ApplicationData
      const applicationData: ApplicationData = {
        id: data.id,
        submittedAt: data.createdAt || data.submittedAt || data.applicationDate || '',
        status: data.status || 'PENDING',
        prefix: data.prefix || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        idNumber: data.idNumber || '',
        idCardIssuedAt: data.idCardIssuedAt || '',
        idCardIssueDate: data.idCardIssueDate || '',
        idCardExpiryDate: data.idCardExpiryDate || '',
        birthDate: data.birthDate || '',
        age: data.age || '',
        race: data.race || '',
        placeOfBirth: data.placeOfBirth || data.birthPlace || '',
        placeOfBirthProvince: data.placeOfBirthProvince || data.birthProvince || '',
        gender: data.gender === 'MALE' ? 'ชาย' : data.gender === 'FEMALE' ? 'หญิง' : data.gender || '',
        nationality: data.nationality || '',
        religion: data.religion || '',
        maritalStatus: data.maritalStatus === 'SINGLE' ? 'โสด' : 
                      data.maritalStatus === 'MARRIED' ? 'สมรส' : 
                      data.maritalStatus === 'DIVORCED' ? 'หย่าร้าง' : 
                      data.maritalStatus === 'WIDOWED' ? 'หม้าย' : data.maritalStatus || '',
        addressAccordingToHouseRegistration: data.addressAccordingToHouseRegistration || data.address || '',
        houseRegistrationAddress: data.houseRegistrationAddress || undefined,
        currentAddress: data.currentAddress || data.address || '',
        currentAddressDetail: data.currentAddressDetail || undefined,
        phone: data.phone || '',
        email: data.email || '',
        emergencyContact: data.emergencyContact || data.emergencyContactFirstName + ' ' + data.emergencyContactLastName || '',
        emergencyContactFirstName: data.emergencyContactFirstName || '',
        emergencyContactLastName: data.emergencyContactLastName || '',
        emergencyContactRelationship: data.emergencyContactRelationship || data.emergencyRelationship || '',
        emergencyContactPhone: data.emergencyContactPhone || data.emergencyPhone || '',
        emergencyPhone: data.emergencyPhone || data.emergencyContactPhone || '',
        emergencyRelationship: data.emergencyRelationship || data.emergencyContactRelationship || '',
        emergencyAddress: data.emergencyAddress || undefined,
        emergencyWorkplace: data.emergencyWorkplace || undefined,
        // ใช้ expectedPosition สำหรับ ResumeDeposit
        appliedPosition: data.expectedPosition || data.position || '',
        expectedSalary: data.expectedSalary || data.salary || '',
        availableDate: data.availableDate || data.availableStartDate || '',
        currentWork: data.currentWork || data.isCurrentlyWorking || false,
        department: data.department || data.appliedDepartment || '',
        division: data.division || data.appliedDivision || '',
        previousGovernmentService: data.previousGovernmentService || [],
        education: (data.education || []).map((edu: any) => ({
          level: edu.level || '',
          degree: edu.degree || '',
          // ใช้ school สำหรับ ResumeDeposit
          institution: edu.school || edu.institution || '',
          school: edu.school || edu.institution || '',
          major: edu.major || '',
          year: edu.year || edu.endYear || '',
          graduationYear: edu.graduationYear || edu.endYear || edu.year || '',
          gpa: edu.gpa || ''
        })),
        workExperience: (data.workExperience || []).map((work: any) => ({
          position: work.position || '',
          company: work.company || '',
          district: work.district || '',
          province: work.province || '',
          startDate: work.startDate || '',
          endDate: work.endDate || '',
          description: work.description || '',
          salary: work.salary || '',
          // ใช้ description สำหรับ ResumeDeposit
          reason: work.description || work.reason || '',
          phone: work.phone || '',
          reasonForLeaving: work.reasonForLeaving || ''
        })),
        skills: data.skills || data.specialSkills || data.abilities || '',
        languages: data.languages || data.languageSkills || data.foreignLanguages || '',
        computerSkills: data.computerSkills || data.computerKnowledge || data.technicalSkills || '',
        certificates: data.certificates || data.certifications || data.licenses || '',
        references: data.references || data.referencePersons || data.recommendations || '',
        spouseInfo: data.spouseInfo || (data.spouseFirstName || data.spouseLastName ? {
          firstName: data.spouseFirstName || data.spouseName || '',
          lastName: data.spouseLastName || data.spouseSurname || ''
        } : undefined),
        registeredAddress: data.registeredAddress || undefined,
        // ฟิลด์ที่อยู่แบบแยกจากฐานข้อมูล
        house_registration_house_number: data.house_registration_house_number || data.houseNumber || '',
        house_registration_village_number: data.house_registration_village_number || data.villageNumber || '',
        house_registration_alley: data.house_registration_alley || data.alley || '',
        house_registration_road: data.house_registration_road || data.road || '',
        house_registration_sub_district: data.house_registration_sub_district || data.subDistrict || '',
        house_registration_district: data.house_registration_district || data.district || '',
        house_registration_province: data.house_registration_province || data.province || '',
        house_registration_postal_code: data.house_registration_postal_code || data.postalCode || '',
        house_registration_phone: data.house_registration_phone || data.phone || '',
        house_registration_mobile: data.house_registration_mobile || data.mobile || data.phone || '',
        current_address_house_number: data.current_address_house_number || data.currentHouseNumber || '',
        current_address_village_number: data.current_address_village_number || data.currentVillageNumber || '',
        current_address_alley: data.current_address_alley || data.currentAlley || '',
        current_address_road: data.current_address_road || data.currentRoad || '',
        current_address_sub_district: data.current_address_sub_district || data.currentSubDistrict || '',
        current_address_district: data.current_address_district || data.currentDistrict || '',
        current_address_province: data.current_address_province || data.currentProvince || '',
        current_address_postal_code: data.current_address_postal_code || data.currentPostalCode || '',
        current_address_phone: data.current_address_phone || data.currentPhone || data.phone || '',
        current_address_mobile: data.current_address_mobile || data.currentMobile || data.mobile || data.phone || '',
        emergency_address_house_number: data.emergency_address_house_number || data.emergencyHouseNumber || '',
        emergency_address_village_number: data.emergency_address_village_number || data.emergencyVillageNumber || '',
        emergency_address_alley: data.emergency_address_alley || data.emergencyAlley || '',
        emergency_address_road: data.emergency_address_road || data.emergencyRoad || '',
        emergency_address_sub_district: data.emergency_address_sub_district || data.emergencySubDistrict || '',
        emergency_address_district: data.emergency_address_district || data.emergencyDistrict || '',
        emergency_address_province: data.emergency_address_province || data.emergencyProvince || '',
        emergency_address_postal_code: data.emergency_address_postal_code || data.emergencyPostalCode || '',
        emergency_address_phone: data.emergency_address_phone || data.emergencyPhone || data.emergencyContactPhone || '',
        medicalRights: data.medicalRights || undefined,
        multipleEmployers: data.multipleEmployers || data.otherEmployers || [],
        staffInfo: data.staffInfo || undefined,
        // จัดการ profile image สำหรับ ResumeDeposit
        profileImage: data.profileImage || data.photo || data.avatar || data.image || data.picture || data.profile_image || data.user_image || '',
        updatedAt: data.updatedAt || data.modifiedAt || '',
        documents: data.documents || undefined,
        placeOfBirth: data.placeOfBirth || data.birthPlace || '',
        placeOfBirthProvince: data.placeOfBirthProvince || data.birthProvince || '',
        age: data.age || data.ageYears || '',
        race: data.race || data.ethnicity || '',
        nationality: data.nationality || data.citizenship || '',
        religion: data.religion || data.faith || '',
        idCardIssuedAt: data.idCardIssuedAt || data.idCardIssuedPlace || data.idCardIssuedLocation || '',
        idCardIssueDate: data.idCardIssueDate || data.idCardIssuedDate || data.idCardDate || '',
        idCardExpiryDate: data.idCardExpiryDate || data.idCardExpireDate || data.idCardExpirationDate || '',
        idNumber: data.idNumber || data.idCardNumber || data.nationalId || data.citizenId || '',
        phone: data.phone || data.telephone || data.phoneNumber || data.contactPhone || '',
        email: data.email || data.emailAddress || data.contactEmail || '',
        addressAccordingToHouseRegistration: data.addressAccordingToHouseRegistration || data.houseRegistrationAddress || data.registeredAddress || '',
        currentAddress: data.currentAddress || data.address || data.currentResidence || data.presentAddress || '',
        emergencyContact: data.emergencyContact || data.emergencyContactName || data.emergencyPerson || data.emergencyName || '',
        emergencyContactFirstName: data.emergencyContactFirstName || data.emergencyFirstName || data.emergencyName || '',
        emergencyContactLastName: data.emergencyContactLastName || data.emergencyLastName || data.emergencySurname || '',
        emergencyContactRelationship: data.emergencyContactRelationship || data.emergencyRelationship || data.emergencyRelation || '',
        emergencyContactPhone: data.emergencyContactPhone || data.emergencyPhone || data.emergencyContactNumber || '',
        appliedPosition: data.appliedPosition || data.expectedPosition || data.position || data.jobPosition || data.desiredPosition || '',
        expectedSalary: data.expectedSalary || data.salary || data.desiredSalary || data.expectedWage || '',
        availableDate: data.availableDate || data.availableStartDate || data.startDate || data.availableFrom || '',
        currentWork: data.currentWork || data.isCurrentlyWorking || data.currentlyWorking || false,
        department: data.department || data.appliedDepartment || data.departmentName || '',
        division: data.division || data.appliedDivision || data.divisionName || '',
        // ข้อมูลจาก ResumeDeposit เท่านั้น
        source: 'ResumeDeposit'
      };
      
      // Debug: แสดงข้อมูลที่แปลงแล้ว
      console.log('🔍 Print-All Mapped ApplicationData:', applicationData);
      console.log('🔍 Print-All Key fields check:', {
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        prefix: applicationData.prefix,
        idNumber: applicationData.idNumber,
        birthDate: applicationData.birthDate,
        gender: applicationData.gender,
        maritalStatus: applicationData.maritalStatus,
        idCardIssuedAt: applicationData.idCardIssuedAt,
        idCardIssueDate: applicationData.idCardIssueDate,
        idCardExpiryDate: applicationData.idCardExpiryDate
      });
      console.log('🔍 Print-All Address fields check:', {
        house_registration_house_number: applicationData.house_registration_house_number,
        house_registration_village_number: applicationData.house_registration_village_number,
        house_registration_alley: applicationData.house_registration_alley,
        house_registration_road: applicationData.house_registration_road,
        house_registration_sub_district: applicationData.house_registration_sub_district,
        house_registration_district: applicationData.house_registration_district,
        house_registration_province: applicationData.house_registration_province,
        house_registration_postal_code: applicationData.house_registration_postal_code,
        addressAccordingToHouseRegistration: applicationData.addressAccordingToHouseRegistration
      });
      
      setApplicationData(applicationData);
      
      console.log('✅ Application data loaded successfully:', {
        id: applicationData.id,
        name: `${applicationData.prefix} ${applicationData.firstName} ${applicationData.lastName}`,
        position: applicationData.appliedPosition,
        department: applicationData.department,
        hasProfileImage: !!applicationData.profileImage,
        profileImage: applicationData.profileImage,
        profileImageUrl: applicationData.profileImageUrl
      });
      
      // Debug: ตรวจสอบข้อมูล profileImage
      console.log('🔍 Print-All Profile Image Debug:');
      console.log('• Raw data keys:', Object.keys(data));
      console.log('• Raw profileImage:', data.profileImage);
      console.log('• Raw photo:', data.photo);
      console.log('• Raw avatar:', data.avatar);
      console.log('• Raw profileImageUrl:', data.profileImageUrl);
      console.log('• Raw image:', data.image);
      console.log('• Raw picture:', data.picture);
      console.log('• Raw profile_image:', data.profile_image);
      console.log('• Raw user_image:', data.user_image);
      console.log('• Mapped profileImage:', applicationData.profileImage);
      console.log('• Profile Image Type:', typeof applicationData.profileImage);
      console.log('• Profile Image Length:', applicationData.profileImage?.length);
      console.log('• Profile Image URL:', applicationData.profileImage ? 
        (applicationData.profileImage.startsWith('http') ? 
          applicationData.profileImage : 
          `/api/image?file=${encodeURIComponent(applicationData.profileImage)}`) : 
        'No image');
      console.log('• Resolved Profile Image URL:', resolveProfileImage(applicationData.profileImage));
      
      // ดึงข้อมูลเอกสารแนบ
      if (applicationData.id) {
        try {
          console.log('🔍 Fetching documents for application ID:', applicationData.id);
          const documents = await fetchUploadedDocuments(applicationData.id);
          console.log('📄 Fetched documents:', documents);
          console.log('📄 Documents count:', documents.length);
          setUploadedDocuments(documents);

          // หากยังไม่มีรูปโปรไฟล์ ให้พยายามดึงจากไฟล์แนบ (ไฟล์รูปแรกหรือ documentType ที่สื่อถึงรูปโปรไฟล์)
          const currentImg = applicationData.profileImage || (applicationData as any).profileImageUrl;
          if (!currentImg && Array.isArray(documents) && documents.length > 0) {
            const profileDoc = documents.find((d: any) =>
              (d.documentType && ['profileImage','profile_photo','photo','avatar'].includes(String(d.documentType)))
              && d.mimeType && d.mimeType.startsWith('image/')
            ) || documents.find((d: any) => d.mimeType && d.mimeType.startsWith('image/'));

            if (profileDoc && profileDoc.filePath) {
              const derivedUrl = toPublicUrl(profileDoc.filePath);
              setApplicationData(prev => prev ? ({ ...prev, profileImage: derivedUrl }) : prev);
              console.log('🖼️ Derived profile image from attachments:', derivedUrl);
            }
          }
        } catch (error) {
          console.error('❌ Error fetching documents:', error);
          setUploadedDocuments([]);
        }
      } else {
        console.log('⚠️ No application ID found, skipping document fetch');
      }
    } catch (err) {
      console.error('❌ Error fetching application data:', err);
      
      // แสดงข้อมูล error ที่ละเอียดขึ้น
      if (err instanceof Error) {
        console.error('❌ Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
          applicationId: applicationId,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('❌ Unknown error:', err);
      }
      
      // ลองใช้ข้อมูลจาก URL parameters เป็น fallback
      console.log('🔄 Trying URL parameters fallback...');
      if (searchParams) {
        try {
          const data: Partial<ApplicationData> = {};
          let hasData = false;
          
          searchParams.forEach((value, key) => {
            try {
              if (value.startsWith('{') || value.startsWith('[')) {
                (data as any)[key] = JSON.parse(value);
                hasData = true;
              } else {
                (data as any)[key] = value;
                hasData = true;
              }
            } catch (parseError) {
              console.warn(`⚠️ Failed to parse parameter ${key}:`, parseError);
            }
          });
          
          if (hasData) {
            console.log('✅ Using URL parameters fallback data');
            setApplicationData(data as ApplicationData);
            setLoading(false);
            return;
          }
        } catch (fallbackError) {
          console.error('❌ URL parameters fallback failed:', fallbackError);
        }
      }
      
      // แสดงข้อความ error ที่เป็นมิตรกับผู้ใช้
      let userFriendlyMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      
      if (err instanceof Error) {
        if (err.message.includes('ไม่พบข้อมูล')) {
          userFriendlyMessage = 'ไม่พบข้อมูลใบสมัครงานที่ต้องการ';
        } else if (err.message.includes('ไม่มีสิทธิ์')) {
          userFriendlyMessage = 'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
        } else if (err.message.includes('ระบบ')) {
          userFriendlyMessage = 'เกิดข้อผิดพลาดในระบบ';
        } else {
          userFriendlyMessage = err.message;
        }
      }
      
      console.error('❌ Final error message:', userFriendlyMessage);
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลเอกสารที่อัปโหลดแล้ว
  const fetchUploadedDocuments = async (resumeDepositId: string) => {
    try {
      console.log('🌐 Calling API:', `/api/resume-documents?resumeDepositId=${resumeDepositId}`);
      const response = await fetch(`/api/resume-documents?resumeDepositId=${resumeDepositId}`);
      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ API Response not OK:', response.status, response.statusText);
        return [];
      }
      
      const result = await response.json();
      console.log('📋 API Response data:', result);
      
      if (result.success) {
        console.log('✅ Documents fetched successfully:', result.data);
        return result.data || [];
      } else {
        console.error('❌ Fetch documents failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      return [];
    }
  };

  // โหลดข้อมูลจาก URL parameters หรือ API
  useEffect(() => {
    const applicationId = searchParams?.get('id');
    
    console.log('🔍 useEffect - Application ID:', applicationId);
    console.log('🔍 useEffect - Search Params:', searchParams?.toString());
    console.log('🔍 useEffect - Current URL:', window.location.href);
    
    if (applicationId) {
      console.log('🔍 Starting to fetch application data for ID:', applicationId);
      // ดึงข้อมูลจาก API โดยใช้ ID
      fetchApplicationData(applicationId);
    } else {
      console.log('🔍 No specific ID, fetching all applications');
      // ดึงข้อมูลทั้งหมด
      fetchAllApplications();
    }
    
    if (searchParams) {
      // Fallback: ใช้ URL parameters แบบเดิม
      const data: Partial<ApplicationData> = {};
      
      searchParams.forEach((value, key) => {
        try {
          if (value.startsWith('{') || value.startsWith('[')) {
            (data as any)[key] = JSON.parse(value);
          } else {
            (data as any)[key] = value;
          }
        } catch {
          (data as any)[key] = value;
        }
      });

      if (Object.keys(data).length > 0) {
        setApplicationData(data as ApplicationData);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  // ฟังก์ชันพิมพ์เฉพาะ 4 หน้าใบสมัครงาน
  const handlePrint = () => {
    // เพิ่ม CSS สำหรับการพิมพ์เพื่อให้รูปภาพคมชัดและซ่อนเอกสารแนบ
    const printStyles = `
      @media print {
        img {
          image-rendering: high-quality !important;
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .profile-image-container {
          image-rendering: high-quality !important;
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
        }
        /* ซ่อนเอกสารแนบ */
        .hide-on-print {
          display: none !important;
        }
        /* ซ่อนส่วนที่เกิน 4 หน้า */
        .page-5-and-beyond {
          display: none !important;
        }
      }
    `;
    
    // เพิ่ม stylesheet สำหรับการพิมพ์
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    // ซ่อนเอกสารแนบก่อนพิมพ์
    const documentSections = document.querySelectorAll('.document-section');
    documentSections.forEach(section => {
      section.classList.add('hide-on-print');
    });
    
    // พิมพ์
    window.print();
    
    // ลบ stylesheet และแสดงเอกสารแนบกลับมาหลังพิมพ์เสร็จ
    setTimeout(() => {
      document.head.removeChild(styleSheet);
      documentSections.forEach(section => {
        section.classList.remove('hide-on-print');
      });
    }, 1000);
  };

  // ฟังก์ชันพิมพ์เฉพาะไฟล์แนบ
  const handlePrintAttachments = () => {
    console.log('🔍 Print Attachments - Uploaded Documents:', uploadedDocuments);
    console.log('🔍 Print Attachments - Documents Count:', uploadedDocuments.length);
    
    if (uploadedDocuments.length === 0) {
      alert('ไม่มีไฟล์แนบให้พิมพ์');
      return;
    }

    // สร้าง HTML สำหรับไฟล์แนบเท่านั้น
    const attachmentsHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ไฟล์แนบ - ใบสมัครงาน</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Sarabun', sans-serif;
            background: white;
          }
          
          .attachment-page {
            width: 210mm;
            height: 297mm;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
            position: relative;
          }
          
          .attachment-page img {
            width: 210mm;
            height: 297mm;
            object-fit: contain;
            object-position: center;
            display: block;
          }
          
          .attachment-page:last-child {
            page-break-after: auto;
          }
          
          .attachment-header {
            position: absolute;
            top: 20mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          
          .attachment-content {
            width: 170mm;
            height: 220mm;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
          }
          
          .attachment-preview {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          
          .attachment-footer {
            position: absolute;
            bottom: 20mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
          }
          
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${uploadedDocuments.map((doc, index) => {
          console.log(`🔍 Document ${index + 1}:`, doc);
          return `
          <div class="attachment-page">
            <div class="attachment-header">
              <h2 style="margin: 0; color: #1f2937; font-size: 18px;">
                ไฟล์แนบที่ ${index + 1}: ${getDocumentTypeName(doc.documentType)}
              </h2>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
                ${doc.fileName || doc.originalName || 'ไม่ระบุชื่อไฟล์'}
              </p>
            </div>
            
            <div class="attachment-content">
              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f9fafb;">
                ${doc.mimeType && doc.mimeType.startsWith('image/') ? `
                  <img 
                    src="${getAttachmentUrl(doc.filePath)}" 
                    alt="${doc.fileName} - รูปภาพ"
                    style="width: 210mm; height: 297mm; object-fit: contain; object-position: center; display: block; margin: 0 auto; max-width: 100%; max-height: 100%;"
                    onError="this.style.display='none'; this.nextElementSibling.style.display='block';"
                  />
                ` : `
                <iframe 
                  src="${getAttachmentUrl(doc.filePath)}" 
                  className="attachment-preview"
                  style="width: 100%; height: 100%; border: none; object-fit: contain; object-position: center; display: block; margin: 0 auto;"
                    title="${doc.mimeType === 'application/pdf' ? 'PDF' : 'Document'} Preview"
                  onError="this.style.display='none'; this.nextElementSibling.style.display='block';"
                ></iframe>
                `}
              </div>
                <div style="display: none; text-align: center; color: #6b7280;">
                <p>ไม่สามารถแสดงไฟล์ได้</p>
                  <p>ไฟล์: ${doc.fileName || doc.originalName || 'ไม่ระบุชื่อ'}</p>
                <p>ประเภท: ${doc.mimeType === 'application/pdf' ? 'PDF' : 'รูปภาพ'}</p>
                </div>
            </div>
            
            <div class="attachment-footer">
              <p>หน้า ${index + 1} จาก ${uploadedDocuments.length} | ประเภท: ${getDocumentTypeName(doc.documentType)} | วันที่อัปโหลด: ${new Date(doc.createdAt || doc.updatedAt || Date.now()).toLocaleDateString('th-TH')}</p>
            </div>
          </div>
        `;
        }).join('')}
      </body>
      </html>
    `;

    // สร้าง Blob URL และเปิดในหน้าต่างใหม่
    const blob = new Blob([attachmentsHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        // ลบ URL หลังจากพิมพ์เสร็จ
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };
    }
  };

  // แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // แสดง error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            color="primary" 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200"
          >
            ลองใหม่
          </Button>
        </div>
      </div>
    );
  }

  // แสดงรายการใบสมัครงานทั้งหมด
  if (allApplications.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              รายการใบสมัครงานทั้งหมด ({allApplications.length} รายการ)
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allApplications.map((app, index) => {
                console.log(`🔍 Processing application ${index}:`, {
                  id: app.id,
                  name: `${app.firstName} ${app.lastName}`,
                  hasProfileImage: !!app.profileImageUrl,
                  profileImageUrl: app.profileImageUrl,
                  resolvedImageUrl: app.profileImageUrl ? 
                    (app.profileImageUrl.startsWith('http') ? app.profileImageUrl : `/api/image?file=${encodeURIComponent(app.profileImageUrl)}`) : 
                    'No image'
                });
                
                return (
                <div key={app.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    {app.profileImageUrl ? (
                      <img 
                        src={app.profileImageUrl.startsWith('http') ? app.profileImageUrl : `/api/image?file=${encodeURIComponent(app.profileImageUrl)}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                        onLoad={() => {
                          console.log('✅ Profile image loaded in list:', app.profileImageUrl);
                          console.log('✅ Profile image URL:', app.profileImageUrl.startsWith('http') ? app.profileImageUrl : `/api/image?file=${encodeURIComponent(app.profileImageUrl)}`);
                        }}
                        onError={(e) => {
                          console.error('❌ Profile image failed to load in list:', app.profileImageUrl);
                          console.error('❌ Image src:', (e.currentTarget as HTMLImageElement).src);
                          console.error('❌ Application data:', {
                            id: app.id,
                            name: `${app.firstName} ${app.lastName}`,
                            profileImageUrl: app.profileImageUrl,
                            resolvedUrl: app.profileImageUrl.startsWith('http') ? app.profileImageUrl : `/api/image?file=${encodeURIComponent(app.profileImageUrl)}`
                          });
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold ${app.profileImageUrl ? 'hidden' : ''}`}>
                      {app.firstName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {app.prefix || ''} {app.firstName} {app.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{app.expectedPosition}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">ฝ่าย:</span> {app.department || 'ไม่ระบุ'}</p>
                    <p><span className="font-medium">อีเมล:</span> {app.email}</p>
                    <p><span className="font-medium">โทรศัพท์:</span> {app.phone}</p>
                    <p><span className="font-medium">สถานะ:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        app.status === 'hired' ? 'bg-green-100 text-green-800' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status === 'hired' ? 'อนุมัติ' :
                         app.status === 'pending' ? 'รอดำเนินการ' :
                         app.status === 'rejected' ? 'ปฏิเสธ' :
                         app.status || 'ไม่ระบุ'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('id', app.id);
                        window.location.href = url.toString();
                      }}
                      className="flex-1"
                    >
                      ดูรายละเอียด
                    </Button>
                    <Button
                      size="sm"
                      color="secondary"
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set('id', app.id);
                        url.searchParams.set('print', 'true');
                        window.location.href = url.toString();
                      }}
                      className="flex-1"
                    >
                      พิมพ์
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // แสดงข้อความเมื่อไม่มีข้อมูล
  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">ไม่พบข้อมูล</h2>
          <p className="text-gray-600">กรุณาเลือกใบสมัครงานจากหน้าการจัดการข้อมูล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <style jsx global>{`
        /* กำหนดฟอนต์เริ่มต้นของเอกสารให้เป็น Angsana New */
        * {
          font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
        }
        .print-a4-container, .print-a4-container * {
          font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
        }
        /* ขยายตัวหนังสือพื้นฐานและกำหนดบรรทัดให้เท่ากันทุกบรรทัด */
        .print-a4-container { font-size: 18px; line-height: 1.1; }
        .print-a4-container .text-xs { font-size: 16px !important; line-height: 1.1; }
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-a4-container { font-size: 18px !important; line-height: 1.0 !important; }
          /* เพิ่ม CSS สำหรับรูปภาพให้คมชัด */
          img {
            image-rendering: high-quality !important;
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .profile-image-container {
            image-rendering: high-quality !important;
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
          }
          .profile-image-container img {
            image-rendering: high-quality !important;
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* CSS สำหรับไฟล์แนบ - ขนาด A4 */
          .document-container {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto 10mm auto !important;
            page-break-after: always !important;
            border: 1px solid #000 !important;
          }
          .document-container iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            object-fit: contain !important;
            object-position: center !important;
            display: block !important;
            margin: 0 auto !important;
          }
          .attachment-preview iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            object-fit: contain !important;
            object-position: center !important;
            display: block !important;
            margin: 0 auto !important;
          }
          /* CSS สำหรับการจัดตำแหน่งเนื้อหาใน iframe */
          .document-container iframe img,
          .document-container iframe embed,
          .document-container iframe object {
            max-width: 100% !important;
            max-height: 100% !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: center !important;
            display: block !important;
            margin: 0 auto !important;
          }
          /* CSS สำหรับ PDF ใน iframe */
          .document-container iframe[title*="PDF"] {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            display: block !important;
            margin: 0 auto !important;
          }
          /* CSS สำหรับรูปภาพใน iframe */
          .document-container iframe[title*="Image"] {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            object-fit: contain !important;
            object-position: center !important;
            display: block !important;
            margin: 0 auto !important;
          }
          /* CSS สำหรับหน้าใหม่ของเอกสารแนบ */
          .page-break-before {
            page-break-before: always !important;
            break-before: page !important;
          }
          .page-break-before:first-child {
            page-break-before: auto !important;
            break-before: auto !important;
          }
          .print-a4-container .text-xs { font-size: 16px !important; line-height: 1.0 !important; }
          .print-a4-container .mb-2 { margin-bottom: 2px !important; }
          .print-a4-container .mb-1 { margin-bottom: 1px !important; }
          .print-a4-container .mt-1 { margin-top: 1px !important; }
          .print-a4-container .mt-0\.5 { margin-top: 0.5px !important; }
          .print-a4-container .pt-0\.5 { padding-top: 0.5px !important; }
          .print-a4-container .py-1 { padding-top: 1px !important; padding-bottom: 1px !important; }
          .print-a4-container .h-3 { height: 1em !important; }
          .print-a4-container .h-4 { height: 1.05em !important; }
          .print-a4-container .h-3 { height: 1.25em !important; }
          .print-a4-container .h-4 { height: 1.25em !important; }
          .print-a4-container .h-20 { height: 5em !important; }
          .print-a4-container .flex.items-center { padding-top: 0.02em; padding-bottom: 0.02em; }
          body * {
            visibility: hidden !important;
            font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
          }
          .print-a4-container, .print-a4-container * {
            visibility: visible !important;
            font-family: 'Angsana New', 'AngsanaUPC', 'Tahoma', 'Segoe UI', sans-serif !important;
          }
          .print-a4-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 1mm 1mm 1mm 1mm !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>
      
      {/* Print Buttons */}
      <div className="mb-4 no-print">
        <div className="flex gap-3 flex-wrap">
        <Button
          color="primary"
          variant="solid"
          size="lg"
          startContent={<DocumentTextIcon className="w-5 h-5" />}
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200"
        >
          พิมพ์ใบสมัคร
        </Button>
      </div>
          </div>

      {/* Print Container */}
      <div ref={containerRef} className="print-a4-container bg-white shadow-lg">
        <div className="p-8">
          {/* หน้า 1 - ประวัติส่วนตัว */}
          <div className="mb-12">
            {/* Header */}
            <div className="text-center mb-6 relative">
              <div className="flex justify-center items-center mb-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center">
                  <Image src="/image/LOGO-LOGIN.png" alt="logo" width={1000} height={1000} />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ<br/>
                ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร
              </h1>
              
              
              
              {/* ช่องติดรูปถ่าย */}
              <div className="w-[1.3in] h-[1.5in] border-2 border-gray-400 flex items-center justify-center absolute right-0 top-0">
                {applicationData?.profileImage && applicationData.profileImage.trim() !== '' ? (
                  <div className="w-full h-full flex items-center justify-center relative profile-image-container">
                    {/* ใช้ <img> เพื่อหลีกเลี่ยง _next/image ซ้อน /api/image?file= */}
                    <img
                      src={resolveProfileImage(applicationData.profileImage)}
                      alt="รูปถ่ายผู้สมัคร"
                      className="w-full h-full object-cover border border-gray-200"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      onLoad={() => {
                        console.log('✅ Profile image loaded successfully:', applicationData.profileImage);
                        console.log('✅ Profile image URL:', resolveProfileImage(applicationData.profileImage));
                      }}
                      onError={(e) => {
                        console.error('❌ Profile image failed to load:', applicationData.profileImage);
                        console.error('❌ Image src:', (e.currentTarget as HTMLImageElement).src);
                        console.error('❌ Resolved URL:', resolveProfileImage(applicationData.profileImage));
                        try {
                          if (process.env.NODE_ENV !== 'production') {
                            console.warn('❗ Failed to load profile image:', applicationData.profileImage);
                            console.warn('❗ Image src:', (e.currentTarget as HTMLImageElement).src);
                          }
                        } catch {}
                        
                        // Try alternative image sources
                        const alternativeSources = [
                          `/api/image?file=${encodeURIComponent(applicationData.profileImage || '')}`,
                          `/uploads/${applicationData.profileImage || ''}`,
                          `/public/uploads/${applicationData.profileImage || ''}`,
                          applicationData.profileImage || ''
                        ];
                        
                        console.log('🔄 Trying alternative sources:', alternativeSources);
                        
                        const imgEl = e.currentTarget as HTMLImageElement;
                        imgEl.style.display = 'none';
                        const parent = imgEl.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="text-center p-2">
                              <div class="text-xs text-gray-500 mb-1">ติดรูปถ่าย</div>
                              <div class="text-xs text-gray-500">ขนาด ๑ นิ้ว</div>
                              <div class="text-xs text-red-500 mt-1">ไม่สามารถโหลดรูปได้</div>
                              <div class="text-xs text-red-400 mt-1">URL: ${(e.currentTarget as HTMLImageElement).src}</div>
                              <div class="text-xs text-blue-400 mt-1">Original: ${applicationData.profileImage || 'undefined'}</div>
                            </div>
                          `;
                        }
                      }}
                    />
                    {/* Overlay สำหรับแสดงข้อมูลรูปภาพ */}
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      รูปถ่าย 1 นิ้ว
                    </div> */}
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <div className="text-xs text-gray-500 mb-1">ติดรูปถ่าย</div>
                    <div className="text-xs text-gray-500">ขนาด ๑ นิ้ว</div>
                    {applicationData?.profileImage && applicationData.profileImage.trim() !== '' ? (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={resolveProfileImage(applicationData.profileImage)}
                          alt="รูปถ่ายผู้สมัคร"
                          className="w-full h-full object-cover border border-gray-200"
                          style={{ objectFit: 'cover', objectPosition: 'center top' }}
                          onLoad={() => {
                            console.log('✅ Profile image loaded in fallback:', applicationData.profileImage);
                          }}
                          onError={(e) => {
                            console.error('❌ Profile image failed to load in fallback:', applicationData.profileImage);
                            console.error('❌ Image src:', (e.currentTarget as HTMLImageElement).src);
                            // แสดงข้อความ "ไม่มีรูปภาพ" เมื่อโหลดล้มเหลว
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="text-xs text-gray-400 mt-2 hidden">ไม่มีรูปภาพ</div>
                      </div>
                    ) : (
                    <div className="text-xs text-gray-400 mt-2">ไม่มีรูปภาพ</div>
                    )}
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-red-500 mt-2">
                        Debug: profileImage = "{applicationData?.profileImage || 'undefined'}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ๑. ประวัติส่วนตัว */}
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๑. ประวัติส่วนตัว</h2>
              
              {/* ๑.๑ ชื่อ */}
              <div className="mb-1 px-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xm font-semibold text-gray-700 whitespace-nowrap">๑.๑ ชื่อ</h3>
                  <div className="flex items-center gap-2 text-xm w-full">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>คำนำหน้า</span>
                      <div className="flex-1 min-w-[60px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.prefix || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>ชื่อ</span>
                      <div className="flex-1 min-w-[100px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.firstName || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>นามสกุล</span>
                      <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.lastName || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>อายุ</span>
                      <div className="flex-1 min-w-[40px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{applicationData?.age || ''}</span>
                      </div>
                      <span>ปี</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>เชื้อชาติ</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.race || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>สัญชาติ</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.nationality || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>ศาสนา</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.religion || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๒ สถานภาพทางครอบครัว */}
              <div className="mb-1 px-2">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-xm font-semibold text-gray-700 whitespace-nowrap mb-0">๑.๒ สถานภาพทางครอบครัว</h3>
                  <div className="flex items-center gap-3 text-xm">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'โสด'} readOnly />
                      <span>โสด</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'สมรส'} readOnly />
                      <span>สมรส</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หย่าร้าง'} readOnly />
                      <span>หย่าร้าง</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="maritalStatus" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หม้าย'} readOnly />
                      <span>หม้าย</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xm px-2">
                  <span>ชื่อ-สกุล คู่สมรส</span>
                  <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                    <span className="text-xm font-medium text-gray-800">
                      {applicationData?.maritalStatus === 'สมรส' && applicationData?.spouseInfo 
                        ? `${applicationData.spouseInfo.firstName || ''} ${applicationData.spouseInfo.lastName || ''}`.trim()
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* ๑.๓ เลขที่บัตรประจำตัวประชาชน */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๓ เลขที่บัตรประจำตัวประชาชน</h3>
                <div className="flex items-center gap-2 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>เลขที่</span>
                    <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.idNumber || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>ออกให้ ณ อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.idCardIssuedAt || ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="whitespace-nowrap">วันที่ออกบัตร</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay(applicationData?.idCardIssueDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName(applicationData?.idCardIssueDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear(applicationData?.idCardIssueDate || '')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="whitespace-nowrap">หมดอายุวันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay(applicationData?.idCardExpiryDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName(applicationData?.idCardExpiryDate || '')}</span>
                      
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear(applicationData?.idCardExpiryDate || '')}</span>
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่ */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่</h3>
                <div className="grid grid-cols-4 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>บ้านเลขที่</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_house_number || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').houseNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>หมู่ที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_village_number || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').villageNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตรอก/ซอย</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_alley || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').alley}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ถนน</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_road || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').road}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตำบล/แขวง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_sub_district || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').subDistrict}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_district || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').district}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_province || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').province}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>รหัสไปรษณีย์</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_postal_code || parseAddress(applicationData?.addressAccordingToHouseRegistration || '').postalCode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_phone || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์มือถือ</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.house_registration_mobile || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๕ ที่อยู่ปัจจุบันเลขที่ */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๕ ที่อยู่ปัจจุบันเลขที่</h3>
                <div className="grid grid-cols-4 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>บ้านเลขที่</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_house_number || parseAddress(applicationData?.currentAddress || '').houseNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>หมู่ที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_village_number || parseAddress(applicationData?.currentAddress || '').villageNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตรอก/ซอย</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_alley || parseAddress(applicationData?.currentAddress || '').alley}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ถนน</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_road || parseAddress(applicationData?.currentAddress || '').road}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตำบล/แขวง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_sub_district || parseAddress(applicationData?.currentAddress || '').subDistrict}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_district || parseAddress(applicationData?.currentAddress || '').district}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_province || parseAddress(applicationData?.currentAddress || '').province}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>รหัสไปรษณีย์</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_postal_code || parseAddress(applicationData?.currentAddress || '').postalCode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_phone || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์มือถือ</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.current_address_mobile || applicationData?.phone || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๖ บุคคลที่สามารถติดต่อได้ทันที */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๖ บุคคลที่สามารถติดต่อได้ทันที ชื่อ</h3>
                <div className="grid grid-cols-4 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>ชื่อ</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyContact?.split(' ')[0] || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>นามสกุล</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyContact?.split(' ').slice(1).join(' ') || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ความสัมพันธ์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyRelationship || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>บ้านเลขที่</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_house_number || applicationData?.emergencyAddress?.houseNumber || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>หมู่ที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_village_number || applicationData?.emergencyAddress?.villageNumber || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตรอก/ซอย</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_alley || applicationData?.emergencyAddress?.alley || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ถนน</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_road || applicationData?.emergencyAddress?.road || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ตำบล/แขวง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_sub_district || applicationData?.emergencyAddress?.subDistrict || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_district || applicationData?.emergencyAddress?.district || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_province || applicationData?.emergencyAddress?.province || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>รหัสไปรษณีย์</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_postal_code || applicationData?.emergencyAddress?.postalCode || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergency_address_phone || applicationData?.emergencyPhone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ชื่อสถานที่ทำงาน</span>
                    <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.name || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>อำเภอ/เขต</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.district || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.province || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.emergencyWorkplace?.phone || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ๑.๗ ประวัติการศึกษา */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๗ ประวัติการศึกษา</h3>
                {(applicationData?.education || []).slice(0, 3).map((edu, index) => (
                  <div key={index} className="mb-1 p-1 text-xm px-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">วุฒิการศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800 whitespace-nowrap">{edu.level || edu.degree || ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">สาขา/วิชาเอก</span>
                        <div className="flex-1 min-w-[100px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800">{edu.major || ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">จากสถานศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800 whitespace-nowrap">{edu.institution || edu.school || ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* แสดงช่องว่างสำหรับข้อมูลที่เหลือ */}
                {Array.from({ length: Math.max(0, 3 - (applicationData?.education || []).length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="mb-0.5 p-1 text-xm px-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">วุฒิการศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900"></div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">สาขา/วิชาเอก</span>
                        <div className="flex-1 min-w-[100px] h-3 border-b-2 border-dotted border-gray-900"></div>
                      </div>
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="whitespace-nowrap">จากสถานศึกษา</span>
                        <div className="flex-1 min-w-[120px] h-3 border-b-2 border-dotted border-gray-900"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ๑.๘ ปัจจุบันทำงานในตำแหน่ง */}
              <div className="mb-1 px-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xm font-semibold text-gray-700 whitespace-nowrap">๑.๘</h3>
                  <div className="flex items-center gap-2 text-xm w-full">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className="whitespace-nowrap">ชื่อสถานที่ทำงาน</span>
                      <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.company || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>ตำแหน่ง</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.position || ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span>อำเภอ/เขต</span>
                      <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.district || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>จังหวัด</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.province || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span>โทรศัพท์</span>
                    <div className="flex-1 min-w-[80px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.phone || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ตั้งแต่วันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay((applicationData?.workExperience || [])[0]?.startDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName((applicationData?.workExperience || [])[0]?.startDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear((applicationData?.workExperience || [])[0]?.startDate || '')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xm px-2 w-full">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ถึงวันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง */}
              <div className="mb-1 px-2">
                <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง</h3>
                <div className="grid grid-cols-3 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>ตำแหน่ง</span>
                    <div className="flex-1 min-w-[96px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.position || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>สังกัด</span>
                    <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.company || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">ออกจากราชการเพราะ</span>
                    <div className="flex-1 min-w-[144px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{(applicationData?.workExperience || [])[0]?.reason || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap">เมื่อวันที่</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiDay((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>เดือน</span>
                    <div className="flex-1 min-w-[48px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getThaiMonthName((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                    <span>ปี</span>
                    <div className="flex-1 min-w-[64px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{getGregorianYear((applicationData?.workExperience || [])[0]?.endDate || '')}</span>
                    </div>
                  </div>
                </div>
              </div>

              
              
            </div>
          </div>

          {/* หน้า 2 - ข้อมูลเพิ่มเติม */}
          <div className="mb-12 page-break">
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- ๒ -</span>
            </div>
            
            {/* ๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง */}
              <div className="mb-1 px-2">
              <h3 className="text-xm font-semibold text-gray-700 mb-1">๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง</h3>
              <div className="grid grid-cols-2 gap-2 text-xm px-2">
                  <div className="flex items-center gap-1">
                    <span>ตำแหน่ง</span>
                  <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.appliedPosition || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>ฝ่าย/กลุ่มงาน</span>
                  <div className="flex-1 min-w-[128px] h-3 border-b-2 border-dotted border-gray-900 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.department || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๒. ความรู้ ความสามารถ/ทักษะพิเศษ</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  {/* ความรู้ ความสามารถ และทักษะพิเศษ */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">๒.๑</span>
                      <div className="flex items-center gap-1">
                    <span>ความรู้ ความสามารถ และทักษะพิเศษ</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.skills || ''}</span>
                  </div>
                  </div>
                      
                    </div>
                  </div>

                  {/* ภาษาที่ใช้ได้ */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">๒.๒</span>
                      <div className="flex items-center gap-1">
                    <span>ภาษาที่ใช้ได้</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.languages || ''}</span>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* ทักษะคอมพิวเตอร์ */}
                  <div className = "flex items-center gap-1">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">๒.๓</span>
                      <div className="flex items-center gap-1">
                    <span>ทักษะคอมพิวเตอร์</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.computerSkills || ''}</span>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* ใบรับรอง/ประกาศนียบัตร */}
                  <div className = "flex items-center gap-1">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">๒.๔</span>
                      <div className="flex items-center gap-1">
                    <span>ใบรับรอง/ประกาศนียบัตร</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.certificates || ''}</span>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* บุคคลอ้างอิง */}
                  <div className = "flex items-center gap-1">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">๒.๕</span>
                      <div className="flex items-center gap-1">
                    <span>บุคคลอ้างอิง</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.references || ''}</span>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๓. คุณสมบัติทั่วไปและลักษณะต้องห้าม</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๑</span>
                    <p>ข้าพเจ้าเป็นผู้เลื่อมใสในการปกครองระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุขด้วยความบริสุทธิ์ใจ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๒</span>
                    <div>
                      <p>ข้าพเจ้าไม่เป็นผู้มีกายทุพพลภาพจนไม่สามารถปฏิบัติหน้าที่ได้ คนไร้ความสามารถ คนเสมือนไร้ความสามารถ คนวิกลจริตหรือจิตฟั่นเฟือนไม่สมประกอบ หรือเป็นโรค ดังต่อไปนี้</p>
                      <div className="ml-4 mt-2 space-y-1">
                        <p>(ก) วัณโรคในระยะแพร่กระจายเชื้อ</p>
                        <p>(ข) โรคเท้าช้างในระยะที่ปรากฏอาการเป็นที่รังเกียจแก่สังคม</p>
                        <p>(ค) โรคติดยาเสพติดให้โทษ</p>
                        <p>(ง) โรคพิษสุราเรื้อรัง</p>
                        <p>(จ) โรคติดต่อร้ายแรงหรือโรคเรื้อรังที่ปรากฏอาการเด่นชัดหรือรุนแรงและเป็นอุปสรรคต่อการปฏิบัติงานในหน้าที่ตามที่ปลัดกรุงเทพมหานครกำหนด</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๓</span>
                    <p>ข้าพเจ้าไม่เป็นผู้อยู่ในระหว่างถูกสั่งพักราชการหรือถูกสั่งให้ออกจากราชการไว้ก่อนตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๔</span>
                    <p>ข้าพเจ้าไม่เป็นผู้บกพร่องในศีลธรรมอันดีจนเป็นที่รังเกียจของสังคม</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๕</span>
                    <p>ข้าพเจ้าไม่เป็นบุคคลล้มละลาย</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๖</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยต้องรับโทษจำคุกโดยคำพิพากษาถึงที่สุดให้จำคุกเพราะกระทำความผิดทางอาญาเว้นแต่เป็นโทษสำหรับความผิดที่ได้กระทำโดยประมาทหรือความผิดลหุโทษ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๗</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษให้ออก ปลดออกหรือไล่ออก เพราะกระทำผิดวินัยจากส่วนราชการรัฐวิสาหกิจ หรือหน่วยงานอื่นของรัฐ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๘</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษให้ออกหรือปลดออกเพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๙</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษไล่ออก เพราะกระทำผิดวินัยตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๑๐</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยกระทำการทุจริตในการสอบเข้ารับราชการ หรือเข้าปฏิบัติงานในหน่วยงานของรัฐ</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">๓.๑๑</span>
                    <p>ข้าพเจ้าไม่เป็นผู้เคยถูกลงโทษให้ออก ปลดออก หรือไล่ออก เพราะกระทำผิดวินัยอย่างร้ายแรงตามข้อบังคับกรุงเทพมหานครว่าด้วยการบริหารทรัพยากรบุคคลของลูกจ้างกรุงเทพมหานคร พ.ศ. ๒๕๖๒ หรือตามกฎหมายอื่น</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* หน้า 3 - สำหรับเจ้าหน้าที่ */}
          <div className="mb-12 page-break">
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- ๓ -</span>
            </div>
            
            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">สำหรับเจ้าหน้าที่</h2>
              
              <div className="mb-2">
                <h2 className="text-xm font-bold text-gray-800 mb-1">๔. การยื่นเอกสารและหลักฐานประกอบการรับสมัคร</h2>
                <div className="mb-1 px-2">
                  <div className="mb-4 text-xm">
                    <p className="mb-3">ผู้สมัครได้ยื่นเอกสารและหลักฐานพร้อมใบสมัคร มีดังนี้</p>
                  </div>
                  
                  <div className="space-y-3 text-xm">
                    {/* สำเนาบัตรประจำตัวประชาชน */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'idCard')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>สำเนาบัตรประจำตัวประชาชน</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'idCard').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                    </div>
                        ))}
                      </div>
                    </div>

                    {/* สำเนาทะเบียนบ้าน */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'houseRegistration')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>สำเนาทะเบียนบ้าน</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'houseRegistration').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                    </div>
                        ))}
                      </div>
                    </div>

                    {/* หลักฐานทางทหาร */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'militaryCertificate')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>สำเนาหลักฐานทางทหาร (เฉพาะผู้สมัครเพศชาย) ได้แก่ ใบสำคัญ (แบบ สด.๙) สมุดประจำตัวทหารกองหนุน (แบบ สด.๘) สำเนาทะเบียนทหารกองประจำการ (สด.๓) หรือ สด.๔๓ แล้วแต่กรณี</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'militaryCertificate').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                    </div>
                        ))}
                      </div>
                    </div>

                    {/* หลักฐานการศึกษา */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'educationCertificate')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>สำเนาหลักฐานการศึกษา เช่น ใบประกาศนียบัตร หรือ ใบปริญญาบัตร และระเบียนแสดงผลการเรียน (Transcript)</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'educationCertificate').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                    </div>
                        ))}
                      </div>
                    </div>

                    {/* ใบรับรองแพทย์ */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'medicalCertificate')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>ใบรับรองแพทย์ ซึ่งออกไม่เกิน ๑ เดือน (ออกโดยโรงพยาบาลราชพิพัฒน์เท่านั้น)</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'medicalCertificate').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                    </div>
                        ))}
                      </div>
                    </div>

                    {/* ใบอนุญาตที่เกี่ยวข้องกับตำแหน่ง */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'drivingLicense')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>ใบอนุญาตที่เกี่ยวข้องกับตำแหน่ง เช่น ใบอนุญาตขับรถยนต์ หรือใบอนุญาตขับเรือ ใบประกอบวิชาชีพ ฯลฯ</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'drivingLicense').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                    </div>
                        ))}
                      </div>
                    </div>

                    {/* เอกสารอื่นๆ */}
                    <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="w-3 h-3 mt-1" 
                        checked={uploadedDocuments.some(doc => doc.documentType === 'nameChangeCertificate')}
                        readOnly
                      />
                      <div className="flex-1">
                      <span>เอกสารอื่นๆ (ถ้ามี) เช่น สำเนาหลักฐานการเปลี่ยนชื่อตัว ชื่อสกุล สำเนาหลักฐานการสมรสหรือใบหย่า</span>
                        {uploadedDocuments.filter(doc => doc.documentType === 'nameChangeCertificate').map((doc, index) => (
                          <div key={index} className="text-xs text-gray-600 ml-4 mt-1">
                            
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* เส้นประ 3 เส้น */}
                  <div className="mt-4 space-y-2">
                    <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600"></div>
                    <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600"></div>
                    <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  
                  {/* ส่วนลงชื่อเจ้าหน้าที่ */}
                  <div className="mt-6 text-xm">
                    <div className="flex justify-start items-center">
                      <span>(ลงชื่อ)</span>
                      <div className="w-96 h-6 border-b-2 border-dotted border-gray-600 ml-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">๕. การตรวจสอบคุณสมบัติ</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="w-3 h-3 mt-1" />
                    <span>มีคุณสมบัติตามมาตรฐานกำหนดตำแหน่ง</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="w-3 h-3 mt-1" />
                    <span>ขาดคุณสมบัติ เนื่องจาก</span>
                    <div className="w-96 h-4 border-b-2 border-dotted border-gray-600 ml-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* หน้า 4 - ข้อมูลสิทธิการรักษา */}
          <div className="mb-12 page-break">
            <div className="text-center mb-6">
              <span className="text-xm font-bold text-gray-800">- ๔ -</span>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-xm font-bold text-gray-800">ข้อมูลสิทธิการรักษา</h2>
              <div className="w-full h-0.5 border-b-2 border-dotted border-gray-600 mt-1"></div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">1. ข้อมูลส่วนตัว</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-center gap-2">
                    <span>1 ชื่อ {applicationData?.prefix || ''} {applicationData?.firstName || ''} {applicationData?.lastName || ''}</span>
                    <div className="w-64 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.prefix || ''} {applicationData?.firstName || ''} {applicationData?.lastName || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>เชื้อชาติ</span>
                    <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.race || ''}</span>
                    </div>
                    <span className="ml-4">สัญชาติ</span>
                    <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.nationality || ''}</span>
                    </div>
                    <span className="ml-4">ศาสนา</span>
                    <div className="w-24 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                      <span className="text-xm font-medium text-gray-800">{applicationData?.religion || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">2. เลขประจำตัวประชาชน</h2>
              <div className="mb-1 px-2">
                <div className="flex items-center gap-1 text-xm">
                  {applicationData?.idNumber ? (
                    applicationData.idNumber.split('').map((digit, index) => (
                      <React.Fragment key={index}>
                        <div className="w-6 h-6 border border-gray-600 flex items-center justify-center">
                          <span className="text-xm font-medium text-gray-800">{digit}</span>
                        </div>
                        {(index === 0 || index === 4) && <span>-</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <span>-</span>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <span>-</span>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                      <div className="w-6 h-6 border border-gray-600"></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">3. สิทธิการรักษา</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>มีสิทธิหลักประกันสุขภาพ (บัตรทอง) ที่ รพ.</span>
                    <div className="w-48 h-4 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>มีสิทธิประกันสังคม</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>มีสิทธิข้าราชการ (สิทธิของตนเอง)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" />
                    <span>อื่นๆ ระบุ</span>
                    <div className="w-48 h-4 border-b-2 border-dotted border-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">4. ชื่อสถานประกอบการกรณีทำงานกับนายจ้างหลายราย ณ ปัจจุบัน</h2>
              <div className="mb-1 px-2">
                <div className="space-y-3 text-xm">
                  {(applicationData?.workExperience || []).slice(0, 3).map((work, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{index + 1}.</span>
                      <div className="w-96 h-4 border-b-2 border-dotted border-gray-600 flex items-center justify-center">
                        <span className="text-xm font-medium text-gray-800">{work.company || ''}</span>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - (applicationData?.workExperience || []).length) }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex items-center gap-2">
                      <span>{3 - (applicationData?.workExperience || []).length + index + 1}.</span>
                      <div className="w-96 h-4 border-b-2 border-dotted border-gray-600"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h2 className="text-xm font-bold text-gray-800 mb-1">5. สถานภาพครอบครัว</h2>
              <div className="mb-1 px-2">
                <div className="flex items-center gap-6 text-xm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'โสด'} readOnly />
                    <span>โสด</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'สมรส'} readOnly />
                    <span>สมรสจดทะเบียน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'สมรสไม่จดทะเบียน'} readOnly />
                    <span>สมรสไม่จดทะเบียน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'หย่าร้าง'} readOnly />
                    <span>หย่า</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-3 h-3" checked={applicationData?.maritalStatus === 'แยกกันอยู่'} readOnly />
                    <span>แยกกันอยู่</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนแสดงไฟล์แนบทั้งหมด - ด้านล่างสุด */}
      {/* Debug logs */}
      {(() => {
        console.log('🔍 Uploaded Documents Count:', uploadedDocuments.length);
        console.log('📄 Uploaded Documents:', uploadedDocuments);
        return null;
      })()}
      
      {/* Debug: แสดงจำนวนไฟล์แนบ */}
      

      {/* พื้นที่แสดงไฟล์แนบทุกหน้าของไฟล์แนบ */}
      {/* Debug logs */}
      {(() => {
        console.log('🔍 Render - Uploaded Documents Count:', uploadedDocuments.length);
        console.log('🔍 Render - Uploaded Documents:', uploadedDocuments);
        return null;
      })()}
      
      {/* แสดงข้อมูลทดสอบเมื่อไม่มีไฟล์แนบจริง */}
      {uploadedDocuments.length === 0 && !loading && (
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">เอกสารไฟล์แนบ (ทดสอบ)</h2>
            <div className="w-full h-1 border-b-2 border-dotted border-gray-600"></div>
            <p className="text-sm text-gray-600 mt-2">
              จำนวนเอกสาร: 2 ฉบับ (ข้อมูลทดสอบ)
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {/* เอกสารทดสอบที่ 1 */}
            <div className="w-full">
              <div className="page-break-before">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 border-2 border-blue-200 rounded-t-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-blue-800 mb-1">
                        เอกสารที่ 1: สำเนาบัตรประชาชน
                      </h3>
                      <p className="text-sm text-blue-600">
                        id-card-sample.pdf • 2.5 MB
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        PDF
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-2 border-t-0 border-blue-200 rounded-b-xl shadow-lg overflow-hidden">
                  <div className="w-full" style={{ height: '297mm', minHeight: '297mm' }}>
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <DocumentTextIcon className="w-32 h-32 mx-auto mb-4 text-blue-400" />
                        <p className="text-lg font-medium text-gray-600">ตัวอย่างเอกสาร</p>
                        <p className="text-sm text-gray-500">สำเนาบัตรประชาชน</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-8 py-3 border-2 border-t-0 border-blue-200 rounded-b-xl">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>เอกสารที่ 1 จาก 2</span>
                    <span>สำเนาบัตรประชาชน</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* เอกสารทดสอบที่ 2 */}
            <div className="w-full">
              <div className="page-break-before">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-4 border-2 border-green-200 rounded-t-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-1">
                        เอกสารที่ 2: ใบรับรองการศึกษา
                      </h3>
                      <p className="text-sm text-green-600">
                        education-certificate-sample.pdf • 1.8 MB
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        PDF
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border-2 border-t-0 border-green-200 rounded-b-xl shadow-lg overflow-hidden">
                  <div className="w-full" style={{ height: '297mm', minHeight: '297mm' }}>
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <DocumentTextIcon className="w-32 h-32 mx-auto mb-4 text-green-400" />
                        <p className="text-lg font-medium text-gray-600">ตัวอย่างเอกสาร</p>
                        <p className="text-sm text-gray-500">ใบรับรองการศึกษา</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-8 py-3 border-2 border-t-0 border-green-200 rounded-b-xl">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>เอกสารที่ 2 จาก 2</span>
                    <span>ใบรับรองการศึกษา</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {uploadedDocuments.length > 0 && (
        <div className="mt-12 document-section">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">เอกสารแนบทั้งหมด</h2>
            <div className="w-full h-1 border-b-2 border-dotted border-gray-600"></div>
            <p className="text-sm text-gray-600 mt-2">
              จำนวนเอกสาร: {uploadedDocuments.length} ฉบับ
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {uploadedDocuments.map((doc, index) => (
              <div key={index} className="w-full">
                {/* หน้าใหม่สำหรับแต่ละเอกสาร */}
                <div className="page-break-before">
                  {/* Header ของเอกสาร */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 border-2 border-blue-200 rounded-t-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-blue-800 mb-1">
                          เอกสารที่ {index + 1}: {getDocumentTypeName(doc.documentType)}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {doc.fileName}
                        </p>
                      </div>
                       <div className="flex items-center justify-between">
                         <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                           {doc.mimeType === 'application/pdf' ? 'PDF' : 'รูปภาพ'}
                         </div>
                         {/* ปุ่มปริ้นเอกสารสำหรับรูปภาพ - ทุกเอกสารแนบ */}
                         {doc.mimeType && doc.mimeType.startsWith('image/') && (
                           <Button
                             color="primary"
                             variant="solid"
                             size="sm"
                             startContent={<DocumentTextIcon className="w-4 h-4" />}
                             onClick={() => {
                               const fileUrl = getAttachmentUrl(doc.filePath);
                               
                               // สร้าง HTML สำหรับปริ้นรูปภาพขนาด A4
                               const printHtml = `
                                 <!DOCTYPE html>
                                 <html>
                                 <head>
                                   <meta charset="UTF-8">
                                   <title>ปริ้นรูปภาพ - ${doc.fileName}</title>
                                   <style>
                                     @page {
                                       size: A4;
                                       margin: 0;
                                     }
                                     
                                     body {
                                       margin: 0;
                                       padding: 0;
                                       display: flex;
                                       align-items: center;
                                       justify-content: center;
                                       min-height: 100vh;
                                       background: white;
                                     }
                                     
                                     .print-image {
                                       width: 210mm;
                                       height: 297mm;
                                       object-fit: contain;
                                       object-position: center;
                                       display: block;
                                     }
                                   </style>
                                 </head>
                                 <body>
                                   <img src="${fileUrl}" alt="${doc.fileName}" class="print-image" />
                                 </body>
                                 </html>
                               `;
                               
                               const printWindow = window.open('', '_blank');
                               if (printWindow) {
                                 printWindow.document.write(printHtml);
                                 printWindow.document.close();
                                 printWindow.onload = () => {
                                   printWindow.print();
                                 };
                               }
                             }}
                             className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200"
                           >
                             ปริ้นเอกสาร
                           </Button>
                         )}
                       </div>
                    </div>
                  </div>
                  
                  {/* เนื้อหาเอกสาร - ขนาด A4 เต็มหน้า */}
                  <div className="bg-white border-2 border-t-0 border-blue-200 rounded-b-xl shadow-lg overflow-hidden" style={{ width: '210mm', margin: '0 auto' }}>
                    <div className="w-full" style={{ width: '210mm', height: '297mm', minHeight: '297mm' }}>
                      {/* Debug: แสดงข้อมูลไฟล์ */}
                      {/* ลบ overlay debug แสดงข้อมูลไฟล์ตามคำขอ */}
                      
                      {/* ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่ */}
                      {(() => {
                        const fileUrl = getAttachmentUrl(doc.filePath);
                        console.log('🔍 File URL:', fileUrl);
                        console.log('🔍 File Path:', doc.filePath);
                        console.log('🔍 File Name:', doc.fileName);
                        console.log('🔍 MIME Type:', doc.mimeType);
                        
                        return (
                           <div className="w-full h-full flex items-center justify-center bg-gray-50" style={{ width: '210mm', height: '297mm' }}>
                             {/* สำหรับรูปภาพ - ใช้ img tag ขนาด A4 */}
                             {doc.mimeType && doc.mimeType.startsWith('image/') ? (
                               <img
                                 src={fileUrl}
                                 alt={`${doc.fileName} - รูปภาพ`}
                                 className="w-full h-full object-contain"
                                 style={{ 
                                   width: '210mm',
                                   height: '297mm',
                                   objectFit: 'contain',
                                   objectPosition: 'center',
                                   display: 'block',
                                   margin: '0 auto'
                                 }}
                                 onLoad={() => {
                                   console.log(`✅ Image loaded successfully:`, doc.fileName);
                                 }}
                                 onError={(e) => {
                                   console.error(`❌ Error loading image:`, doc.fileName);
                                   console.error('❌ File URL:', fileUrl);
                                   e.currentTarget.style.display = 'none';
                                   const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                   if (fallback) fallback.style.display = 'flex';
                                 }}
                               />
                             ) : (
                              /* สำหรับ PDF และไฟล์อื่นๆ - ใช้ iframe */
                          <iframe
                            src={fileUrl}
                            className="w-full h-full border-0"
                                title={`${doc.mimeType === 'application/pdf' ? 'PDF' : 'Document'} Preview - ${doc.fileName}`}
                              style={{ 
                                width: '100%', 
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                display: 'block',
                                margin: '0 auto'
                              }}
                              onLoad={() => {
                                  console.log(`✅ ${doc.mimeType === 'application/pdf' ? 'PDF' : 'Document'} loaded successfully via iframe:`, doc.fileName);
                              }}
                              onError={(e) => {
                                  console.error(`❌ Error loading ${doc.mimeType === 'application/pdf' ? 'PDF' : 'document'} via iframe:`, doc.fileName);
                                console.error('❌ File URL:', fileUrl);
                                console.error('❌ Original Path:', doc.filePath);
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            )}
                          </div>
                        );
                      })()}
                      
                      {/* Fallback message */}
                      <div 
                        className="hidden w-full h-full items-center justify-center bg-gray-50 text-gray-500 text-lg"
                        style={{ minHeight: '297mm' }}
                      >
                        <div className="text-center p-8">
                          {doc.mimeType && doc.mimeType.startsWith('image/') ? (
                            <DocumentIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                          ) : (
                          <DocumentTextIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                          )}
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            ไม่สามารถแสดง{doc.mimeType && doc.mimeType.startsWith('image/') ? 'รูปภาพ' : 'ไฟล์'}ได้
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">{doc.fileName}</p>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-yellow-700">
                              <strong>สาเหตุที่เป็นไปได้:</strong>
                            </p>
                            <ul className="text-xs text-yellow-600 mt-2 text-left">
                              <li>• ไฟล์ไม่พบในระบบ</li>
                              <li>• ไฟล์เสียหายหรือไม่สมบูรณ์</li>
                              <li>• ไม่มีสิทธิ์เข้าถึงไฟล์</li>
                              {doc.mimeType && doc.mimeType.startsWith('image/') && (
                                <li>• รูปภาพอาจมีขนาดใหญ่เกินไป</li>
                              )}
                            </ul>
                          </div>
                          <div className="mt-4 flex gap-2 justify-center">
                            <button
                              onClick={() => window.open(getAttachmentUrl(doc.filePath), '_blank')}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              เปิดในแท็บใหม่
                            </button>
                            {doc.mimeType && doc.mimeType.startsWith('image/') && (
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = getAttachmentUrl(doc.filePath);
                                  link.download = doc.fileName;
                                  link.click();
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              >
                                ดาวน์โหลดรูปภาพ
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer ของเอกสาร */}
                  <div className="bg-gray-50 px-8 py-3 border-2 border-t-0 border-blue-200 rounded-b-xl">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>เอกสารที่ {index + 1} จาก {uploadedDocuments.length}</span>
                      <span>{getDocumentTypeName(doc.documentType)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* แสดงข้อความเมื่อไม่มีไฟล์แนบ */}
      {uploadedDocuments.length === 0 && (
        <div className="mt-12 document-section">
          {/* Debug Information */}
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug: ข้อมูลไฟล์แนบ</h3>
            <p className="text-sm text-yellow-700">
              จำนวนไฟล์แนบ: {uploadedDocuments.length} ไฟล์
            </p>
            <p className="text-sm text-yellow-700">
              Application ID: {applicationData?.id || 'ไม่พบ ID'}
            </p>
            <p className="text-sm text-yellow-700">
              Loading: {loading ? 'กำลังโหลด...' : 'โหลดเสร็จแล้ว'}
            </p>
          </div>
          
          {/* ข้อความไม่มีไฟล์แนบ */}
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
              <DocumentTextIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่มีเอกสารแนบ</h3>
              <p className="text-gray-500 mb-4">
                ยังไม่มีเอกสารแนบในระบบสำหรับใบสมัครนี้
              </p>
              <div className="text-sm text-gray-400">
                <p>Application ID: {applicationData?.id || 'ไม่พบ'}</p>
                <p>จำนวนไฟล์: {uploadedDocuments.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
