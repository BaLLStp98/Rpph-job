'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface SpecialTabProps {
  formData: {
    previousGovernmentService: Array<{
      position: string;
      department: string;
      reason: string;
      date: string;
      type?: string;
    }>;
    spouseInfo?: {
      firstName: string;
      lastName: string;
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
  };
  errors: { [key: string]: string };
  handleInputChange: (key: string, value: string | boolean) => void;
  handlePreviousGovernmentServiceChange: (index: number, field: string, value: string) => void;
  addPreviousGovernmentService: () => void;
  removePreviousGovernmentService: (index: number) => void;
  hasError: (fieldName: string) => boolean;
  getErrorMessage: (fieldName: string) => string;
}

export default function SpecialTab({
  formData,
  errors,
  handleInputChange,
  handlePreviousGovernmentServiceChange,
  addPreviousGovernmentService,
  removePreviousGovernmentService,
  hasError,
  getErrorMessage
}: SpecialTabProps) {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">ข้อมูลพิเศษ</h2>
        </div>
      </CardHeader>
      <CardBody className="p-8">
        <div className="space-y-8">
          {/* ประวัติการทำงานราชการ */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">ประวัติการทำงานราชการ</h3>
            <div className="space-y-4">
              {formData.previousGovernmentService.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-700">ประวัติราชการที่ {index + 1}</h5>
                    {formData.previousGovernmentService.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePreviousGovernmentService(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                      <input
                        type="text"
                        value={service.position}
                        onChange={(e) => handlePreviousGovernmentServiceChange(index, 'position', e.target.value)}
                        placeholder="กรอกตำแหน่ง"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">หน่วยงาน</label>
                      <input
                        type="text"
                        value={service.department}
                        onChange={(e) => handlePreviousGovernmentServiceChange(index, 'department', e.target.value)}
                        placeholder="กรอกหน่วยงาน"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">เหตุผลที่ออก</label>
                      <input
                        type="text"
                        value={service.reason}
                        onChange={(e) => handlePreviousGovernmentServiceChange(index, 'reason', e.target.value)}
                        placeholder="กรอกเหตุผลที่ออก"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">วันที่ออก</label>
                      <input
                        type="text"
                        value={service.date}
                        onChange={(e) => handlePreviousGovernmentServiceChange(index, 'date', e.target.value)}
                        placeholder="กรอกวันที่ออก"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPreviousGovernmentService}
                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                เพิ่มประวัติราชการ
              </button>
            </div>
          </div>

          {/* ข้อมูลคู่สมรส */}
          {formData.spouseInfo && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลคู่สมรส</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ชื่อคู่สมรส</label>
                  <input
                    type="text"
                    value={formData.spouseInfo.firstName}
                    onChange={(e) => handleInputChange('spouseInfo', { ...formData.spouseInfo, firstName: e.target.value })}
                    placeholder="กรอกชื่อคู่สมรส"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">นามสกุลคู่สมรส</label>
                  <input
                    type="text"
                    value={formData.spouseInfo.lastName}
                    onChange={(e) => handleInputChange('spouseInfo', { ...formData.spouseInfo, lastName: e.target.value })}
                    placeholder="กรอกนามสกุลคู่สมรส"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ข้อมูลสิทธิการรักษา */}
          {formData.medicalRights && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลสิทธิการรักษา</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.medicalRights.hasUniversalHealthcare}
                    onChange={(e) => handleInputChange('medicalRights', { ...formData.medicalRights, hasUniversalHealthcare: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">มีสิทธิประกันสุขภาพถ้วนหน้า</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.medicalRights.hasSocialSecurity}
                    onChange={(e) => handleInputChange('medicalRights', { ...formData.medicalRights, hasSocialSecurity: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">มีสิทธิประกันสังคม</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.medicalRights.hasCivilServantRights}
                    onChange={(e) => handleInputChange('medicalRights', { ...formData.medicalRights, hasCivilServantRights: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">มีสิทธิข้าราชการ</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
