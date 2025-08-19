'use client';

import { useSession } from 'next-auth/react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ข้อมูล Session และ Line ID</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">สถานะ Session</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <strong>Status:</strong> {status}
              </div>
              
              {session && (
                <div>
                  <strong>Session Data:</strong>
                  <pre className="bg-gray-50 p-4 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              )}
              
              {session?.user && (
                <div className="space-y-2">
                  <div><strong>User ID (Line ID):</strong> {session.user.id}</div>
                  <div><strong>Email:</strong> {session.user.email}</div>
                  <div><strong>Name:</strong> {session.user.name}</div>
                  <div><strong>Image:</strong> {session.user.image}</div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">ทดสอบ API Profile</h2>
          </CardHeader>
          <CardBody>
            <Button 
              color="primary"
              onClick={async () => {
                if (session?.user?.id) {
                  try {
                    const response = await fetch(`/api/profile?lineId=${encodeURIComponent(session.user.id)}`);
                    const data = await response.json();
                    console.log('API Response:', data);
                    alert(`API Response: ${JSON.stringify(data, null, 2)}`);
                  } catch (error) {
                    console.error('Error:', error);
                    alert(`Error: ${error}`);
                  }
                } else {
                  alert('No Line ID in session');
                }
              }}
            >
              ทดสอบ API Profile
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
