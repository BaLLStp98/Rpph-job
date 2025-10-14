'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface SkillsTabProps {
  formData: {
    skills: string;
    languages: string;
    computerSkills: string;
    certificates: string;
    references: string;
  };
  errors: { [key: string]: string };
  handleInputChange: (key: string, value: string) => void;
  hasError: (fieldName: string) => boolean;
  getErrorMessage: (fieldName: string) => string;
}

export default function SkillsTab({
  formData,
  errors,
  handleInputChange,
  hasError,
  getErrorMessage
}: SkillsTabProps) {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">ทักษะและความสามารถ</h2>
        </div>
      </CardHeader>
      <CardBody className="p-8">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">ทักษะและความสามารถพิเศษ<span className="text-red-500">*</span></label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="กรอกทักษะและความสามารถพิเศษ"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                hasError('skills') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {hasError('skills') && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage('skills')}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">ภาษาที่ใช้ได้<span className="text-red-500">*</span></label>
            <textarea
              name="languages"
              value={formData.languages}
              onChange={(e) => handleInputChange('languages', e.target.value)}
              placeholder="กรอกภาษาที่ใช้ได้"
              rows={3}
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

          <div>
            <label className="text-sm font-medium text-gray-700">ทักษะด้านคอมพิวเตอร์<span className="text-red-500">*</span></label>
            <textarea
              name="computerSkills"
              value={formData.computerSkills}
              onChange={(e) => handleInputChange('computerSkills', e.target.value)}
              placeholder="กรอกทักษะด้านคอมพิวเตอร์"
              rows={3}
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

          <div>
            <label className="text-sm font-medium text-gray-700">ใบรับรอง/ประกาศนียบัตร</label>
            <textarea
              name="certificates"
              value={formData.certificates}
              onChange={(e) => handleInputChange('certificates', e.target.value)}
              placeholder="กรอกใบรับรอง/ประกาศนียบัตร"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                hasError('certificates') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {hasError('certificates') && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage('certificates')}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">บุคคลอ้างอิง</label>
            <textarea
              name="references"
              value={formData.references}
              onChange={(e) => handleInputChange('references', e.target.value)}
              placeholder="กรอกข้อมูลบุคคลอ้างอิง"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                hasError('references') 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {hasError('references') && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage('references')}</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
