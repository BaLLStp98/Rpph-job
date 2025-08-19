'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';

export default function TestDataPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/register');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ข้อมูลที่บันทึกทั้งหมด</h1>
          <Button 
            onClick={fetchApplications}
            disabled={loading}
            color="primary"
          >
            รีเฟรชข้อมูล
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardBody>
              <p className="text-center">กำลังโหลดข้อมูล...</p>
            </CardBody>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500">ไม่มีข้อมูลที่บันทึก</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((app, index) => (
              <Card key={app.id}>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    ข้อมูลที่ {index + 1} - {app.firstName} {app.lastName}
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">ข้อมูลพื้นฐาน</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>ID:</strong> {app.id}</p>
                        <p><strong>Line ID:</strong> {app.lineId}</p>
                        <p><strong>ชื่อ:</strong> {app.prefix} {app.firstName} {app.lastName}</p>
                        <p><strong>Email:</strong> {app.email}</p>
                        <p><strong>เบอร์โทร:</strong> {app.phone}</p>
                        <p><strong>เพศ:</strong> {app.gender}</p>
                        <p><strong>วันเกิด:</strong> {app.birthDate}</p>
                        <p><strong>สัญชาติ:</strong> {app.nationality}</p>
                        <p><strong>ศาสนา:</strong> {app.religion}</p>
                        <p><strong>สถานภาพ:</strong> {app.maritalStatus}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">ที่อยู่</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>ที่อยู่:</strong> {app.address}</p>
                        <p><strong>จังหวัด:</strong> {app.province}</p>
                        <p><strong>อำเภอ:</strong> {app.district}</p>
                        <p><strong>ตำบล:</strong> {app.subDistrict}</p>
                        <p><strong>รหัสไปรษณีย์:</strong> {app.postalCode}</p>
                        <p><strong>ผู้ติดต่อฉุกเฉิน:</strong> {app.emergencyContact}</p>
                        <p><strong>เบอร์ฉุกเฉิน:</strong> {app.emergencyPhone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">การศึกษา</h3>
                    <div className="space-y-2">
                      {app.educationList?.map((edu: any, eduIndex: number) => (
                        <div key={eduIndex} className="bg-gray-50 p-3 rounded">
                          <p><strong>ระดับ:</strong> {edu.level}</p>
                          <p><strong>โรงเรียน:</strong> {edu.school}</p>
                          <p><strong>สาขา:</strong> {edu.major}</p>
                          <p><strong>ปีที่เริ่ม:</strong> {edu.startYear}</p>
                          <p><strong>ปีที่จบ:</strong> {edu.endYear}</p>
                          <p><strong>GPA:</strong> {edu.gpa}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">ประสบการณ์การทำงาน</h3>
                    <div className="space-y-2">
                      {app.workList?.map((work: any, workIndex: number) => (
                        <div key={workIndex} className="bg-gray-50 p-3 rounded">
                          <p><strong>ตำแหน่ง:</strong> {work.position}</p>
                          <p><strong>บริษัท:</strong> {work.company}</p>
                          <p><strong>วันที่เริ่ม:</strong> {work.startDate}</p>
                          <p><strong>วันที่สิ้นสุด:</strong> {work.endDate}</p>
                          <p><strong>ทำงานอยู่ปัจจุบัน:</strong> {work.isCurrent ? 'ใช่' : 'ไม่'}</p>
                          <p><strong>เงินเดือน:</strong> {work.salary}</p>
                          <p><strong>รายละเอียด:</strong> {work.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    <p><strong>วันที่สร้าง:</strong> {app.createdAt}</p>
                    <p><strong>สถานะ:</strong> {app.status}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
