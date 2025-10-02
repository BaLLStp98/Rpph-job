'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { ArrowLeftIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface ContactForm {
  name: string
  email: string
  phone: string
  contactType: string
  message: string
}

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    contactType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactTypes = [
    { key: 'general', label: 'สอบถามทั่วไป' },
    { key: 'job', label: 'สอบถามเกี่ยวกับการสมัครงาน' },
    { key: 'technical', label: 'ปัญหาทางเทคนิค' },
    { key: 'complaint', label: 'ข้อร้องเรียน' },
    { key: 'suggestion', label: 'ข้อเสนอแนะ' }
  ]

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // ส่งข้อมูลติดต่อ
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด')
        setFormData({
          name: '',
          email: '',
          phone: '',
          contactType: '',
          message: ''
        })
      } else {
        alert('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <PhoneIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ติดต่อเรา
                </h1>
                <p className="text-gray-600">สอบถามข้อมูลหรือติดต่อโรงพยาบาลราชพิพัฒน์</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="ghost"
                startContent={<ArrowLeftIcon className="w-5 h-5" />}
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              >
                กลับไปหน้า Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form - Left Side */}
          <div className="lg:col-span-2">
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  className="w-full"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                  className="w-full"
                  required
                />
              </div>

              {/* Contact Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทการติดต่อ <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="เลือกประเภทการติดต่อ"
                  value={formData.contactType}
                  onChange={(value) => handleInputChange('contactType', value)}
                  className="w-full"
                  required
                >
                  {contactTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ข้อความ <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="เขียนข้อความ"
                  className="w-full"
                  rows={6}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Information - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-lg h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">โรงพยาบาลราชพิพัฒน์</h2>
              
              {/* Address */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  เลขที่ 18 ถนนพุทธมณฑลสาย 3 ซอย 10<br />
                  แขวงบางไผ่ เขตบางแค<br />
                  กทม. 10160
                </p>
              </div>

              {/* Line Official ID */}
              <div className="mb-6">
                <p className="text-gray-700">
                  <span className="font-medium">Line Official ID:</span> @1rpp
                </p>
              </div>

              {/* Phone Numbers */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium text-gray-700">โทรศัพท์:</span>
                </div>
                <div className="ml-7 space-y-1">
                  <p className="text-gray-700">02 421 2222</p>
                  <p className="text-gray-700">02 444 0138</p>
                  <p className="text-gray-700">02 444 0163</p>
                </div>
              </div>

              {/* Map Link */}
              <div className="mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a 
                    href="https://maps.google.com/?q=โรงพยาบาลราชพิพัฒน์" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    ดูแผนที่
                  </a>
                </div>
              </div>

              {/* Email */}
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">อีเมล:</span><br />
                  <a 
                    href="mailto:saraban.msd.rpphosp@bangkok.go.th"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    saraban.msd.rpphosp@bangkok.go.th
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
