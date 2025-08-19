'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardBody, CardHeader, Button, Chip, Input, Select, SelectItem, Textarea, Spinner } from '@heroui/react'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { Thai } from 'flatpickr/dist/l10n/th.js'

interface FormData {
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  profileImage: File | null;
  educationList: Array<{
    level: string;
    school: string;
    major: string;
    startYear: string;
    endYear: string;
    gpa: string;
  }>;
  workList: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    salary: string;
  }>;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState<FormData>({
    // Personal Info
    prefix: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    address: "",
    province: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    profileImage: null,
    
    // Education
    educationList: [
      { level: "", school: "", major: "", startYear: "", endYear: "", gpa: "" }
    ],
    
    // Work Experience
    workList: [
      { 
        position: "", 
        company: "", 
        startDate: "", 
        endDate: "", 
        isCurrent: false,
        description: "",
        salary: ""
      }
    ]
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isCheckingData, setIsCheckingData] = useState(true);
  
  // Refs สำหรับ flatpickr
  const birthDateRef = useRef<HTMLInputElement>(null);
  const workStartDateRefs = useRef<(HTMLInputElement | null)[]>([]);
  const workEndDateRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // ตรวจสอบ session
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleChange = (field: string, value: string) => {
    console.log('handleChange called:', field, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('Updated formData:', newData);
      return newData;
    });
    
    // ลบ error เมื่อผู้ใช้เริ่มกรอกข้อมูล
    if (value && errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleWorkChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...formData.workList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, workList: updated }));
    
    // ลบ error เมื่อผู้ใช้เริ่มกรอกข้อมูล
    const errorKey = `work_${index}_${field}`;
    if (value && errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // ตรวจสอบข้อมูลที่มีอยู่แล้ว
  useEffect(() => {
    const checkExistingData = async () => {
      console.log('=== CHECKING EXISTING DATA ===');
      console.log('Status:', status);
      console.log('Session:', session);
      
      if (status === 'authenticated' && session) {
        try {
          // ใช้ Line ID จาก session เพื่อตรวจสอบข้อมูล
          const lineId = session.user?.id;
          console.log('Line ID from session:', lineId);
          
          if (lineId) {
            console.log('Making API call to /api/profile...');
            const response = await fetch(`/api/profile?lineId=${encodeURIComponent(lineId)}`);
            console.log('API Response status:', response.status);
            console.log('API Response ok:', response.ok);
            
            if (response.ok) {
              const data = await response.json();
              console.log('API Response data:', data);
              
              if (data.success && data.data) {
                console.log('✅ Found existing data, redirecting to dashboard...');
                setHasExistingData(true);
                // ถ้ามีข้อมูลแล้ว ให้ไปหน้า Dashboard ทันที
                router.replace('/dashboard');
              } else {
                console.log('❌ No existing data found, showing registration form');
              }
            } else {
              console.log('❌ API response not ok:', response.status);
              const errorData = await response.json();
              console.log('Error data:', errorData);
            }
          } else {
            console.log('❌ No Line ID in session');
          }
        } catch (error) {
          console.error('❌ Error checking existing data:', error);
        } finally {
          setIsCheckingData(false);
        }
      } else if (status === 'unauthenticated') {
        console.log('❌ User not authenticated, redirecting to signin');
        router.replace('/auth/signin');
      } else {
        console.log('⏳ Status:', status, 'Session:', session);
        setIsCheckingData(false);
      }
    };

    // เรียกใช้ทันทีเมื่อ status หรือ session เปลี่ยน
    if (status !== 'loading') {
      checkExistingData();
    }
  }, [session, status, router]);

  // ตั้งค่า flatpickr สำหรับวันที่
  useEffect(() => {
    // ตรวจสอบว่า flatpickr ถูกโหลดหรือไม่
    if (typeof flatpickr === 'undefined') {
      console.error('Flatpickr is not loaded')
      return
    }

    // รอให้ component render เสร็จก่อน
    const timer = setTimeout(() => {
      // ตั้งค่า flatpickr สำหรับวันเกิด
      if (birthDateRef.current) {
        console.log('Setting up flatpickr for birth date')

        // ลบ flatpickr เดิมถ้ามี
        const existingInstance = (birthDateRef.current as unknown as { _flatpickr?: { destroy: () => void } })._flatpickr
        if (existingInstance) {
          existingInstance.destroy()
        }

        try {
          const fp = flatpickr(birthDateRef.current, {
            locale: Thai,
            dateFormat: 'd/m/Y',
            allowInput: true,
            clickOpens: true,
            maxDate: new Date(),
            onChange: (selectedDates, dateStr) => {
              console.log('Date selected:', selectedDates, dateStr)
              if (selectedDates[0]) {
                const date = selectedDates[0]
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                console.log('Formatted date for storage:', formattedDate)
                handleChange('birthDate', formattedDate)
              }
            },
            onOpen: () => {
              console.log('Flatpickr opened')
            },
            onClose: () => {
              console.log('Flatpickr closed')
            }
          })

          console.log('Flatpickr instance created:', fp)

          // เก็บ instance ไว้ใน ref
          ;(birthDateRef.current as unknown as { _flatpickr?: unknown })._flatpickr = fp
        } catch (error) {
          console.error('Error setting up flatpickr:', error)
        }
      } else {
        console.log('birthDateRef.current is null')
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // ติดตามการเปลี่ยนแปลงของ birthDate
  useEffect(() => {
    console.log('birthDate changed:', formData.birthDate)
  }, [formData.birthDate])

  // ตั้งค่า flatpickr สำหรับวันที่ทำงานเมื่อ workList เปลี่ยน
  useEffect(() => {
    // รอให้ component render เสร็จก่อน
    const timer = setTimeout(() => {
      workStartDateRefs.current.forEach((ref, index) => {
        if (ref) {
          // ลบ flatpickr เดิมถ้ามี
          const existingInstance = (ref as unknown as { _flatpickr?: { destroy: () => void } })._flatpickr;
          if (existingInstance) {
            existingInstance.destroy();
          }
          
          flatpickr(ref, {
            locale: Thai,
            dateFormat: 'd/m/Y',
            allowInput: true,
            clickOpens: true,
            onChange: (selectedDates, dateStr) => {
              if (selectedDates[0]) {
                const date = selectedDates[0];
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                handleWorkChange(index, 'startDate', formattedDate);
              }
            }
          });
        }
      });

      workEndDateRefs.current.forEach((ref, index) => {
        if (ref) {
          // ลบ flatpickr เดิมถ้ามี
          const existingInstance = (ref as unknown as { _flatpickr?: { destroy: () => void } })._flatpickr;
          if (existingInstance) {
            existingInstance.destroy();
          }
          
          flatpickr(ref, {
            locale: Thai,
            dateFormat: 'd/m/Y',
            allowInput: true,
            clickOpens: true,
            onChange: (selectedDates, dateStr) => {
              if (selectedDates[0]) {
                const date = selectedDates[0];
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                handleWorkChange(index, 'endDate', formattedDate);
              }
            }
          });
          // ปิดการใช้งานถ้าเป็นงานปัจจุบัน
          if (formData.workList[index]?.isCurrent) {
            ref.disabled = true;
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [formData.workList]);

  // แสดง loading ขณะตรวจสอบข้อมูล
  if (status === 'loading' || isCheckingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <Spinner 
                size="lg"
                color="primary"
                labelColor="primary"
                label="กำลังตรวจสอบข้อมูล..."
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              กำลังตรวจสอบข้อมูลการสมัครงาน
            </h2>
            <p className="text-gray-600">
              กรุณารอสักครู่...
            </p>
          </CardBody>
        </Card>
      </div>
    )
  }

  // ถ้ามีข้อมูลแล้ว แสดงข้อความและ redirect
  if (hasExistingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              พบข้อมูลการสมัครงานแล้ว
            </h2>
            <p className="text-gray-600 mb-4">
              ข้อมูลของคุณได้รับการบันทึกไว้แล้ว
            </p>
            <div className="flex justify-center">
              <Spinner 
                size="sm"
                color="success"
                labelColor="success"
                label="กำลังนำทางไปหน้า Dashboard..."
              />
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updated = [...formData.educationList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, educationList: updated }));
    
    // ลบ error เมื่อผู้ใช้เริ่มกรอกข้อมูล
    const errorKey = `education_${index}_${field}`;
    if (value && errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // ถ้าไม่ได้ login
  if (status === 'unauthenticated') {
    return null
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationList: [...prev.educationList, { level: "", school: "", major: "", startYear: "", endYear: "", gpa: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationList: prev.educationList.filter((_, i) => i !== index)
    }));
  };

  const addWork = () => {
    setFormData(prev => ({
      ...prev,
      workList: [...prev.workList, { 
        position: "", 
        company: "", 
        startDate: "", 
        endDate: "", 
        isCurrent: false,
        description: "",
        salary: ""
      }]
    }));
    
    // เพิ่ม refs สำหรับวันที่ใหม่
    setTimeout(() => {
      workStartDateRefs.current.push(null);
      workEndDateRefs.current.push(null);
    }, 0);
  };

  const removeWork = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workList: prev.workList.filter((_, i) => i !== index)
    }));
    
    // ลบ refs สำหรับวันที่ที่ถูกลบ
    workStartDateRefs.current.splice(index, 1);
    workEndDateRefs.current.splice(index, 1);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // ตรวจสอบข้อมูลส่วนบุคคล
    if (!formData.prefix) newErrors.prefix = "กรุณาเลือกคำนำหน้า";
    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อ";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.gender) newErrors.gender = "กรุณาเลือกเพศ";
    if (!formData.birthDate) newErrors.birthDate = "กรุณาเลือกวันเกิด";
    if (!formData.address) newErrors.address = "กรุณากรอกที่อยู่";

    // ตรวจสอบข้อมูลการศึกษา
    formData.educationList.forEach((education, index) => {
      if (!education.level) newErrors[`education_${index}_level`] = "กรุณาเลือกระดับการศึกษา";
      if (!education.school) newErrors[`education_${index}_school`] = "กรุณากรอกชื่อสถานศึกษา";
    });

    // ตรวจสอบข้อมูลการทำงาน
    formData.workList.forEach((work, index) => {
      if (!work.position) newErrors[`work_${index}_position`] = "กรุณากรอกตำแหน่ง";
      if (!work.company) newErrors[`work_${index}_company`] = "กรุณากรอกชื่อบริษัท/องค์กร";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลก่อนส่ง
    const isValid = validateForm();
    if (!isValid) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    try {
      // สร้าง FormData object
      const formDataToSend = new FormData();
      
      // เพิ่ม Line ID จาก session
      if (session?.user?.id) {
        console.log('Adding Line ID to form data:', session.user.id);
        formDataToSend.append('lineId', session.user.id);
      } else {
        console.log('No Line ID found in session');
      }
      
      // เพิ่มข้อมูลส่วนบุคคล
      Object.keys(formData).forEach(key => {
        if (key === 'profileImage') {
          if (formData.profileImage) {
            formDataToSend.append('profileImage', formData.profileImage);
          }
        } else if (key === 'educationList' || key === 'workList') {
          formDataToSend.append(key, JSON.stringify(formData[key as keyof typeof formData]));
        } else {
          formDataToSend.append(key, formData[key as keyof typeof formData] as string);
        }
      });

      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // อัปโหลดรูปภาพโปรไฟล์ถ้ามี
        if (formData.profileImage) {
          try {
            const imageFormData = new FormData();
            imageFormData.append('file', formData.profileImage);
            imageFormData.append('documentType', 'profileImage');
            imageFormData.append('applicationId', result.applicationId);
            
            const imageResponse = await fetch('/api/profile-image/upload', {
              method: 'POST',
              body: imageFormData,
            });
            
            if (imageResponse.ok) {
              console.log('Profile image uploaded successfully');
            } else {
              console.error('Failed to upload profile image');
            }
          } catch (imageError) {
            console.error('Error uploading profile image:', imageError);
          }
        }
        
        alert(`บันทึกข้อมูลสำเร็จ! รหัสใบสมัคร: ${result.applicationId}`);
        // รีเซ็ตฟอร์ม
        setFormData({
          prefix: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          birthDate: "",
          nationality: "",
          religion: "",
          maritalStatus: "",
          address: "",
          province: "",
          district: "",
          subDistrict: "",
          postalCode: "",
          emergencyContact: "",
          emergencyPhone: "",
          profileImage: null,
          educationList: [{ level: "", school: "", major: "", startYear: "", endYear: "", gpa: "" }],
          workList: [{ position: "", company: "", startDate: "", endDate: "", isCurrent: false, description: "", salary: "" }]
        });
        // รีเซ็ต errors
        setErrors({});
        // ไปหน้า check-profile หลังจาก 1 วินาที
        setTimeout(() => {
          router.push('/check-profile');
        }, 1000);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };



  const handleInputFocus = (fieldName: string) => {
    setFocusedInputs(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleInputBlur = (fieldName: string) => {
    setFocusedInputs(prev => ({ ...prev, [fieldName]: false }));
  };

  const getFloatingLabelClassNames = (fieldName: string, value: string) => {
    const isFocused = focusedInputs[fieldName];
    const hasValue = value && value.trim() !== '';
    const shouldFloat = isFocused || hasValue;

    return {
      input: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 focus:from-white focus:to-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-800 placeholder-gray-500",
      inputWrapper: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 focus-within:from-white focus-within:to-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md relative",
      label: `text-gray-700 font-medium text-sm transition-all duration-300 ${
        shouldFloat
          ? 'text-blue-600 text-xs -translate-y-2 scale-90'
          : 'text-gray-700 text-sm'
      }`,
      errorMessage: "text-red-500 text-xs mt-1"
    };
  };

  const getFloatingSelectClassNames = (fieldName: string, value: string) => {
    const isFocused = focusedInputs[fieldName];
    const hasValue = value && value.trim() !== '';
    const shouldFloat = isFocused || hasValue;

    return {
      trigger: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 focus-within:from-white focus-within:to-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md relative",
      label: `text-gray-700 font-medium text-sm transition-all duration-300 ${
        shouldFloat
          ? 'text-blue-600 text-xs -translate-y-2 scale-90'
          : 'text-gray-700 text-sm'
      }`,
      selectorIcon: "text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2",
      errorMessage: "text-red-500 text-xs mt-1"
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            สมัครงาน
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            กรอกข้อมูลเพื่อสมัครงานกับเรา เราเชื่อมั่นในความสามารถของคุณ
          </p>
        </div>

        {/* Profile Image Upload */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">รูปภาพสมัครงาน</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center space-y-6">
              <div className="w-56 h-56 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-inner">
                {formData.profileImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt="รูปภาพสมัครงาน"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, profileImage: null }))}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">คลิกเพื่ออัปโหลดรูปภาพ</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 5MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                เลือกรูปภาพ
              </label>
            </div>
          </CardBody>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              <h2 className="text-2xl font-bold text-gray-900">ข้อมูลส่วนบุคคล</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Prefix */}
                <div>
                  <Select
                    className="w-full"
                    label="คำนำหน้า"
                    
                    selectedKeys={formData.prefix ? [formData.prefix] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("prefix", selectedKey);
                    }}
                    isInvalid={!!errors.prefix}
                    errorMessage={errors.prefix}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingSelectClassNames("prefix", formData.prefix)}
                    onFocus={() => handleInputFocus("prefix")}
                    onBlur={() => handleInputBlur("prefix")}
                  >
                    <SelectItem key="นาย">นาย</SelectItem>
                    <SelectItem key="นาง">นาง</SelectItem>
                    <SelectItem key="นางสาว">นางสาว</SelectItem>
                    <SelectItem key="ดร.">ดร.</SelectItem>
                    <SelectItem key="ผศ.">ผศ.</SelectItem>
                    <SelectItem key="รศ.">รศ.</SelectItem>
                    <SelectItem key="ศ.">ศ.</SelectItem>
                  </Select>
                </div>

                {/* First Name */}
                <div>
                  <Input
                    type="text"
                    label="ชื่อ"
                    
                    value={formData.firstName}
                    onValueChange={(value) => handleChange("firstName", value)}
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("firstName", formData.firstName)}
                    onFocus={() => handleInputFocus("firstName")}
                    onBlur={() => handleInputBlur("firstName")}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Input
                    type="text"
                    label="นามสกุล"
                    
                    value={formData.lastName}
                    onValueChange={(value) => handleChange("lastName", value)}
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("lastName", formData.lastName)}
                    onFocus={() => handleInputFocus("lastName")}
                    onBlur={() => handleInputBlur("lastName")}
                  />
                </div>

                {/* Email */}
                <div>
                  <Input
                    type="email"
                    label="อีเมล"
                    
                    value={formData.email}
                    onValueChange={(value) => handleChange("email", value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("email", formData.email)}
                    onFocus={() => handleInputFocus("email")}
                    onBlur={() => handleInputBlur("email")}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Input
                    type="tel"
                    label="เบอร์โทรศัพท์"
                    
                    value={formData.phone}
                    onValueChange={(value) => handleChange("phone", value)}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("phone", formData.phone)}
                    onFocus={() => handleInputFocus("phone")}
                    onBlur={() => handleInputBlur("phone")}
                  />
                </div>

                {/* Gender */}
                <div>
                  <Select
                    className="w-full"
                    label="เพศ"
                    
                    selectedKeys={formData.gender ? [formData.gender] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("gender", selectedKey);
                    }}
                    isInvalid={!!errors.gender}
                    errorMessage={errors.gender}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingSelectClassNames("gender", formData.gender)}
                    onFocus={() => handleInputFocus("gender")}
                    onBlur={() => handleInputBlur("gender")}
                  >
                    <SelectItem key="ชาย">ชาย</SelectItem>
                    <SelectItem key="หญิง">หญิง</SelectItem>
                  </Select>
                </div>

                {/* Birth Date */}
                <div>
                  <Input
                    type="text"
                    label="วันเกิด"
                    placeholder="คลิกเพื่อเลือกวันเกิด"
                    ref={birthDateRef}
                    value={formData.birthDate ? (() => {
                      try {
                        const [year, month, day] = formData.birthDate.split('-');
                        if (year && month && day) {
                          return `${day}/${month}/${year}`;
                        }
                        return formData.birthDate;
                      } catch (error) {
                        return formData.birthDate;
                      }
                    })() : ''}
                    isInvalid={!!errors.birthDate}
                    errorMessage={errors.birthDate}
                    isRequired
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("birthDate", formData.birthDate)}
                    onFocus={() => handleInputFocus("birthDate")}
                    onBlur={() => handleInputBlur("birthDate")}
                    onClick={() => {
                      console.log('Input clicked, current birthDate:', formData.birthDate);
                      if (birthDateRef.current) {
                        const fp = (birthDateRef.current as unknown as { _flatpickr?: { open: () => void } })._flatpickr;
                        if (fp) {
                          console.log('Opening flatpickr');
                          fp.open();
                        } else {
                          console.log('No flatpickr instance found, creating new one');
                          // ลองสร้าง flatpickr ใหม่
                          try {
                            const newFp = flatpickr(birthDateRef.current, {
                              locale: Thai,
                              dateFormat: 'Y-m-d',
                              allowInput: true,
                              clickOpens: true,
                              maxDate: new Date(),
                              onChange: (selectedDates, dateStr) => {
                                console.log('New flatpickr onChange:', selectedDates, dateStr);
                                if (selectedDates[0]) {
                                  const date = selectedDates[0];
                                  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                  console.log('New flatpickr formatted date:', formattedDate);
                                  handleChange('birthDate', formattedDate);
                                }
                              }
                            });
                            (birthDateRef.current as unknown as { _flatpickr?: unknown })._flatpickr = newFp;
                            newFp.open();
                          } catch (error) {
                            console.error('Error creating flatpickr:', error);
                          }
                        }
                      } else {
                        console.log('birthDateRef.current is null');
                      }
                    }}
                    startContent={
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </div>

                {/* Nationality */}
                <div>
                  <Input
                    type="text"
                    label="สัญชาติ"
                    value={formData.nationality}
                    onValueChange={(value) => handleChange("nationality", value)}
                    
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("nationality", formData.nationality)}
                    onFocus={() => handleInputFocus("nationality")}
                    onBlur={() => handleInputBlur("nationality")}
                  />
                </div>

                {/* Religion */}
                <div>
                  <Select
                    className="w-full"
                    label="ศาสนา"
                  
                    selectedKeys={formData.religion ? [formData.religion] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("religion", selectedKey);
                    }}
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingSelectClassNames("religion", formData.religion)}
                    onFocus={() => handleInputFocus("religion")}
                    onBlur={() => handleInputBlur("religion")}
                  >
                    <SelectItem key="พุทธ">พุทธ</SelectItem>
                    <SelectItem key="คริสต์">คริสต์</SelectItem>
                    <SelectItem key="อิสลาม">อิสลาม</SelectItem>
                    <SelectItem key="ฮินดู">ฮินดู</SelectItem>
                    <SelectItem key="อื่นๆ">อื่นๆ</SelectItem>
                  </Select>
                </div>

                {/* Marital Status */}
                <div>
                  <Select
                    className="w-full"
                    label="สถานภาพสมรส"
                    
                    selectedKeys={formData.maritalStatus ? [formData.maritalStatus] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      handleChange("maritalStatus", selectedKey);
                    }}
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingSelectClassNames("maritalStatus", formData.maritalStatus)}
                    onFocus={() => handleInputFocus("maritalStatus")}
                    onBlur={() => handleInputBlur("maritalStatus")}
                  >
                    <SelectItem key="โสด">โสด</SelectItem>
                    <SelectItem key="สมรส">สมรส</SelectItem>
                    <SelectItem key="หย่าร้าง">หย่าร้าง</SelectItem>
                    <SelectItem key="หม้าย">หม้าย</SelectItem>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6">
                <div>
                  <Textarea
                    label="ที่อยู่"
                    
                    value={formData.address}
                    onValueChange={(value) => handleChange("address", value)}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address}
                    isRequired
                    minRows={3}
                    radius="lg"
                    variant="flat"
                    classNames={getFloatingLabelClassNames("address", formData.address)}
                    onFocus={() => handleInputFocus("address")}
                    onBlur={() => handleInputBlur("address")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Input
                      type="text"
                      label="จังหวัด"
                      
                      value={formData.province}
                      onValueChange={(value) => handleChange("province", value)}
                      radius="lg"
                      variant="flat"
                      classNames={getFloatingLabelClassNames("province", formData.province)}
                      onFocus={() => handleInputFocus("province")}
                      onBlur={() => handleInputBlur("province")}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="อำเภอ/เขต"
                      
                      value={formData.district}
                      onValueChange={(value) => handleChange("district", value)}
                      radius="lg"
                      variant="flat"
                      classNames={getFloatingLabelClassNames("district", formData.district)}
                      onFocus={() => handleInputFocus("district")}
                      onBlur={() => handleInputBlur("district")}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="ตำบล/แขวง"
                      
                      value={formData.subDistrict}
                      onValueChange={(value) => handleChange("subDistrict", value)}
                      radius="lg"
                      variant="flat"
                      classNames={getFloatingLabelClassNames("subDistrict", formData.subDistrict)}
                      onFocus={() => handleInputFocus("subDistrict")}
                      onBlur={() => handleInputBlur("subDistrict")}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="รหัสไปรษณีย์"
                      
                      value={formData.postalCode}
                      onValueChange={(value) => handleChange("postalCode", value)}
                      radius="lg"
                      variant="flat"
                      classNames={getFloatingLabelClassNames("postalCode", formData.postalCode)}
                      onFocus={() => handleInputFocus("postalCode")}
                      onBlur={() => handleInputBlur("postalCode")}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      type="text"
                      label="ชื่อผู้ติดต่อฉุกเฉิน"
                      
                      value={formData.emergencyContact}
                      onValueChange={(value) => handleChange("emergencyContact", value)}
                      radius="lg"
                      variant="flat"
                      classNames={getFloatingLabelClassNames("emergencyContact", formData.emergencyContact)}
                      onFocus={() => handleInputFocus("emergencyContact")}
                      onBlur={() => handleInputBlur("emergencyContact")}
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      label="เบอร์โทรฉุกเฉิน"
                      
                      value={formData.emergencyPhone}
                      onValueChange={(value) => handleChange("emergencyPhone", value)}
                      radius="lg"
                      variant="flat"
                      classNames={getFloatingLabelClassNames("emergencyPhone", formData.emergencyPhone)}
                      onFocus={() => handleInputFocus("emergencyPhone")}
                      onBlur={() => handleInputBlur("emergencyPhone")}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Education History */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                <h2 className="text-2xl font-bold text-gray-900">ประวัติการศึกษา</h2>
                </div>
                <Button
                  type="button"
                  color="success"
                  variant="flat"
                  size="sm"
                  onClick={addEducation}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                  เพิ่มข้อมูลการศึกษา
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-8">
              {formData.educationList.map((education, index) => (
                <div key={index} className="border border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">ข้อมูลการศึกษา #{index + 1}</h3>
                    {formData.educationList.length > 1 && (
                      <Button
                        type="button"
                        color="danger"
                        variant="flat"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white"
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Select
                        className="w-full"
                        label="ระดับการศึกษา"
                        
                        selectedKeys={education.level ? [education.level] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          handleEducationChange(index, "level", selectedKey);
                        }}
                        isInvalid={!!errors[`education_${index}_level`]}
                        errorMessage={errors[`education_${index}_level`]}
                        isRequired
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingSelectClassNames("education_level", education.level)}
                        onFocus={() => handleInputFocus("education_level")}
                        onBlur={() => handleInputBlur("education_level")}
                      >
                        <SelectItem key="ประถมศึกษา">ประถมศึกษา</SelectItem>
                        <SelectItem key="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</SelectItem>
                        <SelectItem key="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</SelectItem>
                        <SelectItem key="ปวช.">ปวช.</SelectItem>
                        <SelectItem key="ปวส.">ปวส.</SelectItem>
                        <SelectItem key="ปริญญาตรี">ปริญญาตรี</SelectItem>
                        <SelectItem key="ปริญญาโท">ปริญญาโท</SelectItem>
                        <SelectItem key="ปริญญาเอก">ปริญญาเอก</SelectItem>
                      </Select>
                    </div>

                    <div>
                      <Input
                        type="text"
                        label="ชื่อสถานศึกษา"
                        
                        value={education.school}
                        onValueChange={(value) => handleEducationChange(index, "school", value)}
                        isInvalid={!!errors[`education_${index}_school`]}
                        errorMessage={errors[`education_${index}_school`]}
                        isRequired
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("education_school", education.school)}
                        onFocus={() => handleInputFocus("education_school")}
                        onBlur={() => handleInputBlur("education_school")}
                      />
                    </div>

                    <div>
                      <Input
                        type="text"
                        label="สาขา/วิชาเอก"
                        
                        value={education.major}
                        onValueChange={(value) => handleEducationChange(index, "major", value)}
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("education_major", education.major)}
                        onFocus={() => handleInputFocus("education_major")}
                        onBlur={() => handleInputBlur("education_major")}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="GPA"
                        
                        value={education.gpa}
                        onValueChange={(value) => handleEducationChange(index, "gpa", value)}
                        step="0.01"
                        min="0"
                        max="4"
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("education_gpa", education.gpa)}
                        onFocus={() => handleInputFocus("education_gpa")}
                        onBlur={() => handleInputBlur("education_gpa")}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="ปีที่เริ่มศึกษา"
                       
                        value={education.startYear}
                        onValueChange={(value) => handleEducationChange(index, "startYear", value)}
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("education_startYear", education.startYear)}
                        onFocus={() => handleInputFocus("education_startYear")}
                        onBlur={() => handleInputBlur("education_startYear")}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="ปีที่จบการศึกษา"
                        
                        value={education.endYear}
                        onValueChange={(value) => handleEducationChange(index, "endYear", value)}
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("education_endYear", education.endYear)}
                        onFocus={() => handleInputFocus("education_endYear")}
                        onBlur={() => handleInputBlur("education_endYear")}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Work Experience */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                <h2 className="text-2xl font-bold text-gray-900">ประวัติการทำงาน/ฝึกงาน</h2>
                </div>
                <Button
                  type="button"
                  color="success"
                  variant="flat"
                  size="sm"
                  onClick={addWork}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                  เพิ่มข้อมูลการทำงาน
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-8">
              {formData.workList.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">ข้อมูลการทำงาน #{index + 1}</h3>
                    {formData.workList.length > 1 && (
                      <Button
                        type="button"
                        color="danger"
                        variant="flat"
                        size="sm"
                        onClick={() => removeWork(index)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white"
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        type="text"
                        label="ตำแหน่ง"
                        
                        value={work.position}
                        onValueChange={(value) => handleWorkChange(index, "position", value)}
                        isInvalid={!!errors[`work_${index}_position`]}
                        errorMessage={errors[`work_${index}_position`]}
                        isRequired
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("work_position", work.position)}
                        onFocus={() => handleInputFocus("work_position")}
                        onBlur={() => handleInputBlur("work_position")}
                      />
                    </div>

                    <div>
                      <Input
                        type="text"
                        label="ชื่อบริษัท/องค์กร"
                        
                        value={work.company}
                        onValueChange={(value) => handleWorkChange(index, "company", value)}
                        isInvalid={!!errors[`work_${index}_company`]}
                        errorMessage={errors[`work_${index}_company`]}
                        isRequired
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("work_company", work.company)}
                        onFocus={() => handleInputFocus("work_company")}
                        onBlur={() => handleInputBlur("work_company")}
                      />
                    </div>

                    <div>
                      <Input
                        type="text"
                        label="วันที่เริ่มงาน"
                        placeholder="คลิกเพื่อเลือกวันที่เริ่มงาน"
                        ref={(el) => {
                          workStartDateRefs.current[index] = el;
                        }}
                        value={work.startDate ? (() => {
                          try {
                            const [year, month, day] = work.startDate.split('-');
                            if (year && month && day) {
                              return `${day}/${month}/${year}`;
                            }
                            return work.startDate;
                          } catch (error) {
                            return work.startDate;
                          }
                        })() : ''}
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("work_startDate", work.startDate)}
                        onFocus={() => handleInputFocus("work_startDate")}
                        onBlur={() => handleInputBlur("work_startDate")}
                        onClick={() => {
                          console.log('Work start date input clicked, current startDate:', work.startDate);
                          const ref = workStartDateRefs.current[index];
                          if (ref) {
                            const fp = (ref as unknown as { _flatpickr?: { open: () => void } })._flatpickr;
                            if (fp) {
                              console.log('Opening work start date flatpickr');
                              fp.open();
                            } else {
                              console.log('No flatpickr instance found for work start date, creating new one');
                              try {
                                const newFp = flatpickr(ref, {
                                  locale: Thai,
                                  dateFormat: 'd/m/Y',
                                  allowInput: true,
                                  clickOpens: true,
                                  onChange: (selectedDates, dateStr) => {
                                    console.log('Work start date selected:', selectedDates, dateStr);
                                    if (selectedDates[0]) {
                                      const date = selectedDates[0];
                                      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                      console.log('Work start date formatted:', formattedDate);
                                      handleWorkChange(index, 'startDate', formattedDate);
                                    }
                                  }
                                });
                                (ref as unknown as { _flatpickr?: unknown })._flatpickr = newFp;
                                newFp.open();
                              } catch (error) {
                                console.error('Error creating work start date flatpickr:', error);
                              }
                            }
                          } else {
                            console.log('workStartDateRefs.current[index] is null');
                          }
                        }}
                        startContent={
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        }
                      />
                    </div>

                    <div>
                      <Input
                        type="text"
                        label="วันที่สิ้นสุดงาน"
                        placeholder="คลิกเพื่อเลือกวันที่สิ้นสุดงาน"
                        ref={(el) => {
                          workEndDateRefs.current[index] = el;
                        }}
                        value={work.endDate ? (() => {
                          try {
                            const [year, month, day] = work.endDate.split('-');
                            if (year && month && day) {
                              return `${day}/${month}/${year}`;
                            }
                            return work.endDate;
                          } catch (error) {
                            return work.endDate;
                          }
                        })() : ''}
                        isDisabled={work.isCurrent}
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("work_endDate", work.endDate)}
                        onFocus={() => handleInputFocus("work_endDate")}
                        onBlur={() => handleInputBlur("work_endDate")}
                        onClick={() => {
                          if (work.isCurrent) return; // ไม่ให้คลิกได้ถ้าเป็นงานปัจจุบัน
                          console.log('Work end date input clicked, current endDate:', work.endDate);
                          const ref = workEndDateRefs.current[index];
                          if (ref) {
                            const fp = (ref as unknown as { _flatpickr?: { open: () => void } })._flatpickr;
                            if (fp) {
                              console.log('Opening work end date flatpickr');
                              fp.open();
                            } else {
                              console.log('No flatpickr instance found for work end date, creating new one');
                              try {
                                const newFp = flatpickr(ref, {
                                  locale: Thai,
                                  dateFormat: 'd/m/Y',
                                  allowInput: true,
                                  clickOpens: true,
                                  onChange: (selectedDates, dateStr) => {
                                    console.log('Work end date selected:', selectedDates, dateStr);
                                    if (selectedDates[0]) {
                                      const date = selectedDates[0];
                                      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                      console.log('Work end date formatted:', formattedDate);
                                      handleWorkChange(index, 'endDate', formattedDate);
                                    }
                                  }
                                });
                                (ref as unknown as { _flatpickr?: unknown })._flatpickr = newFp;
                                newFp.open();
                              } catch (error) {
                                console.error('Error creating work end date flatpickr:', error);
                              }
                            }
                          } else {
                            console.log('workEndDateRefs.current[index] is null');
                          }
                        }}
                        startContent={
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <input
                          type="checkbox"
                          id={`current-${index}`}
                          checked={work.isCurrent}
                          onChange={(e) => handleWorkChange(index, "isCurrent", e.target.checked)}
                          className="mr-3 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`current-${index}`} className="text-sm font-medium text-gray-700">
                          ทำงานอยู่ปัจจุบัน
                        </label>
                      </div>
                    </div>

                    <div>
                      <Input
                        type="number"
                        label="เงินเดือน"
                        value={work.salary}
                        onValueChange={(value) => handleWorkChange(index, "salary", value)}
                        
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("work_salary", work.salary)}
                        onFocus={() => handleInputFocus("work_salary")}
                        onBlur={() => handleInputBlur("work_salary")}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Textarea
                        label="รายละเอียดงาน"
                        value={work.description}
                        onValueChange={(value) => handleWorkChange(index, "description", value)}
                        
                        minRows={4}
                        radius="lg"
                        variant="flat"
                        classNames={getFloatingLabelClassNames("work_description", work.description)}
                        onFocus={() => handleInputFocus("work_description")}
                        onBlur={() => handleInputBlur("work_description")}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              color="primary"
              variant="solid"
              size="lg"
              className="px-12 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              startContent={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            >
              บันทึกข้อมูลทั้งหมด
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 