'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
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
  gender: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  addressAccordingToHouseRegistration: string;
  currentAddress: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
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
    idCard?: File;
    houseRegistration?: File;
    militaryCertificate?: File;
    educationCertificate?: File;
    medicalCertificate?: File;
    drivingLicense?: File;
    nameChangeCertificate?: File;
  };
}

export default function ApplicationForm() {
  const router = useRouter();
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
    gender: '',
    nationality: '',
    religion: '',
    maritalStatus: '',
    addressAccordingToHouseRegistration: '',
    currentAddress: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    education: [],
    workExperience: [],
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
    documents: {}
  });

  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // section refs for in-page navigation like official-documents
  const sectionRefs = {
    profile: useRef<HTMLDivElement | null>(null),
    work: useRef<HTMLDivElement | null>(null),
    education: useRef<HTMLDivElement | null>(null),
    extra: useRef<HTMLDivElement | null>(null),
    documents: useRef<HTMLDivElement | null>(null),
  } as const;

  // flatpickr refs
  const fpRefs = {
    idCardIssueDate: useRef<HTMLInputElement | null>(null),
    idCardExpiryDate: useRef<HTMLInputElement | null>(null),
    birthDate: useRef<HTMLInputElement | null>(null),
    availableDate: useRef<HTMLInputElement | null>(null),
  } as const;
  const workStartRefs = useRef<(HTMLInputElement | null)[]>([]);
  const workEndRefs = useRef<(HTMLInputElement | null)[]>([]);

  const scrollTo = (key: keyof typeof sectionRefs) => {
    const el = sectionRefs[key].current;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // init flatpickr
  useEffect(() => {
    const setup = (el: HTMLInputElement | null, onChange: (iso: string) => void) => {
      if (!el) return;
      const inst: any = (el as any)._flatpickr; if (inst) inst.destroy();
      flatpickr(el, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates[0]) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            onChange(iso);
          }
        }
      });
    };

    setup(fpRefs.idCardIssueDate.current, (iso) => handleInputChange('idCardIssueDate', iso));
    setup(fpRefs.idCardExpiryDate.current, (iso) => handleInputChange('idCardExpiryDate', iso));
    setup(fpRefs.birthDate.current, (iso) => handleInputChange('birthDate', iso));
    setup(fpRefs.availableDate.current, (iso) => handleInputChange('availableDate', iso));

    workStartRefs.current.forEach((ref, idx) => setup(ref, (iso) => handleArrayChange('workExperience', idx, 'startDate', iso)));
    workEndRefs.current.forEach((ref, idx) => setup(ref, (iso) => handleArrayChange('workExperience', idx, 'endDate', iso)));
  }, [formData.workExperience]);

  // ดึงข้อมูลจาก application-forms.json เมื่อเข้าสู่หน้า
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/application-form');
        if (response.ok) {
          const data = await response.json();
          if (data && data.applications && data.applications.length > 0) {
            // ใช้ข้อมูลล่าสุด
            const latestData = data.applications[data.applications.length - 1];
            setProfileData(latestData);
            
            // แปลงข้อมูลให้ตรงกับ FormData interface
            const mappedData: FormData = {
              profileImage: undefined,
              prefix: latestData.prefix || '',
              firstName: latestData.firstName || '',
              lastName: latestData.lastName || '',
              idNumber: latestData.idNumber || '',
              idCardIssuedAt: latestData.idCardIssuedAt || '',
              idCardIssueDate: latestData.idCardIssueDate || '',
              idCardExpiryDate: latestData.idCardExpiryDate || '',
              birthDate: latestData.birthDate || '',
              age: latestData.age || '',
              gender: latestData.gender || '',
              nationality: latestData.nationality || '',
              religion: latestData.religion || '',
              maritalStatus: latestData.maritalStatus || '',
              addressAccordingToHouseRegistration: latestData.addressAccordingToHouseRegistration || '',
              currentAddress: latestData.currentAddress || '',
              phone: latestData.phone || '',
              email: latestData.email || '',
              emergencyContact: latestData.emergencyContact || '',
              emergencyPhone: latestData.emergencyPhone || '',
              education: latestData.education ? latestData.education.map((edu: any) => ({
                level: edu.level || '',
                institution: edu.institution || '',
                major: edu.major || '',
                year: edu.year || '',
                gpa: edu.gpa || ''
              })) : [],
              workExperience: latestData.workExperience ? latestData.workExperience.map((work: any) => ({
                position: work.position || '',
                company: work.company || '',
                startDate: work.startDate || '',
                endDate: work.endDate || '',
                salary: work.salary || '',
                reason: work.reason || ''
              })) : [],
              skills: latestData.skills || '',
              languages: latestData.languages || '',
              computerSkills: latestData.computerSkills || '',
              certificates: latestData.certificates || '',
              references: latestData.references || '',
              appliedPosition: latestData.appliedPosition || '',
              expectedSalary: latestData.expectedSalary || '',
              availableDate: latestData.availableDate || '',
              currentWork: latestData.currentWork || false,
              department: '',
              applicantSignature: '',
              applicationDate: latestData.submittedAt || '',
              documents: latestData.documents || {}
            };
            
            setFormData(mappedData);
            
            // ดึงรูปภาพโปรไฟล์จาก API
            if (latestData.profileImage) {
              console.log('Found profile image in data:', latestData.profileImage);
              setProfileImage(`/api/image?file=${latestData.profileImage}`);
            } else {
              console.log('No profile image found in data');
              // ลองหาไฟล์รูปภาพตาม pattern ที่เป็นไปได้
              if (latestData.id) {
                try {
                  // ลองหาไฟล์รูปภาพที่อาจมีอยู่ใน public/image
                  const possibleNames = [
                    `profile_${latestData.id}.png`,
                    `profile_${latestData.id}.jpg`,
                    `profile_${latestData.id}.jpeg`
                  ];
                  
                  for (const fileName of possibleNames) {
                    const imageResponse = await fetch(`/api/image?file=${fileName}`);
                    if (imageResponse.ok) {
                      console.log('Found profile image with pattern:', fileName);
                      setProfileImage(`/api/image?file=${fileName}`);
                      break;
                    }
                  }
                } catch (error) {
                  console.log('Error searching for profile image:', error);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); 

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName: 'education' | 'workExperience', index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.firstName) errors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName) errors.lastName = 'กรุณากรอกนามสกุล';
    if (!formData.email) errors.email = 'กรุณากรอกอีเมล';
    if (!formData.phone) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // เพิ่มข้อมูลพื้นฐาน
      Object.keys(formData).forEach(key => {
        if (key !== 'profileImage' && key !== 'documents') {
          const value = formData[key as keyof FormData];
          if (typeof value === 'object') {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // เพิ่มไฟล์รูปโปรไฟล์
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      // เพิ่มไฟล์เอกสาร
      if (formData.documents) {
        Object.entries(formData.documents).forEach(([key, file]) => {
          if (file) {
            formDataToSend.append(key, file);
          }
        });
      }

      const response = await fetch('/api/application-form', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        alert(`บันทึกข้อมูลเรียบร้อยแล้ว\nรหัสใบสมัคร: ${result.applicationId}`);
        
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
          gender: '',
          nationality: '',
          religion: '',
          maritalStatus: '',
          addressAccordingToHouseRegistration: '',
          currentAddress: '',
          phone: '',
          email: '',
          emergencyContact: '',
          emergencyPhone: '',
          education: [],
          workExperience: [],
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
          documents: {}
        });

        // นำทางไปยังหน้า dashboard หลังจาก 2 วินาที
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDocumentUpload = (type: string, file: File | undefined) => {
    if (!file) return;
    
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file
      }
    }));
  };

  const handleDocumentRemove = (type: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: undefined
      }
    }));
  };

  const handleProfileImageUpload = (file: File | undefined) => {
    if (!file) return;
    
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
    
    // ลบรูปภาพจาก Register เมื่อผู้ใช้อัปโหลดรูปใหม่
    setProfileImage(null);
  };

  const handleProfileImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: undefined
    }));
    
    // ลบรูปภาพจาก Register เมื่อผู้ใช้ลบรูปใหม่
    setProfileImage(null);
  };

  const handleDocumentPreview = (file: File | undefined) => {
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const getFloatingLabelClassNames = (fieldName: string, value: string) => {
    const isFocused = focusedInputs[fieldName];
    const hasValue = value && value.trim() !== '';
    
    return {
      label: `absolute left-3 transition-all duration-200 ${
        isFocused || hasValue 
          ? 'text-xs text-blue-600 -top-2 bg-white px-1' 
          : 'text-sm text-gray-500 top-3'
      }`,
      input: 'pt-6 pb-2'
    };
  };

  const getFloatingSelectClassNames = (fieldName: string, value: string) => {
    const isFocused = focusedInputs[fieldName];
    const hasValue = value && value.trim() !== '';
    
    return {
      label: `absolute left-3 transition-all duration-200 ${
        isFocused || hasValue 
          ? 'text-xs text-blue-600 -top-2 bg-white px-1' 
          : 'text-sm text-gray-500 top-3'
      }`,
      trigger: 'pt-6 pb-2'
    };
  };

  const handleInputFocus = (fieldName: string) => {
    setFocusedInputs(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleInputBlur = (fieldName: string) => {
    setFocusedInputs(prev => ({ ...prev, [fieldName]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header like official-documents */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">ใบสมัครงาน</h1>
                <p className="text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-500">แบบฟอร์มกรอกข้อมูล</p>
              <p className="text-lg font-semibold text-gray-700">Application Form</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation like official-documents */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button color="primary" variant="ghost" onClick={() => router.back()} className="hover:bg-blue-50">
              ย้อนกลับ
            </Button>
            <Button color="primary" variant="ghost" startContent={<ChevronLeftIcon className="w-5 h-5" />} onClick={() => scrollTo('profile')} className="hover:bg-blue-50">โปรไฟล์</Button>
            <Button color="primary" variant="ghost" onClick={() => scrollTo('work')} className="hover:bg-blue-50">ประสบการณ์</Button>
            <Button color="primary" variant="ghost" onClick={() => scrollTo('education')} className="hover:bg-blue-50">การศึกษา</Button>
            <Button color="primary" variant="ghost" onClick={() => scrollTo('extra')} className="hover:bg-blue-50">ข้อมูลเพิ่มเติม</Button>
            <Button color="primary" variant="ghost" endContent={<ChevronRightIcon className="w-5 h-5" />} onClick={() => scrollTo('documents')} className="hover:bg-blue-50">แนบเอกสาร</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ใบสมัครงาน
          </h1>
          <p className="text-gray-600 text-lg">
            กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
          </p>
        </div>

        {/* แสดงข้อมูล Profile ที่ดึงมา */}
        {!isLoading && profileData && (
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
            <div ref={sectionRefs.profile} />
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลที่ดึงมาจาก Profile</h2>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              {/* Profile Image Display */}
              {profileImage ? (
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Profile from Register"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      R
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 mt-2 font-medium">
                    รูปภาพจากหน้า Register
                  </p>
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                      ไฟล์: {profileImage.split('file=')[1]}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      ตำแหน่ง: public/image/
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ไม่มีรูปภาพโปรไฟล์
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                  <p className="font-semibold text-gray-800">
                    {profileData.prefix} {profileData.firstName} {profileData.lastName}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">อีเมล</p>
                  <p className="font-semibold text-gray-800">{profileData.email}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">เบอร์โทรศัพท์</p>
                  <p className="font-semibold text-gray-800">{profileData.phone}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">เพศ</p>
                  <p className="font-semibold text-gray-800">{profileData.gender}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">วันเกิด</p>
                  <p className="font-semibold text-gray-800">{profileData.birthDate}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">สัญชาติ</p>
                  <p className="font-semibold text-gray-800">{profileData.nationality}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">ศาสนา</p>
                  <p className="font-semibold text-gray-800">{profileData.religion}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">สถานะการสมรส</p>
                  <p className="font-semibold text-gray-800">{profileData.maritalStatus}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">ผู้ติดต่อฉุกเฉิน</p>
                  <p className="font-semibold text-gray-800">{profileData.emergencyContact}</p>
                </div>
              </div>
              
              {profileData.education && profileData.education.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลการศึกษา</h3>
                  <div className="space-y-3">
                    {profileData.education.map((edu: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-gray-500">ระดับการศึกษา</p>
                            <p className="font-semibold text-gray-800">{edu.level}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">สถาบันการศึกษา</p>
                            <p className="font-semibold text-gray-800">{edu.institution}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">สาขาวิชา</p>
                            <p className="font-semibold text-gray-800">{edu.major}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ปีที่จบ</p>
                            <p className="font-semibold text-gray-800">{edu.year}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">เกรดเฉลี่ย</p>
                            <p className="font-semibold text-gray-800">{edu.gpa}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {profileData.workExperience && profileData.workExperience.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลประสบการณ์การทำงาน</h3>
                  <div className="space-y-3">
                    {profileData.workExperience.map((work: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-gray-500">ตำแหน่ง</p>
                            <p className="font-semibold text-gray-800">{work.position}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">บริษัท</p>
                            <p className="font-semibold text-gray-800">{work.company}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ระยะเวลา</p>
                            <p className="font-semibold text-gray-800">{work.startDate} - {work.endDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">เงินเดือน</p>
                            <p className="font-semibold text-gray-800">{work.salary}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">รายละเอียดงาน</p>
                            <p className="font-semibold text-gray-800">{work.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-800 font-medium">
                    ข้อมูลข้างต้นได้ถูกดึงมาจาก application-forms.json และเติมลงในฟอร์มด้านล่างแล้ว
                  </p>
                </div>
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800 text-sm">
                      ข้อมูลที่ตรงกันจาก application-forms.json ได้ถูกกรอกลงในฟอร์มแล้ว คุณสามารถแก้ไขหรือเพิ่มเติมข้อมูลได้
                    </p>
                  </div>
                </div>
                {profileImage && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-purple-800 text-sm">
                        รูปภาพโปรไฟล์ได้ถูกดึงมาจาก public/image แล้ว คุณสามารถเปลี่ยนรูปได้โดยการอัปโหลดรูปใหม่
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {isLoading && (
          <Card className="mb-8 shadow-lg border-0">
            <CardBody className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">กำลังดึงข้อมูลจาก Profile...</span>
              </div>
            </CardBody>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ข้อมูลส่วนตัว */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* Profile Image Upload Section */}
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    รูปถ่ายประจำตัว
                  </h3>
                  <span className="text-xs text-blue-500">แนะนำ</span>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Image Preview */}
                  <div className="relative">
                    {formData.profileImage ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Profile Preview"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          onClick={handleProfileImageRemove}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : profileImage ? (
                      <div className="relative">
                        <img
                          src={profileImage}
                          alt="Profile from Register"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                          R
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profileImage-upload"
                      onChange={(e) => handleProfileImageUpload(e.target.files?.[0])}
                    />
                    <Button
                      color="primary"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById('profileImage-upload')?.click()}
                      startContent={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {formData.profileImage ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                    </p>
                    {profileImage && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 font-medium">
                          ✓ รูปภาพจากหน้า Register
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          ไฟล์: {profileImage.split('file=')[1]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative">
                  <Input
                    label="คำนำหน้า"
                    value={formData.prefix}
                    onValueChange={(value) => handleInputChange('prefix', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('prefix', formData.prefix)}
                    onFocus={() => handleInputFocus('prefix')}
                    onBlur={() => handleInputBlur('prefix')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="ชื่อ"
                    value={formData.firstName}
                    onValueChange={(value) => handleInputChange('firstName', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('firstName', formData.firstName)}
                    onFocus={() => handleInputFocus('firstName')}
                    onBlur={() => handleInputBlur('firstName')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="นามสกุล"
                    value={formData.lastName}
                    onValueChange={(value) => handleInputChange('lastName', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('lastName', formData.lastName)}
                    onFocus={() => handleInputFocus('lastName')}
                    onBlur={() => handleInputBlur('lastName')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="เลขบัตรประชาชน"
                    value={formData.idNumber}
                    onValueChange={(value) => handleInputChange('idNumber', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('idNumber', formData.idNumber)}
                    onFocus={() => handleInputFocus('idNumber')}
                    onBlur={() => handleInputBlur('idNumber')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="ออกให้ ณ อำเภอ/เขต"
                    value={formData.idCardIssuedAt}
                    onValueChange={(value) => handleInputChange('idCardIssuedAt', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('idCardIssuedAt', formData.idCardIssuedAt)}
                    onFocus={() => handleInputFocus('idCardIssuedAt')}
                    onBlur={() => handleInputBlur('idCardIssuedAt')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="วันที่ออกบัตร"
                    type="text"
                    ref={fpRefs.idCardIssueDate}
                    value={formData.idCardIssueDate ? (()=>{try{const [y,m,d]=formData.idCardIssueDate.split('-');return `${d}/${m}/${y}`}catch{return formData.idCardIssueDate}})(): ''}
                    onClick={()=>fpRefs.idCardIssueDate.current && (fpRefs.idCardIssueDate.current as any)._flatpickr?.open?.()}
                    classNames={getFloatingLabelClassNames('idCardIssueDate', formData.idCardIssueDate)}
                    onFocus={() => handleInputFocus('idCardIssueDate')}
                    onBlur={() => handleInputBlur('idCardIssueDate')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="วันหมดอายุบัตร"
                    type="text"
                    ref={fpRefs.idCardExpiryDate}
                    value={formData.idCardExpiryDate ? (()=>{try{const [y,m,d]=formData.idCardExpiryDate.split('-');return `${d}/${m}/${y}`}catch{return formData.idCardExpiryDate}})(): ''}
                    onClick={()=>fpRefs.idCardExpiryDate.current && (fpRefs.idCardExpiryDate.current as any)._flatpickr?.open?.()}
                    classNames={getFloatingLabelClassNames('idCardExpiryDate', formData.idCardExpiryDate)}
                    onFocus={() => handleInputFocus('idCardExpiryDate')}
                    onBlur={() => handleInputBlur('idCardExpiryDate')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="วันเกิด"
                    type="text"
                    ref={fpRefs.birthDate}
                    value={formData.birthDate ? (()=>{try{const [y,m,d]=formData.birthDate.split('-');return `${d}/${m}/${y}`}catch{return formData.birthDate}})(): ''}
                    onClick={()=>fpRefs.birthDate.current && (fpRefs.birthDate.current as any)._flatpickr?.open?.()}
                    classNames={getFloatingLabelClassNames('birthDate', formData.birthDate)}
                    onFocus={() => handleInputFocus('birthDate')}
                    onBlur={() => handleInputBlur('birthDate')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="สถานที่เกิด"
                    value={formData.placeOfBirth || ''}
                    onValueChange={(value) => handleInputChange('placeOfBirth', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('placeOfBirth', formData.placeOfBirth || '')}
                    onFocus={() => handleInputFocus('placeOfBirth')}
                    onBlur={() => handleInputBlur('placeOfBirth')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="เชื้อชาติ"
                    value={formData.race || ''}
                    onValueChange={(value) => handleInputChange('race', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('race', formData.race || '')}
                    onFocus={() => handleInputFocus('race')}
                    onBlur={() => handleInputBlur('race')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="อายุ"
                    value={formData.age}
                    onValueChange={(value) => handleInputChange('age', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('age', formData.age)}
                    onFocus={() => handleInputFocus('age')}
                    onBlur={() => handleInputBlur('age')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Select
                    label="เพศ"
                    selectedKeys={formData.gender ? [formData.gender] : []}
                    onSelectionChange={(keys) => handleInputChange('gender', Array.from(keys)[0] as string)}
                    classNames={getFloatingSelectClassNames('gender', formData.gender)}
                    onFocus={() => handleInputFocus('gender')}
                    onBlur={() => handleInputBlur('gender')}
                    variant="flat"
                    endContent={
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    }
                  >
                    <SelectItem key="ชาย">ชาย</SelectItem>
                    <SelectItem key="หญิง">หญิง</SelectItem>
                  </Select>
                </div>
                
                <div className="relative">
                  <Input
                    label="สัญชาติ"
                    value={formData.nationality}
                    onValueChange={(value) => handleInputChange('nationality', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('nationality', formData.nationality)}
                    onFocus={() => handleInputFocus('nationality')}
                    onBlur={() => handleInputBlur('nationality')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="ศาสนา"
                    value={formData.religion}
                    onValueChange={(value) => handleInputChange('religion', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('religion', formData.religion)}
                    onFocus={() => handleInputFocus('religion')}
                    onBlur={() => handleInputBlur('religion')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Select
                    label="สถานะการสมรส"
                    selectedKeys={formData.maritalStatus ? [formData.maritalStatus] : []}
                    onSelectionChange={(keys) => handleInputChange('maritalStatus', Array.from(keys)[0] as string)}
                    classNames={getFloatingSelectClassNames('maritalStatus', formData.maritalStatus)}
                    onFocus={() => handleInputFocus('maritalStatus')}
                    onBlur={() => handleInputBlur('maritalStatus')}
                    variant="flat"
                    endContent={
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    }
                  >
                    <SelectItem key="โสด">โสด</SelectItem>
                    <SelectItem key="แต่งงานแล้ว">แต่งงานแล้ว</SelectItem>
                    <SelectItem key="หย่าร้าง">หย่าร้าง</SelectItem>
                    <SelectItem key="หม้าย">หม้าย</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Textarea
                    label="ที่อยู่ตามทะเบียนบ้าน"
                    value={formData.addressAccordingToHouseRegistration}
                    onValueChange={(value) => handleInputChange('addressAccordingToHouseRegistration', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('addressAccordingToHouseRegistration', formData.addressAccordingToHouseRegistration)}
                    onFocus={() => handleInputFocus('addressAccordingToHouseRegistration')}
                    onBlur={() => handleInputBlur('addressAccordingToHouseRegistration')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
                
                <div className="relative">
                  <Textarea
                    label="ที่อยู่ปัจจุบัน"
                    value={formData.currentAddress}
                    onValueChange={(value) => handleInputChange('currentAddress', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('currentAddress', formData.currentAddress)}
                    onFocus={() => handleInputFocus('currentAddress')}
                    onBlur={() => handleInputBlur('currentAddress')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="relative">
                  <Input
                    label="เบอร์โทรศัพท์"
                    value={formData.phone}
                    onValueChange={(value) => handleInputChange('phone', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('phone', formData.phone)}
                    onFocus={() => handleInputFocus('phone')}
                    onBlur={() => handleInputBlur('phone')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="อีเมล"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleInputChange('email', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('email', formData.email)}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={() => handleInputBlur('email')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="ผู้ติดต่อฉุกเฉิน"
                    value={formData.emergencyContact}
                    onValueChange={(value) => handleInputChange('emergencyContact', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('emergencyContact', formData.emergencyContact)}
                    onFocus={() => handleInputFocus('emergencyContact')}
                    onBlur={() => handleInputBlur('emergencyContact')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="เบอร์โทรฉุกเฉิน"
                    value={formData.emergencyPhone}
                    onValueChange={(value) => handleInputChange('emergencyPhone', value)}
                    autoComplete="off" spellCheck={"false"}
                    classNames={getFloatingLabelClassNames('emergencyPhone', formData.emergencyPhone)}
                    onFocus={() => handleInputFocus('emergencyPhone')}
                    onBlur={() => handleInputBlur('emergencyPhone')}
                    variant="flat"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* ข้อมูลประสบการณ์การทำงาน */}
          <div ref={sectionRefs.work} />
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลประสบการณ์การทำงาน</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {formData.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">ประสบการณ์การทำงาน #{index + 1}</h3>
                    {formData.workExperience.length > 1 && (
                      <Button
                        color="danger"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExperience(index)}
                        startContent={<TrashIcon className="w-4 h-4" />}
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="relative">
                      <Input
                        label="ตำแหน่ง"
                        value={work.position}
                        onValueChange={(value) => handleArrayChange('workExperience', index, 'position', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('work-position', work.position)}
                        onFocus={() => handleInputFocus('work-position')}
                        onBlur={() => handleInputBlur('work-position')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="บริษัท"
                        value={work.company}
                        onValueChange={(value) => handleArrayChange('workExperience', index, 'company', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('work-company', work.company)}
                        onFocus={() => handleInputFocus('work-company')}
                        onBlur={() => handleInputBlur('work-company')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="วันที่เริ่มงาน"
                        type="text"
                        ref={(el)=>{workStartRefs.current[index]=el}}
                        value={work.startDate ? (()=>{try{const [y,m,d]=work.startDate.split('-');return `${d}/${m}/${y}`}catch{return work.startDate}})(): ''}
                        onClick={()=>{const el=workStartRefs.current[index]; el && (el as any)._flatpickr?.open?.()}}
                        classNames={getFloatingLabelClassNames('work-startDate', work.startDate)}
                        onFocus={() => handleInputFocus('work-startDate')}
                        onBlur={() => handleInputBlur('work-startDate')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="วันที่สิ้นสุดงาน"
                        type="text"
                        ref={(el)=>{workEndRefs.current[index]=el}}
                        value={work.endDate ? (()=>{try{const [y,m,d]=work.endDate.split('-');return `${d}/${m}/${y}`}catch{return work.endDate}})(): ''}
                        onClick={()=>{const el=workEndRefs.current[index]; el && (el as any)._flatpickr?.open?.()}}
                        classNames={getFloatingLabelClassNames('work-endDate', work.endDate)}
                        onFocus={() => handleInputFocus('work-endDate')}
                        onBlur={() => handleInputBlur('work-endDate')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="เงินเดือน"
                        value={work.salary}
                        onValueChange={(value) => handleArrayChange('workExperience', index, 'salary', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('work-salary', work.salary)}
                        onFocus={() => handleInputFocus('work-salary')}
                        onBlur={() => handleInputBlur('work-salary')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="เหตุผลที่ออก"
                        value={work.reason}
                        onValueChange={(value) => handleArrayChange('workExperience', index, 'reason', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('work-reason', work.reason)}
                        onFocus={() => handleInputFocus('work-reason')}
                        onBlur={() => handleInputBlur('work-reason')}
                        variant="flat"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                color="warning"
                variant="ghost"
                onClick={addWorkExperience}
                startContent={<PlusIcon className="w-4 h-4" />}
                className="w-full"
              >
                เพิ่มประสบการณ์การทำงาน
              </Button>
            </CardBody>
          </Card>

          {/* หน้า 2 - ข้อมูลตามเอกสารทางการ */}
          <div ref={sectionRefs.extra} />
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">หน้า 2 - ข้อมูลตามเอกสารทางการ</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {/* ข้อ ๑.๑๐ - ข้อมูลการสมัคร */}
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อ ๑.๑๐</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium min-w-[200px]">ขอสมัครเป็นบุคคลภายนอกฯ ตำแหน่ง:</span>
                    <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1">
                      <Input
                        placeholder="ระบุตำแหน่งที่สมัคร"
                        value={formData.appliedPosition || ''}
                        onChange={(e) => handleInputChange('appliedPosition', e.target.value)}
                        variant="flat"
                        className="border-0 bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium min-w-[200px]">ฝ่าย/กลุ่มงาน:</span>
                    <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1">
                      <Input
                        placeholder="ระบุฝ่ายหรือกลุ่มงาน"
                        value={formData.department || ''}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        variant="flat"
                        className="border-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ข้อ ๒ - ความรู้ ความสามารถ/ทักษะพิเศษ */}
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อ ๒ ความรู้ ความสามารถ/ทักษะพิเศษ</h3>
                <div className="min-h-[200px] border-2 border-dotted border-gray-400 rounded-lg p-4 bg-white">
                  <Textarea
                    placeholder="กรุณาระบุความรู้ ความสามารถ และทักษะพิเศษของท่าน..."
                    value={formData.skills || ''}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    variant="flat"
                    className="min-h-[180px] border-0 bg-transparent resize-none"
                    rows={8}
                  />
                </div>
              </div>

              {/* ข้อ ๓ - คุณสมบัติทั่วไปและลักษณะต้องห้าม */}
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อ ๓ คุณสมบัติทั่วไปและลักษณะต้องห้าม</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๑</span>
                    <span>ต้องมีความจงรักภักดีต่อระบอบประชาธิปไตยอันมีพระมหากษัตริย์ทรงเป็นประมุข</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๒</span>
                    <span>ต้องไม่เป็นผู้ทุพพลภาพหรือผู้ไร้ความสามารถ หรือผู้เสมือนไร้ความสามารถ หรือวิกลจริต หรือจิตฟั่นเฟือน หรือเป็นโรค</span>
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-red-600">(ก)</span>
                      <span>วัณโรคในระยะที่ติดต่อได้</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-red-600">(ข)</span>
                      <span>โรคเท้าช้างในระยะที่สังคมรังเกียจ</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-red-600">(ค)</span>
                      <span>ยาเสพติดให้โทษ</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-red-600">(ง)</span>
                      <span>โรคพิษสุราเรื้อรัง</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-semibold text-red-600">(จ)</span>
                      <span>โรคติดต่อร้ายแรงหรือโรคเรื้อรังที่มีอาการเด่นชัดหรือรุนแรงจนเป็นอุปสรรคต่อการปฏิบัติงานตามที่ปลัดกรุงเทพมหานครกำหนด</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๓</span>
                    <span>ต้องไม่เป็นผู้ที่ถูกสั่งพักราชการหรือถูกสั่งให้ออกจากราชการไว้ก่อนตามระเบียบกรุงเทพมหานครหรือกฎหมายอื่น</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๔</span>
                    <span>ต้องไม่เป็นผู้ประพฤติตนเสื่อมเสียจนเป็นที่รังเกียจของสังคม</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๕</span>
                    <span>ต้องไม่เป็นบุคคลล้มละลาย</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๖</span>
                    <span>ต้องไม่เป็นผู้ที่เคยถูกศาลพิพากษาให้จำคุกโดยคำพิพากษาถึงที่สุดให้จำคุก เว้นแต่เป็นโทษสำหรับความผิดที่ได้กระทำโดยประมาทหรือความผิดลหุโทษ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๗</span>
                    <span>ต้องไม่เป็นผู้ที่เคยถูกไล่ออก ปลดออก หรือไล่ออกจากหน่วยงานของรัฐ รัฐวิสาหกิจ หรือหน่วยงานอื่นของรัฐ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๘</span>
                    <span>ต้องไม่เป็นผู้ที่เคยถูกไล่ออกหรือปลดออกตามระเบียบกรุงเทพมหานครหรือกฎหมายอื่น</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๙</span>
                    <span>ต้องไม่เป็นผู้ที่เคยถูกไล่ออกตามระเบียบกรุงเทพมหานครหรือกฎหมายอื่น</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-red-600">๓.๑๐</span>
                    <span>ต้องไม่เป็นผู้ที่เคยกระทำการทุจริตในการสอบคัดเลือกหรือในการปฏิบัติหน้าที่ในหน่วยงานของรัฐ</span>
                  </div>
                </div>
              </div>

              {/* คำรับรองและลงนาม */}
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50">
                <div className="text-sm text-gray-700 mb-4 leading-relaxed">
                  <p className="mb-3">ข้าพเจ้าได้อ่านและเข้าใจคุณสมบัติทั่วไปและลักษณะต้องห้ามข้างต้นแล้ว และขอยืนยันว่าข้อมูลในใบสมัครและเอกสารแนบทุกฉบับเป็นความจริง</p>
                  <p className="mb-3">หากภายหลังพบว่าไม่เป็นไปตามคุณสมบัติที่กำหนด ใบสมัครนี้จะเป็นโมฆะ และข้าพเจ้าจะสละสิทธิ์ในการเรียกร้องใดๆ ทั้งสิ้น</p>
                  <p>หากข้าพเจ้าแจ้งข้อความอันเป็นเท็จโดยเจตนา อาจต้องรับโทษทางอาญาในความผิดฐานแจ้งข้อความอันเป็นเท็จต่อเจ้าพนักงาน</p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium min-w-[100px]">ลงชื่อ:</span>
                    <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1 min-h-[40px]">
                      <Input
                        placeholder="ลงนามผู้สมัคร"
                        value={formData.applicantSignature || ''}
                        onChange={(e) => handleInputChange('applicantSignature', e.target.value)}
                        variant="flat"
                        className="border-0 bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium min-w-[100px]">วันที่:</span>
                    <div className="flex-1 border-b-2 border-dotted border-gray-400 pb-1">
                      <Input
                        type="date"
                        value={formData.applicationDate || ''}
                        onChange={(e) => handleInputChange('applicationDate', e.target.value)}
                        variant="flat"
                        className="border-0 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* หมายเหตุ */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">หมายเหตุ:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• กรุณาอ่านและทำความเข้าใจคุณสมบัติและลักษณะต้องห้ามให้ครบถ้วน</li>
                  <li>• การลงนามถือเป็นการยืนยันว่าข้อมูลที่ให้เป็นความจริง</li>
                  <li>• หากมีข้อสงสัย กรุณาติดต่อเจ้าหน้าที่</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* ข้อมูลการศึกษา */}
          <div ref={sectionRefs.education} />
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลการศึกษา</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">การศึกษา #{index + 1}</h3>
                    {formData.education.length > 1 && (
                      <Button
                        color="danger"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        startContent={<TrashIcon className="w-4 h-4" />}
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="relative">
                      <Select
                        label="ระดับการศึกษา"
                        selectedKeys={edu.level ? [edu.level] : []}
                        onSelectionChange={(keys) => handleArrayChange('education', index, 'level', Array.from(keys)[0] as string)}
                        classNames={getFloatingSelectClassNames('education-level', edu.level)}
                        onFocus={() => handleInputFocus('education-level')}
                        onBlur={() => handleInputBlur('education-level')}
                        variant="flat"
                        endContent={
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        }
                      >
                        <SelectItem key="ประถมศึกษา">ประถมศึกษา</SelectItem>
                        <SelectItem key="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</SelectItem>
                        <SelectItem key="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</SelectItem>
                        <SelectItem key="ปริญญาตรี">ปริญญาตรี</SelectItem>
                        <SelectItem key="ปริญญาโท">ปริญญาโท</SelectItem>
                        <SelectItem key="ปริญญาเอก">ปริญญาเอก</SelectItem>
                      </Select>
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="สถาบันการศึกษา"
                        value={edu.institution}
                        onValueChange={(value) => handleArrayChange('education', index, 'institution', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('education-institution', edu.institution)}
                        onFocus={() => handleInputFocus('education-institution')}
                        onBlur={() => handleInputBlur('education-institution')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="สาขาวิชา"
                        value={edu.major}
                        onValueChange={(value) => handleArrayChange('education', index, 'major', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('education-major', edu.major)}
                        onFocus={() => handleInputFocus('education-major')}
                        onBlur={() => handleInputBlur('education-major')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="ปีที่จบ"
                        value={edu.year}
                        onValueChange={(value) => handleArrayChange('education', index, 'year', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('education-year', edu.year)}
                        onFocus={() => handleInputFocus('education-year')}
                        onBlur={() => handleInputBlur('education-year')}
                        variant="flat"
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="เกรดเฉลี่ย"
                        value={edu.gpa}
                        onValueChange={(value) => handleArrayChange('education', index, 'gpa', value)}
                        autoComplete="off" spellCheck={"false"}
                        classNames={getFloatingLabelClassNames('education-gpa', edu.gpa)}
                        onFocus={() => handleInputFocus('education-gpa')}
                        onBlur={() => handleInputBlur('education-gpa')}
                        variant="flat"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                color="success"
                variant="ghost"
                onClick={addEducation}
                startContent={<PlusIcon className="w-4 h-4" />}
                className="w-full"
              >
                เพิ่มข้อมูลการศึกษา
              </Button>
            </CardBody>
          </Card>

          {/* ข้อมูลเพิ่มเติม */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">ข้อมูลเพิ่มเติม</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="ตำแหน่งที่สมัคร"
                    value={formData.appliedPosition}
                    onChange={(e) => handleInputChange('appliedPosition', e.target.value)}
                    classNames={getFloatingLabelClassNames('appliedPosition', formData.appliedPosition)}
                    onFocus={() => handleInputFocus('appliedPosition')}
                    onBlur={() => handleInputBlur('appliedPosition')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="เงินเดือนที่คาดหวัง"
                    value={formData.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    classNames={getFloatingLabelClassNames('expectedSalary', formData.expectedSalary)}
                    onFocus={() => handleInputFocus('expectedSalary')}
                    onBlur={() => handleInputBlur('expectedSalary')}
                    variant="flat"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    label="วันที่สามารถเริ่มงานได้"
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => handleInputChange('availableDate', e.target.value)}
                    classNames={getFloatingLabelClassNames('availableDate', formData.availableDate)}
                    onFocus={() => handleInputFocus('availableDate')}
                    onBlur={() => handleInputBlur('availableDate')}
                    variant="flat"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Textarea
                    label="ทักษะและความสามารถ"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    classNames={getFloatingLabelClassNames('skills', formData.skills)}
                    onFocus={() => handleInputFocus('skills')}
                    onBlur={() => handleInputBlur('skills')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
                
                <div className="relative">
                  <Textarea
                    label="ภาษาที่ใช้ได้"
                    value={formData.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    classNames={getFloatingLabelClassNames('languages', formData.languages)}
                    onFocus={() => handleInputFocus('languages')}
                    onBlur={() => handleInputBlur('languages')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
                
                <div className="relative">
                  <Textarea
                    label="ทักษะคอมพิวเตอร์"
                    value={formData.computerSkills}
                    onChange={(e) => handleInputChange('computerSkills', e.target.value)}
                    classNames={getFloatingLabelClassNames('computerSkills', formData.computerSkills)}
                    onFocus={() => handleInputFocus('computerSkills')}
                    onBlur={() => handleInputBlur('computerSkills')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
                
                <div className="relative">
                  <Textarea
                    label="ใบรับรอง/ประกาศนียบัตร"
                    value={formData.certificates}
                    onChange={(e) => handleInputChange('certificates', e.target.value)}
                    classNames={getFloatingLabelClassNames('certificates', formData.certificates)}
                    onFocus={() => handleInputFocus('certificates')}
                    onBlur={() => handleInputBlur('certificates')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
                
                <div className="relative">
                  <Textarea
                    label="ผู้อ้างอิง"
                    value={formData.references}
                    onChange={(e) => handleInputChange('references', e.target.value)}
                    classNames={getFloatingLabelClassNames('references', formData.references)}
                    onFocus={() => handleInputFocus('references')}
                    onBlur={() => handleInputBlur('references')}
                    variant="flat"
                    minRows={3}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* แนบเอกสาร */}
          <div ref={sectionRefs.documents} />
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">แนบเอกสาร</h2>
              </div>
            </CardHeader>
            <CardBody className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* สำเนาบัตรประชาชน */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">สำเนาบัตรประชาชน</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="idCard-upload"
                      onChange={(e) => handleDocumentUpload('idCard', e.target.files?.[0])}
                    />
                    {formData.documents?.idCard ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.idCard.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.idCard)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('idCard')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="primary"
                        variant="ghost"
                        onClick={() => document.getElementById('idCard-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* สำเนาทะเบียนบ้าน */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">สำเนาทะเบียนบ้าน</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="houseRegistration-upload"
                      onChange={(e) => handleDocumentUpload('houseRegistration', e.target.files?.[0])}
                    />
                    {formData.documents?.houseRegistration ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.houseRegistration.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.houseRegistration)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('houseRegistration')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="primary"
                        variant="ghost"
                        onClick={() => document.getElementById('houseRegistration-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* สำเนาหลักฐานทางทหาร */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">สำเนาหลักฐานทางทหาร</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">ถ้ามี</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="militaryCertificate-upload"
                      onChange={(e) => handleDocumentUpload('militaryCertificate', e.target.files?.[0])}
                    />
                    {formData.documents?.militaryCertificate ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.militaryCertificate.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.militaryCertificate)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('militaryCertificate')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="success"
                        variant="ghost"
                        onClick={() => document.getElementById('militaryCertificate-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* สำเนาหลักฐานการศึกษา */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">สำเนาหลักฐานการศึกษา</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="educationCertificate-upload"
                      onChange={(e) => handleDocumentUpload('educationCertificate', e.target.files?.[0])}
                    />
                    {formData.documents?.educationCertificate ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.educationCertificate.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.educationCertificate)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('educationCertificate')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="primary"
                        variant="ghost"
                        onClick={() => document.getElementById('educationCertificate-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* ใบรับรองแพทย์ */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">ใบรับรองแพทย์</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="medicalCertificate-upload"
                      onChange={(e) => handleDocumentUpload('medicalCertificate', e.target.files?.[0])}
                    />
                    {formData.documents?.medicalCertificate ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.medicalCertificate.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.medicalCertificate)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('medicalCertificate')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="warning"
                        variant="ghost"
                        onClick={() => document.getElementById('medicalCertificate-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* ใบอนุญาตขับรถยนต์ */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-teal-50 to-cyan-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">ใบอนุญาตขับรถยนต์</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">ถ้ามี</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="drivingLicense-upload"
                      onChange={(e) => handleDocumentUpload('drivingLicense', e.target.files?.[0])}
                    />
                    {formData.documents?.drivingLicense ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.drivingLicense.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.drivingLicense)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('drivingLicense')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="success"
                        variant="ghost"
                        onClick={() => document.getElementById('drivingLicense-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-teal-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* สำเนาหลักฐานการเปลี่ยนชื่อ */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">สำเนาหลักฐานการเปลี่ยนชื่อ</h3>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">ถ้ามี</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="nameChangeCertificate-upload"
                      onChange={(e) => handleDocumentUpload('nameChangeCertificate', e.target.files?.[0])}
                    />
                    {formData.documents?.nameChangeCertificate ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{formData.documents.nameChangeCertificate.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDocumentPreview(formData.documents?.nameChangeCertificate)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ดู
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDocumentRemove('nameChangeCertificate')}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        color="success"
                        variant="ghost"
                        onClick={() => document.getElementById('nameChangeCertificate-upload')?.click()}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">คำแนะนำการอัปโหลดเอกสาร</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• รองรับไฟล์ PDF, JPG, JPEG, PNG ขนาดไม่เกิน 10MB</li>
                      <li>• เอกสารที่จำเป็นต้องแนบ: บัตรประชาชน, ทะเบียนบ้าน, หลักฐานการศึกษา, ใบรับรองแพทย์</li>
                      <li>• เอกสารเพิ่มเติม (ถ้ามี): หลักฐานทางทหาร, ใบอนุญาตขับรถ, หลักฐานการเปลี่ยนชื่อ</li>
                      <li>• ตรวจสอบให้แน่ใจว่าเอกสารชัดเจนและอ่านได้</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* ปุ่มส่งข้อมูล */}
          <div className="flex justify-center">
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              startContent={<CheckIcon className="w-6 h-6" />}
            >
              ส่งใบสมัครงาน
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 