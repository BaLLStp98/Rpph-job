import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';
import { BriefcaseIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface WorkItem {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  salary: string;
  reason: string;
}

interface GovernmentServiceItem {
  position: string;
  department: string;
  reason: string;
  date: string;
  type?: string;
}

interface RegisterWorkTabProps {
  formData: { workExperience: WorkItem[]; previousGovernmentService: GovernmentServiceItem[] };
  hasError: (key: string) => boolean;
  getErrorMessage: (key: string) => string;
  handleWorkExperienceChange: (index: number, field: string, value: string) => void;
  handlePreviousGovernmentServiceChange: (index: number, field: string, value: string) => void;
  addWorkExperience: () => void;
  removeWorkExperience: (index: number) => void;
  addPreviousGovernmentService: () => void;
  removePreviousGovernmentService: (index: number) => void;
  formatDateForDisplay: (iso: string) => string;
  parseDateFromThai: (thai: string) => string;
  workStartRefs: React.MutableRefObject<(HTMLInputElement | null)[] | null>;
  workEndRefs: React.MutableRefObject<(HTMLInputElement | null)[] | null>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function RegisterWorkTab(props: RegisterWorkTabProps) {
  const {
    formData,
    hasError,
    getErrorMessage,
    handleWorkExperienceChange,
    addWorkExperience,
    removeWorkExperience,
    formatDateForDisplay,
    parseDateFromThai,
    workStartRefs,
    workEndRefs,
    handlePreviousGovernmentServiceChange,
    addPreviousGovernmentService,
    removePreviousGovernmentService,
    setFormData
  } = props;

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"></div>
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <BriefcaseIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">ประวัติการทำงาน</h2>
        </div>
      </CardHeader>
      <CardBody className="p-8">
        {/* ๑.๘ ปัจจุบันทำงานในตำแหน่ง */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">๑.๘ ปัจจุบันทำงานในตำแหน่ง</h3>
          <div className="space-y-4">
            {formData.workExperience.map((work, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-sm font-medium text-gray-700">ประสบการณ์การทำงานที่ {index + 1}</h5>
                  {formData.workExperience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ชื่อสถานที่ทำงาน<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={work.company}
                      onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                      placeholder="กรอกชื่อสถานที่ทำงาน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Company`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`workExperience${index}Company`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`workExperience${index}Company`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ตำแหน่ง<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={work.position}
                      onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                      placeholder="กรอกตำแหน่ง"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Position`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`workExperience${index}Position`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`workExperience${index}Position`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">วันที่เริ่มงาน<span className="text-red-500">*</span></label>
                    <input
                      ref={(el) => {
                        if (workStartRefs.current) {
                          workStartRefs.current[index] = el;
                        }
                      }}
                      type="text"
                      value={formatDateForDisplay(work.startDate)}
                      onChange={(e) => {
                        const isoDate = parseDateFromThai(e.target.value);
                        handleWorkExperienceChange(index, 'startDate', isoDate);
                      }}
                      placeholder="กรอกวันที่เริ่มงาน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}StartDate`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`workExperience${index}StartDate`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`workExperience${index}StartDate`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดงาน<span className="text-red-500">*</span></label>
                    <input
                      ref={(el) => {
                        if (workEndRefs.current) {
                          workEndRefs.current[index] = el;
                        }
                      }}
                      type="text"
                      value={formatDateForDisplay(work.endDate)}
                      onChange={(e) => {
                        const isoDate = parseDateFromThai(e.target.value);
                        handleWorkExperienceChange(index, 'endDate', isoDate);
                      }}
                      placeholder="กรอกวันที่สิ้นสุดงาน (หรือ 'ปัจจุบัน' ถ้ายังทำงานอยู่)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}EndDate`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`workExperience${index}EndDate`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`workExperience${index}EndDate`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">เงินเดือน<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={work.salary}
                      onChange={(e) => handleWorkExperienceChange(index, 'salary', e.target.value)}
                      placeholder="กรอกเงินเดือน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Salary`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`workExperience${index}Salary`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`workExperience${index}Salary`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">เหตุผลที่ออกจากงาน<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={work.reason}
                      onChange={(e) => handleWorkExperienceChange(index, 'reason', e.target.value)}
                      placeholder="กรอกเหตุผลที่ออกจากงาน"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`workExperience${index}Reason`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`workExperience${index}Reason`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`workExperience${index}Reason`)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {hasError('workExperience') && (
              <div className="text-xs text-red-600 mb-2">
                {getErrorMessage('workExperience')}
              </div>
            )}
            <button
              type="button"
              onClick={addWorkExperience}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              เพิ่มประสบการณ์การทำงาน
            </button>
          </div>
        </div>

        {/* ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง</h3>
          {/* Radio group: ข้าราชการ / ลูกจ้าง */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">ประเภท:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="governmentServiceType"
                    value="civilServant"
                    checked={formData.previousGovernmentService.some(service => service.type === 'civilServant')}
                    onChange={(e) => {
                      if (e.target.value === 'civilServant') {
                        setFormData((prev: any) => ({
                          ...prev,
                          previousGovernmentService: prev.previousGovernmentService.map((service: any) => ({
                            ...service,
                            type: 'civilServant'
                          }))
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">ข้าราชการ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="governmentServiceType"
                    value="employee"
                    checked={formData.previousGovernmentService.some(service => service.type === 'employee')}
                    onChange={(e) => {
                      if (e.target.value === 'employee') {
                        setFormData((prev: any) => ({
                          ...prev,
                          previousGovernmentService: prev.previousGovernmentService.map((service: any) => ({
                            ...service,
                            type: 'employee'
                          }))
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">ลูกจ้าง</span>
                </label>
              </div>
            </div>
          </div>

          {/* รายการประวัติการรับราชการ */}
          <div className="space-y-4">
            {formData.previousGovernmentService.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700">ประวัติการรับราชการที่ {index + 1}</h5>
                    {service.type && (
                      <p className="text-xs text-blue-600 mt-1">
                        ประเภท: {service.type === 'civilServant' ? 'ข้าราชการ' : 'ลูกจ้าง'}
                      </p>
                    )}
                  </div>
                  {formData.previousGovernmentService.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePreviousGovernmentService(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ตำแหน่ง<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={service.position}
                      onChange={(e) => handlePreviousGovernmentServiceChange(index, 'position', e.target.value)}
                      placeholder="กรอกตำแหน่งที่เคยรับราชการ"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Position`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`previousGovernmentService${index}Position`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`previousGovernmentService${index}Position`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">สังกัด<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={service.department}
                      onChange={(e) => handlePreviousGovernmentServiceChange(index, 'department', e.target.value)}
                      placeholder="กรอกหน่วยงานที่เคยรับราชการ"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Department`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`previousGovernmentService${index}Department`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`previousGovernmentService${index}Department`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ออกจากราชการเพราะ<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={service.reason}
                      onChange={(e) => handlePreviousGovernmentServiceChange(index, 'reason', e.target.value)}
                      placeholder="กรอกเหตุผลที่ออกจากราชการ"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Reason`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`previousGovernmentService${index}Reason`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`previousGovernmentService${index}Reason`)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">เมื่อวันที่<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={service.date}
                      onChange={(e) => handlePreviousGovernmentServiceChange(index, 'date', e.target.value)}
                      placeholder="กรอกวันที่ออกจากราชการ"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError(`previousGovernmentService${index}Date`) ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {hasError(`previousGovernmentService${index}Date`) && (
                      <div className="text-xs text-red-600">
                        {getErrorMessage(`previousGovernmentService${index}Date`)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addPreviousGovernmentService}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              เพิ่มประวัติการรับราชการ
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


