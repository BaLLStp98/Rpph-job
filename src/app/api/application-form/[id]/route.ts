import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedApplication = await request.json();

    // อ่านข้อมูลจากไฟล์ JSON
    const dataPath = path.join(process.cwd(), 'data', 'application-forms.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // หาและอัพเดทข้อมูล
    const applicationIndex = data.applications.findIndex((app: any) => app.id === id);
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลใบสมัครงาน' },
        { status: 404 }
      );
    }

    // อัพเดทข้อมูล
    data.applications[applicationIndex] = {
      ...data.applications[applicationIndex],
      ...updatedApplication,
      updatedAt: new Date().toISOString()
    };

    // บันทึกข้อมูลลงไฟล์
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      message: 'อัพเดทข้อมูลสำเร็จ',
      application: data.applications[applicationIndex]
    });

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // อ่านข้อมูลจากไฟล์ JSON
    const dataPath = path.join(process.cwd(), 'data', 'application-forms.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // หาข้อมูลตาม ID
    const application = data.applications.find((app: any) => app.id === id);
    
    if (!application) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลใบสมัครงาน' },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });

  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // อ่านข้อมูลจากไฟล์ JSON
    const dataPath = path.join(process.cwd(), 'data', 'application-forms.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // หาข้อมูลตาม ID
    const applicationIndex = data.applications.findIndex((app: any) => app.id === id);
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลใบสมัครงาน' },
        { status: 404 }
      );
    }

    // ลบข้อมูล
    data.applications.splice(applicationIndex, 1);

    // บันทึกข้อมูลลงไฟล์
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      message: 'ลบข้อมูลสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
} 

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const dataPath = path.join(process.cwd(), 'data', 'application-forms.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);

    const index = data.applications.findIndex((app: any) => app.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลใบสมัครงาน' },
        { status: 404 }
      );
    }

    // อัปเดตเฉพาะฟิลด์ที่ส่งมา พร้อม timestamp
    data.applications[index] = {
      ...data.applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      message: 'อัปเดตข้อมูลสำเร็จ',
      application: data.applications[index],
    });
  } catch (error) {
    console.error('Error patching application:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  }
}