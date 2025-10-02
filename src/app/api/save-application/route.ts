import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    if (!applicationData) {
      return NextResponse.json(
        { error: 'No application data provided' },
        { status: 400 }
      );
    }

    // สร้างโฟลเดอร์ data ถ้ายังไม่มี
    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });

    const filePath = join(dataDir, 'application-forms.json');
    
    let applications = [];
    
    try {
      // อ่านไฟล์ที่มีอยู่
      const existingData = await readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(existingData);
      applications = parsedData.applications || [];
    } catch (error) {
      // ถ้าไฟล์ไม่มี ให้สร้างใหม่
      applications = [];
    }

    // เพิ่มข้อมูลใหม่
    applications.push(applicationData);

    // บันทึกไฟล์
    const jsonData = JSON.stringify({ applications }, null, 2);
    await writeFile(filePath, jsonData, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Application saved successfully',
      applicationId: applicationData.id
    });
  } catch (error) {
    console.error('Error saving application:', error);
    return NextResponse.json(
      { error: 'Failed to save application' },
      { status: 500 }
    );
  }
}
