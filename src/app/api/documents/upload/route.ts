import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personalInfoId = formData.get('personalInfoId') as string;
    const documentType = formData.get('documentType') as string;
    const file = formData.get('file') as File;

    if (!personalInfoId || !documentType || !file) {
      return NextResponse.json(
        { success: false, message: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: 'รองรับเฉพาะไฟล์ PDF เท่านั้น' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ต้องไม่เกิน 10MB' },
        { status: 400 }
      );
    }

    // สร้างโฟลเดอร์สำหรับเก็บไฟล์
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    await mkdir(uploadDir, { recursive: true });

    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const timestamp = Date.now();
    const fileName = `${personalInfoId}_${documentType}_${timestamp}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    // แปลงไฟล์เป็น Buffer และบันทึก
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // บันทึกข้อมูลลงฐานข้อมูล
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mydata'
    });

    await connection.execute(
      `INSERT INTO application_documents 
       (personal_info_id, document_type, file_name, file_path, file_size) 
       VALUES (?, ?, ?, ?, ?)`,
      [personalInfoId, documentType, fileName, `/uploads/documents/${fileName}`, file.size]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดเอกสารเรียบร้อยแล้ว',
      data: {
        fileName,
        filePath: `/uploads/documents/${fileName}`,
        fileSize: file.size
      }
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดเอกสาร' },
      { status: 500 }
    );
  }
} 