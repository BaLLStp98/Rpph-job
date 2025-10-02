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
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Thai } from 'flatpickr/dist/l10n/th.js';

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
  }>;
  previousGovernmentService: Array<{
    position: string;
    department: string;
    reason: string;
    date: string;
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
  
  // รับข้อมูล department จาก URL parameters
  const departmentName = searchParams.get('department') || '';
  const departmentId = searchParams.get('departmentId') || '';
  
  // อัปเดตข้อมูล department ในฟอร์มเมื่อมีข้อมูลจาก URL
  useEffect(() => {
    if (departmentName) {
      setFormData(prev => ({
        ...prev,
        appliedPosition: departmentName,
        department: departmentName
      }));
    }
  }, [departmentName]);
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
  const [isUploading, setIsUploading] = useState(false);

  // โหลดข้อมูลฝากประวัติของผู้ใช้ปัจจุบัน (ถ้ามี) มาแสดงบนหน้าและเติมลงฟอร์ม
  useEffect(() => {
    const loadMyResume = async () => {
      if (status !== 'authenticated') return;
      try {
        // พยายามค้นจากอีเมล session ก่อน ถัดไปใช้ mine=1 ถ้า API รองรับ
        const userEmail = (session?.user as any)?.email || '';
        let found: any = null;
        try {
          const q = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
          const res = await fetch(`/api/resume-deposit${q}`);
          if (res.ok) {
            const json = await res.json().catch(() => ({}));
            const list = (json?.data || json || []) as any[];
            const filtered = Array.isArray(list)
              ? (userEmail ? list.filter((r) => (r?.email || '').toLowerCase() === userEmail.toLowerCase()) : list)
              : [];
            if (filtered.length > 0) {
              filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
              found = filtered[0];
            }
          }
        } catch (_) {}

        if (found?.id) {
          try {
            const detail = await fetch(`/api/resume-deposit/${found.id}`);
            if (detail.ok) {
              const dj = await detail.json().catch(() => ({}));
              found = dj?.data || dj || found;
            }
          } catch (_) {}
        }

        if (found) {
          console.log('🔍 Found resume data:', found);
          console.log('🔍 Profile image URL:', found.profileImageUrl);
          setSavedResume(found);
          applyResumeToFormInputs(found);
          
          // โหลดรูปภาพโปรไฟล์ที่บันทึกไว้แล้ว
          if (found.profileImageUrl) {
            console.log('🔍 Loading saved profile image:', found.profileImageUrl);
            // ใช้ path แบบเดียวกับ profile page
            const imagePath = `/api/image?file=${found.profileImageUrl}`;
            console.log('✅ Using API path for profile image:', imagePath);
            setProfileImage(imagePath);
          }
          
          // โหลดข้อมูลเอกสารที่อัปโหลดแล้ว
          if (found.id) {
            const documents = await fetchUploadedDocuments(found.id);
            setUploadedDocuments(documents);
          }
        } else {
          // ถ้ายังไม่มีการบันทึกข้อมูลฝากประวัติ ให้ดึงข้อมูลจาก register
          console.log('🔍 loadMyResume - No resume found, calling fetchProfileData...');
          await fetchProfileData();
        }
      } catch (_) {}
    };
    loadMyResume();
  }, [status]);

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
          reason: w.description || ''
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
    } else if (resume.id) {
      // Try to find image by ID - ลองหา .jpg ก่อน เพราะมีมากกว่า .png
      const checkImage = async () => {
        try {
          const jpgPath = `/api/image?file=profile_${resume.id}.jpg`;
          console.log('🔍 applyResumeToFormInputs - Trying JPG path:', jpgPath);
          const jpgResponse = await fetch(jpgPath);
          if (jpgResponse.ok) {
            console.log('✅ applyResumeToFormInputs - Found JPG image:', jpgPath);
            setProfileImage(jpgPath);
            // อัปเดต formData.profileImage ด้วย
            setFormData(prev => ({
              ...prev,
              profileImage: new File([], `profile_${resume.id}.jpg`, { type: 'image/jpeg' })
            }));
          } else {
            const pngPath = `/api/image?file=profile_${resume.id}.png`;
            console.log('🔍 applyResumeToFormInputs - Trying PNG path:', pngPath);
            const pngResponse = await fetch(pngPath);
            if (pngResponse.ok) {
              console.log('✅ applyResumeToFormInputs - Found PNG image:', pngPath);
              setProfileImage(pngPath);
              // อัปเดต formData.profileImage ด้วย
              setFormData(prev => ({
                ...prev,
                profileImage: new File([], `profile_${resume.id}.png`, { type: 'image/png' })
              }));
            } else {
              console.log('❌ applyResumeToFormInputs - No image found for ID:', resume.id);
            }
          }
        } catch (error) {
          console.log('❌ applyResumeToFormInputs - Error finding image:', error);
        }
      };
      checkImage();
    }
  };

  // บันทึกเฉพาะแท็บปัจจุบัน (partial save)
  const saveCurrentTab = async () => {
    if (isSaving) return;
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
        }));
        // ข้อมูลการรับราชการก่อนหน้า - จะถูกจัดการแยกใน API
        // partial.previousGovernmentService = (formData.previousGovernmentService || []).map((g) => ({
        //   position: g.position,
        //   department: g.department,
        //   reason: g.reason,
        //   date: g.date,
        // }));
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

      // หากยังไม่มีเรคคอร์ด ให้บังคับเริ่มจากแท็บ personal ก่อน
      if (!savedResume?.id && tab !== 'personal') {
        alert('กรุณาบันทึกข้อมูลส่วนตัวก่อน');
        setIsSaving(false);
        return;
      }

      // เรียก API: ถ้ามี id ใช้ PATCH, ถ้าไม่มีก็ POST (multipart แบบเดิม)
      if (savedResume?.id) {
        let res: Response;
        let json: any = {};
        // ส่งข้อมูลแบบ JSON เท่านั้น (รูปภาพจะจัดการแยกผ่าน profile-image/upload API)
        console.log('🔍 handleSubmit PATCH - Sending JSON data only');
        console.log('🔍 handleSubmit PATCH - formData.profileImage:', formData.profileImage);
        res = await fetch(`/api/resume-deposit/${savedResume.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partial)
        });
        json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || 'บันทึกข้อมูลไม่สำเร็จ');
        }
        setSavedResume(json.data || json);
        applyResumeToFormInputs(json.data || json);
      } else {
        // POST เริ่มเรคคอร์ดใหม่ (ส่งเฉพาะ personal ที่จำเป็น)
        const fd = new FormData();
        const baseCreate = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          ...partial
        };
        fd.append('formData', JSON.stringify(baseCreate));
        if (formData.profileImage) fd.append('profileImage', formData.profileImage);
        
        // เพิ่มเอกสารแนบ - ไม่ส่งข้อมูล documents ที่นี่เพราะจะจัดการแยกใน API
        // if (tab === 'documents' && formData.documents) {
        //   for (const [docType, file] of Object.entries(formData.documents)) {
        //     if (file && file instanceof File) {
        //       fd.append(`document_${docType}`, file);
        //       console.log(`🔍 handleSubmit POST - Appending document ${docType}:`, file.name);
        //     }
        //   }
        // }
        
        const res = await fetch('/api/resume-deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partial)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || 'บันทึกข้อมูลไม่สำเร็จ');
        }
        setSavedResume(json.data || json);
        applyResumeToFormInputs(json.data || json);
      }

      // ไปแท็บถัดไปอัตโนมัติหลังบันทึกสำเร็จ
      const flow: Record<string, string> = {
        personal: 'education',
        education: 'work',
        work: 'skills',
        skills: 'position',
        position: 'documents'
      };
      const next = flow[tab as keyof typeof flow];
      if (next) setActiveTab(next);

      alert('บันทึกสำเร็จ');
    } catch (err: any) {
      alert(err?.message || 'เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };
  const [activeTab, setActiveTab] = useState('personal');
  const birthDateRef = useRef<HTMLInputElement | null>(null);
  const idCardIssueDateRef = useRef<HTMLInputElement | null>(null);
  const idCardExpiryDateRef = useRef<HTMLInputElement | null>(null);
  const availableDateRef = useRef<HTMLInputElement | null>(null);
  const workStartRefs = useRef<(HTMLInputElement | null)[]>([]);
  const workEndRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    alert('✅ กรอกข้อมูลตัวอย่างเรียบร้อยแล้ว!\n\n📝 กรอกเฉพาะช่องที่ว่างเท่านั้น\n🔒 ข้อมูลที่มีอยู่แล้วจะไม่ถูกทับ');
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
    const department = searchParams.get('department');
    const departmentId = searchParams.get('departmentId');
    
    if (department) {
      setFormData(prev => ({
        ...prev,
        department: department
      }));
    }
    
    // ดึงข้อมูลแผนกเพิ่มเติมจาก API
    if (departmentId) {
      fetch(`/api/departments?id=${departmentId}`)
        .then(response => response.json())
        .then(data => {
          if (data.department) {
            setFormData(prev => ({
              ...prev,
              department: data.department.name,
              appliedPosition: data.department.positions || '',
              expectedSalary: data.department.salary || ''
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching department details:', error);
        });
    }
  }, [searchParams]);

  // ตั้งค่า flatpickr สำหรับ input วันที่ต่างๆ
  useEffect(() => {
    // วันเกิด
    if (birthDateRef.current) {
      const inst = (birthDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(birthDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates.length > 0) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleInputChange('birthDate', iso);
          }
        }
      });
    }

    // วันที่ออกบัตร
    if (idCardIssueDateRef.current) {
      const inst = (idCardIssueDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(idCardIssueDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates.length > 0) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleInputChange('idCardIssueDate', iso);
          }
        }
      });
    }

    // วันหมดอายุบัตร
    if (idCardExpiryDateRef.current) {
      const inst = (idCardExpiryDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(idCardExpiryDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates.length > 0) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleInputChange('idCardExpiryDate', iso);
          }
        }
      });
    }

    // วันที่พร้อมเริ่มงาน
    if (availableDateRef.current) {
      const inst = (availableDateRef.current as HTMLInputElement & { _flatpickr?: any })._flatpickr;
      if (inst) inst.destroy();
      flatpickr(availableDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates.length > 0) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleInputChange('availableDate', iso);
          }
        }
      });
    }
  }, []);
  // ตั้งค่า flatpickr สำหรับวันที่เริ่มงานและสิ้นสุดงาน
  useEffect(() => {
    formData.workExperience.forEach((_, index) => {
      // วันที่เริ่มงาน
      if (workStartRefs.current[index]) {
        const inst = (workStartRefs.current[index] as HTMLInputElement & { _flatpickr?: any })._flatpickr;
        if (inst) inst.destroy();
        flatpickr(workStartRefs.current[index], {
          locale: Thai,
          dateFormat: 'd/m/Y',
          allowInput: true,
          clickOpens: true,
          defaultDate: formData.workExperience[index]?.startDate ? new Date(formData.workExperience[index].startDate) : undefined,
          onChange: (dates) => {
            if (dates.length > 0) {
              const d = dates[0];
              const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
              handleWorkExperienceChange(index, 'startDate', iso);
            }
          }
        });
      }

      // วันที่สิ้นสุดงาน
      if (workEndRefs.current[index]) {
        const inst = (workEndRefs.current[index] as HTMLInputElement & { _flatpickr?: any })._flatpickr;
        if (inst) inst.destroy();
        flatpickr(workEndRefs.current[index], {
          locale: Thai,
          dateFormat: 'd/m/Y',
          allowInput: true,
          clickOpens: true,
          defaultDate: formData.workExperience[index]?.endDate ? new Date(formData.workExperience[index].endDate) : undefined,
          onChange: (dates) => {
            if (dates.length > 0) {
              const d = dates[0];
              const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
              handleWorkExperienceChange(index, 'endDate', iso);
            }
          }
        });
      }
    });
  }, [formData.workExperience.length]);

  // ฟังก์ชันดึงข้อมูลจาก profile
  const fetchProfileData = async () => {
    if (status === 'loading') return;
    
    console.log('🔍 fetchProfileData - Starting to fetch profile data...');
    console.log('🔍 fetchProfileData - Session:', session);
    console.log('🔍 fetchProfileData - User:', session?.user);
    
    try {
      // ดึงข้อมูลจาก profile API
      const lineId = session?.user?.id || 'unknown';
      console.log('🔍 fetchProfileData - LineId:', lineId);
      console.log('🔍 fetchProfileData - API URL:', `/api/prisma/users?lineId=${lineId}`);
      const response = await fetch(`/api/prisma/users?lineId=${lineId}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 fetchProfileData - API Response:', result);
        console.log('🔍 fetchProfileData - Response success:', result.success);
        console.log('🔍 fetchProfileData - Data length:', result.data?.length);
        
        if (result.success && result.data.length > 0) {
          const user = result.data[0]; // Get first user (should be unique by lineId)
          
          console.log('Profile data loaded from register:', user);
          console.log('🔍 fetchProfileData - User ID:', user.id);
          
          setProfileData(user);
          setIsProfileLoaded(true);
            
            // เติมข้อมูลจาก profile ลงใน form
            setFormData(prev => ({
              ...prev,
            prefix: user.prefix || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            idNumber: user.idNumber || '',
            idCardIssuedAt: user.idCardIssuedAt || '',
            idCardIssueDate: user.idCardIssueDate || '',
            idCardExpiryDate: user.idCardExpiryDate || '',
            birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
            age: user.age || '',
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
            emergencyContactFirstName: user.emergencyContact || '',
            emergencyContactLastName: '',
            emergencyPhone: user.emergencyPhone || '',
            emergencyRelationship: user.emergencyRelationship || '',
              emergencyAddress: {
              houseNumber: user.emergencyAddress?.houseNumber || '',
              villageNumber: user.emergencyAddress?.villageNumber || '',
              alley: user.emergencyAddress?.alley || '',
              road: user.emergencyAddress?.road || '',
              subDistrict: user.emergencyAddress?.subDistrict || '',
              district: user.emergencyAddress?.district || '',
              province: user.emergencyAddress?.province || '',
              postalCode: user.emergencyAddress?.postalCode || '',
              phone: user.emergencyAddress?.phone || '',
              },
              emergencyWorkplace: {
              name: user.emergencyWorkplace?.name || '',
              district: user.emergencyWorkplace?.district || '',
              province: user.emergencyWorkplace?.province || '',
              phone: user.emergencyWorkplace?.phone || '',
            },
            education: user.education?.map((edu: any) => ({
              level: edu.level || '',
              institution: edu.school || '',
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
              reason: work.description || ''
            })) || [],
            skills: user.skills || '',
            languages: user.languages || '',
            computerSkills: user.computerSkills || '',
            certificates: user.certificates || '',
            references: user.references || '',
            appliedPosition: user.appliedPosition || '',
            expectedSalary: user.expectedSalary || '',
            availableStartDate: user.availableStartDate || '',
            reasonForLeaving: user.reasonForLeaving || '',
            additionalInfo: user.additionalInfo || '',
              spouseInfo: {
              firstName: user.spouseInfo?.firstName || '',
              lastName: user.spouseInfo?.lastName || '',
              },
              currentWorkplace: {
              name: user.currentWorkplace?.name || '',
              position: user.currentWorkplace?.position || '',
              department: user.currentWorkplace?.department || '',
              startWork: user.currentWorkplace?.startWork || '',
              }
            }));
            
            // เติมข้อมูลรูปภาพ
          console.log('🔍 fetchProfileData - User data:', user);
          console.log('🔍 fetchProfileData - User profileImageUrl:', user.profileImageUrl);
          console.log('🔍 fetchProfileData - User ID:', user.id);
          
          if (user.profileImageUrl) {
            console.log('✅ fetchProfileData - Using profileImageUrl:', user.profileImageUrl);
            // ใช้ path แบบเดียวกับ profile page
            const imagePath = `/api/image?file=${user.profileImageUrl}`;
            console.log('✅ Using API path for profile image:', imagePath);
            setProfileImage(imagePath);
            
            // อัปเดต formData.profileImage ด้วย
            setFormData(prev => ({
              ...prev,
              profileImage: new File([], user.profileImageUrl, { type: 'image/jpeg' })
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
                  profileImage: new File([], `profile_${user.id}.jpg`, { type: 'image/jpeg' })
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
                    profileImage: new File([], `profile_${user.id}.png`, { type: 'image/png' })
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
          console.log('🔍 fetchProfileData - Profile data loaded and form filled');
        } else {
          console.log('🔍 fetchProfileData - No profile data found');
          console.log('🔍 fetchProfileData - Result:', result);
        }
      } else {
        console.log('🔍 fetchProfileData - API response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
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
        reason: work.description || ''
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

    alert('โหลดข้อมูลจากโปรไฟล์เรียบร้อยแล้ว');
  };

  const getErrorMessage = (fieldName: string) => {
    return errors[fieldName] || '';
  };

  const hasError = (fieldName: string) => {
    return !!errors[fieldName];
  };

  const scrollToError = (errorKey: string) => {
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
    
    if (targetSection) {
      setTimeout(() => {
        scrollTo(targetSection!);
        
        // เพิ่มการ scroll ไปยังฟิลด์ที่มี error โดยตรง
        setTimeout(() => {
          // ค้นหาฟิลด์ที่มี error โดยใช้หลายวิธี
          let errorField = document.querySelector(`[name="${errorKey}"], [data-error-key="${errorKey}"]`);
          
          // ถ้าไม่เจอ ให้ค้นหาด้วยวิธีอื่น
          if (!errorField) {
            // ค้นหาด้วย label text
            const labels = document.querySelectorAll('label');
            for (const label of labels) {
              if (label.textContent?.includes(errorKey) || label.textContent?.includes(getErrorMessage(errorKey))) {
                const input = label.querySelector('input, select, textarea');
                if (input) {
                  errorField = input;
                  break;
                }
              }
            }
          }
          
          // ถ้าไม่เจอ ให้ค้นหาด้วย placeholder
          if (!errorField) {
            const inputs = document.querySelectorAll('input, select, textarea');
            for (const input of inputs) {
              if (input.getAttribute('placeholder')?.includes(errorKey) || 
                  input.getAttribute('placeholder')?.includes(getErrorMessage(errorKey))) {
                errorField = input;
                break;
              }
            }
          }
          
          // ถ้าไม่เจอ ให้ค้นหาด้วย error message
          if (!errorField) {
            const errorMessages = document.querySelectorAll('.text-red-500');
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
          }
          
          // ถ้ายังไม่เจอ ให้ค้นหา error message โดยตรง
          if (!errorField) {
            const errorMessages = document.querySelectorAll('.text-red-500');
            for (const errorMsg of errorMessages) {
              if (errorMsg.textContent?.includes(getErrorMessage(errorKey))) {
                errorField = errorMsg;
                break;
              }
            }
          }
          
          if (errorField) {
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
              if (errorField.classList.contains('text-red-500')) {
                const parentDiv = errorField.closest('div');
                if (parentDiv) {
                  parentDiv.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'bg-red-50');
                  setTimeout(() => {
                    parentDiv.classList.remove('animate-pulse', 'ring-2', 'ring-red-500', 'bg-red-50');
                  }, 3000);
                }
              }
            }
          }
        }, 300);
      }, 100);
    }
  };

  const handleInputChange = (key: string, value: string | boolean | File | File[]) => {
    // ป้องกันไม่ให้แก้ไข department เมื่อมี department จาก URL parameter
    if (key === 'department' && searchParams.get('department')) {
      console.log('🚫 Department cannot be changed when selected from Dashboard');
      return;
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
      alert('กรุณาบันทึกข้อมูลส่วนตัวก่อน');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadDocument(file, documentType, savedResume.id);
      
      if (result.success) {
        // อัปเดตข้อมูลเอกสารที่อัปโหลดแล้ว
        const documents = await fetchUploadedDocuments(savedResume.id);
        setUploadedDocuments(documents);
        alert('อัปโหลดเอกสารสำเร็จ');
      } else {
        alert(result.message || 'เกิดข้อผิดพลาดในการอัปโหลดเอกสาร');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดเอกสาร');
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
        reason: ''
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
          date: ''
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

  // ฟังก์ชันสำหรับการแปลงวันที่ให้แสดงผลในรูปแบบไทย
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // ฟังก์ชันสำหรับการแปลงวันที่จากรูปแบบไทยเป็น ISO
  const parseDateFromThai = (thaiDate: string) => {
    if (!thaiDate) return '';
    try {
      const [day, month, year] = thaiDate.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toISOString().split('T')[0];
    } catch (error) {
      return thaiDate;
    }
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
    if (!formData.idNumber) errors.idNumber = 'กรุณากรอกเลขบัตรประชาชน';
    if (!formData.idCardIssuedAt) errors.idCardIssuedAt = 'กรุณากรอกสถานที่ออกบัตร';
    if (!formData.idCardIssueDate) errors.idCardIssueDate = 'กรุณากรอกวันที่ออกบัตร';
    if (!formData.idCardExpiryDate) errors.idCardExpiryDate = 'กรุณากรอกวันหมดอายุบัตร';
    
    // ที่อยู่ตามทะเบียนบ้าน (จำเป็น)
    if (!formData.registeredAddress?.houseNumber) errors.registeredAddressHouseNumber = 'กรุณากรอกเลขที่';
    if (!formData.registeredAddress?.villageNumber) errors.registeredAddressVillageNumber = 'กรุณากรอกหมู่ที่';
    if (!formData.registeredAddress?.alley) errors.registeredAddressAlley = 'กรุณากรอกตรอก/ซอย';
    if (!formData.registeredAddress?.road) errors.registeredAddressRoad = 'กรุณากรอกถนน';
    if (!formData.registeredAddress?.subDistrict) errors.registeredAddressSubDistrict = 'กรุณากรอกตำบล/แขวง';
    if (!formData.registeredAddress?.district) errors.registeredAddressDistrict = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.registeredAddress?.province) errors.registeredAddressProvince = 'กรุณากรอกจังหวัด';
    if (!formData.registeredAddress?.postalCode) errors.registeredAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์';
    if (!formData.registeredAddress?.mobile) errors.registeredAddressMobile = 'กรุณากรอกโทรศัพท์มือถือ';
    
    // ที่อยู่ปัจจุบัน (จำเป็น)
    if (!formData.currentAddressDetail?.houseNumber) errors.currentAddressHouseNumber = 'กรุณากรอกเลขที่';
    if (!formData.currentAddressDetail?.villageNumber) errors.currentAddressVillageNumber = 'กรุณากรอกหมู่ที่';
    if (!formData.currentAddressDetail?.alley) errors.currentAddressAlley = 'กรุณากรอกตรอก/ซอย';
    if (!formData.currentAddressDetail?.road) errors.currentAddressRoad = 'กรุณากรอกถนน';
    if (!formData.currentAddressDetail?.subDistrict) errors.currentAddressSubDistrict = 'กรุณากรอกตำบล/แขวง';
    if (!formData.currentAddressDetail?.district) errors.currentAddressDistrict = 'กรุณากรอกอำเภอ/เขต';
    if (!formData.currentAddressDetail?.province) errors.currentAddressProvince = 'กรุณากรอกจังหวัด';
    if (!formData.currentAddressDetail?.postalCode) errors.currentAddressPostalCode = 'กรุณากรอกรหัสไปรษณีย์';
    if (!formData.currentAddressDetail?.mobilePhone) errors.currentAddressMobilePhone = 'กรุณากรอกโทรศัพท์มือถือ';
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
    } else if (!/^[0-9]{10}$/.test(formData.emergencyPhone.replace(/[-\s]/g, ''))) {
      errors.emergencyPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)';
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
    } else if (!/^[0-9]{10}$/.test(formData.emergencyWorkplace.phone.replace(/[-\s]/g, ''))) {
      errors.emergencyWorkplacePhone = 'กรุณากรอกเบอร์โทรศัพท์สถานที่ทำงานให้ถูกต้อง (10 หลัก)';
    }
    
    // ข้อมูลการสมัคร (จำเป็น)
    if (!formData.appliedPosition) errors.appliedPosition = 'กรุณากรอกตำแหน่งที่สมัคร';
    if (!formData.expectedSalary) errors.expectedSalary = 'กรุณากรอกเงินเดือนที่คาดหวัง';
    if (!formData.availableDate) errors.availableDate = 'กรุณากรอกวันที่พร้อมเริ่มงาน';
    // ตรวจสอบ department เฉพาะเมื่อไม่มี department จาก URL parameter
    if (!searchParams.get('department') && !formData.department) {
      errors.department = 'กรุณาเลือกแผนกจากหน้า Dashboard หรือกรอกฝ่าย/กลุ่มงาน';
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
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll ไปยังตำแหน่งที่มี error แรก
      const firstErrorKey = Object.keys(validationErrors)[0];
      scrollToError(firstErrorKey);
      
      // แสดง notification ว่ามี error
      // alert(`กรุณาแก้ไขข้อมูลใน ${Object.keys(validationErrors).length} ฟิลด์ที่แสดงข้อผิดพลาด`);
      return;
    }
    
    // ล้าง errors เมื่อ validation ผ่าน
    setErrors({});
    
    // เริ่มการบันทึกข้อมูล
    setIsSaving(true);

    try {
      const timestamp = new Date().toISOString();

      // ส่งข้อมูลไปยังตาราง ResumeDeposit + ความสัมพันธ์ Education/WorkExperience
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
        gender: (formData.gender || 'UNKNOWN') as any,
        nationality: formData.nationality || 'ไทย',
        religion: formData.religion || null,
        maritalStatus: (formData.maritalStatus || 'UNKNOWN') as any,
        // ที่อยู่แบบสรุป (คงค่าเดิมไว้เป็นสำรอง)
        address: formData.currentAddress || formData.addressAccordingToHouseRegistration || null,
        // ที่อยู่ตามทะเบียนบ้าน
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
        // ติดต่อ
        phone: formData.phone,
        email: formData.email,
        emergencyContact: formData.emergencyContact || `${formData.emergencyContactFirstName || ''} ${formData.emergencyContactLastName || ''}`.trim(),
        emergencyPhone: formData.emergencyPhone || null,
        emergencyRelationship: formData.emergencyRelationship || null,
        emergencyWorkplace: {
          name: formData.emergencyWorkplace?.name || '',
          district: formData.emergencyWorkplace?.district || '',
          province: formData.emergencyWorkplace?.province || '',
          phone: formData.emergencyWorkplace?.phone || ''
        },
        // ที่อยู่ผู้ติดต่อฉุกเฉิน
        emergency_address_house_number: formData.emergencyAddress?.houseNumber || null,
        emergency_address_village_number: formData.emergencyAddress?.villageNumber || null,
        emergency_address_alley: formData.emergencyAddress?.alley || null,
        emergency_address_road: formData.emergencyAddress?.road || null,
        emergency_address_sub_district: formData.emergencyAddress?.subDistrict || null,
        emergency_address_district: formData.emergencyAddress?.district || null,
        emergency_address_province: formData.emergencyAddress?.province || null,
        emergency_address_postal_code: formData.emergencyAddress?.postalCode || null,
        emergency_address_phone: formData.emergencyAddress?.phone || null,
        // ความสามารถ
        skills: formData.skills || null,
        languages: formData.languages || null,
        computerSkills: formData.computerSkills || null,
        certificates: formData.certificates || null,
        references: formData.references || null,
        // งานที่สนใจ
        expectedPosition: formData.appliedPosition || null,
        expectedSalary: formData.expectedSalary || null,
        availableDate: formData.availableDate ? new Date(formData.availableDate) : null,
        additionalInfo: null,
        profileImageUrl: formData.profileImage ? `profile_${Date.now()}.${formData.profileImage.name.split('.').pop()}` : null,
        // การศึกษา
        education: (formData.education || []).map((e) => ({
          level: e.level,
          school: e.institution,
          major: e.major || null,
          startYear: undefined,
          endYear: e.year || undefined,
          gpa: e.gpa ? parseFloat(e.gpa) : undefined,
        })),
        // ประสบการณ์ทำงาน
        workExperience: (formData.workExperience || []).map((w) => ({
          position: w.position,
          company: w.company,
          startDate: w.startDate ? new Date(w.startDate) : null,
          endDate: w.endDate ? new Date(w.endDate) : null,
          isCurrent: !!formData.currentWork,
          description: w.reason || null,
          salary: w.salary || null,
        })),
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
        // เอกสารแนบ - ไม่ส่งข้อมูล documents ที่นี่เพราะจะจัดการแยกใน API
        // documents: formData.documents || null,
      };

      // ส่งเป็น JSON เท่านั้น (รูปภาพจะจัดการแยกผ่าน profile-image/upload API)
      console.log('🔍 handleSubmit POST - Sending JSON data only');
      console.log('🔍 handleSubmit POST - formData.profileImage:', formData.profileImage);

      const rdRes = await fetch('/api/resume-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumePayload)
      });
      const rdJson = await rdRes.json().catch(() => ({}));
      if (!rdRes.ok) {
        console.error('❌ ResumeDeposit create failed:', rdRes.status, rdJson);
        alert(rdJson?.message || 'ไม่สามารถบันทึกข้อมูลฝากประวัติได้');
        setIsSaving(false);
        return;
      }

      // เก็บข้อมูลที่บันทึกสำเร็จมาแสดงบนหน้า และเติมค่ากลับลงฟอร์ม
      // พยายามดึงข้อมูลล่าสุดจาก API โดยใช้ id เพื่อให้แน่ใจว่าได้โครงสร้างครบ relations
      let saved = rdJson?.data || rdJson;
      const savedId = saved?.id;
      try {
        if (savedId) {
          const getRes = await fetch(`/api/resume-deposit/${savedId}`);
          if (getRes.ok) {
            const getJson = await getRes.json().catch(() => ({}));
            saved = getJson?.data || getJson || saved;
          }
        } else {
          // ไม่มี id จาก POST: พยายามค้นจากอีเมลล่าสุด
          let candidate: any = null;
          try {
            const byEmail = await fetch(`/api/resume-deposit?email=${encodeURIComponent(formData.email || '')}`);
            if (byEmail.ok) {
              const emailJson = await byEmail.json().catch(() => ({}));
              const list = (emailJson?.data || emailJson || []) as any[];
              const filtered = Array.isArray(list)
                ? list.filter((r) => (r?.email || '').toLowerCase() === (formData.email || '').toLowerCase())
                : [];
              if (filtered.length > 0) {
                filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
                candidate = filtered[0];
              }
            }
          } catch (_) {}

          if (!candidate) {
            // fallback สุดท้าย: ดึงทั้งหมดแล้วกรองในฝั่งหน้า
            try {
              const allRes = await fetch('/api/resume-deposit');
              if (allRes.ok) {
                const allJson = await allRes.json().catch(() => ({}));
                const listAll = (allJson?.data || allJson || []) as any[];
                const filteredAll = Array.isArray(listAll)
                  ? listAll.filter((r) => (r?.email || '').toLowerCase() === (formData.email || '').toLowerCase())
                  : [];
                if (filteredAll.length > 0) {
                  filteredAll.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
                  candidate = filteredAll[0];
                }
              }
            } catch (_) {}
          }

          if (candidate?.id) {
            // ถ้าได้ id จากการค้นหา คิวรี่รายละเอียดเต็มอีกครั้ง
            try {
              const getRes2 = await fetch(`/api/resume-deposit/${candidate.id}`);
              if (getRes2.ok) {
                const getJson2 = await getRes2.json().catch(() => ({}));
                saved = getJson2?.data || getJson2 || candidate;
              } else {
                saved = candidate;
              }
            } catch (_) {
              saved = candidate;
            }
          }
        }
      } catch (_) {}

      setSavedResume(saved);
      try {
        applyResumeToFormInputs(saved);
      } catch (_) {}
      alert('บันทึกข้อมูลฝากประวัติเรียบร้อยแล้ว');
      setIsSaving(false);
      return;
      /* disabled legacy flow
      
      // Validate required fields for create API
      if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
        alert('กรุณากรอก ชื่อ นามสกุล และอีเมล ให้ครบถ้วน');
        setIsSaving(false);
        return;
      }

      // 1) สร้างใบสมัครในฐานข้อมูลก่อน เพื่อให้ได้ applicationId จริง
      const createRes = await fetch('/api/prisma/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ส่งข้อมูลหลักที่จำเป็นขั้นต่ำให้ API สร้างเรคคอร์ด
          prefix: formData.prefix,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          idNumber: formData.idNumber,
          department: formData.department,
          appliedPosition: formData.appliedPosition,
          status: 'PENDING',
          submittedAt: timestamp
        })
      });
      const createdApp = await createRes.json();
      if (!createRes.ok) {
        console.error('❌ Create application failed:', createRes.status, createdApp);
        alert(createdApp?.message || 'ไม่สามารถสร้างใบสมัครได้');
        setIsSaving(false);
        return;
      }
      const createdId = createdApp?.id || createdApp?.data?.id;
      if (!createdId) {
        console.error('❌ Missing application id in response:', createdApp);
        alert('การสร้างใบสมัครสำเร็จแต่ไม่ได้รับรหัสอ้างอิง (id)');
        setIsSaving(false);
        return;
      }
      const applicationId = createdId as string;

      const applicationData = {
        id: applicationId,
        submittedAt: timestamp,
        status: "pending",
        prefix: formData.prefix,
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        idCardIssuedAt: formData.idCardIssuedAt,
        idCardIssueDate: formData.idCardIssueDate,
        idCardExpiryDate: formData.idCardExpiryDate,
        birthDate: formData.birthDate,
        age: formData.age,
        race: formData.race,
        placeOfBirth: formData.placeOfBirth,
        placeOfBirthProvince: formData.placeOfBirthProvince,
        gender: formData.gender,
        nationality: formData.nationality,
        religion: formData.religion,
        maritalStatus: formData.maritalStatus,
        addressAccordingToHouseRegistration: formData.addressAccordingToHouseRegistration,
        currentAddress: formData.currentAddress,
        phone: formData.phone,
        email: formData.email,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelationship: formData.emergencyRelationship,
        emergencyAddress: formData.emergencyAddress,
        emergencyWorkplace: formData.emergencyWorkplace,
        appliedPosition: formData.appliedPosition,
        expectedSalary: formData.expectedSalary,
        availableDate: formData.availableDate,
        currentWork: formData.currentWork,
        department: formData.department,
        education: formData.education,
        workExperience: formData.workExperience,
        skills: formData.skills,
        languages: formData.languages,
        computerSkills: formData.computerSkills,
        certificates: formData.certificates,
        references: formData.references,
        spouseInfo: formData.spouseInfo,
        registeredAddress: formData.registeredAddress,
        currentAddressDetail: formData.currentAddressDetail,
        medicalRights: formData.medicalRights,
        multipleEmployers: formData.multipleEmployers,
        staffInfo: formData.staffInfo,
        profileImage: '',
        documents: {},
        updatedAt: timestamp
      };

      // อัปโหลดรูปโปรไฟล์
      let profileImageName = '';
      if (formData.profileImage) {
        const fileExtension = formData.profileImage.name.split('.').pop();
        profileImageName = `profile_${applicationId}.${fileExtension}`;
        
        // สร้าง FormData สำหรับอัปโหลดรูปภาพ
        const imageFormData = new FormData();
        imageFormData.append('file', formData.profileImage);
        imageFormData.append('filename', profileImageName);
        
        try {
          const imageResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: imageFormData
          });
          
          if (!imageResponse.ok) {
            throw new Error('Failed to upload profile image');
          }
          
          applicationData.profileImage = profileImageName;
        } catch (error) {
          console.error('Error uploading profile image:', error);
          alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          return;
        }
      }

      // อัปโหลดเอกสาร
      const documents: any = {};
      if (formData.documents) {
        for (const [docType, file] of Object.entries(formData.documents)) {
          if (file) {
            if (Array.isArray(file)) {
              // สำหรับไฟล์หลายไฟล์
              const fileNames: string[] = [];
              for (let i = 0; i < file.length; i++) {
                const singleFile = file[i];
                const docFormData = new FormData();
                docFormData.append('file', singleFile);
                docFormData.append('documentType', docType);
                docFormData.append('applicationId', applicationId);
                try {
                  const docResponse = await fetch('/api/documents/upload', {
                    method: 'POST',
                    body: docFormData
                  });
                  const result = await docResponse.json();
                  if (!docResponse.ok || !result?.success) {
                    throw new Error(result?.message || `Failed to upload ${docType} document`);
                  }
                  fileNames.push(result.data?.fileName || '');
                } catch (error) {
                  console.error(`Error uploading ${docType} document:`, error);
                  alert(`เกิดข้อผิดพลาดในการอัปโหลดเอกสาร ${docType}`);
                  return;
                }
              }
              documents[docType] = fileNames;
            } else {
              // สำหรับไฟล์เดียว
              const docFormData = new FormData();
              docFormData.append('file', file);
              docFormData.append('documentType', docType);
              docFormData.append('applicationId', applicationId);
              try {
                const docResponse = await fetch('/api/documents/upload', {
                  method: 'POST',
                  body: docFormData
                });
                const result = await docResponse.json();
                if (!docResponse.ok || !result?.success) {
                  throw new Error(result?.message || `Failed to upload ${docType} document`);
                }
                documents[docType] = result.data?.fileName;
              } catch (error) {
                console.error(`Error uploading ${docType} document:`, error);
                alert(`เกิดข้อผิดพลาดในการอัปโหลดเอกสาร ${docType}`);
                return;
              }
            }
          }
        }
      }
      
      applicationData.documents = documents;

      // Debug: ตรวจสอบข้อมูลก่อนแปลง
      console.log('🔍 Application Data before conversion:', applicationData);
      console.log('📚 Education data:', applicationData.education);
      console.log('💼 Work Experience data:', applicationData.workExperience);
      console.log('📅 Date fields:', {
        idCardIssueDate: applicationData.idCardIssueDate,
        idCardExpiryDate: applicationData.idCardExpiryDate,
        birthDate: applicationData.birthDate,
        availableDate: applicationData.availableDate
      });

      // แปลงข้อมูลเป็น Prisma format
      const prismaData = {
        userId: null,
        prefix: applicationData.prefix,
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        idNumber: applicationData.idNumber,
        idCardIssuedAt: applicationData.idCardIssuedAt,
        idCardIssueDate: applicationData.idCardIssueDate ? new Date(applicationData.idCardIssueDate) : null,
        idCardExpiryDate: applicationData.idCardExpiryDate ? new Date(applicationData.idCardExpiryDate) : null,
        birthDate: applicationData.birthDate ? new Date(applicationData.birthDate) : null,
        age: applicationData.age ? parseInt(applicationData.age) : null,
        race: applicationData.race,
        placeOfBirth: applicationData.placeOfBirth,
        placeOfBirthProvince: applicationData.placeOfBirthProvince,
        gender: applicationData.gender === 'ชาย' ? 'MALE' : applicationData.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN',
        nationality: applicationData.nationality,
        religion: applicationData.religion,
        maritalStatus: applicationData.maritalStatus === 'โสด' ? 'SINGLE' : 
                      applicationData.maritalStatus === 'สมรส' ? 'MARRIED' : 
                      applicationData.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                      applicationData.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN',
        addressAccordingToHouseRegistration: applicationData.addressAccordingToHouseRegistration,
        currentAddress: applicationData.currentAddress,
        phone: applicationData.phone,
        email: applicationData.email,
        emergencyContact: applicationData.emergencyContact,
        emergencyPhone: applicationData.emergencyPhone,
        emergencyRelationship: applicationData.emergencyRelationship,
        appliedPosition: applicationData.appliedPosition,
        expectedSalary: applicationData.expectedSalary,
        availableDate: applicationData.availableDate ? new Date(applicationData.availableDate) : null,
        currentWork: applicationData.currentWork || false,
        department: applicationData.department,
        skills: applicationData.skills,
        languages: applicationData.languages,
        computerSkills: applicationData.computerSkills,
        certificates: applicationData.certificates,
        references: applicationData.references,
        profileImage: applicationData.profileImage,
        status: 'PENDING',
        // Education data
        education: applicationData.education?.map((edu: any) => ({
          level: edu.level,
          institution: edu.institution || edu.school,
          major: edu.major,
          year: edu.year || edu.graduationYear,
          gpa: edu.gpa ? parseFloat(edu.gpa) : null
        })) || [],
        // Work experience data
        workExperience: applicationData.workExperience?.map((work: any) => ({
          position: work.position,
          company: work.company,
          startDate: work.startDate ? new Date(work.startDate) : null,
          endDate: work.endDate ? new Date(work.endDate) : null,
          salary: work.salary,
          reason: work.reason
        })) || [],
        
        // Address details - ที่อยู่ตามทะเบียนบ้าน
        house_registration_house_number: applicationData.registeredAddress?.houseNumber || '',
        house_registration_village_number: applicationData.registeredAddress?.villageNumber || '',
        house_registration_alley: applicationData.registeredAddress?.alley || '',
        house_registration_road: applicationData.registeredAddress?.road || '',
        house_registration_sub_district: applicationData.registeredAddress?.subDistrict || '',
        house_registration_district: applicationData.registeredAddress?.district || '',
        house_registration_province: applicationData.registeredAddress?.province || '',
        house_registration_postal_code: applicationData.registeredAddress?.postalCode || '',
        house_registration_phone: applicationData.registeredAddress?.phone || '',
        house_registration_mobile: applicationData.registeredAddress?.mobile || '',
        
        // Address details - ที่อยู่ปัจจุบัน
        current_address_house_number: applicationData.currentAddressDetail?.houseNumber || '',
        current_address_village_number: applicationData.currentAddressDetail?.villageNumber || '',
        current_address_alley: applicationData.currentAddressDetail?.alley || '',
        current_address_road: applicationData.currentAddressDetail?.road || '',
        current_address_sub_district: applicationData.currentAddressDetail?.subDistrict || '',
        current_address_district: applicationData.currentAddressDetail?.district || '',
        current_address_province: applicationData.currentAddressDetail?.province || '',
        current_address_postal_code: applicationData.currentAddressDetail?.postalCode || '',
        current_address_phone: applicationData.currentAddressDetail?.homePhone || '',
        current_address_mobile: applicationData.currentAddressDetail?.mobilePhone || '',
        
        // Address details - ที่อยู่ผู้ติดต่อฉุกเฉิน
        emergency_address_house_number: applicationData.emergencyAddress?.houseNumber || '',
        emergency_address_village_number: applicationData.emergencyAddress?.villageNumber || '',
        emergency_address_alley: applicationData.emergencyAddress?.alley || '',
        emergency_address_road: applicationData.emergencyAddress?.road || '',
        emergency_address_sub_district: applicationData.emergencyAddress?.subDistrict || '',
        emergency_address_district: applicationData.emergencyAddress?.district || '',
        emergency_address_province: applicationData.emergencyAddress?.province || '',
        emergency_address_postal_code: applicationData.emergencyAddress?.postalCode || '',
        emergency_address_phone: applicationData.emergencyAddress?.phone || '',
        
        // Spouse information
        spouse_first_name: applicationData.spouseInfo?.firstName || '',
        spouse_last_name: applicationData.spouseInfo?.lastName || ''
      };

      // Debug: ตรวจสอบข้อมูลหลังแปลง
      console.log('🔍 Prisma Data after conversion:', prismaData);
      console.log('📚 Prisma Education data:', prismaData.education);
      console.log('💼 Prisma Work Experience data:', prismaData.workExperience);
      console.log('🏠 Address Data:');
      console.log('  House Registration:', {
        houseNumber: prismaData.house_registration_house_number,
        villageNumber: prismaData.house_registration_village_number,
        alley: prismaData.house_registration_alley,
        road: prismaData.house_registration_road,
        subDistrict: prismaData.house_registration_sub_district,
        district: prismaData.house_registration_district,
        province: prismaData.house_registration_province,
        postalCode: prismaData.house_registration_postal_code,
        phone: prismaData.house_registration_phone,
        mobile: prismaData.house_registration_mobile
      });
      console.log('  Current Address:', {
        houseNumber: prismaData.current_address_house_number,
        villageNumber: prismaData.current_address_village_number,
        alley: prismaData.current_address_alley,
        road: prismaData.current_address_road,
        subDistrict: prismaData.current_address_sub_district,
        district: prismaData.current_address_district,
        province: prismaData.current_address_province,
        postalCode: prismaData.current_address_postal_code,
        phone: prismaData.current_address_phone,
        mobile: prismaData.current_address_mobile
      });
      console.log('  Emergency Address:', {
        houseNumber: prismaData.emergency_address_house_number,
        villageNumber: prismaData.emergency_address_village_number,
        alley: prismaData.emergency_address_alley,
        road: prismaData.emergency_address_road,
        subDistrict: prismaData.emergency_address_sub_district,
        district: prismaData.emergency_address_district,
        province: prismaData.emergency_address_province,
        postalCode: prismaData.emergency_address_postal_code,
        phone: prismaData.emergency_address_phone
      });
      // บันทึกข้อมูลไปยังฐานข้อมูล MySQL ผ่าน Prisma
      try {
        const saveResponse = await fetch('/api/prisma/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prismaData)
        });
        
        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.message || 'Failed to save application data');
        }
        
        const result = await saveResponse.json();
        
        // Debug: ตรวจสอบ response จาก API
        console.log('📡 API Response:', result);
        
        if (result.success) {
          console.log('✅ Data saved successfully');
          alert('บันทึกข้อมูลเรียบร้อยแล้ว');
          // รีเซ็ตฟอร์ม
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
          
          // ล้างรูปภาพและเอกสาร
          setProfileImage(null);
          
          // กลับไปหน้า dashboard
          router.push('/dashboard');
        } else {
          throw new Error(result.message || 'Failed to save application');
        }
      } catch (error) {
        console.error('Error saving application data:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
*/
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      // ปิด loading state
      setIsSaving(false);
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
                        สมัครงานตำแหน่งในแผนก: <span className="font-bold">{departmentName}</span>
                    </span>
                  </div>
                    {departmentId && (
                    <div className="text-xs text-green-700">
                        <span className="font-medium">รหัสแผนก:</span> {departmentId}
                    </div>
                  )}
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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                  alert('🎲 กรอกข้อมูลตัวอย่างแบบ Random เรียบร้อยแล้ว! ข้อมูลจะแตกต่างกันทุกครั้งที่กดปุ่มนี้');
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
                    alert('🔄 ล้างข้อมูลเรียบร้อยแล้ว! ตอนนี้คุณสามารถกรอกข้อมูลใหม่ได้');
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
                    alert('✅ ข้อมูลครบถ้วนแล้ว! สามารถกดบันทึกได้');
                  } else {
                    alert(`❌ ข้อมูลไม่ครบถ้วน\n\nมีข้อผิดพลาด ${Object.keys(errors).length} รายการ:\n\n${Object.keys(errors).map(key => `• ${errors[key]}`).join('\n')}`);
                  }
                }}
              >
                ทดสอบ Validation
              </Button>
            </div>
          </div>
        </div>
        
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
              alert('กรุณาบันทึกข้อมูลส่วนตัวก่อนอัปโหลดรูปภาพ');
              return;
            }
            
            const form = new FormData()
            form.append('file', file)
            form.append('applicationId', savedResume.id) // ใช้ resume ID จริง
            try {
              const res = await fetch('/api/profile-image/upload', { method: 'POST', body: form })
              const data = await res.json()
              if (res.ok && data.profileImage) {
                console.log('✅ Profile image upload success:', data.profileImage);
                setProfileImage(`/api/image?file=${data.profileImage}`)
                setFormData((prev: any) => ({ ...prev, profileImage: file }))
                
                // อัปเดต savedResume ด้วย
                setSavedResume((prev: any) => prev ? {
                  ...prev,
                  profileImageUrl: data.profileImage
                } : null);
                
                console.log('🔍 Updated formData.profileImage:', file);
                console.log('🔍 Updated savedResume.profileImageUrl:', data.profileImage);
                alert('อัปโหลดรูปภาพเรียบร้อยแล้ว')
              } else {
                console.error('❌ Profile image upload failed:', data);
                alert('อัปโหลดรูปภาพไม่สำเร็จ')
              }
            } catch (err) {
              console.error(err)
              alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
            } finally {
              if (fileInputRef.current) fileInputRef.current.value = ''
            }
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
              {isProfileLoaded && profileData && (
                <div className="flex gap-2">
                <Button
                  color="success"
                  variant="flat"
                  size="sm"
                  onPress={loadProfileData}
                  startContent={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  }
                >
                  โหลดข้อมูลจากโปรไฟล์
                </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    size="sm"
                    onPress={fetchProfileData}
                    startContent={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    }
                  >
                    ดึงข้อมูลจาก Profile API
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() => {
                      console.log('🔍 Debug - Current states:');
                      console.log('  - profileImage:', profileImage);
                      console.log('  - formData.profileImage:', formData.profileImage);
                      console.log('  - savedResume:', savedResume);
                      console.log('  - isProfileLoaded:', isProfileLoaded);
                    }}
                    startContent={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  >
                    Debug States
                  </Button>
                </div>
              )}
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
                return null;
              })()}
              {profileImage ? (
                <>
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="รูปภาพโปรไฟล์"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        console.log('❌ รูปภาพโหลดไม่สำเร็จ:', profileImage);
                        console.log('❌ Error details:', e);
                        setProfileImage(null);
                      }}
                      onLoad={() => {
                        console.log('✅ รูปภาพโหลดสำเร็จ:', profileImage);
                      }}
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      R
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mt-3 font-medium">
                    {savedResume?.profileImageUrl ? 'รูปภาพที่บันทึกไว้แล้ว' : profileData?.profileImageUrl ? 'รูปภาพจากโปรไฟล์' : 'รูปภาพใหม่'}
                  </p>
                  <div className="mt-4 flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors duration-200 flex items-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      อัปโหลดรูปใหม่
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImage(null)
                        setFormData(prev => ({ ...prev, profileImage: undefined }))
                        alert('ลบรูปภาพเรียบร้อยแล้ว')
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
                  <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded">
                    <p>Debug Info:</p>
                    <p>• profileImage: {profileImage || 'null'}</p>
                    <p>• savedResume?.profileImageUrl: {savedResume?.profileImageUrl || 'null'}</p>
                    <p>• profileData?.profileImageUrl: {profileData?.profileImageUrl || 'null'}</p>
                    <p>• profileData?.id: {profileData?.id || 'null'}</p>
                  </div>
                  {savedResume?.profileImageUrl && (
                    <p className="text-xs text-gray-400 mt-1">
                      รูปภาพที่บันทึกไว้: {savedResume.profileImageUrl}
                    </p>
                  )}
                  {profileData?.profileImageUrl && !savedResume?.profileImageUrl && (
                    <p className="text-xs text-blue-400 mt-1">
                      รูปภาพจากโปรไฟล์: {profileData.profileImageUrl}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      อัปโหลดรูปโปรไฟล์
                    </button>
                    {profileData?.profileImageUrl && !savedResume?.profileImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const imagePath = `/api/image?file=${profileData.profileImageUrl}`;
                          console.log('🔍 Trying to load profile image:', imagePath);
                          setProfileImage(imagePath);
                          setFormData(prev => ({
                            ...prev,
                            profileImage: new File([], profileData.profileImageUrl, { type: 'image/jpeg' })
                          }));
                          alert('นำรูปภาพจากโปรไฟล์มาใช้เรียบร้อยแล้ว');
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ใช้รูปจากโปรไฟล์
                      </button>
                    )}
                    {profileData?.id && (
                      <button
                        type="button"
                        onClick={async () => {
                          console.log('🔍 Testing image loading for ID:', profileData.id);
                          // ลองหาไฟล์ JPG ก่อน
                          const jpgPath = `/api/image?file=profile_${profileData.id}.jpg`;
                          console.log('🔍 Trying JPG path:', jpgPath);
                          try {
                            const response = await fetch(jpgPath, { method: 'HEAD' });
                            if (response.ok) {
                              console.log('✅ Found JPG image:', jpgPath);
                              setProfileImage(jpgPath);
                              setFormData(prev => ({
                                ...prev,
                                profileImage: new File([], `profile_${profileData.id}.jpg`, { type: 'image/jpeg' })
                              }));
                              alert('พบรูปภาพ JPG และโหลดเรียบร้อยแล้ว');
                            } else {
                              // ลองหาไฟล์ PNG
                              const pngPath = `/api/image?file=profile_${profileData.id}.png`;
                              console.log('🔍 Trying PNG path:', pngPath);
                              const pngResponse = await fetch(pngPath, { method: 'HEAD' });
                              if (pngResponse.ok) {
                                console.log('✅ Found PNG image:', pngPath);
                                setProfileImage(pngPath);
                                setFormData(prev => ({
                                  ...prev,
                                  profileImage: new File([], `profile_${profileData.id}.png`, { type: 'image/png' })
                                }));
                                alert('พบรูปภาพ PNG และโหลดเรียบร้อยแล้ว');
                              } else {
                                console.log('❌ No image found for ID:', profileData.id);
                                alert('ไม่พบรูปภาพสำหรับ ID นี้');
                              }
                            }
                          } catch (error) {
                            console.error('❌ Error testing image:', error);
                            alert('เกิดข้อผิดพลาดในการทดสอบรูปภาพ');
                          }
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ทดสอบโหลดรูป
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        console.log('🔄 Refreshing profile data...');
                        fetchProfileData();
                      }}
                      className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      รีเฟรชข้อมูล
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    รูปภาพจะถูกบันทึกในโฟลเดอร์ Image
                  </p>
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
                  <div className="text-sm text-green-700 font-semibold mb-1">บันทึกข้อมูลเรียบร้อยแล้ว</div>
                  <div className="text-sm text-green-800">
                    <span className="font-medium">ชื่อ-นามสกุล:</span> {savedResume.firstName} {savedResume.lastName}
                  </div>
                  <div className="text-sm text-green-800">
                    <span className="font-medium">ตำแหน่งที่สนใจ:</span> {savedResume.expectedPosition || '-'}
                  </div>
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
                         onChange={(e) => handleTextInputChange('firstName', e.target.value)}
                    placeholder="กรอกชื่อ"
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
                         onChange={(e) => handleTextInputChange('lastName', e.target.value)}
                    placeholder="กรอกนามสกุล"
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
                  <input
                        ref={birthDateRef}
                    type="text"
                         name="birthDate"
                         data-error-key="birthDate"
                         value={formatDateForDisplay(formData.birthDate)}
                         onChange={(e) => {
                           const isoDate = parseDateFromThai(e.target.value);
                           handleInputChange('birthDate', isoDate);
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
                          onChange={(e) => handleNumberInputChange('age', e.target.value)}
                         placeholder="กรอกอายุ"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('age') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                       {hasError('age') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('age')}</p>
                  )}
                       <p className="text-xs text-gray-500">กรุณากรอกอายุ</p>
                </div>

                <div className="space-y-2">
                                               <label className="text-sm font-medium text-gray-700">สถานที่เกิด อำภเอ/เขต<span className="text-red-500">*</span></label>
                  <input
                         type="text"
                         name="placeOfBirth"
                         data-error-key="placeOfBirth"
                         value={formData.placeOfBirth || ''}
                         onChange={(e) => handleTextInputChange('placeOfBirth', e.target.value)}
                         placeholder="กรอกสถานที่เกิด"
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
                         onChange={(e) => handleTextInputChange('placeOfBirthProvince', e.target.value)}
                         placeholder="กรอกจังหวัด"
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
                         onChange={(e) => handleTextInputChange('race', e.target.value)}
                         placeholder="กรอกเชื้อชาติ"
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
                         onChange={(e) => handleTextInputChange('nationality', e.target.value)}
                    placeholder="กรอกสัญชาติ"
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
                         onChange={(e) => handleTextInputChange('religion', e.target.value)}
                    placeholder="กรอกศาสนา"
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
                          onChange={(e) => handleNumberInputChange('idNumber', e.target.value)}
                         placeholder="กรุณากรอกเลขบัตรประชาชน"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                           hasError('idNumber') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    />
                       {hasError('idNumber') && (
                         <p className="text-red-500 text-xs mt-1">{getErrorMessage('idNumber')}</p>
                  )}
                </div>
                  <div className="space-y-2">
                                             <label className="text-sm font-medium text-gray-700">ออกให้ ณ อำเภอ/เขต<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                        name="idCardIssuedAt"
                        data-error-key="idCardIssuedAt"
                        value={formData.idCardIssuedAt}
                        onChange={(e) => handleTextInputChange('idCardIssuedAt', e.target.value)}
                        placeholder="กรอกสถานที่ออกบัตร"
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
                      <input
                        ref={idCardIssueDateRef}
                        type="text"
                        name="idCardIssueDate"
                        data-error-key="idCardIssueDate"
                        value={formatDateForDisplay(formData.idCardIssueDate)}
                        onChange={(e) => {
                          const isoDate = parseDateFromThai(e.target.value);
                          handleInputChange('idCardIssueDate', isoDate);
                        }}
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
                    <input
                        ref={idCardExpiryDateRef}
                      type="text"
                        name="idCardExpiryDate"
                        data-error-key="idCardExpiryDate"
                        value={formatDateForDisplay(formData.idCardExpiryDate)}
                        onChange={(e) => {
                          const isoDate = parseDateFromThai(e.target.value);
                          handleInputChange('idCardExpiryDate', isoDate);
                        }}
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
                         onChange={(e) => handleNumberInputChange('registeredAddress.houseNumber', e.target.value)}
                        placeholder="กรอกเลขที่"
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
                         onChange={(e) => handleNumberInputChange('registeredAddress.villageNumber', e.target.value)}
                        placeholder="กรอกหมู่ที่"
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
                        onChange={(e) => handleInputChange('registeredAddress.alley', e.target.value)}
                        placeholder="กรอกตรอก/ซอย"
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
                        onChange={(e) => handleInputChange('registeredAddress.road', e.target.value)}
                        placeholder="กรอกถนน"
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
                        onChange={(e) => handleTextInputChange('registeredAddress.subDistrict', e.target.value)}
                      placeholder="กรอกตำบล/แขวง"
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
                        onChange={(e) => handleTextInputChange('registeredAddress.district', e.target.value)}
                      placeholder="กรอกอำเภอ/เขต"
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
                        onChange={(e) => handleTextInputChange('registeredAddress.province', e.target.value)}
                        placeholder="กรอกจังหวัด"
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
                         onChange={(e) => handleNumberInputChange('registeredAddress.postalCode', e.target.value)}
                      placeholder="กรอกรหัสไปรษณีย์"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('registeredAddressPostalCode') 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                      {hasError('registeredAddressPostalCode') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('registeredAddressPostalCode')}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                    <input
                      type="text"
                        value={formData.registeredAddress?.phone || ''}
                         onChange={(e) => handleNumberInputChange('registeredAddress.phone', e.target.value)}
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
                         onChange={(e) => handleNumberInputChange('registeredAddress.mobile', e.target.value)}
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
                  <h4 className="text-md font-semibold text-gray-700 mb-3 text-left">๑.๕ ที่อยู่ปัจจุบันเลขที่</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">เลขที่<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.currentAddressDetail?.houseNumber || ''}
                         onChange={(e) => handleNumberInputChange('currentAddressDetail.houseNumber', e.target.value)}
                        placeholder="กรอกเลขที่"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressHouseNumber') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                         onChange={(e) => handleNumberInputChange('currentAddressDetail.villageNumber', e.target.value)}
                        placeholder="กรอกหมู่ที่"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressVillageNumber') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                        onChange={(e) => handleInputChange('currentAddressDetail.alley', e.target.value)}
                        placeholder="กรอกตรอก/ซอย"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressAlley') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                        onChange={(e) => handleInputChange('currentAddressDetail.road', e.target.value)}
                        placeholder="กรอกถนน"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressRoad') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                        onChange={(e) => handleTextInputChange('currentAddressDetail.subDistrict', e.target.value)}
                        placeholder="กรอกตำบล/แขวง"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressSubDistrict') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                        onChange={(e) => handleTextInputChange('currentAddressDetail.district', e.target.value)}
                        placeholder="กรอกอำเภอ/เขต"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressDistrict') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                        onChange={(e) => handleTextInputChange('currentAddressDetail.province', e.target.value)}
                        placeholder="กรอกจังหวัด"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressProvince') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                        onChange={(e) => handleNumberInputChange('currentAddressDetail.postalCode', e.target.value)}
                        placeholder="กรอกรหัสไปรษณีย์"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressPostalCode') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {hasError('currentAddressPostalCode') && (
                        <p className="text-red-500 text-xs mt-1">{getErrorMessage('currentAddressPostalCode')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์บ้าน</label>
                      <input
                        type="tel"
                        value={formData.currentAddressDetail?.homePhone || ''}
                        onChange={(e) => handleNumberInputChange('currentAddressDetail.homePhone', e.target.value)}
                        placeholder="กรอกเบอร์โทรศัพท์บ้าน"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">โทรศัพท์มือถือ<span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={formData.currentAddressDetail?.mobilePhone || ''}
                         onChange={(e) => handleNumberInputChange('currentAddressDetail.mobilePhone', e.target.value)}
                        placeholder="กรอกเบอร์โทรศัพท์มือถือ"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                          hasError('currentAddressMobilePhone') 
                            ? 'border-red-500 focus:ring-red-500' 
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
                          onChange={(e) => handleTextInputChange('emergencyContactFirstName', e.target.value)}
                          placeholder="กรอกชื่อผู้ติดต่อฉุกเฉิน"
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
                          onChange={(e) => handleTextInputChange('emergencyContactLastName', e.target.value)}
                          placeholder="กรอกนามสกุลผู้ติดต่อฉุกเฉิน"
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
                          onChange={(e) => handleTextInputChange('emergencyRelationship', e.target.value)}
                          placeholder="กรอกความสัมพันธ์"
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
                          onChange={(e) => handleNumberInputChange('emergencyPhone', e.target.value)}
                          placeholder="กรอกเบอร์โทรฉุกเฉิน"
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
                            onChange={(e) => handleNumberInputChange('emergencyAddress.houseNumber', e.target.value)}
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
                            onChange={(e) => handleNumberInputChange('emergencyAddress.villageNumber', e.target.value)}
                            placeholder="กรอกหมู่ที่"
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
                            onChange={(e) => handleInputChange('emergencyAddress.alley', e.target.value)}
                            placeholder="กรอกตรอก/ซอย"
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
                            onChange={(e) => handleInputChange('emergencyAddress.road', e.target.value)}
                            placeholder="กรอกถนน"
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
                            onChange={(e) => handleTextInputChange('emergencyAddress.subDistrict', e.target.value)}
                            placeholder="กรอกตำบล/แขวง"
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
                            onChange={(e) => handleTextInputChange('emergencyAddress.district', e.target.value)}
                            placeholder="กรอกอำเภอ/เขต"
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
                            onChange={(e) => handleTextInputChange('emergencyAddress.province', e.target.value)}
                            placeholder="กรอกจังหวัด"
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
                            onChange={(e) => handleNumberInputChange('emergencyAddress.postalCode', e.target.value)}
                            placeholder="กรอกรหัสไปรษณีย์"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError('emergencyAddressPostalCode') ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError('emergencyAddressPostalCode') && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage('emergencyAddressPostalCode')}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">โทรศัพท์</label>
                          <input
                            type="text"
                            value={formData.emergencyAddress?.phone || ''}
                            onChange={(e) => handleNumberInputChange('emergencyAddress.phone', e.target.value)}
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
                            onChange={(e) => handleTextInputChange('emergencyWorkplace.name', e.target.value)}
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
                            onChange={(e) => handleTextInputChange('emergencyWorkplace.district', e.target.value)}
                            placeholder="กรอกอำเภอ/เขต"
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
                            onChange={(e) => handleTextInputChange('emergencyWorkplace.province', e.target.value)}
                            placeholder="กรอกจังหวัด"
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
                            onChange={(e) => handleNumberInputChange('emergencyWorkplace.phone', e.target.value)}
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
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b-2 border-dotted border-gray-400 pb-2">
                  ๔. เอกสารแนบ
                </h3>
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
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              window.open(doc.filePath, '_blank');
                            }}
                        >
                          ดูตัวอย่าง
                        </Button>
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
                          <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.idCard instanceof File) {
                                handlePreviewFile(formData.documents!.idCard, 'สำเนาบัตรประชาชน');
                              }
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                          </Button>
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
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              window.open(doc.filePath, '_blank');
                            }}
                        >
                          ดูตัวอย่าง
                        </Button>
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
                          <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.houseRegistration instanceof File) {
                                handlePreviewFile(formData.documents!.houseRegistration, 'สำเนาทะเบียนบ้าน');
                              }
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                          </Button>
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
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              window.open(doc.filePath, '_blank');
                            }}
                        >
                          ดูตัวอย่าง
                        </Button>
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
                          <Button
                            color="secondary"
                            variant="bordered"
                            size="sm"
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.educationCertificate instanceof File) {
                                handlePreviewFile(formData.documents!.educationCertificate, 'ใบรับรองการศึกษา');
                              }
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'กำลังอัปโหลด...' : 'ดูตัวอย่าง'}
                          </Button>
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
                      onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleInputChange('documents.militaryCertificate', file);
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
                      {formData.documents?.militaryCertificate && formData.gender !== 'หญิง' && (
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
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.militaryCertificate instanceof File) {
                                handlePreviewFile(formData.documents!.militaryCertificate, 'ใบรับรองทหาร');
                              } else {
                                alert('ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
                              }
                            }}
                        >
                          ดูตัวอย่าง
                        </Button>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.medicalCertificate', file);
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
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.medicalCertificate instanceof File) {
                                handlePreviewFile(formData.documents!.medicalCertificate, 'ใบรับรองแพทย์');
                              } else {
                                alert('ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
                              }
                            }}
                        >
                          ดูตัวอย่าง
                        </Button>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange('documents.drivingLicense', file);
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
                        <Button
                          color="secondary"
                          variant="bordered"
                          size="sm"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200"
                            onClick={() => {
                              if (formData.documents!.drivingLicense instanceof File) {
                                handlePreviewFile(formData.documents!.drivingLicense, 'ใบขับขี่');
                              } else {
                                alert('ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
                              }
                            }}
                        >
                          ดูตัวอย่าง
                        </Button>
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
                            <Button
                              key={index}
                              color="secondary"
                              variant="bordered"
                              size="sm"
                              className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-300 rounded-lg shadow-sm transition-all duration-200 text-xs"
                              onClick={() => {
                                if (file instanceof File) {
                                  handlePreviewFile(file, `เอกสารอื่นๆ ${index + 1}`);
                                } else if (typeof file === 'object' && 'file' in file && file.file) {
                                  handlePreviewFile(file.file, `เอกสารอื่นๆ ${index + 1}`);
                                } else {
                                  alert('ไฟล์นี้ถูกอัปโหลดแล้วในระบบ');
                                }
                              }}
                            >
                              ดูตัวอย่าง {index + 1}
                            </Button>
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
                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                            placeholder="กรอกปีที่จบ"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Year`) ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {hasError(`education${index}Year`) && (
                            <div className="text-xs text-red-600">
                              {getErrorMessage(`education${index}Year`)}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">เกรดเฉลี่ย<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                            placeholder="กรอกเกรดเฉลี่ย"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <label className="text-sm font-medium text-gray-700">วันที่เริ่มงาน<span className="text-red-500">*</span></label>
                          <input
                            ref={(el) => {
                              if (workStartRefs.current) {
                                workStartRefs.current[index] = el;
                              }
                            }}
                            type="text"
                            value={formatDateForDisplay(work.startDate)}
                            onChange={(e) => {
                              const isoDate = parseDateFromThai(e.target.value);
                              handleWorkExperienceChange(index, 'startDate', isoDate);
                            }}
                            placeholder="กรอกวันที่เริ่มงาน"
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
                          <input
                            ref={(el) => {
                              if (workEndRefs.current) {
                                workEndRefs.current[index] = el;
                              }
                            }}
                            type="text"
                            value={formatDateForDisplay(work.endDate)}
                            onChange={(e) => {
                              const isoDate = parseDateFromThai(e.target.value);
                              handleWorkExperienceChange(index, 'endDate', isoDate);
                            }}
                            placeholder="กรอกวันที่สิ้นสุดงาน (หรือ 'ปัจจุบัน' ถ้ายังทำงานอยู่)"
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
                      onChange={(e) => handleInputChange('appliedPosition', e.target.value)}
                      placeholder="กรอกตำแหน่งที่สมัคร"
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
                    <label className="text-sm font-medium text-gray-700">สังกัด<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="กรอกสังกัด"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.department 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">วันที่พร้อมเริ่มงาน<span className="text-red-500">*</span></label>
                    <input
                      ref={availableDateRef}
                      type="text"
                      value={formData.availableDate}
                      onChange={(e) => handleInputChange('availableDate', e.target.value)}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ฝ่าย/กลุ่มงาน<span className="text-red-500">*</span></label>
                    {searchParams.get('department') ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.department}
                          readOnly
                          className="w-full px-3 py-2 border border-green-300 bg-green-50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-not-allowed"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs text-green-600 mt-1">✓ เลือกแผนกจากหน้า Dashboard แล้ว - ไม่สามารถแก้ไขได้</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          placeholder="กรอกฝ่าย/กลุ่มงาน"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">กรุณาเลือกแผนกจากหน้า Dashboard ก่อน</p>
                      </div>
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
                {isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกแท็บนี้ และไปแท็บถัดไป'}
                
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