import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeDepositId = searchParams.get('resumeDepositId');

    console.log('🔍 API Resume Documents - resumeDepositId:', resumeDepositId);

    if (!resumeDepositId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ resumeDepositId' },
        { status: 400 }
      );
    }

    // ดึงรายการเอกสาร
    const documents = await prisma.resumeDepositDocument.findMany({
      where: { resumeDepositId },
      orderBy: { createdAt: 'desc' }
    });

    console.log('📄 Found documents:', documents.length);

    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      resumeDepositId: doc.resumeDepositId,
      documentType: doc.documentType,
      fileName: doc.fileName,
      filePath: doc.filePath,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      createdAt: doc.createdAt,
    }));

    console.log('✅ Returning documents:', formattedDocuments);

    return NextResponse.json({
      success: true,
      data: formattedDocuments
    });

  } catch (error) {
    console.error('Error fetching resume documents:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const resumeDepositId = formData.get('resumeDepositId') as string;
    const documentType = formData.get('documentType') as string;

    if (!file || !resumeDepositId || !documentType) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุไฟล์, resumeDepositId และ documentType' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ต้องไม่เกิน 10MB' },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'รองรับเฉพาะไฟล์ PDF, JPG, JPEG, PNG เท่านั้น' },
        { status: 400 }
      );
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${resumeDepositId}-${documentType}-${timestamp}.${fileExtension}`;
    
    // สร้างโฟลเดอร์ถ้ายังไม่มี
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resume-documents');
    await mkdir(uploadDir, { recursive: true });

    // บันทึกไฟล์
    const filePath = join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // บันทึกข้อมูลในฐานข้อมูล
    const document = await prisma.resumeDepositDocument.create({
      data: {
        resumeDepositId,
        documentType,
        fileName: file.name,
        filePath: `/uploads/resume-documents/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดไฟล์เรียบร้อยแล้ว',
      data: {
        id: document.id,
        fileName: document.fileName,
        filePath: document.filePath,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
      }
    });

  } catch (error) {
    console.error('Error uploading resume document:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeDepositId, documentType } = body;

    if (!resumeDepositId || !documentType) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ resumeDepositId และ documentType' },
        { status: 400 }
      );
    }

    // ลบเอกสารตาม documentType
    const deletedDocument = await prisma.resumeDepositDocument.deleteMany({
      where: {
        resumeDepositId: resumeDepositId,
        documentType: documentType
      }
    });

    return NextResponse.json({
      success: true,
      message: 'ลบเอกสารเรียบร้อยแล้ว',
      deletedCount: deletedDocument.count
    });

  } catch (error) {
    console.error('Error deleting resume document:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบเอกสาร' },
      { status: 500 }
    );
  }
}