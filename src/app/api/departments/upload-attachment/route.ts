import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const departmentId = formData.get('departmentId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์ที่อัปโหลด' },
        { status: 400 }
      );
    }

    if (!departmentId) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรหัสแผนก' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์เกิน 10MB' },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'ประเภทไฟล์ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `dept_${departmentId}_${timestamp}.${fileExtension}`;

    // สร้างโฟลเดอร์สำหรับเก็บไฟล์
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'departments');
    await mkdir(uploadDir, { recursive: true });

    // บันทึกไฟล์
    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // บันทึกข้อมูลไฟล์ลงฐานข้อมูล
    const attachment = await prisma.departmentAttachment.create({
      data: {
        departmentId: departmentId,
        path: `/uploads/departments/${fileName}`,
        filename: fileName,
        originalName: file.name
      }
    });

    console.log('✅ Department attachment uploaded:', {
      departmentId,
      fileName,
      fileSize: file.size,
      mimeType: file.type
    });

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดไฟล์สำเร็จ',
      data: {
        id: attachment.id,
        fileName: attachment.originalName || fileName,
        filePath: `/uploads/departments/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        createdAt: attachment.createdAt
      }
    });

  } catch (error) {
    console.error('Error uploading department attachment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    if (!departmentId) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรหัสแผนก' },
        { status: 400 }
      );
    }

    const attachments = await prisma.departmentAttachment.findMany({
      where: {
        departmentId: departmentId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: attachments
    });

  } catch (error) {
    console.error('Error fetching department attachments:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์แนบ',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('attachmentId');

    if (!attachmentId) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบรหัสไฟล์แนบ' },
        { status: 400 }
      );
    }

    // ดึงข้อมูลไฟล์แนบ
    const attachment = await prisma.departmentAttachment.findUnique({
      where: {
        id: parseInt(attachmentId)
      }
    });

    if (!attachment) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์แนบ' },
        { status: 404 }
      );
    }

    // ลบไฟล์จากระบบไฟล์
    try {
      const fs = require('fs');
      const fullPath = path.join(process.cwd(), 'public', attachment.path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (fileError) {
      console.warn('Could not delete file from filesystem:', fileError);
    }

    // ลบข้อมูลจากฐานข้อมูล
    await prisma.departmentAttachment.delete({
      where: {
        id: parseInt(attachmentId)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'ลบไฟล์แนบสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting department attachment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการลบไฟล์แนบ',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
