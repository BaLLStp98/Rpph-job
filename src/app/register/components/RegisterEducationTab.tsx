import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { AcademicCapIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface EducationItem {
  level: string;
  institution: string;
  major: string;
  year: string;
  gpa: string;
}

interface RegisterEducationTabProps {
  formData: { education: EducationItem[] };
  hasError: (key: string) => boolean;
  getErrorMessage: (key: string) => string;
  handleEducationChange: (index: number, field: string, value: string) => void;
  handleGpaChange: (value: string) => string;
  handleYearChange: (value: string) => string;
  addEducation: () => void;
  removeEducation: (index: number) => void;
}

export default function RegisterEducationTab(props: RegisterEducationTabProps) {
  const {
    formData,
    hasError,
    getErrorMessage,
    handleEducationChange,
    handleGpaChange,
    handleYearChange,
    addEducation,
    removeEducation
  } = props;

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">ประวัติการศึกษา</h2>
        </div>
      </CardHeader>
      <CardBody className="p-8">
        {/* ๑.๗ ประวัติการศึกษา */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">ประวัติการศึกษา</h3>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-sm font-medium text-gray-700">ข้อมูลการศึกษาที่ {index + 1}</h5>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">วุฒิการศึกษา<span className="text-red-500">*</span></label>
                    <select
                      value={edu.level}
                      onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Level`) ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">เลือกวุฒิการศึกษา</option>
                      <option value="ประถมศึกษา">ประถมศึกษา</option>
                      <option value="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</option>
                      <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                      <option value="ประกาศนียบัตรวิชาชีพ (ปวช.)">ประกาศนียบัตรวิชาชีพ (ปวช.)</option>
                      <option value="ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)">ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)</option>
                      <option value="ปริญญาตรี">ปริญญาตรี</option>
                      <option value="ปริญญาโท">ปริญญาโท</option>
                      <option value="ปริญญาเอก">ปริญญาเอก</option>
                    </select>
                    {hasError(`education${index}Level`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`education${index}Level`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">สาขา/วิชาเอก<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                      placeholder="กรอกสาขา/วิชาเอก"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Major`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`education${index}Major`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`education${index}Major`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">จากสถานศึกษา<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      placeholder="กรอกชื่อสถานศึกษา"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Institution`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`education${index}Institution`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`education${index}Institution`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ปีที่จบ<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, 'year', handleYearChange(e.target.value))}
                      placeholder="กรอกปีที่จบ (4 หลัก)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Year`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <div className="flex justify-between items-center">
                      {hasError(`education${index}Year`) && (
                        <div className="text-xs text-red-600">
                          {getErrorMessage(`education${index}Year`)}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {edu.year.length}/4 หลัก
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">เกรดเฉลี่ย<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(index, 'gpa', handleGpaChange(e.target.value))}
                      placeholder="กรอกเกรดเฉลี่ย (ทศนิยม 2 ตำแหน่ง)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`education${index}Gpa`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`education${index}Gpa`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`education${index}Gpa`)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {hasError('education') && (
              <div className="text-xs text-red-600 mb-2">
                {getErrorMessage('education')}
              </div>
            )}
            <button
              type="button"
              onClick={addEducation}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              เพิ่มข้อมูลการศึกษา
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


