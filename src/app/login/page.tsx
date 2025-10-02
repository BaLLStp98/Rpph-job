'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button, Input, Badge } from '@heroui/react';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../contexts/UserContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ถ้าเข้าสู่ระบบแล้วให้ไปหน้า dashboard
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            เข้าสู่ระบบ
          </h1>
          <p className="text-gray-600">โรงพยาบาลราชพิพัฒน์</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">ยินดีต้อนรับ</h2>
              <p className="text-sm text-gray-600">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ใช้หรืออีเมล
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
                  startContent={<UserIcon className="w-4 h-4 text-gray-400" />}
                  className="w-full"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสผ่าน
                </label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  startContent={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  }
                  className="w-full"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                color="primary"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white h-12 text-lg font-semibold"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">บัญชีทดสอบ:</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Super Admin:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800">admin001</span>
                    <Badge color="danger" variant="flat" size="sm">superadmin</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Admin:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800">admin002</span>
                    <Badge color="primary" variant="flat" size="sm">admin</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ผู้สมัคร:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800">user001</span>
                    <Badge color="success" variant="flat" size="sm">applicant</Badge>
                  </div>
                </div>
                <div className="text-center text-gray-500 mt-2">
                  รหัสผ่าน: admin123, admin456, user123
                </div>
              </div>
            </div>

            {/* Back to Dashboard */}
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                color="primary"
                onClick={() => router.push('/dashboard')}
                className="text-sm"
              >
                ← กลับไปหน้า Dashboard
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
