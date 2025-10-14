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

// Import components
import FormNavigation from './components/FormNavigation';
import PersonalInfoTab from './components/PersonalInfoTab';
import EducationTab from './components/EducationTab';
import WorkExperienceTab from './components/WorkExperienceTab';
import SkillsTab from './components/SkillsTab';
import PositionTab from './components/PositionTab';
import SpecialTab from './components/SpecialTab';
import DocumentsTab from './components/DocumentsTab';

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
  multipleEmployers?: string[];
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
  staffInfo?: {
    position: string;
    department: string;
    startWork: string;
  };
}

export default function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  // State management
  const [formData, setFormData] = useState<FormData>({
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
    emergencyPhone: '',
    education: [{ level: '', institution: '', major: '', year: '', gpa: '' }],
    workExperience: [{ position: '', company: '', startDate: '', endDate: '', salary: '', reason: '' }],
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
    applicationDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedResume, setSavedResume] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Refs
  const birthDateRef = useRef<HTMLInputElement>(null);
  const workStartRefs = useRef<(HTMLInputElement | null)[]>([]);
  const workEndRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    work: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    position: useRef<HTMLDivElement>(null),
    special: useRef<HTMLDivElement>(null),
    documents: useRef<HTMLDivElement>(null)
  };

  // Navigation functions
  const handlePrevious = () => {
    const tabs = ['personal', 'education', 'work', 'skills', 'position', 'special', 'documents'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const tabs = ['personal', 'education', 'work', 'skills', 'position', 'special', 'documents'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const canGoNext = activeTab !== 'documents';
  const canGoPrevious = activeTab !== 'personal';

  // Form handlers
  const handleInputChange = (key: string, value: string | boolean | File | File[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleTextOnlyChange = (key: string, value: string) => {
    const textOnlyValue = value.replace(/[^a-zA-Zก-๙\s]/g, '');
    handleInputChange(key, textOnlyValue);
  };

  const handleNumberOnlyChange = (key: string, value: string) => {
    const numberOnlyValue = value.replace(/[^0-9]/g, '');
    handleInputChange(key, numberOnlyValue);
  };

  const handleIdNumberChange = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    if (cleanedValue.length <= 13) {
      handleInputChange('idNumber', cleanedValue);
    }
  };

  const handlePostalCodeChange = (key: string, value: string) => {
    const numberOnlyValue = value.replace(/[^0-9]/g, '');
    if (numberOnlyValue.length <= 5) {
      handleInputChange(key, numberOnlyValue);
    }
  };

  const handleCopyFromRegisteredAddress = (checked: boolean) => {
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

  // Education handlers
  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { level: '', institution: '', major: '', year: '', gpa: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  // Work experience handlers
  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((work, i) => 
        i === index ? { ...work, [field]: value } : work
      )
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { position: '', company: '', startDate: '', endDate: '', salary: '', reason: '' }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    if (formData.workExperience.length > 1) {
      setFormData(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter((_, i) => i !== index)
      }));
    }
  };

  // Previous government service handlers
  const handlePreviousGovernmentServiceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      previousGovernmentService: prev.previousGovernmentService.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addPreviousGovernmentService = () => {
    setFormData(prev => ({
      ...prev,
      previousGovernmentService: [...prev.previousGovernmentService, { position: '', department: '', reason: '', date: '' }]
    }));
  };

  const removePreviousGovernmentService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousGovernmentService: prev.previousGovernmentService.filter((_, i) => i !== index)
    }));
  };

  // Document handlers
  const handleDocumentUpload = async (file: File, documentType: string) => {
    // Implementation for document upload
};

  const handleDeleteDocument = async (documentId: string, documentType: string) => {
    // Implementation for document deletion
};

  const handleDeleteNewDocument = (documentType: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: undefined
      }
    }));
  };

  const handlePreviewFile = (file: File, fileName: string) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
  };

  // Utility functions
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH');
  };

  const parseDateFromThai = (thaiDate: string) => {
    if (!thaiDate) return '';
    // Implementation for parsing Thai date
    return thaiDate;
  };

  // Validation functions
  const hasError = (fieldName: string) => {
    return !!errors[fieldName];
  };

  const getErrorMessage = (fieldName: string) => {
    return errors[fieldName] || '';
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Form submission logic
// Add your submission logic here
    } catch (error) {
} finally {
      setIsSubmitting(false);
    }
  };

  // Close preview modal
  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ใบสมัครงาน</h1>
            <p className="text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Navigation */}
            <FormNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
            />

            {/* Tab Content */}
            {activeTab === 'personal' && (
              <PersonalInfoTab
                formData={formData}
                errors={errors}
                sectionRefs={sectionRefs}
                handleInputChange={handleInputChange}
                handleTextOnlyChange={handleTextOnlyChange}
                handleNumberOnlyChange={handleNumberOnlyChange}
                handleIdNumberChange={handleIdNumberChange}
                handlePostalCodeChange={handlePostalCodeChange}
                handleCopyFromRegisteredAddress={handleCopyFromRegisteredAddress}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
                birthDateRef={birthDateRef}
              />
            )}

            {activeTab === 'education' && (
              <EducationTab
                formData={formData}
                errors={errors}
                handleEducationChange={handleEducationChange}
                addEducation={addEducation}
                removeEducation={removeEducation}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
              />
            )}

            {activeTab === 'work' && (
              <WorkExperienceTab
                formData={formData}
                errors={errors}
                handleWorkExperienceChange={handleWorkExperienceChange}
                addWorkExperience={addWorkExperience}
                removeWorkExperience={removeWorkExperience}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
                formatDateForDisplay={formatDateForDisplay}
                parseDateFromThai={parseDateFromThai}
                workStartRefs={workStartRefs}
                workEndRefs={workEndRefs}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsTab
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
              />
            )}

            {activeTab === 'position' && (
              <PositionTab
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
              />
            )}

            {activeTab === 'special' && (
              <SpecialTab
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handlePreviousGovernmentServiceChange={handlePreviousGovernmentServiceChange}
                addPreviousGovernmentService={addPreviousGovernmentService}
                removePreviousGovernmentService={removePreviousGovernmentService}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                formData={formData}
                errors={errors}
                handleDocumentUpload={handleDocumentUpload}
                handleDeleteDocument={handleDeleteDocument}
                handleDeleteNewDocument={handleDeleteNewDocument}
                handlePreviewFile={handlePreviewFile}
                hasError={hasError}
                getErrorMessage={getErrorMessage}
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isSubmitting}
                className="px-8 py-3"
              >
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งใบสมัคร'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
