'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardBody, Button, Spinner, Chip } from '@heroui/react'

export default function CheckProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasApplicationData, setHasApplicationData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'checking' | 'login-required' | 'checking-data' | 'redirecting'>('checking')

  useEffect(() => {
    const checkStatus = async () => {
      if (status === 'loading') {
        setStep('checking')
        return
      }

      if (status === 'unauthenticated') {
        // ยังไม่ login ให้ไปหน้า Sign In
        setStep('login-required')
        setLoading(false)
        return
      }

      if (status === 'authenticated' && session) {
        // login แล้ว ให้ตรวจสอบข้อมูล application
        setStep('checking-data')
        setLoading(true)
        
        try {
          // ใช้ Line ID จาก session เพื่อตรวจสอบข้อมูล
          const lineId = session.user?.id;
          console.log('Check Profile - Line ID from session:', lineId);

          if (!lineId) {
            console.log('Check Profile - No Line ID in session');
            setLoading(false);
            setStep('login-required');
            return;
          }

          const email = session.user?.email ?? ''
          const response = await fetch(`/api/profile?lineId=${encodeURIComponent(lineId)}${email ? `&email=${encodeURIComponent(email)}` : ''}`);
          console.log('Check Profile - API response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Check Profile - API response data:', data);

            if (data.success && data.data) {
              console.log('Check Profile - Found application data, redirect to dashboard');
              setHasApplicationData(true);
              setStep('redirecting');
              router.replace('/dashboard');
              return;
            }
          } else if (response.status === 404) {
            console.log('Check Profile - No application data (404)');
          } else {
            console.log('Check Profile - API response not ok:', response.status);
          }

          // ไม่มีข้อมูล ให้ไป register
          setHasApplicationData(false);
          setStep('redirecting');
          setLoading(false);
          router.replace('/register');
        } catch (error) {
          console.error('Error checking application data:', error);
          setLoading(false);
          setStep('redirecting');
          router.replace('/register');
        }
      }
    }
    checkStatus()
  }, [session, status, hasApplicationData, router])

  // กำลังตรวจสอบสถานะ login
  if (step === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <Spinner 
                size="lg"
                color="primary"
                labelColor="primary"
                label="กำลังตรวจสอบ..."
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              กำลังตรวจสอบสถานะการเข้าสู่ระบบ
            </h2>
            <p className="text-gray-600">
              กรุณารอสักครู่...
            </p>
          </CardBody>
        </Card>
      </div>
    )
  }

  // ต้อง login ก่อน
  if (step === 'login-required') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ต้องเข้าสู่ระบบก่อน
            </h2>
            <p className="text-gray-600 mb-6">
              กรุณาเข้าสู่ระบบด้วย Line เพื่อดำเนินการต่อ
            </p>
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/auth/signin')}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              เข้าสู่ระบบด้วย Line
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  // กำลังตรวจสอบข้อมูล application
  if (step === 'checking-data') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <Spinner 
                size="lg"
                color="primary"
                labelColor="primary"
                label="กำลังตรวจสอบข้อมูล..."
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              กำลังตรวจสอบข้อมูลการสมัครงาน
            </h2>
            <p className="text-gray-600">
              กรุณารอสักครู่...
            </p>
          </CardBody>
        </Card>
      </div>
    )
  }

  // กำลัง redirect
  if (step === 'redirecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="flex justify-center mb-4">
              <Spinner 
                size="lg"
                color="success"
                labelColor="success"
                label="กำลังนำทาง..."
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {hasApplicationData ? 'พบข้อมูลการสมัครงาน' : 'ไม่พบข้อมูลการสมัครงาน'}
            </h2>
            <p className="text-gray-600">
              {hasApplicationData 
                ? 'กำลังนำทางไปหน้า Dashboard...' 
                : 'กำลังนำทางไปหน้า Register...'
              }
            </p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return null
} 