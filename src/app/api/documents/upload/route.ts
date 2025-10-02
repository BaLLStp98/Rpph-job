import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const personalInfoId = (formData.get('personalInfoId') as string) || (formData.get('applicationId') as string);
    const rawDocumentType = formData.get('documentType') as string;
    const file = formData.get('file') as File;

    const documentType = (rawDocumentType || '').trim();

    if (!personalInfoId || !documentType || !file) {
      return NextResponse.json(
        { success: false, message: `ข้อมูลไม่ครบถ้วน (application_id, documentType, file)` },
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

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(
        { success: false, message: 'ไม่ได้ตั้งค่าตัวแปร DATABASE_URL ในสภาพแวดล้อม' },
        { status: 500 }
      );
    }

    const connection = await mysql.createConnection(databaseUrl);

    // ตรวจสอบว่ามี application_id จริงหรือไม่ (ตรวจสอบทั้ง application_forms และ resume_deposits)
    const [appRows] = await connection.execute('SELECT 1 FROM application_forms WHERE id = ? LIMIT 1', [personalInfoId]);
    const [resumeRows] = await connection.execute('SELECT 1 FROM resume_deposits WHERE id = ? LIMIT 1', [personalInfoId]);
    
    if ((appRows as any[]).length === 0 && (resumeRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: `ไม่พบ application_id: ${personalInfoId}` },
        { status: 400 }
      );
    }

    // เตรียมโฟลเดอร์ปลายทาง
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
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

    await connection.execute(
      `INSERT INTO application_documents 
       (application_id, document_type, file_name, file_path, file_size, mime_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [personalInfoId, documentType, finalName, `/uploads/documents/${finalName}`, file.size, file.type]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดเอกสารเรียบร้อยแล้ว',
      data: {
        fileName: finalName,
        filePath: `/uploads/documents/${finalName}`,
        fileSize: file.size,
        mimeType: file.type,
        documentType
      }
    });

  } catch (error: any) {
    console.error('Error uploading document:', error);
    const message = error?.message || 'เกิดข้อผิดพลาดในการอัปโหลดเอกสาร';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
} 