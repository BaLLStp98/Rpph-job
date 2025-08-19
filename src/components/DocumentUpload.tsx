'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Select,
  SelectItem,
  Progress,
  Chip
} from '@heroui/react';
import { 
  DocumentArrowUpIcon,
  DocumentIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: number;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface DocumentUploadProps {
  personalInfoId: number;
  gender?: string;
}

const DOCUMENT_TYPES = {
  idCard: 'สำเนาบัตรประชาชน',
  houseRegistration: 'สำเนาทะเบียนบ้าน',
  militaryCertificate: 'สำเนาหลักฐานทางทหาร (เฉพาะเพศชาย)',
  educationCertificate: 'สำเนาหลักฐานการศึกษา (ใบสุทธิ/ประกาศนียบัตร)',
  medicalCertificate: 'ใบรับรองแพทย์ (ไม่เกิน 1 เดือน)',
  drivingLicense: 'ใบอนุญาตขับรถ (ถ้ามี)',
  nameChangeCertificate: 'สำเนาหลักฐานการเปลี่ยนชื่อ (ถ้ามี)'
};

const REQUIRED_DOCUMENTS = [
  'idCard',
  'houseRegistration',
  'educationCertificate',
  'medicalCertificate'
];

const GENDER_SPECIFIC_DOCUMENTS = {
  male: ['militaryCertificate'],
  female: []
};

export default function DocumentUpload({ personalInfoId, gender }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ดึงรายการเอกสารที่มีอยู่
  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?personalInfoId=${personalInfoId}`);
      const result = await response.json();
      
      if (result.success) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // โหลดเอกสารเมื่อคอมโพเนนต์โหลด
  React.useEffect(() => {
    fetchDocuments();
  }, [personalInfoId]);

  // ตรวจสอบเอกสารที่จำเป็น
  const getRequiredDocuments = () => {
    const required = [...REQUIRED_DOCUMENTS];
    
    if (gender === 'ชาย') {
      required.push(...GENDER_SPECIFIC_DOCUMENTS.male);
    }
    
    return required;
  };

  const getUploadedDocumentTypes = () => {
    return documents.map(doc => doc.documentType);
  };

  const getMissingDocuments = () => {
    const required = getRequiredDocuments();
    const uploaded = getUploadedDocumentTypes();
    return required.filter(docType => !uploaded.includes(docType));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!selectedDocumentType) {
      setError('กรุณาเลือกประเภทเอกสาร');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('รองรับเฉพาะไฟล์ PDF เท่านั้น');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('personalInfoId', personalInfoId.toString());
      formData.append('documentType', selectedDocumentType);
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // รีเฟรชรายการเอกสาร
        await fetchDocuments();
        setSelectedDocumentType('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setUploadProgress(100);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('เกิดข้อผิดพลาดในการอัปโหลดเอกสาร');
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('คุณต้องการลบเอกสารนี้หรือไม่?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/delete?documentId=${documentId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await fetchDocuments();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('เกิดข้อผิดพลาดในการลบเอกสาร');
    }
  };

  const handleViewDocument = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'อนุมัติ';
      case 'rejected':
        return 'ไม่อนุมัติ';
      default:
        return 'รอตรวจสอบ';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const missingDocuments = getMissingDocuments();

  return (
    <div className="space-y-6">
      {/* สรุปเอกสารที่จำเป็น */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-6 h-6" />
            <h2 className="text-xl font-semibold">เอกสารหลักฐานการสมัครงาน</h2>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">เอกสารที่จำเป็น:</h3>
              <ul className="space-y-1 text-sm">
                {getRequiredDocuments().map((docType) => {
                  const isUploaded = documents.some(doc => doc.documentType === docType);
                  return (
                    <li key={docType} className="flex items-center gap-2">
                      {isUploaded ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XMarkIcon className="w-4 h-4 text-red-500" />
                      )}
                      <span className={isUploaded ? 'text-green-600' : 'text-red-600'}>
                        {DOCUMENT_TYPES[docType as keyof typeof DOCUMENT_TYPES]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">สถานะ:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>เอกสารที่อัปโหลดแล้ว:</span>
                  <span className="font-semibold text-green-600">
                    {documents.length} / {getRequiredDocuments().length}
                  </span>
                </div>
                {missingDocuments.length > 0 && (
                  <div className="text-red-600 text-sm">
                    ยังขาด: {missingDocuments.length} เอกสาร
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* อัปโหลดเอกสารใหม่ */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <DocumentArrowUpIcon className="w-6 h-6" />
            <h2 className="text-xl font-semibold">อัปโหลดเอกสารใหม่</h2>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-4">
            <Select
              label="ประเภทเอกสาร"
              placeholder="เลือกประเภทเอกสาร"
              selectedKeys={selectedDocumentType ? [selectedDocumentType] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setSelectedDocumentType(value);
              }}
              isDisabled={isLoading}
            >
              {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </Select>

            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading}
              />
              
              <Button
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedDocumentType || isLoading}
                startContent={<DocumentArrowUpIcon className="w-4 h-4" />}
              >
                เลือกไฟล์ PDF
              </Button>
              
              {selectedDocumentType && (
                <span className="text-sm text-gray-600">
                  {DOCUMENT_TYPES[selectedDocumentType as keyof typeof DOCUMENT_TYPES]}
                </span>
              )}
            </div>

            {isLoading && (
              <Progress
                value={uploadProgress}
                color="primary"
                className="w-full"
                showValueLabel={true}
              />
            )}

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>• รองรับเฉพาะไฟล์ PDF เท่านั้น</p>
              <p>• ขนาดไฟล์ต้องไม่เกิน 10MB</p>
              <p>• เอกสารจะถูกตรวจสอบโดยเจ้าหน้าที่</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* รายการเอกสารที่อัปโหลดแล้ว */}
      {documents.length > 0 && (
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center gap-3">
              <DocumentIcon className="w-6 h-6" />
              <h2 className="text-xl font-semibold">เอกสารที่อัปโหลดแล้ว</h2>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <DocumentIcon className="w-8 h-8 text-blue-500" />
                    
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {DOCUMENT_TYPES[doc.documentType as keyof typeof DOCUMENT_TYPES]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {doc.fileName} • {formatFileSize(doc.fileSize)}
                      </p>
                      <p className="text-xs text-gray-500">
                        อัปโหลดเมื่อ: {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Chip
                      color={getStatusColor(doc.status)}
                      variant="flat"
                      size="sm"
                    >
                      {getStatusText(doc.status)}
                    </Chip>
                    
                    <Button
                      isIconOnly
                      color="primary"
                      variant="light"
                      size="sm"
                      onClick={() => handleViewDocument(doc.filePath)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
} 