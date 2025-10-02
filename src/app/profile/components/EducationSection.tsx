'use client'

import { Card, CardBody, CardHeader, Input, Button } from '@heroui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface EducationSectionProps {
  profileData: any
  editing: boolean
  errors: {[key: string]: string}
  onAddEducation: () => void
  onRemoveEducation: (index: number) => void
  onEducationChange: (index: number, field: string, value: string) => void
  getInputClassName: (hasError: boolean) => string
}

export default function EducationSection({
  profileData,
  editing,
  errors,
  onAddEducation,
  onRemoveEducation,
  onEducationChange,
  getInputClassName
}: EducationSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">ประวัติการศึกษา</h3>
        {editing && (
          <Button
            color="primary"
            variant="light"
            startContent={<PlusIcon className="w-4 h-4" />}
            onClick={onAddEducation}
            isDisabled={profileData?.educationList?.length >= 5}
          >
            เพิ่มการศึกษา
          </Button>
        )}
      </CardHeader>
      <CardBody className="space-y-4">
        {profileData?.educationList?.length === 0 && (
          <p className="text-gray-500 text-center py-4">ยังไม่มีข้อมูลการศึกษา</p>
        )}
        
        {profileData?.educationList?.map((edu: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-700">
                ข้อมูลการศึกษาที่ {index + 1}
                {index === 0 && (
                  <span className="text-red-600 font-semibold text-base ml-2">(ล่าสุด)</span>
                )}
              </h4>
              {editing && (
                <Button
                  color="danger"
                  variant="light"
                  isIconOnly
                  onClick={() => onRemoveEducation(index)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ระดับการศึกษา *
                </label>
                <Input
                  type="text"
                  value={edu.level || ''}
                  onChange={(e) => onEducationChange(index, 'level', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`education_${index}_level`])}
                  placeholder="เช่น ปริญญาตรี, ปริญญาโท"
                />
                {errors[`education_${index}_level`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_level`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สถาบันการศึกษา *
                </label>
                <Input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`education_${index}_institution`])}
                  placeholder="ชื่อสถาบันการศึกษา"
                />
                {errors[`education_${index}_institution`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_institution`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สาขา/วิชาเอก
                </label>
                <Input
                  type="text"
                  value={edu.major || ''}
                  onChange={(e) => onEducationChange(index, 'major', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`education_${index}_major`])}
                  placeholder="สาขาวิชาที่เรียน"
                />
                {errors[`education_${index}_major`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_major`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ปีที่จบการศึกษา
                </label>
                <Input
                  type="number"
                  value={edu.graduationYear || ''}
                  onChange={(e) => onEducationChange(index, 'graduationYear', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`education_${index}_graduationYear`])}
                  placeholder="ปี พ.ศ."
                  min="2500"
                  max="2600"
                />
                {errors[`education_${index}_graduationYear`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_graduationYear`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เกรดเฉลี่ย
                </label>
                <Input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    // อนุญาตเฉพาะตัวเลขและจุดทศนิยม 2 ตำแหน่ง
                    if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) <= 4.00) {
                      onEducationChange(index, 'gpa', value)
                    }
                  }}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`education_${index}_gpa`])}
                  placeholder="0.00-4.00"
                />
                {errors[`education_${index}_gpa`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_gpa`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {profileData?.educationList?.length >= 5 && (
          <p className="text-orange-500 text-sm text-center">
            เพิ่มได้สูงสุด 5 รายการ
          </p>
        )}
      </CardBody>
    </Card>
  )
}
