import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple file-based storage for demonstration
const DATA_FILE = path.join(process.cwd(), 'data', 'register.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read applications from file
const readApplications = () => {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // register.json contains array directly, not wrapped in applications property
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading applications:', error);
    return [];
  }
};

// Write applications to file
const writeApplications = (applications: any[]) => {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2));
  } catch (error) {
    console.error('Error writing applications:', error);
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId');
    const email = searchParams.get('email');

    console.log('API Profile - Received lineId:', lineId, 'email:', email);

    if (!lineId && !email) {
      console.log('API Profile - No lineId or email provided');
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ Line ID หรือ Email' },
        { status: 400 }
      );
    }

    // อ่านข้อมูลจากไฟล์ JSON
    const applications = readApplications();
    console.log('API Profile - Total applications found:', applications.length);
    console.log('API Profile - All lineIds:', applications.map((app: any) => app.lineId));
    
    // ค้นหาข้อมูลตาม lineId ก่อน หากไม่พบลองค้นจากอีเมล
    let application = lineId ? applications.find((app: any) => app.lineId === lineId) : undefined;
    if (!application && email) {
      application = applications.find((app: any) => app.email === email);
      console.log('API Profile - Found by email:', application ? 'Yes' : 'No');
      // ถ้าพบจากอีเมลและมี lineId ที่ส่งมา ให้ผูก lineId กลับเข้า record
      if (application && lineId && !application.lineId) {
        application.lineId = lineId;
        try {
          writeApplications(applications);
          console.log('API Profile - Attached lineId to existing application');
        } catch (e) {
          console.error('API Profile - Failed to attach lineId:', e);
        }
      }
    }
    console.log('API Profile - Found application:', application ? 'Yes' : 'No');

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลใบสมัครงาน' },
        { status: 404 }
      );
    }

    // จัดรูปแบบข้อมูลให้ตรงกับที่ frontend ต้องการ
    const profileData = {
      id: application.id,
      prefix: application.prefix,
      firstName: application.firstName,
      lastName: application.lastName,
      lineDisplayName: application.lineDisplayName,
      email: application.email,
      phone: application.phone,
      gender: application.gender,
      birthDate: application.birthDate,
      nationality: application.nationality,
      religion: application.religion,
      maritalStatus: application.maritalStatus,
      address: application.address,
      province: application.province,
      district: application.district,
      subDistrict: application.subDistrict,
      postalCode: application.postalCode,
      emergencyContact: application.emergencyContact,
      emergencyPhone: application.emergencyPhone,
      isHospitalStaff: application.isHospitalStaff,
      hospitalDepartment: application.hospitalDepartment,
      username: application.username,
      password: application.password,
      profileImageUrl: application.profileImageUrl,
      educationList: application.educationList,
      workList: application.workList,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      status: application.status
    };

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('API Profile Update - Received data:', body);

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID ของข้อมูล' },
        { status: 400 }
      );
    }

    // อ่านข้อมูลจากไฟล์ JSON
    const applications = readApplications();
    
    // หาข้อมูลที่ต้องการอัปเดต
    const applicationIndex = applications.findIndex((app: any) => app.id === body.id);
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }

    // อัปเดตข้อมูล
    applications[applicationIndex] = {
      ...applications[applicationIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    // บันทึกข้อมูลลงไฟล์
    writeApplications(applications);

    console.log('API Profile Update - Successfully updated application:', body.id);

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  }
} 