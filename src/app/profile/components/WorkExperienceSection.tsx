'use client'

import { Card, CardBody, CardHeader, Input, Button } from '@heroui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface WorkExperienceSectionProps {
  profileData: any
  editing: boolean
  errors: {[key: string]: string}
  onAddWork: () => void
  onRemoveWork: (index: number) => void
  onWorkChange: (index: number, field: string, value: string | boolean) => void
  getInputClassName: (hasError: boolean) => string
}

export default function WorkExperienceSection({
  profileData,
  editing,
  errors,
  onAddWork,
  onRemoveWork,
  onWorkChange,
  getInputClassName
}: WorkExperienceSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">ประสบการณ์การทำงาน</h3>
        {editing && (
          <Button
            color="primary"
            variant="light"
            startContent={<PlusIcon className="w-4 h-4" />}
            onClick={onAddWork}
            isDisabled={profileData?.workList?.length >= 5}
          >
            เพิ่มประสบการณ์
          </Button>
        )}
      </CardHeader>
      <CardBody className="space-y-4">
        {profileData?.workList?.length === 0 && (
          <p className="text-gray-500 text-center py-4">ยังไม่มีข้อมูลประสบการณ์การทำงาน</p>
        )}
        
        {profileData?.workList?.map((work: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-700">
                ประสบการณ์การทำงานที่ {index + 1}
                {index === 0 && (
                  <span className="text-red-600 font-semibold text-base ml-2">(ล่าสุด)</span>
                )}
              </h4>
              {editing && (
                <Button
                  color="danger"
                  variant="light"
                  isIconOnly
                  onClick={() => onRemoveWork(index)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ตำแหน่ง *
                </label>
                <Input
                  type="text"
                  value={work.position || ''}
                  onChange={(e) => onWorkChange(index, 'position', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_position`])}
                  placeholder="ตำแหน่งงาน"
                />
                {errors[`work_${index}_position`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_position`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อสถานที่ทำงาน *
                </label>
                <Input
                  type="text"
                  value={work.company || ''}
                  onChange={(e) => onWorkChange(index, 'company', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_company`])}
                  placeholder="ชื่อบริษัท/องค์กร"
                />
                {errors[`work_${index}_company`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_company`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อำเภอ/เขต
                </label>
                <Input
                  type="text"
                  value={work.district || ''}
                  onChange={(e) => onWorkChange(index, 'district', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_district`])}
                  placeholder="อำเภอ/เขต"
                />
                {errors[`work_${index}_district`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_district`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จังหวัด
                </label>
                <Input
                  type="text"
                  value={work.province || ''}
                  onChange={(e) => onWorkChange(index, 'province', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_province`])}
                  placeholder="จังหวัด"
                />
                {errors[`work_${index}_province`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_province`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่เริ่มงาน
                </label>
                <Input
                  type="date"
                  value={work.startDate || ''}
                  onChange={(e) => onWorkChange(index, 'startDate', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_startDate`])}
                />
                {errors[`work_${index}_startDate`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_startDate`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่สิ้นสุดงาน
                </label>
                <Input
                  type="date"
                  value={work.endDate || ''}
                  onChange={(e) => onWorkChange(index, 'endDate', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_endDate`])}
                />
                {errors[`work_${index}_endDate`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_endDate`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เงินเดือน
                </label>
                <Input
                  type="text"
                  value={work.salary || ''}
                  onChange={(e) => onWorkChange(index, 'salary', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_salary`])}
                  placeholder="จำนวนเงินเดือน"
                />
                {errors[`work_${index}_salary`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_salary`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เหตุผลที่ออก
                </label>
                <Input
                  type="text"
                  value={work.reason || ''}
                  onChange={(e) => onWorkChange(index, 'reason', e.target.value)}
                  isDisabled={!editing}
                  className={getInputClassName(!!errors[`work_${index}_reason`])}
                  placeholder="เหตุผลที่ออกจากงาน"
                />
                {errors[`work_${index}_reason`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`work_${index}_reason`]}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`work_${index}_current`}
                  checked={work.current || false}
                  onChange={(e) => onWorkChange(index, 'current', e.target.checked)}
                  disabled={!editing}
                  className="rounded"
                />
                <label htmlFor={`work_${index}_current`} className="text-sm font-medium text-gray-700">
                  ทำงานอยู่ปัจจุบัน
                </label>
              </div>
            </div>
          </div>
        ))}
        
        {profileData?.workList?.length >= 5 && (
          <p className="text-orange-500 text-sm text-center">
            เพิ่มได้สูงสุด 5 รายการ
          </p>
        )}
      </CardBody>
    </Card>
  )
}
