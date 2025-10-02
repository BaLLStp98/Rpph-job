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

// ฟังก์ชันสำหรับอ่านข้อมูล applications จากไฟล์
const readApplications = () => {
  try {
    const dataDir = ensureDataDir();
    const filePath = path.join(dataDir, 'application-forms.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(data);
      return { applications: parsedData.applications || [] };
    }
    return { applications: [] };
  } catch (error) {
    console.error('Error reading applications:', error);
    return { applications: [] };
  }
};

// ฟังก์ชันสำหรับเขียนข้อมูล applications ลงไฟล์
const writeApplications = (data: any) => {
  try {
    const dataDir = ensureDataDir();
    const filePath = path.join(dataDir, 'application-forms.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing applications:', error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // สร้าง object สำหรับเก็บข้อมูล
    const applicationData: any = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      // ข้อมูลส่วนตัว
      prefix: formData.get('prefix') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      idNumber: formData.get('idNumber') as string,
      idCardIssuedAt: formData.get('idCardIssuedAt') as string,
      idCardIssueDate: formData.get('idCardIssueDate') as string,
      idCardExpiryDate: formData.get('idCardExpiryDate') as string,
      birthDate: formData.get('birthDate') as string,
      age: formData.get('age') as string,
      gender: formData.get('gender') as string,
      nationality: formData.get('nationality') as string,
      religion: formData.get('religion') as string,
      maritalStatus: formData.get('maritalStatus') as string,
      addressAccordingToHouseRegistration: formData.get('addressAccordingToHouseRegistration') as string,
      currentAddress: formData.get('currentAddress') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      emergencyPhone: formData.get('emergencyPhone') as string,
      
      // ข้อมูลการศึกษา
      education: JSON.parse(formData.get('education') as string || '[]'),
      
      // ข้อมูลประสบการณ์การทำงาน
      workExperience: JSON.parse(formData.get('workExperience') as string || '[]'),
      
      // ข้อมูลทักษะและความสามารถ
      skills: formData.get('skills') as string,
      languages: formData.get('languages') as string,
      computerSkills: formData.get('computerSkills') as string,
      certificates: formData.get('certificates') as string,
      references: formData.get('references') as string,
      
      // ข้อมูลตำแหน่งที่สมัคร
      appliedPosition: formData.get('appliedPosition') as string,
      expectedSalary: formData.get('expectedSalary') as string,
      availableDate: formData.get('availableDate') as string,
      currentWork: formData.get('currentWork') === 'true',
      
      // ข้อมูลไฟล์
      documents: {},
      profileImage: null
    };

    // จัดการไฟล์รูปโปรไฟล์
    const profileImage = formData.get('profileImage') as File;
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `profile_${Date.now()}.png`;
      const imageDir = path.join(process.cwd(), 'public', 'image');
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      const filePath = path.join(imageDir, fileName);
      fs.writeFileSync(filePath, buffer);
      applicationData.profileImage = fileName;
    }

    // จัดการไฟล์เอกสาร
    const documentTypes = [
      'idCard',
      'houseRegistration', 
      'militaryCertificate',
      'educationCertificate',
      'medicalCertificate',
      'drivingLicense',
      'nameChangeCertificate'
    ];

    for (const docType of documentTypes) {
      const file = formData.get(docType) as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${docType}_${Date.now()}_${file.name}`;
        const dataDir = ensureDataDir();
        const uploadsDir = path.join(dataDir, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        applicationData.documents[docType] = fileName;
      }
    }

    // อ่านข้อมูลเดิมและเพิ่มข้อมูลใหม่
    const existingData = readApplications();
    existingData.applications.push(applicationData);
    
    // บันทึกลงไฟล์
    writeApplications(existingData);

    return NextResponse.json({ 
      success: true, 
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      applicationId: applicationData.id
    });

  } catch (error) {
    console.error('Error saving application form:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = readApplications();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading applications:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอ่านข้อมูล' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const applicationId = url.searchParams.get('id');
    
    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID ของใบสมัครงาน' },
        { status: 400 }
      );
    }

    // อ่านข้อมูลเดิม
    const existingData = readApplications();
    
    // หา index ของ application ที่ต้องการลบ
    const applicationIndex = existingData.applications.findIndex((app: any) => app.id === applicationId);
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบใบสมัครงานที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // ลบ application ออกจาก array
    existingData.applications.splice(applicationIndex, 1);
    
    // บันทึกข้อมูลที่อัปเดตแล้ว
    writeApplications(existingData);

    return NextResponse.json({ 
      success: true, 
      message: 'ลบใบสมัครงานเรียบร้อยแล้ว' 
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
} 