'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface DocumentsTabProps {
  formData: {
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
  };
  errors: { [key: string]: string };
  handleDocumentUpload: (file: File, documentType: string) => Promise<void>;
  handleDeleteDocument: (documentId: string, documentType: string) => Promise<void>;
  handleDeleteNewDocument: (documentType: string) => void;
  handlePreviewFile: (file: File, fileName: string) => void;
  hasError: (fieldName: string) => boolean;
  getErrorMessage: (fieldName: string) => string;
}

export default function DocumentsTab({
  formData,
  errors,
  handleDocumentUpload,
  handleDeleteDocument,
  handleDeleteNewDocument,
  handlePreviewFile,
  hasError,
  getErrorMessage
}: DocumentsTabProps) {
  const documentTypes = [
    { key: 'idCard', label: 'บัตรประชาชน', required: true },
    { key: 'houseRegistration', label: 'ทะเบียนบ้าน', required: true },
    { key: 'militaryCertificate', label: 'ใบรับรองทหาร', required: false },
    { key: 'educationCertificate', label: 'ใบรับรองการศึกษา', required: true },
    { key: 'medicalCertificate', label: 'ใบรับรองแพทย์', required: true },
    { key: 'drivingLicense', label: 'ใบขับขี่', required: false },
    { key: 'nameChangeCertificate', label: 'ใบเปลี่ยนชื่อ', required: false },
    { key: 'otherDocuments', label: 'เอกสารอื่นๆ', required: false }
  ];

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-pink-400/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">เอกสารประกอบการสมัคร</h2>
        </div>
      </CardHeader>
      <CardBody className="p-8">
        <div className="space-y-6">
          {documentTypes.map((docType) => {
            const document = formData.documents?.[docType.key as keyof typeof formData.documents];
            const isArray = Array.isArray(document);
            
            return (
              <div key={docType.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    {docType.label}
                    {docType.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {isArray ? (
                    // Handle multiple documents
                    <div className="space-y-2">
                      {document.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">
                            {typeof doc === 'object' && 'name' in doc ? doc.name : 'เอกสาร'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handlePreviewFile(doc as File, typeof doc === 'object' && 'name' in doc ? doc.name : 'เอกสาร')}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              ดู
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNewDocument(docType.key)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : document ? (
                    // Handle single document
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        {typeof document === 'object' && 'name' in document ? document.name : 'เอกสาร'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewFile(document as File, typeof document === 'object' && 'name' in document ? document.name : 'เอกสาร')}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          ดู
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNewDocument(docType.key)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  ) : null}
                  
                  <div>
                    <input
                      type="file"
                      id={`file-${docType.key}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, docType.key);
                        }
                      }}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label
                      htmlFor={`file-${docType.key}`}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                      อัปโหลด{docType.label}
                    </label>
                  </div>
                  
                  {hasError(docType.key) && (
                    <p className="text-red-500 text-xs">{getErrorMessage(docType.key)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
