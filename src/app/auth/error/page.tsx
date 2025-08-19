'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardBody, CardHeader, Button } from '@heroui/react'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'มีปัญหาในการตั้งค่าระบบ'
      case 'AccessDenied':
        return 'การเข้าถึงถูกปฏิเสธ'
      case 'Verification':
        return 'การยืนยันล้มเหลว'
      default:
        return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-600">{getErrorMessage(error)}</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button
            color="primary"
            variant="solid"
            fullWidth
            onClick={() => window.location.href = '/auth/signin'}
          >
            ลองใหม่
          </Button>
          <Button
            color="default"
            variant="bordered"
            fullWidth
            onClick={() => window.location.href = '/'}
          >
            กลับหน้าหลัก
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
