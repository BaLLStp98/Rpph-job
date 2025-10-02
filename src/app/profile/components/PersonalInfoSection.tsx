'use client'

import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button } from '@heroui/react'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PersonalInfoSectionProps {
  profileData: any
  editing: boolean
  errors: {[key: string]: string}
  hospitalDepartments: Array<{id: string, name: string}>
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onChange: (field: string, value: string | boolean) => void
  getInputClassName: (hasError: boolean) => string
}

export default function PersonalInfoSection({
  profileData,
  editing,
  errors,
  hospitalDepartments,
  onEdit,
  onSave,
  onCancel,
  onChange,
  getInputClassName
}: PersonalInfoSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">ข้อมูลส่วนตัว</h3>
        {!editing ? (
          <Button
            color="primary"
            variant="light"
            startContent={<PencilIcon className="w-4 h-4" />}
            onClick={onEdit}
          >
            แก้ไข
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              color="success"
              variant="solid"
              startContent={<CheckIcon className="w-4 h-4" />}
              onClick={onSave}
            >
              บันทึก
            </Button>
            <Button
              color="danger"
              variant="light"
              startContent={<XMarkIcon className="w-4 h-4" />}
              onClick={onCancel}
            >
              ยกเลิก
            </Button>
          </div>
        )}
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* คำนำหน้า */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              คำนำหน้า *
            </label>
            <Select
              value={profileData?.prefix || ''}
              onChange={(e) => onChange('prefix', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.prefix)}
              placeholder="เลือกคำนำหน้า"
            >
              <SelectItem key="นาย" value="นาย">นาย</SelectItem>
              <SelectItem key="นาง" value="นาง">นาง</SelectItem>
              <SelectItem key="นางสาว" value="นางสาว">นางสาว</SelectItem>
              <SelectItem key="เด็กชาย" value="เด็กชาย">เด็กชาย</SelectItem>
              <SelectItem key="เด็กหญิง" value="เด็กหญิง">เด็กหญิง</SelectItem>
            </Select>
            {errors.prefix && <p className="text-red-500 text-sm mt-1">{errors.prefix}</p>}
          </div>

          {/* ชื่อ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ *
            </label>
            <Input
              type="text"
              value={profileData?.firstName || ''}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[0-9]/g, '')
                onChange('firstName', onlyLetters)
              }}
              isDisabled={!editing}
              className={getInputClassName(!!errors.firstName)}
              placeholder="กรอกชื่อ"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* นามสกุล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              นามสกุล *
            </label>
            <Input
              type="text"
              value={profileData?.lastName || ''}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[0-9]/g, '')
                onChange('lastName', onlyLetters)
              }}
              isDisabled={!editing}
              className={getInputClassName(!!errors.lastName)}
              placeholder="กรอกนามสกุล"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* อีเมล */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              อีเมล *
            </label>
            <Input
              type="email"
              value={profileData?.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.email)}
              placeholder="กรอกอีเมล"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์ *
            </label>
            <Input
              type="tel"
              value={profileData?.phone || ''}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, '')
                if (onlyNumbers.length <= 10) {
                  onChange('phone', onlyNumbers)
                }
              }}
              isDisabled={!editing}
              className={getInputClassName(!!errors.phone)}
              placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
              maxLength={10}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* เพศ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เพศ *
            </label>
            <Select
              value={profileData?.gender || ''}
              onChange={(e) => onChange('gender', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.gender)}
              placeholder="เลือกเพศ"
            >
              <SelectItem key="ชาย" value="ชาย">ชาย</SelectItem>
              <SelectItem key="หญิง" value="หญิง">หญิง</SelectItem>
            </Select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          {/* วันเกิด */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วันเกิด *
            </label>
            <Input
              type="date"
              value={profileData?.birthDate || ''}
              onChange={(e) => onChange('birthDate', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.birthDate)}
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
          </div>

          {/* สัญชาติ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สัญชาติ *
            </label>
            <Input
              type="text"
              value={profileData?.nationality || ''}
              onChange={(e) => onChange('nationality', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.nationality)}
              placeholder="กรอกสัญชาติ"
            />
            {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
          </div>

          {/* ศาสนา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ศาสนา *
            </label>
            <Input
              type="text"
              value={profileData?.religion || ''}
              onChange={(e) => onChange('religion', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.religion)}
              placeholder="กรอกศาสนา"
            />
            {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion}</p>}
          </div>

          {/* สถานภาพ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานภาพ *
            </label>
            <Select
              value={profileData?.maritalStatus || ''}
              onChange={(e) => onChange('maritalStatus', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.maritalStatus)}
              placeholder="เลือกสถานภาพ"
            >
              <SelectItem key="โสด" value="โสด">โสด</SelectItem>
              <SelectItem key="สมรส" value="สมรส">สมรส</SelectItem>
              <SelectItem key="หย่าร้าง" value="หย่าร้าง">หย่าร้าง</SelectItem>
              <SelectItem key="หม้าย" value="หม้าย">หม้าย</SelectItem>
            </Select>
            {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
          </div>

          {/* หน่วยงาน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หน่วยงาน
            </label>
            <Select
              value={profileData?.hospitalDepartment || ''}
              onChange={(e) => onChange('hospitalDepartment', e.target.value)}
              isDisabled={!editing}
              className={getInputClassName(!!errors.hospitalDepartment)}
              placeholder="เลือกหน่วยงาน"
            >
              {hospitalDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </Select>
            {errors.hospitalDepartment && <p className="text-red-500 text-sm mt-1">{errors.hospitalDepartment}</p>}
          </div>

          {/* เจ้าหน้าที่โรงพยาบาล */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isHospitalStaff"
              checked={profileData?.isHospitalStaff || false}
              onChange={(e) => onChange('isHospitalStaff', e.target.checked)}
              disabled={!editing}
              className="rounded"
            />
            <label htmlFor="isHospitalStaff" className="text-sm font-medium text-gray-700">
              เป็นเจ้าหน้าที่โรงพยาบาล
            </label>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
