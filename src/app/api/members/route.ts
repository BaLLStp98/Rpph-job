import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ฟังก์ชันสำหรับสร้างโฟลเดอร์ data ถ้ายังไม่มี
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return dataDir;
};

// ฟังก์ชันสำหรับอ่านข้อมูล register จากไฟล์
const readRegister = () => {
  try {
    const dataDir = ensureDataDir();
    const filePath = path.join(dataDir, 'register.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const registerData = JSON.parse(data);
      // register.json contains array directly
      return Array.isArray(registerData) ? registerData : [];
    }
    return [];
  } catch (error) {
    console.error('Error reading register:', error);
    return [];
  }
};

export async function GET() {
  try {
    const registerData = readRegister();
    
    // แปลงข้อมูลจาก register.json เป็นรูปแบบ Member
    const membersData = registerData.map((app: any) => ({
      id: app.id,
      firstName: app.firstName,
      lastName: app.lastName,
      username: app.username || '',
      password: app.password || '',
      lineId: app.lineId,
      department: app.hospitalDepartment || '',
      role: app.isHospitalStaff ? 'เจ้าหน้าที่โรงพยาบาล' : 'ผู้สมัครงาน',
      status: app.status === 'pending' ? 'รอดำเนินการ' : app.status === 'approved' ? 'ใช้งานปกติ' : 'ไม่ใช้งาน',
      lastLogin: app.updatedAt || app.createdAt,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));
    
    return NextResponse.json({ members: membersData });
  } catch (error) {
    console.error('Error reading register:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอ่านข้อมูล' },
      { status: 500 }
    );
  }
}
