'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardHeader,
  CardBody,
  Button
} from '@heroui/react';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import ThaiDatePicker from './components/ThaiDatePicker';

interface FormData {
  profileImage?: File;
  prefix: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  idCardIssuedAt: string;
  idCardIssueDate: string;
  idCardExpiryDate: string;
  birthDate: string;
  age: string;
  race?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  addressAccordingToHouseRegistration: string;
  currentAddress: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyContactFirstName?: string;
  emergencyContactLastName?: string;
  emergencyPhone: string;
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
  education: Array<{
    level: string;
    institution: string;
    major: string;
    year: string;
    gpa: string;
  }>;
  workExperience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    salary: string;
    reason: string;
    district: string;
    province: string;
    phone: string;
  }>;
  previousGovernmentService: Array<{
    position: string;
    department: string;
    reason: string;
    date: string;
    type?: string;
  }>;
  skills: string;
  languages: string;
  computerSkills: string;
  certificates: string;
  references: string;
  appliedPosition: string;
  expectedSalary: string;
  availableDate: string;
  currentWork: boolean;
  department: string;
  applicantSignature: string;
  applicationDate: string;
  documents?: {
    idCard?: File | { name: string; uploaded: boolean; file?: File };
    houseRegistration?: File | { name: string; uploaded: boolean; file?: File };
    militaryCertificate?: File | { name: string; uploaded: boolean; file?: File };
    educationCertificate?: File | { name: string; uploaded: boolean; file?: File };
    medicalCertificate?: File | { name: string; uploaded: boolean; file?: File };
    drivingLicense?: File | { name: string; uploaded: boolean; file?: File };
    nameChangeCertificate?: File | { name: string; uploaded: boolean; file?: File };
    otherDocuments?: File[] | { name: string; uploaded: boolean; file?: File }[];
  };
  multipleEmployers?: string[]; // Added for multipleEmployers
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
  // เพิ่มฟิลด์ใหม่สำหรับข้อมูลสิทธิการรักษา
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
  // เพิ่มฟิลด์สำหรับข้อมูลนายจ้างหลายราย
  staffInfo?: {
    position: string;
    department: string;
    startWork: string;
  };
}

export default function ApplicationForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [copyFromRegisteredAddress, setCopyFromRegisteredAddress] = useState(false);
  
  // รับข้อมูล department และ resumeId จาก URL parameters (decode เผื่อมีการ encode มาก่อนหน้า)
  const departmentName = (() => {
    const raw = searchParams.get('department') || '';
    try { return raw ? decodeURIComponent(raw) : ''; } catch { return raw; }
  })();
  const departmentId = searchParams.get('departmentId') || '';
  const resumeId = searchParams.get('resumeId') || '';
  // flag ให้โหลดจากฐานโดยตรง
  const resumeFlag = searchParams.get('resume');
  // แยกพารามิเตอร์ของฝากประวัติ (explicit)
  const queryResumeEmail = searchParams.get('resumeEmail') || '';
  const queryResumeUserId = searchParams.get('resumeUserId') || '';
  
  // อัปเดตข้อมูล department ในฟอร์มเมื่อมีข้อมูลจาก URL
  useEffect(() => {
    if (departmentName) {
      setFormData(prev => ({
        ...prev,
        appliedPosition: '', // ไม่ตั้งค่า appliedPosition จาก departmentName
        department: departmentName,
        departmentId: departmentId || null
      }));
    }
  }, [departmentName, departmentId]);

  // โหลดข้อมูลฝากประวัติโดยอัตโนมัติเมื่อผู้ใช้ล็อกอิน
  // กรณีเข้าหน้า /register โดยไม่มี resumeId หรือ department ใน URL
  useEffect(() => {
    if (status === 'authenticated' && !resumeId && !departmentName && !departmentId && !resumeFlag) {
      fetchProfileData();
    }
  }, [status, resumeId, departmentName, departmentId, resumeFlag]);

  // ถ้ามีพารามิเตอร์ ?resume ให้บังคับโหลดข้อมูลจากฐานทันที
  useEffect(() => {
    if (status === 'authenticated' && resumeFlag) {
      fetchProfileData();
    }
  }, [status, resumeFlag]);

  // ดึงข้อมูลฝากประวัติตาม resumeId เมื่อมีใน URL
  useEffect(() => {
    if (resumeId && status === 'authenticated') {
      console.log('🔍 พบ resumeId ใน URL:', resumeId);
      loadResumeById(resumeId);
    }
  }, [resumeId, status]);

  // ปิดการโหลดด้วย resumeEmail/resumeUserId เพื่อบังคับใช้ lineId เท่านั้น
  useEffect(() => {
    // intentionally disabled
  }, [status, queryResumeEmail, queryResumeUserId]);

  // ดึงข้อมูลฝากประวัติเมื่อมี department ใน URL (ค้นหาตามหลายวิธี)
  useEffect(() => {
    if ((departmentName || departmentId) && status === 'authenticated') {
      console.log('🔍 พบ department ใน URL:', { departmentName, departmentId });
      // ใช้ loadResumeByDepartment ที่ค้นหาตามหลายวิธี
      loadResumeByDepartment();
    }
  }, [departmentName, departmentId, status]);
  const [formData, setFormData] = useState<FormData>({
    profileImage: undefined,
    prefix: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    idCardIssuedAt: '',
    idCardIssueDate: '',
    idCardExpiryDate: '',
    birthDate: '',
    age: '',
    race: '',
    placeOfBirth: '',
    placeOfBirthProvince: '',
    gender: '',
    nationality: '',
    religion: '',
    maritalStatus: '',
    addressAccordingToHouseRegistration: '',
    currentAddress: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    emergencyAddress: {
      houseNumber: '',
      villageNumber: '',
      alley: '',
      road: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
      phone: '',
    },
    emergencyWorkplace: {
      name: '',
      district: '',
      province: '',
      phone: '',
    },
    education: [],
    workExperience: [],
    previousGovernmentService: [],
    skills: '',
    languages: '',
    computerSkills: '',
    certificates: '',
    references: '',
    appliedPosition: '',
    expectedSalary: '',
    availableDate: '',
    currentWork: false,
    department: '',
    applicantSignature: '',
    applicationDate: '',
    documents: {},
    multipleEmployers: [], // Initialize multipleEmployers
    spouseInfo: {
      firstName: '',
      lastName: '',
    },
    registeredAddress: {
      houseNumber: '',
      villageNumber: '',
      alley: '',
      road: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
      phone: '',
      mobile: '',
    },
    currentAddressDetail: {
      houseNumber: '',
      villageNumber: '',
      alley: '',
      road: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
      homePhone: '',
      mobilePhone: '',
    },
    // เพv่มการเริ่มต้นข้อมูลใหม่
    medicalRights: {
      hasUniversalHealthcare: false,
      universalHealthcareHospital: '',
      hasSocialSecurity: false,
      socialSecurityHospital: '',
      dontWantToChangeHospital: false,
      wantToChangeHospital: false,
      newHospital: '',
      hasCivilServantRights: false,
      otherRights: '',
    },
    staffInfo: {
      position: '',
      department: '',
      startWork: '',
    }
  });
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [savedResume, setSavedResume] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [previewFile, setPreviewFile] = useState<{ file: File; name: string; type: string } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  // โหลดข้อมูลฝากประวัติของผู้ใช้ปัจจุบัน (ถ้ามี) มาแสดงบนหน้าและเติมลงฟอร์ม
  useEffect(() => {
    const loadMyResume = async () => {
      if (status !== 'authenticated') return;
      
      // ถ้ามี resumeId หรือ department ใน URL ให้ข้ามการโหลดข้อมูลตามอีเมล
      if (resumeId || departmentName) {
        console.log('🔍 มี resumeId หรือ department ใน URL - ข้ามการโหลดข้อมูลตามอีเมล');
        return;
      }
      
      console.log('🔄 เริ่มโหลดข้อมูลฝากประวัติ...');
      setIsLoading(true);
      
      try {
        // ใช้เฉพาะ userId และ lineId เท่านั้น ไม่ใช้ email fallback
        const userId = (session?.user as any)?.id || '';
        const userLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || '';
        
        if (!userLineId) {
          console.log('❌ ไม่มี lineId ใน session - ไม่สามารถดึงข้อมูลได้');
          setIsLoading(false);
          return;
        }
        
        console.log('🔍 ค้นหาข้อมูลฝากประวัติด้วย userId/lineId:', { userId, userLineId });
        
        let found: any = null;
        
        // 1. ค้นหาจาก resume-deposit API (ใช้ lineId และ userId)
        try {
          const params = new URLSearchParams();
          if (userId) params.set('userId', String(userId));
          if (userLineId) params.set('lineId', String(userLineId));
          
          const url = `/api/resume-deposit?${params.toString()}`;
          console.log('🔍 เรียก API:', url);
          
          const res = await fetch(url);
          console.log('🔍 API Response status:', res.status);
          
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
            const list = (json?.data || json || []) as any[];
            console.log('🔍 ข้อมูลที่ได้รับ:', list.length, 'รายการ');
            
            // กรองด้วย lineId เท่านั้น
            const filtered = Array.isArray(list)
              ? list.filter((r) => (r?.lineId || '') === userLineId)
              : [];
              
            console.log('🔍 Filtered results:', filtered.length, 'รายการ');
              
            if (filtered.length > 0) {
              // เรียงลำดับตามวันที่อัปเดตล่าสุด
              filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
              found = filtered[0];
              console.log('✅ พบข้อมูลฝากประวัติ:', found.id);
        } else {
              console.log('❌ ไม่พบข้อมูลฝากประวัติสำหรับ lineId นี้');
            }
          } else {
            console.log('❌ API response ไม่สำเร็จ:', res.status);
          }
        } catch (error) {
          console.error('❌ เกิดข้อผิดพลาดในการค้นหาข้อมูลฝากประวัติ:', error);
        }

        // 2. ดึงรายละเอียดข้อมูลฝากประวัติ (ถ้าพบ)
        if (found?.id) {
          try {
            console.log('🔍 ดึงรายละเอียดข้อมูลฝากประวัติ ID:', found.id);
            const detail = await fetch(`/api/resume-deposit/${found.id}`);
            if (detail.ok) {
              const dj = await detail.json().catch(() => ({}));
              found = dj?.data || dj || found;
              console.log('✅ ดึงรายละเอียดข้อมูลฝากประวัติสำเร็จ');
            } else {
              console.log('❌ ไม่สามารถดึงรายละเอียดข้อมูลฝากประวัติได้:', detail.status);
            }
          } catch (error) {
            console.error('❌ เกิดข้อผิดพลาดในการดึงรายละเอียดข้อมูลฝากประวัติ:', error);
          }
        }

        // 3. ตรวจสอบสถานะข้อมูลและนำทาง
        if (found) {
          console.log('✅ พบข้อมูลฝากประวัติ - กำลังตรวจสอบสถานะ...');
          console.log('🔍 ข้อมูลฝากประวัติ:', {
            id: found.id,
            name: `${found.firstName} ${found.lastName}`,
            email: found.email,
            profileImageUrl: found.profileImageUrl,
            status: found.status
          });
          console.log('🔍 รายละเอียด profileImageUrl:', {
            exists: !!found.profileImageUrl,
            value: found.profileImageUrl,
            type: typeof found.profileImageUrl
          });
          
          // ตรวจสอบว่าข้อมูลสมบูรณ์หรือไม่ (ไม่ใช่ draft)
          if (found.status && found.status !== 'DRAFT') {
            console.log('✅ พบข้อมูลฝากประวัติที่สมบูรณ์แล้ว - โหลดลงฟอร์มเพื่อแก้ไข');
            // ไม่ redirect ไปหน้า Dashboard - ให้ผู้ใช้แก้ไขข้อมูลได้
            console.log('ℹ️ คุณมีข้อมูลฝากประวัติแล้ว สามารถแก้ไขได้ในหน้านี้');
            setSavedResume(found);
            applyResumeToFormInputs(found);
            
            // โหลดรูปภาพโปรไฟล์ที่บันทึกไว้แล้ว
            if (found.profileImageUrl) {
              console.log('🔍 โหลดรูปภาพโปรไฟล์:', found.profileImageUrl);
              const imagePath = `/api/image?file=${found.profileImageUrl}`;
              console.log('🔍 กำลังตั้งค่า profileImage state:', imagePath);
              setProfileImage(imagePath);
              console.log('✅ โหลดรูปภาพโปรไฟล์สำเร็จ');
              
              // อัปเดต formData.profileImage ด้วย
              setFormData(prev => ({
                ...prev,
                profileImage: new File([], found.profileImageUrl, { type: 'image/jpeg' })
              }));
              console.log('✅ อัปเดต formData.profileImage สำเร็จ');
            } else {
              console.log('❌ ไม่พบ profileImageUrl ในข้อมูลฝากประวัติ');
              console.log('🔍 ข้อมูลที่ได้รับ:', Object.keys(found));
            }
            
            // โหลดข้อมูลเอกสารที่อัปโหลดแล้ว
            if (found.id) {
              console.log('🔍 โหลดข้อมูลเอกสารแนบ...');
              try {
                const documents = await fetchUploadedDocuments(found.id);
                setUploadedDocuments(documents);
                console.log('✅ โหลดข้อมูลเอกสารแนบสำเร็จ:', documents.length, 'ไฟล์');
              } catch (error) {
                console.error('❌ เกิดข้อผิดพลาดในการโหลดเอกสารแนบ:', error);
              }
            }
            
            console.log('✅ โหลดข้อมูลฝากประวัติสำเร็จ - ข้อมูลถูกเติมลงในฟอร์มแล้ว');
            return;
          } else {
            console.log('🔍 พบข้อมูลฝากประวัติที่เป็น draft - กำลังโหลดลงฟอร์ม...');
            setSavedResume(found);
            applyResumeToFormInputs(found);
            
            // โหลดรูปภาพโปรไฟล์ที่บันทึกไว้แล้ว
            if (found.profileImageUrl) {
              console.log('🔍 โหลดรูปภาพโปรไฟล์:', found.profileImageUrl);
              const imagePath = `/api/image?file=${found.profileImageUrl}`;
              console.log('🔍 กำลังตั้งค่า profileImage state:', imagePath);
              setProfileImage(imagePath);
              console.log('✅ โหลดรูปภาพโปรไฟล์สำเร็จ');
              
              // อัปเดต formData.profileImage ด้วย
              setFormData(prev => ({
                ...prev,
                profileImage: new File([], found.profileImageUrl, { type: 'image/jpeg' })
              }));
              console.log('✅ อัปเดต formData.profileImage สำเร็จ');
            } else {
              console.log('❌ ไม่พบ profileImageUrl ในข้อมูลฝากประวัติ');
              console.log('🔍 ข้อมูลที่ได้รับ:', Object.keys(found));
            }
            
            // โหลดข้อมูลเอกสารที่อัปโหลดแล้ว
            if (found.id) {
              console.log('🔍 โหลดข้อมูลเอกสารแนบ...');
              try {
                const documents = await fetchUploadedDocuments(found.id);
                setUploadedDocuments(documents);
                console.log('✅ โหลดข้อมูลเอกสารแนบสำเร็จ:', documents.length, 'ไฟล์');
              } catch (error) {
                console.error('❌ เกิดข้อผิดพลาดในการโหลดเอกสารแนบ:', error);
              }
            }
            
            console.log('✅ โหลดข้อมูลฝากประวัติสำเร็จ - ข้อมูลถูกเติมลงในฟอร์มแล้ว');
          }
        } else {
          // ถ้าไม่พบข้อมูลฝากประวัติ ให้กรอกใหม่ได้เลย ไม่ต้องไปหาข้อมูลอัปเดต
          console.log('🔍 ไม่พบข้อมูลฝากประวัติ - ให้กรอกข้อมูลใหม่ได้เลย');
          console.log('✅ กรุณากรอกข้อมูลฝากประวัติของคุณ');
        }
      } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการโหลดข้อมูลฝากประวัติ:', error);
      } finally {
        setIsLoading(false);
        console.log('✅ การโหลดข้อมูลฝากประวัติเสร็จสิ้น');
      }
    };
    
    loadMyResume();
  }, [status, resumeId, departmentName]);
  // นำข้อมูลที่บันทึกแล้วมากรอกกลับในฟอร์ม
  const applyResumeToFormInputs = (resume: any) => {
    if (!resume) return;
    // แปลงค่า enum ภาษาอังกฤษจากฐานข้อมูล → ค่าที่ UI ใช้ (ภาษาไทย)
    const genderUi = resume.gender === 'MALE' ? 'ชาย' : resume.gender === 'FEMALE' ? 'หญิง' : (resume.gender || '');
    const maritalUi = resume.maritalStatus === 'SINGLE' ? 'โสด'
      : resume.maritalStatus === 'MARRIED' ? 'สมรส'
      : resume.maritalStatus === 'DIVORCED' ? 'หย่า'
      : resume.maritalStatus === 'WIDOWED' ? 'หม้าย'
      : (resume.maritalStatus || '');
    const mappedEducation = Array.isArray(resume.education)
      ? resume.education.map((e: any) => ({
          level: e.level || '',
          institution: e.school || '',
          major: e.major || '',
          year: e.endYear?.toString?.() || e.year?.toString?.() || '',
          gpa: (e.gpa != null ? String(e.gpa) : '')
        }))
      : [];
    const mappedWork = Array.isArray(resume.workExperience)
      ? resume.workExperience.map((w: any) => ({
          position: w.position || '',
          company: w.company || '',
          startDate: w.startDate ? new Date(w.startDate).toISOString().slice(0, 10) : '',
          endDate: w.endDate ? new Date(w.endDate).toISOString().slice(0, 10) : '',
          salary: w.salary || '',
          reason: w.description || '',
          district: w.district || '',
          province: w.province || '',
          phone: w.phone || ''
        }))
      : [];
    const mappedPreviousGovernmentService = Array.isArray(resume.previousGovernmentService)
      ? resume.previousGovernmentService.map((g: any) => ({
          position: g.position || '',
          department: g.department || '',
          reason: g.reason || '',
          date: g.date || '',
          type: g.type || 'civilServant'
        }))
      : [];

    setFormData((prev) => ({
      ...prev,
      prefix: resume.prefix ?? prev.prefix,
      firstName: resume.firstName ?? prev.firstName,
      lastName: resume.lastName ?? prev.lastName,
      idNumber: resume.idNumber ?? prev.idNumber,
      idCardIssuedAt: resume.idCardIssuedAt ?? prev.idCardIssuedAt,
      idCardIssueDate: resume.idCardIssueDate ? new Date(resume.idCardIssueDate).toISOString().slice(0, 10) : prev.idCardIssueDate,
      idCardExpiryDate: resume.idCardExpiryDate ? new Date(resume.idCardExpiryDate).toISOString().slice(0, 10) : prev.idCardExpiryDate,
      birthDate: resume.birthDate ? new Date(resume.birthDate).toISOString().slice(0, 10) : prev.birthDate,
      age: resume.age != null ? String(resume.age) : prev.age,
      gender: genderUi || prev.gender,
      race: resume.race ?? prev.race,
      placeOfBirth: resume.placeOfBirth ?? prev.placeOfBirth,
      placeOfBirthProvince: resume.placeOfBirthProvince ?? prev.placeOfBirthProvince,
      nationality: resume.nationality ?? prev.nationality,
      religion: resume.religion ?? prev.religion,
      maritalStatus: maritalUi || prev.maritalStatus,
      currentAddress: resume.address ?? prev.currentAddress,
      phone: resume.phone ?? prev.phone,
      email: resume.email ?? prev.email,
      emergencyContact: resume.emergencyContact ?? prev.emergencyContact,
      emergencyContactFirstName: resume.emergencyContactFirstName ?? prev.emergencyContactFirstName,
      emergencyContactLastName: resume.emergencyContactLastName ?? prev.emergencyContactLastName,
      emergencyPhone: resume.emergencyPhone ?? prev.emergencyPhone,
      emergencyRelationship: resume.emergencyRelationship ?? prev.emergencyRelationship,
      emergencyWorkplace: {
        name: resume.emergency_workplace_name || resume.emergencyWorkplace?.name || prev.emergencyWorkplace?.name || '',
        district: resume.emergency_workplace_district || resume.emergencyWorkplace?.district || prev.emergencyWorkplace?.district || '',
        province: resume.emergency_workplace_province || resume.emergencyWorkplace?.province || prev.emergencyWorkplace?.province || '',
        phone: resume.emergency_workplace_phone || resume.emergencyWorkplace?.phone || prev.emergencyWorkplace?.phone || ''
      },
      skills: resume.skills ?? prev.skills,
      languages: resume.languages ?? prev.languages,
      computerSkills: resume.computerSkills ?? prev.computerSkills,
      certificates: resume.certificates ?? prev.certificates,
      references: resume.references ?? prev.references,
      appliedPosition: resume.expectedPosition ?? prev.appliedPosition,
      expectedSalary: resume.expectedSalary ?? prev.expectedSalary,
      availableDate: resume.availableDate ? new Date(resume.availableDate).toISOString().slice(0, 10) : prev.availableDate,
      department: resume.department ?? (prev as any).department,
      ...(typeof (prev as any).unit !== 'undefined' ? { unit: resume.unit ?? (prev as any).unit } : {}),
      education: mappedEducation.length ? mappedEducation : prev.education,
      workExperience: mappedWork.length ? mappedWork : prev.workExperience,
      previousGovernmentService: mappedPreviousGovernmentService.length ? mappedPreviousGovernmentService : prev.previousGovernmentService,
      // แผนที่อยู่ตามทะเบียนบ้าน
      registeredAddress: {
        houseNumber: resume.house_registration_house_number || prev.registeredAddress?.houseNumber || '',
        villageNumber: resume.house_registration_village_number || prev.registeredAddress?.villageNumber || '',
        alley: resume.house_registration_alley || prev.registeredAddress?.alley || '',
        road: resume.house_registration_road || prev.registeredAddress?.road || '',
        subDistrict: resume.house_registration_sub_district || prev.registeredAddress?.subDistrict || '',
        district: resume.house_registration_district || prev.registeredAddress?.district || '',
        province: resume.house_registration_province || prev.registeredAddress?.province || '',
        postalCode: resume.house_registration_postal_code || prev.registeredAddress?.postalCode || '',
        phone: resume.house_registration_phone || prev.registeredAddress?.phone || '',
        mobile: resume.house_registration_mobile || prev.registeredAddress?.mobile || ''
      },
      // แผนที่อยู่ปัจจุบัน
      currentAddressDetail: {
        houseNumber: resume.current_address_house_number || prev.currentAddressDetail?.houseNumber || '',
        villageNumber: resume.current_address_village_number || prev.currentAddressDetail?.villageNumber || '',
        alley: resume.current_address_alley || prev.currentAddressDetail?.alley || '',
        road: resume.current_address_road || prev.currentAddressDetail?.road || '',
        subDistrict: resume.current_address_sub_district || prev.currentAddressDetail?.subDistrict || '',
        district: resume.current_address_district || prev.currentAddressDetail?.district || '',
        province: resume.current_address_province || prev.currentAddressDetail?.province || '',
        postalCode: resume.current_address_postal_code || prev.currentAddressDetail?.postalCode || '',
        homePhone: resume.current_address_phone || prev.currentAddressDetail?.homePhone || '',
        mobilePhone: resume.current_address_mobile || prev.currentAddressDetail?.mobilePhone || ''
      },
      // แผนที่อยู่ผู้ติดต่อฉุกเฉิน
      emergencyAddress: {
        houseNumber: resume.emergency_address_house_number || prev.emergencyAddress?.houseNumber || '',
        villageNumber: resume.emergency_address_village_number || prev.emergencyAddress?.villageNumber || '',
        alley: resume.emergency_address_alley || prev.emergencyAddress?.alley || '',
        road: resume.emergency_address_road || prev.emergencyAddress?.road || '',
        subDistrict: resume.emergency_address_sub_district || prev.emergencyAddress?.subDistrict || '',
        district: resume.emergency_address_district || prev.emergencyAddress?.district || '',
        province: resume.emergency_address_province || prev.emergencyAddress?.province || '',
        postalCode: resume.emergency_address_postal_code || prev.emergencyAddress?.postalCode || '',
        phone: resume.emergency_address_phone || prev.emergencyAddress?.phone || ''
      },
      // ข้อมูลเอกสารที่อัปโหลดแล้ว (แสดงสถานะไฟล์)
      documents: {
        idCard: resume.idCard ? { name: resume.idCard, uploaded: true } : prev.documents?.idCard,
        houseRegistration: resume.houseRegistration ? { name: resume.houseRegistration, uploaded: true } : prev.documents?.houseRegistration,
        militaryCertificate: resume.militaryCertificate ? { name: resume.militaryCertificate, uploaded: true } : prev.documents?.militaryCertificate,
        educationCertificate: resume.educationCertificate ? { name: resume.educationCertificate, uploaded: true } : prev.documents?.educationCertificate,
        medicalCertificate: resume.medicalCertificate ? { name: resume.medicalCertificate, uploaded: true } : prev.documents?.medicalCertificate,
        drivingLicense: resume.drivingLicense ? { name: resume.drivingLicense, uploaded: true } : prev.documents?.drivingLicense,
        nameChangeCertificate: resume.nameChangeCertificate ? { name: resume.nameChangeCertificate, uploaded: true } : prev.documents?.nameChangeCertificate,
        otherDocuments: resume.otherDocuments ? resume.otherDocuments.map((doc: any) => ({ name: doc, uploaded: true })) : prev.documents?.otherDocuments
      }
    }));
    // จัดการรูปภาพโปรไฟล์
    console.log('🔍 applyResumeToFormInputs - Resume data:', resume);
    console.log('🔍 applyResumeToFormInputs - ProfileImageUrl:', resume.profileImageUrl);
    console.log('🔍 applyResumeToFormInputs - Resume ID:', resume.id);
    console.log('🔍 applyResumeToFormInputs - Current profileImage state:', profileImage);
    console.log('🔍 applyResumeToFormInputs - Will try to load profile image');
    
    if (resume.profileImageUrl) {
      console.log('✅ applyResumeToFormInputs - Using profileImageUrl:', resume.profileImageUrl);
      // ใช้ path แบบเดียวกับ profile page
      const imagePath = `/api/image?file=${resume.profileImageUrl}`;
      console.log('✅ Using API path for profile image:', imagePath);
      setProfileImage(imagePath);
      
      // อัปเดต formData.profileImage ด้วย
      setFormData(prev => ({ 
        ...prev, 
        profileImage: new File([], resume.profileImageUrl, { type: 'image/jpeg' })
      }));
      
      console.log('✅ applyResumeToFormInputs - Profile image state updated');
    } else if (resume.id) {
      // Try to find image by ID - ลองหาไฟล์หลายรูปแบบ
      const checkImage = async () => {
        try {
          // ลองหาไฟล์ที่มีอยู่จริงในโฟลเดอร์
          const possibleNames = [
            `profile_${resume.id}.jpg`,
            `profile_${resume.id}.jpeg`, 
            `profile_${resume.id}.png`,
            `profile_temp_${resume.id}.jpg`,
            `profile_temp_${resume.id}.jpeg`,
            `profile_temp_${resume.id}.png`
          ];
          
          // เพิ่มการหาไฟล์ด้วย timestamp (สำหรับไฟล์ที่บันทึกด้วย timestamp)
          if (resume.id && resume.id.length > 10) {
            // ลองหาไฟล์ที่มี timestamp ใกล้เคียง
            const timestamp = Date.now();
            const possibleTimestamps = [
              timestamp,
              timestamp - 1000, // 1 วินาทีก่อน
              timestamp - 5000, // 5 วินาทีก่อน
              timestamp - 10000, // 10 วินาทีก่อน
              timestamp - 30000, // 30 วินาทีก่อน
              timestamp - 60000, // 1 นาทีก่อน
            ];
            
            for (const ts of possibleTimestamps) {
              possibleNames.push(`profile_temp_${ts}.jpg`);
              possibleNames.push(`profile_temp_${ts}.jpeg`);
              possibleNames.push(`profile_temp_${ts}.png`);
            }
            
            // ลองหาไฟล์ที่มี timestamp ใกล้เคียงกับ resume.id
            if (resume.id.match(/^\d+$/)) {
              const resumeTimestamp = parseInt(resume.id);
              const possibleResumeTimestamps = [
                resumeTimestamp,
                resumeTimestamp - 1000,
                resumeTimestamp - 5000,
                resumeTimestamp - 10000,
                resumeTimestamp - 30000,
                resumeTimestamp - 60000,
              ];
              
              for (const ts of possibleResumeTimestamps) {
                possibleNames.push(`profile_temp_${ts}.jpg`);
                possibleNames.push(`profile_temp_${ts}.jpeg`);
                possibleNames.push(`profile_temp_${ts}.png`);
              }
            }
            
            // ลองหาไฟล์ที่มี timestamp ใกล้เคียงกับ timestamp ปัจจุบัน
            const currentTimestamp = Date.now();
            const possibleCurrentTimestamps = [
              currentTimestamp,
              currentTimestamp - 1000,
              currentTimestamp - 5000,
              currentTimestamp - 10000,
              currentTimestamp - 30000,
              currentTimestamp - 60000,
            ];
            
            for (const ts of possibleCurrentTimestamps) {
              possibleNames.push(`profile_temp_${ts}.jpg`);
              possibleNames.push(`profile_temp_${ts}.jpeg`);
              possibleNames.push(`profile_temp_${ts}.png`);
            }
          }
          
          let foundImage = false;
          for (const fileName of possibleNames) {
            const imagePath = `/api/image?file=${fileName}`;
            console.log('🔍 applyResumeToFormInputs - Trying path:', imagePath);
            const response = await fetch(imagePath);
            if (response.ok) {
              console.log('✅ applyResumeToFormInputs - Found image:', imagePath);
              setProfileImage(imagePath);
            // อัปเดต formData.profileImage ด้วย
            setFormData(prev => ({
              ...prev,
                profileImage: new File([], fileName, { type: fileName.endsWith('.png') ? 'image/png' : 'image/jpeg' })
              }));
              foundImage = true;
              break;
            }
          }
          
          if (!foundImage) {
            console.log('❌ applyResumeToFormInputs - No image found for ID:', resume.id);
            console.log('🔍 Tried these names:', possibleNames);
            console.log('ℹ️ No profile image found - user can upload a new one');
          }
        } catch (error) {
          console.log('❌ applyResumeToFormInputs - Error finding image:', error);
        }
      };
      checkImage();
    }
    
    // เพิ่มการโหลดรูปใหม่หลังจากบันทึกสำเร็จ
    if (resume.profileImageUrl) {
      const imagePath = `/api/image?file=${resume.profileImageUrl}`;
      console.log('🔍 applyResumeToFormInputs - Setting profile image from profileImageUrl:', imagePath);
      console.log('🔍 applyResumeToFormInputs - Setting profile image after refresh:', imagePath);
      setProfileImage(imagePath);
    }
  };
  // บันทึกเฉพาะแท็บปัจจุบัน (partial save)
  const saveCurrentTab = async () => {
    if (isSaving) return;
    
    // ตรวจสอบข้อมูลก่อนบันทึก
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // แสดงข้อผิดพลาดเฉพาะแท็บปัจจุบัน
      const tabErrors = Object.keys(validationErrors).filter(key => {
        if (activeTab === 'personal') {
          return key.includes('prefix') || key.includes('firstName') || key.includes('lastName') || 
                 key.includes('age') || key.includes('birthDate') || key.includes('placeOfBirth') ||
                 key.includes('race') || key.includes('nationality') || key.includes('religion') ||
                 key.includes('gender') || key.includes('maritalStatus') || key.includes('idNumber') ||
                 key.includes('registeredAddress') || key.includes('currentAddress') || 
                 key.includes('emergency') || key.includes('spouse') || key.includes('medicalRights') ||
                 key.includes('multipleEmployers') || key.includes('appliedPosition') ||
                 key.includes('expectedSalary') || key.includes('availableDate') || key.includes('department');
        } else if (activeTab === 'education') {
          return key.includes('education');
        } else if (activeTab === 'work') {
          return key.includes('workExperience') || key.includes('previousGovernmentService');
        } else if (activeTab === 'skills') {
          return key.includes('skills') || key.includes('languages') || key.includes('computerSkills');
        } else if (activeTab === 'position') {
          return key.includes('appliedPosition') || key.includes('expectedSalary') || 
                 key.includes('availableDate') || key.includes('department');
        } else if (activeTab === 'documents') {
          return key.includes('documents');
        }
        return false;
      });
      
      if (tabErrors.length > 0) {
        // แสดงข้อความแจ้งเตือนให้ผู้ใช้ทราบ
        const errorMessages = tabErrors.map(key => validationErrors[key]).join(', ');
        
        // แสดง toast notification แทน alert
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md';
        toast.innerHTML = `
          <div class="flex items-center">
            <div class="flex-1">
              <div class="font-semibold">ข้อมูลไม่ครบถ้วน (${tabErrors.length} ข้อผิดพลาด)</div>
              <div class="text-sm mt-1">${errorMessages}</div>
              <div class="text-xs mt-2 opacity-90">กำลังเลื่อนไปยังจุดที่มีข้อผิดพลาด...</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        `;
        document.body.appendChild(toast);
        
        // ลบ toast หลังจาก 5 วินาที
        setTimeout(() => {
          if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
          }
        }, 5000);
        
        // แสดง error summary ที่ด้านบนของฟอร์ม
        const errorSummary = document.createElement('div');
        errorSummary.id = 'error-summary';
        errorSummary.className = 'bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg';
        errorSummary.innerHTML = `
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                กรุณาแก้ไขข้อมูลให้ครบถ้วน (${tabErrors.length} ข้อผิดพลาด)
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <ul class="list-disc list-inside space-y-1">
                  ${tabErrors.map(key => `<li>${validationErrors[key]}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;
        
        // ลบ error summary เก่า (ถ้ามี)
        const existingErrorSummary = document.getElementById('error-summary');
        if (existingErrorSummary) {
          existingErrorSummary.remove();
        }
        
        // แทรก error summary ที่ด้านบนของฟอร์ม
        const formContainer = document.querySelector('.max-w-4xl');
        if (formContainer) {
          formContainer.insertBefore(errorSummary, formContainer.firstChild);
        }
        
        // Scroll ไปยัง error แรก
        if (tabErrors.length > 0) {
          scrollToError(tabErrors[0]);
        }
        return;
      }
    }
    try {
      setIsSaving(true);

      // กำหนดฟิลด์ที่เกี่ยวข้องของแต่ละแท็บ
      const tab = activeTab;
      const partial: any = {};
      if (tab === 'personal') {
        Object.assign(partial, {
          prefix: formData.prefix || null,
          firstName: formData.firstName,
          lastName: formData.lastName,
          idNumber: formData.idNumber || null,
          idCardIssuedAt: formData.idCardIssuedAt || null,
          idCardIssueDate: formData.idCardIssueDate ? new Date(formData.idCardIssueDate) : null,
          idCardExpiryDate: formData.idCardExpiryDate ? new Date(formData.idCardExpiryDate) : null,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
          age: formData.age ? Number(formData.age) : null,
          race: formData.race || null,
          placeOfBirth: formData.placeOfBirth || null,
          placeOfBirthProvince: formData.placeOfBirthProvince || null,
          gender: formData.gender || 'UNKNOWN',
          nationality: formData.nationality || 'ไทย',
          religion: formData.religion || null,
          maritalStatus: formData.maritalStatus || 'UNKNOWN',
          address: formData.currentAddress || formData.addressAccordingToHouseRegistration || null,
          // ที่อยู่ทะเบียนบ้าน
          house_registration_house_number: formData.registeredAddress?.houseNumber || null,
          house_registration_village_number: formData.registeredAddress?.villageNumber || null,
          house_registration_alley: formData.registeredAddress?.alley || null,
          house_registration_road: formData.registeredAddress?.road || null,
          house_registration_sub_district: formData.registeredAddress?.subDistrict || null,
          house_registration_district: formData.registeredAddress?.district || null,
          house_registration_province: formData.registeredAddress?.province || null,
          house_registration_postal_code: formData.registeredAddress?.postalCode || null,
          house_registration_phone: formData.registeredAddress?.phone || null,
          house_registration_mobile: formData.registeredAddress?.mobile || null,
          // ที่อยู่ปัจจุบัน
          current_address_house_number: formData.currentAddressDetail?.houseNumber || null,
          current_address_village_number: formData.currentAddressDetail?.villageNumber || null,
          current_address_alley: formData.currentAddressDetail?.alley || null,
          current_address_road: formData.currentAddressDetail?.road || null,
          current_address_sub_district: formData.currentAddressDetail?.subDistrict || null,
          current_address_district: formData.currentAddressDetail?.district || null,
          current_address_province: formData.currentAddressDetail?.province || null,
          current_address_postal_code: formData.currentAddressDetail?.postalCode || null,
          current_address_phone: formData.currentAddressDetail?.homePhone || null,
          current_address_mobile: formData.currentAddressDetail?.mobilePhone || null,
          // ติดต่อฉุกเฉิน
          phone: formData.phone,
          email: formData.email,
          emergencyContact: formData.emergencyContact || `${formData.emergencyContactFirstName || ''} ${formData.emergencyContactLastName || ''}`.trim(),
          emergencyContactFirstName: formData.emergencyContactFirstName || null,
          emergencyContactLastName: formData.emergencyContactLastName || null,
          emergencyPhone: formData.emergencyPhone || null,
          emergencyRelationship: formData.emergencyRelationship || null,
          emergency_address_house_number: formData.emergencyAddress?.houseNumber || null,
          emergency_address_village_number: formData.emergencyAddress?.villageNumber || null,
          emergency_address_alley: formData.emergencyAddress?.alley || null,
          emergency_address_road: formData.emergencyAddress?.road || null,
          emergency_address_sub_district: formData.emergencyAddress?.subDistrict || null,
          emergency_address_district: formData.emergencyAddress?.district || null,
          emergency_address_province: formData.emergencyAddress?.province || null,
          emergency_address_postal_code: formData.emergencyAddress?.postalCode || null,
          emergency_address_phone: formData.emergencyAddress?.phone || null,
          emergency_workplace_name: formData.emergencyWorkplace?.name || null,
          emergency_workplace_district: formData.emergencyWorkplace?.district || null,
          emergency_workplace_province: formData.emergencyWorkplace?.province || null,
          emergency_workplace_phone: formData.emergencyWorkplace?.phone || null,
          // ข้อมูลคู่สมรส
          spouse_first_name: formData.spouseInfo?.firstName || null,
          spouse_last_name: formData.spouseInfo?.lastName || null,
          // ข้อมูลสิทธิการรักษา
          medical_rights_has_universal_healthcare: formData.medicalRights?.hasUniversalHealthcare || false,
          medical_rights_universal_healthcare_hospital: formData.medicalRights?.universalHealthcareHospital || null,
          medical_rights_has_social_security: formData.medicalRights?.hasSocialSecurity || false,
          medical_rights_social_security_hospital: formData.medicalRights?.socialSecurityHospital || null,
          medical_rights_dont_want_to_change_hospital: formData.medicalRights?.dontWantToChangeHospital || false,
          medical_rights_want_to_change_hospital: formData.medicalRights?.wantToChangeHospital || false,
          medical_rights_new_hospital: formData.medicalRights?.newHospital || null,
          medical_rights_has_civil_servant_rights: formData.medicalRights?.hasCivilServantRights || false,
          medical_rights_other_rights: formData.medicalRights?.otherRights || null,
          // ข้อมูลนายจ้างหลายราย (เก็บเป็น JSON)
          multiple_employers: formData.multipleEmployers ? JSON.stringify(formData.multipleEmployers) : null,
          // ข้อมูลสถานที่ทำงานปัจจุบัน
          staff_position: formData.staffInfo?.position || null,
          staff_department: formData.staffInfo?.department || null,
          staff_start_work: formData.staffInfo?.startWork || null,
        });
      } else if (tab === 'education') {
        partial.education = (formData.education || []).map((e) => ({
          level: e.level,
          school: e.institution,
          major: e.major || null,
          endYear: e.year || undefined,
          gpa: e.gpa ? parseFloat(e.gpa) : undefined,
        }));
      } else if (tab === 'work') {
        partial.workExperience = (formData.workExperience || []).map((w) => ({
          position: w.position,
          company: w.company,
          startDate: w.startDate ? new Date(w.startDate) : null,
          endDate: w.endDate ? new Date(w.endDate) : null,
          isCurrent: !!formData.currentWork,
          description: w.reason || null,
          salary: w.salary || null,
          district: w.district || null,
          province: w.province || null,
          phone: w.phone || null,
        }));
        // ข้อมูลการรับราชการก่อนหน้า
        partial.previousGovernmentService = (formData.previousGovernmentService || []).map((g) => ({
          position: g.position,
          department: g.department,
          reason: g.reason,
          date: g.date,
          type: g.type || 'civilServant', // เพิ่มฟิลด์ type
        }));
      } else if (tab === 'skills') {
        Object.assign(partial, {
          skills: formData.skills || null,
          languages: formData.languages || null,
          computerSkills: formData.computerSkills || null,
          certificates: formData.certificates || null,
          references: formData.references || null,
        });
      } else if (tab === 'position') {
        Object.assign(partial, {
          expectedPosition: formData.appliedPosition || null,
          expectedSalary: formData.expectedSalary || null,
          availableDate: formData.availableDate ? new Date(formData.availableDate) : null,
          department: formData.department || null,
          unit: (formData as any).unit || null,
          // ข้อมูลสถานที่ทำงานปัจจุบัน
          staff_position: formData.staffInfo?.position || null,
          staff_department: formData.staffInfo?.department || null,
          staff_start_work: formData.staffInfo?.startWork || null,
        });
      } else if (tab === 'documents') {
        // สำหรับแท็บ documents ข้อมูลจะถูกบันทึกผ่านการอัปโหลดไฟล์แยกต่างหาก
        // ไม่ต้องส่งข้อมูล documents ใน partial เพราะจะจัดการแยกใน API
        Object.assign(partial, {
          // documents: formData.documents || null,
        });
      }
      // บันทึกข้อมูลทุกแท็บในเรคคอร์ดเดียว แต่สามารถบันทึกแยกแท็บได้
      // ถ้ามี savedResume.id แล้วใช้ PATCH, ถ้าไม่มีใช้ POST
      console.log('🔍 saveCurrentTab - savedResume:', savedResume);
      console.log('🔍 saveCurrentTab - savedResume.id:', savedResume?.id);
      if (savedResume?.id) {
        // อัปเดตข้อมูลที่มีอยู่แล้ว
        console.log('🔍 saveCurrentTab - Using PATCH method (updating existing record)');
        console.log('✅ กำลังอัปเดตข้อมูลที่มีอยู่แล้ว...');
        console.log('📝 Mode: UPDATE - มีข้อมูลในฐานข้อมูลแล้ว');
        const res = await fetch(`/api/resume-deposit/${savedResume.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partial)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          const statusCode = res?.status || 'Unknown';
          const errorMessage = json?.message || `บันทึกข้อมูลไม่สำเร็จ (HTTP ${statusCode})`;
          console.error('❌ PATCH request failed:', errorMessage);
          // Fallback: ถ้าไม่พบข้อมูล (เช่น 404) ให้สร้างเรคคอร์ดใหม่ด้วย POST
          if (statusCode === 404 || /ไม่พบ/i.test(String(errorMessage))) {
            console.log('🔁 PATCH not found → fallback to POST create');
            const userId = (session?.user as any)?.id || null;
            const lineIdCandidate = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || null;
            const createRes = await fetch('/api/resume-deposit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                lineId: lineIdCandidate,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                ...partial,
              })
            });
            const createJson = await createRes.json().catch(() => ({}));
            if (!createRes.ok || createJson?.success === false) {
              throw new Error(createJson?.message || 'บันทึกข้อมูลไม่สำเร็จ');
            }
            setSavedResume(createJson.data || createJson);
            applyResumeToFormInputs(createJson.data || createJson);
            // Upload profile image along with personal tab save
            if (tab === 'personal' && formData.profileImage instanceof File) {
              try {
                const rid = (createJson?.data?.id || createJson?.id);
                if (rid) {
                  const imgFd = new FormData();
                  imgFd.append('profileImage', formData.profileImage);
                  imgFd.append('resumeId', String(rid));
                  const imgRes = await fetch('/api/profile-image/upload', { method: 'POST', body: imgFd });
                  if (!imgRes.ok) console.warn('⚠️ Profile image upload failed (fallback POST path):', imgRes.status);
                }
              } catch (e) {
                console.error('⚠️ Profile image upload error (fallback POST path):', e);
              }
            }
          } else {
          throw new Error(errorMessage);
          }
        } else {
          setSavedResume(json.data || json);
          applyResumeToFormInputs(json.data || json);
          
          // โหลดรูปโปรไฟล์ใหม่หลังจากบันทึกสำเร็จ
          if (json.data?.profileImageUrl) {
            const imagePath = `/api/image?file=${json.data.profileImageUrl}`;
            console.log('🔍 Reloading profile image after save (PATCH):', imagePath);
            setProfileImage(imagePath);
          }
          console.log('✅ อัปเดตข้อมูลสำเร็จ');
          // Upload profile image along with personal tab save
          if (tab === 'personal' && formData.profileImage instanceof File) {
            try {
              const rid = (json?.data?.id || json?.id || savedResume?.id);
              if (rid) {
                const imgFd = new FormData();
                imgFd.append('profileImage', formData.profileImage);
                imgFd.append('resumeId', String(rid));
                const imgRes = await fetch('/api/profile-image/upload', { method: 'POST', body: imgFd });
                if (!imgRes.ok) console.warn('⚠️ Profile image upload failed (PATCH path):', imgRes.status);
              }
            } catch (e) {
              console.error('⚠️ Profile image upload error (PATCH path):', e);
            }
          }
        }
      } else {
        // สร้างข้อมูลใหม่
        console.log('🔍 saveCurrentTab - Using POST method (creating new record)');
        console.log('✅ กำลังสร้างข้อมูลใหม่...');
        console.log('📝 Mode: CREATE - ไม่มีข้อมูลในฐานข้อมูล');
        const userId = (session?.user as any)?.id || null;
        const lineIdCandidate = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || null;
        const res = await fetch('/api/resume-deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            lineId: lineIdCandidate,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            ...partial,
          })
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || 'บันทึกข้อมูลไม่สำเร็จ');
        }
        setSavedResume(json.data || json);
        applyResumeToFormInputs(json.data || json);
        
        // โหลดรูปโปรไฟล์ใหม่หลังจากบันทึกสำเร็จ
        if (json.data?.profileImageUrl) {
          const imagePath = `/api/image?file=${json.data.profileImageUrl}`;
          console.log('🔍 Reloading profile image after save (POST):', imagePath);
          setProfileImage(imagePath);
        }
        console.log('✅ สร้างข้อมูลใหม่สำเร็จ');
        // Upload profile image along with personal tab save
        if (tab === 'personal' && formData.profileImage instanceof File) {
          try {
            const rid = (json?.data?.id || json?.id);
            if (rid) {
              const imgFd = new FormData();
              imgFd.append('profileImage', formData.profileImage);
              imgFd.append('resumeId', String(rid));
              const imgRes = await fetch('/api/profile-image/upload', { method: 'POST', body: imgFd });
              if (!imgRes.ok) console.warn('⚠️ Profile image upload failed (POST path):', imgRes.status);
            }
          } catch (e) {
            console.error('⚠️ Profile image upload error (POST path):', e);
          }
        }
      }

      // ไปแท็บถัดไปอัตโนมัติหลังบันทึกสำเร็จ หรือ redirect ไปหน้า dashboard
      if (tab === 'documents') {
        console.log('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
        // Redirect ไปหน้า dashboard
        window.location.href = '/dashboard';
      } else {
        const flow: Record<string, string> = {
          personal: 'education',
          education: 'work',
          work: 'skills',
          skills: 'position',
          position: 'documents'
        };
        const next = flow[tab as keyof typeof flow];
        if (next) setActiveTab(next);
        console.log('✅ บันทึกสำเร็จ');
      }
    } catch (err: any) {
      console.error('❌ เกิดข้อผิดพลาดในการบันทึก:', err);
      alert(`เกิดข้อผิดพลาดในการบันทึก: ${err.message || 'ไม่ทราบสาเหตุ'}`);
    } finally {
      setIsSaving(false);
    }
  };
  const [activeTab, setActiveTab] = useState('personal');
  const birthDateRef = useRef<HTMLInputElement | null>(null);
  const idCardIssueDateRef = useRef<HTMLInputElement | null>(null);
  const idCardExpiryDateRef = useRef<HTMLInputElement | null>(null);
  const availableDateRef = useRef<HTMLInputElement | null>(null);
  // ฟังก์ชันสำหรับกรอกข้อมูลตัวอย่าง (Random)
  const fillRandomData = () => {
    const prefixes = ['นาย', 'นาง', 'นางสาว'];
    const firstNames = ['สมชาย', 'สมหญิง', 'สมศักดิ์', 'สมปอง', 'สมใจ', 'สมบัติ', 'สมพร', 'สมคิด', 'สมศรี', 'สมบิน'];
    const lastNames = ['ใจดี', 'รักดี', 'เงินดี', 'ดีใจ', 'ผลิตดี', 'คิดดี', 'บริการดี', 'จัดซื้อดี', 'กฎหมายดี', 'บินดี'];
    const races = ['ไทย', 'จีน', 'ลาว', 'กัมพูชา', 'เวียดนาม'];
    const nationalities = ['ไทย', 'จีน', 'ลาว', 'กัมพูชา', 'เวียดนาม'];
    const religions = ['พุทธ', 'คริสต์', 'อิสลาม', 'ฮินดู', 'ซิกข์'];
    const maritalStatuses = ['โสด', 'สมรส', 'หย่า', 'หม้าย'];
    const genders = ['ชาย', 'หญิง'];
    const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'เชียงราย', 'นครราชสีมา', 'ขอนแก่น', 'อุดรธานี', 'อุบลราชธานี', 'สงขลา', 'ภูเก็ต', 'ระยอง'];
    const districts = ['เมือง', 'สันทราย', 'แม่ริม', 'หางดง', 'สันป่าข่อย'];
    const subDistricts = ['ศรีภูมิ', 'สุเทพ', 'ช้างเผือก', 'หายยา', 'วัดเกต'];
    const institutions = ['จุฬาลงกรณ์มหาวิทยาลัย', 'มหาวิทยาลัยธรรมศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยมหิดล', 'มหาวิทยาลัยเชียงใหม่'];
    const majors = ['วิศวกรรมศาสตร์', 'บริหารธุรกิจ', 'แพทยศาสตร์', 'พยาบาลศาสตร์', 'เภสัชศาสตร์', 'ทันตแพทยศาสตร์', 'วิทยาศาสตร์', 'ศิลปศาสตร์'];
    const positions = ['วิศวกร', 'นักบัญชี', 'พยาบาล', 'แพทย์', 'เภสัชกร', 'ทันตแพทย์', 'นักวิทยาศาสตร์', 'นักวิชาการ'];
    const companies = ['บริษัท ตัวอย่าง จำกัด', 'โรงพยาบาลตัวอย่าง', 'มหาวิทยาลัยตัวอย่าง', 'โรงเรียนตัวอย่าง', 'องค์กรตัวอย่าง'];
    const skills = ['การสื่อสาร', 'การทำงานเป็นทีม', 'การแก้ปัญหา', 'การคิดวิเคราะห์', 'การเป็นผู้นำ', 'การจัดการเวลา'];
    const languages = ['ไทย', 'อังกฤษ', 'จีน', 'ญี่ปุ่น', 'เกาหลี', 'ฝรั่งเศส', 'เยอรมัน'];
    const computerSkills = ['Microsoft Office', 'Excel', 'PowerPoint', 'Word', 'Google Workspace', 'โปรแกรมบัญชี', 'โปรแกรมออกแบบ'];
    const certificates = ['ใบรับรองการอบรม', 'ใบรับรองความสามารถ', 'ใบรับรองการทำงาน', 'ใบรับรองการศึกษา'];
    const departments = ['แผนกการเงิน', 'แผนกบุคคล', 'แผนกการตลาด', 'แผนกผลิต', 'แผนกวิจัยและพัฒนา'];

    // สร้างข้อมูลสุ่ม
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    const randomAge = Math.floor(Math.random() * 40) + 20; // อายุ 20-60
    const randomYear = new Date().getFullYear() - randomAge;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomBirthDate = `${randomYear}-${randomMonth.toString().padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`;
    
    // สร้างเลขบัตรประชาชน 13 หลัก
    const randomIdNumber = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    
    // สร้างข้อมูลที่อยู่
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
    const randomSubDistrict = subDistricts[Math.floor(Math.random() * subDistricts.length)];
    const randomHouseNumber = Math.floor(Math.random() * 999) + 1;
    const randomVillageNumber = Math.floor(Math.random() * 99) + 1;
    
    // สร้างข้อมูลการศึกษา
    const randomInstitution = institutions[Math.floor(Math.random() * institutions.length)];
    const randomMajor = majors[Math.floor(Math.random() * majors.length)];
    const randomGpa = (Math.random() * 2 + 2).toFixed(2); // GPA 2.00-4.00
    const randomGradYear = new Date().getFullYear() - Math.floor(Math.random() * 10); // 10 ปีที่ผ่านมา
    
    // สร้างข้อมูลการทำงาน
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomSalary = Math.floor(Math.random() * 50000) + 20000; // เงินเดือน 20,000-70,000
    const randomStartYear = new Date().getFullYear() - Math.floor(Math.random() * 5);
    const randomEndYear = randomStartYear + Math.floor(Math.random() * 3) + 1;
    // สร้างข้อมูลความสามารถ
    const randomSkills = skills.slice(0, Math.floor(Math.random() * 4) + 2).join(', ');
    const randomLanguages = languages.slice(0, Math.floor(Math.random() * 3) + 1).join(', ');
    const randomComputerSkills = computerSkills.slice(0, Math.floor(Math.random() * 4) + 2).join(', ');
    const randomCertificates = certificates.slice(0, Math.floor(Math.random() * 3) + 1).join(', ');
    
    // สร้างข้อมูลการติดต่อฉุกเฉิน
    const randomEmergencyFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomEmergencyLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomEmergencyPhone = `08${Math.floor(Math.random() * 90000000) + 10000000}`;
    const randomEmergencyRelationship = ['บิดา', 'มารดา', 'พี่ชาย', 'น้องชาย', 'พี่สาว', 'น้องสาว', 'สามี', 'ภรรยา'][Math.floor(Math.random() * 8)];
    
    // สร้างข้อมูลการสมัครงาน
    const randomAppliedPosition = positions[Math.floor(Math.random() * positions.length)];
    const randomExpectedSalary = Math.floor(Math.random() * 100000) + 30000; // เงินเดือนที่คาดหวัง 30,000-130,000
    const randomDepartment = departments[Math.floor(Math.random() * departments.length)];
    const randomAvailableDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // ภายใน 30 วัน
    
    // สร้างข้อมูลเอกสาร (เป็น string สำหรับการแสดงผล)
    const randomDocuments = {
      idCard: `idCard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`,
      houseRegistration: `houseRegistration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`,
      militaryCertificate: randomGender === 'ชาย' ? `militaryCertificate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf` : undefined,
      educationCertificate: `educationCertificate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`,
      medicalCertificate: `medicalCertificate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`,
      drivingLicense: `drivingLicense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`,
      nameChangeCertificate: Math.random() > 0.7 ? `nameChangeCertificate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf` : undefined
    } as any; // ใช้ any เพื่อหลีกเลี่ยง type error

    // ฟังก์ชันตรวจสอบว่าช่องว่างหรือไม่
    const isEmpty = (value: any): boolean => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return value.trim() === '';
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    };

    // อัปเดตข้อมูลฟอร์ม - กรอกเฉพาะช่องที่ว่างเท่านั้น
    const newFormData = {
      ...formData,
      // ข้อมูลส่วนตัว - กรอกเฉพาะช่องที่ว่าง
      prefix: isEmpty(formData.prefix) ? randomPrefix : formData.prefix,
      firstName: isEmpty(formData.firstName) ? randomFirstName : formData.firstName,
      lastName: isEmpty(formData.lastName) ? randomLastName : formData.lastName,
      idNumber: isEmpty(formData.idNumber) ? randomIdNumber.toString() : formData.idNumber,
      idCardIssuedAt: isEmpty(formData.idCardIssuedAt) ? 'สำนักงานเขต' : formData.idCardIssuedAt,
      idCardIssueDate: isEmpty(formData.idCardIssueDate) ? '2010-01-01' : formData.idCardIssueDate,
      idCardExpiryDate: isEmpty(formData.idCardExpiryDate) ? '2030-01-01' : formData.idCardExpiryDate,
      birthDate: isEmpty(formData.birthDate) ? randomBirthDate : formData.birthDate,
      age: isEmpty(formData.age) ? randomAge.toString() : formData.age,
      race: isEmpty(formData.race) ? races[Math.floor(Math.random() * races.length)] : formData.race,
      placeOfBirth: isEmpty(formData.placeOfBirth) ? `โรงพยาบาล${randomProvince}` : formData.placeOfBirth,
      placeOfBirthProvince: isEmpty(formData.placeOfBirthProvince) ? randomProvince : formData.placeOfBirthProvince,
      gender: isEmpty(formData.gender) ? randomGender : formData.gender,
      nationality: isEmpty(formData.nationality) ? nationalities[Math.floor(Math.random() * nationalities.length)] : formData.nationality,
      religion: isEmpty(formData.religion) ? religions[Math.floor(Math.random() * religions.length)] : formData.religion,
      maritalStatus: isEmpty(formData.maritalStatus) ? maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)] : formData.maritalStatus,
      addressAccordingToHouseRegistration: isEmpty(formData.addressAccordingToHouseRegistration) ? `${randomHouseNumber} หมู่ ${randomVillageNumber} ซอย ${Math.floor(Math.random() * 99) + 1} ถนน${Math.floor(Math.random() * 99) + 1} ตำบล${randomSubDistrict} อำเภอ${randomDistrict} จังหวัด${randomProvince} ${Math.floor(Math.random() * 90000) + 10000}` : formData.addressAccordingToHouseRegistration,
      currentAddress: isEmpty(formData.currentAddress) ? `${randomHouseNumber + 10} หมู่ ${randomVillageNumber + 1} ซอย ${Math.floor(Math.random() * 99) + 1} ถนน${Math.floor(Math.random() * 99) + 1} ตำบล${randomSubDistrict} อำเภอ${randomDistrict} จังหวัด${randomProvince} ${Math.floor(Math.random() * 90000) + 10000}` : formData.currentAddress,
      phone: isEmpty(formData.phone) ? `08${(Math.floor(Math.random() * 90000000) + 10000000).toString().slice(0, 8)}` : formData.phone,
      email: isEmpty(formData.email) ? `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@example.com` : formData.email,
      emergencyContact: isEmpty(formData.emergencyContact) ? `${randomEmergencyFirstName} ${randomEmergencyLastName}` : formData.emergencyContact,
      emergencyContactFirstName: isEmpty(formData.emergencyContactFirstName) ? randomEmergencyFirstName : formData.emergencyContactFirstName,
      emergencyContactLastName: isEmpty(formData.emergencyContactLastName) ? randomEmergencyLastName : formData.emergencyContactLastName,
      emergencyPhone: isEmpty(formData.emergencyPhone) ? randomEmergencyPhone : formData.emergencyPhone,
      emergencyRelationship: isEmpty(formData.emergencyRelationship) ? randomEmergencyRelationship : formData.emergencyRelationship,
      emergencyAddress: {
        houseNumber: isEmpty(formData.emergencyAddress?.houseNumber) ? (randomHouseNumber + 20).toString() : (formData.emergencyAddress?.houseNumber || ''),
        villageNumber: isEmpty(formData.emergencyAddress?.villageNumber) ? (randomVillageNumber + 2).toString() : (formData.emergencyAddress?.villageNumber || ''),
        alley: isEmpty(formData.emergencyAddress?.alley) ? `ซอย ${Math.floor(Math.random() * 99) + 1}` : (formData.emergencyAddress?.alley || ''),
        road: isEmpty(formData.emergencyAddress?.road) ? `ถนน ${Math.floor(Math.random() * 99) + 1}` : (formData.emergencyAddress?.road || ''),
        subDistrict: isEmpty(formData.emergencyAddress?.subDistrict) ? randomSubDistrict : (formData.emergencyAddress?.subDistrict || ''),
        district: isEmpty(formData.emergencyAddress?.district) ? randomDistrict : (formData.emergencyAddress?.district || ''),
        province: isEmpty(formData.emergencyAddress?.province) ? randomProvince : (formData.emergencyAddress?.province || ''),
        postalCode: isEmpty(formData.emergencyAddress?.postalCode) ? (Math.floor(Math.random() * 90000) + 10000).toString() : (formData.emergencyAddress?.postalCode || ''),
        phone: isEmpty(formData.emergencyAddress?.phone) ? '0' + (Math.floor(Math.random() * 900000000) + 100000000).toString().slice(0, 9) : (formData.emergencyAddress?.phone || '')
      },
      emergencyWorkplace: {
        name: isEmpty(formData.emergencyWorkplace?.name) ? `บริษัท ${randomEmergencyFirstName} จำกัด` : (formData.emergencyWorkplace?.name || ''),
        district: isEmpty(formData.emergencyWorkplace?.district) ? randomDistrict : (formData.emergencyWorkplace?.district || ''),
        province: isEmpty(formData.emergencyWorkplace?.province) ? randomProvince : (formData.emergencyWorkplace?.province || ''),
        phone: isEmpty(formData.emergencyWorkplace?.phone) ? `02${(Math.floor(Math.random() * 90000000) + 10000000).toString().slice(0, 8)}` : (formData.emergencyWorkplace?.phone || '')
      },
      // ข้อมูลการศึกษา - กรอกเฉพาะถ้าไม่มีข้อมูล
      education: isEmpty(formData.education) ? [
        {
          level: 'ปริญญาตรี',
          institution: randomInstitution,
          major: randomMajor,
          year: randomGradYear.toString(),
          gpa: randomGpa
        },
        ...(Math.random() > 0.5 ? [{
          level: 'ปริญญาโท',
          institution: randomInstitution,
          major: randomMajor,
          year: (randomGradYear + 2).toString(),
          gpa: (parseFloat(randomGpa) + 0.2).toFixed(2)
        }] : [])
      ] : formData.education,
      // ข้อมูลการทำงาน - กรอกเฉพาะถ้าไม่มีข้อมูล
      workExperience: isEmpty(formData.workExperience) ? [
        {
          position: randomPosition,
          company: randomCompany,
          startDate: `${randomStartYear}-01-01`,
          endDate: `${randomEndYear}-12-31`,
          salary: randomSalary.toLocaleString(),
          reason: 'ต้องการพัฒนาตนเองและหาประสบการณ์ใหม่'
        },
        ...(Math.random() > 0.3 ? [{
          position: positions[Math.floor(Math.random() * positions.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          startDate: `${randomStartYear - 2}-01-01`,
          endDate: `${randomStartYear - 1}-12-31`,
          salary: (randomSalary - 5000).toLocaleString(),
          reason: 'ต้องการเปลี่ยนงานเพื่อความก้าวหน้า'
        }] : [])
      ] : formData.workExperience,
      previousGovernmentService: isEmpty(formData.previousGovernmentService) ? (Math.random() > 0.7 ? [
        {
          position: 'เจ้าหน้าที่',
          department: 'สำนักงานเขต',
          reason: 'ต้องการทำงานในภาคเอกชน',
          date: '2020-01-01'
        }
      ] : []) : formData.previousGovernmentService,
      skills: isEmpty(formData.skills) ? randomSkills : formData.skills,
      languages: isEmpty(formData.languages) ? randomLanguages : formData.languages,
      computerSkills: isEmpty(formData.computerSkills) ? randomComputerSkills : formData.computerSkills,
      certificates: isEmpty(formData.certificates) ? randomCertificates : formData.certificates,
      references: isEmpty(formData.references) ? `${randomFirstName} ${randomLastName} - ${randomPosition} ที่ ${randomCompany} โทร ${randomEmergencyPhone}` : formData.references,
      appliedPosition: isEmpty(formData.appliedPosition) ? randomAppliedPosition : formData.appliedPosition,
      expectedSalary: isEmpty(formData.expectedSalary) ? randomExpectedSalary.toLocaleString() : formData.expectedSalary,
      availableDate: isEmpty(formData.availableDate) ? randomAvailableDate : formData.availableDate,
      currentWork: formData.currentWork !== undefined ? formData.currentWork : (Math.random() > 0.5),
      department: isEmpty(formData.department) ? randomDepartment : formData.department,
      applicantSignature: isEmpty(formData.applicantSignature) ? `${randomFirstName} ${randomLastName}` : formData.applicantSignature,
      // เอกสาร - ไม่ทับข้อมูลที่มีอยู่
      documents: isEmpty(formData.documents) ? randomDocuments : formData.documents
    };

    // Debug: ตรวจสอบข้อมูล emergency contact
    console.log('🔍 Debug Emergency Contact Data:');
    console.log('emergencyContactFirstName:', newFormData.emergencyContactFirstName);
    console.log('emergencyContactLastName:', newFormData.emergencyContactLastName);
    console.log('emergencyPhone:', newFormData.emergencyPhone);
    console.log('emergencyRelationship:', newFormData.emergencyRelationship);

    // อัปเดตข้อมูลฟอร์ม
    setFormData(newFormData as FormData);

    // ล้าง errors
    setErrors({});
    
    // แสดงข้อความแจ้งเตือน
    console.log('✅ กรอกข้อมูลตัวอย่างเรียบร้อยแล้ว!\n\n📝 กรอกเฉพาะช่องที่ว่างเท่านั้น\n🔒 ข้อมูลที่มีอยู่แล้วจะไม่ถูกทับ');
  };
  // section refs for in-page navigation like official-documents
  const sectionRefs = {
    profile: useRef<HTMLDivElement | null>(null),
    work: useRef<HTMLDivElement | null>(null),
    education: useRef<HTMLDivElement | null>(null),
    extra: useRef<HTMLDivElement | null>(null),
    documents: useRef<HTMLDivElement | null>(null),
  } as const;

  const scrollTo = (key: keyof typeof sectionRefs) => {
    const el = sectionRefs[key].current;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  // รับข้อมูลแผนกจาก URL parameters
  useEffect(() => {
    const departmentRaw = searchParams.get('department');
    const department = (() => {
      try { return departmentRaw ? decodeURIComponent(departmentRaw) : departmentRaw; } catch { return departmentRaw; }
    })();
    const departmentId = searchParams.get('departmentId');
    
    console.log('🔍 Department URL params:', { department, departmentId });
    
    if (department) {
      setFormData(prev => ({
        ...prev,
        department: department,
        departmentId: departmentId || null
      }));
    }
    
    // ดึงข้อมูลแผนกเพิ่มเติมจาก API
    if (departmentId) {
      console.log('🔍 Fetching department data for ID:', departmentId);
      
      const fetchDepartmentData = async () => {
        try {
          const response = await fetch(`/api/departments?id=${departmentId}`);
          console.log('🔍 Department API response status:', response.status);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('🔍 Department API response data:', data);
          
          if (data.department) {
            console.log('🔍 Department data:', data.department);
            console.log('🔍 Positions data:', data.department.positions);
            
            setFormData(prev => {
              const newData = {
                ...prev,
                department: data.department.name,
                appliedPosition: data.department.positions || '', // ดึงเฉพาะ positions ไม่ใช้ department name
                expectedSalary: data.department.salary || ''
              };
              console.log('✅ ตั้งค่า appliedPosition จาก department positions:', data.department.positions);
              console.log('✅ ข้อมูลที่ตั้งค่าใหม่:', newData);
              return newData;
            });
          } else {
            console.log('❌ No department data found in response');
          }
        } catch (error) {
          console.error('❌ Error fetching department details:', error);
          // Retry after 1 second
      setTimeout(() => {
            console.log('🔄 Retrying department data fetch...');
            fetchDepartmentData();
          }, 1000);
        }
      };
      
      fetchDepartmentData();
    } else {
      console.log('❌ No departmentId found, skipping department data fetch');
    }
  }, [searchParams]);
  // ไม่ต้องตั้งค่า flatpickr แล้ว เนื่องจากใช้ ThaiDatePicker component แทน
  // ฟังก์ชันดึงข้อมูลจาก ResumeDeposit
  const fetchProfileData = async () => {
    if (status === 'loading') return;
    
    // ตรวจสอบว่ามี department parameter หรือไม่
    const hasDepartmentParam = searchParams.get('department');
    if (hasDepartmentParam) {
      console.log('🔍 fetchProfileData - Department parameter detected, preserving department data...');
    }
    
    console.log('🔍 fetchProfileData - Starting to fetch profile data from ResumeDeposit...');
    console.log('🔍 fetchProfileData - Session:', session);
    console.log('🔍 fetchProfileData - User:', session?.user);
    
    try {
      // ดึงข้อมูลจาก ResumeDeposit API
      const userEmail = (session?.user as any)?.email || '';
      const userId = (session?.user as any)?.id || '';
      const userLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || '';
      console.log('🔍 fetchProfileData - UserEmail/UserId/LineId:', { userEmail, userId, userLineId });
      const params = new URLSearchParams();
      if (userId) params.set('userId', String(userId));
      if (userLineId) {
        params.set('lineId', String(userLineId));
      } else {
        // ไม่มี lineId ไม่ดึงข้อมูล เพื่อความปลอดภัยตามข้อกำหนด
        setIsLoading(false);
        return;
      }
      const url = `/api/resume-deposit?${params.toString()}`;
      console.log('🔍 fetchProfileData - API URL:', url);
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 fetchProfileData - API Response:', result);
        console.log('🔍 fetchProfileData - Response success:', result.success);
        console.log('🔍 fetchProfileData - Data length:', result.data?.length);
        
        const list = (result?.data || result || []) as any[];
        const filtered = Array.isArray(list)
                ? list.filter((r) => (r?.lineId || '') === userLineId)
          : [];
        
        if (filtered.length > 0) {
          const user = filtered[0]; // Get first resume (should be unique by email)
          
          console.log('Profile data loaded from ResumeDeposit:', user);
          console.log('🔍 fetchProfileData - Resume ID:', user.id);
          
          setProfileData(user);
          setSavedResume(user); // ตั้งค่า savedResume เพื่อให้สามารถใช้ PATCH ได้
          setIsProfileLoaded(true);
            
            // เติมข้อมูลจาก ResumeDeposit ลงใน form
            setFormData(prev => ({
              ...prev,
            prefix: user.prefix || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            idNumber: user.idNumber || '',
            idCardIssuedAt: user.idCardIssuedAt || '',
            idCardIssueDate: user.idCardIssueDate ? new Date(user.idCardIssueDate).toISOString().split('T')[0] : '',
            idCardExpiryDate: user.idCardExpiryDate ? new Date(user.idCardExpiryDate).toISOString().split('T')[0] : '',
            birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
            age: user.age ? String(user.age) : '',
            race: user.race || '',
            placeOfBirth: user.placeOfBirth || '',
            placeOfBirthProvince: user.placeOfBirthProvince || '',
            gender: user.gender === 'MALE' ? 'ชาย' : user.gender === 'FEMALE' ? 'หญิง' : user.gender || '',
            nationality: user.nationality || '',
            religion: user.religion || '',
            maritalStatus: user.maritalStatus === 'SINGLE' ? 'โสด' : 
                          user.maritalStatus === 'MARRIED' ? 'สมรส' : 
                          user.maritalStatus === 'DIVORCED' ? 'หย่า' : 
                          user.maritalStatus === 'WIDOWED' ? 'หม้าย' : user.maritalStatus || '',
            addressAccordingToHouseRegistration: user.address || '',
            currentAddress: user.address || '',
            phone: user.phone || '',
            email: user.email || '',
            emergencyContact: user.emergencyContact || '',
            emergencyContactFirstName: user.emergencyContactFirstName || '',
            emergencyContactLastName: user.emergencyContactLastName || '',
            emergencyPhone: user.emergencyPhone || '',
            emergencyRelationship: user.emergencyRelationship || '',
              emergencyAddress: {
              houseNumber: user.emergency_address_house_number || '',
              villageNumber: user.emergency_address_village_number || '',
              alley: user.emergency_address_alley || '',
              road: user.emergency_address_road || '',
              subDistrict: user.emergency_address_sub_district || '',
              district: user.emergency_address_district || '',
              province: user.emergency_address_province || '',
              postalCode: user.emergency_address_postal_code || '',
              phone: user.emergency_address_phone || '',
              },
              emergencyWorkplace: {
              name: user.emergencyWorkplace?.name || '',
              district: user.emergencyWorkplace?.district || '',
              province: user.emergencyWorkplace?.province || '',
              phone: user.emergencyWorkplace?.phone || '',
            },
            education: user.education?.map((edu: any) => ({
              level: edu.level || '',
              institution: edu.institution || '',
              major: edu.major || '',
              year: edu.endYear?.toString() || edu.year?.toString() || '',
              gpa: edu.gpa?.toString() || ''
            })) || [],
            workExperience: user.workExperience?.map((work: any) => ({
              position: work.position || '',
              company: work.company || '',
              startDate: work.startDate ? new Date(work.startDate).toISOString().slice(0, 10) : '',
              endDate: work.endDate ? new Date(work.endDate).toISOString().slice(0, 10) : '',
              salary: work.salary || '',
              reason: work.description || '',
              district: work.district || '',
              province: work.province || '',
              phone: work.phone || ''
            })) || [],
            skills: user.skills || '',
            languages: user.languages || '',
            computerSkills: user.computerSkills || '',
            certificates: user.certificates || '',
            references: user.references || '',
            appliedPosition: formData.appliedPosition || user.appliedPosition || '',
            expectedSalary: user.expectedSalary || '',
            availableDate: user.availableDate ? new Date(user.availableDate).toISOString().split('T')[0] : '',
            currentWork: user.currentWork || false,
            department: formData.department || user.department || '',
            // ที่อยู่ทะเบียนบ้าน
            registeredAddress: {
              houseNumber: user.house_registration_house_number || '',
              villageNumber: user.house_registration_village_number || '',
              alley: user.house_registration_alley || '',
              road: user.house_registration_road || '',
              subDistrict: user.house_registration_sub_district || '',
              district: user.house_registration_district || '',
              province: user.house_registration_province || '',
              postalCode: user.house_registration_postal_code || '',
              phone: user.house_registration_phone || '',
              mobile: user.house_registration_mobile || ''
            },
            // ที่อยู่ปัจจุบัน
            currentAddressDetail: {
              houseNumber: user.current_address_house_number || '',
              villageNumber: user.current_address_village_number || '',
              alley: user.current_address_alley || '',
              road: user.current_address_road || '',
              subDistrict: user.current_address_sub_district || '',
              district: user.current_address_district || '',
              province: user.current_address_province || '',
              postalCode: user.current_address_postal_code || '',
              homePhone: user.current_address_phone || '',
              mobilePhone: user.current_address_mobile || ''
            },
              spouseInfo: {
              firstName: user.spouse_first_name || '',
              lastName: user.spouse_last_name || '',
              },
              // ข้อมูลสิทธิการรักษา
              medicalRights: {
                hasUniversalHealthcare: user.medical_rights_has_universal_healthcare || false,
                universalHealthcareHospital: user.medical_rights_universal_healthcare_hospital || '',
                hasSocialSecurity: user.medical_rights_has_social_security || false,
                socialSecurityHospital: user.medical_rights_social_security_hospital || '',
                dontWantToChangeHospital: user.medical_rights_dont_want_to_change_hospital || false,
                wantToChangeHospital: user.medical_rights_want_to_change_hospital || false,
                newHospital: user.medical_rights_new_hospital || '',
                hasCivilServantRights: user.medical_rights_has_civil_servant_rights || false,
                otherRights: user.medical_rights_other_rights || ''
              },
              // ข้อมูลนายจ้างหลายราย
              multipleEmployers: user.multiple_employers ? JSON.parse(user.multiple_employers) : [],
              // ข้อมูลสถานที่ทำงานปัจจุบัน
              staffInfo: {
                position: user.staff_position || '',
                department: user.staff_department || '',
                startWork: user.staff_start_work || '',
              }
            }));
            
            // เติมข้อมูลรูปภาพจาก ResumeDeposit
          console.log('🔍 fetchProfileData - Resume data:', user);
          console.log('🔍 fetchProfileData - Resume profileImageUrl:', user.profileImageUrl);
          console.log('🔍 fetchProfileData - Resume ID:', user.id);
          console.log('🔍 fetchProfileData - Current profileImage state:', profileImage);
          
          // ตรวจสอบว่ามี department parameter หรือไม่
          if (hasDepartmentParam) {
            console.log('🔍 fetchProfileData - Department parameter detected, preserving department and appliedPosition data...');
            console.log('🔍 fetchProfileData - Current formData.department:', formData.department);
            console.log('🔍 fetchProfileData - Current formData.appliedPosition:', formData.appliedPosition);
          }
          
          if (user.profileImageUrl) {
            console.log('✅ fetchProfileData - Using profileImageUrl:', user.profileImageUrl);
            // ใช้ path แบบเดียวกับ profile page
            const imagePath = `/api/image?file=${user.profileImageUrl}`;
            console.log('✅ Using API path for profile image:', imagePath);
            console.log('🔍 fetchProfileData - Setting profile image after refresh:', imagePath);
            setProfileImage(imagePath);
            
            // อัปเดต formData.profileImage ด้วย
            setFormData(prev => ({
              ...prev,
              profileImage: new File([], user.profileImageUrl, { type: 'image/jpeg' }),
              // ป้องกันไม่ให้ override ข้อมูล department เมื่อมี parameter
              ...(hasDepartmentParam ? {
                department: prev.department,
                appliedPosition: prev.appliedPosition,
                expectedSalary: prev.expectedSalary
              } : {})
            }));
          } else if (user.id) {
            // Try to find image by ID - ลองหา .jpg ก่อน เพราะมีมากกว่า .png
            try {
              const jpgPath = `/api/image?file=profile_${user.id}.jpg`;
              console.log('🔍 fetchProfileData - Trying JPG path:', jpgPath);
              const jpgResponse = await fetch(jpgPath);
              if (jpgResponse.ok) {
                console.log('✅ fetchProfileData - Found JPG image:', jpgPath);
                setProfileImage(jpgPath);
                // อัปเดต formData.profileImage ด้วย
                setFormData(prev => ({
                  ...prev,
                  profileImage: new File([], `profile_${user.id}.jpg`, { type: 'image/jpeg' }),
                  // ป้องกันไม่ให้ override ข้อมูล department เมื่อมี parameter
                  ...(hasDepartmentParam ? {
                    department: prev.department,
                    appliedPosition: prev.appliedPosition,
                    expectedSalary: prev.expectedSalary
                  } : {})
                }));
              } else {
                const pngPath = `/api/image?file=profile_${user.id}.png`;
                console.log('🔍 fetchProfileData - Trying PNG path:', pngPath);
                const pngResponse = await fetch(pngPath);
                if (pngResponse.ok) {
                  console.log('✅ fetchProfileData - Found PNG image:', pngPath);
                  setProfileImage(pngPath);
                  // อัปเดต formData.profileImage ด้วย
                  setFormData(prev => ({
                    ...prev,
                    profileImage: new File([], `profile_${user.id}.png`, { type: 'image/png' }),
                    // ป้องกันไม่ให้ override ข้อมูล department เมื่อมี parameter
                    ...(hasDepartmentParam ? {
                      department: prev.department,
                      appliedPosition: prev.appliedPosition,
                      expectedSalary: prev.expectedSalary
                    } : {})
                  }));
                } else {
                  console.log('❌ fetchProfileData - No image found for ID:', user.id);
                }
              }
            } catch (error) {
              console.log('❌ fetchProfileData - Error finding image:', error);
            }
          }
          
          // ไม่ต้องเรียก loadProfileData เพราะได้เติมข้อมูลลงในฟอร์มแล้ว
          console.log('🔍 fetchProfileData - Resume data loaded and form filled');
          
          // ตรวจสอบว่ามี department parameter หรือไม่ และป้องกันไม่ให้ override
          if (hasDepartmentParam) {
            console.log('🔍 fetchProfileData - Department parameter detected, preserving department data...');
            console.log('🔍 fetchProfileData - Final formData.department:', formData.department);
            console.log('🔍 fetchProfileData - Final formData.appliedPosition:', formData.appliedPosition);
          }
        } else {
          console.log('🔍 fetchProfileData - No resume data found');
          console.log('🔍 fetchProfileData - Result:', result);
          
          // ตรวจสอบว่ามี department parameter หรือไม่ และป้องกันไม่ให้ override
          if (hasDepartmentParam) {
            console.log('🔍 fetchProfileData - Department parameter detected, preserving department data...');
            console.log('🔍 fetchProfileData - Final formData.department:', formData.department);
            console.log('🔍 fetchProfileData - Final formData.appliedPosition:', formData.appliedPosition);
          }
        }
      } else {
        console.log('🔍 fetchProfileData - API response not ok:', response.status, response.statusText);
        
        // ตรวจสอบว่ามี department parameter หรือไม่ และป้องกันไม่ให้ override
        if (hasDepartmentParam) {
          console.log('🔍 fetchProfileData - Department parameter detected, preserving department data...');
          console.log('🔍 fetchProfileData - Final formData.department:', formData.department);
          console.log('🔍 fetchProfileData - Final formData.appliedPosition:', formData.appliedPosition);
        }
      }
    } catch (error) {
      console.error('Error fetching resume data:', error);
      
      // ตรวจสอบว่ามี department parameter หรือไม่ และป้องกันไม่ให้ override
      if (hasDepartmentParam) {
        console.log('🔍 fetchProfileData - Department parameter detected, preserving department data...');
        console.log('🔍 fetchProfileData - Final formData.department:', formData.department);
        console.log('🔍 fetchProfileData - Final formData.appliedPosition:', formData.appliedPosition);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</div>
            </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // ฟังก์ชันดึงข้อมูลฝากประวัติตาม resumeId
  const loadResumeById = async (id: string) => {
    console.log('🔄 ดึงข้อมูลฝากประวัติตาม ID:', id);
    console.log('🔍 โหมด: ดึงข้อมูลจากฝากประวัติ (ResumeDeposit)');
    setIsLoading(true);
    
    try {
      // ดึงรายละเอียดข้อมูลฝากประวัติตาม ID
      const res = await fetch(`/api/resume-deposit/${id}`);
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const resumeData = json?.data || json;
        
        if (resumeData) {
          console.log('✅ พบข้อมูลฝากประวัติ:', {
            id: resumeData.id,
            name: `${resumeData.firstName} ${resumeData.lastName}`,
            email: resumeData.email,
            profileImageUrl: resumeData.profileImageUrl
          });
          
          // นำข้อมูลมาแสดงในฟอร์ม
          setSavedResume(resumeData);
          applyResumeToFormInputs(resumeData);
          
          // ตั้งค่า department จาก URL parameter (ถ้ามี)
          if (departmentName) {
            setFormData(prev => ({
              ...prev,
              department: departmentName,
              appliedPosition: '' // ไม่ตั้งค่า appliedPosition จาก departmentName
            }));
            console.log('✅ ตั้งค่า department จาก URL parameter:', departmentName);
          }
          
          // โหลดรูปภาพโปรไฟล์
          if (resumeData.profileImageUrl) {
            console.log('🔍 โหลดรูปภาพโปรไฟล์:', resumeData.profileImageUrl);
            const imagePath = `/api/image?file=${resumeData.profileImageUrl}`;
            console.log('🔍 loadResumeByDepartment - Setting profile image after refresh:', imagePath);
            setProfileImage(imagePath);
            console.log('✅ โหลดรูปภาพโปรไฟล์สำเร็จ');
          }
          
          // โหลดเอกสารแนบ
          console.log('🔍 โหลดข้อมูลเอกสารแนบ...');
          try {
            const documents = await fetchUploadedDocuments(resumeData.id);
            setUploadedDocuments(documents);
            console.log('✅ โหลดข้อมูลเอกสารแนบสำเร็จ:', documents.length, 'ไฟล์');
          } catch (error) {
            console.error('❌ เกิดข้อผิดพลาดในการโหลดเอกสารแนบ:', error);
          }
          
          console.log('✅ ดึงข้อมูลฝากประวัติตาม ID สำเร็จ');
          if (departmentName) {
            console.log('✅ ตั้งค่า department:', departmentName);
          }
          // ไม่แสดง alert สำหรับ resumeId เพื่อให้ UX ดีขึ้น
        } else {
          console.log('❌ ไม่พบข้อมูลฝากประวัติสำหรับ ID นี้');
          // ไม่แสดง alert เพื่อให้ UX ดีขึ้น
        }
      } else {
        console.log('❌ ไม่สามารถดึงข้อมูลฝากประวัติได้:', res.status);
        // ไม่แสดง alert เพื่อให้ UX ดีขึ้น
      }
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลฝากประวัติ:', error);
      // ไม่แสดง alert เพื่อให้ UX ดีขึ้น
    } finally {
      setIsLoading(false);
    }
  };
  // ฟังก์ชันโหลดข้อมูลฝากประวัติตาม department (ใช้เฉพาะ lineId)
  const loadResumeByDepartment = async () => {
    console.log('🔄 loadResumeByDepartment เริ่มทำงาน');
    console.log('🔍 status:', status);
    console.log('🔍 departmentName:', departmentName);
    console.log('🔍 departmentId:', departmentId);
    
    if (status !== 'authenticated') {
      console.log('❌ ไม่ได้ authenticate');
      return;
    }
    
    console.log('🔄 ดึงข้อมูลฝากประวัติสำหรับ department:', departmentName);
    setIsLoading(true);
    
    try {
      // ดึงข้อมูลผู้ใช้จาก session
      const user = session?.user as any;
      const userId = user?.id || '';
      const userLineId = user?.lineId || user?.sub || (session as any)?.profile?.userId || '';
      
      console.log('🔍 ข้อมูลผู้ใช้:', {
        userId: userId,
        lineId: userLineId,
        departmentName: departmentName,
        departmentId: departmentId
      });
      
      if (!userLineId) {
        console.log('❌ ไม่มี lineId ใน session - ไม่สามารถดึงข้อมูลได้');
        setIsLoading(false);
        return;
      }
      
      // ดึงข้อมูลฝากประวัติตาม session (ใช้ lineId และ userId เท่านั้น)
      console.log('🔍 เรียก API: /api/resume-deposit');
      const params = new URLSearchParams();
      if (userId) params.set('userId', String(userId));
      if (userLineId) params.set('lineId', String(userLineId));
      const url = `/api/resume-deposit?${params.toString()}`;
      console.log('🔍 API URL:', url);
      const res = await fetch(url);
      console.log('🔍 API Response status:', res.status);
      
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        console.log('🔍 API Response data:', json);
        const list = (json?.data || json || []) as any[];
        console.log('🔍 ข้อมูลที่ได้รับ:', list.length, 'รายการ');
        console.log('🔍 ตัวอย่างข้อมูล:', list.slice(0, 2).map(r => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          department: r.department,
          appliedPosition: r.appliedPosition
        })));
        
        let found = null;
        
        // วิธีที่ 1: ค้นหาตาม departmentId (ถ้ามี) - departmentId อาจเป็น resumeId
        if (departmentId) {
          const idMatch = list.find(r => r.id === departmentId);
          if (idMatch) {
            found = idMatch;
            console.log('✅ พบข้อมูลตาม departmentId (resumeId):', found.id);
          }
        }
        
        // วิธีที่ 2: ค้นหาตาม departmentName เป็น resumeId (ถ้าไม่มี departmentId)
        if (!found && departmentName) {
          const idMatch = list.find(r => r.id === departmentName);
          if (idMatch) {
            found = idMatch;
            console.log('✅ พบข้อมูลตาม departmentName (resumeId):', found.id);
          }
        }
        
        // วิธีที่ 3: ค้นหาตาม userId
        if (!found && userId) {
          const userIdMatch = list.find(r => r?.userId === userId);
          if (userIdMatch) {
            found = userIdMatch;
            console.log('✅ พบข้อมูลตาม userId:', found.id);
          }
        }
        
        // วิธีที่ 4: ค้นหาตาม lineId (จำเป็นต้องตรงเท่านั้น)
        if (!found && userLineId) {
          const lineIdMatch = list.find(r => (r?.lineId || '') === userLineId);
          if (lineIdMatch) {
            found = lineIdMatch;
            console.log('✅ พบข้อมูลตาม lineId:', found.id);
          } else {
            // หาก lineId ไม่ตรง ให้ถือว่าไม่พบข้อมูล
            console.log('❌ lineId ไม่ตรงกับผู้ใช้ที่ล็อกอิน');
          }
        }
        
        // วิธีที่ 5: ค้นหาตามอีเมล
        if (!found && userEmail) {
          const emailMatch = list.find(r => 
            (r?.email || '').toLowerCase() === userEmail.toLowerCase()
          );
          if (emailMatch) {
            found = emailMatch;
            console.log('✅ พบข้อมูลตามอีเมล:', found.id);
          }
        }
        
        // วิธีที่ 6: ค้นหาตามชื่อและนามสกุล
        if (!found && firstName && lastName) {
          const nameMatch = list.find(r => {
            const rFirstName = (r?.firstName || '').trim();
            const rLastName = (r?.lastName || '').trim();
            return rFirstName.toLowerCase() === firstName.toLowerCase() && 
                   rLastName.toLowerCase() === lastName.toLowerCase();
          });
          if (nameMatch) {
            found = nameMatch;
            console.log('✅ พบข้อมูลตามชื่อและนามสกุล:', found.id);
          }
        }
        
        // วิธีที่ 7: ค้นหาตามชื่อเท่านั้น
        if (!found && firstName) {
          const firstNameMatch = list.find(r => {
            const rFirstName = (r?.firstName || '').trim();
            return rFirstName.toLowerCase() === firstName.toLowerCase();
          });
          if (firstNameMatch) {
            found = firstNameMatch;
            console.log('✅ พบข้อมูลตามชื่อเท่านั้น:', found.id);
          }
        }
        
        // วิธีที่ 8: ค้นหาตาม department ในข้อมูล (ปรับปรุงให้ค้นหาได้ดีขึ้น)
        if (!found && departmentName) {
          const deptMatch = list.find(r => {
            const rDept = (r?.department || '').toLowerCase().trim();
            const rAppliedPos = (r?.appliedPosition || '').toLowerCase().trim();
            const searchDept = departmentName.toLowerCase().trim();
            
            return rDept === searchDept || 
                   rAppliedPos === searchDept ||
                   rDept.includes(searchDept) ||
                   rAppliedPos.includes(searchDept) ||
                   searchDept.includes(rDept) ||
                   searchDept.includes(rAppliedPos);
          });
          if (deptMatch) {
            found = deptMatch;
            console.log('✅ พบข้อมูลตาม department:', found.id, 'department:', found.department, 'appliedPosition:', found.appliedPosition);
          }
        }
        // วิธีที่ 9: ค้นหาตามเบอร์โทร (ถ้ามี)
        if (!found && userEmail) {
          // ลองดึงเบอร์โทรจากอีเมล (ถ้าเป็นรูปแบบ phone@domain.com)
          const phoneFromEmail = userEmail.split('@')[0];
          if (phoneFromEmail && phoneFromEmail.length >= 10) {
            const phoneMatch = list.find(r => 
              (r?.phone || '').includes(phoneFromEmail) ||
              (r?.phone || '').replace(/[-\s]/g, '') === phoneFromEmail.replace(/[-\s]/g, '')
            );
            if (phoneMatch) {
              found = phoneMatch;
              console.log('✅ พบข้อมูลตามเบอร์โทร:', found.id);
            }
          }
        }
          
        if (found) {
          console.log('✅ พบข้อมูลฝากประวัติ:', {
            id: found.id,
            name: `${found.firstName} ${found.lastName}`,
            email: found.email,
            phone: found.phone,
            department: found.department
          });
          
          // นำข้อมูลมาแสดงในฟอร์ม
          setSavedResume(found);
          applyResumeToFormInputs(found);
          
          // ตั้งค่า department จาก URL parameter
          if (departmentName) {
            setFormData(prev => ({
              ...prev,
              department: departmentName,
              appliedPosition: '', // ไม่ตั้งค่า appliedPosition จาก departmentName
              departmentId: departmentId || null
            }));
            console.log('✅ ตั้งค่า department จาก URL parameter:', departmentName);
          }
          
          // โหลดรูปภาพโปรไฟล์
          if (found.profileImageUrl) {
            console.log('🔍 โหลดรูปภาพโปรไฟล์:', found.profileImageUrl);
            const imagePath = `/api/image?file=${found.profileImageUrl}`;
            setProfileImage(imagePath);
            console.log('✅ โหลดรูปภาพโปรไฟล์สำเร็จ');
          }
          
          // โหลดเอกสารแนบ
          console.log('🔍 โหลดข้อมูลเอกสารแนบ...');
          try {
            const documents = await fetchUploadedDocuments(found.id);
            setUploadedDocuments(documents);
            console.log('✅ โหลดข้อมูลเอกสารแนบสำเร็จ:', documents.length, 'ไฟล์');
          } catch (error) {
            console.error('❌ เกิดข้อผิดพลาดในการโหลดเอกสารแนบ:', error);
          }
          
          console.log('✅ ดึงข้อมูลฝากประวัติสำหรับ department สำเร็จ');
          // alert(`โหลดข้อมูลฝากประวัติของ ${found.firstName} ${found.lastName} เรียบร้อยแล้ว`);
        } else {
          console.log('ℹ️ ไม่พบข้อมูลฝากประวัติสำหรับผู้ใช้ปัจจุบัน');
          console.log('🔍 ข้อมูลที่ค้นหา:', {
            departmentName,
            departmentId,
            userEmail,
            firstName,
            lastName
          });
          console.log('🔍 ข้อมูลที่มีในระบบ:', list.map(r => ({
            id: r.id,
            firstName: r.firstName,
            lastName: r.lastName,
            email: r.email,
            department: r.department,
            appliedPosition: r.appliedPosition
          })));
          
          // ตั้งค่า department จาก URL parameter แม้ว่าจะไม่มีข้อมูลฝากประวัติ
          if (departmentName) {
            setFormData(prev => ({
              ...prev,
              department: departmentName,
              appliedPosition: '', // ไม่ตั้งค่า appliedPosition จาก departmentName
              departmentId: departmentId || null
            }));
            console.log('✅ ตั้งค่า department จาก URL parameter:', departmentName);
          }
          // ไม่แสดง alert เพราะอาจเป็นผู้ใช้ใหม่ที่ยังไม่เคยฝากประวัติ
        }
      } else {
        console.log('❌ ไม่สามารถดึงข้อมูลฝากประวัติได้:', res.status);
        console.error('❌ ไม่สามารถดึงข้อมูลฝากประวัติได้');
      }
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลฝากประวัติ:', error);
      console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลฝากประวัติ');
    } finally {
      setIsLoading(false);
    }
  };
  // ฟังก์ชันรีเฟรชข้อมูลฝากประวัติ
  const refreshResumeData = async () => {
    console.log('🔄 รีเฟรชข้อมูลฝากประวัติ...');
    setIsLoading(true);
    
    try {
      const userId = (session?.user as any)?.id || '';
      const userLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || '';
      
      if (!userLineId) {
        console.log('❌ ไม่มี lineId ใน session - ไม่สามารถดึงข้อมูลได้');
        setIsLoading(false);
        return;
      }

      // ค้นหาข้อมูลฝากประวัติล่าสุด (ใช้ lineId และ userId เท่านั้น)
      const params = new URLSearchParams();
      if (userId) params.set('userId', String(userId));
      if (userLineId) params.set('lineId', String(userLineId));
      const url = `/api/resume-deposit?${params.toString()}`;
      console.log('🔎 refreshResumeData - URL:', url);
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const list = (json?.data || json || []) as any[];
        const filtered = Array.isArray(list)
          ? list.filter((r) => (r?.lineId || '') === userLineId)
          : [];
          
        if (filtered.length > 0) {
          // เรียงลำดับตามวันที่อัปเดตล่าสุด
          filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
          const found = filtered[0];
          
          // ดึงรายละเอียดข้อมูล
          const detail = await fetch(`/api/resume-deposit/${found.id}`);
          if (detail.ok) {
            const dj = await detail.json().catch(() => ({}));
            const resumeData = dj?.data || dj || found;
            
            // นำข้อมูลมาแสดงในฟอร์ม
            setSavedResume(resumeData);
            applyResumeToFormInputs(resumeData);
            
            // โหลดรูปภาพโปรไฟล์
            if (resumeData.profileImageUrl) {
              const imagePath = `/api/image?file=${resumeData.profileImageUrl}`;
              setProfileImage(imagePath);
            }
            
            // โหลดเอกสารแนบ
            const documents = await fetchUploadedDocuments(resumeData.id);
            setUploadedDocuments(documents);
            
            console.log('✅ รีเฟรชข้อมูลฝากประวัติสำเร็จ');
            console.log('✅ รีเฟรชข้อมูลฝากประวัติเรียบร้อยแล้ว');
          } else {
            console.log('❌ ไม่สามารถดึงรายละเอียดข้อมูลได้');
            console.error('❌ ไม่สามารถดึงรายละเอียดข้อมูลได้');
          }
        } else {
          console.log('❌ ไม่พบข้อมูลฝากประวัติ');
          console.log('⚠️ ไม่พบข้อมูลฝากประวัติ');
        }
      } else {
        console.log('❌ ไม่สามารถเชื่อมต่อ API ได้');
        console.error('❌ ไม่สามารถเชื่อมต่อ API ได้');
      }
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการรีเฟรชข้อมูล:', error);
      console.error('❌ เกิดข้อผิดพลาดในการรีเฟรชข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันโหลดข้อมูลจาก profile มาใส่ในฟอร์ม
  const loadProfileData = () => {
    if (!profileData) return;
    
    setFormData(prev => ({
      ...prev,
      prefix: profileData.prefix || '',
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      gender: profileData.gender || '',
      birthDate: profileData.birthDate || '',
      nationality: profileData.nationality || '',
      religion: profileData.religion || '',
      maritalStatus: profileData.maritalStatus || '',
      addressAccordingToHouseRegistration: profileData.address || '',
      currentAddress: profileData.address || '',
      phone: profileData.phone || '',
      email: profileData.email || '',
      emergencyContact: profileData.emergencyContact || '',
      emergencyContactFirstName: profileData.emergencyContactFirstName || '',
      emergencyContactLastName: profileData.emergencyContactLastName || '',
      emergencyPhone: profileData.emergencyPhone || '',
      // Education
      education: profileData.educationList?.map((edu: any) => ({
        level: edu.level || '',
        institution: edu.school || '',
        major: edu.major || '',
        year: edu.endYear || '',
        gpa: edu.gpa || ''
      })) || [],
      // Work Experience
      workExperience: profileData.workList?.map((work: any) => ({
        position: work.position || '',
        company: work.company || '',
        startDate: work.startDate || '',
        endDate: work.endDate || '',
        salary: work.salary || '',
        reason: work.description || '',
        district: work.district || '',
        province: work.province || '',
        phone: work.phone || ''
      })) || []
    }));

    // ดึงรูปภาพโปรไฟล์
    console.log('🔍 loadProfileData - ProfileData:', profileData);
    console.log('🔍 loadProfileData - ProfileData ID:', profileData.id);
    
    if (profileData.id) {
      const apiJpgPath = `/api/image?file=profile_${profileData.id}.jpg`;
      const apiPngPath = `/api/image?file=profile_${profileData.id}.png`;
      
      console.log('🔍 loadProfileData - Trying API JPG path:', apiJpgPath);
      // ลองหาไฟล์ JPG ก่อน
      fetch(apiJpgPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log('✅ loadProfileData - Found API JPG image:', apiJpgPath);
            setProfileImage(apiJpgPath);
            // อัปเดต formData.profileImage ด้วย
            setFormData(prev => ({
              ...prev,
              profileImage: new File([], `profile_${profileData.id}.jpg`, { type: 'image/jpeg' })
            }));
          } else {
            console.log('🔍 loadProfileData - Trying API PNG path:', apiPngPath);
            // ลองหาไฟล์ PNG
            return fetch(apiPngPath, { method: 'HEAD' });
          }
        })
        .then(response => {
          if (response && response.ok) {
            console.log('✅ loadProfileData - Found API PNG image:', apiPngPath);
            setProfileImage(apiPngPath);
            // อัปเดต formData.profileImage ด้วย
            setFormData(prev => ({
              ...prev,
              profileImage: new File([], `profile_${profileData.id}.png`, { type: 'image/png' })
            }));
          } else {
            console.log('❌ loadProfileData - No image found for ID:', profileData.id);
          }
        })
        .catch(error => {
          console.log('❌ loadProfileData - Error finding image:', error);
        });
    }

    console.log('✅ โหลดข้อมูลจากโปรไฟล์เรียบร้อยแล้ว');
  };

  const getErrorMessage = (fieldName: string) => {
    return errors[fieldName] || '';
  };

  const hasError = (fieldName: string) => {
    return !!errors[fieldName];
  };
  const scrollToError = (errorKey: string) => {
    console.log('🔍 scrollToError - Looking for error key:', errorKey);
    
    // Map error keys ไปยัง section refs
    let targetSection: keyof typeof sectionRefs | null = null;
    
    if (['prefix', 'firstName', 'lastName', 'age', 'birthDate', 'placeOfBirth', 'placeOfBirthProvince', 'race', 'nationality', 'religion', 'gender', 'maritalStatus'].includes(errorKey)) {
      targetSection = 'profile';
    } else if (['idNumber', 'idCardIssuedAt', 'idCardIssueDate', 'idCardExpiryDate'].includes(errorKey)) {
      targetSection = 'profile';
    } else if (errorKey.startsWith('registeredAddress') || errorKey.startsWith('currentAddress')) {
      targetSection = 'profile';
    } else if (errorKey.startsWith('emergency') || errorKey === 'emergencyContact' || errorKey === 'emergencyRelationship' || errorKey === 'emergencyPhone') {
      targetSection = 'profile';
    } else if (['appliedPosition', 'expectedSalary', 'availableDate', 'department'].includes(errorKey)) {
      targetSection = 'profile';
    } else if (['skills', 'languages', 'computerSkills', 'certificates', 'references'].includes(errorKey)) {
      targetSection = 'extra';
    } else if (['education', 'workExperience'].includes(errorKey)) {
      targetSection = 'education';
    } else if (['documents'].includes(errorKey)) {
      targetSection = 'documents';
    }
    
    console.log('🔍 scrollToError - Target section:', targetSection);
    
    if (targetSection) {
      // Scroll ไปยัง section ก่อน
      setTimeout(() => {
        scrollTo(targetSection!);
        
        // ค้นหาฟิลด์ที่มี error โดยตรง
        setTimeout(() => {
          let errorField = null;
          
          // 1. ค้นหาด้วย name attribute
          errorField = document.querySelector(`[name="${errorKey}"]`);
          console.log('🔍 scrollToError - Found by name:', !!errorField);
          
          // 2. ค้นหาด้วย data-error-key attribute
          if (!errorField) {
            errorField = document.querySelector(`[data-error-key="${errorKey}"]`);
            console.log('🔍 scrollToError - Found by data-error-key:', !!errorField);
          }
          
          // 3. ค้นหาด้วย id attribute
          if (!errorField) {
            errorField = document.querySelector(`#${errorKey}`);
            console.log('🔍 scrollToError - Found by id:', !!errorField);
          }
          
          // 4. ค้นหาด้วย label text ที่เกี่ยวข้อง
          if (!errorField) {
            const labels = document.querySelectorAll('label');
            for (const label of labels) {
              const labelText = label.textContent?.toLowerCase() || '';
              const errorKeyLower = errorKey.toLowerCase();
              
              // ค้นหาด้วยคำสำคัญ
              if (labelText.includes('ชื่อ') && errorKeyLower.includes('firstname')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('นามสกุล') && errorKeyLower.includes('lastname')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('อายุ') && errorKeyLower.includes('age')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('วันเกิด') && errorKeyLower.includes('birthdate')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('บัตรประชาชน') && errorKeyLower.includes('idnumber')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('หมู่ที่') && errorKeyLower.includes('villagenumber')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('ตรอก') && errorKeyLower.includes('alley')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('ถนน') && errorKeyLower.includes('road')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('ตำบล') && errorKeyLower.includes('subdistrict')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('อำเภอ') && errorKeyLower.includes('district')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('จังหวัด') && errorKeyLower.includes('province')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('รหัสไปรษณีย์') && errorKeyLower.includes('postalcode')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('โทรศัพท์') && errorKeyLower.includes('phone')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              } else if (labelText.includes('อีเมล') && errorKeyLower.includes('email')) {
                errorField = label.querySelector('input, select, textarea');
                if (errorField) break;
              }
            }
            console.log('🔍 scrollToError - Found by label text:', !!errorField);
          }
          
          // 5. ค้นหาด้วย error message ที่แสดงอยู่
          if (!errorField) {
            const errorMessages = document.querySelectorAll('.text-red-500, .text-red-600');
            for (const errorMsg of errorMessages) {
              if (errorMsg.textContent?.includes(getErrorMessage(errorKey))) {
                // หา input ที่ใกล้ที่สุด
                const closestInput = errorMsg.closest('div')?.querySelector('input, select, textarea');
                if (closestInput) {
                  errorField = closestInput;
                  break;
                }
              }
            }
            console.log('🔍 scrollToError - Found by error message:', !!errorField);
          }
          
          if (errorField) {
            console.log('🔍 scrollToError - Found error field:', errorField);
            
            // Scroll ไปยัง error field
            errorField.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
            
            // เพิ่ม focus และ highlight effect
            if (errorField instanceof HTMLElement) {
              // ถ้าเป็น input, select, textarea ให้ focus
              if (errorField.tagName === 'INPUT' || errorField.tagName === 'SELECT' || errorField.tagName === 'TEXTAREA') {
              errorField.focus();
              }
              
              // เพิ่ม highlight effect
              errorField.classList.add('animate-pulse', 'ring-2', 'ring-red-500');
              setTimeout(() => {
                errorField.classList.remove('animate-pulse', 'ring-2', 'ring-red-500');
              }, 3000);
              
              // ถ้าเป็น error message ให้ highlight parent element
              if (errorField.classList.contains('text-red-500') || errorField.classList.contains('text-red-600')) {
                const parentDiv = errorField.closest('div');
                if (parentDiv) {
                  parentDiv.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'bg-red-50');
                  setTimeout(() => {
                    parentDiv.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'bg-red-50');
                  }, 3000);
                }
              }
            }
          } else {
            console.log('❌ scrollToError - Could not find error field for:', errorKey);
          }
        }, 500);
      }, 200);
    }
  };

  const handleInputChange = (key: string, value: string | boolean | File | File[]) => {
    // ป้องกันไม่ให้แก้ไข department เมื่อมี department จาก URL parameter
    if (key === 'department' && searchParams.get('department')) {
      console.log('🚫 Department cannot be changed when selected from Dashboard');
      return;
    }
    
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }

    // อัปเดต form data ก่อน
    if (key.includes('.')) {
      // Handle nested objects like spouseInfo.firstName
      const [parentKey, childKey] = key.split('.');
      setFormData(prev => ({
        ...prev,
        [parentKey]: {
          ...(prev[parentKey as keyof FormData] as any),
          [childKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [key]: value
      }));
    }

    // ล้าง error หลังจากอัปเดต form data
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
    
    // ล้าง error สำหรับ nested fields
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      const nestedKey = `${parentKey}${childKey.charAt(0).toUpperCase() + childKey.slice(1)}`;
      if (errors[nestedKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[nestedKey];
          return newErrors;
        });
      }
    }
    // ล้าง error สำหรับ documents fields
    if (key.startsWith('documents.')) {
      const docType = key.split('.')[1];
      const errorKey = `documents${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
      if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
      }
    }
  };

  // ฟังก์ชันป้องกันการกรอกตัวเลข (เฉพาะตัวอักษรภาษาไทย อังกฤษ และช่องว่าง)
  const handleTextOnlyChange = (key: string, value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // ลบตัวเลขออกจาก value
    const textOnly = value.replace(/[0-9]/g, '');
    handleInputChange(key, textOnly);
  };

  // ฟังก์ชันป้องกันการกรอกตัวอักษร (เฉพาะตัวเลข)
  const handleNumberOnlyChange = (key: string, value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // ลบตัวอักษรออกจาก value เหลือเฉพาะตัวเลข
    const numberOnly = value.replace(/[^0-9]/g, '');
    handleInputChange(key, numberOnly);
  };

  // ฟังก์ชันสำหรับหมู่ที่ (อนุญาตตัวเลขและ -)
  const handleVillageNumberChange = (key: string, value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // อนุญาตเฉพาะตัวเลขและ - เท่านั้น
    const allowedValue = value.replace(/[^0-9-]/g, '');
    handleInputChange(key, allowedValue);
  };

  // ฟังก์ชันสำหรับเลขบัตรประชาชน (จำกัด 13 หลัก)
  const handleIdNumberChange = (value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // ลบตัวอักษรออกจาก value เหลือเฉพาะตัวเลข
    const numberOnly = value.replace(/[^0-9]/g, '');
    // จำกัดความยาวไม่เกิน 13 หลัก
    const limitedValue = numberOnly.slice(0, 13);
    handleInputChange('idNumber', limitedValue);
  };

  // ฟังก์ชันสำหรับรหัสไปรษณีย์ (จำกัด 5 หลัก)
  const handlePostalCodeChange = (key: string, value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // ลบตัวอักษรออกจาก value เหลือเฉพาะตัวเลข
    const numberOnly = value.replace(/[^0-9]/g, '');
    // จำกัดความยาวไม่เกิน 5 หลัก
    const limitedValue = numberOnly.slice(0, 5);
    handleInputChange(key, limitedValue);
  };

  // ฟังก์ชันสำหรับเกรดเฉลี่ย (ทศนิยม 2 ตำแหน่ง)
  const handleGpaChange = (value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // ลบตัวอักษรออกจาก value เหลือเฉพาะตัวเลขและจุด
    const numberOnly = value.replace(/[^0-9.]/g, '');
    
    // ตรวจสอบว่ามีจุดมากกว่า 1 จุดหรือไม่
    const dotCount = (numberOnly.match(/\./g) || []).length;
    if (dotCount > 1) {
      // ถ้ามีจุดมากกว่า 1 จุด ให้เก็บแค่จุดแรก
      const firstDotIndex = numberOnly.indexOf('.');
      const beforeDot = numberOnly.substring(0, firstDotIndex);
      const afterDot = numberOnly.substring(firstDotIndex + 1).replace(/\./g, '');
      const limitedValue = beforeDot + '.' + afterDot;
      
      // จำกัดทศนิยม 2 ตำแหน่ง
      const parts = limitedValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        return beforeDot + '.' + parts[1].slice(0, 2);
      }
      return limitedValue;
    }
    
    // จำกัดทศนิยม 2 ตำแหน่ง
    const parts = numberOnly.split('.');
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return numberOnly;
  };

  // ฟังก์ชันสำหรับปีที่จบ (จำกัด 4 หลัก)
  const handleYearChange = (value: string) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    // ลบตัวอักษรออกจาก value เหลือเฉพาะตัวเลข
    const numberOnly = value.replace(/[^0-9]/g, '');
    // จำกัดความยาวไม่เกิน 4 หลัก
    const limitedValue = numberOnly.slice(0, 4);
    
    // ถ้าปีที่กรอกน้อยกว่า 2500 (ปี พ.ศ.) ให้บวก 543
    if (limitedValue && parseInt(limitedValue) < 2500 && parseInt(limitedValue) > 1900) {
      const thaiYear = parseInt(limitedValue) + 543;
      return thaiYear.toString();
    }
    
    return limitedValue;
  };

  // แปลงค่าที่เป็น '-' ให้เป็นค่าว่างก่อนส่งบันทึก
  const normalizeDash = (v?: string | null) => {
    if (v == null) return null;
    const t = String(v).trim();
    if (t === '-' ) return '';
    return t;
  };

  // ฟังก์ชันคัดลอกข้อมูลจากที่อยู่ทะเบียนบ้านไปที่อยู่ปัจจุบัน
  const handleCopyFromRegisteredAddress = (checked: boolean) => {
    // ลบ error summary เมื่อผู้ใช้แก้ไขข้อมูล
    const errorSummary = document.getElementById('error-summary');
    if (errorSummary) {
      errorSummary.remove();
    }
    
    setCopyFromRegisteredAddress(checked);
    
    if (checked && formData.registeredAddress) {
      setFormData(prev => ({
        ...prev,
        currentAddressDetail: {
          ...prev.currentAddressDetail,
          houseNumber: formData.registeredAddress?.houseNumber || '',
          villageNumber: formData.registeredAddress?.villageNumber || '',
          alley: formData.registeredAddress?.alley || '',
          road: formData.registeredAddress?.road || '',
          subDistrict: formData.registeredAddress?.subDistrict || '',
          district: formData.registeredAddress?.district || '',
          province: formData.registeredAddress?.province || '',
          postalCode: formData.registeredAddress?.postalCode || '',
          homePhone: formData.registeredAddress?.phone || '',
          mobilePhone: formData.registeredAddress?.mobile || ''
        }
      }));
    }
  };

  // ฟังก์ชันอัปโหลดเอกสารแนบลงฐานข้อมูล
  const uploadDocument = async (file: File, documentType: string, resumeDepositId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('resumeDepositId', resumeDepositId);

      const response = await fetch('/api/resume-documents/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        console.error('Upload failed:', result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
      };
    }
  };

  // ฟังก์ชันสำหรับการบันทึกข้อมูลเอกสาร
  const handleDocumentUpload = async (file: File, documentType: string) => {
    if (!savedResume?.id) {
      console.log('⚠️ กรุณาบันทึกข้อมูลส่วนตัวก่อน');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadDocument(file, documentType, savedResume.id);
      
      if (result.success) {
        // อัปเดตข้อมูลเอกสารที่อัปโหลดแล้ว
        const documents = await fetchUploadedDocuments(savedResume.id);
        setUploadedDocuments(documents);
        console.log('✅ อัปโหลดเอกสารสำเร็จ');
      } else {
        console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดเอกสาร:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดเอกสาร');
    } finally {
      setIsUploading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลเอกสารที่อัปโหลดแล้ว
  const fetchUploadedDocuments = async (resumeDepositId: string) => {
    try {
      const response = await fetch(`/api/resume-documents?resumeDepositId=${resumeDepositId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        console.error('Fetch documents failed:', result.message);
        return [];
      }
    } catch (error) {
      console.error('Fetch documents error:', error);
      return [];
    }
  };
  const handlePreviewFile = (file: File, fileName: string) => {
    setPreviewFile({
      file,
      name: fileName,
      type: file.type
    });
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };
  // ฟังก์ชันลบไฟล์เอกสารแนบ
  const handleDeleteDocument = async (documentId: string, documentType: string) => {
    if (!savedResume?.id) {
      console.log('⚠️ ไม่พบข้อมูลฝากประวัติ');
      return;
    }

    if (!confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) {
      return;
    }

    try {
      setIsUploading(true);
      
      const response = await fetch(`/api/resume-documents/${documentId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        // อัปเดตข้อมูลเอกสารที่อัปโหลดแล้ว
        const documents = await fetchUploadedDocuments(savedResume.id);
        setUploadedDocuments(documents);
        
        // ลบไฟล์จาก formData ด้วย
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: undefined
          }
        }));
        
        console.log('✅ ลบไฟล์สำเร็จ');
      } else {
        console.error('❌ เกิดข้อผิดพลาดในการลบไฟล์:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Delete document error:', error);
      console.error('❌ เกิดข้อผิดพลาดในการลบไฟล์');
    } finally {
      setIsUploading(false);
    }
  };

  // ฟังก์ชันลบไฟล์ใหม่ที่ยังไม่ได้อัปโหลด
  const handleDeleteNewDocument = (documentType: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: undefined
      }
    }));
  };

  const handleArrayChange = (
    arrayName: 'education' | 'workExperience' | 'multipleEmployers',
    index: number,
    field: string,
    value: string
  ) => {
    setFormData(prev => {
      if (arrayName === 'multipleEmployers') {
        // สำหรับ multipleEmployers ที่เป็น string array
        const stringArray = [...(prev.multipleEmployers || [])];
        stringArray[index] = value;
        return { ...prev, multipleEmployers: stringArray };
      } else {
        // สำหรับ education และ workExperience ที่เป็น object array
        const newArray = [...(prev[arrayName] as any[])];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
      }
    });

    // ล้าง error สำหรับ array fields
    const errorKey = `${arrayName}${index}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
        ...prev,
        education: [...prev.education, {
          level: '',
          institution: '',
          major: '',
          year: '',
          gpa: ''
        }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, {
          position: '',
          company: '',
          startDate: '',
          endDate: '',
          salary: '',
          reason: '',
          district: '',
          province: '',
          phone: ''
        }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };
  const addPreviousGovernmentService = () => {
    setFormData(prev => ({
      ...prev,
      previousGovernmentService: [
        ...prev.previousGovernmentService,
        {
          position: '',
          department: '',
          reason: '',
          date: '',
          type: 'civilServant' // ตั้งค่าเริ่มต้นเป็นข้าราชการ
        }
      ]
    }));
  };

  const removePreviousGovernmentService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousGovernmentService: prev.previousGovernmentService.filter((_, i) => i !== index)
    }));
  };

  const handlePreviousGovernmentServiceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      previousGovernmentService: prev.previousGovernmentService.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((work, i) =>
        i === index ? { ...work, [field]: value } : work
      )
    }));
  };

  // ฟังก์ชัน validation สำหรับตรวจสอบข้อมูลทั้งหมดในทุกแท็บ
  const validateAllTabs = () => {
    const errors: Record<string, string> = {};
    
    // ข้อมูลส่วนตัว (จำเป็น) - 1.1 ข้อมูลส่วนตัว
    if (!formData.prefix || formData.prefix.trim() === '') {
      errors.prefix = 'กรุณาเลือกคำนำหน้า';
    }
    if (!formData.firstName || formData.firstName.trim() === '') {
      errors.firstName = 'กรุณากรอกชื่อ';
    }
    if (!formData.lastName || formData.lastName.trim() === '') {
      errors.lastName = 'กรุณากรอกนามสกุล';
    }
    if (!formData.idNumber || formData.idNumber.trim() === '') {
      errors.idNumber = 'กรุณากรอกเลขบัตรประชาชน';
    } else if (!/^[0-9]{13}$/.test(formData.idNumber.replace(/[-\s]/g, ''))) {
      errors.idNumber = 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง (13 หลัก)';
    }
    if (!formData.birthDate) {
      errors.birthDate = 'กรุณาเลือกวันเกิด';
    }
    if (!formData.age || formData.age.trim() === '') {
      errors.age = 'กรุณากรอกอายุ';
    }
    if (!formData.placeOfBirth || formData.placeOfBirth.trim() === '') {
      errors.placeOfBirth = 'กรุณากรอกสถานที่เกิด';
    }
    if (!formData.gender || formData.gender === 'UNKNOWN') {
      errors.gender = 'กรุณาเลือกเพศ';
    }
    if (!formData.nationality || formData.nationality.trim() === '') {
      errors.nationality = 'กรุณากรอกสัญชาติ';
    }
    if (!formData.religion || formData.religion.trim() === '') {
      errors.religion = 'กรุณากรอกศาสนา';
    }
    if (!formData.maritalStatus || formData.maritalStatus === 'UNKNOWN') {
      errors.maritalStatus = 'กรุณาเลือกสถานภาพ';
    }
    
    // ที่อยู่ตามทะเบียนบ้าน (จำเป็น) - 1.2 ที่อยู่ตามทะเบียนบ้าน
    if (!formData.registeredAddress?.houseNumber || formData.registeredAddress.houseNumber.trim() === '') {
      errors.registeredAddressHouseNumber = 'กรุณากรอกบ้านเลขที่';
    }
    if (!formData.registeredAddress?.villageNumber || formData.registeredAddress.villageNumber.trim() === '') {
      errors.registeredAddressVillageNumber = 'กรุณากรอกหมู่ที่';
    }
    if (!formData.registeredAddress?.subDistrict || formData.registeredAddress.subDistrict.trim() === '') {
      errors.registeredAddressSubDistrict = 'กรุณากรอกตำบล/แขวง';
    }
    if (!formData.registeredAddress?.district || formData.registeredAddress.district.trim() === '') {
      errors.registeredAddressDistrict = 'กรุณากรอกอำเภอ/เขต';
    }
    if (!formData.registeredAddress?.province || formData.registeredAddress.province.trim() === '') {
      errors.registeredAddressProvince = 'กรุณากรอกจังหวัด';
    }
    if (!formData.registeredAddress?.postalCode || formData.registeredAddress.postalCode.trim() === '') {
      errors.registeredAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์';
    }
    if (!formData.registeredAddress?.mobile || formData.registeredAddress.mobile.trim() === '') {
      errors.registeredAddressMobile = 'กรุณากรอกโทรศัพท์มือถือ';
    }
    
    // ที่อยู่ปัจจุบัน (จำเป็น)
    if (!formData.currentAddressDetail?.houseNumber || formData.currentAddressDetail.houseNumber.trim() === '') {
      errors.currentAddressHouseNumber = 'กรุณากรอกเลขที่';
    }
    if (!formData.currentAddressDetail?.villageNumber || formData.currentAddressDetail.villageNumber.trim() === '') {
      errors.currentAddressVillageNumber = 'กรุณากรอกหมู่ที่';
    }
    if (!formData.currentAddressDetail?.subDistrict || formData.currentAddressDetail.subDistrict.trim() === '') {
      errors.currentAddressSubDistrict = 'กรุณากรอกตำบล/แขวง';
    }
    if (!formData.currentAddressDetail?.district || formData.currentAddressDetail.district.trim() === '') {
      errors.currentAddressDistrict = 'กรุณากรอกอำเภอ/เขต';
    }
    if (!formData.currentAddressDetail?.province || formData.currentAddressDetail.province.trim() === '') {
      errors.currentAddressProvince = 'กรุณากรอกจังหวัด';
    }
    if (!formData.currentAddressDetail?.postalCode || formData.currentAddressDetail.postalCode.trim() === '') {
      errors.currentAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์';
    }
    if (!formData.currentAddressDetail?.mobilePhone || formData.currentAddressDetail.mobilePhone.trim() === '') {
      errors.currentAddressMobilePhone = 'กรุณากรอกโทรศัพท์มือถือ';
    }
    if (!formData.phone) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    if (!formData.email) errors.email = 'กรุณากรอกอีเมล';
    
    // ผู้ติดต่อฉุกเฉิน (จำเป็น) - 1.6 บุคคลที่สามารถติดต่อได้ทันที
    if (!formData.emergencyContactFirstName || formData.emergencyContactFirstName.trim() === '') {
      errors.emergencyContactFirstName = 'กรุณากรอกชื่อผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyContactLastName || formData.emergencyContactLastName.trim() === '') {
      errors.emergencyContactLastName = 'กรุณากรอกนามสกุลผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyRelationship || formData.emergencyRelationship.trim() === '') {
      errors.emergencyRelationship = 'กรุณากรอกความสัมพันธ์กับผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyPhone || formData.emergencyPhone.trim() === '') {
      errors.emergencyPhone = 'กรุณากรอกเบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน';
    } else if (!/^[0-9]{9,10}$/.test(formData.emergencyPhone.replace(/[-\s]/g, ''))) {
      errors.emergencyPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)';
    }
    if (!formData.emergencyAddress?.houseNumber || formData.emergencyAddress.houseNumber.trim() === '') {
      errors.emergencyAddressHouseNumber = 'กรุณากรอกบ้านเลขที่ผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.villageNumber || formData.emergencyAddress.villageNumber.trim() === '') {
      errors.emergencyAddressVillageNumber = 'กรุณากรอกหมู่ที่ผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.subDistrict || formData.emergencyAddress.subDistrict.trim() === '') {
      errors.emergencyAddressSubDistrict = 'กรุณากรอกตำบล/แขวงผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.district || formData.emergencyAddress.district.trim() === '') {
      errors.emergencyAddressDistrict = 'กรุณากรอกอำเภอ/เขตผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.province || formData.emergencyAddress.province.trim() === '') {
      errors.emergencyAddressProvince = 'กรุณากรอกจังหวัดผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.postalCode || formData.emergencyAddress.postalCode.trim() === '') {
      errors.emergencyAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์ผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.name || formData.emergencyWorkplace.name.trim() === '') {
      errors.emergencyWorkplaceName = 'กรุณากรอกชื่อสถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.district || formData.emergencyWorkplace.district.trim() === '') {
      errors.emergencyWorkplaceDistrict = 'กรุณากรอกอำเภอ/เขตสถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.province || formData.emergencyWorkplace.province.trim() === '') {
      errors.emergencyWorkplaceProvince = 'กรุณากรอกจังหวัดสถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.phone || formData.emergencyWorkplace.phone.trim() === '') {
      errors.emergencyWorkplacePhone = 'กรุณากรอกโทรศัพท์สถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    } else if (!/^[0-9]{9,10}$/.test(formData.emergencyWorkplace.phone.replace(/[-\s]/g, ''))) {
      errors.emergencyWorkplacePhone = 'กรุณากรอกเบอร์โทรศัพท์สถานที่ทำงานให้ถูกต้อง (9-10 หลัก)';
    }
    
    // ข้อมูลคู่สมรส (จำเป็นถ้าเลือกสมรส) - มี *
    if (formData.maritalStatus === 'สมรส') {
      if (!formData.spouseInfo?.firstName || !formData.spouseInfo?.lastName) {
        errors.spouseInfoFirstName = 'กรุณากรอกชื่อ-สกุล คู่สมรส';
        errors.spouseInfoLastName = 'กรุณากรอกชื่อ-สกุล คู่สมรส';
      }
    }
    
    // ข้อมูลสิทธิการรักษา (จำเป็นถ้าเลือก) - มี *
    if (formData.medicalRights?.hasUniversalHealthcare && !formData.medicalRights?.universalHealthcareHospital) {
      errors.medicalRightsUniversalHealthcareHospital = 'กรุณากรอกชื่อโรงพยาบาล';
    }
    if (formData.medicalRights?.hasSocialSecurity && !formData.medicalRights?.socialSecurityHospital) {
      errors.medicalRightsSocialSecurityHospital = 'กรุณากรอกชื่อโรงพยาบาล';
    }
    
    // ข้อมูลการศึกษา (จำเป็น) - 2.1 ข้อมูลการศึกษา
    if (!formData.education || formData.education.length === 0) {
      errors.education = 'กรุณาเพิ่มข้อมูลการศึกษาอย่างน้อย 1 รายการ';
    } else {
      formData.education.forEach((edu, index) => {
        if (!edu.level || edu.level.trim() === '') {
          errors[`education${index}Level`] = 'กรุณาเลือกระดับการศึกษา';
        }
        if (!edu.institution || edu.institution.trim() === '') {
          errors[`education${index}Institution`] = 'กรุณากรอกชื่อสถาบัน';
        }
        if (!edu.major || edu.major.trim() === '') {
          errors[`education${index}Major`] = 'กรุณากรอกสาขาวิชา';
        }
        if (!edu.year || edu.year.trim() === '') {
          errors[`education${index}Year`] = 'กรุณากรอกปีที่จบ';
        }
      });
    }
    
    // ข้อมูลการทำงาน (จำเป็น) - 3.1 ข้อมูลการทำงาน
    if (!formData.workExperience || formData.workExperience.length === 0) {
      errors.workExperience = 'กรุณาเพิ่มข้อมูลการทำงานอย่างน้อย 1 รายการ';
    } else {
      formData.workExperience.forEach((work, index) => {
        if (!work.company || work.company.trim() === '') {
          errors[`workExperience${index}Company`] = 'กรุณากรอกชื่อบริษัท';
        }
        if (!work.position || work.position.trim() === '') {
          errors[`workExperience${index}Position`] = 'กรุณากรอกตำแหน่ง';
        }
        if (!work.startDate || work.startDate.trim() === '') {
          errors[`workExperience${index}StartDate`] = 'กรุณากรอกวันที่เริ่มงาน';
        }
        if (!work.endDate || work.endDate.trim() === '') {
          errors[`workExperience${index}EndDate`] = 'กรุณากรอกวันที่สิ้นสุดงาน';
        }
      });
    }
    
    // ข้อมูลความรู้ความสามารถ (จำเป็น) - มี *
    if (!formData.skills || formData.skills.trim() === '') {
      errors.skills = 'กรุณากรอกความรู้ ความสามารถ และทักษะพิเศษ';
    }
    if (!formData.languages || formData.languages.trim() === '') {
      errors.languages = 'กรุณากรอกภาษาที่ใช้ได้';
    }
    if (!formData.computerSkills || formData.computerSkills.trim() === '') {
      errors.computerSkills = 'กรุณากรอกทักษะคอมพิวเตอร์';
    }
    
    // ข้อมูลการสมัคร (จำเป็น)
    if (!formData.appliedPosition) errors.appliedPosition = 'กรุณากรอกตำแหน่งที่สมัคร';
    if (!formData.availableDate) errors.availableDate = 'กรุณากรอกวันที่พร้อมเริ่มงาน';
    // expectedSalary และ department ไม่จำเป็น - ลบ validation ออก
    
    // เอกสารแนบ (จำเป็น) - มี *
    const hasIdCard = formData.documents?.idCard || uploadedDocuments.some(doc => doc.documentType === 'idCard');
    const hasHouseRegistration = formData.documents?.houseRegistration || uploadedDocuments.some(doc => doc.documentType === 'houseRegistration');
    const hasEducationCertificate = formData.documents?.educationCertificate || uploadedDocuments.some(doc => doc.documentType === 'educationCertificate');
    const hasMilitaryCertificate = formData.documents?.militaryCertificate || uploadedDocuments.some(doc => doc.documentType === 'militaryCertificate');
    const hasMedicalCertificate = formData.documents?.medicalCertificate || uploadedDocuments.some(doc => doc.documentType === 'medicalCertificate');
    const hasDrivingLicense = formData.documents?.drivingLicense || uploadedDocuments.some(doc => doc.documentType === 'drivingLicense');
    
    if (!hasIdCard) errors.idCard = 'กรุณาอัปโหลดสำเนาบัตรประชาชน';
    if (!hasHouseRegistration) errors.houseRegistration = 'กรุณาอัปโหลดสำเนาทะเบียนบ้าน';
    if (!hasEducationCertificate) errors.educationCertificate = 'กรุณาอัปโหลดสำเนาใบประกาศนียบัตร';
    if (!hasMilitaryCertificate) errors.militaryCertificate = 'กรุณาอัปโหลดสำเนาใบรับรองทหาร';
    if (!hasMedicalCertificate) errors.medicalCertificate = 'กรุณาอัปโหลดสำเนาใบรับรองแพทย์';
    if (!hasDrivingLicense) errors.drivingLicense = 'กรุณาอัปโหลดสำเนาใบขับขี่';
    
    return errors;
  };
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // ข้อมูลส่วนตัว (จำเป็น)
    if (!formData.prefix) errors.prefix = 'กรุณาเลือกคำนำหน้า';
    if (!formData.firstName) errors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName) errors.lastName = 'กรุณากรอกนามสกุล';
    if (!formData.age) errors.age = 'กรุณากรอกอายุ';
    if (!formData.birthDate) errors.birthDate = 'กรุณากรอกวัน เดือน ปีเกิด';
    if (!formData.placeOfBirth) errors.placeOfBirth = 'กรุณากรอกสถานที่เกิด';
    if (!formData.placeOfBirthProvince) errors.placeOfBirthProvince = 'กรุณากรอกจังหวัด';
    if (!formData.race) errors.race = 'กรุณากรอกเชื้อชาติ';
    if (!formData.nationality) errors.nationality = 'กรุณากรอกสัญชาติ';
    if (!formData.religion) errors.religion = 'กรุณากรอกศาสนา';
    if (!formData.gender) errors.gender = 'กรุณาเลือกเพศ';
    if (!formData.maritalStatus) errors.maritalStatus = 'กรุณาเลือกสถานภาพทางครอบครัว';
    
    // ข้อมูลบัตรประชาชน (จำเป็น)
    if (!formData.idNumber) {
      errors.idNumber = 'กรุณากรอกเลขบัตรประชาชน';
    } else if (!/^[0-9]{13}$/.test(formData.idNumber.replace(/[-\s]/g, ''))) {
      errors.idNumber = 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง (13 หลัก)';
    }
    if (!formData.idCardIssuedAt) errors.idCardIssuedAt = 'กรุณากรอกสถานที่ออกบัตร';
    if (!formData.idCardIssueDate) errors.idCardIssueDate = 'กรุณากรอกวันที่ออกบัตร';
    if (!formData.idCardExpiryDate) errors.idCardExpiryDate = 'กรุณากรอกวันหมดอายุบัตร';
    
    // ที่อยู่ตามทะเบียนบ้าน (จำเป็น)
    if (!formData.registeredAddress?.houseNumber) errors.registeredAddressHouseNumber = 'กรุณากรอกเลขที่';
    if (!formData.registeredAddress?.villageNumber || formData.registeredAddress.villageNumber.trim() === '') {
      errors.registeredAddressVillageNumber = 'กรุณากรอกหมู่ที่';
    }
    if (!formData.registeredAddress?.alley || formData.registeredAddress.alley.trim() === '') {
      errors.registeredAddressAlley = 'กรุณากรอกตรอก/ซอย';
    }
    if (!formData.registeredAddress?.road || formData.registeredAddress.road.trim() === '') {
      errors.registeredAddressRoad = 'กรุณากรอกถนน';
    }
    if (!formData.registeredAddress?.subDistrict) errors.registeredAddressSubDistrict = 'กรุณากรอกตำบล/แขวง';
    if (!formData.registeredAddress?.district) errors.registeredAddressDistrict = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.registeredAddress?.province) errors.registeredAddressProvince = 'กรุณากรอกจังหวัด';
    if (!formData.registeredAddress?.postalCode) {
      errors.registeredAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์';
    } else if (!/^[0-9]{5}$/.test(formData.registeredAddress.postalCode.replace(/[-\s]/g, ''))) {
      errors.registeredAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (5 หลัก)';
    }
    if (!formData.registeredAddress?.mobile) {
      errors.registeredAddressMobile = 'กรุณากรอกโทรศัพท์มือถือ';
    } else if (!/^[0-9]{9,10}$/.test(formData.registeredAddress.mobile.replace(/[-\s]/g, ''))) {
      errors.registeredAddressMobile = 'กรุณากรอกโทรศัพท์มือถือให้ถูกต้อง (9-10 หลัก)';
    }
    
    // ที่อยู่ปัจจุบัน (จำเป็น)
    if (!formData.currentAddressDetail?.houseNumber) errors.currentAddressHouseNumber = 'กรุณากรอกเลขที่';
    if (!formData.currentAddressDetail?.villageNumber || formData.currentAddressDetail.villageNumber.trim() === '') {
      errors.currentAddressVillageNumber = 'กรุณากรอกหมู่ที่';
    }
    if (!formData.currentAddressDetail?.alley || formData.currentAddressDetail.alley.trim() === '') {
      errors.currentAddressAlley = 'กรุณากรอกตรอก/ซอย';
    }
    if (!formData.currentAddressDetail?.road || formData.currentAddressDetail.road.trim() === '') {
      errors.currentAddressRoad = 'กรุณากรอกถนน';
    }
    if (!formData.currentAddressDetail?.subDistrict) errors.currentAddressSubDistrict = 'กรุณากรอกตำบล/แขวง';
    if (!formData.currentAddressDetail?.district) errors.currentAddressDistrict = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.currentAddressDetail?.province) errors.currentAddressProvince = 'กรุณากรอกจังหวัด';
    if (!formData.currentAddressDetail?.postalCode) {
      errors.currentAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์';
    } else if (!/^[0-9]{5}$/.test(formData.currentAddressDetail.postalCode.replace(/[-\s]/g, ''))) {
      errors.currentAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (5 หลัก)';
    }
    if (!formData.currentAddressDetail?.mobilePhone) {
      errors.currentAddressMobilePhone = 'กรุณากรอกโทรศัพท์มือถือ';
    } else if (!/^[0-9]{9,10}$/.test(formData.currentAddressDetail.mobilePhone.replace(/[-\s]/g, ''))) {
      errors.currentAddressMobilePhone = 'กรุณากรอกโทรศัพท์มือถือให้ถูกต้อง (9-10 หลัก)';
    }
    if (!formData.phone) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    if (!formData.email) errors.email = 'กรุณากรอกอีเมล';
    
    // ผู้ติดต่อฉุกเฉิน (จำเป็น) - 1.6 บุคคลที่สามารถติดต่อได้ทันที
    if (!formData.emergencyContactFirstName || formData.emergencyContactFirstName.trim() === '') {
      errors.emergencyContactFirstName = 'กรุณากรอกชื่อผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyContactLastName || formData.emergencyContactLastName.trim() === '') {
      errors.emergencyContactLastName = 'กรุณากรอกนามสกุลผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyRelationship || formData.emergencyRelationship.trim() === '') {
      errors.emergencyRelationship = 'กรุณากรอกความสัมพันธ์กับผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyPhone || formData.emergencyPhone.trim() === '') {
      errors.emergencyPhone = 'กรุณากรอกเบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน';
    } else if (!/^[0-9]{9,10}$/.test(formData.emergencyPhone.replace(/[-\s]/g, ''))) {
      errors.emergencyPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)';
    }
    if (!formData.emergencyAddress?.houseNumber || formData.emergencyAddress.houseNumber.trim() === '') {
      errors.emergencyAddressHouseNumber = 'กรุณากรอกบ้านเลขที่ผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.villageNumber || formData.emergencyAddress.villageNumber.trim() === '') {
      errors.emergencyAddressVillageNumber = 'กรุณากรอกหมู่ที่ผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.alley || formData.emergencyAddress.alley.trim() === '') {
      errors.emergencyAddressAlley = 'กรุณากรอกตรอก/ซอยผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.road || formData.emergencyAddress.road.trim() === '') {
      errors.emergencyAddressRoad = 'กรุณากรอกถนนผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.subDistrict || formData.emergencyAddress.subDistrict.trim() === '') {
      errors.emergencyAddressSubDistrict = 'กรุณากรอกตำบล/แขวงผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.district || formData.emergencyAddress.district.trim() === '') {
      errors.emergencyAddressDistrict = 'กรุณากรอกอำเภอ/เขตผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.province || formData.emergencyAddress.province.trim() === '') {
      errors.emergencyAddressProvince = 'กรุณากรอกจังหวัดผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyAddress?.postalCode || formData.emergencyAddress.postalCode.trim() === '') {
      errors.emergencyAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์ผู้ติดต่อฉุกเฉิน';
    } else if (!/^[0-9]{5}$/.test(formData.emergencyAddress.postalCode)) {
      errors.emergencyAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (5 หลัก)';
    }
    if (formData.emergencyAddress?.phone && !/^[0-9]{9,10}$/.test(formData.emergencyAddress.phone.replace(/[-\s]/g, ''))) {
      errors.emergencyAddressPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (9-10 หลัก)';
    }
    if (!formData.emergencyWorkplace?.name || formData.emergencyWorkplace.name.trim() === '') {
      errors.emergencyWorkplaceName = 'กรุณากรอกชื่อสถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.district || formData.emergencyWorkplace.district.trim() === '') {
      errors.emergencyWorkplaceDistrict = 'กรุณากรอกอำเภอ/เขตสถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.province || formData.emergencyWorkplace.province.trim() === '') {
      errors.emergencyWorkplaceProvince = 'กรุณากรอกจังหวัดสถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    }
    if (!formData.emergencyWorkplace?.phone || formData.emergencyWorkplace.phone.trim() === '') {
      errors.emergencyWorkplacePhone = 'กรุณากรอกโทรศัพท์สถานที่ทำงานผู้ติดต่อฉุกเฉิน';
    } else if (!/^[0-9]{9,10}$/.test(formData.emergencyWorkplace.phone.replace(/[-\s]/g, ''))) {
      errors.emergencyWorkplacePhone = 'กรุณากรอกเบอร์โทรศัพท์สถานที่ทำงานให้ถูกต้อง (9-10 หลัก)';
    }
    
    // ข้อมูลการสมัคร (จำเป็น) - ตรวจสอบในแท็บ position
    if (activeTab === 'position') {
      if (!formData.appliedPosition) errors.appliedPosition = 'กรุณากรอกตำแหน่งที่สมัคร';
      if (!formData.availableDate) errors.availableDate = 'กรุณากรอกวันที่พร้อมเริ่มงาน';
      // expectedSalary และ department ไม่จำเป็น - ลบ validation ออก
    }
    
    // ข้อมูลคู่สมรส (จำเป็นถ้าเลือกสมรส) - มี *
    if (formData.maritalStatus === 'สมรส') {
      if (!formData.spouseInfo?.firstName || !formData.spouseInfo?.lastName) {
        errors.spouseInfoFirstName = 'กรุณากรอกชื่อ-สกุล คู่สมรส';
        errors.spouseInfoLastName = 'กรุณากรอกชื่อ-สกุล คู่สมรส';
      }
    }
    
    // ข้อมูลสิทธิการรักษา (จำเป็นถ้าเลือก) - มี *
    if (formData.medicalRights?.hasUniversalHealthcare && !formData.medicalRights?.universalHealthcareHospital) {
      errors.medicalRightsUniversalHealthcareHospital = 'กรุณากรอกชื่อโรงพยาบาล';
    }
    if (formData.medicalRights?.hasSocialSecurity && !formData.medicalRights?.socialSecurityHospital) {
      errors.medicalRightsSocialSecurityHospital = 'กรุณากรอกชื่อโรงพยาบาล';
    }
    if (formData.medicalRights?.wantToChangeHospital && !formData.medicalRights?.newHospital) {
      errors.medicalRightsNewHospital = 'กรุณากรอกชื่อโรงพยาบาลใหม่';
    }
    if (formData.medicalRights?.otherRights && !formData.medicalRights?.otherRights.trim()) {
      errors.medicalRightsOtherRights = 'กรุณากรอกรายละเอียดสิทธิอื่นๆ';
    }
    
    // ข้อมูลนายจ้างหลายราย (จำเป็นถ้ามี) - มี *
    if (formData.multipleEmployers && formData.multipleEmployers.length > 0) {
      formData.multipleEmployers.forEach((employer, index) => {
        if (employer && employer.trim() === '') {
          errors[`multipleEmployers${index}`] = 'กรุณากรอกชื่อสถานประกอบการ';
        }
      });
    }
    
    // ข้อมูลการศึกษา (จำเป็น) - 1.7 ประวัติการศึกษา - มี *
    if (formData.education.length === 0) {
      errors.education = 'กรุณาเพิ่มประวัติการศึกษาอย่างน้อย 1 รายการ';
    } else {
      formData.education.forEach((edu, index) => {
        if (!edu.level || edu.level.trim() === '') {
          errors[`education${index}Level`] = 'กรุณาเลือกระดับการศึกษา';
        }
        if (!edu.institution || edu.institution.trim() === '') {
          errors[`education${index}Institution`] = 'กรุณากรอกชื่อสถาบันการศึกษา';
        }
        if (!edu.major || edu.major.trim() === '') {
          errors[`education${index}Major`] = 'กรุณากรอกสาขาวิชาที่จบการศึกษา';
        }
        if (!edu.year || edu.year.trim() === '') {
          errors[`education${index}Year`] = 'กรุณากรอกปีที่จบการศึกษา';
        } else if (!/^[0-9]{4}$/.test(edu.year)) {
          errors[`education${index}Year`] = 'กรุณากรอกปีที่จบการศึกษาให้ถูกต้อง (4 หลัก)';
        }
        if (!edu.gpa || edu.gpa.trim() === '') {
          errors[`education${index}Gpa`] = 'กรุณากรอกเกรดเฉลี่ย';
        } else if (!/^[0-4]\.?[0-9]*$/.test(edu.gpa) || parseFloat(edu.gpa) > 4.0) {
          errors[`education${index}Gpa`] = 'กรุณากรอกเกรดเฉลี่ยให้ถูกต้อง (0.00-4.00)';
        }
      });
    }
    
    // ข้อมูลประสบการณ์การทำงาน (จำเป็น) - 1.8 ปัจจุบันทำงานในตำแหน่ง - มี *
    if (formData.workExperience.length === 0) {
      errors.workExperience = 'กรุณาเพิ่มประสบการณ์การทำงานอย่างน้อย 1 รายการ';
    } else {
      formData.workExperience.forEach((work, index) => {
        if (!work.position || work.position.trim() === '') {
          errors[`workExperience${index}Position`] = 'กรุณากรอกตำแหน่งงาน';
        }
        if (!work.company || work.company.trim() === '') {
          errors[`workExperience${index}Company`] = 'กรุณากรอกชื่อบริษัท/องค์กร';
        }
        if (!work.startDate || work.startDate.trim() === '') {
          errors[`workExperience${index}StartDate`] = 'กรุณากรอกวันที่เริ่มงาน';
        }
        if (!work.endDate || work.endDate.trim() === '') {
          errors[`workExperience${index}EndDate`] = 'กรุณากรอกวันที่สิ้นสุดงาน';
        }
        if (!work.salary || work.salary.trim() === '') {
          errors[`workExperience${index}Salary`] = 'กรุณากรอกเงินเดือน';
        } else if (!/^[0-9,]+$/.test(work.salary.replace(/[,\s]/g, ''))) {
          errors[`workExperience${index}Salary`] = 'กรุณากรอกเงินเดือนเป็นตัวเลขเท่านั้น';
        }
        if (!work.reason || work.reason.trim() === '') {
          errors[`workExperience${index}Reason`] = 'กรุณากรอกเหตุผลที่ออกจากงาน';
        }
      });
    }
    
    // ข้อมูลการรับราชการก่อนหน้า (จำเป็นถ้ามี) - 1.9 เคยรับราชการเป็นข้าราชการ/ลูกจ้าง
    if (formData.previousGovernmentService && formData.previousGovernmentService.length > 0) {
      formData.previousGovernmentService.forEach((gov, index) => {
        if (!gov.position || gov.position.trim() === '') {
          errors[`previousGovernmentService${index}Position`] = 'กรุณากรอกตำแหน่งที่เคยรับราชการ';
        }
        if (!gov.department || gov.department.trim() === '') {
          errors[`previousGovernmentService${index}Department`] = 'กรุณากรอกหน่วยงานที่เคยรับราชการ';
        }
        if (!gov.reason || gov.reason.trim() === '') {
          errors[`previousGovernmentService${index}Reason`] = 'กรุณากรอกเหตุผลที่ออกจากราชการ';
        }
        if (!gov.date || gov.date.trim() === '') {
          errors[`previousGovernmentService${index}Date`] = 'กรุณากรอกวันที่ออกจากราชการ';
        }
      });
    }
    
    // ข้อมูลความรู้ความสามารถ (จำเป็น) - ตรวจสอบในแท็บ skills
    if (activeTab === 'skills') {
      if (!formData.skills || formData.skills.trim() === '') {
        errors.skills = 'กรุณากรอกความรู้ ความสามารถ และทักษะพิเศษ';
      }
      if (!formData.languages || formData.languages.trim() === '') {
        errors.languages = 'กรุณากรอกภาษาที่ใช้ได้';
      }
      if (!formData.computerSkills || formData.computerSkills.trim() === '') {
        errors.computerSkills = 'กรุณากรอกทักษะคอมพิวเตอร์';
      }
    }
    
    // เอกสารแนบ (จำเป็น) - มี *
    // ตรวจสอบทั้ง formData.documents และ uploadedDocuments
    const hasIdCard = formData.documents?.idCard || uploadedDocuments.some(doc => doc.documentType === 'idCard');
    const hasHouseRegistration = formData.documents?.houseRegistration || uploadedDocuments.some(doc => doc.documentType === 'houseRegistration');
    const hasEducationCertificate = formData.documents?.educationCertificate || uploadedDocuments.some(doc => doc.documentType === 'educationCertificate');
    const hasMilitaryCertificate = formData.documents?.militaryCertificate || uploadedDocuments.some(doc => doc.documentType === 'militaryCertificate');
    
    if (!hasIdCard) {
      errors.documentsIdCard = 'กรุณาแนบสำเนาบัตรประชาชน';
    }
    if (!hasHouseRegistration) {
      errors.documentsHouseRegistration = 'กรุณาแนบสำเนาทะเบียนบ้าน';
    }
    if (!hasEducationCertificate) {
      errors.documentsEducationCertificate = 'กรุณาแนบใบรับรองการศึกษา';
    }
    if (formData.gender === 'ชาย' && !hasMilitaryCertificate) {
      errors.documentsMilitaryCertificate = 'กรุณาแนบใบรับรองทหาร (สำหรับผู้ชาย)';
    }
    // if (!formData.documents?.medicalCertificate) {
    //   errors.documentsMedicalCertificate = 'กรุณาแนบใบรับรองแพทย์';
    // }
    // if (!formData.documents?.drivingLicense) {
    //   errors.documentsDrivingLicense = 'กรุณาแนบใบขับขี่';
    // }
    // if (!formData.documents?.nameChangeCertificate) {
    //   errors.documentsNameChangeCertificate = 'กรุณาแนบใบเปลี่ยนชื่อ-นามสกุล';
    // }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลทั้งหมดในทุกแท็บก่อนส่ง
    const validationErrors = validateAllTabs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.error('❌ ข้อมูลไม่ครบถ้วน - มีข้อผิดพลาด', Object.keys(validationErrors).length, 'รายการ');
      console.error('❌ ข้อผิดพลาด:', validationErrors);
      
      // แสดงข้อความแจ้งเตือน
      const errorMessages = Object.values(validationErrors).slice(0, 5); // แสดงแค่ 5 ข้อผิดพลาดแรก
      const remainingErrors = Object.keys(validationErrors).length - 5;
      const message = `❌ ข้อมูลไม่ครบถ้วน\n\nมีข้อผิดพลาด ${Object.keys(validationErrors).length} รายการ:\n\n${errorMessages.join('\n')}${remainingErrors > 0 ? `\n\nและอีก ${remainingErrors} รายการ...` : ''}`;
      console.error(message);
      
      // Scroll ไปยังตำแหน่งที่มี error แรก
      const firstErrorKey = Object.keys(validationErrors)[0];
      scrollToError(firstErrorKey);
      
      return;
    }
    
    // ล้าง errors เมื่อ validation ผ่าน
    setErrors({});
    
    // เริ่มการบันทึกข้อมูล
    setIsSaving(true);

    try {
      const timestamp = new Date().toISOString();

      // บันทึกข้อมูลไปที่ ResumeDeposit ที่เดียวเท่านั้น
      console.log('🔍 Mode: RESUME DEPOSIT (ฝากประวัติ) - บันทึกไปที่ตาราง ResumeDeposit เท่านั้น');
      console.log('🔍 departmentId:', departmentId);
      console.log('🔍 departmentName:', departmentName);
      console.log('🔍 resumeId:', resumeId);

      // ถ้ามี resumeId ให้อัปเดตข้อมูลเดิม ถ้าไม่มีให้สร้างใหม่
      let savedResumeId = resumeId;
      if (resumeId) {
        console.log('🔍 อัปเดตข้อมูล ResumeDeposit ที่มีอยู่แล้ว ID:', resumeId);
        await updateResumeDeposit(resumeId);
      } else {
        console.log('🔍 สร้าง ResumeDeposit ใหม่');
        const savedResume = await saveToResumeDeposit();
        savedResumeId = savedResume?.id || savedResumeId;
      }
      
      // สร้างใบสมัครงานในตาราง application_form (ถ้ามี department)
      if (departmentName && departmentId && savedResumeId) {
        console.log('🔍 สร้างใบสมัครงานสำหรับฝ่าย:', departmentName);
        await createApplicationForm(savedResumeId, departmentName, departmentId);
      }
      
      // บันทึกข้อมูลสำเร็จ
      console.log('✅ บันทึกข้อมูลสำเร็จ');
      console.log('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
      
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      console.error('❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    } finally {
      setIsSaving(false);
    }
  };
  // ฟังก์ชันอัปเดตข้อมูล ResumeDeposit ที่มีอยู่แล้ว
  const updateResumeDeposit = async (id: string) => {
    try {
      console.log('📝 Updating ResumeDeposit ID:', id);
      console.log('🔍 formData.education:', formData.education);
      console.log('🔍 formData.education.length:', formData.education?.length || 0);
      console.log('🔍 formData.workExperience:', formData.workExperience);
      console.log('🔍 formData.workExperience.length:', formData.workExperience?.length || 0);
      console.log('🔍 formData.previousGovernmentService:', formData.previousGovernmentService);
      console.log('🔍 formData.previousGovernmentService.length:', formData.previousGovernmentService?.length || 0);
      
      // สร้าง ResumeDeposit payload สำหรับการอัปเดต
      const resumePayload = {
        // บุคคล
        prefix: formData.prefix || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber || null,
        idCardIssuedAt: formData.idCardIssuedAt || null,
          idCardIssueDate: formData.idCardIssueDate ? new Date(formData.idCardIssueDate) : null,
          idCardExpiryDate: formData.idCardExpiryDate ? new Date(formData.idCardExpiryDate) : null,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        age: formData.age ? Number(formData.age) : null,
        race: formData.race || null,
        placeOfBirth: formData.placeOfBirth || null,
        placeOfBirthProvince: formData.placeOfBirthProvince || null,
        gender: formData.gender || 'UNKNOWN',
        nationality: formData.nationality || null,
        religion: formData.religion || null,
        maritalStatus: formData.maritalStatus || 'UNKNOWN',
        // ที่อยู่
        address: formData.currentAddress || null,
        phone: formData.phone || null,
        email: formData.email || null,
        // ข้อมูลฉุกเฉิน
        emergencyContact: formData.emergencyContact || null,
        emergencyContactFirstName: formData.emergencyContactFirstName || null,
        emergencyContactLastName: formData.emergencyContactLastName || null,
        emergencyPhone: formData.emergencyPhone || null,
        emergencyRelationship: formData.emergencyRelationship || null,
        emergencyAddress: formData.emergencyAddress || null,
        // ข้อมูลเพิ่มเติม
        skills: formData.skills || null,
        languages: formData.languages || null,
        computerSkills: formData.computerSkills || null,
        certificates: formData.certificates || null,
        references: formData.references || null,
        // งานที่สนใจ
        expectedPosition: formData.appliedPosition || departmentName || null,
        expectedSalary: formData.expectedSalary || null,
          availableDate: formData.availableDate ? new Date(formData.availableDate) : null,
        department: departmentName || formData.department || null,
          // ข้อมูลคู่สมรส
        spouse_first_name: formData.spouseInfo?.firstName || null,
        spouse_last_name: formData.spouseInfo?.lastName || null,
        // การศึกษา - ส่งเป็น array ธรรมดา (API จะจัดการ nested create)
        education: (formData.education || []).map((e) => ({
          level: e.level,
          school: e.institution,
          major: e.major || null,
          endYear: e.year,
          gpa: e.gpa ? parseFloat(e.gpa) : null
        })),
        // ประสบการณ์ทำงาน - ส่งเป็น array ธรรมดา (API จะจัดการ nested create)
        workExperience: (formData.workExperience || []).map((w) => ({
          position: w.position,
          company: w.company,
          startDate: w.startDate ? new Date(w.startDate) : null,
          endDate: w.endDate ? new Date(w.endDate) : null,
          salary: w.salary || null,
          description: w.reason || null,
          isCurrent: w.endDate === null || w.endDate === '' || w.endDate === 'ปัจจุบัน',
          district: w.district || null,
          province: w.province || null,
          phone: w.phone || null,
        })),
        // ข้อมูลการรับราชการก่อนหน้า - ส่งเป็น array ธรรมดา (API จะจัดการ nested create)
        previousGovernmentService: (formData.previousGovernmentService || []).map((g) => {
          console.log('🔍 Mapping previousGovernmentService:', g);
          return {
            position: g.position,
            department: g.department,
            reason: g.reason,
            date: g.date,
            type: g.type || 'civilServant',
          };
        }),
        // ข้อมูลเจ้าหน้าที่
        staff_position: formData.staffInfo?.position || null,
        staff_department: formData.staffInfo?.department || null,
        staff_start_work: formData.staffInfo?.startWork || null,
        
        // ที่อยู่ทะเบียนบ้าน (รายละเอียด)
        house_registration_house_number: formData.registeredAddress?.houseNumber || null,
        house_registration_village_number: formData.registeredAddress?.villageNumber || null,
        house_registration_alley: formData.registeredAddress?.alley || null,
        house_registration_road: formData.registeredAddress?.road || null,
        house_registration_sub_district: formData.registeredAddress?.subDistrict || null,
        house_registration_district: formData.registeredAddress?.district || null,
        house_registration_province: formData.registeredAddress?.province || null,
        house_registration_postal_code: formData.registeredAddress?.postalCode || null,
        house_registration_phone: formData.registeredAddress?.phone || null,
        house_registration_mobile: formData.registeredAddress?.mobile || null,
        
        // ที่อยู่ปัจจุบัน (รายละเอียด)
        current_address_house_number: formData.currentAddressDetail?.houseNumber || null,
        current_address_village_number: formData.currentAddressDetail?.villageNumber || null,
        current_address_alley: formData.currentAddressDetail?.alley || null,
        current_address_road: formData.currentAddressDetail?.road || null,
        current_address_sub_district: formData.currentAddressDetail?.subDistrict || null,
        current_address_district: formData.currentAddressDetail?.district || null,
        current_address_province: formData.currentAddressDetail?.province || null,
        current_address_postal_code: formData.currentAddressDetail?.postalCode || null,
        current_address_phone: formData.currentAddressDetail?.homePhone || null,
        current_address_mobile: formData.currentAddressDetail?.mobilePhone || null,
        
        // ที่อยู่ตามทะเบียนบ้าน (แบบเก่า)
        addressAccordingToHouseRegistration: formData.addressAccordingToHouseRegistration || null,
        
        // ที่อยู่ฉุกเฉิน
        emergency_address_house_number: formData.emergencyAddress?.houseNumber || null,
        emergency_address_village_number: formData.emergencyAddress?.villageNumber || null,
        emergency_address_alley: formData.emergencyAddress?.alley || null,
        emergency_address_road: formData.emergencyAddress?.road || null,
        emergency_address_sub_district: formData.emergencyAddress?.subDistrict || null,
        emergency_address_district: formData.emergencyAddress?.district || null,
        emergency_address_province: formData.emergencyAddress?.province || null,
        emergency_address_postal_code: formData.emergencyAddress?.postalCode || null,
        emergency_address_phone: formData.emergencyAddress?.phone || null,
        
        // ที่ทำงานของคนฉุกเฉิน
        emergency_workplace_name: formData.emergencyWorkplace?.name || null,
        emergency_workplace_district: formData.emergencyWorkplace?.district || null,
        emergency_workplace_province: formData.emergencyWorkplace?.province || null,
        emergency_workplace_phone: formData.emergencyWorkplace?.phone || null,
        
        // ข้อมูลสิทธิการรักษา
        medical_rights_has_universal_healthcare: formData.medicalRights?.hasUniversalHealthcare || false,
        medical_rights_universal_healthcare_hospital: formData.medicalRights?.universalHealthcareHospital || null,
        medical_rights_has_social_security: formData.medicalRights?.hasSocialSecurity || false,
        medical_rights_social_security_hospital: formData.medicalRights?.socialSecurityHospital || null,
        medical_rights_dont_want_to_change_hospital: formData.medicalRights?.dontWantToChangeHospital || false,
        medical_rights_want_to_change_hospital: formData.medicalRights?.wantToChangeHospital || false,
        medical_rights_new_hospital: formData.medicalRights?.newHospital || null,
        medical_rights_has_civil_servant_rights: formData.medicalRights?.hasCivilServantRights || false,
        medical_rights_other_rights: formData.medicalRights?.otherRights || null,
        
        // ข้อมูลเพิ่มเติม
        applicantSignature: formData.applicantSignature || null,
        applicationDate: formData.applicationDate ? new Date(formData.applicationDate) : null,
        currentWork: formData.currentWork || false,
        multipleEmployers: formData.multipleEmployers ? JSON.stringify(formData.multipleEmployers) : null,
        
        // เอกสารแนบ - ไม่ส่งข้อมูล documents ที่นี่เพราะจะจัดการแยกใน API
        // documents: formData.documents || null,
      };

      // ส่งเป็น JSON เท่านั้น (รูปภาพจะจัดการแยกผ่าน profile-image/upload API)
      console.log('🔍 handleSubmit PATCH - Sending JSON data only');
      console.log('🔍 handleSubmit PATCH - formData.profileImage:', formData.profileImage);
      console.log('🔍 handleSubmit PATCH - resumePayload.education:', resumePayload.education);
      console.log('🔍 handleSubmit PATCH - resumePayload.education.length:', resumePayload.education?.length || 0);
      console.log('🔍 handleSubmit PATCH - resumePayload.workExperience:', resumePayload.workExperience);
      console.log('🔍 handleSubmit PATCH - resumePayload.workExperience.length:', resumePayload.workExperience?.length || 0);
      console.log('🔍 handleSubmit PATCH - resumePayload.previousGovernmentService:', resumePayload.previousGovernmentService);
      console.log('🔍 handleSubmit PATCH - resumePayload.previousGovernmentService.length:', resumePayload.previousGovernmentService?.length || 0);
      console.log('🔍 handleSubmit PATCH - Village Number Data:', {
        villageNumber: resumePayload.house_registration_village_number,
        alley: resumePayload.house_registration_alley,
        road: resumePayload.house_registration_road
      });
      console.log('🔍 handleSubmit PATCH - Emergency Workplace Data:', {
        name: resumePayload.emergency_workplace_name,
        district: resumePayload.emergency_workplace_district,
        province: resumePayload.emergency_workplace_province,
        phone: resumePayload.emergency_workplace_phone
      });

      const res = await fetch(`/api/resume-deposit/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumePayload)
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('❌ ResumeDeposit update failed:', res.status, json);
        throw new Error(json?.message || 'ไม่สามารถอัปเดตข้อมูลฝากประวัติได้');
      }

      const updatedResumeId = json?.data?.id;
      console.log('✅ ResumeDeposit updated:', updatedResumeId);

      // 2. อัปโหลดรูปโปรไฟล์ (ถ้ามี)
        if (formData.profileImage && formData.profileImage instanceof File) {
          try {
            const imgFd = new FormData();
            imgFd.append('profileImage', formData.profileImage);
          imgFd.append('resumeId', updatedResumeId);

            const imgRes = await fetch('/api/profile-image/upload', {
              method: 'POST',
              body: imgFd
            });

            if (!imgRes.ok) {
              console.error('❌ Profile image upload failed');
            } else {
              console.log('✅ Profile image uploaded');
            }
          } catch (err) {
            console.error('❌ Error uploading profile image:', err);
          }
        }

      // 3. อัปโหลดเอกสารแนบ (ถ้ามี)
        if (formData.documents) {
          const docTypes = [
            'idCard',
            'houseRegistration',
          'educationCertificate',
            'militaryCertificate',
            'medicalCertificate',
            'drivingLicense',
          'otherDocuments'
          ];

          for (const docType of docTypes) {
            const doc = formData.documents[docType as keyof typeof formData.documents];
            if (doc && doc instanceof File) {
              try {
                const docFd = new FormData();
                docFd.append('file', doc);
              docFd.append('resumeId', updatedResumeId);
                docFd.append('documentType', docType);

              const docRes = await fetch('/api/documents', {
                  method: 'POST',
                  body: docFd
                });

                if (!docRes.ok) {
                console.error(`❌ Document ${docType} upload failed`);
                } else {
                console.log(`✅ Document ${docType} uploaded`);
                }
              } catch (err) {
                console.error(`❌ Error uploading document ${docType}:`, err);
              }
            }
          }
        }

      console.log('✅ ResumeDeposit updated successfully');
      
    } catch (error) {
      console.error('❌ Error updating ResumeDeposit:', error);
      throw error; // Re-throw error to be handled by handleSubmit
    }
  };
  // ฟังก์ชันบันทึกข้อมูลไปที่ ResumeDeposit
  const saveToResumeDeposit = async () => {
    try {
      console.log('📝 Saving to ResumeDeposit...');
      console.log('🔍 formData.education:', formData.education);
      console.log('🔍 formData.education.length:', formData.education?.length || 0);
      console.log('🔍 formData.workExperience:', formData.workExperience);
      console.log('🔍 formData.workExperience.length:', formData.workExperience?.length || 0);
      console.log('🔍 formData.previousGovernmentService:', formData.previousGovernmentService);
      console.log('🔍 formData.previousGovernmentService.length:', formData.previousGovernmentService?.length || 0);
      
      // สร้าง ResumeDeposit payload
      const resumePayload = {
        // 🔒 Security: บันทึก userId และ lineId จาก session เพื่อความปลอดภัย (รองรับหลายกรณี)
        userId: (session?.user as any)?.id || null,
        lineId: (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || null,
        // บุคคล
        prefix: formData.prefix || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
          idNumber: formData.idNumber || null,
          idCardIssuedAt: formData.idCardIssuedAt || null,
        idCardIssueDate: formData.idCardIssueDate ? new Date(formData.idCardIssueDate) : null,
        idCardExpiryDate: formData.idCardExpiryDate ? new Date(formData.idCardExpiryDate) : null,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        age: formData.age ? Number(formData.age) : null,
          race: formData.race || null,
          placeOfBirth: formData.placeOfBirth || null,
          placeOfBirthProvince: formData.placeOfBirthProvince || null,
          gender: formData.gender || 'UNKNOWN',
        nationality: formData.nationality || null,
        religion: formData.religion || null,
          maritalStatus: formData.maritalStatus || 'UNKNOWN',
          // ที่อยู่
        address: formData.currentAddress || formData.addressAccordingToHouseRegistration || null,
        phone: formData.phone || null,
        email: formData.email || null,
        // ข้อมูลฉุกเฉิน
        emergencyContact: formData.emergencyContact || `${formData.emergencyContactFirstName || ''} ${formData.emergencyContactLastName || ''}`.trim(),
        emergencyContactFirstName: formData.emergencyContactFirstName || null,
        emergencyContactLastName: formData.emergencyContactLastName || null,
          emergencyPhone: formData.emergencyPhone || null,
          emergencyRelationship: formData.emergencyRelationship || null,
        emergency_address_house_number: formData.emergencyAddress?.houseNumber || null,
        emergency_address_village_number: formData.emergencyAddress?.villageNumber || null,
        emergency_address_alley: formData.emergencyAddress?.alley || null,
        emergency_address_road: formData.emergencyAddress?.road || null,
        emergency_address_sub_district: formData.emergencyAddress?.subDistrict || null,
        emergency_address_district: formData.emergencyAddress?.district || null,
        emergency_address_province: formData.emergencyAddress?.province || null,
        emergency_address_postal_code: formData.emergencyAddress?.postalCode || null,
        emergency_address_phone: formData.emergencyAddress?.phone || null,
        
        // ข้อมูลเพิ่มเติม
          skills: formData.skills || null,
          languages: formData.languages || null,
          computerSkills: formData.computerSkills || null,
          certificates: formData.certificates || null,
          references: formData.references || null,
          // งานที่สนใจ
          expectedPosition: formData.appliedPosition || departmentName || null,
          expectedSalary: formData.expectedSalary || null,
          availableDate: formData.availableDate ? new Date(formData.availableDate) : null,
          department: departmentName || formData.department || null,
          // ข้อมูลคู่สมรส
          spouse_first_name: formData.spouseInfo?.firstName || null,
          spouse_last_name: formData.spouseInfo?.lastName || null,
          // การศึกษา - ส่งเป็น array ธรรมดา (API จะจัดการ nested create)
          education: (formData.education || []).map((e) => ({
            level: e.level,
            school: e.institution,
            major: e.major || null,
            endYear: e.year,
            gpa: e.gpa ? parseFloat(e.gpa) : null
          })),
          // ประสบการณ์ทำงาน - ส่งเป็น array ธรรมดา (API จะจัดการ nested create)
          workExperience: (formData.workExperience || []).map((w) => ({
            position: w.position,
            company: w.company,
            startDate: w.startDate ? new Date(w.startDate) : null,
            endDate: w.endDate ? new Date(w.endDate) : null,
            salary: w.salary || null,
            description: w.reason || null,
            isCurrent: w.endDate === null || w.endDate === '' || w.endDate === 'ปัจจุบัน',
            district: w.district || null,
            province: w.province || null,
            phone: w.phone || null,
          })),
          // ข้อมูลการรับราชการก่อนหน้า - ส่งเป็น array ธรรมดา (API จะจัดการ nested create)
          previousGovernmentService: (formData.previousGovernmentService || []).map((g) => {
            console.log('🔍 Mapping previousGovernmentService:', g);
            return {
              position: g.position,
              department: g.department,
              reason: g.reason,
              date: g.date,
              type: g.type || 'civilServant',
            };
          }),
        // ข้อมูลเจ้าหน้าที่
        staff_position: formData.staffInfo?.position || null,
        staff_department: formData.staffInfo?.department || null,
        staff_start_work: formData.staffInfo?.startWork || null,
        // ที่อยู่ทะเบียนบ้าน (รายละเอียด)
        house_registration_house_number: formData.registeredAddress?.houseNumber || null,
        house_registration_village_number: formData.registeredAddress?.villageNumber || null,
        house_registration_alley: formData.registeredAddress?.alley || null,
        house_registration_road: formData.registeredAddress?.road || null,
        house_registration_sub_district: formData.registeredAddress?.subDistrict || null,
        house_registration_district: formData.registeredAddress?.district || null,
        house_registration_province: formData.registeredAddress?.province || null,
        house_registration_postal_code: formData.registeredAddress?.postalCode || null,
        house_registration_phone: formData.registeredAddress?.phone || null,
        house_registration_mobile: formData.registeredAddress?.mobile || null,
        
        // ที่อยู่ปัจจุบัน (รายละเอียด)
        current_address_house_number: formData.currentAddressDetail?.houseNumber || null,
        current_address_village_number: formData.currentAddressDetail?.villageNumber || null,
        current_address_alley: formData.currentAddressDetail?.alley || null,
        current_address_road: formData.currentAddressDetail?.road || null,
        current_address_sub_district: formData.currentAddressDetail?.subDistrict || null,
        current_address_district: formData.currentAddressDetail?.district || null,
        current_address_province: formData.currentAddressDetail?.province || null,
        current_address_postal_code: formData.currentAddressDetail?.postalCode || null,
        current_address_phone: formData.currentAddressDetail?.homePhone || null,
        current_address_mobile: formData.currentAddressDetail?.mobilePhone || null,
        
        // ที่อยู่ตามทะเบียนบ้าน (แบบเก่า)
        addressAccordingToHouseRegistration: formData.addressAccordingToHouseRegistration || null,
        
        // ที่อยู่ฉุกเฉิน
        emergency_address_house_number: formData.emergencyAddress?.houseNumber || null,
        emergency_address_village_number: formData.emergencyAddress?.villageNumber || null,
        emergency_address_alley: formData.emergencyAddress?.alley || null,
        emergency_address_road: formData.emergencyAddress?.road || null,
        emergency_address_sub_district: formData.emergencyAddress?.subDistrict || null,
        emergency_address_district: formData.emergencyAddress?.district || null,
        emergency_address_province: formData.emergencyAddress?.province || null,
        emergency_address_postal_code: formData.emergencyAddress?.postalCode || null,
        emergency_address_phone: formData.emergencyAddress?.phone || null,
        
        // ที่ทำงานของคนฉุกเฉิน
        emergency_workplace_name: formData.emergencyWorkplace?.name || null,
        emergency_workplace_district: formData.emergencyWorkplace?.district || null,
        emergency_workplace_province: formData.emergencyWorkplace?.province || null,
        emergency_workplace_phone: formData.emergencyWorkplace?.phone || null,
        
        // ข้อมูลสิทธิการรักษา
        medical_rights_has_universal_healthcare: formData.medicalRights?.hasUniversalHealthcare || false,
        medical_rights_universal_healthcare_hospital: formData.medicalRights?.universalHealthcareHospital || null,
        medical_rights_has_social_security: formData.medicalRights?.hasSocialSecurity || false,
        medical_rights_social_security_hospital: formData.medicalRights?.socialSecurityHospital || null,
        medical_rights_dont_want_to_change_hospital: formData.medicalRights?.dontWantToChangeHospital || false,
        medical_rights_want_to_change_hospital: formData.medicalRights?.wantToChangeHospital || false,
        medical_rights_new_hospital: formData.medicalRights?.newHospital || null,
        medical_rights_has_civil_servant_rights: formData.medicalRights?.hasCivilServantRights || false,
        medical_rights_other_rights: formData.medicalRights?.otherRights || null,
        
        // ข้อมูลเพิ่มเติม
        applicantSignature: formData.applicantSignature || null,
        applicationDate: formData.applicationDate ? new Date(formData.applicationDate) : null,
        currentWork: formData.currentWork || false,
        multipleEmployers: formData.multipleEmployers ? JSON.stringify(formData.multipleEmployers) : null,
        
        // เอกสารแนบ - ไม่ส่งข้อมูล documents ที่นี่เพราะจะจัดการแยกใน API
        // documents: formData.documents || null,
      };

      // ส่งเป็น JSON เท่านั้น (รูปภาพจะจัดการแยกผ่าน profile-image/upload API)
      console.log('🔍 handleSubmit POST - Sending JSON data only');
      console.log('🔍 handleSubmit POST - Session data:', { 
        userId: (session?.user as any)?.id, 
        lineId: (session?.user as any)?.lineId,
        email: (session?.user as any)?.email 
      });
      console.log('🔍 handleSubmit POST - ResumePayload userId/lineId:', { 
        userId: resumePayload.userId, 
        lineId: resumePayload.lineId 
      });
      console.log('🔍 handleSubmit POST - formData.profileImage:', formData.profileImage);
      console.log('🔍 handleSubmit POST - resumePayload.education:', resumePayload.education);
      console.log('🔍 handleSubmit POST - resumePayload.education.length:', resumePayload.education?.length || 0);
      console.log('🔍 handleSubmit POST - resumePayload.workExperience:', resumePayload.workExperience);
      console.log('🔍 handleSubmit POST - resumePayload.workExperience.length:', resumePayload.workExperience?.length || 0);
      console.log('🔍 handleSubmit POST - resumePayload.previousGovernmentService:', resumePayload.previousGovernmentService);
      console.log('🔍 handleSubmit POST - resumePayload.previousGovernmentService.length:', resumePayload.previousGovernmentService?.length || 0);
      console.log('🔍 handleSubmit POST - Village Number Data:', {
        villageNumber: resumePayload.house_registration_village_number,
        alley: resumePayload.house_registration_alley,
        road: resumePayload.house_registration_road
      });
      console.log('🔍 handleSubmit POST - Emergency Workplace Data:', {
        name: resumePayload.emergency_workplace_name,
        district: resumePayload.emergency_workplace_district,
        province: resumePayload.emergency_workplace_province,
        phone: resumePayload.emergency_workplace_phone
      });

      const res = await fetch('/api/resume-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumePayload)
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('❌ ResumeDeposit create failed:', res.status, json);
        throw new Error(json?.message || 'ไม่สามารถบันทึกข้อมูลฝากประวัติได้');
      }

      const resumeId = json?.data?.id;
      console.log('✅ ResumeDeposit created:', resumeId);

      // 2. อัปโหลดรูปโปรไฟล์ (ถ้ามี)
      if (formData.profileImage && formData.profileImage instanceof File) {
        try {
          const imgFd = new FormData();
          imgFd.append('profileImage', formData.profileImage);
          imgFd.append('resumeId', resumeId);

          const imgRes = await fetch('/api/profile-image/upload', {
        method: 'POST',
            body: imgFd
          });

          if (!imgRes.ok) {
            console.error('❌ Profile image upload failed');
          } else {
            console.log('✅ Profile image uploaded');
          }
        } catch (err) {
          console.error('❌ Error uploading profile image:', err);
        }
      }
      // 3. อัปโหลดเอกสารแนบ (ถ้ามี)
      if (formData.documents) {
        const docTypes = [
          'idCard',
          'houseRegistration',
          'educationCertificate',
          'militaryCertificate',
          'medicalCertificate',
          'drivingLicense',
          'otherDocuments'
        ];

        for (const docType of docTypes) {
          const doc = formData.documents[docType as keyof typeof formData.documents];
          if (doc && doc instanceof File) {
            try {
              const docFd = new FormData();
              docFd.append('file', doc);
              docFd.append('resumeId', resumeId);
              docFd.append('documentType', docType);

              const docRes = await fetch('/api/documents', {
                    method: 'POST',
                body: docFd
              });

              if (!docRes.ok) {
                console.error(`❌ Document ${docType} upload failed`);
            } else {
                console.log(`✅ Document ${docType} uploaded`);
              }
            } catch (err) {
              console.error(`❌ Error uploading document ${docType}:`, err);
            }
          }
        }
      }

      console.log('✅ ResumeDeposit saved successfully');
      
      // Return the saved resume data
      return json.data;
      
    } catch (error) {
      console.error('❌ Error saving to ResumeDeposit:', error);
      throw error; // Re-throw error to be handled by handleSubmit
    }
  };

  // ฟังก์ชันสร้างใบสมัครงานในตาราง application_form
  const createApplicationForm = async (resumeId: string, departmentName: string, departmentId: string) => {
    try {
      console.log('📝 Creating ApplicationForm...');
      console.log('🔍 resumeId:', resumeId);
      console.log('🔍 departmentName:', departmentName);
      console.log('🔍 departmentId:', departmentId);
      
      // สร้าง payload สำหรับ application_form
      const applicationPayload = {
        resumeId: resumeId,
        userId: (session?.user as any)?.id || null,
        lineId: (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId || null,
        // ข้อมูลส่วนตัว
        prefix: formData.prefix || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber || null,
        idCardIssuedAt: formData.idCardIssuedAt || null,
        idCardIssueDate: formData.idCardIssueDate ? new Date(formData.idCardIssueDate) : null,
        idCardExpiryDate: formData.idCardExpiryDate ? new Date(formData.idCardExpiryDate) : null,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        age: formData.age ? Number(formData.age) : null,
        race: formData.race || null,
        placeOfBirth: formData.placeOfBirth || null,
        placeOfBirthProvince: formData.placeOfBirthProvince || null,
        gender: formData.gender || 'UNKNOWN',
        nationality: formData.nationality || null,
        religion: formData.religion || null,
        maritalStatus: formData.maritalStatus || 'UNKNOWN',
        // ที่อยู่
        addressAccordingToHouseRegistration: formData.addressAccordingToHouseRegistration || null,
        currentAddress: formData.currentAddress || null,
        phone: formData.phone || null,
        email: formData.email || null,
        // ข้อมูลฉุกเฉิน
        emergencyContact: formData.emergencyContact || null,
        emergencyPhone: formData.emergencyPhone || null,
        emergencyRelationship: formData.emergencyRelationship || null,
        emergencyAddress: formData.emergencyAddress || null,
        // ข้อมูลการสมัครงาน
        appliedPosition: formData.appliedPosition || departmentName,
        expectedSalary: formData.expectedSalary || null,
        availableDate: formData.availableDate ? new Date(formData.availableDate) : null,
        currentWork: formData.currentWork || false,
        department: departmentName,
        departmentId: departmentId,
        // ข้อมูลเพิ่มเติม
        skills: formData.skills || null,
        languages: formData.languages || null,
        computerSkills: formData.computerSkills || null,
        certificates: formData.certificates || null,
        references: formData.references || null,
        applicantSignature: formData.applicantSignature || null,
        applicationDate: formData.applicationDate ? new Date(formData.applicationDate) : new Date(),
        status: 'PENDING',
        // ข้อมูลการศึกษา
        education: (formData.education || []).map((e) => ({
          level: e.level,
          institution: e.institution,
          major: e.major || null,
          year: e.year || e.graduationYear || null,
          gpa: e.gpa ? parseFloat(e.gpa) : null
        })),
        // ประสบการณ์ทำงาน
        workExperience: (formData.workExperience || []).map((work) => ({
          position: work.position || null,
          company: work.company || null,
          startDate: work.startDate ? new Date(work.startDate) : null,
          endDate: work.endDate ? new Date(work.endDate) : null,
          salary: work.salary || null,
          reason: work.reason || null,
          district: work.district || null,
          province: work.province || null,
          phone: work.phone || null
        }))
      };

      console.log('🔍 ApplicationForm payload:', applicationPayload);

      const res = await fetch('/api/prisma/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationPayload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('❌ ApplicationForm create failed:', res.status, json);
        throw new Error(json?.message || 'ไม่สามารถสร้างใบสมัครงานได้');
      }

      console.log('✅ ApplicationForm created successfully:', json.data?.id);
      return json.data;
    } catch (error) {
      console.error('❌ Error creating ApplicationForm:', error);
      throw error; // Re-throw error to be handled by handleSubmit
    }
  };

  // ฟังก์ชันสำหรับสร้างข้อมูล random
  const generateRandomData = () => {
    const prefixes = ['นาย', 'นาง', 'นางสาว'];
    const firstNames = ['สมชาย', 'สมหญิง', 'สมศักดิ์', 'สมปอง', 'สมพร', 'สมคิด', 'สมบัติ', 'สมบูรณ์', 'สมหมาย', 'สมศักดิ์', 'สมปอง', 'สมพร', 'สมคิด', 'สมบัติ', 'สมบูรณ์', 'สมหมาย', 'สมศักดิ์', 'สมปอง', 'สมพร', 'สมคิด'];
    const lastNames = ['ใจดี', 'รักดี', 'เงินดี', 'ดีใจ', 'ผลิตดี', 'คิดดี', 'บินดี', 'ส่งดี', 'กฎหมายดี', 'บริการดี', 'จัดซื้อดี', 'ใจดี', 'รักดี', 'เงินดี', 'ดีใจ', 'ผลิตดี', 'คิดดี', 'บินดี', 'ส่งดี', 'กฎหมายดี'];
    const positions = ['โปรแกรมเมอร์', 'นักวิเคราะห์ระบบ', 'ผู้ดูแลระบบ', 'นักบัญชี', 'นักวิเคราะห์การเงิน', 'เจ้าหน้าที่การเงิน', 'นักการตลาด', 'นักประชาสัมพันธ์', 'นักออกแบบสื่อ', 'วิศวกรผลิต', 'เจ้าหน้าที่ควบคุมคุณภาพ', 'พนักงานผลิต', 'นักวิจัย', 'นักพัฒนาผลิตภัณฑ์', 'นักวิเคราะห์ข้อมูล', 'เจ้าหน้าที่บริการลูกค้า', 'นักสนับสนุนเทคนิค', 'ผู้จัดการลูกค้า', 'เจ้าหน้าที่จัดซื้อ', 'นักเจรจาต่อรอง'];
    const departments = ['แผนกเทคโนโลยีสารสนเทศ', 'แผนกทรัพยากรบุคคล', 'แผนกการเงินและบัญชี', 'แผนกการตลาด', 'แผนกผลิต', 'แผนกวิจัยและพัฒนา', 'แผนกบริการลูกค้า', 'แผนกจัดซื้อจัดจ้าง', 'แผนกกฎหมายและธุรการ'];
    const districts = ['เขตบางนา', 'เขตสาทร', 'เขตวัฒนา', 'เขตคลองเตย', 'เขตจตุจักร', 'เขตดุสิต', 'เขตบางกะปิ', 'เขตห้วยขวาง', 'เขตบางรัก', 'เขตดินแดง'];
    const provinces = ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'นครปฐม', 'ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี', 'อ่างทอง', 'ลพบุรี'];
    const universities = ['จุฬาลงกรณ์มหาวิทยาลัย', 'มหาวิทยาลัยธรรมศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยมหิดล', 'มหาวิทยาลัยเชียงใหม่', 'มหาวิทยาลัยขอนแก่น', 'มหาวิทยาลัยสงขลานครินทร์', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'มหาวิทยาลัยเทคโนโลยีสุรนารี'];
    const majors = ['วิศวกรรมคอมพิวเตอร์', 'วิทยาการคอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ', 'บริหารธุรกิจ', 'บัญชี', 'การเงิน', 'การตลาด', 'การจัดการ', 'เศรษฐศาสตร์', 'นิติศาสตร์'];
    const companies = ['บริษัท เอ บี ซี จำกัด', 'บริษัท เทคโนโลยี จำกัด', 'บริษัท การเงิน จำกัด', 'บริษัท การตลาด จำกัด', 'บริษัท ผลิต จำกัด', 'บริษัท บริการ จำกัด', 'บริษัท ค้าปลีก จำกัด', 'บริษัท โรงงาน จำกัด', 'บริษัท ออฟฟิศ จำกัด', 'บริษัท ระบบ จำกัด'];
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    // const randomDepartment = departments[Math.floor(Math.random() * departments.length)]; // ไม่ใช้แล้ว - ให้เลือกจาก Dashboard
    const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    const randomUniversity = universities[Math.floor(Math.random() * universities.length)];
    const randomMajor = majors[Math.floor(Math.random() * majors.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    
    // สร้างเลขบัตรประชาชน random
    const randomIdNumber = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    
    // สร้างเบอร์โทร random (10 หลัก)
    const randomPhone = '0' + (Math.floor(Math.random() * 900000000) + 100000000).toString().slice(0, 9);
    
    // สร้างเงินเดือน random
    const randomSalary = Math.floor(Math.random() * 50000) + 15000;
    
    // สร้างวันที่ random
    const randomYear = Math.floor(Math.random() * 10) + 2560;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;

    return {
      profileImage: undefined,
      prefix: randomPrefix,
      firstName: randomFirstName,
      lastName: randomLastName,
      idNumber: randomIdNumber.toString(),
      idCardIssuedAt: randomDistrict,
      idCardIssueDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear}`,
      idCardExpiryDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear + 10}`,
      birthDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear - 30}`,
      age: (randomYear - 2530).toString(),
      race: 'ไทย',
      placeOfBirth: randomProvince,
      placeOfBirthProvince: randomProvince,
      gender: randomPrefix === 'นาย' ? 'ชาย' : 'หญิง',
      nationality: 'ไทย',
      religion: 'พุทธ',
      maritalStatus: Math.random() > 0.5 ? 'สมรส' : 'โสด',
      addressAccordingToHouseRegistration: `123/4 หมู่ 4 ตำบล${randomDistrict} อำเภอ${randomDistrict} จังหวัด${randomProvince} ${Math.floor(Math.random() * 90000) + 10000}`,
      currentAddress: `123/4 หมู่ 4 ตำบล${randomDistrict} อำเภอ${randomDistrict} จังหวัด${randomProvince} ${Math.floor(Math.random() * 90000) + 10000}`,
      phone: randomPhone,
      email: `${randomFirstName.toLowerCase()}${randomLastName.toLowerCase()}@example.com`,
      emergencyContact: `${randomPrefix === 'นาย' ? 'นาง' : 'นาย'}${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} (${Math.random() > 0.5 ? 'ภรรยา' : 'สามี'})`,
      emergencyContactFirstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      emergencyContactLastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      emergencyPhone: '0' + (Math.floor(Math.random() * 900000000) + 100000000).toString().slice(0, 9),
      emergencyRelationship: Math.random() > 0.5 ? 'ภรรยา' : 'สามี',
      emergencyAddress: {
        houseNumber: (Math.floor(Math.random() * 900) + 100).toString(),
        villageNumber: (Math.floor(Math.random() * 20) + 1).toString(),
        alley: `สุขุมวิท ${Math.floor(Math.random() * 100) + 1}`,
        road: 'สุขุมวิท',
        subDistrict: `ตำบล${randomDistrict}`,
        district: randomDistrict,
        province: randomProvince,
        postalCode: (Math.floor(Math.random() * 90000) + 10000).toString(),
        phone: '0' + (Math.floor(Math.random() * 900000000) + 100000000).toString().slice(0, 9)
      },
      emergencyWorkplace: {
        name: `${randomCompany} (สำนักงานใหญ่) - ฝ่ายบุคคล`,
        district: randomDistrict,
        province: randomProvince,
        phone: '0' + (Math.floor(Math.random() * 900000000) + 100000000).toString().slice(0, 9),
      },
      education: [
        {
          level: 'ปริญญาตรี',
          institution: randomUniversity,
          major: randomMajor,
          year: (randomYear - 10).toString(),
          gpa: (Math.random() * 2 + 2).toFixed(2)
        },
        {
          level: 'มัธยมศึกษาตอนปลาย',
          institution: `โรงเรียน${randomDistrict}`,
          major: 'วิทยาศาสตร์-คณิตศาสตร์',
          year: (randomYear - 14).toString(),
          gpa: (Math.random() * 2 + 2).toFixed(2)
        }
      ],
      workExperience: [
        {
          position: randomPosition,
          company: randomCompany,
          startDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear - 8}`,
          endDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear - 2}`,
          salary: randomSalary.toString(),
          reason: 'ต้องการพัฒนาตัวเองในด้านใหม่'
        },
        {
          position: positions[Math.floor(Math.random() * positions.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          startDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear - 12}`,
          endDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear - 8}`,
          salary: (randomSalary - 5000).toString(),
          reason: 'บริษัทปิดกิจการ'
        }
      ],
      skills: `การเขียนโปรแกรมด้วย JavaScript, React, Node.js, Python, Java, การออกแบบฐานข้อมูล, การวิเคราะห์ระบบ, การจัดการโปรเจกต์, การทำงานเป็นทีม, การแก้ไขปัญหา, การเรียนรู้เทคโนโลยีใหม่`,
      languages: Math.random() > 0.5 ? 'ไทย (ภาษาแม่), อังกฤษ (ระดับกลาง), จีน (ระดับพื้นฐาน)' : 'ไทย (ภาษาแม่), อังกฤษ (ระดับสูง), ญี่ปุ่น (ระดับพื้นฐาน)',
      computerSkills: `Microsoft Office (Word, Excel, PowerPoint, Access), Adobe Photoshop, การใช้งานอินเทอร์เน็ต, การเขียนโปรแกรม, การใช้งานระบบฐานข้อมูล, การใช้งานเครื่องมือพัฒนาโปรแกรม`,
      certificates: `ใบรับรองการอบรม ${randomMajor}, ใบรับรองการอบรม Database Design, ใบรับรองการอบรม Agile Development`,
      references: `นาย${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} - หัวหน้าฝ่าย IT (${randomPhone}), นาง${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} - ผู้จัดการฝ่ายบุคคล (${randomPhone})`,
      appliedPosition: randomPosition,
      expectedSalary: `${randomSalary}-${randomSalary + 10000}`,
      availableDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear + 1}`,
      currentWork: false,
      department: '', // ไม่กรอกฟิลด์ฝ่าย/กลุ่มงาน - ให้เลือกจาก Dashboard
      applicantSignature: `${randomFirstName} ${randomLastName}`,
      applicationDate: `${randomDay.toString().padStart(2, '0')}/${randomMonth.toString().padStart(2, '0')}/${randomYear}`,
      documents: {
        idCard: undefined,
        houseRegistration: undefined,
        militaryCertificate: undefined, // ไม่บังคับ - ผู้ชายสามารถแนบได้
        educationCertificate: undefined,
        medicalCertificate: undefined, // ไม่บังคับ - ตามที่บริษัทกำหนด
        drivingLicense: undefined, // ไม่บังคับ - ถ้ามีก็ดี
        nameChangeCertificate: undefined,
        otherDocuments: [],
      },
      multipleEmployers: ['บริษัท เทคโนโลยี จำกัด', 'บริษัท ซอฟต์แวร์ จำกัด'],
      spouseInfo: {
        firstName: 'สมหญิง',
        lastName: 'ใจดี',
      },
      registeredAddress: {
        houseNumber: '123',
        villageNumber: '4',
        alley: 'สุขุมวิท 42',
        road: 'สุขุมวิท',
        subDistrict: 'บางนาใต้',
        district: 'เขตบางนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10260',
        phone: '02-123-4567',
        mobile: '081-234-5678',
      },
      currentAddressDetail: {
        houseNumber: '123',
        villageNumber: '4',
        alley: 'สุขุมวิท 42',
        road: 'สุขุมวิท',
        subDistrict: 'บางนาใต้',
        district: 'เขตบางนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10260',
        homePhone: '021234567',
        mobilePhone: '0812345678',
      },
      staffInfo: {
        position: 'โปรแกรมเมอร์อาวุโส',
        department: 'ฝ่ายเทคโนโลยีสารสนเทศ (IT Department)',
        startWork: '01/02/2567',
      },
      previousGovernmentService: []
    };

    // ข้อมูลตัวอย่างถูกลบออกแล้ว ใช้ปุ่ม "กรอกข้อมูลตัวอย่าง (Random)" แทน
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header like official-documents */}
      <div className="bg-white  ">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-blue-600 rounded-xl">
                <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">ฝากประวัติและเอกสารสมัครงาน</h1>
                <p className="text-sm sm:text-base text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
                {departmentName && (
                <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
                    <span className="text-sm font-medium text-green-800">
                        สมัครงานฝ่าย: <span className="font-bold">{departmentName}</span>
                    </span>
          </div>
                    {/* {departmentId && (
                    <div className="text-xs text-green-700">
                        <span className="font-medium">รหัสแผนก:</span> {departmentId}
                    </div>
                  )} */}
                </div>
              )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                color="primary"
                variant="flat"
                startContent={<ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-200 text-xs sm:text-sm"
              >
                กลับไปหน้า Dashboard
              </Button>
            </div>
          </div>
        </div>
        </div>

      {/* Navigation like official-documents */}
      {/* <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <Button color="primary" variant="ghost" onClick={() => router.back()} className="hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap">
              ย้อนกลับ
            </Button>
            <Button color="primary" variant="ghost" startContent={<ChevronLeftIcon className="w-3 h-3 sm:w-5 sm:h-5" />} onClick={() => scrollTo('profile')} className="hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap">โปรไฟล์</Button>
            <Button color="primary" variant="ghost" onClick={() => scrollTo('work')} className="hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap">ประสบการณ์</Button>
            <Button color="primary" variant="ghost" onClick={() => scrollTo('education')} className="hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap">การศึกษา</Button>
            <Button color="primary" variant="ghost" onClick={() => scrollTo('extra')} className="hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap">ข้อมูลเพิ่มเติม</Button>
            <Button color="primary" variant="ghost" endContent={<ChevronRightIcon className="w-3 h-3 sm:w-5 sm:h-5" />} onClick={() => scrollTo('documents')} className="hover:bg-blue-50 text-xs sm:text-sm whitespace-nowrap">แนบเอกสาร</Button>
          </div>
        </div>
      </div> */}
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* ปุ่มทดสอบ validation และกรอกข้อมูลตัวอย่าง */}
         {/*<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">ทดสอบการตรวจสอบข้อมูล</h3>
              <p className="text-sm text-blue-600">กดปุ่มด้านขวาเพื่อดูว่าต้องกรอกข้อมูลอะไรบ้าง หรือกรอกข้อมูลตัวอย่างเพื่อทดสอบ</p>
            </div>
            <div className="flex gap-3">
              <Button
                color="warning"
                variant="bordered"
                onClick={() => {
                  const randomData = generateRandomData();
                  setFormData(randomData);
                  setErrors({});
                  console.log('🎲 กรอกข้อมูลตัวอย่างแบบ Random เรียบร้อยแล้ว! ข้อมูลจะแตกต่างกันทุกครั้งที่กดปุ่มนี้');
                }}
                className="bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                🎲 กรอกข้อมูลตัวอย่าง (Random)
              </Button>
              <Button
                color="warning"
                variant="bordered"
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ที่จะล้างข้อมูลทั้งหมดและเริ่มต้นใหม่?')) {
                    setFormData({
                      profileImage: undefined,
                      prefix: '',
                      firstName: '',
                      lastName: '',
                      idNumber: '',
                      idCardIssuedAt: '',
                      idCardIssueDate: '',
                      idCardExpiryDate: '',
                      birthDate: '',
                      age: '',
                      race: '',
                      placeOfBirth: '',
                      placeOfBirthProvince: '',
                      gender: '',
                      nationality: '',
                      religion: '',
                      maritalStatus: '',
                      addressAccordingToHouseRegistration: '',
                      currentAddress: '',
                      phone: '',
                      email: '',
                      emergencyContact: '',
                      emergencyContactFirstName: '',
                      emergencyContactLastName: '',
                      emergencyPhone: '',
                      emergencyRelationship: '',
                      emergencyAddress: {
                        houseNumber: '',
                        villageNumber: '',
                        alley: '',
                        road: '',
                        subDistrict: '',
                        district: '',
                        province: '',
                        postalCode: '',
                        phone: '',
                      },
                      emergencyWorkplace: {
                        name: '',
                        district: '',
                        province: '',
                        phone: '',
                      },
                      education: [],
                      workExperience: [],
                      previousGovernmentService: [],
                      skills: '',
                      languages: '',
                      computerSkills: '',
                      certificates: '',
                      references: '',
                      appliedPosition: '',
                      expectedSalary: '',
                      availableDate: '',
                      currentWork: false,
                      department: '',
                      applicantSignature: '',
                      applicationDate: '',
                      documents: {},
                      multipleEmployers: [],
                      spouseInfo: {
                        firstName: '',
                        lastName: '',
                      },
                      registeredAddress: {
                        houseNumber: '',
                        villageNumber: '',
                        alley: '',
                        road: '',
                        subDistrict: '',
                        district: '',
                        province: '',
                        postalCode: '',
                        phone: '',
                        mobile: '',
                      },
                      currentAddressDetail: {
                        houseNumber: '',
                        villageNumber: '',
                        alley: '',
                        road: '',
                        subDistrict: '',
                        district: '',
                        province: '',
                        postalCode: '',
                        homePhone: '',
                        mobilePhone: '',
                      },
                      medicalRights: {
                        hasUniversalHealthcare: false,
                        universalHealthcareHospital: '',
                        hasSocialSecurity: false,
                        socialSecurityHospital: '',
                        dontWantToChangeHospital: false,
                        wantToChangeHospital: false,
                        newHospital: '',
                        hasCivilServantRights: false,
                        otherRights: '',
                      },
                      staffInfo: {
                        position: '',
                        department: '',
                        startWork: '',
                      }
                    });
                    setErrors({});
                    console.log('🔄 ล้างข้อมูลเรียบร้อยแล้ว! ตอนนี้คุณสามารถกรอกข้อมูลใหม่ได้');
                  }
                }}
                className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                🗑️ ล้างข้อมูล
              </Button>
              <Button
                color="success"
                variant="bordered"
                onClick={fillRandomData}
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              >
                🎲 กรอกข้อมูลตัวอย่าง
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onClick={() => {
                  const errors = validateForm();
                  
                  // Debug: แสดงสถานะเอกสารแนบ
                  console.log('🔍 Document Status Debug:');
                  console.log('• formData.documents:', formData.documents);
                  console.log('• uploadedDocuments:', uploadedDocuments);
                  console.log('• hasIdCard:', formData.documents?.idCard || uploadedDocuments.some(doc => doc.documentType === 'idCard'));
                  console.log('• hasHouseRegistration:', formData.documents?.houseRegistration || uploadedDocuments.some(doc => doc.documentType === 'houseRegistration'));
                  console.log('• hasEducationCertificate:', formData.documents?.educationCertificate || uploadedDocuments.some(doc => doc.documentType === 'educationCertificate'));
                  console.log('• hasMilitaryCertificate:', formData.documents?.militaryCertificate || uploadedDocuments.some(doc => doc.documentType === 'militaryCertificate'));
                  
                  if (Object.keys(errors).length === 0) {
                    console.log('✅ ข้อมูลครบถ้วนแล้ว! สามารถกดบันทึกได้');
                  } else {
                    console.error(`❌ ข้อมูลไม่ครบถ้วน\n\nมีข้อผิดพลาด ${Object.keys(errors).length} รายการ:\n\n${Object.keys(errors).map(key => `• ${errors[key]}`).join('\n')}`);
                  }
                }}
              >
                ทดสอบ Validation
              </Button>
            </div>
          </div>
        </div>*/}
        
        {/* Hidden file input for profile image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            
            // ตรวจสอบว่ามี resume ID หรือไม่
            if (!savedResume?.id) {
              // สร้าง resume ID ชั่วคราวสำหรับอัปโหลดรูปภาพ
              console.log('🔍 ไม่มี resume ID - สร้าง ID ชั่วคราวสำหรับอัปโหลดรูปภาพ');
              const tempId = `temp_${Date.now()}`;
              
              // ตั้งค่า savedResume ชั่วคราว
              setSavedResume({
                id: tempId,
                firstName: formData.firstName || 'ไม่ระบุ',
                lastName: formData.lastName || 'ไม่ระบุ',
                email: formData.email || 'ไม่ระบุ@example.com',
                profileImageUrl: null
              });
              
              // ใช้ tempId สำหรับอัปโหลด
              const form = new FormData()
              form.append('file', file)
              form.append('applicationId', tempId)
              
              setIsUploading(true);
              setUploadProgress(0);
              
              // ใช้ XMLHttpRequest เพื่อติดตาม progress
              const xhr = new XMLHttpRequest();
              
              xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                  const percentComplete = Math.round((e.loaded / e.total) * 100);
                  setUploadProgress(percentComplete);
                }
              });
              
              xhr.addEventListener('load', () => {
                setIsUploading(false);
                setUploadProgress(0);
                
                if (xhr.status === 200) {
                  try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.profileImage) {
                  console.log('✅ Profile image upload success with temp ID:', data.profileImage);
                  setProfileImage(`/api/image?file=${data.profileImage}`)
                  setFormData((prev: any) => ({ ...prev, profileImage: file }))
                  
                  // อัปเดต savedResume ด้วย
                  setSavedResume((prev: any) => prev ? {
                    ...prev,
                    profileImageUrl: data.profileImage
                  } : {
                    profileImageUrl: data.profileImage
                  });
                  
                  console.log('🔍 Updated formData.profileImage:', file);
                  console.log('🔍 Updated savedResume.profileImageUrl:', data.profileImage);
                  console.log('✅ อัปโหลดรูปภาพเรียบร้อยแล้ว (จะบันทึกเมื่อบันทึกข้อมูลส่วนตัว)')
                } else {
                  console.error('❌ Profile image upload failed:', data);
                  console.error('❌ อัปโหลดรูปภาพไม่สำเร็จ')
                }
              } catch (err) {
                    console.error('❌ Error parsing response:', err);
                  }
                } else {
                  console.error('❌ Upload failed with status:', xhr.status);
                }
                
                if (fileInputRef.current) fileInputRef.current.value = '';
              });
              
              xhr.addEventListener('error', () => {
                setIsUploading(false);
                setUploadProgress(0);
                console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
                if (fileInputRef.current) fileInputRef.current.value = '';
              });
              
              xhr.open('POST', '/api/profile-image/upload');
              xhr.send(form);
                return;
            }
            
            const form = new FormData()
            form.append('file', file)
            form.append('applicationId', savedResume.id) // ใช้ resume ID จริง
            
            setIsUploading(true);
            setUploadProgress(0);
            
            // ใช้ XMLHttpRequest เพื่อติดตาม progress
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(percentComplete);
              }
            });
            
            xhr.addEventListener('load', () => {
              setIsUploading(false);
              setUploadProgress(0);
              
              if (xhr.status === 200) {
                try {
                  const data = JSON.parse(xhr.responseText);
                  if (data.profileImage) {
                console.log('✅ Profile image upload success:', data.profileImage);
                setProfileImage(`/api/image?file=${data.profileImage}`)
                setFormData((prev: any) => ({ ...prev, profileImage: file }))
                
                // อัปเดต savedResume ด้วย
                setSavedResume((prev: any) => prev ? {
                  ...prev,
                  profileImageUrl: data.profileImage
                } : {
                  profileImageUrl: data.profileImage
                });
                
                console.log('🔍 Updated formData.profileImage:', file);
                console.log('🔍 Updated savedResume.profileImageUrl:', data.profileImage);
                console.log('✅ อัปโหลดรูปภาพเรียบร้อยแล้ว')
              } else {
                console.error('❌ Profile image upload failed:', data);
                console.error('❌ อัปโหลดรูปภาพไม่สำเร็จ')
              }
            } catch (err) {
                  console.error('❌ Error parsing response:', err);
                }
              } else {
                console.error('❌ Upload failed with status:', xhr.status);
              }
              
              if (fileInputRef.current) fileInputRef.current.value = '';
            });
            
            xhr.addEventListener('error', () => {
              setIsUploading(false);
              setUploadProgress(0);
              console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
              if (fileInputRef.current) fileInputRef.current.value = '';
            });
            
            xhr.open('POST', '/api/profile-image/upload');
            xhr.send(form);
          }}
        />
        {/* Profile Image Section */}
        <Card className="mb-8  bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
                <h2 className="text-2xl font-bold text-gray-900">รูปภาพโปรไฟล์</h2>
              </div>
              
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center">
              {(() => {
                console.log('🔍 Current profileImage state:', profileImage);
                console.log('🔍 isProfileLoaded state:', isProfileLoaded);
                console.log('🔍 profileData state:', profileData);
                console.log('🔍 savedResume state:', savedResume);
                console.log('🔍 formData.profileImage state:', formData.profileImage);
                console.log('🔍 savedResume.profileImageUrl:', savedResume?.profileImageUrl);
                console.log('🔍 profileData.profileImageUrl:', profileData?.profileImageUrl);
                
                // ตรวจสอบว่าควรแสดงรูปภาพหรือไม่
                if (!profileImage && savedResume?.profileImageUrl) {
                  console.log('🔍 ควรแสดงรูปภาพจาก savedResume.profileImageUrl:', savedResume.profileImageUrl);
                  const imagePath = `/api/image?file=${savedResume.profileImageUrl}`;
                  console.log('🔍 กำลังตั้งค่า profileImage state:', imagePath);
                  setProfileImage(imagePath);
                } else if (!profileImage && profileData?.profileImageUrl) {
                  console.log('🔍 ควรแสดงรูปภาพจาก profileData.profileImageUrl:', profileData.profileImageUrl);
                  const imagePath = `/api/image?file=${profileData.profileImageUrl}`;
                  console.log('🔍 กำลังตั้งค่า profileImage state:', imagePath);
                  setProfileImage(imagePath);
                }
                
                return null;
              })()}
              {profileImage ? (
                <>
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="รูปภาพโปรไฟล์"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      onLoad={() => {
                        console.log('✅ รูปภาพโหลดสำเร็จ:', profileImage);
                      }}
                      onError={(e) => {
                        console.log('❌ รูปภาพโหลดไม่สำเร็จ:', profileImage);
                        console.log('❌ Error details:', e);
                        setProfileImage(null);
                      }}
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      R
                    </div>
                    {/* ปุ่ม Preview รูปภาพ */}
                    <button
                      onClick={() => {
                        if (profileImage) {
                          // สร้าง File object จาก URL สำหรับ preview
                          fetch(profileImage)
                            .then(response => response.blob())
                            .then(blob => {
                              const file = new File([blob], 'profile-image.jpg', { type: blob.type });
                              handlePreviewFile(file, 'รูปภาพโปรไฟล์');
                            })
                            .catch(error => {
                              console.error('Error creating file for preview:', error);
                            });
                        }
                      }}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 opacity-70 hover:opacity-100"
                      title="ดูรูปภาพขนาดใหญ่"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-blue-600 mt-3 font-medium">
                    {savedResume?.profileImageUrl ? 'รูปภาพที่บันทึกไว้แล้ว' : profileData?.profileImageUrl ? 'รูปภาพจากโปรไฟล์' : 'รูปภาพใหม่'}
                  </p>
                  <div className="mt-4 flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors duration-200 flex items-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {isUploading && (
                        <div 
                          className="absolute inset-0 bg-blue-400 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      )}
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="relative z-10">
                        {isUploading ? `กำลังอัปโหลด ${uploadProgress}%` : 'อัปโหลดรูปใหม่'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('🗑️ กำลังลบรูปภาพ...');
                        setProfileImage(null);
                        setFormData(prev => ({ ...prev, profileImage: undefined }));
                        // ลบรูปภาพจาก savedResume ด้วย
                        if (savedResume) {
                          setSavedResume(prev => prev ? { ...prev, profileImageUrl: null } : null);
                        }
                        // ลบรูปภาพจาก profileData ด้วย
                        if (profileData) {
                          setProfileData(prev => prev ? { ...prev, profileImageUrl: null } : null);
                        }
                        console.log('✅ ลบรูปภาพเรียบร้อยแล้ว');
                      }}
                      className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors duration-200 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      ลบรูปภาพ
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-40 h-40 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  <p className="text-sm text-gray-500 mt-3">
                    ไม่มีรูปภาพโปรไฟล์
                  </p>
                  
                  {savedResume?.profileImageUrl && (
                    <p className="text-xs text-gray-400 mt-1">
                      รูปภาพที่บันทึกไว้: {savedResume.profileImageUrl}
                    </p>
                  )}
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {isUploading && (
                        <div 
                          className="absolute inset-0 bg-blue-400 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      )}
                      <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="relative z-10">
                        {isUploading ? `กำลังอัปโหลด ${uploadProgress}%` : 'อัปโหลดรูปโปรไฟล์'}
                      </span>
                    </button>
                    
                    
                    
              </div>
                 
                </>
              )}
            </div>
          </CardBody>
        </Card>
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex overflow-x-auto">
              {/* {savedResume && (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-b border-green-200 w-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <div className="text-sm text-green-700">
                    บันทึกแล้ว: {savedResume.firstName} {savedResume.lastName} • สถานะ {savedResume.status || 'PENDING'}
                  </div>
                </div>
              )} */}
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ข้อมูลส่วนตัว
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('education')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'education'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ประวัติการศึกษา
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('work')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'work'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ประวัติการทำงาน
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'skills'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ข้อมูลความรู้ ความสามารถ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('position')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'position'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ตำแหน่งงานที่สนใจ
              </button>
              {/* <button
                type="button"
                onClick={() => setActiveTab('special')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'special'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ทักษะพิเศษ
              </button> */}
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ไฟล์แนบ
              </button>
            </div>
          </div>
        </div>

        {/* Saved snapshot summary */}
        {/* {savedResume && showPreview && (
          <Card className="mb-6 shadow-md border-0 bg-green-50">
            <CardBody className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-green-700 font-semibold mb-1">
                    {savedResume?.id ? 'อัปเดตข้อมูลเรียบร้อยแล้ว' : 'บันทึกข้อมูลใหม่เรียบร้อยแล้ว'}
                  </div>
                  <div className="text-sm text-green-800">
                    <span className="font-medium">ชื่อ-นามสกุล:</span> {savedResume.firstName} {savedResume.lastName}
                  </div>
                  <div className="text-sm text-green-800">
                    <span className="font-medium">ตำแหน่งที่สนใจ:</span> {savedResume.expectedPosition || '-'}
                  </div>
                  {resumeId && (
                    <div className="text-xs text-blue-600 mt-1">
                      📄 โหลดจาก Resume ID: {resumeId}
                    </div>
                  )}
                  <div className="text-sm text-green-800">
                    <span className="font-medium">สถานะ:</span> {savedResume.status || 'PENDING'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-green-700">
                    การศึกษา: {(savedResume.education?.length ?? 0)} รายการ • ประสบการณ์: {(savedResume.workExperience?.length ?? 0)} รายการ
                  </div>
                  <Button size="sm" variant="light" className="text-green-700" onClick={() => setShowPreview(false)}>ซ่อน</Button>
                </div>
            </div>
          </CardBody>
        </Card>
        )} */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ข้อมูลส่วนตัว */}
          {activeTab === 'personal' && (
          <Card className="shadow-xl border-0">
            <div ref={sectionRefs.profile} />
            <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ๑. ประวัติส่วนตัว */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                  ๑. ประวัติส่วนตัว
                </h3>
                
                {/* ๑.๑ ชื่อ (นาย/นาง/นางสาว) */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4 text-left">
                    ๑.๑ ชื่อ (นาย/นาง/นางสาว)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">คำนำหน้า<span className="text-red-500">*</span></label>
                  <select
                    name="prefix"
                         data-error-key="prefix"
                    value={formData.prefix}
                         onChange={(e) => handleInputChange('prefix', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('prefix') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">เลือกคำนำหน้า</option>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="ดร.">ดร.</option>
                    <option value="ผศ.">ผศ.</option>
                    <option value="รศ.">รศ.</option>
                    <option value="ศ.">ศ.</option>
                  </select>
                       {hasError('prefix') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('prefix')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ชื่อ<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                         data-error-key="firstName"
                    value={formData.firstName}
                         onChange={(e) => handleTextOnlyChange('firstName', e.target.value)}
                    placeholder="กรอกชื่อ (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('firstName') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('firstName') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('firstName')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">นามสกุล<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                         data-error-key="lastName"
                    value={formData.lastName}
                         onChange={(e) => handleTextOnlyChange('lastName', e.target.value)}
                    placeholder="กรอกนามสกุล (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('lastName') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('lastName') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('lastName')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">วัน เดือน ปีเกิด<span className="text-red-500">*</span></label>
                  <ThaiDatePicker
                    value={formData.birthDate}
                    onChange={(date) => {
                      handleInputChange('birthDate', date);
                      // คำนวณอายุอัตโนมัติจากวันเกิด
                      if (date) {
                        const birthDate = new Date(date);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        handleInputChange('age', age.toString());
                      }
                         }}
                         placeholder="เลือกวัน เดือน ปีเกิด"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                            hasError('birthDate') 
                        ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-500 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('birthDate') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('birthDate')}</p>
                       )}
                </div>
                <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">อายุ<span className="text-red-500">*</span></label>
                  <input
                         type="text"
                         name="age"
                         data-error-key="age"
                         value={formData.age}
                          onChange={(e) => handleNumberOnlyChange('age', e.target.value)}
                         placeholder="กรอกอายุ (จะคำนวณอัตโนมัติจากวันเกิด)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('age') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('age') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('age')}</p>
                  )}
                       
                </div>

                <div className="space-y-2">
                                               <label className="text-sm font-medium text-gray-700">สถานที่เกิด อำภเอ/เขต<span className="text-red-500">*</span></label>
                  <input
                         type="text"
                         name="placeOfBirth"
                         data-error-key="placeOfBirth"
                         value={formData.placeOfBirth || ''}
                         onChange={(e) => handleTextOnlyChange('placeOfBirth', e.target.value)}
                         placeholder="กรอกสถานที่เกิด (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('placeOfBirth') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('placeOfBirth') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('placeOfBirth')}</p>
                  )}
                </div>
                <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                  <input
                         type="text"
                         name="placeOfBirthProvince"
                         data-error-key="placeOfBirthProvince"
                         value={formData.placeOfBirthProvince || ''}
                         onChange={(e) => handleTextOnlyChange('placeOfBirthProvince', e.target.value)}
                         placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('placeOfBirthProvince') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('placeOfBirthProvince') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('placeOfBirthProvince')}</p>
                  )}
                </div>
                <div className="space-y-2">
                                               <label className="text-sm font-medium text-gray-700">เชื้อชาติ<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                         name="race"
                         data-error-key="race"
                         value={formData.race || ''}
                         onChange={(e) => handleTextOnlyChange('race', e.target.value)}
                         placeholder="กรอกเชื้อชาติ (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('race') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                       />
                       {hasError('race') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('race')}</p>
                  )}
                </div>
                <div className="space-y-2">
                                               <label className="text-sm font-medium text-gray-700">สัญชาติ<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="nationality"
                         data-error-key="nationality"
                    value={formData.nationality}
                         onChange={(e) => handleTextOnlyChange('nationality', e.target.value)}
                    placeholder="กรอกสัญชาติ (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('nationality') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('nationality') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('nationality')}</p>
                  )}
                </div>
                <div className="space-y-2">
                                               <label className="text-sm font-medium text-gray-700">ศาสนา<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="religion"
                         data-error-key="religion"
                    value={formData.religion}
                         onChange={(e) => handleTextOnlyChange('religion', e.target.value)}
                    placeholder="กรอกศาสนา (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('religion') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                       />
                       {hasError('religion') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('religion')}</p>
                       )}
                     </div>
                {/* เบอร์โทรศัพท์ */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์<span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    data-error-key="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="กรอกเบอร์โทรศัพท์ เช่น 0812345678"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      hasError('phone') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {hasError('phone') && (
                    <p className="text-red-500 text-xs mt-1">{getErrorMessage('phone')}</p>
                  )}
                </div>
                {/* อีเมล */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">อีเมล<span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    data-error-key="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="กรอกอีเมล เช่น example@email.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      hasError('email') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {hasError('email') && (
                    <p className="text-red-500 text-xs mt-1">{getErrorMessage('email')}</p>
                  )}
                </div>
                    <div>
                                             <span className="text-sm text-gray-600">เพศ<span className="text-red-500">*</span></span>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="gender" 
                            value="ชาย"
                            checked={formData.gender === 'ชาย'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-4 h-4" 
                          />
                          <span>ชาย</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="gender" 
                            value="หญิง"
                            checked={formData.gender === 'หญิง'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-4 h-4" 
                          />
                          <span>หญิง</span>
                        </label>
                      </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                    </div>
                  </div>
                </div>

                {/* ๑.๒ สถานภาพทางครอบครัว */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-left">๑.๒ สถานภาพทางครอบครัว<span className="text-red-500">*</span></h4>
                  <div className="space-y-3">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="โสด"
                          checked={formData.maritalStatus === 'โสด'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>โสด</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="สมรส"
                          checked={formData.maritalStatus === 'สมรส'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>สมรส</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="หย่าร้าง"
                          checked={formData.maritalStatus === 'หย่าร้าง'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>หย่าร้าง</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="หม้าย"
                          checked={formData.maritalStatus === 'หม้าย'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>หม้าย</span>
                      </label>
                    </div>
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-xs mt-1">{errors.maritalStatus}</p>
                    )}
                    
                    {/* ข้อมูลคู่สมรส */}
                    {formData.maritalStatus === 'สมรส' && (
                      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                        <h5 className="font-medium text-gray-800 mb-3">ข้อมูลคู่สมรส</h5>
                        <div className="space-y-4">
                <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ชื่อ-สกุล คู่สมรส<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                    value={`${formData.spouseInfo?.firstName || ''} ${formData.spouseInfo?.lastName || ''}`.trim()}
                    onChange={(e) => {
                      const fullName = e.target.value;
                      // กรองตัวเลขออก
                      const filteredName = fullName.replace(/\d/g, '');
                      const nameParts = filteredName.split(' ');
                      const firstName = nameParts[0] || '';
                      const lastName = nameParts.slice(1).join(' ') || '';
                      setFormData(prev => ({
                        ...prev,
                        spouseInfo: {
                          firstName: firstName,
                          lastName: lastName
                        }
                      }));
                    }}
                    placeholder="กรอกชื่อ-สกุล คู่สมรส"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                      hasError('spouseInfoFirstName') || hasError('spouseInfoLastName')
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                            {(hasError('spouseInfoFirstName') || hasError('spouseInfoLastName')) && (
                              <p className="text-red-500 text-xs mt-1">
                                {getErrorMessage('spouseInfoFirstName') || getErrorMessage('spouseInfoLastName')}
                              </p>
                  )}
                          </div>
                        </div>
                      </div>
                  )}
                  </div>
                </div>

                {/* ๑.๓ เลขที่บัตรประจำตัวประชาชน */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๓ เลขที่บัตรประจำตัวประชาชน<span className="text-red-500">*</span></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                                               <label className="text-sm font-medium text-gray-700">เลขบัตรประชาชน<span className="text-red-500">*</span></label>
                       <input
                         type="text"
                         name="idNumber"
                         data-error-key="idNumber"
                         value={formData.idNumber}
                          onChange={(e) => handleIdNumberChange(e.target.value)}
                         placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('idNumber') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    />
                      <div className="flex justify-between items-center">
                       {hasError('idNumber') && (
                          <p className="text-red-500 text-xs">{getErrorMessage('idNumber')}</p>
                  )}
                        <p className="text-xs text-gray-500 ml-auto">
                          {formData.idNumber.length}/13 หลัก
                        </p>
                      </div>
                </div>
                  <div className="space-y-2">
                                             <label className="text-sm font-medium text-gray-700">ออกให้ ณ อำเภอ/เขต<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        name="idCardIssuedAt"
                        data-error-key="idCardIssuedAt"
                        value={formData.idCardIssuedAt}
                        onChange={(e) => handleTextOnlyChange('idCardIssuedAt', e.target.value)}
                        placeholder="กรอกสถานที่ออกบัตร (เฉพาะตัวอักษร)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('idCardIssuedAt') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                      {hasError('idCardIssuedAt') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardIssuedAt')}</p>
                  )}
                  </div>
                <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันที่ออกบัตร<span className="text-red-500">*</span></label>
                      <ThaiDatePicker
                        value={formData.idCardIssueDate}
                        onChange={(date) => handleInputChange('idCardIssueDate', date)}
                        placeholder="เลือกวันที่ออกบัตร"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('idCardIssueDate') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                       />
                      {hasError('idCardIssueDate') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardIssueDate')}</p>
                )}
              </div>
                <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">วันหมดอายุบัตร<span className="text-red-500">*</span></label>
                    <ThaiDatePicker
                        value={formData.idCardExpiryDate}
                        onChange={(date) => handleInputChange('idCardExpiryDate', date)}
                        placeholder="เลือกวันหมดอายุบัตร"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('idCardExpiryDate') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                      {hasError('idCardExpiryDate') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('idCardExpiryDate')}</p>
                  )}
                </div>
                  </div>
                </div>
                {/* ๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่ */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๔ ที่อยู่ตามทะเบียนบ้านเลขที่<span className="text-red-500">*</span></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เลขที่<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.houseNumber || ''}
                         onChange={(e) => handleNumberOnlyChange('registeredAddress.houseNumber', e.target.value)}
                        placeholder="กรอกเลขที่ (เฉพาะตัวเลข)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressHouseNumber') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressHouseNumber') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressHouseNumber')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">หมู่ที่<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.villageNumber || ''}
                         onChange={(e) => handleVillageNumberChange('registeredAddress.villageNumber', e.target.value)}
                        placeholder="กรอกหมู่ที่ (เฉพาะตัวเลข หรือ -)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressVillageNumber') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressVillageNumber') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressVillageNumber')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตรอก/ซอย<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.alley || ''}
                        onChange={(e) => handleVillageNumberChange('registeredAddress.alley', e.target.value)}
                        placeholder="กรอกตรอก/ซอย หรือ -"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressAlley') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressAlley') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressAlley')}</p>
                )}
              </div>
                <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ถนน<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.road || ''}
                        onChange={(e) => handleVillageNumberChange('registeredAddress.road', e.target.value)}
                        placeholder="กรอกถนน หรือ -"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressRoad') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                      {hasError('registeredAddressRoad') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressRoad')}</p>
                  )}
                </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำบล/แขวง<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.subDistrict || ''}
                        onChange={(e) => handleTextOnlyChange('registeredAddress.subDistrict', e.target.value)}
                      placeholder="กรอกตำบล/แขวง (เฉพาะตัวอักษร)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressSubDistrict') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressSubDistrict') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressSubDistrict')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.district || ''}
                        onChange={(e) => handleTextOnlyChange('registeredAddress.district', e.target.value)}
                      placeholder="กรอกอำเภอ/เขต (เฉพาะตัวอักษร)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressDistrict') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressDistrict') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressDistrict')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.province || ''}
                        onChange={(e) => handleTextOnlyChange('registeredAddress.province', e.target.value)}
                        placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressProvince') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressProvince') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressProvince')}</p>
                    )}
                </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.postalCode || ''}
                         onChange={(e) => handlePostalCodeChange('registeredAddress.postalCode', e.target.value)}
                        placeholder="กรอกรหัสไปรษณีย์ (5 หลัก)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressPostalCode') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      <div className="flex justify-between items-center">
                      {hasError('registeredAddressPostalCode') && (
                          <p className="text-red-500 text-xs">{getErrorMessage('registeredAddressPostalCode')}</p>
                    )}
                        <p className="text-xs text-gray-500 ml-auto">
                          {formData.registeredAddress?.postalCode?.length || 0}/5 หลัก
                        </p>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.phone || ''}
                         onChange={(e) => handleInputChange('registeredAddress.phone', e.target.value)}
                        placeholder="กรอกเบอร์โทรศัพท์บ้าน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressPhone') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressPhone') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressPhone')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={formData.registeredAddress?.mobile || ''}
                         onChange={(e) => handleInputChange('registeredAddress.mobile', e.target.value)}
                        placeholder="กรอกเบอร์โทรศัพท์มือถือ"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressMobile') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressMobile') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressMobile')}</p>
                    )}
                </div>
              </div>
                  </div>
                 {/* ๑.๕ ที่อยู่ปัจจุบันเลขที่ */}
                 <div className="mb-6">
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-md font-semibold text-gray-700 text-left">๑.๕ ที่อยู่ปัจจุบันเลขที่</h4>
                     <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                       <input
                         type="checkbox"
                        checked={copyFromRegisteredAddress}
                        onChange={(e) => handleCopyFromRegisteredAddress(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span>คัดลอกจากที่อยู่ทะเบียนบ้าน</span>
                     </label>
                   </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เลขที่<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.houseNumber || ''}
                         onChange={(e) => handleNumberOnlyChange('currentAddressDetail.houseNumber', e.target.value)}
                        placeholder="กรอกเลขที่ (เฉพาะตัวเลข)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressHouseNumber') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressHouseNumber') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressHouseNumber')}</p>
                      )}
                </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">หมู่ที่<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.villageNumber || ''}
                         onChange={(e) => handleVillageNumberChange('currentAddressDetail.villageNumber', e.target.value)}
                        placeholder="กรอกหมู่ที่ (เฉพาะตัวเลข หรือ -)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressVillageNumber') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressVillageNumber') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressVillageNumber')}</p>
                    )}
                  </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตรอก/ซอย<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.alley || ''}
                        onChange={(e) => handleVillageNumberChange('currentAddressDetail.alley', e.target.value)}
                        placeholder="กรอกตรอก/ซอย หรือ -"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressAlley') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressAlley') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressAlley')}</p>
                    )}
                  </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ถนน<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.road || ''}
                        onChange={(e) => handleVillageNumberChange('currentAddressDetail.road', e.target.value)}
                        placeholder="กรอกถนน หรือ -"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressRoad') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressRoad') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressRoad')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">ตำบล/แขวง<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.subDistrict || ''}
                        onChange={(e) => handleTextOnlyChange('currentAddressDetail.subDistrict', e.target.value)}
                        placeholder="กรอกตำบล/แขวง (เฉพาะตัวอักษร)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressSubDistrict') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressSubDistrict') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressSubDistrict')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.district || ''}
                        onChange={(e) => handleTextOnlyChange('currentAddressDetail.district', e.target.value)}
                        placeholder="กรอกอำเภอ/เขต (เฉพาะตัวอักษร)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressDistrict') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressDistrict') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressDistrict')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.province || ''}
                        onChange={(e) => handleTextOnlyChange('currentAddressDetail.province', e.target.value)}
                        placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressProvince') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressProvince') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressProvince')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.postalCode || ''}
                        onChange={(e) => handlePostalCodeChange('currentAddressDetail.postalCode', e.target.value)}
                        placeholder="กรอกรหัสไปรษณีย์ (5 หลัก)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressPostalCode') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      <div className="flex justify-between items-center">
                      {hasError('currentAddressPostalCode') && (
                          <p className="text-red-500 text-xs">{getErrorMessage('currentAddressPostalCode')}</p>
                      )}
                        <p className="text-xs text-gray-500 ml-auto">
                          {formData.currentAddressDetail?.postalCode?.length || 0}/5 หลัก
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                      <input
                        type="tel"
                        value={formData.currentAddressDetail?.homePhone || ''}
                        onChange={(e) => handleNumberOnlyChange('currentAddressDetail.homePhone', e.target.value)}
                        placeholder="กรอกเบอร์โทรศัพท์บ้าน (เฉพาะตัวเลข)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ<span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={formData.currentAddressDetail?.mobilePhone || ''}
                         onChange={(e) => handleNumberOnlyChange('currentAddressDetail.mobilePhone', e.target.value)}
                        placeholder="กรอกเบอร์โทรศัพท์มือถือ (เฉพาะตัวเลข)"
                        disabled={copyFromRegisteredAddress}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressMobilePhone') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : copyFromRegisteredAddress
                            ? 'border-gray-200 bg-gray-100 text-gray-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressMobilePhone') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressMobilePhone')}</p>
                      )}
                    </div>
                  
                  </div>
                </div>

                {/* ๑.๖ บุคคลที่สามารถติดต่อได้ทันที */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๖ บุคคลที่สามารถติดต่อได้ทันที</h4>
                  <div className="space-y-4">
                    {/* ข้อมูลพื้นฐานผู้ติดต่อฉุกเฉิน */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ชื่อ ผู้ติดต่อฉุกเฉิน<span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={formData.emergencyContactFirstName || ''}
                          onChange={(e) => handleTextOnlyChange('emergencyContactFirstName', e.target.value)}
                          placeholder="กรอกชื่อผู้ติดต่อฉุกเฉิน (เฉพาะตัวอักษร)"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyContactFirstName') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {hasError('emergencyContactFirstName') && (
                          <div className="text-xs text-red-600">
                            {getErrorMessage('emergencyContactFirstName')}
                  </div>
                        )}
                </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">นามสกุล ผู้ติดต่อฉุกเฉิน<span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={formData.emergencyContactLastName || ''}
                          onChange={(e) => handleTextOnlyChange('emergencyContactLastName', e.target.value)}
                          placeholder="กรอกนามสกุลผู้ติดต่อฉุกเฉิน (เฉพาะตัวอักษร)"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyContactLastName') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {hasError('emergencyContactLastName') && (
                          <div className="text-xs text-red-600">
                            {getErrorMessage('emergencyContactLastName')}
              </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ความสัมพันธ์<span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={formData.emergencyRelationship || ''}
                          onChange={(e) => handleTextOnlyChange('emergencyRelationship', e.target.value)}
                          placeholder="กรอกความสัมพันธ์ (เฉพาะตัวอักษร)"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyRelationship') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {hasError('emergencyRelationship') && (
                          <div className="text-xs text-red-600">
                            {getErrorMessage('emergencyRelationship')}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">เบอร์โทรฉุกเฉิน<span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleNumberOnlyChange('emergencyPhone', e.target.value)}
                          placeholder="กรอกเบอร์โทรฉุกเฉิน (เฉพาะตัวเลข)"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyPhone') ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {hasError('emergencyPhone') && (
                          <div className="text-xs text-red-600">
                            {getErrorMessage('emergencyPhone')}
                          </div>
                        )}
                      </div>
                  </div>
                  
                    {/* ที่อยู่ผู้ติดต่อฉุกเฉิน */}
                    <div className="border-t pt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">ที่อยู่ผู้ติดต่อฉุกเฉิน</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">บ้านเลขที่<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                            value={formData.emergencyAddress?.houseNumber || ''}
                            onChange={(e) => handleInputChange('emergencyAddress.houseNumber', e.target.value)}
                            placeholder="กรอกบ้านเลขที่"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressHouseNumber') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressHouseNumber') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressHouseNumber')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">หมู่ที่<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.villageNumber || ''}
                            onChange={(e) => handleVillageNumberChange('emergencyAddress.villageNumber', e.target.value)}
                            placeholder="กรอกหมู่ที่ (เฉพาะตัวเลข หรือ -)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressVillageNumber') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressVillageNumber') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressVillageNumber')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ตรอก/ซอย<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.alley || ''}
                            onChange={(e) => handleVillageNumberChange('emergencyAddress.alley', e.target.value)}
                            placeholder="กรอกตรอก/ซอย หรือ -"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressAlley') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressAlley') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressAlley')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ถนน<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.road || ''}
                            onChange={(e) => handleVillageNumberChange('emergencyAddress.road', e.target.value)}
                            placeholder="กรอกถนน หรือ -"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressRoad') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressRoad') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressRoad')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ตำบล/แขวง<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.subDistrict || ''}
                            onChange={(e) => handleTextOnlyChange('emergencyAddress.subDistrict', e.target.value)}
                            placeholder="กรอกตำบล/แขวง (เฉพาะตัวอักษร)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressSubDistrict') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressSubDistrict') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressSubDistrict')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.district || ''}
                            onChange={(e) => handleTextOnlyChange('emergencyAddress.district', e.target.value)}
                            placeholder="กรอกอำเภอ/เขต (เฉพาะตัวอักษร)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressDistrict') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressDistrict') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressDistrict')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.province || ''}
                            onChange={(e) => handleTextOnlyChange('emergencyAddress.province', e.target.value)}
                            placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressProvince') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressProvince') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressProvince')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.postalCode || ''}
                            onChange={(e) => handlePostalCodeChange('emergencyAddress.postalCode', e.target.value)}
                            placeholder="กรอกรหัสไปรษณีย์ (5 หลัก)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressPostalCode') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          <div className="flex justify-between items-center">
                          {hasError('emergencyAddressPostalCode') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressPostalCode')}
                            </div>
                          )}
                            <p className="text-xs text-gray-500 ml-auto">
                              {formData.emergencyAddress?.postalCode?.length || 0}/5 หลัก
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">โทรศัพท์</label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.phone || ''}
                            onChange={(e) => handleInputChange('emergencyAddress.phone', e.target.value)}
                            placeholder="กรอกโทรศัพท์"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressPhone') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressPhone') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressPhone')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลสถานที่ทำงานผู้ติดต่อฉุกเฉิน */}
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">ข้อมูลสถานที่ทำงานผู้ติดต่อฉุกเฉิน</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ชื่อสถานที่ทำงาน<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyWorkplace?.name || ''}
                            onChange={(e) => handleInputChange('emergencyWorkplace.name', e.target.value)}
                            placeholder="กรอกชื่อสถานที่ทำงาน"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyWorkplaceName') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyWorkplaceName') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyWorkplaceName')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">อำเภอ/เขต<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyWorkplace?.district || ''}
                            onChange={(e) => handleTextOnlyChange('emergencyWorkplace.district', e.target.value)}
                            placeholder="กรอกอำเภอ/เขต (เฉพาะตัวอักษร)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyWorkplaceDistrict') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyWorkplaceDistrict') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyWorkplaceDistrict')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">จังหวัด<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyWorkplace?.province || ''}
                            onChange={(e) => handleTextOnlyChange('emergencyWorkplace.province', e.target.value)}
                            placeholder="กรอกจังหวัด (เฉพาะตัวอักษร)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyWorkplaceProvince') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyWorkplaceProvince') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyWorkplaceProvince')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">โทรศัพท์<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={formData.emergencyWorkplace?.phone || ''}
                            onChange={(e) => handleInputChange('emergencyWorkplace.phone', e.target.value)}
                            placeholder="กรอกโทรศัพท์"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyWorkplacePhone') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyWorkplacePhone') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyWorkplacePhone')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>




                {/* ๑.๑๐ สถานภาพครอบครัว (อัปเดต) */}
                {/* <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 text-center">๑.๑๐ สถานภาพครอบครัว</h4>
                  <div className="space-y-3">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="โสด"
                          checked={formData.maritalStatus === 'โสด'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>โสด</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="สมรสจดทะเบียน"
                          checked={formData.maritalStatus === 'สมรสจดทะเบียน'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>สมรสจดทะเบียน</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="หม้าย"
                          checked={formData.maritalStatus === 'หม้าย'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>หม้าย</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="หย่า"
                          checked={formData.maritalStatus === 'หย่า'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>หย่า</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="แยกกันอยู่"
                          checked={formData.maritalStatus === 'แยกกันอยู่'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-4 h-4" 
                        />
                        <span>แยกกันอยู่</span>
                      </label>
                    </div>
                  </div>
                </div> */}
              </div>
            </CardBody>
          </Card>
          )}
          {/* ข้อมูลความรู้ ความสามารถ และทักษะพิเศษ */}
          {activeTab === 'skills' && (
          <Card className="shadow-xl border-0">
            <div ref={sectionRefs.extra} />
            <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลความรู้ ความสามารถ และทักษะพิเศษ</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ๒. ความรู้ ความสามารถ/ทักษะพิเศษ */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                  ๒. ความรู้ ความสามารถ/ทักษะพิเศษ
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ความรู้ ความสามารถ และทักษะพิเศษ<span className="text-red-500">*</span></label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="กรุณากรอกความรู้ ความสามารถ และทักษะพิเศษของท่าน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                        hasError('skills') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      rows={3}
                      />
                    {hasError('skills') && (
                      <p className="text-red-500 text-xs mt-1">{getErrorMessage('skills')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ภาษาที่ใช้ได้<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                      value={formData.languages}
                      onChange={(e) => handleInputChange('languages', e.target.value)}
                      placeholder="กรอกภาษาที่ใช้ได้"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                        hasError('languages') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                    {hasError('languages') && (
                      <p className="text-red-500 text-xs mt-1">{getErrorMessage('languages')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ทักษะคอมพิวเตอร์<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                      value={formData.computerSkills}
                      onChange={(e) => handleInputChange('computerSkills', e.target.value)}
                      placeholder="กรอกทักษะคอมพิวเตอร์"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                        hasError('computerSkills') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    />
                    {hasError('computerSkills') && (
                      <p className="text-red-500 text-xs mt-1">{getErrorMessage('computerSkills')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ใบรับรอง/ประกาศนียบัตร</label>
                    <input
                      type="text"
                      value={formData.certificates}
                      onChange={(e) => handleInputChange('certificates', e.target.value)}
                      placeholder="กรอกใบรับรอง/ประกาศนียบัตร"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">บุคคลอ้างอิง</label>
                    <input
                      type="text"
                      value={formData.references}
                      onChange={(e) => handleInputChange('references', e.target.value)}
                      placeholder="กรอกบุคคลอ้างอิง"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          )}
          {/* ข้อมูลแนบเอกสาร */}
          {activeTab === 'documents' && (
          <Card className="shadow-xl border-0">
            <div ref={sectionRefs.documents} />
            <CardHeader className="bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-slate-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลแนบเอกสาร</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ๔. เอกสารแนบ */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                  ๔. เอกสารแนบ
                </h3>
                  <Button
                    color="danger"
                    variant="bordered"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                    onClick={() => {
                      if (confirm('คุณต้องการลบเอกสารทั้งหมดหรือไม่?')) {
                        setFormData(prev => ({
                          ...prev,
                          documents: {
                            idCard: undefined,
                            houseRegistration: undefined,
                            educationCertificate: undefined,
                            militaryCertificate: undefined,
                            medicalCertificate: undefined,
                            drivingLicense: undefined,
                            otherDocuments: []
                          }
                        }));
                        setUploadedDocuments([]);
                        console.log('✅ ลบเอกสารทั้งหมดเรียบร้อยแล้ว');
                      }
                    }}
                  >
                    ลบทั้งหมด
                  </Button>
                </div>
                {!savedResume?.id && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>หมายเหตุ:</strong> กรุณาบันทึกข้อมูลส่วนตัวก่อนอัปโหลดเอกสารแนบ
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* สำเนาบัตรประชาชน */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        จำเป็น
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">สำเนาบัตรประชาชน</h4>
                    <p className="text-sm text-gray-500 mb-3">สำเนาบัตรประชาชน</p>
                    <input
                      type="file"
                      id="idCard"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.idCard', file);
                          
                          // อัปโหลดไฟล์ลงฐานข้อมูล
                          await handleDocumentUpload(file, 'idCard');
                        }
                      }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200"
                        onClick={() => document.getElementById('idCard')?.click()}
                      >
                        {formData.documents?.idCard ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                      </Button>
                      {/* แสดงไฟล์ที่อัปโหลดแล้วจากฐานข้อมูล */}
                      {uploadedDocuments.filter(doc => doc.documentType === 'idCard').map((doc, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-green-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-green-700 font-medium">
                                  {doc.fileName}
                                </span>
                                <span className="text-xs text-green-600">
                                  ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
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
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                              onClick={() => {
                                window.open(doc.filePath, '_blank');
                              }}
                            >
                              ดูตัวอย่าง
                            </Button>
                              <Button
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                                onClick={() => handleDeleteDocument(doc.id, 'idCard')}
                                disabled={isUploading}
                              >
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                            </div>
                        </div>
                      ))}
                      
                      {/* แสดงไฟล์ใหม่ที่ยังไม่ได้อัปโหลด */}
                      {formData.documents?.idCard && !uploadedDocuments.some(doc => doc.documentType === 'idCard') && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-blue-700 font-medium">
                                  {typeof formData.documents.idCard === 'object' && 'name' in formData.documents.idCard 
                                    ? formData.documents.idCard.name 
                                    : (formData.documents.idCard as File).name}
                                </span>
                                {formData.documents.idCard instanceof File && (
                                  <span className="text-xs text-blue-600">
                                    ขนาด: {(formData.documents.idCard.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                      )}
                    </div>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              รออัปโหลด
                            </span>
                          </div>
                          <div className="flex gap-2">
                          <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.idCard instanceof File) {
                                handlePreviewFile(formData.documents!.idCard, 'สำเนาบัตรประชาชน');
                              }
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                          </Button>
                            <Button
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                              onClick={() => handleDeleteNewDocument('idCard')}
                              disabled={isUploading}
                            >
                              <TrashIcon className="w-4 h-4" />
                          </Button>
                          </div>
                      </div>
                    )}
                    </div>
                    {errors.documentsIdCard && (
                      <div className="mt-2 text-xs text-red-600">
                        {errors.documentsIdCard}
                      </div>
                    )}
                  </div>

                  {/* สำเนาทะเบียนบ้าน */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        จำเป็น
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">สำเนาทะเบียนบ้าน</h4>
                    <p className="text-sm text-gray-500 mb-3">สำเนาทะเบียนบ้าน</p>
                    <input
                      type="file"
                      id="houseRegistration"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.houseRegistration', file);
                          
                          // อัปโหลดไฟล์ลงฐานข้อมูล
                          await handleDocumentUpload(file, 'houseRegistration');
                        }
                      }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200"
                        onClick={() => document.getElementById('houseRegistration')?.click()}
                      >
                        {formData.documents?.houseRegistration ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                      </Button>
                      {/* แสดงไฟล์ที่อัปโหลดแล้วจากฐานข้อมูล */}
                      {uploadedDocuments.filter(doc => doc.documentType === 'houseRegistration').map((doc, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-green-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-green-700 font-medium">
                                  {doc.fileName}
                                </span>
                                <span className="text-xs text-green-600">
                                  ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
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
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                              onClick={() => {
                                window.open(doc.filePath, '_blank');
                              }}
                            >
                              ดูตัวอย่าง
                            </Button>
                              <Button
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                                onClick={() => handleDeleteDocument(doc.id, 'houseRegistration')}
                                disabled={isUploading}
                              >
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                            </div>
                        </div>
                      ))}
                      
                      {/* แสดงไฟล์ใหม่ที่ยังไม่ได้อัปโหลด */}
                      {formData.documents?.houseRegistration && !uploadedDocuments.some(doc => doc.documentType === 'houseRegistration') && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-blue-700 font-medium">
                                  {typeof formData.documents.houseRegistration === 'object' && 'name' in formData.documents.houseRegistration 
                                    ? formData.documents.houseRegistration.name 
                                    : (formData.documents.houseRegistration as File).name}
                                </span>
                                {formData.documents.houseRegistration instanceof File && (
                                  <span className="text-xs text-blue-600">
                                    ขนาด: {(formData.documents.houseRegistration.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                      )}
                    </div>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              รออัปโหลด
                            </span>
                          </div>
                          <div className="flex gap-2">
                          <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.houseRegistration instanceof File) {
                                handlePreviewFile(formData.documents!.houseRegistration, 'สำเนาทะเบียนบ้าน');
                              }
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                          </Button>
                            <Button
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                              onClick={() => handleDeleteNewDocument('houseRegistration')}
                              disabled={isUploading}
                            >
                              <TrashIcon className="w-4 h-4" />
                          </Button>
                          </div>
                      </div>
                    )}
                    </div>
                    {errors.documentsHouseRegistration && (
                      <div className="mt-2 text-xs text-red-600">
                        {errors.documentsHouseRegistration}
                      </div>
                    )}
                  </div>


                  {/* ใบรับรองการศึกษา */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        จำเป็น
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">ใบรับรองการศึกษา</h4>
                    <p className="text-sm text-gray-500 mb-3">สำเนาใบรับรองการศึกษา</p>
                    <input
                      type="file"
                      id="educationCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.educationCertificate', file);
                          
                          // อัปโหลดไฟล์ลงฐานข้อมูล
                          await handleDocumentUpload(file, 'educationCertificate');
                        }
                      }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200"
                        onClick={() => document.getElementById('educationCertificate')?.click()}
                      >
                        {formData.documents?.educationCertificate ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                      </Button>
                      
                      {/* แสดงไฟล์ที่อัปโหลดแล้วจากฐานข้อมูล */}
                      {uploadedDocuments.filter(doc => doc.documentType === 'educationCertificate').map((doc, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-green-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-green-700 font-medium">
                                  {doc.fileName}
                                </span>
                                <span className="text-xs text-green-600">
                                  ขนาด: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
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
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                              onClick={() => {
                                window.open(doc.filePath, '_blank');
                              }}
                            >
                              ดูตัวอย่าง
                            </Button>
                              <Button
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                                onClick={() => handleDeleteDocument(doc.id, 'educationCertificate')}
                                disabled={isUploading}
                              >
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                            </div>
                        </div>
                      ))}
                      
                      {/* แสดงไฟล์ใหม่ที่ยังไม่ได้อัปโหลด */}
                      {formData.documents?.educationCertificate && !uploadedDocuments.some(doc => doc.documentType === 'educationCertificate') && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-blue-700 font-medium">
                                  {typeof formData.documents.educationCertificate === 'object' && 'name' in formData.documents.educationCertificate 
                                    ? formData.documents.educationCertificate.name 
                                    : (formData.documents.educationCertificate as File).name}
                                </span>
                                {formData.documents.educationCertificate instanceof File && (
                                  <span className="text-xs text-blue-600">
                                    ขนาด: {(formData.documents.educationCertificate.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                      )}
                    </div>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              รออัปโหลด
                            </span>
                          </div>
                          <div className="flex gap-2">
                          <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.educationCertificate instanceof File) {
                                handlePreviewFile(formData.documents!.educationCertificate, 'ใบรับรองการศึกษา');
                              }
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                          </Button>
                            <Button
                              color="danger"
                              variant="bordered"
                              size="sm"
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                              onClick={() => handleDeleteNewDocument('educationCertificate')}
                              disabled={isUploading}
                            >
                              <TrashIcon className="w-4 h-4" />
                          </Button>
                          </div>
                      </div>
                    )}
                    </div>
                    {errors.documentsEducationCertificate && (
                      <div className="mt-2 text-xs text-red-600">
                        {errors.documentsEducationCertificate}
                      </div>
                      )}
                    </div>
                  {/* ใบรับรองทหาร */}
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${formData.gender === 'หญิง' ? 'border-gray-200 bg-gray-50' : 'border-gray-300'}`}>
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${formData.gender === 'หญิง' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-800'}`}>
                        สำหรับผู้ชาย
                      </span>
                    </div>
                    <h4 className={`font-semibold mb-2 ${formData.gender === 'หญิง' ? 'text-gray-400' : 'text-gray-700'}`}>ใบรับรองทหาร</h4>
                    <p className={`text-sm mb-3 ${formData.gender === 'หญิง' ? 'text-gray-400' : 'text-gray-500'}`}>สำเนาใบรับรองทหาร</p>
                      <input
                      type="file"
                      id="militaryCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={formData.gender === 'หญิง'}
                      onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleInputChange('documents.militaryCertificate', file);
                            
                            // อัปโหลดไฟล์ลงฐานข้อมูล
                            await handleDocumentUpload(file, 'militaryCertificate');
                          }
                        }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={formData.gender === 'หญิง'}
                        onClick={() => document.getElementById('militaryCertificate')?.click()}
                      >
                        {formData.documents?.militaryCertificate ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                      </Button>
                      {formData.documents?.militaryCertificate && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-green-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-green-700 font-medium">
                                  {typeof formData.documents.militaryCertificate === 'object' && 'name' in formData.documents.militaryCertificate 
                                    ? formData.documents.militaryCertificate.name 
                                    : (formData.documents.militaryCertificate as File).name}
                                </span>
                                {formData.documents.militaryCertificate instanceof File && (
                                  <span className="text-xs text-green-600">
                                    ขนาด: {(formData.documents.militaryCertificate.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                )}
                              </div>
                            </div>
                            {typeof formData.documents.militaryCertificate === 'object' && 'uploaded' in formData.documents.militaryCertificate && formData.documents.militaryCertificate.uploaded && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                ✓ อัปโหลดแล้ว
                              </span>
                            )}
                          </div>
                        <div className="flex gap-2">
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.militaryCertificate instanceof File) {
                                handlePreviewFile(formData.documents!.militaryCertificate, 'ใบรับรองทหาร');
                              }
                            }}
                            disabled={isUploading}
                        >
                          {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                        </Button>
                          <Button
                            color="danger"
                            variant="bordered"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => handleDeleteNewDocument('militaryCertificate')}
                            disabled={isUploading}
                          >
                            <TrashIcon className="w-4 h-4" />
                        </Button>
                        </div>
                        </div>
                      )}
                    </div>
                    {formData.gender === 'หญิง' && (
                      <div className="mt-2 text-xs text-gray-500">
                        ใบรับรองทหารไม่จำเป็นสำหรับผู้หญิง
                      </div>
                    )}
                    {errors.documentsMilitaryCertificate && (
                      <div className="mt-2 text-xs text-red-600">
                        {errors.documentsMilitaryCertificate}
                      </div>
                    )}
                  </div>
                  {/* ใบรับรองแพทย์ */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        ตามที่บริษัทกำหนด
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">ใบรับรองแพทย์</h4>
                    <p className="text-sm text-gray-500 mb-3">ใบรับรองแพทย์</p>
                    <input
                      type="file"
                      id="medicalCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.medicalCertificate', file);
                          
                          // อัปโหลดไฟล์ลงฐานข้อมูล
                          await handleDocumentUpload(file, 'medicalCertificate');
                        }
                      }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200"
                        onClick={() => document.getElementById('medicalCertificate')?.click()}
                      >
                        {formData.documents?.medicalCertificate ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                      </Button>
                      {formData.documents?.medicalCertificate && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-green-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-green-700 font-medium">
                                  {typeof formData.documents.medicalCertificate === 'object' && 'name' in formData.documents.medicalCertificate 
                                    ? formData.documents.medicalCertificate.name 
                                    : (formData.documents.medicalCertificate as File).name}
                                </span>
                                {formData.documents.medicalCertificate instanceof File && (
                                  <span className="text-xs text-green-600">
                                    ขนาด: {(formData.documents.medicalCertificate.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                )}
                              </div>
                            </div>
                            {typeof formData.documents.medicalCertificate === 'object' && 'uploaded' in formData.documents.medicalCertificate && formData.documents.medicalCertificate.uploaded && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                ✓ อัปโหลดแล้ว
                              </span>
                            )}
                          </div>
                        <div className="flex gap-2">
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                        onClick={() => {
                              if (formData.documents!.medicalCertificate instanceof File) {
                                handlePreviewFile(formData.documents!.medicalCertificate, 'ใบรับรองแพทย์');
                            } else {
                                console.log('ℹ️ ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
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
                            onClick={() => handleDeleteNewDocument('medicalCertificate')}
                            disabled={isUploading}
                          >
                            <TrashIcon className="w-4 h-4" />
                        </Button>
                        </div>
                      </div>
                    )}
                    </div>
                    {errors.documentsMedicalCertificate && (
                      <div className="mt-2 text-xs text-red-600">
                        {errors.documentsMedicalCertificate}
                      </div>
                    )}
                  </div>
                  {/* ใบขับขี่ */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        ไม่บังคับ
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">ใบขับขี่</h4>
                    <p className="text-sm text-gray-500 mb-3">สำเนาใบขับขี่ (ถ้ามี)</p>
                    <input
                      type="file"
                      id="drivingLicense"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.drivingLicense', file);
                          
                          // อัปโหลดไฟล์ลงฐานข้อมูล
                          await handleDocumentUpload(file, 'drivingLicense');
                        }
                      }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200"
                        onClick={() => document.getElementById('drivingLicense')?.click()}
                      >
                        {formData.documents?.drivingLicense ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                      </Button>
                      {formData.documents?.drivingLicense && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-5 h-5 text-green-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-green-700 font-medium">
                                  {typeof formData.documents.drivingLicense === 'object' && 'name' in formData.documents.drivingLicense 
                                    ? formData.documents.drivingLicense.name 
                                    : (formData.documents.drivingLicense as File).name}
                                </span>
                                {formData.documents.drivingLicense instanceof File && (
                                  <span className="text-xs text-green-600">
                                    ขนาด: {(formData.documents.drivingLicense.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                )}
                              </div>
                            </div>
                            {typeof formData.documents.drivingLicense === 'object' && 'uploaded' in formData.documents.drivingLicense && formData.documents.drivingLicense.uploaded && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                ✓ อัปโหลดแล้ว
                              </span>
                            )}
                          </div>
                        <div className="flex gap-2">
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.drivingLicense instanceof File) {
                                handlePreviewFile(formData.documents!.drivingLicense, 'ใบขับขี่');
                              } else {
                                console.log('ℹ️ ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
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
                            onClick={() => handleDeleteNewDocument('drivingLicense')}
                            disabled={isUploading}
                          >
                            <TrashIcon className="w-4 h-4" />
                        </Button>
                        </div>
                      </div>
                    )}
                    </div>
                    {errors.documentsDrivingLicense && (
                      <div className="mt-2 text-xs text-red-600">
                        {errors.documentsDrivingLicense}
                      </div>
                    )}
                  </div>

                  

                  {/* เอกสารอื่นๆ */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        อื่นๆ
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">เอกสารอื่นๆ</h4>
                    <p className="text-sm text-gray-500 mb-3">เอกสารเพิ่มเติมอื่นๆ (ถ้ามี)</p>
                    <input
                      type="file"
                      id="otherDocuments"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          handleInputChange('documents.otherDocuments', files);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-200"
                        onClick={() => document.getElementById('otherDocuments')?.click()}
                      >
                        เลือกไฟล์
                      </Button>
                      {formData.documents?.otherDocuments && Array.isArray(formData.documents.otherDocuments) && formData.documents.otherDocuments.length > 0 && (
                        <div className="space-y-1">
                          {formData.documents.otherDocuments.map((file, index) => (
                            <div key={index} className="flex gap-2">
                            <Button
                              color="secondary"
                              variant="bordered"
                              size="sm"
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200 text-xs"
                              onClick={() => {
                                if (file instanceof File) {
                                  handlePreviewFile(file, `เอกสารอื่นๆ ${index + 1}`);
                                } else if (typeof file === 'object' && 'file' in file && file.file) {
                                  handlePreviewFile(file.file, `เอกสารอื่นๆ ${index + 1}`);
                          } else {
                                  console.log('ℹ️ ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
                                }
                              }}
                            >
                              ดูตัวอย่าง {index + 1}
                            </Button>
                              <Button
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 rounded-lg shadow-sm transition-all duration-200"
                                onClick={() => {
                                  const newFiles = formData.documents?.otherDocuments?.filter((_, i) => i !== index);
                                  setFormData(prev => ({
                                    ...prev,
                                    documents: {
                                      ...prev.documents,
                                      otherDocuments: newFiles || []
                                    }
                                  } as FormData));
                                }}
                                disabled={isUploading}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.documents?.otherDocuments && (
                      <div className="mt-2 text-xs text-green-600">
                        ✓ เลือกแล้ว {Array.isArray(formData.documents.otherDocuments) ? formData.documents.otherDocuments.length : 1} ไฟล์
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          )}
          {/* ประวัติการศึกษา */}
          {activeTab === 'education' && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ประวัติการศึกษา</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ๑.๗ ประวัติการศึกษา */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">ประวัติการศึกษา</h3>
                <div className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-medium text-gray-700">ข้อมูลการศึกษาที่ {index + 1}</h5>
                        {formData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">วุฒิการศึกษา<span className="text-red-500">*</span></label>
                          <select
                            value={edu.level}
                            onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Level`) ? 'border-red-500' : 'border-gray-300'}`}
                          >
                            <option value="">เลือกวุฒิการศึกษา</option>
                            <option value="ประถมศึกษา">ประถมศึกษา</option>
                            <option value="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</option>
                            <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                            <option value="ประกาศนียบัตรวิชาชีพ (ปวช.)">ประกาศนียบัตรวิชาชีพ (ปวช.)</option>
                            <option value="ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)">ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</option>
                            <option value="ปริญญาตรี">ปริญญาตรี</option>
                            <option value="ปริญญาโท">ปริญญาโท</option>
                            <option value="ปริญญาเอก">ปริญญาเอก</option>
                          </select>
                          {hasError(`education${index}Level`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`education${index}Level`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">สาขา/วิชาเอก<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={edu.major}
                            onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                            placeholder="กรอกสาขา/วิชาเอก"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Major`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`education${index}Major`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`education${index}Major`)}
                      </div>
                          )}
                    </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">จากสถานศึกษา<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="กรอกชื่อสถานศึกษา"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Institution`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`education${index}Institution`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`education${index}Institution`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ปีที่จบ<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => handleEducationChange(index, 'year', handleYearChange(e.target.value))}
                            placeholder="กรอกปีที่จบ (4 หลัก)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Year`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          <div className="flex justify-between items-center">
                          {hasError(`education${index}Year`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`education${index}Year`)}
                            </div>
                          )}
                            <p className="text-xs text-gray-500 ml-auto">
                              {edu.year.length}/4 หลัก
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">เกรดเฉลี่ย<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => handleEducationChange(index, 'gpa', handleGpaChange(e.target.value))}
                            placeholder="กรอกเกรดเฉลี่ย (ทศนิยม 2 ตำแหน่ง)"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Gpa`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`education${index}Gpa`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`education${index}Gpa`)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {hasError('education') && (
                    <div className="text-xs text-red-600 mb-2">
                      {getErrorMessage('education')}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={addEducation}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    เพิ่มข้อมูลการศึกษา
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
          )}
          {/* ประวัติการทำงาน */}
          {activeTab === 'work' && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ประวัติการทำงาน</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ๑.๘ ปัจจุบันทำงานในตำแหน่ง */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">๑.๘ ปัจจุบันทำงานในตำแหน่ง</h3>
                <div className="space-y-4">
                  {formData.workExperience.map((work, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-medium text-gray-700">ประสบการณ์การทำงานที่ {index + 1}</h5>
                        {formData.workExperience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWorkExperience(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ชื่อสถานที่ทำงาน<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={work.company}
                            onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                            placeholder="กรอกชื่อสถานที่ทำงาน"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Company`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`workExperience${index}Company`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`workExperience${index}Company`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ตำแหน่ง<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={work.position}
                            onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                            placeholder="กรอกตำแหน่ง"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Position`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`workExperience${index}Position`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`workExperience${index}Position`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
                          <input
                            type="text"
                            value={work.district}
                            onChange={(e) => handleWorkExperienceChange(index, 'district', e.target.value)}
                            placeholder="กรอกอำเภอ/เขต"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">จังหวัด</label>
                          <input
                            type="text"
                            value={work.province}
                            onChange={(e) => handleWorkExperienceChange(index, 'province', e.target.value)}
                            placeholder="กรอกจังหวัด"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">โทรศัพท์</label>
                          <input
                            type="text"
                            value={work.phone}
                            onChange={(e) => handleWorkExperienceChange(index, 'phone', e.target.value)}
                            placeholder="กรอกเบอร์โทรศัพท์"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">วันที่เริ่มงาน<span className="text-red-500">*</span></label>
                          <ThaiDatePicker
                            value={work.startDate}
                            onChange={(date) => handleWorkExperienceChange(index, 'startDate', date)}
                            placeholder="เลือกวันที่เริ่มงาน"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}StartDate`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`workExperience${index}StartDate`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`workExperience${index}StartDate`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดงาน<span className="text-red-500">*</span></label>
                          <ThaiDatePicker
                            value={work.endDate}
                            onChange={(date) => handleWorkExperienceChange(index, 'endDate', date)}
                            placeholder="เลือกวันที่สิ้นสุดงาน"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}EndDate`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`workExperience${index}EndDate`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`workExperience${index}EndDate`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">เงินเดือน<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                        value={work.salary}
                            onChange={(e) => handleWorkExperienceChange(index, 'salary', e.target.value)}
                            placeholder="กรอกเงินเดือน"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Salary`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`workExperience${index}Salary`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`workExperience${index}Salary`)}
                    </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">เหตุผลที่ออกจากงาน<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={work.reason}
                            onChange={(e) => handleWorkExperienceChange(index, 'reason', e.target.value)}
                            placeholder="กรอกเหตุผลที่ออกจากงาน"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Reason`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`workExperience${index}Reason`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`workExperience${index}Reason`)}
                            </div>
                          )}
                    </div>
                  </div>
                </div>
              ))}
                  {hasError('workExperience') && (
                    <div className="text-xs text-red-600 mb-2">
                      {getErrorMessage('workExperience')}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={addWorkExperience}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    เพิ่มประสบการณ์การทำงาน
                  </button>
                </div>
              </div>

              {/* ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">๑.๙ ข้าราชการ/ลูกจ้าง</h3>
                
                {/* Radio Button เลือกประเภท: ข้าราชการ หรือ ลูกจ้าง */}
                

                {/* รายการประวัติการรับราชการ */}
                <div className="space-y-4">
                  {formData.previousGovernmentService.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">ประวัติการรับราชการที่ {index + 1}</h5>
                          {service.type && (
                            <p className="text-xs text-blue-600 mt-1">
                              ประเภท: {service.type === 'civilServant' ? 'ข้าราชการ' : 'ลูกจ้าง'}
                            </p>
                          )}
                        </div>
                        {formData.previousGovernmentService.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePreviousGovernmentService(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">ประเภท:</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="governmentServiceType"
                          value="civilServant"
                          checked={formData.previousGovernmentService.some(service => service.type === 'civilServant')}
                          onChange={(e) => {
                            if (e.target.value === 'civilServant') {
                              setFormData(prev => ({
                                ...prev,
                                previousGovernmentService: prev.previousGovernmentService.map(service => ({
                                  ...service,
                                  type: 'civilServant'
                                }))
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">ข้าราชการ</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="governmentServiceType"
                          value="employee"
                          checked={formData.previousGovernmentService.some(service => service.type === 'employee')}
                          onChange={(e) => {
                            if (e.target.value === 'employee') {
                              setFormData(prev => ({
                                ...prev,
                                previousGovernmentService: prev.previousGovernmentService.map(service => ({
                                  ...service,
                                  type: 'employee'
                                }))
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">ลูกจ้าง</span>
                      </label>
                    </div>
                  </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ตำแหน่ง<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={service.position}
                            onChange={(e) => handlePreviousGovernmentServiceChange(index, 'position', e.target.value)}
                            placeholder="กรอกตำแหน่งที่เคยรับราชการ"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Position`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`previousGovernmentService${index}Position`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`previousGovernmentService${index}Position`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">สังกัด<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={service.department}
                            onChange={(e) => handlePreviousGovernmentServiceChange(index, 'department', e.target.value)}
                            placeholder="กรอกหน่วยงานที่เคยรับราชการ"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Department`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`previousGovernmentService${index}Department`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`previousGovernmentService${index}Department`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ออกจากราชการเพราะ<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={service.reason}
                            onChange={(e) => handlePreviousGovernmentServiceChange(index, 'reason', e.target.value)}
                            placeholder="กรอกเหตุผลที่ออกจากราชการ"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Reason`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`previousGovernmentService${index}Reason`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`previousGovernmentService${index}Reason`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">เมื่อวันที่<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={service.date}
                            onChange={(e) => handlePreviousGovernmentServiceChange(index, 'date', e.target.value)}
                            placeholder="กรอกวันที่ออกจากราชการ"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Date`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`previousGovernmentService${index}Date`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`previousGovernmentService${index}Date`)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPreviousGovernmentService}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    เพิ่มประวัติการรับราชการ
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
          )}
          {/* ตำแหน่งงานที่สนใจ */}
          {activeTab === 'position' && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ตำแหน่งงานที่สนใจ</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">๑.๑๐ ขอสมัครเป็นบุคคลภายนอกฯตำแหน่ง</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ตำแหน่งที่สมัคร<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.appliedPosition}
                      onChange={(e) => {
                        console.log('🔍 appliedPosition input changed:', e.target.value);
                        handleTextOnlyChange('appliedPosition', e.target.value);
                      }}
                      placeholder="กรอกตำแหน่งที่สมัคร (เฉพาะตัวอักษร)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.appliedPosition 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                   
                    
                    {errors.appliedPosition && (
                      <p className="text-red-500 text-xs mt-1">{errors.appliedPosition}</p>
                    )}
                    </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">วันที่พร้อมเริ่มงาน<span className="text-red-500">*</span></label>
                    <ThaiDatePicker
                      value={formData.availableDate}
                      onChange={(date) => handleInputChange('availableDate', date)}
                      placeholder="เลือกวันที่พร้อมเริ่มงาน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.availableDate 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.availableDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.availableDate}</p>
                    )}
                    </div>
                  
                  </div>
                </div>
            </CardBody>
          </Card>
          )}

          {/* ทักษะพิเศษ */}
          {activeTab === 'special' && (
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20"></div>
                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-semibold">ทักษะพิเศษ</h2>
                </div>
              </CardHeader>
              <CardBody className="p-8">
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">ทักษะพิเศษ</h3>
                  <p className="text-gray-500">ข้อมูลทักษะพิเศษจะแสดงที่นี่</p>
                </div>
              </CardBody>
            </Card>
          )}

        

            {/* ปุ่มบันทึกข้อมูล */}
            <div className="flex justify-center">
            <Button
                type="button"
              color="primary"
              size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                startContent={isSaving ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <CheckIcon className="w-6 h-6" />}
                onClick={() => saveCurrentTab()}
                disabled={isSaving}
              >
                {isSaving ? 'กำลังบันทึกข้อมูล...' : (savedResume?.id ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล')}
                
            </Button>
          </div>
        </form>
      </div>
      {/* Preview Modal */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                ดูตัวอย่างไฟล์: {previewFile!.name || 'ไม่ระบุชื่อ'}
              </h3>
              <button
                onClick={closePreviewModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden min-h-[80vh]">
              {previewFile!.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(previewFile!.file)}
                  alt={previewFile!.name || 'Preview'}
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              ) : previewFile!.type === 'application/pdf' ? (
                <iframe
                  src={URL.createObjectURL(previewFile!.file)}
                  className="w-full h-full border-0"
                  title={previewFile!.name || 'PDF Preview'}
                  style={{ 
                    minHeight: '90vh',
                    width: '100%',
                    height: '100%'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">ไม่สามารถแสดงตัวอย่างไฟล์ประเภทนี้ได้</p>
                    <p className="text-sm text-gray-500">ไฟล์: {previewFile!.name || 'ไม่ระบุชื่อ'}</p>
                    <p className="text-sm text-gray-500">ประเภท: {previewFile!.type || 'ไม่ระบุประเภท'}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <Button
                onClick={closePreviewModal}
                color="primary"
                variant="solid"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                ปิด
              </Button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
} 
