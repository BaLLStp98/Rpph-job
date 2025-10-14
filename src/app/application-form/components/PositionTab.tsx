'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface PositionTabProps {
  formData: {
    appliedPosition: string;
    department: string;
    expectedSalary: string;
    availableDate: string;
    currentWork: boolean;
  };
  errors: { [key: string]: string };
  handleInputChange: (key: string, value: string | boolean) => void;
  hasError: (fieldName: string) => boolean;
  getErrorMessage: (fieldName: string) => string;
}

export default function PositionTab({
  formData,
  errors,
  handleInputChange,
  hasError,
  getErrorMessage
}: PositionTabProps) {
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">ตำแหน่งที่สมัคร<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="appliedPosition"
                value={formData.appliedPosition}
                onChange={(e) => handleInputChange('appliedPosition', e.target.value)}
                placeholder="กรอกตำแหน่งที่สมัคร"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('appliedPosition') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('appliedPosition') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('appliedPosition')}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">สังกัด<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="กรอกสังกัด"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('department') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('department') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('department')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">เงินเดือนที่คาดหวัง<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                placeholder="กรอกเงินเดือนที่คาดหวัง"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('expectedSalary') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('expectedSalary') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('expectedSalary')}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">วันที่สามารถเริ่มงานได้<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="availableDate"
                value={formData.availableDate}
                onChange={(e) => handleInputChange('availableDate', e.target.value)}
                placeholder="กรอกวันที่สามารถเริ่มงานได้"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError('availableDate') 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {hasError('availableDate') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('availableDate')}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="currentWork"
                checked={formData.currentWork}
                onChange={(e) => handleInputChange('currentWork', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">ปัจจุบันทำงานอยู่</span>
            </label>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
