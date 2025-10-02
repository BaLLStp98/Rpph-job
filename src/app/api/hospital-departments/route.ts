import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const readHospitalDepartments = () => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'hospital-departments.json');
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    
    return { hospitalDepartments: [] };
  } catch (error) {
    console.error('Error reading hospital departments:', error);
    return { hospitalDepartments: [] };
  }
};

export async function GET() {
  try {
    const data = readHospitalDepartments();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hospital departments:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหน่วยงาน' },
      { status: 500 }
    );
  }
}