import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ตรวจสอบว่าเป็นรูปภาพ
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // สร้างโฟลเดอร์ public/image ถ้ายังไม่มี
    const imageDir = path.join(process.cwd(), 'public', 'image');
    try {
      await mkdir(imageDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `profile_${timestamp}${fileExtension}`;
    const filePath = path.join(imageDir, fileName);

    // แปลงไฟล์เป็น Buffer และบันทึก
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // อัปเดตข้อมูลใน application-forms.json
    const fs = require('fs');
    const applicationsPath = path.join(process.cwd(), 'data', 'application-forms.json');
    
    if (fs.existsSync(applicationsPath)) {
      const applicationsData = JSON.parse(fs.readFileSync(applicationsPath, 'utf8'));
      
      // ตรวจสอบว่า applicationsData มีโครงสร้างที่ถูกต้อง
      if (!applicationsData || !applicationsData.applications || !Array.isArray(applicationsData.applications)) {
        console.error('Invalid applications data structure:', applicationsData);
        return NextResponse.json({ error: 'Invalid data structure' }, { status: 500 });
      }
      
      // รับ applicationId จาก formData
      const applicationId = formData.get('applicationId') as string;
      
      if (applicationId) {
        // หา application ตาม ID และอัปเดต profileImage
        const applicationIndex = applicationsData.applications.findIndex((app: any) => app.id === applicationId);
        if (applicationIndex !== -1) {
          applicationsData.applications[applicationIndex].profileImage = fileName;
          applicationsData.applications[applicationIndex].updatedAt = new Date().toISOString();
        } else {
          console.error('Application not found with ID:', applicationId);
          return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }
      } else {
        // ถ้าไม่มี ID ให้อัปเดต application ล่าสุด
        if (applicationsData.applications.length > 0) {
          const latestApplication = applicationsData.applications[applicationsData.applications.length - 1];
          latestApplication.profileImage = fileName;
          latestApplication.updatedAt = new Date().toISOString();
        }
      }
      
      fs.writeFileSync(applicationsPath, JSON.stringify(applicationsData, null, 2));
    }

    return NextResponse.json({ 
      success: true, 
      fileName: fileName,
      message: 'Profile image uploaded successfully' 
    });

  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json({ error: 'Failed to upload profile image' }, { status: 500 });
  }
} 