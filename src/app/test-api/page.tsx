'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async (lineId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profile?lineId=${encodeURIComponent(lineId)}`);
      const data = await response.json();
      setResult({
        status: response.status,
        data: data
      });
    } catch (error) {
      setResult({
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ทดสอบ API Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">ทดสอบ Line ID ที่มีข้อมูล</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Button 
                onClick={() => testApi('U1234567890abcdef1234567890abcdef')}
                disabled={loading}
                color="primary"
              >
                ทดสอบ U1234567890abcdef1234567890abcdef
              </Button>
              <Button 
                onClick={() => testApi('Uabcdef1234567890abcdef1234567890')}
                disabled={loading}
                color="secondary"
              >
                ทดสอบ Uabcdef1234567890abcdef1234567890
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">ทดสอบ Line ID ที่ไม่มีข้อมูล</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Button 
                onClick={() => testApi('Utest1234567890abcdef1234567890')}
                disabled={loading}
                color="warning"
              >
                ทดสอบ Utest1234567890abcdef1234567890
              </Button>
            </CardBody>
          </Card>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">ผลลัพธ์</h2>
            </CardHeader>
            <CardBody>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
