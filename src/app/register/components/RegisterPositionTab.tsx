import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface RegisterPositionTabProps {
  formData: { appliedPosition: string; expectedSalary: string; availableDate: string };
  errors: Record<string, string>;
  availableDateRef: React.RefObject<HTMLInputElement | null>;
  handleTextOnlyChange: (key: string, value: string) => void;
  handleInputChange: (key: string, value: string) => void;
}

export default function RegisterPositionTab(props: RegisterPositionTabProps) {
  const { formData, errors, availableDateRef, handleTextOnlyChange, handleInputChange } = props;

  return (
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
                onChange={(e) => handleTextOnlyChange('appliedPosition', e.target.value)}
                placeholder="กรอกตำแหน่งที่สมัคร (เฉพาะตัวอักษร)"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.appliedPosition ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.appliedPosition && (
                <p className="text-red-500 text-xs mt-1">{errors.appliedPosition}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">เงินเดือนที่คาดหวัง (บาท)<span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.expectedSalary}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                placeholder="กรอกเงินเดือนที่คาดหวัง เช่น 30000"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.expectedSalary ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                min="0"
                step="1000"
              />
              {errors.expectedSalary && (
                <p className="text-red-500 text-xs mt-1">{errors.expectedSalary}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">วันที่พร้อมเริ่มงาน<span className="text-red-500">*</span></label>
              <input
                ref={availableDateRef}
                type="text"
                value={formData.availableDate}
                onChange={(e) => handleInputChange('availableDate', e.target.value)}
                placeholder="คลิกเพื่อเลือกวันที่พร้อมเริ่มงาน"
                readOnly
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer ${
                  errors.availableDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                style={{ backgroundColor: '#f9fafb' }}
              />
              {errors.availableDate && (
                <p className="text-red-500 text-xs mt-1">{errors.availableDate}</p>
              )}
              <p className="text-xs text-gray-500">คลิกที่ช่องเพื่อเลือกวันที่</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


