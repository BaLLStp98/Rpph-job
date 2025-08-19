'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Spinner } from '@heroui/react';

export default function TestImageAPI() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testImages = [
    'profile_1755502888182.png',
    'profile_1755486654515.png',
    'profile_1755075810889.png'
  ];

  const testImageAPI = async () => {
    setLoading(true);
    setTestResults([]);

    for (const imageName of testImages) {
      try {
        console.log(`🔄 Testing image: ${imageName}`);
        
        // ทดสอบ /api/image
        const response = await fetch(`/api/image?file=${imageName}&t=${Date.now()}`);
        const result = {
          imageName,
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          timestamp: new Date().toISOString()
        };
        
        console.log(`📡 /api/image result for ${imageName}:`, result);
        setTestResults(prev => [...prev, result]);
        
        // รอสักครู่ระหว่างการทดสอบ
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Error testing ${imageName}:`, error);
        setTestResults(prev => [...prev, {
          imageName,
          status: 'ERROR',
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }]);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ทดสอบ API รูปภาพ</h1>
      
      <Button 
        color="primary" 
        onClick={testImageAPI}
        disabled={loading}
        className="mb-6"
      >
        {loading ? <Spinner size="sm" /> : 'ทดสอบ API รูปภาพ'}
      </Button>

      <div className="grid gap-4">
        {testResults.map((result, index) => (
          <Card key={index} className="shadow-md">
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{result.imageName}</h3>
                  <p className="text-sm text-gray-600">
                    Status: {result.status} | OK: {result.ok ? '✅' : '❌'}
                  </p>
                  {result.contentType && (
                    <p className="text-sm text-gray-600">Content-Type: {result.contentType}</p>
                  )}
                  {result.error && (
                    <p className="text-sm text-red-600">Error: {result.error}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.ok ? 'สำเร็จ' : 'ล้มเหลว'}
                  </span>
                </div>
              </div>
              
              {/* แสดงรูปภาพถ้า API สำเร็จ */}
              {result.ok && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">รูปภาพ:</h4>
                  <div className="flex items-center gap-4">
                    <img
                      src={`/api/image?file=${result.imageName}`}
                      alt={result.imageName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        console.error(`❌ Image display error for ${result.imageName}:`, e);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log(`✅ Image displayed successfully: ${result.imageName}`);
                      }}
                    />
                    <div className="text-sm text-gray-600">
                      <p>URL: /api/image?file={result.imageName}</p>
                      <p>ขนาด: 64x64px (แสดงในวงกลม)</p>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">สรุปผลการทดสอบ:</h3>
          <p>จำนวนรูปภาพที่ทดสอบ: {testImages.length}</p>
          <p>จำนวนที่สำเร็จ: {testResults.filter(r => r.ok).length}</p>
          <p>จำนวนที่ล้มเหลว: {testResults.filter(r => !r.ok).length}</p>
        </div>
      )}
    </div>
  );
}
