'use client';

import React, { useState } from 'react';
import { Card, CardBody, Button, Spinner } from '@heroui/react';

export default function TestRegisterAPI() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testRegisterAPI = async () => {
    setLoading(true);
    setError('');
    setData(null);

    try {
      console.log('🔄 Testing /api/register...');
      const response = await fetch('/api/register');
      
      console.log('📡 /api/register response:', response.status, response.ok);
      
      if (response.ok) {
        const result = await response.json();
        console.log('📋 /api/register data:', result);
        setData(result);
      } else {
        const errorData = await response.json();
        console.error('❌ /api/register error:', errorData);
        setError(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error('❌ Error testing /api/register:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ทดสอบ API /api/register</h1>
      
      <Button 
        color="primary" 
        onClick={testRegisterAPI}
        disabled={loading}
        className="mb-6"
      >
        {loading ? <Spinner size="sm" /> : 'ทดสอบ /api/register'}
      </Button>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardBody>
            <h3 className="text-red-800 font-semibold mb-2">ข้อผิดพลาด:</h3>
            <p className="text-red-700">{error}</p>
          </CardBody>
        </Card>
      )}

      {data && (
        <Card className="shadow-md">
          <CardBody>
            <h3 className="font-semibold mb-4">ข้อมูลจาก /api/register:</h3>
            
            <div className="space-y-4">
              {Array.isArray(data) ? (
                data.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">รายการที่ {index + 1}:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>ชื่อ:</strong> {item.firstName} {item.lastName}</p>
                        <p><strong>Email:</strong> {item.email}</p>
                        <p><strong>Phone:</strong> {item.phone}</p>
                        <p><strong>Line ID:</strong> {item.lineId}</p>
                      </div>
                      <div>
                        <p><strong>Profile Image URL:</strong> {item.profileImageUrl || 'ไม่มี'}</p>
                        <p><strong>Profile Image:</strong> {item.profileImage || 'ไม่มี'}</p>
                        <p><strong>Status:</strong> {item.status}</p>
                        <p><strong>Created At:</strong> {item.createdAt}</p>
                      </div>
                    </div>
                    
                    {/* แสดงรูปภาพถ้ามี */}
                    {item.profileImageUrl && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">รูปภาพโปรไฟล์:</h5>
                        <div className="flex items-center gap-4">
                          <img
                            src={`/api/image?file=${item.profileImageUrl}`}
                            alt={`${item.firstName} ${item.lastName}`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              console.error(`❌ Image display error for ${item.profileImageUrl}:`, e);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log(`✅ Image displayed successfully: ${item.profileImageUrl}`);
                            }}
                          />
                          <div className="text-sm text-gray-600">
                            <p>URL: /api/image?file={item.profileImageUrl}</p>
                            <p>ขนาด: 64x64px (แสดงในวงกลม)</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p><strong>ข้อมูล:</strong> {JSON.stringify(data, null, 2)}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">ข้อมูลการทดสอบ:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• API endpoint: /api/register</li>
          <li>• ข้อมูลที่คาดหวัง: applications.json</li>
          <li>• ตรวจสอบ Console (F12) เพื่อดู logs</li>
          <li>• ตรวจสอบ profileImageUrl ในข้อมูล</li>
        </ul>
      </div>
    </div>
  );
}

