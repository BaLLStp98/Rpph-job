'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button, Card, CardBody, CardHeader } from '@heroui/react'

export default function TestAuthPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">กำลังโหลด...</h2>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-800">ทดสอบ NextAuth</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">สถานะการเข้าสู่ระบบ:</h3>
                <p className="text-gray-600">
                  {status === 'authenticated' ? '✅ เข้าสู่ระบบแล้ว' : '❌ ยังไม่ได้เข้าสู่ระบบ'}
                </p>
              </div>

              {session ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">ข้อมูล Session:</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-2">ยังไม่มี Session</h3>
                  <p className="text-gray-600">กรุณาเข้าสู่ระบบด้วย Line</p>
                </div>
              )}

              <div className="flex space-x-4">
                {session ? (
                  <Button 
                    color="danger" 
                    onClick={() => signOut()}
                  >
                    ออกจากระบบ
                  </Button>
                ) : (
                  <Button 
                    color="primary" 
                    onClick={() => signIn('line')}
                  >
                    เข้าสู่ระบบด้วย Line
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = '/dashboard'}
                >
                  กลับไปหน้า Dashboard
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">ข้อมูล Environment Variables</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Line OAuth:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>LINE_CLIENT_ID: {process.env.NEXT_PUBLIC_LINE_CLIENT_ID ? '✅ มี' : '❌ ไม่มี'}</li>
                  <li>LINE_CLIENT_SECRET: {process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET ? '✅ มี' : '❌ ไม่มี'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">NextAuth:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL ? '✅ มี' : '❌ ไม่มี'}</li>
                  <li>NEXTAUTH_SECRET: {process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ? '✅ มี' : '❌ ไม่มี'}</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
