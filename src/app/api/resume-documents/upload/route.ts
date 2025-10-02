import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const resumeDepositId = (formData.get('resumeDepositId') as string) || (formData.get('applicationId') as string);
    const rawDocumentType = formData.get('documentType') as string;
    const file = formData.get('file') as File;

    const documentType = (rawDocumentType || '').trim();

    if (!resumeDepositId || !documentType || !file) {
      return NextResponse.json(
        { success: false, message: `ข้อมูลไม่ครบถ้วน (resumeDepositId, documentType, file)` },
        { status: 400 }
      );
    }

    const allowedMimeTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif'
    ]);

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { success: false, message: 'รองรับเฉพาะไฟล์ PDF หรือรูปภาพ (JPG, PNG, GIF)' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ต้องไม่เกิน 10MB' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี resume_deposit_id จริงหรือไม่
    const resumeDeposit = await prisma.resumeDeposit.findUnique({
      where: { id: resumeDepositId }
    });

    if (!resumeDeposit) {
      return NextResponse.json(
        { success: false, message: `ไม่พบ resume_deposit_id: ${resumeDepositId}` },
        { status: 400 }
      );
    }

    // เตรียมโฟลเดอร์ปลายทาง
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resume-documents');
    await mkdir(uploadDir, { recursive: true });

    // ตั้งชื่อไฟล์ตามต้นฉบับ (คงชื่อเดิม) โดยเติม timestamp นำหน้า กันชื่อซ้ำ
    const timestamp = Date.now();
    const originalName = ((file as any).name as string | undefined) || 'upload';
    // sanitize เบื้องต้น: ตัด path และอักขระแปลก ๆ ออก
    const baseOriginal = path.basename(originalName).replace(/[^\w\-\.ก-๙\s]/g, '');
    const hasExt = baseOriginal.includes('.');
    const mimeToExt: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
    };
    const fallbackExt = mimeToExt[file.type] || '';
    const finalName = `${timestamp}_${baseOriginal}${hasExt ? '' : fallbackExt}`;

    const filePath = path.join(uploadDir, finalName);

    // เขียนไฟล์ลงดิสก์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // บันทึกข้อมูลลงฐานข้อมูล
    const document = await prisma.resumeDepositDocument.create({
      data: {
        resumeDepositId,
        documentType,
        fileName: finalName,
        filePath: `/uploads/resume-documents/${finalName}`,
        fileSize: file.size,
        mimeType: file.type
      }
    });

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดเอกสารเรียบร้อยแล้ว',
      data: {
        id: document.id,
        fileName: document.fileName,
        filePath: document.filePath,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        documentType
      }
    });

  } catch (error: any) {
    console.error('Error uploading resume document:', error);
    const message = error?.message || 'เกิดข้อผิดพลาดในการอัปโหลดเอกสาร';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
