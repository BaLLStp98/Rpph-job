'use client'

import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react'
import { DocumentIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

interface DocumentsSectionProps {
  uploadedDocuments: Array<{
    id: number
    documentType: string
    fileName: string
    filePath: string
    fileSize?: number
    mimeType?: string
  }>
  onDeleteDocument: (documentId: number) => void
}

export default function DocumentsSection({
  uploadedDocuments,
  onDeleteDocument
}: DocumentsSectionProps) {
  const getDocumentTypeLabel = (type: string) => {
    const labels: {[key: string]: string} = {
      'idCard': 'บัตรประจำตัวประชาชน',
      'houseRegistration': 'ทะเบียนบ้าน',
      'educationCertificate': 'ใบรับรองการศึกษา',
      'militaryCertificate': 'ใบรับรองทหาร',
      'medicalCertificate': 'ใบรับรองแพทย์',
      'drivingLicense': 'ใบขับขี่',
      'nameChangeCertificate': 'ใบเปลี่ยนชื่อ',
      'otherDocuments': 'เอกสารอื่นๆ'
    }
    return labels[type] || type
  }

  const getDocumentTypeColor = (type: string) => {
    const colors: {[key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'} = {
      'idCard': 'primary',
      'houseRegistration': 'secondary',
      'educationCertificate': 'success',
      'militaryCertificate': 'warning',
      'medicalCertificate': 'danger',
      'drivingLicense': 'primary',
      'nameChangeCertificate': 'secondary',
      'otherDocuments': 'default'
    }
    return colors[type] || 'default'
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleViewDocument = (filePath: string) => {
    window.open(`/api/image?file=${filePath}`, '_blank')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-800">เอกสารแนบ</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {uploadedDocuments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">ยังไม่มีเอกสารแนบ</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <DocumentIcon className="w-8 h-8 text-gray-400 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {doc.fileName}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Chip
                          size="sm"
                          color={getDocumentTypeColor(doc.documentType)}
                          variant="flat"
                        >
                          {getDocumentTypeLabel(doc.documentType)}
                        </Chip>
                        {doc.fileSize && (
                          <span className="text-xs text-gray-500">
                            {formatFileSize(doc.fileSize)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      variant="light"
                      onClick={() => handleViewDocument(doc.filePath)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onClick={() => onDeleteDocument(doc.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
