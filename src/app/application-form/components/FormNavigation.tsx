'use client';

import React from 'react';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface FormNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export default function FormNavigation({
  activeTab,
  setActiveTab,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious
}: FormNavigationProps) {
  const tabs = [
    { id: 'personal', label: 'ข้อมูลส่วนตัว', icon: UserIcon },
    { id: 'education', label: 'การศึกษา', icon: AcademicCapIcon },
    { id: 'work', label: 'ประสบการณ์', icon: BriefcaseIcon },
    { id: 'skills', label: 'ทักษะ', icon: DocumentTextIcon },
    { id: 'position', label: 'ตำแหน่ง', icon: DocumentTextIcon },
    { id: 'special', label: 'ข้อมูลพิเศษ', icon: DocumentTextIcon },
    { id: 'documents', label: 'เอกสาร', icon: DocumentTextIcon }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            canGoPrevious
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeftIcon className="w-4 h-4" />
          ก่อนหน้า
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            canGoNext
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          ถัดไป
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
