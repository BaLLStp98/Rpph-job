'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Chip,
  Avatar,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  XMarkIcon,
  DocumentIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Thai } from 'flatpickr/dist/l10n/th.js';

interface ApplicationData {
  id: string;
  submittedAt: string;
  status: string;
  prefix: string;
  firstName: string;
  lastName: string;
  appliedPosition: string;
  expectedSalary: string;
  email: string;
  phone: string;
  currentAddress: string;
  birthDate: string;
  gender: string;
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
    startDate: string;
    endDate: string;
    description?: string;
    salary?: string;
    reason?: string;
  }>;
  profileImage?: string;
  documents?: {
    idCard?: string;
    houseRegistration?: string;
    militaryCertificate?: string;
    educationCertificate?: string;
    medicalCertificate?: string;
    drivingLicense?: string;
    nameChangeCertificate?: string;
  };
}

// Component สำหรับแสดงข้อมูลในรูปแบบเดียวกับหน้า application-form
const ApplicationFormView = ({ 
  application, 
  onUploadDocument,
  onUpdateApplication,
  isEditing = false,
  onToggleEdit,
  onProfileImageUpdate
}: { 
  application: ApplicationData;
  onUploadDocument?: (documentType: string, file: File) => void;
  onUpdateApplication?: (updatedApplication: ApplicationData) => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onProfileImageUpdate?: (newImageName: string) => void;
}) => {
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewDocument, setPreviewDocument] = useState<{url: string, name: string} | null>(null);
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const [editedApplication, setEditedApplication] = useState<ApplicationData>(application);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [profileImageProgress, setProfileImageProgress] = useState(0);
  // flatpickr refs for editing fields
  const birthDateRef = useRef<HTMLInputElement | null>(null);
  const workStartRefs = useRef<(HTMLInputElement | null)[]>([]);
  const workEndRefs = useRef<(HTMLInputElement | null)[]>([]);

  // เพิ่ม state สำหรับการจัดการรูปภาพ
  const [imageLoadStatus, setImageLoadStatus] = useState<{[key: string]: boolean}>({});
  const [imageErrorStatus, setImageErrorStatus] = useState<{[key: string]: boolean}>({});

  // ฟังก์ชันสำหรับจัดการการโหลดรูปภาพ
  const handleImageLoad = (imageKey: string) => {
    setImageLoadStatus(prev => ({ ...prev, [imageKey]: true }));
    setImageErrorStatus(prev => ({ ...prev, [imageKey]: false }));
    console.log(`✅ Image loaded successfully: ${imageKey}`);
  };

  // ฟังก์ชันสำหรับจัดการข้อผิดพลาดของรูปภาพ
  const handleImageError = (imageKey: string) => {
    setImageLoadStatus(prev => ({ ...prev, [imageKey]: false }));
    setImageErrorStatus(prev => ({ ...prev, [imageKey]: true }));
    console.error(`❌ Image failed to load: ${imageKey}`);
  };

  // อัพเดท editedApplication เมื่อ application เปลี่ยน
  useEffect(() => {
    setEditedApplication(application);
  }, [application]);

  // init flatpickr for editable date fields
  useEffect(() => {
    // birth date
    if (birthDateRef.current) {
      const inst: any = (birthDateRef.current as any)._flatpickr;
      if (inst) inst.destroy();
      flatpickr(birthDateRef.current, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates[0]) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleInputChange('birthDate', iso);
          }
        }
      });
    }

    // work dates
    workStartRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const inst: any = (ref as any)._flatpickr;
      if (inst) inst.destroy();
      flatpickr(ref, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates[0]) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleWorkExperienceChange(idx, 'startDate', iso);
          }
        }
      });
    });

    workEndRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const inst: any = (ref as any)._flatpickr;
      if (inst) inst.destroy();
      flatpickr(ref, {
        locale: Thai,
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        onChange: (dates) => {
          if (dates[0]) {
            const d = dates[0];
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            handleWorkExperienceChange(idx, 'endDate', iso);
          }
        }
      });
    });
  }, [isEditing, editedApplication.workExperience]);

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!onUploadDocument) return;
    
    try {
      setUploadingDocument(documentType);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Call the upload function
      await onUploadDocument(documentType, file);
      
      setUploadProgress(100);
      setTimeout(() => {
        setUploadingDocument(null);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadingDocument(null);
      setUploadProgress(0);
    }
  };

  const handlePreviewDocument = (fileName: string, documentName: string) => {
    // ตรวจสอบว่าเป็นรูปภาพหรือเอกสาร PDF
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    const fileUrl = isImage ? `/api/image?file=${fileName}` : `/api/uploads?file=${fileName}`;
    setPreviewDocument({ url: fileUrl, name: documentName });
    onPreviewOpen();
  };

  const handleDownloadDocument = (fileName: string, documentName: string) => {
    const link = document.createElement('a');
    // ตรวจสอบว่าเป็นรูปภาพหรือเอกสาร PDF
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    link.href = isImage ? `/api/image?file=${fileName}` : `/api/uploads?file=${fileName}`;
    link.download = documentName;
    link.click();
  };

  const getDocumentDisplayName = (docType: string) => {
    const names: { [key: string]: string } = {
      idCard: 'สำเนาบัตรประชาชน',
      houseRegistration: 'สำเนาทะเบียนบ้าน',
      militaryCertificate: 'สำเนาหลักฐานการเกณฑ์ทหาร',
      educationCertificate: 'สำเนาหลักฐานการศึกษา',
      medicalCertificate: 'ใบรับรองแพทย์',
      drivingLicense: 'ใบอนุญาตขับขี่',
      nameChangeCertificate: 'ใบเปลี่ยนชื่อ'
    };
    return names[docType] || docType;
  };

  // ฟังก์ชันสำหรับการแก้ไขข้อมูล
  const handleInputChange = (field: string, value: string) => {
    setEditedApplication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setEditedApplication(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    setEditedApplication(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((work, i) => 
        i === index ? { ...work, [field]: value } : work
      )
    }));
  };

  // ฟังก์ชันสำหรับการอัปโหลดรูปภาพโปรไฟล์
  const handleProfileImageUpload = async (file: File) => {
    if (!onUploadDocument) return;
    
    try {
      setUploadingProfileImage(true);
      setProfileImageProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setProfileImageProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Call the upload function with 'profileImage' as document type
      const result = await onUploadDocument('profileImage', file);
      
      // ถ้ามี callback function ให้เรียกเพื่ออัปเดตรูปภาพทันที
      if (onProfileImageUpdate && typeof result === 'string') {
        onProfileImageUpdate(result);
      }
      
      setProfileImageProgress(100);
      setTimeout(() => {
        setUploadingProfileImage(false);
        setProfileImageProgress(0);
      }, 500);
      
    } catch (error) {
      setUploadingProfileImage(false);
      setProfileImageProgress(0);
    }
  };

  const handleSaveChanges = () => {
    if (onUpdateApplication) {
      // รวมการอัปเดตรูปภาพโปรไฟล์ด้วย
      const updatedApplication = {
        ...editedApplication,
        profileImage: editedApplication.profileImage || application.profileImage
      };
      onUpdateApplication(updatedApplication);
    }
  };

  const handleCancelEdit = () => {
    setEditedApplication(application);
    if (onToggleEdit) {
      onToggleEdit();
    }
  };

  return (
    <div className="space-y-8">
      {/* ข้อมูลส่วนตัว */}
      <Card className="shadow-xl border-0">
                 <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
           <div className="relative flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                 <UserIcon className="w-6 h-6" />
               </div>
               <h2 className="text-xl font-semibold">ข้อมูลส่วนตัว</h2>
             </div>
             {onToggleEdit && (
               <div className="flex gap-2">
                 {!isEditing ? (
                   <Button
                     size="sm"
                     variant="ghost"
                     color="warning"
                     onClick={onToggleEdit}
                     className="bg-white/20 text-white hover:bg-white/30"
                   >
                     แก้ไข
                   </Button>
                 ) : (
                   <>
                     <Button
                       size="sm"
                       variant="ghost"
                       color="success"
                       onClick={handleSaveChanges}
                       className="bg-white/20 text-white hover:bg-white/30"
                     >
                       บันทึก
                     </Button>
                     <Button
                       size="sm"
                       variant="ghost"
                       color="danger"
                       onClick={handleCancelEdit}
                       className="bg-white/20 text-white hover:bg-white/30"
                     >
                       ยกเลิก
                     </Button>
                   </>
                 )}
               </div>
             )}
           </div>
         </CardHeader>
        <CardBody className="p-8">
          {/* Profile Image */}
          {(application.profileImage || isEditing) && (
            <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                รูปถ่ายประจำตัว
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200">
                  {(editedApplication.profileImage || application.profileImage) ? (
                    <img
                      src={`/api/image?file=${editedApplication.profileImage || application.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      data-image-id={`modal-${application.id}`}
                      style={{
                        display: 'block',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        backgroundColor: '#f3f4f6',
                        position: 'relative',
                        zIndex: 10
                      }}
                      onClick={() => handlePreviewDocument(editedApplication.profileImage || application.profileImage!, 'รูปถ่ายประจำตัว')}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        console.error(`❌ Failed to load modal image: ${editedApplication.profileImage || application.profileImage} for modal-${application.id}`);
                        // แสดง fallback avatar ทันทีเมื่อรูปโหลดไม่สำเร็จ
                        img.style.display = 'none';
                        const fallback = img.parentElement?.querySelector('.modal-fallback-avatar') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                        handleImageError(`modal-${application.id}`);
                      }}
                      onLoad={() => {
                        console.log(`✅ Modal image loaded successfully: ${editedApplication.profileImage || application.profileImage} for modal-${application.id}`);
                        handleImageLoad(`modal-${application.id}`);
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center pointer-events-none">
                    <EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  
                  {/* Fallback avatar for modal */}
                  <div 
                    className="modal-fallback-avatar w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl absolute inset-0"
                    data-fallback-id={`modal-${application.id}`}
                    style={{ display: 'none' }}
                  >
                    {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">รูปถ่ายประจำตัว</p>
                  {/* แสดงสถานะรูปภาพใน modal */}
                  {(editedApplication.profileImage || application.profileImage) && (
                    <div className="flex items-center gap-2 mb-2">
                      {imageLoadStatus[`modal-${application.id}`] ? (
                        <span className="text-xs text-green-600">✅ รูปภาพโหลดสำเร็จ</span>
                      ) : imageErrorStatus[`modal-${application.id}`] ? (
                        <span className="text-xs text-red-600">❌ รูปภาพโหลดไม่สำเร็จ</span>
                      ) : (
                        <span className="text-xs text-gray-500">⏳ กำลังโหลดรูปภาพ...</span>
                      )}
                    </div>
                  )}
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleProfileImageUpload(file);
                          }
                        }}
                        className="hidden"
                        id="profile-image-upload"
                      />
                      <label
                        htmlFor="profile-image-upload"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
                      >
                        {uploadingProfileImage ? (
                          <>
                            <Spinner size="sm" />
                            อัปโหลด... {profileImageProgress}%
                          </>
                        ) : (
                          <>
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            อัปโหลดรูปใหม่
                          </>
                        )}
                      </label>
                                             {(editedApplication.profileImage || application.profileImage) && (
                         <Button
                           size="sm"
                           variant="ghost"
                           color="primary"
                           startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                           onClick={() => handleDownloadDocument(editedApplication.profileImage || application.profileImage!, 'รูปถ่ายประจำตัว.png')}
                         >
                           ดาวน์โหลด
                         </Button>
                       )}
                    </div>
                                     ) : (
                     (editedApplication.profileImage || application.profileImage) && (
                       <Button
                         size="sm"
                         variant="ghost"
                         color="primary"
                         startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                         onClick={() => handleDownloadDocument(editedApplication.profileImage || application.profileImage!, 'รูปถ่ายประจำตัว.png')}
                       >
                         ดาวน์โหลด
                       </Button>
                     )
                   )}
                </div>
              </div>
            </div>
          )}

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">คำนำหน้า</p>
               {isEditing ? (
                 <input
                   type="text"
                   value={editedApplication.prefix || ''}
                   onChange={(e) => handleInputChange('prefix', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.prefix || '-'}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">ชื่อ</p>
               {isEditing ? (
                 <input
                   type="text"
                   value={editedApplication.firstName}
                   onChange={(e) => handleInputChange('firstName', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.firstName}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">นามสกุล</p>
               {isEditing ? (
                 <input
                   type="text"
                   value={editedApplication.lastName}
                   onChange={(e) => handleInputChange('lastName', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.lastName}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">อีเมล</p>
               {isEditing ? (
                 <input
                   type="email"
                   value={editedApplication.email}
                   onChange={(e) => handleInputChange('email', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.email}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</p>
               {isEditing ? (
                 <input
                   type="tel"
                   value={editedApplication.phone}
                   onChange={(e) => handleInputChange('phone', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.phone}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">วันเกิด</p>
               {isEditing ? (
                 <input
                   type="date"
                   value={editedApplication.birthDate}
                   onChange={(e) => handleInputChange('birthDate', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.birthDate}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">เพศ</p>
               {isEditing ? (
                 <select
                   value={editedApplication.gender}
                   onChange={(e) => handleInputChange('gender', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                   <option value="ชาย">ชาย</option>
                   <option value="หญิง">หญิง</option>
                 </select>
               ) : (
                 <p className="text-gray-800">{application.gender}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">ตำแหน่งที่สมัคร</p>
               {isEditing ? (
                 <input
                   type="text"
                   value={editedApplication.appliedPosition}
                   onChange={(e) => handleInputChange('appliedPosition', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.appliedPosition}</p>
               )}
             </div>
             
             <div>
               <p className="text-sm font-medium text-gray-600 mb-1">เงินเดือนที่คาดหวัง</p>
               {isEditing ? (
                 <input
                   type="text"
                   value={editedApplication.expectedSalary}
                   onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               ) : (
                 <p className="text-gray-800">{application.expectedSalary}</p>
               )}
             </div>
           </div>

                     <div className="mt-6">
             <p className="text-sm font-medium text-gray-600 mb-1">ที่อยู่ปัจจุบัน</p>
             {isEditing ? (
               <textarea
                 value={editedApplication.currentAddress}
                 onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                 rows={3}
                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
             ) : (
               <p className="text-gray-800">{application.currentAddress}</p>
             )}
           </div>
        </CardBody>
      </Card>

      {/* ข้อมูลการศึกษา */}
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
          {application.education.length > 0 ? (
            <div className="space-y-6">
              {application.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">การศึกษา #{index + 1}</h3>
                  
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">ระดับการศึกษา</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.education[index]?.level || ''}
                           onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{edu.level || '-'}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">สถาบันการศึกษา</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.education[index]?.institution || editedApplication.education[index]?.school || ''}
                           onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{edu.institution || edu.school || '-'}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">สาขาวิชา</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.education[index]?.major || ''}
                           onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{edu.major || '-'}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">ปีที่จบ</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.education[index]?.year || editedApplication.education[index]?.graduationYear || ''}
                           onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{edu.year || edu.graduationYear || '-'}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">เกรดเฉลี่ย</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.education[index]?.gpa || ''}
                           onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{edu.gpa || '-'}</p>
                       )}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีข้อมูลการศึกษา</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ข้อมูลประสบการณ์การทำงาน */}
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
          {application.workExperience.length > 0 ? (
            <div className="space-y-6">
              {application.workExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">ประสบการณ์การทำงาน #{index + 1}</h3>
                  
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">ตำแหน่ง</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.workExperience[index]?.position || ''}
                           onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{work.position}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">บริษัท</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.workExperience[index]?.company || ''}
                           onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{work.company}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">วันที่เริ่มงาน</p>
                       {isEditing ? (
                         <input
                           type="date"
                           value={editedApplication.workExperience[index]?.startDate || ''}
                           onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{work.startDate}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">วันที่สิ้นสุด</p>
                       {isEditing ? (
                         <input
                           type="date"
                           value={editedApplication.workExperience[index]?.endDate || ''}
                           onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{work.endDate}</p>
                       )}
                     </div>
                     
                     <div>
                       <p className="text-sm font-medium text-gray-600 mb-1">เงินเดือน</p>
                       {isEditing ? (
                         <input
                           type="text"
                           value={editedApplication.workExperience[index]?.salary || ''}
                           onChange={(e) => handleWorkExperienceChange(index, 'salary', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{work.salary || '-'}</p>
                       )}
                     </div>
                   </div>
                  
                                     {(work.description || work.reason) && (
                     <div className="mt-4">
                       <p className="text-sm font-medium text-gray-600 mb-1">รายละเอียดงาน</p>
                       {isEditing ? (
                         <textarea
                           value={editedApplication.workExperience[index]?.description || editedApplication.workExperience[index]?.reason || ''}
                           onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                           rows={3}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                       ) : (
                         <p className="text-gray-800">{work.description || work.reason}</p>
                       )}
                     </div>
                   )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่มีข้อมูลประสบการณ์การทำงาน</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* เอกสารแนบ */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">เอกสารแนบ</h2>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {/* ส่วนอัพโหลดเอกสารใหม่ */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">อัพโหลดเอกสารใหม่</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* สำเนาบัตรประชาชน */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-red-50 to-pink-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">สำเนาบัตรประชาชน</h4>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="upload-idCard"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('idCard', file);
                  }}
                />
                <Button
                  color="primary"
                  variant="ghost"
                  size="sm"
                  isLoading={uploadingDocument === 'idCard'}
                  onClick={() => document.getElementById('upload-idCard')?.click()}
                  className="w-full"
                >
                  {uploadingDocument === 'idCard' ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
                </Button>
                {uploadingDocument === 'idCard' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* สำเนาทะเบียนบ้าน */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">สำเนาทะเบียนบ้าน</h4>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="upload-houseRegistration"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('houseRegistration', file);
                  }}
                />
                <Button
                  color="primary"
                  variant="ghost"
                  size="sm"
                  isLoading={uploadingDocument === 'houseRegistration'}
                  onClick={() => document.getElementById('upload-houseRegistration')?.click()}
                  className="w-full"
                >
                  {uploadingDocument === 'houseRegistration' ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
                </Button>
                {uploadingDocument === 'houseRegistration' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* สำเนาหลักฐานการศึกษา */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">สำเนาหลักฐานการศึกษา</h4>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="upload-educationCertificate"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('educationCertificate', file);
                  }}
                />
                <Button
                  color="primary"
                  variant="ghost"
                  size="sm"
                  isLoading={uploadingDocument === 'educationCertificate'}
                  onClick={() => document.getElementById('upload-educationCertificate')?.click()}
                  className="w-full"
                >
                  {uploadingDocument === 'educationCertificate' ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
                </Button>
                {uploadingDocument === 'educationCertificate' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* ใบรับรองแพทย์ */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">ใบรับรองแพทย์</h4>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">จำเป็น</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="upload-medicalCertificate"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('medicalCertificate', file);
                  }}
                />
                <Button
                  color="primary"
                  variant="ghost"
                  size="sm"
                  isLoading={uploadingDocument === 'medicalCertificate'}
                  onClick={() => document.getElementById('upload-medicalCertificate')?.click()}
                  className="w-full"
                >
                  {uploadingDocument === 'medicalCertificate' ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
                </Button>
                {uploadingDocument === 'medicalCertificate' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* แสดงเอกสารที่มีอยู่ */}
          {application.documents && Object.keys(application.documents).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">เอกสารที่มีอยู่</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(application.documents).map(([docType, fileName]) => (
                  <div key={docType} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <DocumentIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{getDocumentDisplayName(docType)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        color="primary" 
                        startContent={<EyeIcon className="w-4 h-4" />}
                        onClick={() => handlePreviewDocument(fileName, getDocumentDisplayName(docType))}
                      >
                        ดูไฟล์
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        color="primary" 
                        startContent={<ArrowDownTrayIcon className="w-4 h-4" />} 
                        onClick={() => handleDownloadDocument(fileName, `${getDocumentDisplayName(docType)}.pdf`)}
                      >
                        ดาวน์โหลด
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal สำหรับ Preview เอกสาร */}
      <Modal 
        isOpen={isPreviewOpen} 
        onClose={onPreviewClose} 
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh] bg-white",
          body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
          header: "bg-white",
          footer: "bg-white"
        }}
      >
        <ModalContent className="bg-white">
          <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">ดูเอกสาร: {previewDocument?.name}</h3>
              <Button
                isIconOnly
                variant="light"
                onClick={onPreviewClose}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>
          </ModalHeader>
          <ModalBody className="overflow-y-auto bg-white">
            {previewDocument && (
              <div className="w-full h-[70vh]">
                <iframe
                  src={previewDocument.url}
                  className="w-full h-full border-0 rounded-lg"
                  title={previewDocument.name}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter className="bg-white">
            <Button color="primary" onClick={onPreviewClose}>
              ปิด
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default function ApplicationData() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Profile image preview state
  const [previewProfileImage, setPreviewProfileImage] = useState<{url: string, name: string} | null>(null);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean, application: ApplicationData | null}>({
    isOpen: false,
    application: null
  });

  // เพิ่ม state สำหรับการดูเอกสารแนบ
  const [documentsView, setDocumentsView] = useState<{isOpen: boolean, application: ApplicationData | null}>({
    isOpen: false,
    application: null
  });

  // เพิ่ม state สำหรับ preview เอกสาร
  const [previewDocument, setPreviewDocument] = useState<{url: string, name: string} | null>(null);
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

  // เพิ่ม state สำหรับการจัดการรูปภาพ
  const [imageLoadStatus, setImageLoadStatus] = useState<{[key: string]: boolean}>({});
  const [imageErrorStatus, setImageErrorStatus] = useState<{[key: string]: boolean}>({});

  // ฟังก์ชันสำหรับจัดการการโหลดรูปภาพ
  const handleImageLoad = (imageKey: string) => {
    setImageLoadStatus(prev => ({ ...prev, [imageKey]: true }));
    setImageErrorStatus(prev => ({ ...prev, [imageKey]: false }));
    console.log(`✅ Image loaded successfully: ${imageKey}`);
  };

  // ฟังก์ชันสำหรับจัดการข้อผิดพลาดของรูปภาพ
  const handleImageError = (imageKey: string) => {
    setImageLoadStatus(prev => ({ ...prev, [imageKey]: false }));
    setImageErrorStatus(prev => ({ ...prev, [imageKey]: true }));
    console.error(`❌ Image failed to load: ${imageKey}`);
  };

  // ฟังก์ชันสำหรับบังคับแสดงรูปภาพ
  const forceShowImages = () => {
    applications.forEach(app => {
      if (app.profileImage) {
        // Force show image in card
        const cardImg = document.querySelector(`[data-image-id="card-${app.id}"]`) as HTMLImageElement;
        if (cardImg) {
          cardImg.style.display = 'block';
          cardImg.style.visibility = 'visible';
          cardImg.style.opacity = '1';
        }
        
        // Hide fallback avatar
        const fallback = document.querySelector(`[data-fallback-id="card-${app.id}"]`) as HTMLElement;
        if (fallback) {
          fallback.style.display = 'none';
        }
      }
    });
  };

  // ฟังก์ชันสำหรับบังคับแสดงรูปภาพเฉพาะตัว
  const forceShowSpecificImage = (imageKey: string) => {
    const appId = imageKey.replace('card-', '').replace('modal-', '');
    if (imageKey.startsWith('card-')) {
      const cardImg = document.querySelector(`[data-image-id="card-${appId}"]`) as HTMLImageElement;
      const fallback = document.querySelector(`[data-fallback-id="card-${appId}"]`) as HTMLElement;
      
      if (cardImg) {
        cardImg.style.display = 'block';
        cardImg.style.visibility = 'visible';
        cardImg.style.opacity = '1';
      }
      
      if (fallback) {
        fallback.style.display = 'none';
      }
    }
  };

  // ฟังก์ชันสำหรับบังคับแสดงรูปภาพเฉพาะตัว (สำหรับ modal)
  const forceShowModalImage = (imageKey: string) => {
    const appId = imageKey.replace('card-', '').replace('modal-', '');
    if (imageKey.startsWith('modal-')) {
      const modalImg = document.querySelector(`[data-image-id="modal-${appId}"]`) as HTMLImageElement;
      const fallback = document.querySelector(`[data-fallback-id="modal-${appId}"]`) as HTMLElement;
      
      if (modalImg) {
        modalImg.style.display = 'block';
        modalImg.style.visibility = 'visible';
        modalImg.style.opacity = '1';
      }
      
      if (fallback) {
        fallback.style.display = 'none';
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      // ลองดึงจาก /api/register ก่อน (applications.json)
      let response = await fetch('/api/register');
      let data;
      
      if (response.ok) {
        data = await response.json();
        if (data && data.length > 0) {
          // แปลงข้อมูลจาก applications.json ให้ตรงกับ interface
          const applicationsData = data.map((app: any) => ({
            id: app.id,
            submittedAt: app.createdAt,
            status: app.status,
            prefix: app.prefix,
            firstName: app.firstName,
            lastName: app.lastName,
            appliedPosition: app.workList?.[0]?.position || 'ไม่ระบุ',
            expectedSalary: app.workList?.[0]?.salary || 'ไม่ระบุ',
            email: app.email,
            phone: app.phone,
            currentAddress: `${app.address} ${app.subDistrict} ${app.district} ${app.province} ${app.postalCode}`,
            birthDate: app.birthDate,
            gender: app.gender,
            education: app.educationList || [],
            workExperience: app.workList || [],
            profileImage: app.profileImageUrl || app.profileImage, // ใช้ profileImageUrl ก่อน แล้วจึงใช้ profileImage
            documents: {}
          }));
          
          console.log('🔄 Converted applications data:', applicationsData);
          console.log('📸 Profile images found:', applicationsData.map((app: any) => ({ id: app.id, profileImage: app.profileImage, profileImageUrl: app.profileImageUrl })));
          console.log('🔍 Original data profileImageUrl:', data.map((app: any) => ({ id: app.id, profileImageUrl: app.profileImageUrl })));
          console.log('🔍 Mapped profileImage:', applicationsData.map((app: any) => ({ id: app.id, profileImage: app.profileImage })));
          
          setApplications(applicationsData);
          
          // โหลดรูปภาพทันทีหลังจากได้ข้อมูล
          if (applicationsData.length > 0) {
            console.log('🔍 Found applications with profile images:', applicationsData.map((app: any) => ({ id: app.id, profileImage: app.profileImage })));
            
            const profileImages = applicationsData
              .filter((app: any) => app.profileImage)
              .map((app: any) => app.profileImage!);
            
            console.log('📸 Profile images to load:', profileImages);
            
            if (profileImages.length > 0) {
              // เรียก API รูปภาพเพื่อตรวจสอบ - ใช้ /api/image เท่านั้น
              const imagePromises = profileImages.map(async (imageName: string) => {
                try {
                  console.log(`🔄 Testing image from /api/image: ${imageName}`);
                  const response = await fetch(`/api/image?file=${imageName}&t=${Date.now()}`);
                  console.log(`📡 /api/image response for ${imageName}:`, response.status, response.ok);
                  
                  if (response.ok) {
                    return { success: true, imageName, source: 'image' };
                  }
                  
                  return { success: false, imageName, source: 'image-failed' };
                } catch (error) {
                  console.error(`❌ Error testing image ${imageName}:`, error);
                  return { success: false, imageName, source: 'error' };
                }
              });
              
              Promise.all(imagePromises).then((results) => {
                console.log('📊 Image test results:', results);
                results.forEach((result) => {
                  const app = applicationsData.find((app: any) => app.profileImage === result.imageName);
                  if (app) {
                    if (result.success) {
                      setImageLoadStatus(prev => ({ ...prev, [`card-${app.id}`]: true }));
                      setImageErrorStatus(prev => ({ ...prev, [`card-${app.id}`]: false }));
                      console.log(`✅ Image status updated for ${app.id}: ${result.imageName} (source: ${result.source})`);
                    } else {
                      setImageLoadStatus(prev => ({ ...prev, [`card-${app.id}`]: false }));
                      setImageErrorStatus(prev => ({ ...prev, [`card-${app.id}`]: true }));
                      console.log(`❌ Image failed for ${app.id}: ${result.imageName} (source: ${result.source})`);
                    }
                  }
                });
                
                // บังคับแสดงรูปภาพหลังจากโหลดเสร็จ
                setTimeout(() => {
                  console.log('🚀 Force showing images...');
                  forceShowImages();
                  
                  // บังคับแสดงรูปภาพทันทีสำหรับแต่ละ application
                  applicationsData.forEach((app: any) => {
                    if (app.profileImage) {
                      const cardImg = document.querySelector(`[data-image-id="card-${app.id}"]`) as HTMLImageElement;
                      const fallback = document.querySelector(`[data-fallback-id="card-${app.id}"]`) as HTMLElement;
                      
                      if (cardImg) {
                        cardImg.style.display = 'block';
                        cardImg.style.visibility = 'visible';
                        cardImg.style.opacity = '1';
                        console.log(`🎯 Forced show image for ${app.id}: ${app.profileImage}`);
                      }
                      
                      if (fallback) {
                        fallback.style.display = 'none';
                      }
                    }
                  });
                }, 100);
              });
            }
          }
          return;
        }
      }
      
      // ถ้าไม่มีข้อมูลใน applications.json ให้ดึงจาก application-form
      response = await fetch('/api/application-form');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      data = await response.json();
      
      if (data.applications && data.applications.length > 0) {
        console.log('📋 Found data in application-forms.json:', data.applications.length, 'applications');
        
        const applicationsData = data.applications.map((app: any) => ({
          id: app.id,
          submittedAt: app.submittedAt || app.createdAt || new Date().toISOString(),
          status: app.status || 'pending',
          prefix: app.personalInfo?.prefix || app.prefix || '',
          firstName: app.personalInfo?.firstName || app.firstName || '',
          lastName: app.personalInfo?.lastName || app.lastName || '',
          appliedPosition: app.appliedPosition || app.personalInfo?.appliedPosition || 'ไม่ระบุ',
          expectedSalary: app.expectedSalary || app.personalInfo?.expectedSalary || 'ไม่ระบุ',
          email: app.personalInfo?.email || app.email || '',
          phone: app.personalInfo?.phone || app.phone || '',
          currentAddress: app.personalInfo?.currentAddress || app.currentAddress || '',
          birthDate: app.personalInfo?.birthDate || app.birthDate || '',
          gender: app.personalInfo?.gender || app.gender || '',
          education: app.education || [],
          workExperience: app.workExperience || [],
          profileImage: app.profileImage, // ใช้ profileImage โดยตรง
          documents: app.documents || {}
        }));
        
        console.log('🔄 Converted application-forms data:', applicationsData);
        console.log('📸 Profile images found:', applicationsData.map((app: any) => ({ id: app.id, profileImage: app.profileImage })));
        console.log('🔍 Original application-forms data:', data.applications.map((app: any) => ({ id: app.id, profileImage: app.profileImage })));
        
        setApplications(applicationsData);
        
        // โหลดรูปภาพทันทีหลังจากได้ข้อมูล
        if (applicationsData.length > 0) {
          console.log('🔍 Found applications with profile images:', applicationsData.map((app: any) => ({ id: app.id, profileImage: app.profileImage })));
          
          const profileImages = applicationsData
            .filter((app: any) => app.profileImage)
            .map((app: any) => app.profileImage!);
          
          console.log('📸 Profile images to load:', profileImages);
          
          if (profileImages.length > 0) {
            // เรียก API รูปภาพเพื่อตรวจสอบ - ใช้ /api/image เท่านั้น
            const imagePromises = profileImages.map(async (imageName: string) => {
              try {
                console.log(`🔄 Testing image from /api/image: ${imageName}`);
                const response = await fetch(`/api/image?file=${imageName}&t=${Date.now()}`);
                console.log(`📡 /api/image response for ${imageName}:`, response.status, response.ok);
                
                if (response.ok) {
                  return { success: true, imageName, source: 'image' };
                }
                
                return { success: false, imageName, source: 'image-failed' };
              } catch (error) {
                console.error(`❌ Error testing image ${imageName}:`, error);
                return { success: false, imageName, source: 'error' };
              }
            });
            
            Promise.all(imagePromises).then((results) => {
              console.log('📊 Image test results:', results);
              results.forEach((result) => {
                const app = applicationsData.find((app: any) => app.profileImage === result.imageName);
                if (app) {
                  if (result.success) {
                    setImageLoadStatus(prev => ({ ...prev, [`card-${app.id}`]: true }));
                    setImageErrorStatus(prev => ({ ...prev, [`card-${app.id}`]: false }));
                    console.log(`✅ Image status updated for ${app.id}: ${result.imageName} (source: ${result.source})`);
                  } else {
                    setImageLoadStatus(prev => ({ ...prev, [`card-${app.id}`]: false }));
                    setImageErrorStatus(prev => ({ ...prev, [`card-${app.id}`]: true }));
                    console.log(`❌ Image failed for ${app.id}: ${result.imageName} (source: ${result.source})`);
                  }
                }
              });
              
              // บังคับแสดงรูปภาพหลังจากโหลดเสร็จ
              setTimeout(() => {
                console.log('🚀 Force showing images...');
                forceShowImages();
                
                // บังคับแสดงรูปภาพทันทีสำหรับแต่ละ application
                applicationsData.forEach((app: any) => {
                  if (app.profileImage) {
                    const cardImg = document.querySelector(`[data-image-id="card-${app.id}"]`) as HTMLImageElement;
                    const fallback = document.querySelector(`[data-fallback-id="card-${app.id}"]`) as HTMLElement;
                    
                    if (cardImg) {
                      cardImg.style.display = 'block';
                      cardImg.style.visibility = 'visible';
                      cardImg.style.opacity = '1';
                      console.log(`🎯 Forced show image for ${app.id}: ${app.profileImage}`);
                    }
                    
                    if (fallback) {
                      fallback.style.display = 'none';
                    }
                  }
                });
              }, 100);
            });
          }
        }
        return;
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return 'ไม่ทราบสถานะ';
    switch (status.toLowerCase()) {
      case 'pending': return 'รอพิจารณา';
      case 'approved': return 'ผ่านการคัดเลือก';
      case 'rejected': return 'ไม่ผ่าน';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'ไม่ระบุวันที่';
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetails = (application: ApplicationData) => {
    setSelectedApplication(application);
    onOpen();
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
    setIsEditing(false);
    onClose();
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handlePreviewProfileImage = (fileName: string, name: string) => {
    setPreviewProfileImage({
      url: `/api/image?file=${fileName}`,
      name: name
    });
    onPreviewOpen();
  };

  const handleUpdateApplication = async (updatedApplication: ApplicationData) => {
    try {
      const response = await fetch(`/api/application-form/${updatedApplication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedApplication),
      });

      if (response.ok) {
        // Refresh applications to get updated data
        await fetchApplications();
        setIsEditing(false);
        alert('บันทึกการแก้ไขสำเร็จ');
      } else {
        throw new Error('Failed to update application');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกการแก้ไข');
    }
  };

  // ฟังก์ชันสำหรับการลบ card
  const handleDeleteApplication = async (application: ApplicationData) => {
    try {
      const response = await fetch(`/api/application-form/${application.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh applications to get updated data
        await fetchApplications();
        setDeleteConfirmation({ isOpen: false, application: null });
        alert('ลบใบสมัครงานสำเร็จ');
      } else {
        throw new Error('Failed to delete application');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบใบสมัครงาน');
    }
  };

  // ฟังก์ชันสำหรับเปิด modal ยืนยันการลบ
  const openDeleteConfirmation = (application: ApplicationData) => {
    setDeleteConfirmation({ isOpen: true, application });
  };

  // ฟังก์ชันสำหรับปิด modal ยืนยันการลบ
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, application: null });
  };

  // ฟังก์ชันสำหรับเปิด modal ดูเอกสารแนบ
  const handleViewDocuments = (application: ApplicationData) => {
    setDocumentsView({ isOpen: true, application });
  };

  // ฟังก์ชันสำหรับปิด modal ดูเอกสารแนบ
  const closeDocumentsView = () => {
    setDocumentsView({ isOpen: false, application: null });
  };

  // ฟังก์ชันสำหรับแปลงชื่อเอกสารเป็นภาษาไทย (สำหรับใช้ใน Modal ดูเอกสาร)
  const getDocumentDisplayName = (docType: string) => {
    const names: { [key: string]: string } = {
      idCard: 'สำเนาบัตรประชาชน',
      houseRegistration: 'สำเนาทะเบียนบ้าน',
      militaryCertificate: 'สำเนาหลักฐานการเกณฑ์ทหาร',
      educationCertificate: 'สำเนาหลักฐานการศึกษา',
      medicalCertificate: 'ใบรับรองแพทย์',
      drivingLicense: 'ใบอนุญาตขับขี่',
      nameChangeCertificate: 'ใบเปลี่ยนชื่อ'
    };
    return names[docType] || docType;
  };

  const handleUploadDocument = async (documentType: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('file', file);
      
      // เพิ่ม applicationId สำหรับรูปภาพโปรไฟล์
      if (documentType === 'profileImage' && selectedApplication) {
        formData.append('applicationId', selectedApplication.id);
      }
      
      // ใช้ endpoint ที่แตกต่างกันสำหรับรูปภาพโปรไฟล์
      const endpoint = documentType === 'profileImage' ? '/api/profile-image/upload' : '/api/documents/upload';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        if (documentType === 'profileImage') {
          // สำหรับรูปภาพโปรไฟล์ ให้อัปเดตทันที
          const data = await response.json();
          if (data.profileImage) {
            // อัปเดต selectedApplication และ editedApplication ทันที
            setSelectedApplication(prev => prev ? { ...prev, profileImage: data.profileImage } : null);
            // อัปเดต applications list ด้วย
            setApplications(prev => prev.map(app => 
              app.id === selectedApplication?.id 
                ? { ...app, profileImage: data.profileImage }
                : app
            ));
            // ส่งข้อมูลรูปภาพกลับไป
            return data.profileImage;
          }
        } else {
          // สำหรับเอกสารอื่นๆ ให้ refresh applications
          await fetchApplications();
        }
        alert('อัพโหลดสำเร็จ');
      } else {
        throw new Error('Failed to upload');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัพโหลด');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md">
              <CardBody className="text-center p-8">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button
                  color="primary"
                  onClick={fetchApplications}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  ลองใหม่
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ข้อมูลใบสมัครงาน
                </h1>
                <p className="text-gray-600">แสดงข้อมูลที่บันทึกจากใบสมัครงาน</p>
              </div>
            </div>
            <Button
              color="primary"
              variant="ghost"
              startContent={<ArrowLeftIcon className="w-5 h-5" />}
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              กลับไปหน้า Dashboard
            </Button>
          </div>
          
          {/* สถานะรวมของรูปภาพ */}
          {applications.some(app => app.profileImage) && (
            <div className="mt-4">
              <Card className="shadow-lg bg-blue-50 border-blue-200">
                <CardBody className="p-4">
                  <div className="flex items-center justify-center gap-6 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      <span>จำนวนใบสมัคร: {applications.length} ใบ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>รูปภาพโหลดสำเร็จ: {Object.values(imageLoadStatus).filter(Boolean).length} ตัว</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span>รูปภาพโหลดไม่สำเร็จ: {Object.values(imageErrorStatus).filter(Boolean).length} ตัว</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                      <span>กำลังโหลด: {applications.filter(app => app.profileImage).length - Object.values(imageLoadStatus).filter(Boolean).length - Object.values(imageErrorStatus).filter(Boolean).length} ตัว</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      color="warning"
                      variant="bordered"
                      onClick={() => {
                        setImageLoadStatus({});
                        setImageErrorStatus({});
                      }}
                    >
                      รีเซ็ตสถานะรูปภาพ
                    </Button>
                    <Button
                      size="sm"
                      color="success"
                      variant="bordered"
                      onClick={() => {
                        alert(`สถานะรูปภาพ:\nโหลดสำเร็จ: ${Object.values(imageLoadStatus).filter(Boolean).length} ตัว\nเกิดข้อผิดพลาด: ${Object.values(imageErrorStatus).filter(Boolean).length} ตัว`);
                      }}
                    >
                      ดูสถานะรูปภาพ
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="bordered"
                      onClick={forceShowImages}
                    >
                      บังคับแสดงรูปภาพ
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {applications.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardBody className="p-8 text-center">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีข้อมูลใบสมัครงาน</h3>
              <p className="text-gray-500 mb-4">คุณยังไม่ได้ส่งใบสมัครงานใดๆ</p>
              <Button
                color="primary"
                onClick={() => window.location.href = '/application-form'}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                สมัครงาน
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((application, index) => (
              <Card key={application.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative group w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-md">
                        {application.profileImage ? (
                          <>
                            <img
                              src={`/api/image?file=${application.profileImage}`}
                              alt={`${application.firstName} ${application.lastName}`}
                              className="w-full h-full object-cover cursor-pointer"
                              data-image-id={`card-${application.id}`}
                              style={{
                                display: 'block',
                                backgroundColor: '#f3f4f6',
                                position: 'relative',
                                zIndex: 10
                              }}
                              onClick={() => {
                                handlePreviewProfileImage(application.profileImage!, `${application.firstName} ${application.lastName}`);
                              }}
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                console.error(`❌ Failed to load image from /api/image: ${application.profileImage} for card-${application.id}`);
                                // แสดง fallback avatar ทันทีเมื่อรูปโหลดไม่สำเร็จ
                                img.style.display = 'none';
                                const fallback = img.parentElement?.querySelector('.fallback-avatar') as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                                handleImageError(`card-${application.id}`);
                              }}
                              onLoad={() => {
                                console.log(`✅ Image loaded successfully from /api/image: ${application.profileImage} for card-${application.id}`);
                                handleImageLoad(`card-${application.id}`);
                              }}
                            />
                            <div 
                              className="fallback-avatar w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm absolute inset-0 cursor-pointer"
                              data-fallback-id={`card-${application.id}`}
                              style={{ display: 'none', zIndex: 5 }}
                              onClick={() => {
                                handlePreviewProfileImage(application.profileImage!, `${application.firstName} ${application.lastName}`);
                              }}
                            >
                              {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                            </div>
                          </>
                        ) : (
                          <div 
                            className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
                            onClick={() => {
                              // แสดงข้อความว่าไม่มีรูปโปรไฟล์
                              alert('ไม่มีรูปโปรไฟล์');
                            }}
                          >
                            {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                          </div>
                        )}
                        
                        {/* Debug info - แสดงข้อมูลรูปภาพเพื่อตรวจสอบ */}
                        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-1 rounded">
                          {application.profileImage ? `รูป: ${application.profileImage}` : 'ไม่มีรูป'}
                        </div>
                        <div className="absolute -bottom-12 left-0 text-xs text-blue-500 bg-white px-1 rounded">
                          ID: {application.id}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center pointer-events-none">
                          <EyeIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {application.firstName} {application.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{application.appliedPosition}</p>
                        {/* แสดงสถานะรูปภาพ */}
                        {application.profileImage && (
                          <div className="flex items-center gap-1 mt-1">
                            {imageLoadStatus[`card-${application.id}`] ? (
                              <span className="text-xs text-green-600">✅ รูปภาพโหลดสำเร็จ</span>
                            ) : imageErrorStatus[`card-${application.id}`] ? (
                              <span className="text-xs text-red-600">❌ รูปภาพโหลดไม่สำเร็จ</span>
                            ) : (
                              <span className="text-xs text-gray-500">⏳ กำลังโหลดรูปภาพ...</span>
                            )}
                          </div>
                        )}
                        {/* แสดงข้อมูล debug */}
                        <div className="text-xs text-gray-400 mt-1">
                          Debug: {application.profileImage ? `มีรูป: ${application.profileImage}` : 'ไม่มีรูป'}
                        </div>
                        <div className="text-xs text-purple-400 mt-1">
                          ID: {application.id} | Source: {application.profileImage?.includes('profile_') ? 'applications.json' : 'application-forms.json'}
                        </div>
                      </div>
                    </div>
                    <Badge
                      color={getStatusColor(application.status)}
                      variant="flat"
                      className="text-xs"
                    >
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{application.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">สมัครเมื่อ: {formatDate(application.submittedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 truncate">{application.currentAddress}</span>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          color="primary"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onClick={() => handleViewDetails(application)}
                        >
                          ดูรายละเอียด
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          color="danger"
                          startContent={<TrashIcon className="w-4 h-4" />}
                          onClick={() => openDeleteConfirmation(application)}
                          className="hover:bg-red-50"
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={handleCloseDetails} 
          size="5xl"
          scrollBehavior="inside"
          classNames={{
            base: "max-h-[90vh] bg-white",
            body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  รายละเอียดใบสมัครงาน
                </h2>
                <Button
                  isIconOnly
                  variant="light"
                  onClick={handleCloseDetails}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="overflow-y-auto bg-white">
                             {selectedApplication && (
                 <ApplicationFormView 
                   application={selectedApplication} 
                   onUploadDocument={handleUploadDocument}
                   onUpdateApplication={handleUpdateApplication}
                   isEditing={isEditing}
                   onToggleEdit={handleToggleEdit}
                   onProfileImageUpdate={(newImageName: string) => {
                     // อัปเดตรูปภาพใน modal ทันที
                     setSelectedApplication(prev => prev ? { ...prev, profileImage: newImageName } : null);
                   }}
                 />
               )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Profile Image Preview Modal */}
        <Modal 
          isOpen={isPreviewOpen} 
          onClose={onPreviewClose} 
          size="2xl"
          classNames={{
            base: "bg-white",
            body: "bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  รูปถ่ายประจำตัว - {previewProfileImage?.name}
                </h2>
                <Button
                  isIconOnly
                  variant="light"
                  onClick={onPreviewClose}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="bg-white">
              {previewProfileImage && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={previewProfileImage.url}
                    alt={previewProfileImage.name}
                    className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'block';
                      }
                    }}
                  />
                  <div 
                    className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg"
                    style={{ display: 'none' }}
                  >
                    ไม่สามารถแสดงรูปภาพได้
                  </div>
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="ghost"
                      startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewProfileImage.url;
                        link.download = previewProfileImage.name;
                        link.click();
                      }}
                    >
                      ดาวน์โหลด
                    </Button>
                    <Button
                      color="secondary"
                      variant="ghost"
                      onClick={() => window.open(previewProfileImage.url, '_blank')}
                    >
                      เปิดในแท็บใหม่
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Documents View Modal */}
        <Modal
          isOpen={documentsView.isOpen}
          onClose={closeDocumentsView}
          size="4xl"
          scrollBehavior="inside"
          classNames={{
            base: "max-h-[90vh] bg-white",
            body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    เอกสารแนบ - {documentsView.application?.firstName} {documentsView.application?.lastName}
                  </h2>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onClick={closeDocumentsView}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="overflow-y-auto bg-white">
              {documentsView.application && documentsView.application.documents && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">ข้อมูลผู้สมัคร</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">ชื่อ:</span>
                        <span className="ml-2 text-gray-600">
                          {documentsView.application.firstName} {documentsView.application.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">ตำแหน่ง:</span>
                        <span className="ml-2 text-gray-600">{documentsView.application.appliedPosition}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">อีเมล:</span>
                        <span className="ml-2 text-gray-600">{documentsView.application.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">เบอร์โทร:</span>
                        <span className="ml-2 text-gray-600">{documentsView.application.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">เอกสารแนบทั้งหมด</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(documentsView.application.documents).map(([docType, fileName]) => (
                        <div key={docType} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <DocumentIcon className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-gray-700">{getDocumentDisplayName(docType)}</span>
                            </div>
                            <Badge color="success" variant="flat" size="sm">
                              มีไฟล์
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <p>ชื่อไฟล์: {fileName}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              color="primary"
                              startContent={<EyeIcon className="w-4 h-4" />}
                              onClick={() => {
                                const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
                                const fileUrl = isImage ? `/api/image?file=${fileName}` : `/api/uploads?file=${fileName}`;
                                if (isImage) {
                                  window.open(fileUrl, '_blank');
                                } else {
                                  // สำหรับ PDF ให้เปิดใน Modal preview
                                  setPreviewDocument({ url: fileUrl, name: getDocumentDisplayName(docType) });
                                  onPreviewOpen();
                                }
                              }}
                            >
                              ดูไฟล์
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              color="secondary"
                              startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                              onClick={() => {
                                const link = document.createElement('a');
                                const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
                                link.href = isImage ? `/api/image?file=${fileName}` : `/api/uploads?file=${fileName}`;
                                link.download = `${getDocumentDisplayName(docType)}.${isImage ? 'jpg' : 'pdf'}`;
                                link.click();
                              }}
                            >
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-white">
              <Button color="primary" onClick={closeDocumentsView}>
                ปิด
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Document Preview Modal */}
        <Modal 
          isOpen={isPreviewOpen} 
          onClose={onPreviewClose} 
          size="5xl"
          scrollBehavior="inside"
          classNames={{
            base: "max-h-[90vh] bg-white",
            body: "overflow-y-auto max-h-[calc(90vh-120px)] bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    ดูเอกสาร: {previewDocument?.name}
                  </h2>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onClick={onPreviewClose}
                >
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </div>
            </ModalHeader>
            <ModalBody className="overflow-y-auto bg-white">
              {previewDocument && (
                <div className="w-full h-[70vh]">
                  <iframe
                    src={previewDocument.url}
                    className="w-full h-full border-0 rounded-lg"
                    title={previewDocument.name}
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-white">
              <Button color="primary" onClick={onPreviewClose}>
                ปิด
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal 
          isOpen={deleteConfirmation.isOpen} 
          onClose={closeDeleteConfirmation} 
          size="md"
          classNames={{
            base: "bg-white",
            body: "bg-white",
            header: "bg-white",
            footer: "bg-white"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  ยืนยันการลบ
                </h2>
              </div>
            </ModalHeader>
            <ModalBody className="bg-white">
              {deleteConfirmation.application && (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white font-semibold text-xl mx-auto mb-3">
                      {deleteConfirmation.application.firstName.charAt(0)}{deleteConfirmation.application.lastName.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {deleteConfirmation.application.firstName} {deleteConfirmation.application.lastName}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      ตำแหน่ง: {deleteConfirmation.application.appliedPosition}
                    </p>
                    <p className="text-gray-600">
                      สมัครเมื่อ: {formatDate(deleteConfirmation.application.submittedAt)}
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 font-medium">
                      ⚠️ คุณแน่ใจหรือไม่ที่จะลบใบสมัครงานนี้?
                    </p>
                    <p className="text-red-600 text-sm mt-1">
                      การดำเนินการนี้ไม่สามารถยกเลิกได้ และข้อมูลทั้งหมดจะถูกลบออกจากระบบ
                    </p>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-white">
              <div className="flex gap-2 w-full">
                <Button
                  color="default"
                  variant="bordered"
                  onClick={closeDeleteConfirmation}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button
                  color="danger"
                  onClick={() => deleteConfirmation.application && handleDeleteApplication(deleteConfirmation.application)}
                  className="flex-1"
                  startContent={<TrashIcon className="w-4 h-4" />}
                >
                  ลบใบสมัครงาน
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
} 